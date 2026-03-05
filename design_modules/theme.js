import { useEffect, useMemo, useState } from "react";

const THEME_STORAGE_KEY = "sporwave_theme_mode";

const LIGHT_THEME = {
  accent: "#111111",
  onAccent: "#FFFFFF",
  secondaryButton: "#2B2B2B",
  onSecondary: "#FFFFFF",
  bg: "#FFFFFF",
  bgAlt: "#FFFFFF",
  card: "#F4F4F4",
  cardBorder: "#BDBDBD",
  text: "#111111",
  textDim: "#555555",
  textMuted: "#777777",
  icon: "#111111",
  overlayHeader: "rgba(255,255,255,.92)",
};

const DARK_THEME = {
  accent: "#FFFFFF",
  onAccent: "#111111",
  secondaryButton: "#2A2A2A",
  onSecondary: "#FFFFFF",
  bg: "#111111",
  bgAlt: "#161616",
  card: "#1E1E1E",
  cardBorder: "#3A3A3A",
  text: "#FFFFFF",
  textDim: "#D1D1D1",
  textMuted: "#A9A9A9",
  icon: "#FFFFFF",
  overlayHeader: "rgba(17,17,17,.92)",
};

const SHARED_TOKENS = {
  white: "#FFFFFF",
  black: "#111111",
  red: "#111111",
  green: "#111111",
  orange: "#111111",
  gold: "#111111",
  purple: "#111111",
  success: "#111111",
  twitterBrand: "#111111",
  guestBg: "#6B7280",
  googleBlue: "#111111",
  googleGreen: "#111111",
  googleYellow: "#111111",
  googleRed: "#111111",
  shimmerLight: "#ECECEC",
  shimmerMid: "#CFCFCF",
  overlayScrim: "rgba(0,0,0,.35)",
  overlayScrimStrong: "rgba(0,0,0,.45)",
  overlayDark: "rgba(0,0,0,.6)",
  shadowSm: "0 4px 16px rgba(0,0,0,.1)",
  shadowMd: "0 4px 16px rgba(0,0,0,.3)",
  shadowLg: "0 8px 24px rgba(0,0,0,.25)",
  shadowPage: "0 0 40px rgba(0,0,0,.08)",
  shadowToggle: "0 1px 3px rgba(0,0,0,.3)",
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
