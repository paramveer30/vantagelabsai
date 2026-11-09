"use client";

import { useEffect, useRef } from "react";

// The site's signature: a fluted (ribbed) glass panel over a slowly
// drifting Electric Blue and neon mint blur, with film grain. One WebGL
// quad, fixed behind every page.
//
// Brightness follows the sections on screen. Elements carry data-inten
// (0..1, how much colour shows) and data-cap (a luminance ceiling); the
// values are blended by how much of the middle of the viewport each
// element covers, so the field fades between sections instead of
// stepping. Sections holding body copy use a low cap, which keeps text
// contrast intact wherever the colour drifts.
//
// The home hero's [data-glass-v] element marks where to draw the logo V:
// its own pane of glass with finer ribs, uncapped brightness and a lit rim.
//
// Reduced motion: no drift; the field redraws only on scroll.
// No WebGL: the canvas keeps its CSS gradient and GlassV shows its SVG.

const VERTEX = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const FRAGMENT = `
precision mediump float;
uniform vec2 res;
uniform float t, sc, inten, cap, fw;
uniform vec4 vbox; // x, y (bottom, GL coords), w, h in canvas pixels; w=0: none

float g(vec2 p, vec2 c, float r){ vec2 d = p - c; return exp(-dot(d, d) / (r * r)); }
float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

vec3 field(vec2 p){
  float a = res.x / res.y; p.x *= a;
  vec3 c = vec3(.008, .027, .039);
  c += vec3(.004, .29, .50) * g(p, vec2((.80 + .06 * sin(t * .07)) * a, .48 + .10 * cos(t * .05) + sc * .10), .62) * 1.1;
  c += vec3(.008, .53, .87) * g(p, vec2((.70 + .09 * sin(t * .09 + 1.)) * a, .55 + .12 * sin(t * .06) - sc * .18), .40) * 1.05;
  c += vec3(.31, .70, .95) * g(p, vec2((.62 + .07 * cos(t * .11)) * a, .72 + .08 * sin(t * .08 + 2.) - sc * .12), .20) * .55;
  c += vec3(.17, .96, .60) * g(p, vec2((.86 + .07 * cos(t * .08 + 3.)) * a, .32 + .10 * sin(t * .07) + sc * .22), .24) * .7;
  c += vec3(.35, .98, .70) * g(p, vec2((.30 + .20 * sin(t * .05 + 4.)) * a, .12 + .08 * cos(t * .09) + sc * .3), .16) * .45;
  c += vec3(.008, .40, .70) * g(p, vec2((.18 + .10 * cos(t * .06)) * a, .85 - sc * .25), .30) * .6;
  return c;
}

// Fluted glass: each rib magnifies and shifts the field behind it.
vec3 glass(vec2 f, float w, float shift, float wobble, out float l){
  float i = floor(f.x / w);
  l = fract(f.x / w);
  float rx = (i + .5) * w + (l - .5) * w * 2.4 + w * shift;
  float wob = sin(i * .55 + t * .25) * res.y * wobble;
  return field(vec2(rx, f.y + wob) / res);
}

// Signed distance to the logo V (app/icon.svg), in icon units; < 0 inside.
#define EDGE(a, b) { vec2 e = b - a; vec2 w = p - a; vec2 q = w - e * clamp(dot(w, e) / dot(e, e), 0., 1.); d = min(d, dot(q, q)); bvec3 cnd = bvec3(p.y >= a.y, p.y < b.y, e.x * w.y > e.y * w.x); if (all(cnd) || all(not(cnd))) s = -s; }
float sdV(vec2 p){
  vec2 v0 = vec2(3., 4.5), v1 = vec2(11.2, 4.5), v2 = vec2(16., 16.4), v3 = vec2(20.8, 4.5);
  vec2 v4 = vec2(29., 4.5), v5 = vec2(18.4, 28.), v6 = vec2(13.6, 28.);
  float d = dot(p - v0, p - v0);
  float s = 1.;
  EDGE(v0, v6) EDGE(v1, v0) EDGE(v2, v1) EDGE(v3, v2) EDGE(v4, v3) EDGE(v5, v4) EDGE(v6, v5)
  return s * sqrt(d);
}

// ---- The 3D glass V ----------------------------------------------------
// Object space is icon units centred on the mark (x right, y up, z towards
// the viewer). The 2D V is extruded into a slab with rounded edges and
// ray-marched, so it reads as a solid piece of glass turning in space.
const float DEPTH = 2.6;   // half thickness, icon units
const float ROUND = .45;   // edge rounding

vec3 rotY(vec3 v, float a){ float c = cos(a), s = sin(a); return vec3(c * v.x + s * v.z, v.y, -s * v.x + c * v.z); }
vec3 rotX(vec3 v, float a){ float c = cos(a), s = sin(a); return vec3(v.x, c * v.y - s * v.z, s * v.y + c * v.z); }

float sdSlab(vec3 p){
  float d2 = sdV(vec2(p.x + 16., 16.25 - p.y)) + ROUND;
  vec2 w = vec2(d2, abs(p.z) - DEPTH + ROUND);
  return min(max(w.x, w.y), 0.) + length(max(w, 0.)) - ROUND;
}

// Pose: a slow rock left and right, a smaller tilt, and a gentle float.
float yawA(){ return .55 * sin(t * .31); }
float pitchA(){ return .2 * sin(t * .23 + 1.3); }
float bobA(){ return .6 * sin(t * .47); }

vec3 toObject(vec3 p){ return rotX(rotY(p - vec3(0., bobA(), 0.), -yawA()), -pitchA()); }
vec3 toWorld(vec3 n){ return rotY(rotX(n, pitchA()), yawA()); }

float sceneD(vec3 p){ return sdSlab(toObject(p)); }

vec3 sceneNormal(vec3 p){
  const vec2 k = vec2(1., -1.);
  const float e = .04;
  return normalize(
    k.xyy * sceneD(p + k.xyy * e) + k.yyx * sceneD(p + k.yyx * e) +
    k.yxy * sceneD(p + k.yxy * e) + k.xxx * sceneD(p + k.xxx * e));
}

void main(){
  vec2 f = gl_FragCoord.xy;
  vec3 base = vec3(.008, .027, .039);

  float l;
  vec3 c = base + (glass(f, fw, .9, .018, l) - base) * inten;
  c += vec3(.10) * smoothstep(.22, 0., l) * inten * .55;
  c *= 1. - .40 * smoothstep(.45, 1., l);
  float L = dot(c, vec3(.2126, .7152, .0722));
  if (L > cap) c *= cap / L;

  if (vbox.z > 0.) {
    float unit = vbox.z / 26.;                 // canvas px per icon unit
    vec2 q = (f - (vbox.xy + vbox.zw * .5)) / unit; // icon units, y up
    float breath = .5 + .5 * sin(t * .6);

    // Only march near the mark (with room for it to turn).
    if (abs(q.x) < 21. && abs(q.y) < 19.) {
      // Soft contact shadow from the silhouette, offset down and right.
      float sh = sdV(vec2(q.x - 1.4 + 16., 16.25 - (q.y + 2.2 - bobA())));
      c *= 1. - .45 * smoothstep(5., -1., sh);

      // Gentle perspective: eye in front of the mark.
      vec3 ro = vec3(0., 0., 70.);
      vec3 rd = normalize(vec3(q, -70.));
      float tt = 58.;
      float minD = 1e3;
      bool hit = false;
      for (int i = 0; i < 56; i++) {
        float d = sceneD(ro + rd * tt);
        minD = min(minD, d);
        if (d < .01) { hit = true; break; }
        tt += d;
        if (tt > 84.) break;
      }

      float pxU = 1.4 / unit; // ~1.4px in icon units, for anti-aliasing
      if (hit) {
        vec3 p = ro + rd * tt;
        vec3 n = sceneNormal(p);
        vec3 no = normalize(toObject(p + n) - toObject(p)); // object-space normal
        vec3 V = -rd;
        vec3 Ld = normalize(vec3(-.45, .65, .85));
        float diff = max(dot(n, Ld), 0.);
        float spec = pow(max(dot(reflect(-Ld, n), V), 0.), 56.);
        float fres = pow(1. - max(dot(n, V), 0.), 3.);
        vec3 po = toObject(p);

        // Faces: fluted glass refracting the field, bent by the surface angle.
        float vl;
        vec3 face = glass(f + n.xy * unit * 4., fw * .55, -.6, .008, vl) * 1.2 + vec3(.01, .05, .10);
        // Keep the glass blue-tinted and below white so it never blows out.
        face = mix(face, face * vec3(.55, .85, 1.1), .35);
        face = min(face, vec3(.85, .92, 1.));
        face += vec3(.14) * smoothstep(.25, 0., vl);
        face *= 1. - .28 * smoothstep(.5, 1., vl);
        // Warm toward the point of the V.
        face = mix(face, face * vec3(.75, 1.25, .95) + vec3(0., .10, .05), smoothstep(-2., -11., po.y) * .75);
        face *= .78 + .4 * diff;

        // Sides: deep blue glass, lit from the upper left.
        vec3 side = mix(vec3(.01, .16, .34), vec3(.03, .26, .16), smoothstep(-2., -11., po.y));
        side *= .45 + 1.1 * diff;

        vec3 col = mix(side, face, smoothstep(.55, .85, abs(no.z)));
        col += spec * vec3(1.) * .8;
        col += fres * vec3(.55, .82, 1.) * (.45 + .3 * breath);
        c = col;
      } else {
        // Thin glow hugging the silhouette for a clean edge.
        float edge = 1. - smoothstep(0., pxU * 3., minD);
        c += edge * vec3(.5, .78, 1.) * (.35 + .2 * breath);
      }
    }
  }

  c += (h(f + fract(t * 3.) * 91.) - .5) * .045;
  gl_FragColor = vec4(c, 1.);
}`;

