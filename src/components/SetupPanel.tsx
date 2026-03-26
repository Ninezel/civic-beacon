import { useState } from 'react'
import { SetupTutorial } from './SetupTutorial'
import type { AppSetup, LocationProfile } from '../types'

interface SetupPanelProps {
  setup: AppSetup
  onAddCoverage: (input: {
    name: string
    region: string
    country: string
    aliases: string[]
    locationCodes: string[]
    latitude: number
    longitude: number
    briefingUrl: string
  }) => void
  onRemoveCoverage: (profileId: string) => void
  onRefreshNow: () => void
  onTestSound: () => void
  onUpdateSettings: (
    next: Partial<Pick<AppSetup, 'pollingIntervalSeconds' | 'soundEnabled' | 'soundVolume' | 'unitSystem'>>,
  ) => void
}

const initialFormState = {
  name: '',
  region: '',
  country: '',
  aliases: '',
  locationCodes: '',
  latitude: '',
  longitude: '',
  briefingUrl: '',
}

function splitCsv(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

export function SetupPanel({
  setup,
  onAddCoverage,
  onRemoveCoverage,
  onRefreshNow,
  onTestSound,
  onUpdateSettings,
}: SetupPanelProps) {
  const [formState, setFormState] = useState(initialFormState)

  function updateField(field: keyof typeof initialFormState, value: string) {
    setFormState((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    onAddCoverage({
      name: formState.name.trim(),
      region: formState.region.trim(),
      country: formState.country.trim(),
      aliases: splitCsv(formState.aliases),
      locationCodes: splitCsv(formState.locationCodes),
      latitude: Number(formState.latitude),
      longitude: Number(formState.longitude),
      briefingUrl: formState.briefingUrl.trim(),
    })

    setFormState(initialFormState)
  }

  return (
    <section id="setup" className="panel setup-panel">
      <div className="panel-heading">
        <div>
          <div className="section-label">Live Alert Setup</div>
          <h2>Connect real coverage feeds and alert sounds</h2>
        </div>
        <button className="primary-button" type="button" onClick={onRefreshNow}>
          Refresh feeds now
        </button>
      </div>

      <p className="panel-copy">
        Each coverage area should point to a JSON briefing endpoint that returns normalized weather,
        hazard, news, source-health, and readiness data. If your source does not support browser
        access, place a small proxy or adapter in front of it.
      </p>

      <SetupTutorial />

      <div className="setup-grid">
        <form className="setup-form" onSubmit={handleSubmit}>
          <div className="setup-field-grid">
            <label className="setup-field">
              <span>Coverage name</span>
              <input value={formState.name} onChange={(event) => updateField('name', event.target.value)} required />
            </label>
            <label className="setup-field">
              <span>Region / state</span>
              <input value={formState.region} onChange={(event) => updateField('region', event.target.value)} required />
            </label>
            <label className="setup-field">
              <span>Country</span>
              <input value={formState.country} onChange={(event) => updateField('country', event.target.value)} required />
            </label>
            <label className="setup-field">
              <span>Location codes</span>
              <input
                value={formState.locationCodes}
                onChange={(event) => updateField('locationCodes', event.target.value)}
                placeholder="SW1A 1AA, EC4M 7RF"
                required
              />
            </label>
            <label className="setup-field">
              <span>Aliases / address hints</span>
              <input
                value={formState.aliases}
                onChange={(event) => updateField('aliases', event.target.value)}
                placeholder="Westminster, South Bank"
              />
            </label>
            <label className="setup-field">
              <span>Latitude</span>
              <input value={formState.latitude} onChange={(event) => updateField('latitude', event.target.value)} type="number" step="0.0001" required />
            </label>
            <label className="setup-field">
              <span>Longitude</span>
              <input value={formState.longitude} onChange={(event) => updateField('longitude', event.target.value)} type="number" step="0.0001" required />
            </label>
            <label className="setup-field setup-field-wide">
              <span>Briefing feed URL</span>
              <input
                value={formState.briefingUrl}
                onChange={(event) => updateField('briefingUrl', event.target.value)}
                placeholder="/api/alerts/london or https://alerts.example.com/api/london.json"
                required
              />
            </label>
          </div>

          <button className="primary-button" type="submit">
            Add coverage area
          </button>
        </form>

        <aside className="setup-side">
          <div className="settings-card">
            <div className="section-label">Polling And Sound</div>
            <div className="settings-stack">
              <label className="setup-field">
                <span>Display units</span>
                <select
                  value={setup.unitSystem}
                  onChange={(event) =>
                    onUpdateSettings({
                      unitSystem: event.target.value as AppSetup['unitSystem'],
                    })
                  }
                >
                  <option value="metric">Metric</option>
                  <option value="imperial">Imperial</option>
                </select>
              </label>

              <label className="setup-field">
                <span>Polling interval in seconds</span>
                <input
                  type="number"
                  min="30"
                  value={setup.pollingIntervalSeconds}
                  onChange={(event) =>
                    onUpdateSettings({
                      pollingIntervalSeconds: Number(event.target.value) || 120,
                    })
                  }
                />
              </label>

              <label className="toggle-field">
                <input
                  checked={setup.soundEnabled}
                  onChange={(event) => onUpdateSettings({ soundEnabled: event.target.checked })}
                  type="checkbox"
                />
                <span>Play a sound when new live alerts arrive</span>
              </label>

              <label className="setup-field">
                <span>Alert sound volume</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={setup.soundVolume}
                  onChange={(event) =>
                    onUpdateSettings({
                      soundVolume: Number(event.target.value),
                    })
                  }
                />
              </label>

              <button className="ghost-button" type="button" onClick={onTestSound}>
                Test alert sound
              </button>
            </div>
          </div>

          <div className="settings-card">
            <div id="setup-feed-schema" className="section-label">Feed Schema Essentials</div>
            <div className="tutorial-schema-card">
              <h3>Minimum JSON response</h3>
              <p className="panel-copy">
                Every live feed should return `outlook` and `weather` at minimum. Hazard, news,
                source, and action arrays are optional but recommended.
              </p>
              <pre className="tutorial-schema-snippet">
{`{
  "outlook": "Heavy rain remains the main concern.",
  "weather": {
    "temperatureC": 7,
    "condition": "Heavy rain bands",
    "windKph": 38,
    "rainChance": 92,
    "advisory": "Flash flooding is possible on low roads."
  }
}`}
              </pre>
            </div>
          </div>

          <div className="settings-card">
            <div className="section-label">Configured Coverage Areas</div>
            <div className="setup-list">
              {setup.coverageProfiles.length > 0 ? (
                setup.coverageProfiles.map((profile: LocationProfile) => (
                  <article key={profile.id} className="setup-list-item">
                    <div>
                      <strong>{profile.name}</strong>
                      <p>{profile.region} · {profile.country}</p>
                      <p>{profile.briefingUrl}</p>
                    </div>
                    <button className="ghost-button" type="button" onClick={() => onRemoveCoverage(profile.id)}>
                      Remove
                    </button>
                  </article>
                ))
              ) : (
                <div className="setup-empty">No coverage feeds configured yet.</div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
