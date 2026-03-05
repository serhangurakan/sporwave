import { useState, useEffect, Suspense, lazy } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import T, { useThemeMode } from "../../design_modules/theme.js";
import "./form-ui-standard.css";

// Auto-discover all .jsx files in design_modules/
const modules = import.meta.glob("../../design_modules/*.jsx");

// Build route entries: { name: "01_auth", path: "/01_auth", component: lazy(() => import(...)) }
const routes = Object.entries(modules).map(([filePath, importFn]) => {
  const fileName = filePath.split("/").pop().replace(".jsx", "");
  return {
    name: fileName,
    path: `/${fileName}`,
    component: lazy(importFn),
  };
});

// Module labels for display
const labels = {
  "01_auth": "Auth & Onboarding",
  "02_feed": "Feed & Search",
  "03_matches": "Matches & Sports",
  "04_match_detail": "Match Detail",
  "05_profile": "Profile",
  "06_messaging": "Messaging & Notifications",
  "07_settings": "Settings & Security",
};

function Home() {
  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ maxWidth: 480, width: "100%", padding: "40px 20px" }}>
        <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: T.text, fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
          Sporwave <span style={{ color: T.accent }}>Design</span>
        </h1>
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: T.textDim, fontSize: 14, marginBottom: 32 }}>
          {routes.length} modül mevcut
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {routes.map((r) => (
            <Link
              key={r.name}
              to={r.path}
              style={{
                textDecoration: "none",
                background: T.card,
                border: `1px solid ${T.cardBorder}`,
                borderRadius: 12,
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = T.accent)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = T.cardBorder)}
            >
              <div>
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: T.text, fontSize: 16, fontWeight: 600 }}>
                  {labels[r.name] || r.name}
                </div>
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: T.textDim, fontSize: 13, marginTop: 4 }}>
                  /{r.name}
                </div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.textDim} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function BackButton() {
  const location = useLocation();
  if (location.pathname === "/") return null;

  return (
    <Link
      to="/"
      style={{
        position: "fixed",
        top: 12,
        left: 12,
        zIndex: 9999,
        background: T.overlayHeader,
        backdropFilter: "blur(8px)",
        border: `1px solid ${T.cardBorder}`,
        borderRadius: 10,
        padding: "8px 14px",
        display: "flex",
        alignItems: "center",
        gap: 6,
        textDecoration: "none",
        color: T.textDim,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: 13,
        fontWeight: 500,
        transition: "color 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = T.accent)}
      onMouseLeave={(e) => (e.currentTarget.style.color = T.textDim)}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 18l-6-6 6-6" />
      </svg>
      Modüller
    </Link>
  );
}

function Loading() {
  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: T.textDim, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14 }}>
        Yükleniyor...
      </div>
    </div>
  );
}

export default function App() {
  useThemeMode();

  return (
    <>
      <BackButton />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          {routes.map((r) => (
            <Route key={r.name} path={r.path} element={<r.component />} />
          ))}
        </Routes>
      </Suspense>
    </>
  );
}
