import { processSteps } from "@/content/process";

// The four-step process with a rail that fills orange as you scroll past
// it (ScrollEffects sets --p on [data-rail] and lights each step). The
// numbers are real order, not decoration. `detailed` adds each step's
// outputs for the Process page.
export function ProcessSteps({
  detailed = false,
  headingLevel = 3,
}: {
  detailed?: boolean;
  /** 3 under a section h2 (home); 2 directly under the page h1 (Process). */
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
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
              <Heading className="h3">
                <span className="sr-only">Step {step.step}: </span>
                {step.title}
              </Heading>
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
