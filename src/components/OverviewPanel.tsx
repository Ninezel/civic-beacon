import type { LocationBriefing } from '../types'

interface OverviewPanelProps {
  briefing: LocationBriefing
}

const modeLabel = {
  directory: 'Coverage directory',
  search: 'Coverage search',
  suggestion: 'Autocomplete match',
}

export function OverviewPanel({ briefing }: OverviewPanelProps) {
  return (
    <section className="panel overview-panel">
      <div className="section-label">Emergency Centre</div>
      <div className="overview-hero">
        <div>
          <h1>Monitor local emergency coverage fast.</h1>
          <p className="lead-copy">{briefing.headline}</p>
        </div>

        <aside className="overview-spotlight">
          <span className="status-chip status-accent">Live public briefing</span>
          <strong>{briefing.selectedLocation.label}</strong>
          <p>
            {briefing.selectedLocation.profile.region} · {briefing.selectedLocation.profile.country}
          </p>
          <p>{briefing.selectedLocation.profile.locationCodes.join(' · ')}</p>
          <p className="spotlight-outlook">{briefing.selectedLocation.profile.outlook}</p>
        </aside>
      </div>

      <div className="overview-ribbon">
        <span className="overview-ribbon-label">Current mode</span>
        <strong>{modeLabel[briefing.selectedLocation.mode]}</strong>
        <span>{briefing.metrics.sourceConfidence}</span>
      </div>

      <div className="metric-grid">
        <article className="metric-card">
          <span>Active signals</span>
          <strong>{briefing.metrics.activeSignals}</strong>
        </article>
        <article className="metric-card">
          <span>Critical signals</span>
          <strong>{briefing.metrics.criticalSignals}</strong>
        </article>
        <article className="metric-card">
          <span>Selected area</span>
          <strong>{briefing.selectedLocation.profile.name}</strong>
        </article>
        <article className="metric-card">
          <span>Refresh state</span>
          <strong>Live mock</strong>
        </article>
      </div>

      <div className="headline-strip">
        <span>{briefing.metrics.sourceConfidence}</span>
        <span>{briefing.metrics.lastRefresh}</span>
      </div>
    </section>
  )
}
