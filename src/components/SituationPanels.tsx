import type { LocationBriefing } from '../types'

interface SituationPanelsProps {
  briefing: LocationBriefing
}

export function SituationPanels({ briefing }: SituationPanelsProps) {
  return (
    <div className="situation-grid">
      <section className="panel">
        <div className="section-label">Weather Snapshot</div>
        <h2>{briefing.weather.condition}</h2>
        <div className="weather-grid">
          <article className="stat-tile">
            <span>Temperature</span>
            <strong>{briefing.weather.temperatureC}°C</strong>
          </article>
          <article className="stat-tile">
            <span>Wind</span>
            <strong>{briefing.weather.windKph} kph</strong>
          </article>
          <article className="stat-tile">
            <span>Rain chance</span>
            <strong>{briefing.weather.rainChance}%</strong>
          </article>
        </div>
        <p className="panel-copy">{briefing.weather.advisory}</p>
      </section>

      <section className="panel">
        <div className="section-label">Situation News</div>
        <h2>Public briefings around the selected location</h2>
        <div className="stack-list">
          {briefing.newsFeed.map((news) => (
            <article key={news.id} className="record-card compact-card">
              <div className="record-top">
                <div>
                  <strong>{news.headline}</strong>
                  <p>
                    {news.publishedAt} · {news.source}
                  </p>
                </div>
                <span className="status-chip status-light">{news.scope}</span>
              </div>
              <p>{news.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="section-label">Readiness Actions</div>
        <h2>What people should do next</h2>
        <div className="stack-list">
          {briefing.actions.map((action) => (
            <article key={action.id} className="record-card compact-card">
              <strong>{action.title}</strong>
              <p>{action.description}</p>
              <div className="record-footer">
                <span>{action.whenToUse}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="section-label">Source Audit</div>
        <h2>Signal health and trust posture</h2>
        <div className="stack-list">
          {briefing.sourceHealth.map((source) => (
            <article key={source.id} className="record-card compact-card">
              <div className="record-top">
                <div>
                  <strong>{source.name}</strong>
                  <p>
                    {source.type} · last sync {source.lastSync}
                  </p>
                </div>
                <span className="status-chip status-light">{source.status}</span>
              </div>
              <p>{source.note}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
