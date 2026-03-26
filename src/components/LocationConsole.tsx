import type { LocationProfile, LocationSuggestion, SelectedLocation } from '../types'

interface LocationConsoleProps {
  coverageProfiles: LocationProfile[]
  query: string
  suggestions: LocationSuggestion[]
  statusMessage: string
  selectedLocation: SelectedLocation
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
  onQueryChange,
  onSearch,
  onCoverageSelect,
  onSuggestionSelect,
}: LocationConsoleProps) {
  return (
    <section id="coverage" className="panel control-panel">
      <div className="section-label">Coverage Search</div>
      <h2>Search a coverage area or choose one from the directory.</h2>
      <p className="panel-copy">
        Search stays local to the browser in this baseline build. Try a postcode, ZIP code, city,
        district, neighborhood, or address hint.
      </p>

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
          ) : null}
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
          value={selectedLocation.profile.id}
          onChange={(event) => onCoverageSelect(event.target.value)}
        >
          {coverageProfiles.map((profile) => (
            <option key={profile.id} value={profile.id}>
              {profile.name} · {profile.region}
            </option>
          ))}
        </select>
      </div>

      <div className="status-strip">
        <span className="status-chip status-open-source">No login in OSS core</span>
        <span className="status-chip status-light">Autocomplete directory</span>
        <span className="status-chip status-light">Weather + alerts + public safety</span>
      </div>
      <div className="status-note">
        <span className="status-note-label">Coverage Match</span>
        <strong>{selectedLocation.confidenceLabel}</strong>
      </div>

      <p className="status-message">{statusMessage}</p>
      <div className="selected-brief">
        <strong>{selectedLocation.label}</strong>
        <span>{selectedLocation.profile.outlook}</span>
      </div>
    </section>
  )
}
