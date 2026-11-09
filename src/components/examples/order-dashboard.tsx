import { ExampleFrame, type ExampleVariant } from "./example-frame";

// A wholesale bakery: the internal tool staff would live in.
const days = [
  { day: "Mon", orders: 22 },
  { day: "Tue", orders: 31 },
  { day: "Wed", orders: 27 },
  { day: "Thu", orders: 35 },
  { day: "Fri", orders: 41 },
  { day: "Sat", orders: 18 },
] as const;

const orders = [
  {
    id: "WO-2291",
    customer: "Lakeside Café",
    route: "Route A",
    items: "6 dz croissants, 40 sourdough",
    when: "Tue 6:30am",
    total: "$386.00",
    status: ["ok", "Packed"],
  },
  {
    id: "WO-2290",
    customer: "Greenway Market",
    route: "Route A",
    items: "120 baguettes",
    when: "Tue 7:00am",
    total: "$312.00",
    status: ["blue", "Baking"],
  },
  {
    id: "WO-2288",
    customer: "St. Clair Deli",
    route: "Route B",
    items: "30 rye, 24 bagels",
    when: "Tue 8:15am",
    total: "$164.50",
    status: ["", "Confirmed"],
  },
  {
    id: "WO-2287",
    customer: "Union Kiosk",
    route: "Route B",
    items: "4 dz blueberry muffins",
    when: "Wed 6:00am",
    total: "$132.00",
    status: ["", "Confirmed"],
  },
  {
    id: "WO-2285",
    customer: "Harbour Hotel",
    route: "Harbour route",
    items: "200 dinner rolls",
    when: "Wed 4:30pm",
    total: "$230.00",
    status: ["warn", "Needs review"],
  },
] as const;

// Chart geometry: 45 orders maps to the top gridline (y=20), 0 to y=130.
const Y0 = 130;
const SCALE = 110 / 45;
const BAR_W = 46;
const STEP = 74;
const X0 = 52;

