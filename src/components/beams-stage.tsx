"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const Beams = dynamic(() => import("@/components/three/beams"), { ssr: false });

type Config = {
  beamCount: number;
  beamWidth: number;
  beamHeight: number;
  speed: number;
  noiseIntensity: number;
  scale: number;
  rotation: number;
  lightIntensity: number;
  ambientIntensity: number;
  beamColor: string;
  lightColor: string;
};

const initial: Config = {
  beamCount: 14,
  beamWidth: 2.4,
  beamHeight: 16,
  speed: 1.6,
  noiseIntensity: 1.5,
  scale: 0.2,
  rotation: 28,
  lightIntensity: 1,
  ambientIntensity: 0.9,
  beamColor: "#05070f",
  lightColor: "#3ad0ff",
};

const ranges: Record<
  keyof Omit<Config, "beamColor" | "lightColor">,
  [number, number, number]
> = {
  beamCount: [2, 30, 1],
  beamWidth: [0.5, 6, 0.1],
  beamHeight: [4, 30, 1],
  speed: [0, 6, 0.1],
  noiseIntensity: [0, 4, 0.05],
  scale: [0.02, 1, 0.01],
  rotation: [-90, 90, 1],
  lightIntensity: [0, 6, 0.1],
  ambientIntensity: [0, 3, 0.1],
};

export function BeamsStage() {
  const [cfg, setCfg] = useState<Config>(initial);

  const set = <K extends keyof Config>(key: K, value: Config[K]) =>
    setCfg((c) => ({ ...c, [key]: value }));

  return (
    <div className="fixed inset-0 bg-background">
      <Beams {...cfg} />

      <div className="absolute right-4 top-4 max-h-[calc(100vh-2rem)] w-72 overflow-auto rounded-xl border border-border bg-background/85 p-4 text-xs backdrop-blur">
        {(
          Object.keys(ranges) as (keyof typeof ranges)[]
        ).map((key) => {
          const [min, max, step] = ranges[key];
          return (
            <label key={key} className="mb-3 block">
              <span className="flex justify-between text-muted">
                <span>{key}</span>
                <span className="text-foreground">{cfg[key]}</span>
              </span>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={cfg[key]}
                onChange={(e) => set(key, Number(e.target.value))}
                className="mt-1 w-full"
              />
            </label>
          );
        })}

        <label className="mb-2 flex items-center justify-between">
          <span className="text-muted">beamColor</span>
          <input
            type="color"
            value={cfg.beamColor}
            onChange={(e) => set("beamColor", e.target.value)}
          />
        </label>
        <label className="mb-3 flex items-center justify-between">
          <span className="text-muted">lightColor</span>
          <input
            type="color"
            value={cfg.lightColor}
            onChange={(e) => set("lightColor", e.target.value)}
          />
        </label>

        <pre className="mt-2 whitespace-pre-wrap break-all rounded bg-surface p-2 text-[10px] text-muted">
          {JSON.stringify(cfg, null, 2)}
        </pre>
        <button
          type="button"
          onClick={() => setCfg(initial)}
          className="mt-2 w-full rounded border border-border py-1 text-muted hover:text-foreground"
        >
          reset
        </button>
      </div>
    </div>
  );
}
