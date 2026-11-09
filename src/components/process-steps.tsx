import { processSteps } from "@/content/process";

// The four-step process with a rail that fills orange as you scroll past
// it (ScrollEffects sets --p on [data-rail] and lights each step). The
// numbers are real order, not decoration. `detailed` adds each step's
// outputs for the Process page.
export function ProcessSteps({ detailed = false }: { detailed?: boolean }) {
  return (
    <div className="steps-wrap" data-rail>
      <div className="rail" aria-hidden="true">
        <span />
      </div>
      <ol className="steps">
        {processSteps.map((step) => (
          <li key={step.step}>
            <span className="step-dot" aria-hidden="true">
              {String(step.step).padStart(2, "0")}
            </span>
            <div>
              <h3 className="h3">
                <span className="sr-only">Step {step.step}: </span>
                {step.title}
              </h3>
              <p>{step.description}</p>
              <p className="deliverable">You get: {step.deliverable}</p>
              {detailed ? (
                <ul className="outputs">
                  {step.outputs.map((output) => (
                    <li key={output}>{output}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