const DEFAULT_INTEN = 0.8;
const DEFAULT_CAP = 0.3;

// Blend every tagged element by its overlap with the middle band of the
// viewport (30%..70% of its height).
function readTarget(): [number, number] {
  const vh = window.innerHeight;
  const top = vh * 0.3;
  const bottom = vh * 0.7;
  let weight = 0;
  let inten = 0;
  let cap = 0;
  document.querySelectorAll<HTMLElement>("[data-inten]").forEach((el) => {
    const r = el.getBoundingClientRect();
    const overlap = Math.min(r.bottom, bottom) - Math.max(r.top, top);
    if (overlap <= 0) return;
    weight += overlap;
    inten += overlap * Number(el.dataset.inten ?? DEFAULT_INTEN);
    cap += overlap * Number(el.dataset.cap ?? DEFAULT_CAP);
  });
  return weight > 0
    ? [inten / weight, cap / weight]
    : [DEFAULT_INTEN, DEFAULT_CAP];
}

export function TextureBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      antialias: false,
      premultipliedAlpha: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = {
      res: gl.getUniformLocation(program, "res"),
      t: gl.getUniformLocation(program, "t"),
      sc: gl.getUniformLocation(program, "sc"),
      inten: gl.getUniformLocation(program, "inten"),
      cap: gl.getUniformLocation(program, "cap"),
      fw: gl.getUniformLocation(program, "fw"),
      vbox: gl.getUniformLocation(program, "vbox"),
    };

    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let [inten, cap] = readTarget();
    let [targetInten, targetCap] = [inten, cap];
    let scroll = 0;
    let scale = 1;
    let raf = 0;
    let glassV = document.querySelector<HTMLElement>("[data-glass-v]");
    const start = performance.now();

    const resize = () => {
      // Rendered a little under device resolution: the field is soft
      // anyway and this keeps the fill cost low on big screens.
      scale = Math.min(1.5, window.devicePixelRatio || 1) * 0.85;
      const w = Math.max(1, Math.round(window.innerWidth * scale));
      const h = Math.max(1, Math.round(window.innerHeight * scale));
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(u.res, w, h);
      gl.uniform1f(
        u.fw,
        Math.max(12, Math.min(26, window.innerWidth / 52)) * scale,
      );
    };

    const updateGlassV = () => {
      if (!glassV || !glassV.isConnected) {
        glassV = document.querySelector<HTMLElement>("[data-glass-v]");
      }
      const r = glassV?.getBoundingClientRect();
      if (!r || r.width === 0 || r.bottom < 0 || r.top > window.innerHeight) {
        gl.uniform4f(u.vbox, 0, 0, 0, 0);
        return;
      }
      gl.uniform4f(
        u.vbox,
        r.left * scale,
        (window.innerHeight - r.bottom) * scale,
        r.width * scale,
        r.height * scale,
      );
    };

    const draw = (seconds: number) => {
      updateGlassV();
      gl.uniform1f(u.t, seconds);
      gl.uniform1f(u.sc, scroll);
      gl.uniform1f(u.inten, inten);
      gl.uniform1f(u.cap, cap);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scroll = max > 0 ? window.scrollY / max : 0;
      [targetInten, targetCap] = readTarget();
      if (reducedQuery.matches) {
        inten = targetInten;
        cap = targetCap;
        draw(20);
      }
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (document.hidden) return;
      inten += (targetInten - inten) * 0.06;
      cap += (targetCap - cap) * 0.06;
      draw((now - start) / 1000 + 20);
    };

    const run = () => {
      cancelAnimationFrame(raf);
      onScroll();
      if (reducedQuery.matches) draw(20);
      else raf = requestAnimationFrame(frame);
    };

    resize();
    canvas.dataset.live = "true";
    document.documentElement.classList.add("webgl");
    run();

    // Route changes swap the sections under the canvas; re-read targets.
    const observer = new MutationObserver(() => {
      glassV = null;
      onScroll();
    });
    const main = document.querySelector("main");
    if (main) observer.observe(main, { childList: true, subtree: true });

    const onResize = () => {
      resize();
      onScroll();
      if (reducedQuery.matches) draw(20);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    reducedQuery.addEventListener("change", run);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      document.documentElement.classList.remove("webgl");
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      reducedQuery.removeEventListener("change", run);
    };
  }, []);

  return <canvas ref={ref} className="texture-bg" aria-hidden="true" />;
}
