export const glassCard: React.CSSProperties = {
  backgroundBlendMode: "var(--af-bg-card-blend)",
  backgroundColor: "var(--af-bg-card-color)",
  backgroundImage: "var(--af-bg-card-image)",
  border: "none",
  borderRadius: 16,
};

export const darkOrb = (
  size: number,
  color = "#231F1E",
): React.CSSProperties => ({
  alignItems: "center",
  background: `radial-gradient(60.93% 50% at 51.43% 0%, rgba(255,255,255,0.265) 0%, rgba(255,255,255,0.0053) 100%), ${color}`,
  borderRadius: 40,
  boxShadow:
    "22.5px 33.33px 15.83px rgba(0,0,0,0.03), 12.5px 19.17px 13.33px rgba(0,0,0,0.09), 5.83px 8.33px 10px rgba(0,0,0,0.15), 1.67px 2.5px 5.83px rgba(0,0,0,0.18), inset 0px 1.25px 0px rgba(255,255,255,0.36)",
  display: "flex",
  flexShrink: 0,
  height: size,
  justifyContent: "center",
  width: size,
});

export const tinyOrb = (size: number, color: string): React.CSSProperties => ({
  alignItems: "center",
  background: `radial-gradient(60.93% 50% at 51.43% 0%, rgba(255,255,255,0.265) 0%, rgba(255,255,255,0.0053) 100%), ${color}`,
  borderRadius: 40,
  display: "flex",
  flexShrink: 0,
  height: size,
  justifyContent: "center",
  width: size,
});
