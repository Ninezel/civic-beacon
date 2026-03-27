import { describeUnitSystem } from '../lib/units'
import type { LocationBriefing, UnitSystem } from '../types'

interface OverviewPanelProps {
  briefing: LocationBriefing | null
  coverageCount: number
  isRefreshing: boolean
  soundEnabled: boolean
  unitSystem: UnitSystem
}

const modeLabel = {
  directory: 'Coverage directory',
  search: 'Coverage search',
  suggestion: 'Autocomplete match',
}

function statusTone(refreshState: string) {
  if (refreshState === 'Needs attention') {
    return 'status-sync-error'
  }

  if (refreshState === 'Syncing') {
    return 'status-sync-syncing'
  }

  if (refreshState === 'Stale snapshot') {
    return 'severity-moderate'
  }

  if (refreshState === 'Live') {
    return 'status-sync-live'
  }

  return 'status-light'
}

export function OverviewPanel({
  briefing,
  coverageCount,
  isRefreshing,
  soundEnabled,
  unitSystem,
}: OverviewPanelProps) {
  const selectedProfile = briefing?.selectedLocation.profile ?? null
  const refreshState = isRefreshing
    ? 'Syncing'
    : selectedProfile?.fetchStatus === 'error'
      ? 'Needs attention'
      : selectedProfile?.freshness.status === 'stale'
        ? 'Stale snapshot'
        : selectedProfile?.fetchStatus === 'live'
          ? 'Live'
          : 'Waiting'
  const healthySources = selectedProfile?.sources.filter((source) => source.status === 'Healthy').length ?? 0
  const totalSources = selectedProfile?.sources.length ?? 0
  const coverageCodes = selectedProfile?.locationCodes.slice(0, 4) ?? []
  const topSignals = briefing?.signalFeed.slice(0, 2) ?? []

  return (
    <section className="panel overview-panel">
      <div className="section-label">Emergency Centre</div>
      <div className="overview-topline">
        <span className={`status-chip ${statusTone(refreshState)}`}>{refreshState}</span>
        <span className="overview-topline-copy">
          {briefing
            ? `${modeLabel[briefing.selectedLocation.mode]} · ${briefing.metrics.lastRefresh}`
            : `${coverageCount} configured coverage area${coverageCount === 1 ? '' : 's'}`}
        </span>
      </div>
      <div className="overview-hero">
        <div className="overview-copy-block">
          <h1>
            {briefing ? 'Monitor live public signals with a cleaner desk view.' : 'Connect live feeds and monitor real signals.'}
          </h1>
          <p className="lead-copy">
            {briefing
              ? briefing.headline
              : 'Emergency Centre stays open source and feed-driven. Add real weather, transport, infrastructure, airspace, or public-safety endpoints to begin monitoring coverage areas.'}
          </p>

          <div className="overview-badges">
            <span className="status-chip status-light">
              {briefing ? modeLabel[briefing.selectedLocation.mode] : 'Coverage setup'}
            </span>
            <span className="status-chip status-light">
              {soundEnabled ? 'Audio alerts on' : 'Audio alerts off'}
            </span>
            <span className="status-chip status-light">{describeUnitSystem(unitSystem)}</span>
          </div>
        </div>

        <aside className="overview-spotlight">
          <div className="overview-spotlight-head">
            <span className={`status-chip ${briefing ? 'status-accent' : 'status-light'}`}>
              {briefing ? 'Live public briefing' : 'Setup required'}
            </span>
            {briefing ? (
              <span className={`status-chip ${statusTone(refreshState)}`}>{refreshState}</span>
            ) : null}
          </div>
          <strong>{briefing ? briefing.selectedLocation.label : 'No coverage feed selected yet'}</strong>
          <p>
            {briefing && selectedProfile
              ? `${selectedProfile.region} · ${selectedProfile.country}`
              : 'Add a coverage area and briefing endpoint below.'}
          </p>

          {coverageCodes.length > 0 ? (
            <div className="overview-code-row">
              {coverageCodes.map((code) => (
                <span key={code} className="overview-code-chip">
                  {code}
                </span>
              ))}
            </div>
          ) : (
            <p>
              Weather, transport, infrastructure, public-safety, and partner briefings can flow into
              one view.
            </p>
          )}

          <div className="overview-spotlight-grid">
            <article className="overview-mini-card">
              <span>Source health</span>
              <strong>{totalSources > 0 ? `${healthySources}/${totalSources}` : '--'}</strong>
              <p>{totalSources > 0 ? 'healthy providers reporting' : 'waiting for live provider data'}</p>
            </article>
            <article className="overview-mini-card">
              <span>Signal posture</span>
              <strong>{briefing ? briefing.metrics.activeSignals : 0}</strong>
              <p>
                {briefing
                  ? `${briefing.metrics.criticalSignals} critical · ${briefing.metrics.monitoredCategories} categories`
                  : 'No active coverage selected yet'}
              </p>
            </article>
          </div>

          {topSignals.length > 0 ? (
            <div className="overview-signal-list">
              {topSignals.map((signal) => (
                <div key={signal.id} className="overview-signal-item">
                  <span className={`status-chip severity-${signal.severity.toLowerCase()}`}>{signal.severity}</span>
                  <div>
                    <strong>{signal.title}</strong>
                    <p>{signal.hotspotLabel}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          <p className="spotlight-outlook">
            {briefing && selectedProfile
              ? selectedProfile.outlook
              : 'No feed data is bundled into the open-source core. Communities bring their own trusted feeds.'}
          </p>
        </aside>
      </div>

      <div className="metric-grid">
        <article className="metric-card">
          <span>Coverage feeds</span>
          <strong>{coverageCount}</strong>
          <p>{briefing ? 'Configured and available in this workspace' : 'Add feeds in setup to begin monitoring'}</p>
        </article>
        <article className="metric-card">
          <span>Active signals</span>
          <strong>{briefing?.metrics.activeSignals ?? 0}</strong>
          <p>{briefing ? 'Current live or monitored signal cards' : 'No live feed selected yet'}</p>
        </article>
        <article className="metric-card">
          <span>Critical signals</span>
          <strong>{briefing?.metrics.criticalSignals ?? 0}</strong>
          <p>{briefing ? 'Highest-priority incidents in the active area' : 'Critical alerts appear here first'}</p>
        </article>
        <article className="metric-card">
          <span>Signal categories</span>
          <strong>{briefing?.metrics.monitoredCategories ?? 0}</strong>
          <p>{briefing ? 'Distinct signal families currently present' : 'Categories expand once feeds are live'}</p>
        </article>
      </div>

      <div className="overview-ribbon">
        <span className="overview-ribbon-label">Desk summary</span>
        <strong>{briefing ? briefing.metrics.sourceConfidence : 'No active coverage selection yet'}</strong>
        <span>
          {briefing ? selectedProfile?.freshness.message : 'Waiting for the first live sync'}
        </span>
      </div>
    </section>
  )
}
