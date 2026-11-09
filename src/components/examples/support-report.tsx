import { ExampleFrame, type ExampleVariant } from "./example-frame";

// What a support client receives each month, for a bakery client.
const INCIDENT_DAY = 17;

const log = [
  {
    when: "Oct 28",
    title: "Shipped: driver route printout",
    note: "Drivers now get one sheet per route, sorted by stop.",
  },
  {
    when: "Oct 21",
    title: "Fixed: CSV export skipped items with commas",
    note: "Reported by Dana. Fixed and re-exported September.",
  },
  {
    when: "Oct 17",
    title: "Incident: card payments failed for 22 minutes",
    note: "Provider-side outage. Orders queued and retried automatically.",
  },
  {
    when: "Oct 9",
    title: "Updated: security patches for the payment library",
    note: "No downtime.",
  },
];

// `compact` (home page): header, uptime and the latest three log
// entries. `full` (Services) adds the summary figures and the whole log.
export function SupportReport({
  variant = "full",
}: {
  variant?: ExampleVariant;
}) {
  const full = variant === "full";
  const entries = full ? log : log.slice(0, 3);

  return (
    <ExampleFrame
      title={
        full
          ? "The monthly report a support client receives"
          : "Monthly support report"
      }
      grow
      variant={variant}
    >
      <div className="grid gap-6 p-6 text-[13px]">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <p className="m-0 text-[17px] font-semibold">
              Fernwood ordering system: October report
            </p>
            <p className="m-0 text-muted">Prepared Nov 3 for Fernwood Bakery</p>
          </div>
          <span className="pill ok">All systems running</span>
        </div>

        <div>
          <div
            className="uptime"
            role="img"
            aria-label="Daily uptime for October: fully up every day except October 17, which had a 22 minute outage"
          >
            {Array.from({ length: 31 }, (_, d) => (
              <span
                key={d}
                className={d + 1 === INCIDENT_DAY ? "incident" : undefined}
                style={{ "--i": d } as React.CSSProperties}
              />
            ))}
          </div>
          <div className="mt-1.5 flex flex-wrap justify-between gap-x-3 gap-y-1 font-mono text-[11.5px] text-muted">
            <span>Oct 1</span>
            <span>Oct 17: payment provider outage, 22 min</span>
            <span>Oct 31</span>
          </div>
        </div>

        <div className={`grid gap-6 ${full ? "lg:grid-cols-[5fr_7fr]" : ""}`}>
          {full ? (
            <div className="kpi-grid content-start">
              <div className="kpi">
                <div className="k">Uptime</div>
                <div className="v">99.95%</div>
              </div>
              <div className="kpi">
                <div className="k">Requests closed</div>
                <div className="v">7</div>
              </div>
              <div className="kpi">
                <div className="k">Median first reply</div>
                <div className="v">1h 40m</div>
              </div>
              <div className="kpi">
                <div className="k">Hours used</div>
                <div className="v">9.5 / 12</div>
              </div>
            </div>
          ) : null}
          <ul className="m-0 list-none border-t border-line p-0">
            {entries.map((entry) => (
              <li
                key={entry.when}
                className="grid grid-cols-[86px_1fr] gap-2.5 border-b border-line py-2.5"
              >
                <span className="pt-0.5 font-mono text-[11.5px] text-muted">
                  {entry.when}
                </span>
                <div>
                  <b>{entry.title}</b>
                  <small className="block text-muted">{entry.note}</small>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ExampleFrame>
  );
}
