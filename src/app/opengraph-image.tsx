import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

// The social preview card, generated at build time (1200x630, the size
// every platform expects). Replaces the old hand-exported PNG so it stays
// in sync with the tagline and never balloons in file size.
export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const mark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none"><defs><linearGradient id="v" x1="16" y1="4" x2="16" y2="28" gradientUnits="userSpaceOnUse"><stop stop-color="#9ce3ff"/><stop offset="1" stop-color="#3ea6ff"/></linearGradient></defs><path d="M3 4.5h8.2L16 16.4 20.8 4.5H29L18.4 28h-4.8L3 4.5Z" fill="url(#v)"/></svg>`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background:
            "linear-gradient(135deg, #060810 0%, #0c1120 55%, #0b1830 100%)",
          color: "#eef2fb",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 88,
              height: 88,
              backgroundImage: `url("data:image/svg+xml;base64,${btoa(mark)}")`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "88px 88px",
            }}
          />
          <div
            style={{
              display: "flex",
              marginLeft: 22,
              fontSize: 44,
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            <span>VantageLabs</span>
            <span style={{ color: "#3ad0ff" }}>AI</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              maxWidth: 920,
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
            }}
          >
            {site.tagline}.
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 26,
              fontSize: 27,
              color: "#8b98b4",
            }}
          >
            Web apps · AI automation · Ongoing support
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 25,
            color: "#3ad0ff",
            letterSpacing: "0.02em",
          }}
        >
          vantagelabsai.com
        </div>
      </div>
    ),
    { ...size },
  );
}
