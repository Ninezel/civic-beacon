import { useState } from 'react'

const tutorialSteps = [
  {
    id: 'coverage',
    label: 'Coverage record',
    title: 'Create one coverage record per area you want to monitor',
    body:
      'Start with the place name, region, country, location codes, and a few aliases people might search for. The location codes can be postcodes, ZIP codes, or any other local code system your community already uses.',
    checklist: [
      'Use a stable public-facing place name like London, Cardiff, or San Francisco.',
      'Add multiple location codes if people use more than one code in the same area.',
      'Add aliases such as neighborhoods, districts, or common address hints.',
    ],
  },
  {
    id: 'feed',
    label: 'Feed URL',
    title: 'Point the coverage area at a live JSON briefing endpoint',
    body:
      'The feed URL should return one normalized briefing document containing weather, signals, public updates, source health, and readiness actions. The browser fetches this URL directly in the open-source baseline.',
    checklist: [
      'Use a URL the browser can access directly, or put a proxy in front of the upstream.',
      'Do not put private API keys in a client-visible URL.',
      'Keep signal IDs stable so new-alert sound detection works properly.',
    ],
  },
  {
    id: 'verify',
    label: 'Verify',
    title: 'Run the first sync and confirm the feed is healthy',
    body:
      'After adding the record, use Refresh feeds now. The coverage panel should move out of Waiting, and the feed should populate weather, signal, and source-health cards. If the feed fails, the error will be surfaced in the control panel.',
    checklist: [
      'Look for a live or syncing state instead of Awaiting sync.',
      'Confirm the weather snapshot and signals feed contain real data.',
      'Check the source-audit panel to make sure freshness is visible.',
    ],
  },
  {
    id: 'operate',
    label: 'Operate',
    title: 'Tune monitoring behavior for everyday use',
    body:
      'Once the feed is healthy, set the polling interval, choose metric or imperial display, and decide whether the browser should play a sound for new live signals.',
    checklist: [
      'Choose a polling interval that matches how quickly your upstream changes.',
      'Set the display units your users expect.',
      'Use the sound test button so you know the browser will allow audio.',
    ],
  },
] as const

export function SetupTutorial() {
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const activeStep = tutorialSteps[activeStepIndex]
  const isFirstStep = activeStepIndex === 0
  const isLastStep = activeStepIndex === tutorialSteps.length - 1

  return (
    <section className="settings-card tutorial-card">
      <div className="panel-heading tutorial-heading">
        <div>
          <div className="section-label">Setup Tutorial</div>
          <h2>How to connect a real monitoring feed</h2>
        </div>
        <span className="panel-heading-badge">
          Step {activeStepIndex + 1} of {tutorialSteps.length}
        </span>
      </div>

      <div className="tutorial-step-strip" role="tablist" aria-label="Setup tutorial steps">
        {tutorialSteps.map((step, index) => (
          <button
            key={step.id}
            className={`tutorial-step-button ${index === activeStepIndex ? 'tutorial-step-button-active' : ''}`}
            type="button"
            onClick={() => setActiveStepIndex(index)}
          >
            <span>{index + 1}</span>
            <strong>{step.label}</strong>
          </button>
        ))}
      </div>

      <article className="tutorial-body" aria-live="polite">
        <div className="section-label">Current Step</div>
        <h3>{activeStep.title}</h3>
        <p className="panel-copy">{activeStep.body}</p>

        <div className="tutorial-checklist">
          {activeStep.checklist.map((item) => (
            <div key={item} className="tutorial-checklist-item">
              {item}
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
    </section>
  )
}
