// Shared color constants for the ProcessWorkflow view

const colors = {
  bg: "#0a0f1a",
  cardBg: "#131b2e",
  border: "#1e2d4a",
  borderHover: "#2a3f66",
  text: "#f0f4f8",
  muted: "#7a8ba8",
  slate: "#94a3b8",
  cyan: "#22d3ee",
  cyanDim: "rgba(34,211,238,0.08)",
  violet: "#a78bfa",
  violetDim: "rgba(167,139,250,0.08)",
  emerald: "#34d399",
  emeraldDim: "rgba(52,211,153,0.08)",
  amber: "#fbbf24",
  amberDim: "rgba(251,191,36,0.08)",
  rose: "#fb7185",
  roseDim: "rgba(251,113,133,0.08)",
} as const;


type ColorsType = typeof colors;

export { colors };
export type { ColorsType };
