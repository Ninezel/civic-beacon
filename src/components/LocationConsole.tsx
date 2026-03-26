import type { LocationProfile, LocationSuggestion, SelectedLocation } from '../types'

interface LocationConsoleProps {
  coverageProfiles: LocationProfile[]
  query: string
  suggestions: LocationSuggestion[]
  statusMessage: string
  selectedLocation: SelectedLocation | null
  isRefreshing: boolean
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

export function LocationConsole({
  coverageProfiles,
  query,
  suggestions,
  statusMessage,
  selectedLocation,
  isRefreshing,
  onQueryChange,
  onSearch,
  onCoverageSelect,
  onSuggestionSelect,
}: LocationConsoleProps) {
  const hasCoverage = coverageProfiles.length > 0
  const activeStatus = isRefreshing
    ? 'Syncing live feeds'
    : selectedLocation?.profile.fetchStatus === 'error'
      ? 'Feed issue'
      : selectedLocation?.profile.fetchStatus === 'live'
        ? 'Live feed'
        : 'Awaiting sync'

  return (
    <section id="coverage" className="panel control-panel">
      <div className="section-label">Coverage Search</div>
      <h2>
        {hasCoverage
          ? 'Search a coverage area or choose one from the directory.'
          : 'Set up a coverage feed to unlock local monitoring.'}
      </h2>
      <p className="panel-copy">
        {hasCoverage
          ? 'Search stays local to the browser in the open-source core. Try a postcode, ZIP code, city, district, neighborhood, or address hint.'
          : 'Emergency Centre no longer ships with baked-in sample alerts. Add your own trusted feed in the setup section, then search configured coverage areas here.'}
      </p>

      {hasCoverage ? (
        <>
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

          <div className="directory-row">
            <label className="directory-label" htmlFor="coverage-directory">
              Coverage directory
            </label>
            <select
              id="coverage-directory"
              className="coverage-select"
              value={selectedLocation?.profile.id ?? ''}
              onChange={(event) => onCoverageSelect(event.target.value)}
            >
              {coverageProfiles.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.name} · {profile.region}
                </option>
              ))}
            </select>
          </div>
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
        <span className="status-chip status-light">Weather + alerts + public safety</span>
      </div>

      <div className="status-note">
        <span className="status-note-label">Coverage Match</span>
        <strong>
          {selectedLocation ? selectedLocation.confidenceLabel : 'No active coverage selection yet.'}
        </strong>
      </div>

      {selectedLocation?.profile.fetchError ? (
        <div className="status-note status-note-error">
          <span className="status-note-label">Feed issue</span>
          <strong>{selectedLocation.profile.fetchError}</strong>
        </div>
      ) : null}

      <p className="status-message">{statusMessage}</p>
      <div className="selected-brief">
        <strong>{selectedLocation?.label ?? 'Waiting for a configured coverage feed'}</strong>
        <span>
          {selectedLocation?.profile.outlook ??
            'Once a live briefing feed is connected, the current outlook will appear here.'}
        </span>
      </div>
    </section>
  )
}
