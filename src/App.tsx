import { useDeferredValue, useEffect, useEffectEvent, useRef, useState } from 'react'
import { AlertFeed } from './components/AlertFeed'
import { LocationConsole } from './components/LocationConsole'
import { OpenSourcePanel } from './components/OpenSourcePanel'
import { OverviewPanel } from './components/OverviewPanel'
import { SetupPanel } from './components/SetupPanel'
import { SituationPanels } from './components/SituationPanels'
import { countNewLiveAlerts, summarizeSyncResult } from './lib/alertSync'
import { playAlertTone } from './lib/audio'
import { buildLocationBriefing } from './lib/briefing'
import { fetchLiveBriefing } from './lib/feed'
import {
  createDirectorySelection,
  createSearchSelection,
  findBestSuggestion,
  findProfileById,
  getLocationSuggestions,
} from './lib/location'
import {
  createEmptyProfile,
  markProfileFetchError,
  markProfileSyncing,
  mergeLiveBriefing,
  readAppSetup,
  writeAppSetup,
} from './lib/setup'
import type { AppSetup, LocationMode, LocationProfile, SelectedLocation } from './types'

interface SelectionState {
  profileId: string | null
  mode: LocationMode
  matchedText: string
}

const initialSetup = readAppSetup()
const initialProfile = initialSetup.coverageProfiles[0] ?? null

function createInitialSelection(profile: LocationProfile | null): SelectionState {
  if (!profile) {
    return {
      profileId: null,
      mode: 'directory',
      matchedText: '',
    }
  }

  return {
    profileId: profile.id,
    mode: 'directory',
    matchedText: profile.name,
  }
}

function createInitialStatusMessage(profileCount: number) {
  return profileCount > 0
    ? 'Search by postcode, ZIP code, address hint, neighborhood, city, or choose a coverage area from the directory.'
    : 'Add at least one live coverage feed below to start monitoring actual alerts.'
}

function buildSelectedLocation(profile: LocationProfile | null, selection: SelectionState): SelectedLocation | null {
  if (!profile) {
    return null
  }

  if (selection.mode === 'directory') {
    return createDirectorySelection(profile)
  }

  return createSearchSelection(profile, selection.matchedText || profile.name, selection.mode)
}

function resolveBriefingUrl(value: string) {
  try {
    return new URL(value, window.location.origin).toString()
  } catch {
    return null
  }
}

