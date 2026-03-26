import { formatTemperature, formatWindSpeed } from '../lib/units'
import type { LocationBriefing, UnitSystem } from '../types'

interface SituationPanelsProps {
  briefing: LocationBriefing
  unitSystem: UnitSystem
}

export function SituationPanels({ briefing, unitSystem }: SituationPanelsProps) {
  return (
    <div className="situation-grid">
      <section className="panel">
        <div className="section-label">Weather Snapshot</div>
        <h2>{briefing.weather.condition}</h2>
        <div className="weather-grid">
          <article className="stat-tile">
            <span>Temperature</span>
            <strong>{formatTemperature(briefing.weather, unitSystem)}</strong>
          </article>
          <article className="stat-tile">
            <span>Wind</span>
            <strong>{formatWindSpeed(briefing.weather, unitSystem)}</strong>
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
          {briefing.newsFeed.length > 0 ? (
            briefing.newsFeed.map((news) => (
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
            ))
          ) : (
            <article className="record-card compact-card empty-record-card">
              <strong>No public briefing items are active.</strong>
              <p>This feed has not published local or regional news items in the current sync window.</p>
            </article>
          )}
        </div>
      </section>

      <section className="panel">
        <div className="section-label">Readiness Actions</div>
        <h2>What people should do next</h2>
        <div className="stack-list">
          {briefing.actions.length > 0 ? (
            briefing.actions.map((action) => (
              <article key={action.id} className="record-card compact-card">
                <strong>{action.title}</strong>
                <p>{action.description}</p>
                <div className="record-footer">
                  <span>{action.whenToUse}</span>
                </div>
              </article>
            ))
          ) : (
            <article className="record-card compact-card empty-record-card">
              <strong>No readiness actions were published.</strong>
              <p>Add operational guidance to your feed if you want people to see clear next steps here.</p>
            </article>
          )}
        </div>
      </section>

      <section className="panel">
        <div className="section-label">Source Audit</div>
        <h2>Signal health and trust posture</h2>
        <div className="stack-list">
          {briefing.sourceHealth.length > 0 ? (
            briefing.sourceHealth.map((source) => (
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
            ))
          ) : (
            <article className="record-card compact-card empty-record-card">
              <strong>No source audit entries were published.</strong>
              <p>Include source-health records in the feed if you want users to understand what is verified and fresh.</p>
            </article>
          )}
        </div>
      </section>
    </div>
  )
}
