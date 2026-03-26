import { useState } from 'react'
import { buildLocationBriefing } from './lib/briefing'
import {
  createDirectorySelection,
  createSearchSelection,
  findBestSuggestion,
  findProfileById,
  getLocationSuggestions,
} from './lib/location'
import { AlertFeed } from './components/AlertFeed'
import { LocationConsole } from './components/LocationConsole'
import { OpenSourcePanel } from './components/OpenSourcePanel'
import { OverviewPanel } from './components/OverviewPanel'
import { SituationPanels } from './components/SituationPanels'
import { mockProvider } from './providers/mockProvider'

function App() {
  const coverageProfiles = mockProvider.getCoverageProfiles()
  const defaultProfile = mockProvider.getDefaultProfile()

  const [query, setQuery] = useState('')
  const [selectedLocation, setSelectedLocation] = useState(() =>
    createDirectorySelection(defaultProfile),
  )
  const [statusMessage, setStatusMessage] = useState(
    'Search by postcode, ZIP code, address hint, neighborhood, city, or choose a coverage area from the directory.',
  )

  const briefing = buildLocationBriefing(selectedLocation)
  const suggestions = getLocationSuggestions(coverageProfiles, query)

  function handleSearch() {
    if (!query.trim()) {
      setStatusMessage('Enter a location code, city, district, or address hint to search coverage areas.')
      return
    }

    const nextSuggestion = findBestSuggestion(coverageProfiles, query)

    if (!nextSuggestion) {
      setStatusMessage(`No coverage area matched "${query}". Try a place name, location code, or region.`)
      return
    }

    const nextSelection = createSearchSelection(nextSuggestion.profile, nextSuggestion.matchedText, 'search')
    setSelectedLocation(nextSelection)
    setQuery(nextSuggestion.matchedText)
    setStatusMessage(`Coverage updated for ${nextSelection.profile.name}.`)
  }

  function handleSuggestionSelect(suggestionId: string) {
    const nextSuggestion = suggestions.find((suggestion) => suggestion.id === suggestionId)

    if (!nextSuggestion) {
      return
    }

    const nextSelection = createSearchSelection(
      nextSuggestion.profile,
      nextSuggestion.matchedText,
      'suggestion',
    )
    setSelectedLocation(nextSelection)
    setQuery(nextSuggestion.matchedText)
    setStatusMessage(`Coverage updated for ${nextSelection.profile.name}.`)
  }

  function handleCoverageSelect(profileId: string) {
    const profile = findProfileById(coverageProfiles, profileId)

    if (!profile) {
      return
    }

    const nextSelection = createDirectorySelection(profile)
    setSelectedLocation(nextSelection)
    setQuery(profile.name)
    setStatusMessage(`Coverage updated for ${profile.name}.`)
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top">
          <span className="brand-mark">EC</span>
          <span>
            <strong>Emergency Centre</strong>
            <small>Open-source public hazard briefing</small>
          </span>
        </a>

        <nav className="nav">
          <a href="#coverage">Coverage</a>
          <a href="#signals">Signals</a>
          <a href="#open-source">Open source</a>
        </nav>

        <a className="topbar-link" href="https://ko-fi.com/ninezel" target="_blank" rel="noreferrer">
          Support on Ko-Fi
        </a>
      </header>

      <main id="top" className="page-layout">
        <section className="hero-grid">
          <OverviewPanel briefing={briefing} />
          <LocationConsole
            coverageProfiles={coverageProfiles}
            query={query}
            suggestions={suggestions}
            statusMessage={statusMessage}
            selectedLocation={selectedLocation}
            onQueryChange={setQuery}
            onSearch={handleSearch}
            onCoverageSelect={handleCoverageSelect}
            onSuggestionSelect={handleSuggestionSelect}
          />
        </section>

        <section id="signals" className="page-section content-grid">
          <AlertFeed hazardFeed={briefing.hazardFeed} />
          <SituationPanels briefing={briefing} />
        </section>

        <section id="open-source" className="page-section">
          <OpenSourcePanel />
        </section>
      </main>
    </div>
  )
}

export default App
