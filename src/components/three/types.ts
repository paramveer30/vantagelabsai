// An edge slam from the parkour figure: screen-space point, a timestamp so
// the shader only reacts to a fresh one, and how hard it landed (0–1).
export type Hit = { x: number; y: number; t: number; power: number };
