import type { HazardSignal } from '../types'

interface AlertFeedProps {
  hazardFeed: HazardSignal[]
}

function severityClass(severity: HazardSignal['severity']) {
  return `severity-${severity.toLowerCase()}`
}

function categoryLabel(category: HazardSignal['category']) {
  return category.replace('-', ' ')
}

export function AlertFeed({ hazardFeed }: AlertFeedProps) {
  return (
    <section className="panel feed-panel">
      <div className="panel-heading">
        <div>
          <div className="section-label">Alerts And Signals</div>
          <h2>Weather, hazard, and public-safety alerts</h2>
        </div>
        <div className="panel-heading-badge">{hazardFeed.length} live items</div>
      </div>
      <div className="stack-list">
        {hazardFeed.map((signal) => (
          <article key={signal.id} className="record-card">
            <div className="record-top">
              <div>
                <div className="record-kicker">{signal.status}</div>
                <strong>{signal.title}</strong>
                <p>
                  {signal.issuedAt} · {signal.source}
                </p>
              </div>
              <div className="chip-row">
                <span className={`status-chip ${severityClass(signal.severity)}`}>{signal.severity}</span>
                <span className="status-chip status-light">{categoryLabel(signal.category)}</span>
              </div>
            </div>
            <p>{signal.summary}</p>
            <div className="record-footer">
              <span>{signal.coverage}</span>
              <span>
                {signal.hotspotLabel} · {signal.reactionCount} field reactions
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
