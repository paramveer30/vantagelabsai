import type { ComponentType } from "react";
import "./industry-mocks.css";

// The product screen shown for each industry in the "Who we build for"
// switcher: a kitchen display, a grocer's inventory app, a clinic
// schedule and so on, each with its own look. Static markup; styles in
// industry-mocks.css.

function KitchenDisplay() {
  return (
    <div className="ind-shot">
      <div className="kds">
        <div className="kds-top">
          <span className="kds-brand">
            <i></i>EMBER &amp; OAK · KITCHEN
          </span>
          <span className="kds-tabs">
            <span className="on">All 6</span>
            <span>Grill 3</span>
            <span>Fry 2</span>
            <span>Expo 1</span>
          </span>
          <span className="kds-meta num">
            <span>
              Avg ticket <b>11:20</b>
            </span>
            <span>
              <b>7:42 PM</b>
            </span>
          </span>
        </div>
        <div className="kds-grid">
          <div className="tk">
            <div className="tk-h g num">
              <span>Table 12</span>
              <span>04:12</span>
            </div>
            <div className="tk-sub">Dine in · Server Ana · 4 guests</div>
            <ul>
              <li>
                <b>2×</b> Ribeye 10oz<small>Medium rare · no butter</small>
              </li>
              <li>
                <b>1×</b> Kids burger<small>Plain, no pickle</small>
              </li>
              <li>
                <b>1×</b> Truffle fries
              </li>
            </ul>
            <div className="tk-b">Bump</div>
          </div>
          <div className="tk">
            <div className="tk-h a num">
              <span>Pickup #318</span>
              <span>09:48</span>
            </div>
            <div className="tk-sub">Online · due 7:50 PM</div>
            <ul>
              <li>
                <b>2×</b> Smash burger<small>+ Bacon</small>
              </li>
              <li>
                <b>1×</b> Caesar salad<small>Dressing on side</small>
              </li>
              <li>
                <b>2×</b> Lemonade
              </li>
            </ul>
            <div className="tk-b">Bump</div>
          </div>
          <div className="tk">
            <div className="tk-h r num">
              <span>Table 4</span>
              <span>13:05</span>
            </div>
            <div className="tk-sub">Dine in · Server Leo · 2 guests</div>
            <ul>
              <li>
                <b>1×</b> Half chicken<span className="al">ALLERGY · NUTS</span>
              </li>
              <li>
                <b>1×</b> Mac &amp; cheese
              </li>
            </ul>
            <div className="tk-b">Bump</div>
          </div>
          <div className="tk">
            <div className="tk-h g num">
              <span>Delivery A7F2</span>
              <span>01:30</span>
            </div>
            <div className="tk-sub">Courier arrives 8:05 PM</div>
            <ul>
              <li>
                <b>3×</b> Fish tacos
              </li>
              <li>
                <b>1×</b> Street corn<small>No cotija</small>
              </li>
            </ul>
            <div className="tk-b">Bump</div>
          </div>
          <div className="tk">
            <div className="tk-h g num">
              <span>Table 7</span>
              <span>06:40</span>
            </div>
            <div className="tk-sub">Dine in · Server Ana · 2 guests</div>
            <ul>
              <li>
                <b>2×</b> Braised short rib
              </li>
              <li>
                <b>1×</b> Burrata
              </li>
            </ul>
            <div className="tk-b">Bump</div>
          </div>
          <div className="tk">
            <div className="tk-h a num">
              <span>Bar 22</span>
              <span>08:15</span>
            </div>
            <div className="tk-sub">Bar · tab Jordan</div>
            <ul>
              <li>
                <b>4×</b> Wings<small>Hot · extra ranch</small>
              </li>
            </ul>
            <div className="tk-b">Bump</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InventoryApp() {
  return (
    <div className="ind-shot">
      <div className="inv">
        <div className="inv-side">
          <div className="b">Corner Provisions</div>
          <span>Dashboard</span>
          <span className="on">Inventory</span>
          <span>Purchase orders</span>
          <span>Suppliers</span>
          <span>Sales</span>
          <span>Settings</span>
        </div>
        <div className="inv-main">
          <div className="inv-top">
            <p className="mh4">Inventory</p>
            <span className="inv-search">Search 1,284 products</span>
            <span className="inv-btn">Create purchase order</span>
          </div>
          <div className="inv-alert">
            ⚠{" "}
            <span>
              <b>3 items</b> will run out before Thursday&apos;s delivery from
              Hillside Dairy.
            </span>
          </div>
          <div className="inv-cards num">
            <div className="inv-card">
              <small>Sales this week</small>
              <strong>$8,412</strong>
              <em>+6.1%</em>
            </div>
            <div className="inv-card">
              <small>Stock value</small>
              <strong>$23,980</strong>
            </div>
            <div className="inv-card">
              <small>Open purchase orders</small>
              <strong>4</strong>
            </div>
          </div>
          <div className="inv-tbl">
            <table className="num">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>In stock</th>
                  <th className="hide-s">Sells / day</th>
                  <th>Runs out</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="prod">
                      <i
                        style={{
                          background: "linear-gradient(135deg,#F3EAD8,#D9C7A3)",
                        }}
                      ></i>
                      <div>
                        Oat milk 1L<small>SKU OM-1000</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="bar">
                      <i style={{ width: "8%", background: "#D64532" }}></i>
                    </span>
                    4
                  </td>
                  <td className="hide-s">9</td>
                  <td>Today</td>
                  <td>
                    <span className="st red">Reorder</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="prod">
                      <i
                        style={{
                          background: "linear-gradient(135deg,#D8A469,#9C6534)",
                        }}
                      ></i>
                      <div>
                        Sourdough loaf<small>SKU BR-SD900</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="bar">
                      <i style={{ width: "30%", background: "#E5A43B" }}></i>
                    </span>
                    18
                  </td>
                  <td className="hide-s">14</td>
                  <td>Tomorrow</td>
                  <td>
                    <span className="st amb">Low</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="prod">
                      <i
                        style={{
                          background: "linear-gradient(135deg,#5B3A26,#2E1C12)",
                        }}
                      ></i>
                      <div>
                        Ground coffee 340g<small>SKU CF-340</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="bar">
                      <i style={{ width: "20%", background: "#3A86D9" }}></i>
                    </span>
                    7
                  </td>
                  <td className="hide-s">2</td>
                  <td>Mon</td>
                  <td>
                    <span className="st blu">On order</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="prod">
                      <i
                        style={{
                          background: "linear-gradient(135deg,#C9D27A,#7C8A2E)",
                        }}
                      ></i>
                      <div>
                        Olive oil 500ml<small>SKU OL-500</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="bar">
                      <i style={{ width: "72%", background: "#2E9E5B" }}></i>
                    </span>
                    26
                  </td>
                  <td className="hide-s">1.5</td>
                  <td>Dec 2</td>
                  <td>
                    <span className="st grn">In stock</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="prod">
                      <i
                        style={{
                          background: "linear-gradient(135deg,#F6E7CF,#E3C38F)",
                        }}
                      ></i>
                      <div>
                        Free-range eggs, dozen<small>SKU EG-12</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="bar">
                      <i style={{ width: "22%", background: "#E5A43B" }}></i>
                    </span>
                    11
                  </td>
                  <td className="hide-s">6</td>
                  <td>Wed</td>
                  <td>
                    <span className="st amb">Low</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClinicSchedule() {
  return (
    <div className="ind-shot">
      <div className="cal">
        <div className="cal-main">
          <div className="cal-top">
            <b>Riverside Family Clinic</b>
            <span className="d">
              <span>‹</span>Tue, Nov 11<span>›</span>
            </span>
            <span className="cal-stats">
              38 booked · <b>12 rebooked online</b>
            </span>
          </div>
          <div className="cal-grid">
            <div></div>
            <div className="cal-h">
              Dr. A. Patel<small>Family medicine</small>
            </div>
            <div className="cal-h">
              Dr. L. Moreau<small>Pediatrics</small>
            </div>
            <div className="cal-h">
              Sam Ortiz<small>Nurse practitioner</small>
            </div>
            <div className="cal-times cal-t">
              <span>9:00</span>
              <span>9:30</span>
              <span>10:00</span>
              <span>10:30</span>
              <span>11:00</span>
              <span>11:30</span>
            </div>
            <div className="cal-col">
              <div className="ap np sel" style={{ top: "2px", height: "92px" }}>
                <b>Maya Chen</b>New patient · 60 min
                <br />
                <span className="ok">Intake done</span>
              </div>
              <div className="ap fu" style={{ top: "98px", height: "44px" }}>
                <b>Tom Becker</b>Follow-up · BP
              </div>
              <div className="ap ur" style={{ top: "194px", height: "44px" }}>
                <b>Walk-in slot</b>Same-day urgent
              </div>
            </div>
            <div className="cal-col">
              <div className="ap fu" style={{ top: "2px", height: "44px" }}>
                <b>Leo Park (4)</b>Well-child check
              </div>
              <div className="ap cl" style={{ top: "50px", height: "44px" }}>
                <b>Ava Nguyen (7)</b>Vaccines · flu
              </div>
              <div className="ap np" style={{ top: "146px", height: "92px" }}>
                <b>Sofia Ruiz (2)</b>New patient · 60 min
                <br />
                <span className="no">Intake not started</span>
              </div>
            </div>
            <div className="cal-col">
              <div className="ap cl" style={{ top: "50px", height: "44px" }}>
                <b>James Whyte</b>Prescription renewal
              </div>
              <div className="ap fu" style={{ top: "98px", height: "44px" }}>
                <b>Nora Ali</b>Lab results review
              </div>
              <div className="ap fu" style={{ top: "242px", height: "44px" }}>
                <b>Ben Cole</b>Follow-up · moved online
              </div>
            </div>
          </div>
        </div>
        <div className="cal-side">
          <p className="mh5">Maya Chen</p>
          <div className="row">
            <span>Visit</span>
            <span>New patient, 9:00</span>
          </div>
          <div className="row">
            <span>Intake form</span>
            <span style={{ color: "#0B7A55", fontWeight: "600" }}>
              Complete
            </span>
          </div>
          <div className="row">
            <span>Insurance</span>
            <span>Verified</span>
          </div>
          <div className="row">
            <span>Reminder</span>
            <span>SMS · Mon 6:02 PM</span>
          </div>
          <div className="msg">
            Reminder: your visit with Dr. Patel is Tue at 9:00 AM. Reply C to
            confirm or R to reschedule.
          </div>
          <div className="rep">C</div>
        </div>
      </div>
    </div>
  );
}

function VetRecord() {
  return (
    <div className="ind-shot">
      <div className="vet">
        <div className="vet-top">
          <b>Maple Street Animal Hospital</b>
          <span>Exam room 2 · Dr. Kaur</span>
        </div>
        <div className="vet-head">
          <div className="av">B</div>
          <div>
            <p className="mh4">Biscuit</p>
            <p>
              Golden Retriever · male, neutered · 6 yrs · Owner: Jordan Reyes
            </p>
          </div>
          <div className="chips">
            <span>31.4 kg</span>
            <span className="warn2">Rabies due Nov 18</span>
            <span>Chicken allergy</span>
          </div>
        </div>
        <div className="vet-tabs">
          <span className="on">Overview</span>
          <span>Visits</span>
          <span>Vaccines</span>
          <span>Labs</span>
          <span>Billing</span>
        </div>
        <div className="vet-body">
          <div className="vbox">
            <p className="mh5">
              <span>Weight, last 12 months</span>
              <span>kg</span>
            </p>
            <svg
              viewBox="0 0 300 120"
              width="100%"
              role="img"
              aria-label="Weight rising from 29.1 to 31.4 kg over 12 months"
            >
              <g stroke="#F1E8DD">
                <line x1="24" y1="20" x2="296" y2="20" />
                <line x1="24" y1="60" x2="296" y2="60" />
                <line x1="24" y1="100" x2="296" y2="100" />
              </g>
              <g fill="#73655a" fontSize="9" textAnchor="end">
                <text x="20" y="23">
                  32
                </text>
                <text x="20" y="63">
                  30
                </text>
                <text x="20" y="103">
                  28
                </text>
              </g>
              <path
                d="M28 82 L52 80 L76 78 L100 76 L124 70 L148 68 L172 64 L196 58 L220 52 L244 48 L268 46 L292 42 L292 100 L28 100 Z"
                fill="#7A2E1F"
                opacity=".08"
              />
              <path
                d="M28 82 L52 80 L76 78 L100 76 L124 70 L148 68 L172 64 L196 58 L220 52 L244 48 L268 46 L292 42"
                fill="none"
                stroke="#7A2E1F"
                strokeWidth="2"
              />
              <circle cx="292" cy="42" r="4" fill="#7A2E1F" />
              <text
                x="288"
                y="34"
                fill="#2B2118"
                fontSize="10"
                textAnchor="end"
                fontWeight="600"
              >
                31.4
              </text>
              <g fill="#73655a" fontSize="9" textAnchor="middle">
                <text x="28" y="116">
                  Dec
                </text>
                <text x="160" y="116">
                  Jun
                </text>
                <text x="292" y="116">
                  Nov
                </text>
              </g>
            </svg>
            <p className="mh5" style={{ marginTop: "12px" }}>
              <span>Vaccines</span>
              <span></span>
            </p>
            <ul className="vacc">
              <li>
                <span>
                  Rabies (3-yr)<small>Due Nov 18</small>
                </span>
                <span className="st amb">Reminder sent</span>
              </li>
              <li>
                <span>
                  DHPP<small>Given Mar 4</small>
                </span>
                <span className="st grn">Up to date</span>
              </li>
              <li>
                <span>
                  Bordetella<small>Due Oct 2</small>
                </span>
                <span className="st red">Overdue</span>
              </li>
            </ul>
          </div>
          <div className="vbox">
            <p className="mh5">
              <span>Text thread with owner</span>
              <span>(555) owner</span>
            </p>
            <div className="sms">
              <small>Mon 9:14 AM</small>
              <div className="in">
                Hi Jordan, Biscuit is due for his rabies booster on Nov 18. Tap
                to pick a time: maplest.vet/b/R7k
              </div>
              <div className="out">Booked Sat 10:30 ✓</div>
              <div className="in">
                Thanks! See you Saturday. His bordetella is overdue too. Want us
                to do both?
              </div>
              <div className="out">Yes please</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClientPortal() {
  return (
    <div className="ind-shot">
      <div className="cp">
        <div className="cp-top">
          <b>Okafor &amp; Lee</b>
          <span>Dunmore Ltd · Sign out</span>
        </div>
        <div className="cp-body">
          <div className="cp-hi">
            <p className="mh4">Good afternoon, Dana</p>
            <p>Your 2025 corporate tax return is in review.</p>
          </div>
          <div className="cpc">
            <p className="mh5">2025 corporate tax return</p>
            <div className="cp-steps">
              <div className="d">Documents</div>
              <div className="c">Review</div>
              <div>Sign</div>
              <div>Filed</div>
            </div>
            <div>
              <div className="doc">
                <i className="y">✓</i>
                <span>
                  Bank statements, Jan to Dec
                  <br />
                  <small>Uploaded Oct 30</small>
                </span>
              </div>
              <div className="doc">
                <i className="y">✓</i>
                <span>
                  Payroll summary
                  <br />
                  <small>Uploaded Nov 2</small>
                </span>
              </div>
              <div className="doc">
                <i className="n">!</i>
                <span>
                  Fixed asset register
                  <br />
                  <small>Requested Nov 3</small>
                </span>
                <span className="up">Upload</span>
              </div>
              <div className="doc">
                <i className="y">✓</i>
                <span>
                  Signed engagement letter
                  <br />
                  <small>Signed Oct 21</small>
                </span>
              </div>
            </div>
          </div>
          <div style={{ display: "grid", gap: "14px", alignContent: "start" }}>
            <div className="cpc">
              <p className="mh5">Invoice #1042</p>
              <div className="inv-big num">$2,850.00</div>
              <small style={{ color: "#5f574b" }}>
                Due Dec 1 · Bookkeeping, Q3
              </small>
              <div className="pay">Pay invoice</div>
            </div>
            <div className="cpc">
              <p className="mh5">Messages</p>
              <div className="msgc">
                <b>Priya Okafor</b>We&apos;re reviewing the payroll summary and
                will be back to you Thursday with any questions.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DispatchBoard() {
  return (
    <div className="ind-shot">
      <div className="dsp">
        <div className="dsp-top">
          <b>
            NORTHLINE <span>Heating &amp; Plumbing</span>
          </b>
          <span className="k num">
            <span>
              Crews out <b>6</b>
            </span>
            <span>
              Jobs today <b>23</b>
            </span>
            <span>
              Unassigned <b style={{ color: "#FF8A7F" }}>1</b>
            </span>
          </span>
        </div>
        <div className="map">
          <svg
            viewBox="0 0 520 320"
            preserveAspectRatio="xMidYMid slice"
            aria-label="Map of crew positions and routes"
            role="img"
          >
            <rect width="520" height="320" fill="#0F1A24" />
            <path
              d="M-10 230 C 90 210, 160 260, 260 235 S 420 190, 540 215"
              stroke="#13324A"
              strokeWidth="22"
              fill="none"
            />
            <g stroke="#1B2836" strokeWidth="7">
              <line x1="0" y1="60" x2="520" y2="60" />
              <line x1="0" y1="140" x2="520" y2="140" />
              <line x1="0" y1="290" x2="520" y2="290" />
              <line x1="80" y1="0" x2="80" y2="320" />
              <line x1="200" y1="0" x2="200" y2="320" />
              <line x1="330" y1="0" x2="330" y2="320" />
              <line x1="450" y1="0" x2="450" y2="320" />
            </g>
            <g stroke="#16212C" strokeWidth="3">
              <line x1="0" y1="100" x2="520" y2="100" />
              <line x1="140" y1="0" x2="140" y2="320" />
              <line x1="265" y1="0" x2="265" y2="320" />
              <line x1="390" y1="0" x2="390" y2="320" />
              <line x1="0" y1="180" x2="520" y2="180" />
            </g>
            <path
              d="M80 290 L80 140 L200 140 L200 100 L265 100"
              stroke="#409CFF"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="1 7"
            />
            <path
              d="M450 60 L330 60 L330 140"
              stroke="#FFB020"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            <g fontSize="10" fontWeight="700">
              <circle cx="80" cy="290" r="11" fill="#409CFF" />
              <text x="80" y="294" textAnchor="middle" fill="#fff">
                C2
              </text>
              <circle cx="330" cy="140" r="11" fill="#3FB77E" />
              <text x="330" y="144" textAnchor="middle" fill="#0F1A24">
                C4
              </text>
              <circle cx="450" cy="60" r="11" fill="#FFB020" />
              <text x="450" y="64" textAnchor="middle" fill="#0F1A24">
                C1
              </text>
              <circle cx="140" cy="180" r="11" fill="#5C6B7A" />
              <text x="140" y="184" textAnchor="middle" fill="#fff">
                C6
              </text>
              <path d="M265 86 l-8 -14 h16 z" fill="#EF6A5E" />
              <circle cx="265" cy="72" r="9" fill="#EF6A5E" />
              <text x="265" y="76" textAnchor="middle" fill="#fff" fontSize="9">
                J
              </text>
            </g>
            <g fontSize="10" fill="#9FB0C0">
              <text x="274" y="96">
                118 Elm St
              </text>
              <text x="90" y="285">
                Crew 2 · 12 min
              </text>
            </g>
          </svg>
          <div
            className="dsp-phone"
            aria-label="Customer's phone showing the live ETA"
          >
            <div className="in">
              <div className="mm">
                <svg viewBox="0 0 140 70" width="100%" height="70">
                  <rect width="140" height="70" fill="#DDE7EF" />
                  <g stroke="#fff" strokeWidth="5">
                    <line x1="0" y1="40" x2="140" y2="40" />
                    <line x1="60" y1="0" x2="60" y2="70" />
                  </g>
                  <path
                    d="M10 40 L60 40 L60 12"
                    stroke="#FFB020"
                    strokeWidth="3"
                    fill="none"
                  />
                  <circle cx="10" cy="40" r="5" fill="#409CFF" />
                  <circle cx="60" cy="12" r="5" fill="#EF6A5E" />
                </svg>
              </div>
              <div className="p">
                <small style={{ color: "#56626f" }}>Northline Heating</small>
                <b>Marco is 12 min away</b>
                <span>Furnace not heating · arriving ~2:40 PM</span>
                <div className="bar2">
                  <i></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="dsp-jobs">
          <div className="job">
            <b>No heat · furnace</b>
            <small>118 Elm St · Crew 2 (Marco)</small>
            <span className="s go">EN ROUTE · 12 MIN</span>
          </div>
          <div className="job">
            <b>Water heater install</b>
            <small>42 Birch Ave · Crew 4</small>
            <span className="s on">ON SITE · 1H 10M</span>
          </div>
          <div className="job">
            <b>Annual boiler service</b>
            <small>9 Quarry Rd · Crew 1</small>
            <span className="s go">NEXT · 3:30 PM</span>
          </div>
          <div className="job">
            <b>Leak under kitchen sink</b>
            <small>77 Lake Dr · urgent</small>
            <span className="s ur">NEEDS A CREW</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StudioApp() {
  return (
    <div className="ind-shot">
      <div className="fit">
        <div
          className="ph"
          role="img"
          aria-label="Member app: today's class schedule"
        >
          <div className="sc">
            <div className="sb">
              <span>6:41</span>
              <span>●●● 74%</span>
            </div>
            <div className="hd">
              <small>Kinetic · Queen St</small>
              <b>Classes</b>
            </div>
            <div className="days num">
              <span>
                Mon<b>10</b>
              </span>
              <span className="on">
                Tue<b>11</b>
              </span>
              <span>
                Wed<b>12</b>
              </span>
              <span>
                Thu<b>13</b>
              </span>
              <span>
                Fri<b>14</b>
              </span>
            </div>
            <div className="cls">
              <b>Spin 45</b>
              <small>6:30 PM · Coach Dee · 19/20</small>
              <span className="bt wait">Waitlist</span>
              <div className="cap2">
                <i style={{ width: "95%" }}></i>
              </div>
            </div>
            <div className="cls">
              <b>Strength Lab</b>
              <small>7:15 PM · Coach Marco · 11/16</small>
              <span className="bt">Book</span>
              <div className="cap2">
                <i style={{ width: "69%" }}></i>
              </div>
            </div>
            <div className="cls">
              <b>Yin Yoga</b>
              <small>8:00 PM · Coach Hana · 8/14</small>
              <span className="bt">Book</span>
              <div className="cap2">
                <i style={{ width: "57%" }}></i>
              </div>
            </div>
            <div className="tbar">
              <span className="on">Classes</span>
              <span>Bookings</span>
              <span>Membership</span>
              <span>Profile</span>
            </div>
          </div>
        </div>
        <div
          className="ph"
          role="img"
          aria-label="Member app: a waitlist spot opened, with a claim button and check-in code"
        >
          <div className="sc">
            <div className="sb">
              <span>6:52</span>
              <span>●●● 72%</span>
            </div>
            <div className="push">
              <small>
                <span>KINETIC</span>
                <span>now</span>
              </small>
              <b>A spot opened in Spin 45 at 6:30 PM</b>Claim it in the next 10
              minutes.
            </div>
            <div className="hd">
              <small>Spin 45 · Coach Dee</small>
              <b>You&apos;re next</b>
            </div>
            <div className="claim">Claim my spot</div>
            <div className="qr" aria-hidden="true"></div>
            <p
              style={{
                textAlign: "center",
                color: "#8D9096",
                margin: "8px 0 0",
              }}
            >
              Scan at the front desk to check in
            </p>
            <div className="tbar">
              <span>Classes</span>
              <span className="on">Bookings</span>
              <span>Membership</span>
              <span>Profile</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DonorCrm() {
  return (
    <div className="ind-shot">
      <div className="crm">
        <div className="crm-top">
          <b>
            <i></i>Harbour Food Bank
          </b>
          <span className="tabs2">
            <span className="on">Overview</span>
            <span>Donors</span>
            <span>Campaigns</span>
            <span>Grants</span>
          </span>
        </div>
        <div className="crm-body">
          <div className="crm-k num">
            <div>
              <small>Raised this month</small>
              <strong>$48,210</strong>
              <em>+12%</em>
            </div>
            <div>
              <small>Monthly donors</small>
              <strong>612</strong>
              <em>+41</em>
            </div>
            <div>
              <small>Average gift</small>
              <strong>$64</strong>
            </div>
          </div>
          <div className="crm-row">
            <div className="crm-card">
              <p className="mh5">
                <span>Donations, last 12 weeks</span>
                <span>$ thousands</span>
              </p>
              <svg
                viewBox="0 0 320 130"
                width="100%"
                role="img"
                aria-label="Weekly donations rising from about 7 to 14 thousand dollars"
              >
                <g stroke="#EEF4F1">
                  <line x1="22" y1="20" x2="316" y2="20" />
                  <line x1="22" y1="60" x2="316" y2="60" />
                  <line x1="22" y1="100" x2="316" y2="100" />
                </g>
                <g fill="#5b6b64" fontSize="9" textAnchor="end">
                  <text x="18" y="23">
                    15
                  </text>
                  <text x="18" y="63">
                    10
                  </text>
                  <text x="18" y="103">
                    5
                  </text>
                </g>
                <path
                  d="M26 84 L52 80 L78 86 L104 72 L130 70 L156 74 L182 60 L208 52 L234 56 L260 40 L286 34 L312 30 L312 120 L26 120 Z"
                  fill="#156b45"
                  opacity=".12"
                />
                <path
                  d="M26 84 L52 80 L78 86 L104 72 L130 70 L156 74 L182 60 L208 52 L234 56 L260 40 L286 34 L312 30"
                  fill="none"
                  stroke="#156b45"
                  strokeWidth="2.2"
                />
                <circle cx="312" cy="30" r="4" fill="#156b45" />
                <line
                  x1="182"
                  y1="12"
                  x2="182"
                  y2="120"
                  stroke="#F2B544"
                  strokeDasharray="3 3"
                />
                <text x="186" y="14" fill="#8A5A00" fontSize="9">
                  Spring appeal launched
                </text>
              </svg>
              <div className="camp" style={{ marginTop: "6px" }}>
                <b className="num">$72,400</b>{" "}
                <small>of $100,000 · Spring appeal · 9 days left</small>
                <div className="therm">
                  <i></i>
                </div>
              </div>
            </div>
            <div className="crm-card">
              <p className="mh5">
                <span>Needs attention</span>
                <span>Donors</span>
              </p>
              <ul className="donors">
                <li>
                  <span className="in" style={{ background: "#156b45" }}>
                    MG
                  </span>
                  <span>
                    Marcus Green<small>$50 monthly · since 2022</small>
                  </span>
                  <span className="dt m">Monthly</span>
                </li>
                <li>
                  <span className="in" style={{ background: "#94590d" }}>
                    EL
                  </span>
                  <span>
                    Erin Lowe<small>Last gift 14 months ago</small>
                  </span>
                  <span className="dt l">Lapsed</span>
                </li>
                <li>
                  <span className="in" style={{ background: "#5B4BC4" }}>
                    TP
                  </span>
                  <span>
                    Tanaka Partners<small>$5,000 · thank-you due</small>
                  </span>
                  <span className="dt j">Major</span>
                </li>
                <li>
                  <span className="in" style={{ background: "#2E7AB8" }}>
                    RS
                  </span>
                  <span>
                    Rosa Silva<small>Volunteer · 46 hrs this year</small>
                  </span>
                  <span className="dt m">Volunteer</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminPanel() {
  return (
    <div className="ind-shot">
      <div className="adm">
        <div className="adm-top">
          <b>
            northpine<span>/admin</span>
          </b>
          <span className="cmdk">
            <span>Search accounts, users, invoices</span>
            <kbd>⌘K</kbd>
          </span>
          <span style={{ color: "#8f97a2" }}>sam@northpine.io</span>
        </div>
        <div className="adm-main">
          <p className="mh4">
            Accounts <span>2,184 total</span>
          </p>
          <table>
            <thead>
              <tr>
                <th>Account</th>
                <th>Plan</th>
                <th>MRR</th>
                <th className="hide-s">Seats</th>
                <th className="hide-s">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="mono">acme-logistics</td>
                <td>
                  <span className="plan ent">Enterprise</span>
                </td>
                <td>$2,400</td>
                <td className="hide-s">86</td>
                <td className="hide-s">
                  <span
                    className="dot"
                    style={{ background: "#FCD34D" }}
                  ></span>
                  Plan change
                </td>
              </tr>
              <tr className="sel">
                <td className="mono">fernwood-bakery</td>
                <td>
                  <span className="plan pro">Pro</span>
                </td>
                <td>$49</td>
                <td className="hide-s">4</td>
                <td className="hide-s">
                  <span
                    className="dot"
                    style={{ background: "#6EE7B7" }}
                  ></span>
                  Active
                </td>
              </tr>
              <tr>
                <td className="mono">northshore-dental</td>
                <td>
                  <span className="plan pro">Pro</span>
                </td>
                <td>$149</td>
                <td className="hide-s">12</td>
                <td className="hide-s">
                  <span
                    className="dot"
                    style={{ background: "#6EE7B7" }}
                  ></span>
                  Active
                </td>
              </tr>
              <tr>
                <td className="mono">quill-studio</td>
                <td>
                  <span className="plan tr">Trial</span>
                </td>
                <td>$0</td>
                <td className="hide-s">3</td>
                <td className="hide-s">
                  <span
                    className="dot"
                    style={{ background: "#FCD34D" }}
                  ></span>
                  Ends in 2 days
                </td>
              </tr>
              <tr>
                <td className="mono">brightpath-edu</td>
                <td>
                  <span className="plan pro">Pro</span>
                </td>
                <td>$299</td>
                <td className="hide-s">31</td>
                <td className="hide-s">
                  <span
                    className="dot"
                    style={{ background: "#F87171" }}
                  ></span>
                  Payment failed
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="adm-drawer">
          <p className="mh5">fernwood-bakery</p>
          <div className="kv">
            <span>Owner</span>
            <span>dana@fernwood.co</span>
            <span>Plan</span>
            <span>Pro · monthly</span>
            <span>Created</span>
            <span>Mar 14, 2025</span>
            <span>Last login</span>
            <span>Today, 7:02 AM</span>
          </div>
          <div className="acts">
            <span className="p">Impersonate</span>
            <span>Issue refund</span>
            <span>Extend trial</span>
          </div>
          <ul className="log">
            <li>
              Refund $49.00 issued<small>sam@northpine.io · 2 min ago</small>
            </li>
            <li>
              Seat limit raised 3 → 4
              <small>priya@northpine.io · yesterday</small>
            </li>
            <li>
              Plan changed Starter → Pro<small>dana@fernwood.co · Sep 2</small>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export const industryMocks: Record<
  string,
  { app: string; Screen: ComponentType }
> = {
  "restaurants-cafes": {
    app: "Kitchen display for a restaurant",
    Screen: KitchenDisplay,
  },
  "retail-local-shops": {
    app: "Inventory app for a local grocer",
    Screen: InventoryApp,
  },
  "healthcare-clinics": {
    app: "Provider schedule for a family clinic",
    Screen: ClinicSchedule,
  },
  "veterinary-practices": {
    app: "Patient record with owner texting",
    Screen: VetRecord,
  },
  "professional-services": {
    app: "Client portal for an accounting firm",
    Screen: ClientPortal,
  },
  "trades-field-services": {
    app: "Dispatch board with live customer ETAs",
    Screen: DispatchBoard,
  },
  "fitness-wellness": {
    app: "Member app for a fitness studio",
    Screen: StudioApp,
  },
  "nonprofits-community": {
    app: "Donor CRM for a food bank",
    Screen: DonorCrm,
  },
  "startups-tech-teams": {
    app: "Admin panel for a SaaS startup",
    Screen: AdminPanel,
  },
};
