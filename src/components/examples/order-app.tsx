import type { ReactNode } from "react";
import { ExampleFrame } from "./example-frame";

// The same bakery's customer app, three screens. Light theme on
// purpose: it's the client's brand, not ours.
const ink = "#2A1E14";
const soft = "#7A6553";

function Phone({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="phone" role="img" aria-label={label}>
      <div
        className="relative flex h-[470px] flex-col overflow-hidden rounded-[26px] text-xs"
        style={{ background: "#FBF7F1", color: ink }}
      >
        {children}
      </div>
    </div>
  );
}

function StatusBar({ time, battery }: { time: string; battery: string }) {
  return (
    <div className="flex justify-between px-[18px] pt-2.5 pb-1 text-[11px] font-semibold">
      <span>{time}</span>
      <span>{battery}</span>
    </div>
  );
}

function TabBar({ active }: { active: string }) {
  return (
    <div
      className="mt-auto flex justify-around border-t pt-2.5 pb-4 text-[10.5px]"
      style={{ borderColor: "#EDE3D6", color: soft }}
    >
      {["Menu", "Orders", "Rewards", "Account"].map((t) => (
        <span
          key={t}
          style={t === active ? { color: ink, fontWeight: 600 } : undefined}
        >
          {t}
        </span>
      ))}
    </div>
  );
}

const menu = [
  {
    name: "Country sourdough",
    note: "Baked 5:30am · 900g",
    from: "#D8A469",
    to: "#9C6534",
  },
  {
    name: "Butter croissant",
    note: "$3.75 · 6 left",
    from: "#E8C27F",
    to: "#B57B3C",
  },
  { name: "Dark rye", note: "$8.50 · seeded", from: "#7C5A3E", to: "#4B3324" },
  {
    name: "Morning bun",
    note: "$4.25 · orange zest",
    from: "#E9D5B5",
    to: "#C7A276",
  },
];

const cart = [
  ["1 × Country sourdough", "$9.00"],
  ["2 × Butter croissant", "$7.50"],
  ["1 × Oat latte", "$5.25"],
];

export function OrderApp() {
  return (
    <ExampleFrame title="Order-ahead app for the same bakery's customers">
      <div
        className="phones flex flex-wrap justify-center gap-6 px-4 py-12"
        style={{ background: "linear-gradient(160deg, #1B1410, #0E1218 60%)" }}
      >
        <Phone label="App screen 1 of 3: the menu, showing four breads and pastries with prices">
          <StatusBar time="7:42" battery="82%" />
          <div className="px-4 pt-2 pb-2.5">
            <small className="block text-[11px]" style={{ color: soft }}>
              Pickup at Queen St.
            </small>
            <strong className="font-display text-[19px] tracking-tight">
              Good morning, Dana
            </strong>
          </div>
          <div className="flex gap-1.5 px-4 pb-2.5 text-[11px]">
            <span
              className="rounded-full px-2.5 py-1"
              style={{ background: ink, color: "#FBF7F1" }}
            >
              Bread
            </span>
            <span
              className="rounded-full px-2.5 py-1"
              style={{ background: "#EFE6DA" }}
            >
              Pastry
            </span>
            <span
              className="rounded-full px-2.5 py-1"
              style={{ background: "#EFE6DA" }}
            >
              Coffee
            </span>
          </div>
          <div className="grid gap-2 px-3">
            {menu.map((m) => (
              <div
                key={m.name}
                className="grid grid-cols-[52px_1fr_auto] items-center gap-2.5 rounded-xl border bg-white p-2"
                style={{ borderColor: "#EDE3D6" }}
              >
                <div
                  className="size-[52px] rounded-[9px]"
                  style={{
                    background: `linear-gradient(135deg, ${m.from}, ${m.to})`,
                  }}
                />
                <div>
                  <b className="block text-xs">{m.name}</b>
                  <small className="text-[11px]" style={{ color: soft }}>
                    {m.note}
                  </small>
                </div>
                <span
                  className="grid size-[26px] place-items-center rounded-full font-semibold text-white"
                  style={{ background: ink }}
                >
                  +
                </span>
              </div>
            ))}
          </div>
          <TabBar active="Menu" />
        </Phone>

        <Phone label="App screen 2 of 3: the cart totalling $21.75 with an 8:15 pickup time selected">
          <StatusBar time="7:44" battery="82%" />
          <div className="px-4 pt-2 pb-2.5">
            <small className="block text-[11px]" style={{ color: soft }}>
              Your order
            </small>
            <strong className="font-display text-[19px] tracking-tight">
              Pick a time
            </strong>
          </div>
          {cart.map(([item, price]) => (
            <div
              key={item}
              className="flex justify-between border-b px-4 py-2"
              style={{ borderColor: "#EDE3D6" }}
            >
              <span>{item}</span>
              <span>{price}</span>
            </div>
          ))}
          <div
            className="flex justify-between border-b px-4 py-2 font-semibold"
            style={{ borderColor: "#EDE3D6" }}
          >
            <span>Total</span>
            <span>$21.75</span>
          </div>
          <div
            className="mx-3 my-2.5 rounded-xl border bg-white p-2.5"
            style={{ borderColor: "#EDE3D6" }}
          >
            <b>Pickup today</b>
            <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
              {["7:55", "8:15", "8:30", "8:45"].map((t) => (
                <span
                  key={t}
                  className="rounded-lg border px-2 py-1.5"
                  style={
                    t === "8:15"
                      ? { background: ink, borderColor: ink, color: "#fff" }
                      : { borderColor: "#DCCDBB" }
                  }
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div
            className="mx-3 mt-auto mb-4 rounded-xl p-3 text-center font-semibold text-white"
            style={{ background: ink }}
          >
            Pay and place order
          </div>
        </Phone>

        <Phone label="App screen 3 of 3: order status, ready at 8:15 on shelf B, with a pickup code">
          <StatusBar time="8:09" battery="79%" />
          <div className="grid gap-3.5 px-4 py-1.5">
            <div>
              <small style={{ color: soft }}>Order #4107</small>
              <div className="font-display text-[26px] leading-tight tracking-tight">
                Ready at 8:15
              </div>
            </div>
            <ol
              className="m-0 ml-1 grid list-none gap-3 border-l-2 py-0 pr-0 pl-3.5"
              style={{ borderColor: "#E3D6C6" }}
            >
              {[
                ["Order received", "7:44am", "#3F8F5E"],
                ["Being packed", "8:02am", "#3F8F5E"],
                [
                  "Ready on the pickup shelf",
                  "Shelf B, under your name",
                  "#C9773A",
                ],
              ].map(([title, sub, color]) => (
                <li key={title} className="relative">
                  <span
                    className="absolute top-[3px] -left-[21px] size-3 rounded-full"
                    style={{ background: color }}
                  />
                  {title}
                  <small className="block" style={{ color: soft }}>
                    {sub}
                  </small>
                </li>
              ))}
            </ol>
            <div
              className="flex items-center justify-between rounded-xl border bg-white p-2.5"
              style={{ borderColor: "#EDE3D6" }}
            >
              <div>
                <small style={{ color: soft }}>Pickup code</small>
                <br />
                <code className="font-mono text-[15px] tracking-[0.1em]">
                  K7 4Q
                </code>
              </div>
              <span className="text-[11px]" style={{ color: soft }}>
                Show at counter
              </span>
            </div>
          </div>
          <TabBar active="Orders" />
        </Phone>
      </div>
    </ExampleFrame>
  );
}
