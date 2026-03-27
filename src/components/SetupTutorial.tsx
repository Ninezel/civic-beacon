import { useState } from 'react'

const tutorialSteps = [
  {
    id: 'coverage',
    label: 'Coverage record',
    caption: 'Define the area people will search for',
    title: 'Create one coverage record per area you want to monitor',
    body:
      'Start with the place name, region, country, location codes, and a few aliases people might search for. The location codes can be postcodes, ZIP codes, or any other local code system your community already uses.',
    goal: 'Make the area easy to find through search, directory filters, and starter-zone preload.',
    watchFor: 'Do not overfit the name to a niche nickname that only a small part of the community uses.',
    checklist: [
      'Use a stable public-facing place name like London, Cardiff, or San Francisco.',
      'Add multiple location codes if people use more than one code in the same area.',
      'Add aliases such as neighborhoods, districts, or common address hints.',
    ],
  },
  {
    id: 'feed',
    label: 'Feed URL',
    caption: 'Choose the route the browser will poll',
    title: 'Point the coverage area at a live JSON briefing endpoint',
    body:
      'The feed URL should return one normalized briefing document containing weather, signals, public updates, source health, and readiness actions. The browser fetches this URL directly in the open-source baseline.',
    goal: 'Keep one explicit briefing route per trusted coverage area.',
    watchFor: 'Do not leak provider secrets into a client-visible route or rely on unstable IDs in the payload.',
    checklist: [
      'Use a URL the browser can access directly, or put a proxy in front of the upstream.',
      'Do not put private API keys in a client-visible URL.',
      'Keep signal IDs stable so new-alert sound detection works properly.',
    ],
  },
  {
    id: 'verify',
    label: 'Verify',
    caption: 'Confirm the first live sync is healthy',
    title: 'Run the first sync and confirm the feed is healthy',
    body:
      'After adding the record, use Refresh feeds now. The coverage panel should move out of Waiting, and the feed should populate weather, signal, and source-health cards. If the feed fails, the error will be surfaced in the control panel.',
    goal: 'Check that the feed is live, not just configured.',
    watchFor: 'If the route falls back to stale data, treat that as a reliability issue to investigate before sharing publicly.',
    checklist: [
      'Look for a live or syncing state instead of Awaiting sync.',
      'Confirm the weather snapshot and signals feed contain real data.',
      'Check the source-audit panel to make sure freshness is visible.',
    ],
  },
  {
    id: 'operate',
    label: 'Operate',
    caption: 'Tune daily monitoring behavior',
    title: 'Tune monitoring behavior for everyday use',
    body:
      'Once the feed is healthy, set the polling interval, choose metric or imperial display, and decide whether the browser should play a sound for new live signals.',
    goal: 'Match the operator experience to how often the upstream actually changes.',
    watchFor: 'Over-aggressive polling and noisy alerts create fatigue fast.',
    checklist: [
      'Choose a polling interval that matches how quickly your upstream changes.',
      'Set the display units your users expect.',
      'Use the sound test button and, if needed, enable browser notifications for live signals.',
    ],
  },
] as const

export function SetupTutorial() {
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)
  const activeStep = tutorialSteps[activeStepIndex]
  const isFirstStep = activeStepIndex === 0
  const isLastStep = activeStepIndex === tutorialSteps.length - 1

  return (
    <section className="settings-card tutorial-card">
      <div className="panel-heading tutorial-heading">
        <div>
          <div className="section-label">Setup Tutorial</div>
          <h2>Wire one reliable coverage feed at a time</h2>
          <p className="panel-copy">
            Current focus: <strong>{activeStep.label}</strong> · {activeStep.caption}
          </p>
        </div>
        <div className="tutorial-heading-actions">
          <span className="panel-heading-badge">
            Step {activeStepIndex + 1} of {tutorialSteps.length}
          </span>
          <button className="ghost-button" type="button" onClick={() => setIsExpanded((current) => !current)}>
            {isExpanded ? 'Hide guide' : 'Show guide'}
          </button>
        </div>
      </div>

      <div className="tutorial-step-pills" role="tablist" aria-label="Setup tutorial steps">
        {tutorialSteps.map((step, index) => (
          <button
            key={step.id}
            className={`tutorial-step-pill ${index === activeStepIndex ? 'tutorial-step-pill-active' : ''}`}
            type="button"
            onClick={() => {
              setActiveStepIndex(index)
              setIsExpanded(true)
            }}
          >
            <span>{index + 1}</span>
            <strong>{step.label}</strong>
          </button>
        ))}
      </div>

      {isExpanded ? (
        <article className="tutorial-body" aria-live="polite">
          <div className="tutorial-body-header">
            <div className="tutorial-step-count">0{activeStepIndex + 1}</div>
            <div>
              <div className="section-label">Current Step</div>
              <h3>{activeStep.title}</h3>
              <p className="tutorial-step-caption">{activeStep.caption}</p>
            </div>
          </div>
          <p className="panel-copy">{activeStep.body}</p>

          <div className="tutorial-focus-grid">
            <article className="tutorial-focus-card">
              <span>Goal</span>
              <p>{activeStep.goal}</p>
            </article>
            <article className="tutorial-focus-card">
              <span>Watch for</span>
              <p>{activeStep.watchFor}</p>
            </article>
          </div>

          <div className="tutorial-checklist">
            {activeStep.checklist.map((item) => (
              <div key={item} className="tutorial-checklist-item">
                <span className="tutorial-checklist-mark" aria-hidden="true" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="tutorial-actions">
            <button
              className="ghost-button"
              type="button"
              disabled={isFirstStep}
              onClick={() => setActiveStepIndex((current) => Math.max(0, current - 1))}
            >
              Previous step
            </button>
            <a className="ghost-button" href="#setup-feed-schema">
              View feed schema
            </a>
            <button
              className="primary-button"
              type="button"
              disabled={isLastStep}
              onClick={() =>
                setActiveStepIndex((current) => Math.min(tutorialSteps.length - 1, current + 1))
              }
            >
              Next step
            </button>
          </div>
        </article>
      ) : null}
    </section>
  )
}
