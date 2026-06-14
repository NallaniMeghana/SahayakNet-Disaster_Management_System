export interface ThemeConfig {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  gradient: string;
  glowColor: string;
  particleColor: string;
}

export const profileThemes: Record<string, ThemeConfig> = {
  skills: {
    name: "Community Skills",
    primary: "#00B4D8",
    secondary: "#0077B6",
    accent: "#48CAE4",
    gradient: "linear-gradient(135deg, #00B4D8 0%, #0077B6 50%, #023E8A 100%)",
    glowColor: "rgba(0, 180, 216, 0.4)",
    particleColor: "#48CAE4"
  },
  incident: {
    name: "Live Incidents",
    primary: "#EF476F",
    secondary: "#D62828",
    accent: "#F78C6B",
    gradient: "linear-gradient(135deg, #EF476F 0%, #D62828 50%, #9D0208 100%)",
    glowColor: "rgba(239, 71, 111, 0.4)",
    particleColor: "#F78C6B"
  },
  alerts: {
    name: "Emergency Alerts",
    primary: "#FFD166",
    secondary: "#F77F00",
    accent: "#FCBF49",
    gradient: "linear-gradient(135deg, #FFD166 0%, #F77F00 50%, #D62828 100%)",
    glowColor: "rgba(255, 209, 102, 0.4)",
    particleColor: "#FCBF49"
  },
  vulnerability: {
    name: "Vulnerability Registry",
    primary: "#06FFA5",
    secondary: "#00D9A3",
    accent: "#4DFFBE",
    gradient: "linear-gradient(135deg, #06FFA5 0%, #00D9A3 50%, #00BA88 100%)",
    glowColor: "rgba(6, 255, 165, 0.4)",
    particleColor: "#4DFFBE"
  },
  resources: {
    name: "Resource Sharing",
    primary: "#A78BFA",
    secondary: "#7C3AED",
    accent: "#C4B5FD",
    gradient: "linear-gradient(135deg, #A78BFA 0%, #7C3AED 50%, #5B21B6 100%)",
    glowColor: "rgba(167, 139, 250, 0.4)",
    particleColor: "#C4B5FD"
  },
  drills: {
    name: "Simulation & Drills",
    primary: "#FF6B9D",
    secondary: "#C026D3",
    accent: "#F9A8D4",
    gradient: "linear-gradient(135deg, #FF6B9D 0%, #C026D3 50%, #86198F 100%)",
    glowColor: "rgba(255, 107, 157, 0.4)",
    particleColor: "#F9A8D4"
  }
};
