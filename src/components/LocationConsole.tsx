import type { LocationProfile, LocationSuggestion, SelectedLocation } from '../types'

interface LocationConsoleProps {
  coverageProfiles: LocationProfile[]
  directoryCountries: string[]
  directoryRegions: string[]
  directoryProfiles: LocationProfile[]
  activeDirectoryCountry: string
  activeDirectoryRegion: string
  query: string
  suggestions: LocationSuggestion[]
  statusMessage: string
  selectedLocation: SelectedLocation | null
  isRefreshing: boolean
  onDirectoryCountryChange: (country: string) => void
  onDirectoryRegionChange: (region: string) => void
  onQueryChange: (nextValue: string) => void
  onSearch: () => void
  onCoverageSelect: (profileId: string) => void
  onSuggestionSelect: (suggestionId: string) => void
}

const matchKindLabel = {
  code: 'Code',
  alias: 'Area',
  place: 'Place',
  region: 'Region',
  country: 'Country',
}

function getQuickProfiles(directoryProfiles: LocationProfile[], selectedLocation: SelectedLocation | null) {
  const selectedProfile = selectedLocation?.profile
  const orderedProfiles = selectedProfile
    ? [selectedProfile, ...directoryProfiles.filter((profile) => profile.id !== selectedProfile.id)]
    : directoryProfiles

  return orderedProfiles.slice(0, 4)
}

function getQuickTerms(selectedLocation: SelectedLocation | null) {
  if (!selectedLocation) {
    return []
  }

  return [...new Set([...selectedLocation.profile.locationCodes.slice(0, 2), ...selectedLocation.profile.aliases.slice(0, 2)])]
}

function describeActiveStatus(selectedLocation: SelectedLocation | null, isRefreshing: boolean) {
  if (isRefreshing) {
    return 'Syncing live feeds'
  }

  if (selectedLocation?.profile.fetchStatus === 'error') {
    return 'Feed issue'
  }

  if (selectedLocation?.profile.freshness.status === 'stale') {
    return 'Stale snapshot'
  }

  if (selectedLocation?.profile.fetchStatus === 'live') {
    return 'Live feed'
  }

  return 'Awaiting sync'
}

