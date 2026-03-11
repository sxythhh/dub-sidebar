export interface PodiumStyle {
  rank: 1 | 2 | 3;
  accent: string;
  border: string;
  gradient: string;
  textColor: string;
  avatarSize: number;
  height: number;
  glowOpacity: number;
  pillBg: string;
}

export const PODIUM_STYLES: PodiumStyle[] = [
  {
    accent: "#A5B9CC",
    avatarSize: 64,
    border: "rgba(165,185,204,0.4)",
    glowOpacity: 0.12,
    gradient: "var(--af-podium-silver-grad)",
    height: 241,
    pillBg:
      "radial-gradient(263.05% 100% at 50.57% 0%, rgba(202,205,208,0.32) 0%, rgba(165,185,204,0.32) 100%)",
    rank: 2,
    textColor: "var(--af-podium-silver-text)",
  },
  {
    accent: "#F1A624",
    avatarSize: 72,
    border: "rgba(241,166,36,0.4)",
    glowOpacity: 0.16,
    gradient:
      "linear-gradient(179.9deg, rgba(252,224,166,0.32) 0.08%, rgba(241,166,36,0) 99.92%), var(--af-podium-radial)",
    height: 265,
    pillBg:
      "radial-gradient(263.05% 100% at 50.57% 0%, rgba(241,166,36,0.128) 0%, rgba(241,166,36,0.32) 100%)",
    rank: 1,
    textColor: "#F1A624",
  },
  {
    accent: "#7D4C18",
    avatarSize: 56,
    border: "rgba(125,76,24,0.4)",
    glowOpacity: 0.06,
    gradient: "var(--af-podium-bronze-grad)",
    height: 217,
    pillBg:
      "radial-gradient(263.05% 100% at 50.57% 0%, rgba(219,148,71,0.32) 0%, rgba(125,76,24,0.32) 100%)",
    rank: 3,
    textColor: "var(--af-podium-bronze-text)",
  },
];
