import { ImageResponse } from "next/og";

// Apple touch icon — the same blue V as icon.svg, centred on the dark
// brand background (Apple ignores transparency, so it gets a solid ground).
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const mark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none"><defs><linearGradient id="v" x1="16" y1="4" x2="16" y2="28" gradientUnits="userSpaceOnUse"><stop stop-color="#9ce3ff"/><stop offset="1" stop-color="#3ea6ff"/></linearGradient></defs><path d="M3 4.5h8.2L16 16.4 20.8 4.5H29L18.4 28h-4.8L3 4.5Z" fill="url(#v)"/></svg>`;

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#060810",
        }}
      >
        <div
          style={{
            width: 120,
            height: 120,
            backgroundImage: `url("data:image/svg+xml;base64,${btoa(mark)}")`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "120px 120px",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