export function LocationConsole({
  coverageProfiles,
  directoryCountries,
  directoryRegions,
  directoryProfiles,
  activeDirectoryCountry,
  activeDirectoryRegion,
  query,
  suggestions,
  statusMessage,
  selectedLocation,
  isRefreshing,
  onDirectoryCountryChange,
  onDirectoryRegionChange,
  onQueryChange,
  onSearch,
  onCoverageSelect,
  onSuggestionSelect,
}: LocationConsoleProps) {
  const hasCoverage = coverageProfiles.length > 0
  const activeStatus = describeActiveStatus(selectedLocation, isRefreshing)
  const quickProfiles = getQuickProfiles(directoryProfiles, selectedLocation)
  const quickTerms = getQuickTerms(selectedLocation)
  const selectedProfile = selectedLocation?.profile ?? null

  return (
    <section id="coverage" className="panel control-panel">
      <div className="section-label">Coverage Search</div>
      <div className="control-panel-heading">
        <div>
          <h2>
            {hasCoverage
              ? 'Search a monitoring area or browse by country, region, and coverage area.'
              : 'Set up a coverage feed to unlock multi-signal monitoring.'}
          </h2>
          <p className="panel-copy">
            {hasCoverage
              ? 'Search stays local to the browser in the open-source core. Try a postcode, ZIP code, city, district, neighborhood, or address hint, or step through the directory filters below.'
              : 'Emergency Centre does not ship with baked-in sample feeds. Add your own trusted monitoring feed in the setup section, then search configured coverage areas here.'}
          </p>
        </div>
        {hasCoverage ? (
          <div className="console-stat-strip">
            <article className="console-stat">
              <span>Configured feeds</span>
              <strong>{coverageProfiles.length}</strong>
            </article>
            <article className="console-stat">
              <span>Countries</span>
              <strong>{directoryCountries.length || 1}</strong>
            </article>
            <article className="console-stat">
              <span>Visible areas</span>
              <strong>{directoryProfiles.length}</strong>
            </article>
          </div>
        ) : null}
      </div>

      {hasCoverage ? (
        <>
          <div className="search-shell">
            <div className="search-shell-head">
              <div>
                <span className="overview-ribbon-label">Search workspace</span>
                <p className="search-shell-copy">
                  Search by code, alias, district, or area name, then jump into the matching coverage feed.
                </p>
              </div>
              <span className={`status-chip status-sync-${selectedLocation?.profile.fetchStatus ?? 'idle'}`}>
                {activeStatus}
              </span>
            </div>

            <div className="search-row">
              <div className="search-stack">
                <input
                  className="search-input"
                  type="text"
                  value={query}
                  placeholder="Try SW1A 1AA, 94103, Cardiff Bay, Mission District, or Tokyo"
                  onChange={(event) => onQueryChange(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      onSearch()
                    }
                  }}
                />

                {query.trim().length > 1 ? (
                  <div className="suggestion-list" role="listbox" aria-label="Coverage search suggestions">
                    {suggestions.length > 0 ? (
                      suggestions.map((suggestion) => (
                        <button
                          key={suggestion.id}
                          className="suggestion-item"
                          type="button"
                          onClick={() => onSuggestionSelect(suggestion.id)}
                        >
                          <span className="suggestion-copy">
                            <strong>{suggestion.primaryLabel}</strong>
                            <span>{suggestion.secondaryLabel}</span>
                          </span>
                          <span className="suggestion-match">
                            {matchKindLabel[suggestion.matchKind]} · {suggestion.matchedText}
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="suggestion-empty">No coverage matches found yet.</div>
                    )}
                  </div>
                ) : (
                  <div className="suggestion-empty">
                    Start typing to match configured location codes, aliases, towns, or regions.
                  </div>
                )}
              </div>

              <button className="primary-button" onClick={onSearch}>
                Search
              </button>
            </div>

            {selectedProfile ? (
              <div className="search-active-brief">
                <span className="status-note-label">Active area</span>
                <strong>{selectedProfile.name}</strong>
                <p>
                  {selectedProfile.region} · {selectedProfile.country} · {selectedProfile.locationCodes.slice(0, 3).join(' · ')}
                </p>
              </div>
            ) : null}

            <div className="console-quick-rows">
              <div className="console-quick-row">
                <span className="overview-ribbon-label">Quick areas</span>
                <div className="chip-row">
                  {quickProfiles.map((profile) => (
                    <button
                      key={profile.id}
                      type="button"
                      className={`filter-chip ${selectedProfile?.id === profile.id ? 'filter-chip-active' : ''}`}
                      onClick={() => onCoverageSelect(profile.id)}
                    >
                      {profile.name}
                    </button>
                  ))}
                </div>
              </div>

              {quickTerms.length > 0 ? (
                <div className="console-quick-row">
                  <span className="overview-ribbon-label">Quick terms</span>
                  <div className="chip-row">
                    {quickTerms.map((term) => (
                      <button
                        key={term}
                        type="button"
                        className={`filter-chip ${query.trim().toLowerCase() === term.toLowerCase() ? 'filter-chip-active' : ''}`}
                        onClick={() => onQueryChange(term)}
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="directory-shell">
            <div className="directory-shell-head">
              <div>
                <span className="overview-ribbon-label">Directory filters</span>
                <p className="directory-shell-copy">
                  Step through the configured workspace by country, region, and exact saved area.
                </p>
              </div>
              <span className="panel-heading-badge">
                {directoryProfiles.length} visible
              </span>
            </div>

            <div className="directory-grid">
              <div className="directory-row">
                <label className="directory-label" htmlFor="coverage-country">
                  Country
                </label>
                <select
                  id="coverage-country"
                  className="coverage-select"
                  value={activeDirectoryCountry}
                  onChange={(event) => onDirectoryCountryChange(event.target.value)}
                >
                  <option value="">All configured countries</option>
                  {directoryCountries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              <div className="directory-row">
                <label className="directory-label" htmlFor="coverage-region">
                  Region / state
                </label>
                <select
                  id="coverage-region"
                  className="coverage-select"
                  value={activeDirectoryRegion}
                  onChange={(event) => onDirectoryRegionChange(event.target.value)}
                  disabled={!activeDirectoryCountry}
                >
                  <option value="">All configured regions</option>
                  {directoryRegions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>

              <div className="directory-row directory-row-wide">
                <label className="directory-label" htmlFor="coverage-directory">
                  Coverage directory
                </label>
                <select
                  id="coverage-directory"
                  className="coverage-select"
                  value={
                    directoryProfiles.some((profile) => profile.id === selectedLocation?.profile.id)
                      ? (selectedLocation?.profile.id ?? '')
                      : ''
                  }
                  onChange={(event) => onCoverageSelect(event.target.value)}
                >
                  <option value="">Choose configured coverage area</option>
                  {directoryProfiles.map((profile) => (
                    <option key={profile.id} value={profile.id}>
                      {profile.name} · {profile.region}
                    </option>
                  ))}
                </select>
              </div>

              <div className="directory-actions">
                <button
                  className="ghost-button"
                  type="button"
                  onClick={() => {
                    onDirectoryCountryChange('')
                    onDirectoryRegionChange('')
                  }}
                >
                  Clear filters
                </button>
                <span className="directory-actions-copy">
                  {directoryProfiles.length} visible coverage area{directoryProfiles.length === 1 ? '' : 's'}
                </span>
              </div>
            </div>
          </div>

          {directoryProfiles.length === 0 ? (
            <div className="suggestion-empty">
              No configured coverage feeds match the selected country and region yet.
            </div>
          ) : null}
        </>
      ) : (
        <div className="empty-console">
          <div className="status-note">
            <span className="status-note-label">Coverage setup</span>
            <strong>Add a feed URL, coordinates, and location codes below.</strong>
          </div>
          <a className="support-link" href="#setup">
            Open setup section
          </a>
        </div>
      )}

      <div className="status-strip">
        <span className="status-chip status-open-source">No login in OSS core</span>
        <span className={`status-chip status-sync-${selectedLocation?.profile.fetchStatus ?? 'idle'}`}>
          {activeStatus}
        </span>
        <span className="status-chip status-light">Weather + civic + transport + airspace</span>
      </div>

      <div className="console-status-grid">
        <div className="status-note">
          <span className="status-note-label">Coverage match</span>
          <strong>
            {selectedLocation ? selectedLocation.confidenceLabel : 'No active coverage selection yet.'}
          </strong>
        </div>

        {selectedLocation?.profile.fetchStatus === 'live' ? (
          <div
            className={`status-note ${
              selectedLocation.profile.freshness.status === 'stale' ? 'status-note-error' : ''
            }`}
          >
            <span className="status-note-label">Snapshot state</span>
            <strong>{selectedLocation.profile.freshness.message}</strong>
          </div>
        ) : null}

        {selectedLocation?.profile.fetchError ? (
          <div className="status-note status-note-error">
            <span className="status-note-label">Feed issue</span>
            <strong>{selectedLocation.profile.fetchError}</strong>
          </div>
        ) : null}
      </div>

      <p className="status-message">{statusMessage}</p>
      <div className="selected-brief selected-coverage-card">
        <div className="selected-coverage-head">
          <div>
            <span className="status-note-label">Selected coverage</span>
            <strong>{selectedLocation?.label ?? 'Waiting for a configured coverage feed'}</strong>
          </div>
          {selectedProfile ? (
            <span className="status-chip status-light">
              {selectedProfile.signals.length} active signal{selectedProfile.signals.length === 1 ? '' : 's'}
            </span>
          ) : null}
        </div>

        {selectedProfile ? (
          <div className="selected-coverage-grid">
            <div>
              <span className="status-note-label">Codes</span>
              <p>{selectedProfile.locationCodes.join(' · ')}</p>
            </div>
            <div>
              <span className="status-note-label">Source health</span>
              <p>
                {selectedProfile.sources.filter((source) => source.status === 'Healthy').length}/
                {selectedProfile.sources.length} healthy
              </p>
            </div>
          </div>
        ) : null}

        <span>
          {selectedLocation?.profile.outlook ??
            'Once a live briefing feed is connected, the current multi-signal outlook will appear here.'}
        </span>
      </div>
    </section>
  )
}
