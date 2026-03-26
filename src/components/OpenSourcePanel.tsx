export function OpenSourcePanel() {
  return (
    <section className="panel open-source-panel">
      <div className="panel-heading">
        <div>
          <div className="section-label">Open Source And Security</div>
          <h2>Public by default, private by design.</h2>
        </div>
        <a className="support-link" href="https://ko-fi.com/ninezel" target="_blank" rel="noreferrer">
          Support development on Ko-Fi
        </a>
      </div>

      <p className="panel-copy">
        Emergency Centre stays free to inspect, fork, and self-host. The baseline build avoids
        account gates so communities can get to local hazard information immediately.
      </p>

      <div className="info-grid">
        <article className="info-card">
          <strong>No mandatory accounts in the OSS core</strong>
          <p>
            The baseline build is public and location-driven. You can inspect hazards without
            creating an account or handing over identity data.
          </p>
        </article>
        <article className="info-card">
          <strong>No bundled feeds or vendor lock-in</strong>
          <p>
            Each deployment chooses its own trusted alert feeds. The open-source core does not force
            a hosted backend or a single commercial data source.
          </p>
        </article>
        <article className="info-card">
          <strong>Provider abstraction comes first</strong>
          <p>
            Weather, flood, seismic, and news feeds should remain replaceable so self-hosters can
            choose trusted sources for their region.
          </p>
        </article>
        <article className="info-card">
          <strong>Donate, don’t gate</strong>
          <p>
            The project stays free and open source. If it helps your community, support maintenance
            on Ko-Fi rather than locking essential access behind billing.
          </p>
        </article>
      </div>
    </section>
  )
}
