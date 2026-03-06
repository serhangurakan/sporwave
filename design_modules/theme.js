import { useEffect, useMemo, useState } from "react";

const THEME_STORAGE_KEY = "sporwave_theme_mode";

const LIGHT_THEME = {
  accent: "#111111",
  onAccent: "#FFFFFF",
  secondaryButton: "#2B2B2B",
  onSecondary: "#FFFFFF",
  bg: "#FFFFFF",
  bgAlt: "#F9F9F9",
  card: "#F4F4F4",
  cardElevated: "#ECECEC",
  cardBorder: "#BDBDBD",
  progressTrack: "#E0E0E0",
  text: "#111111",
  textDim: "#555555",
  textMuted: "#777777",
  icon: "#111111",
  overlayHeader: "rgba(255,255,255,.92)",
};

const DARK_THEME = {
  accent: "#86EE60",
  onAccent: "#0F1A0A",
  secondaryButton: "#242426",
  onSecondary: "#F5F5F5",
  bg: "#0F0F0F",
  bgAlt: "#161616",
  card: "#1C1C1E",
  cardElevated: "#242426",
  cardBorder: "#2C2C2E",
  progressTrack: "#2C2C2E",
  text: "#F5F5F5",
  textDim: "#ABABAB",
  textMuted: "#6B6B6B",
  icon: "#F5F5F5",
  overlayHeader: "rgba(15,15,15,.92)",
};

const SHARED_TOKENS = {
  white: "#FFFFFF",
  black: "#0F0F0F",
  red: "#FF453A",
  green: "#30D158",
  orange: "#FF9F0A",
  gold: "#FFD60A",
  purple: "#BF5AF2",
  success: "#30D158",
  twitterBrand: "#1D9BF0",
  guestBg: "#6B7280",
  googleBlue: "#4285F4",
  googleGreen: "#34A853",
  googleYellow: "#FBBC05",
  googleRed: "#EA4335",
  shimmerLight: "#ECECEC",
  shimmerMid: "#CFCFCF",
  overlayScrim: "rgba(0,0,0,.5)",
  overlayScrimStrong: "rgba(0,0,0,.65)",
  overlayDark: "rgba(0,0,0,.75)",
  shadowSm: "0 2px 8px rgba(0,0,0,.3)",
  shadowMd: "0 4px 16px rgba(0,0,0,.4)",
  shadowLg: "0 8px 24px rgba(0,0,0,.5)",
  shadowPage: "0 0 40px rgba(0,0,0,.2)",
  shadowToggle: "0 1px 3px rgba(0,0,0,.4)",
  shadowCard: "0 2px 12px rgba(0,0,0,.4)",
  shadowFab: "0 4px 16px rgba(134,238,96,.25)",
};

const THEMES = {
  light: LIGHT_THEME,
  dark: DARK_THEME,
};

function normalizeMode(mode) {
  return mode === "dark" ? "dark" : "light";
}

function resolveInitialMode() {
  if (typeof window === "undefined") return "light";
  const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === "light" || saved === "dark") return saved;
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

function buildTokens(mode) {
  return {
    ...SHARED_TOKENS,
    ...THEMES[normalizeMode(mode)],
  };
}

let currentMode = "light";
let initialized = false;
const listeners = new Set();

export const T = buildTokens("light");

function notifyThemeChange() {
  listeners.forEach((listener) => listener(currentMode));
}

function assignThemeTokens(mode) {
  Object.assign(T, buildTokens(mode));
}

export function getThemeMode() {
  return currentMode;
}

export function initThemeMode() {
  if (initialized) return currentMode;
  currentMode = resolveInitialMode();
  assignThemeTokens(currentMode);
  initialized = true;
  return currentMode;
}

export function setThemeMode(mode) {
  const nextMode = normalizeMode(mode);
  if (!initialized) initThemeMode();
  if (nextMode === currentMode) return;
  currentMode = nextMode;
  assignThemeTokens(nextMode);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(THEME_STORAGE_KEY, nextMode);
  }
  notifyThemeChange();
}

export function subscribeTheme(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useThemeMode() {
  const [mode, setMode] = useState(() => initThemeMode());

  useEffect(() => {
    const unsubscribe = subscribeTheme(setMode);
    return unsubscribe;
  }, []);

  const setTheme = useMemo(() => (nextMode) => setThemeMode(nextMode), []);
  return { mode, setTheme, T };
}

export default T;