function App() {
  const [setup, setSetup] = useState<AppSetup>(() => initialSetup)
  const [selection, setSelection] = useState<SelectionState>(() => createInitialSelection(initialProfile))
  const [query, setQuery] = useState(initialProfile?.name ?? '')
  const deferredQuery = useDeferredValue(query)
  const [statusMessage, setStatusMessage] = useState(() =>
    createInitialStatusMessage(initialSetup.coverageProfiles.length),
  )
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [hasCompletedInitialSync, setHasCompletedInitialSync] = useState(false)
  const refreshInFlight = useRef(false)

  const coverageProfiles = setup.coverageProfiles
  const selectedProfile =
    (selection.profileId ? findProfileById(coverageProfiles, selection.profileId) : null) ??
    coverageProfiles[0] ??
    null
  const selectedLocation = buildSelectedLocation(selectedProfile, selection)
  const briefing = selectedLocation ? buildLocationBriefing(selectedLocation) : null
  const suggestions = getLocationSuggestions(coverageProfiles, deferredQuery)

  useEffect(() => {
    writeAppSetup(setup)
  }, [setup])

  useEffect(() => {
    if (coverageProfiles.length === 0) {
      if (selection.profileId !== null || query) {
        setSelection(createInitialSelection(null))
        setQuery('')
      }
      return
    }

    if (!selectedProfile) {
      const fallbackProfile = coverageProfiles[0]
      setSelection(createInitialSelection(fallbackProfile))
      setQuery(fallbackProfile.name)
    }
  }, [coverageProfiles, query, selectedProfile, selection.profileId])

  const refreshCoverageProfiles = useEffectEvent(async (reason: 'manual' | 'poll' | 'bootstrap') => {
    if (coverageProfiles.length === 0 || refreshInFlight.current) {
      return
    }

    const profilesToSync = coverageProfiles
    refreshInFlight.current = true
    setIsRefreshing(true)
    setSetup((current) => ({
      ...current,
      coverageProfiles: current.coverageProfiles.map((profile) =>
        profilesToSync.some((candidate) => candidate.id === profile.id) ? markProfileSyncing(profile) : profile,
      ),
    }))

    try {
      const syncedProfiles = await Promise.all(
        profilesToSync.map(async (profile) => {
          try {
            const liveBriefing = await fetchLiveBriefing(profile)
            return mergeLiveBriefing(profile, liveBriefing)
          } catch (error) {
            const message = error instanceof Error ? error.message : 'Feed sync failed.'
            return markProfileFetchError(profile, message)
          }
        }),
      )

      const updatedProfilesById = new Map(syncedProfiles.map((profile) => [profile.id, profile]))
      const newAlertCount = countNewLiveAlerts(profilesToSync, syncedProfiles)
      const syncSummary = summarizeSyncResult(syncedProfiles, hasCompletedInitialSync ? newAlertCount : 0)

      setSetup((current) => ({
        ...current,
        coverageProfiles: current.coverageProfiles.map(
          (profile) => updatedProfilesById.get(profile.id) ?? profile,
        ),
      }))
      setStatusMessage(syncSummary)

      if (hasCompletedInitialSync && newAlertCount > 0 && setup.soundEnabled) {
        try {
          await playAlertTone(setup.soundVolume)
        } catch {
          if (reason === 'manual') {
            setStatusMessage(
              `${syncSummary} New live alerts arrived, but the browser blocked audio playback until a user gesture enables it.`,
            )
          }
        }
      }

      setHasCompletedInitialSync(true)
    } finally {
      refreshInFlight.current = false
      setIsRefreshing(false)
    }
  })

  useEffect(() => {
    if (coverageProfiles.length === 0) {
      return
    }

    if (coverageProfiles.some((profile) => profile.fetchStatus === 'idle')) {
      void refreshCoverageProfiles('bootstrap')
    }
  }, [coverageProfiles, refreshCoverageProfiles])

  useEffect(() => {
    if (coverageProfiles.length === 0) {
      return
    }

    const intervalId = window.setInterval(() => {
      void refreshCoverageProfiles('poll')
    }, setup.pollingIntervalSeconds * 1000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [coverageProfiles.length, refreshCoverageProfiles, setup.pollingIntervalSeconds])

  function handleSearch() {
    if (coverageProfiles.length === 0) {
      setStatusMessage('Add a live coverage feed first, then search by code, city, address hint, or region.')
      return
    }

    if (!query.trim()) {
      setStatusMessage('Enter a location code, city, district, or address hint to search coverage areas.')
      return
    }

    const nextSuggestion = findBestSuggestion(coverageProfiles, query)

    if (!nextSuggestion) {
      setStatusMessage(`No coverage area matched "${query}". Try a place name, location code, or region.`)
      return
    }

    setSelection({
      profileId: nextSuggestion.profile.id,
      mode: 'search',
      matchedText: nextSuggestion.matchedText,
    })
    setQuery(nextSuggestion.matchedText)
    setStatusMessage(`Coverage updated for ${nextSuggestion.profile.name}.`)
  }

  function handleSuggestionSelect(suggestionId: string) {
    const nextSuggestion = suggestions.find((suggestion) => suggestion.id === suggestionId)

    if (!nextSuggestion) {
      return
    }

    setSelection({
      profileId: nextSuggestion.profile.id,
      mode: 'suggestion',
      matchedText: nextSuggestion.matchedText,
    })
    setQuery(nextSuggestion.matchedText)
    setStatusMessage(`Coverage updated for ${nextSuggestion.profile.name}.`)
  }

  function handleCoverageSelect(profileId: string) {
    const profile = findProfileById(coverageProfiles, profileId)

    if (!profile) {
      return
    }

    setSelection({
      profileId: profile.id,
      mode: 'directory',
      matchedText: profile.name,
    })
    setQuery(profile.name)
    setStatusMessage(`Coverage updated for ${profile.name}.`)
  }

  function handleAddCoverage(input: {
    name: string
    region: string
    country: string
    aliases: string[]
    locationCodes: string[]
    latitude: number
    longitude: number
    briefingUrl: string
  }) {
    const briefingUrl = resolveBriefingUrl(input.briefingUrl)

    if (
      !input.name ||
      !input.region ||
      !input.country ||
      input.locationCodes.length === 0 ||
      !Number.isFinite(input.latitude) ||
      !Number.isFinite(input.longitude) ||
      !briefingUrl
    ) {
      setStatusMessage('Coverage setup is incomplete. Check the coordinates, location codes, and feed URL.')
      return
    }

    const profile = createEmptyProfile({
      name: input.name,
      region: input.region,
      country: input.country,
      aliases: input.aliases,
      locationCodes: input.locationCodes,
      coordinates: {
        lat: input.latitude,
        lng: input.longitude,
      },
      briefingUrl,
    })

    setSetup((current) => ({
      ...current,
      coverageProfiles: [...current.coverageProfiles, profile],
    }))
    setSelection({
      profileId: profile.id,
      mode: 'directory',
      matchedText: profile.name,
    })
    setQuery(profile.name)
    setStatusMessage(`Coverage feed added for ${profile.name}. Running the first live sync now.`)
  }

  function handleRemoveCoverage(profileId: string) {
    const removedProfile = findProfileById(coverageProfiles, profileId)
    const nextProfiles = coverageProfiles.filter((profile) => profile.id !== profileId)

    setSetup((current) => ({
      ...current,
      coverageProfiles: nextProfiles,
    }))

    if (nextProfiles.length === 0) {
      setSelection(createInitialSelection(null))
      setQuery('')
      setStatusMessage('All coverage feeds were removed. Add a live feed to continue monitoring alerts.')
      return
    }

    if (selection.profileId === profileId) {
      const fallbackProfile = nextProfiles[0]
      setSelection(createInitialSelection(fallbackProfile))
      setQuery(fallbackProfile.name)
    }

    setStatusMessage(`Removed ${removedProfile?.name ?? 'the selected'} coverage feed.`)
  }

  function handleUpdateSettings(
    next: Partial<Pick<AppSetup, 'pollingIntervalSeconds' | 'soundEnabled' | 'soundVolume' | 'unitSystem'>>,
  ) {
    setSetup((current) => ({
      ...current,
      pollingIntervalSeconds: Math.max(
        30,
        Number(next.pollingIntervalSeconds ?? current.pollingIntervalSeconds) || current.pollingIntervalSeconds,
      ),
      soundEnabled: next.soundEnabled ?? current.soundEnabled,
      soundVolume:
        next.soundVolume === undefined
          ? current.soundVolume
          : Math.min(1, Math.max(0, Number(next.soundVolume))),
      unitSystem: next.unitSystem ?? current.unitSystem,
    }))
  }

  async function handleRefreshNow() {
    if (coverageProfiles.length === 0) {
      setStatusMessage('Add at least one live coverage feed before refreshing.')
      return
    }

    await refreshCoverageProfiles('manual')
  }

  async function handleTestSound() {
    try {
      await playAlertTone(setup.soundVolume)
      setStatusMessage('Alert sound test played.')
    } catch {
      setStatusMessage('The browser blocked audio playback. Click the page and try the sound test again.')
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top">
          <span className="brand-mark">EC</span>
          <span>
            <strong>Emergency Centre</strong>
            <small>Open-source live hazard monitoring</small>
          </span>
        </a>

        <nav className="nav">
          <a href="#coverage">Coverage</a>
          <a href="#setup">Setup</a>
          <a href="#signals">Signals</a>
          <a href="#open-source">Open source</a>
        </nav>

        <a className="topbar-link" href="https://ko-fi.com/ninezel" target="_blank" rel="noreferrer">
          Support on Ko-Fi
        </a>
      </header>

      <main id="top" className="page-layout">
        <section className="hero-grid">
          <OverviewPanel
            briefing={briefing}
            coverageCount={coverageProfiles.length}
            isRefreshing={isRefreshing}
            soundEnabled={setup.soundEnabled}
            unitSystem={setup.unitSystem}
          />
          <LocationConsole
            coverageProfiles={coverageProfiles}
            query={query}
            suggestions={suggestions}
            statusMessage={statusMessage}
            selectedLocation={selectedLocation}
            isRefreshing={isRefreshing}
            onQueryChange={setQuery}
            onSearch={handleSearch}
            onCoverageSelect={handleCoverageSelect}
            onSuggestionSelect={handleSuggestionSelect}
          />
        </section>

        <SetupPanel
          setup={setup}
          onAddCoverage={handleAddCoverage}
          onRemoveCoverage={handleRemoveCoverage}
          onRefreshNow={() => {
            void handleRefreshNow()
          }}
          onTestSound={() => {
            void handleTestSound()
          }}
          onUpdateSettings={handleUpdateSettings}
        />

        {briefing ? (
          <section id="signals" className="page-section content-grid">
            <AlertFeed hazardFeed={briefing.hazardFeed} />
            <SituationPanels briefing={briefing} unitSystem={setup.unitSystem} />
          </section>
        ) : (
          <section id="signals" className="page-section">
            <section className="panel">
              <div className="section-label">Signal Workspace</div>
              <h2>Live alerts appear once a coverage feed is configured.</h2>
              <p className="panel-copy">
                Add a real weather or public-alert feed in the setup section, then Emergency Centre
                will pull hazards, weather snapshots, public bulletins, and readiness actions into
                this workspace.
              </p>
            </section>
          </section>
        )}

        <section id="open-source" className="page-section">
          <OpenSourcePanel />
        </section>
      </main>
    </div>
  )
}

export default App