// `compact` (home page) keeps the KPIs and the chart; `full` (Services)
// adds the sidebar and the orders table.
export function OrderDashboard({
  variant = "full",
}: {
  variant?: ExampleVariant;
}) {
  const peak = Math.max(...days.map((d) => d.orders));
  const full = variant === "full";

  return (
    <ExampleFrame
      title={
        full
          ? "Wholesale order dashboard for a bakery"
          : "Order dashboard for a bakery"
      }
      grow
      variant={variant}
    >
      <div
        className={`grid text-[13px] ${full ? "lg:grid-cols-[196px_1fr]" : ""}`}
      >
        {full ? (
          <aside className="hidden border-r border-line bg-black p-5 lg:block">
            <p className="mb-6 flex items-center gap-2 font-display text-[15px] font-semibold">
              <span className="inline-block size-[22px] rounded-[5px] bg-[#c98b4a]" />
              Fernwood Bakery
            </p>
            <ul className="m-0 grid list-none gap-0.5 p-0 text-muted">
              <li className="flex justify-between rounded-md bg-s3 px-2.5 py-[7px] text-text">
                Orders{" "}
                <b className="rounded bg-s2 px-1.5 font-mono text-[11px] font-medium">
                  38
                </b>
              </li>
              <li className="px-2.5 py-[7px]">Customers</li>
              <li className="px-2.5 py-[7px]">Products</li>
              <li className="px-2.5 py-[7px]">Deliveries</li>
              <li className="flex justify-between px-2.5 py-[7px]">
                Invoices{" "}
                <b className="rounded bg-s3 px-1.5 font-mono text-[11px] font-medium text-text">
                  4
                </b>
              </li>
              <li className="px-2.5 py-[7px]">Settings</li>
            </ul>
          </aside>
        ) : null}

        <div className="grid min-w-0 gap-6 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="m-0 text-[17px] font-semibold">Wholesale orders</p>
              <p className="m-0 text-muted">Week of Nov 3</p>
            </div>
            <div className="flex gap-2" aria-hidden="true">
              <span className="rounded-md border border-line-strong bg-s3 px-2.5 py-2 text-xs font-medium">
                Export CSV
              </span>
              <span className="rounded-md bg-blue px-2.5 py-2 text-xs font-semibold text-black">
                New order
              </span>
            </div>
          </div>

          <div className={`kpi-grid ${full ? "four" : ""}`}>
            <div className="kpi">
              <div className="k">Open orders</div>
              <div className="v">38</div>
              <div className="d up">+6 vs last week</div>
            </div>
            <div className="kpi">
              <div className="k">Due tomorrow</div>
              <div className="v">14</div>
              <div className="d">first run 6:00am</div>
            </div>
            <div className="kpi">
              <div className="k">Revenue this week</div>
              <div className="v">$12,460</div>
              <div className="d up">+8.2%</div>
            </div>
            <div className="kpi">
              <div className="k">Late deliveries</div>
              <div className="v">2</div>
              <div className="d down">both Harbour route</div>
            </div>
          </div>

          <div className="rounded-[10px] border border-line bg-s2 p-4">
            <div className="mb-3 flex justify-between text-xs text-muted">
              <span>Orders per day</span>
              <span>Mon to Sun</span>
            </div>
            <svg
              viewBox="0 0 560 150"
              className="block h-auto w-full"
              role="img"
              aria-label={`Orders per day: ${days.map((d) => `${d.day} ${d.orders}`).join(", ")}, Sun closed`}
            >
              <g stroke="#1E2A35">
                {[20, 60, 100].map((y) => (
                  <line key={y} x1="34" x2="556" y1={y} y2={y} />
                ))}
              </g>
              <line x1="34" x2="556" y1={Y0} y2={Y0} stroke="#2A3946" />
              <g
                fill="#8D9BA7"
                fontSize="10"
                fontFamily="var(--font-geist-mono)"
                textAnchor="end"
              >
                {[45, 30, 15, 0].map((v) => (
                  <text key={v} x="28" y={Y0 - v * SCALE + 3}>
                    {v}
                  </text>
                ))}
              </g>
              <g className="bars">
                {days.map((d, i) => (
                  <rect
                    key={d.day}
                    style={{ "--i": i } as React.CSSProperties}
                    x={X0 + i * STEP}
                    y={Y0 - d.orders * SCALE}
                    width={BAR_W}
                    height={d.orders * SCALE}
                    rx="3"
                    fill={d.orders === peak ? "#FC734D" : "#0287DE"}
                  />
                ))}
              </g>
              <g
                className="vals"
                fill="#F2F5F7"
                fontSize="10.5"
                textAnchor="middle"
              >
                {days.map((d, i) => (
                  <text
                    key={d.day}
                    style={{ "--i": i } as React.CSSProperties}
                    x={X0 + i * STEP + BAR_W / 2}
                    y={Y0 - d.orders * SCALE - 5}
                  >
                    {d.orders}
                  </text>
                ))}
              </g>
              <g fill="#8D9BA7" fontSize="10.5" textAnchor="middle">
                {[...days.map((d) => d.day), "Sun"].map((day, i) => (
                  <text key={day} x={X0 + i * STEP + BAR_W / 2} y="146">
                    {day}
                  </text>
                ))}
                <text x={X0 + 6 * STEP + BAR_W / 2} y="124">
                  closed
                </text>
              </g>
            </svg>
          </div>

          {full ? (
            <div className="scroll-x">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Delivery</th>
                    <th className="num">Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td className="id">{o.id}</td>
                      <td>
                        {o.customer}
                        <span className="sub">{o.route}</span>
                      </td>
                      <td>{o.items}</td>
                      <td>{o.when}</td>
                      <td className="num">{o.total}</td>
                      <td>
                        <span className={`pill ${o.status[0]}`}>
                          {o.status[1]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </div>
    </ExampleFrame>
  );
}
