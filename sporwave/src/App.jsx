import { useState, useEffect, useCallback, useRef } from "react";

// ============================================================
// SPORWAVE v2 — Interactive Wireframe (Batch 1: Core Experience)
// Hevy-inspired dark theme, phone frame, clickable prototype
// ============================================================

// --- Design Tokens ---
const T = {
  bg: "#0B0F14",
  bg2: "#131920",
  surface: "#1A2029",
  surface2: "#222B36",
  border: "#2A3441",
  text: "#F1F4F8",
  text2: "#8B99AB",
  text3: "#556270",
  accent: "#B7F000",
  accentDark: "#8BBF00",
  accentGhost: "rgba(183,240,0,0.10)",
  accentText: "#B7F000",
  red: "#EF4444",
  green: "#22C55E",
  orange: "#F59E0B",
  blue: "#3B82F6",
  white: "#FFFFFF",
  radius: "14px",
  radiusSm: "8px",
  radiusLg: "20px",
  radiusFull: "50%",
};

// --- Dummy Data ---
const USERS = [
  { id: 1, name: "Berk Başdemir", username: "berkbasdemir", avatar: "🧑‍💼", matches: 60, followers: 47, following: 32, verified: true, city: "Kadıköy", bio: "Halısaha tutkunu ⚽", weeklyMatches: [2,3,1,2,4,2,3,1,2,3,4,2], goals: 34, assists: 21, wins: 38, losses: 15, draws: 7, mvpCount: 12 },
  { id: 2, name: "Ali Yılmaz", username: "aliyilmaz", avatar: "👨‍🦱", matches: 45, followers: 23, following: 18, verified: false, city: "Beşiktaş", bio: "Futbol > everything", weeklyMatches: [1,2,2,1,3,2,1,2,1,2,3,1], goals: 22, assists: 15, wins: 25, losses: 12, draws: 8, mvpCount: 5 },
  { id: 3, name: "Mehmet Kaya", username: "mehmetkaya", avatar: "👨‍🦰", matches: 32, followers: 15, following: 12, verified: true, city: "Kadıköy", bio: "", weeklyMatches: [1,1,2,1,1,2,1,1,2,2,1,1], goals: 15, assists: 8, wins: 18, losses: 10, draws: 4, mvpCount: 3 },
  { id: 4, name: "Can Demir", username: "candemir", avatar: "🧔", matches: 28, followers: 11, following: 9, verified: false, city: "Bakırköy", bio: "", weeklyMatches: [1,0,1,2,1,1,2,1,0,1,2,1], goals: 10, assists: 12, wins: 15, losses: 8, draws: 5, mvpCount: 2 },
  { id: 5, name: "Emre Özkan", username: "emreozkan", avatar: "👱", matches: 55, followers: 38, following: 25, verified: true, city: "Kadıköy", bio: "Sol kanat", weeklyMatches: [2,3,2,3,2,3,2,2,3,2,3,2], goals: 40, assists: 18, wins: 35, losses: 12, draws: 8, mvpCount: 15 },
];

const PAST_MATCHES = [
  { id: 101, title: "Kadıköy Halısaha Klasik", date: "23 Şub 2026", time: "20:00", duration: "1s 25dk", score: [5, 3], format: "6v6", location: "Fenerbahçe Halısaha", userId: 1, team1: [1, 2, 5], team2: [3, 4], team1Name: "Sarı Takım", team2Name: "Kırmızı Takım", goals: [{min: 8, scorer: 1, assist: 2}, {min: 15, scorer: 5, assist: 1}, {min: 22, scorer: 3, assist: 4}, {min: 30, scorer: 1, assist: 5}, {min: 38, scorer: 2, assist: null}, {min: 45, scorer: 5, assist: 2}, {min: 55, scorer: 3, assist: null}, {min: 62, scorer: 1, assist: 2}], mvp: 1, likes: 24, comments: [{userId: 2, text: "Harika maçtı! 🔥", time: "2s"}, {userId: 3, text: "Rövanş istiyoruz", time: "1s"}], photos: true },
  { id: 102, title: "Beşiktaş Pazar Maçı", date: "22 Şub 2026", time: "18:00", duration: "1s 10dk", score: [2, 2], format: "5v5", location: "BJK Halısaha", userId: 2, team1: [2, 4], team2: [3, 5], team1Name: "Mavi", team2Name: "Beyaz", goals: [{min: 12, scorer: 2, assist: 4}, {min: 25, scorer: 5, assist: 3}, {min: 40, scorer: 4, assist: 2}, {min: 58, scorer: 3, assist: null}], mvp: 5, likes: 18, comments: [{userId: 1, text: "Güzel beraberlik 👏", time: "3s"}], photos: false },
  { id: 103, title: "Bakırköy Akşam Maçı", date: "21 Şub 2026", time: "21:00", duration: "1s 30dk", score: [4, 1], format: "7v7", location: "Bakırköy Spor Tesisi", userId: 5, team1: [5, 1, 3], team2: [2, 4], team1Name: "Yeşil", team2Name: "Turuncu", goals: [{min: 5, scorer: 5, assist: 1}, {min: 18, scorer: 1, assist: 5}, {min: 33, scorer: 5, assist: 3}, {min: 50, scorer: 2, assist: 4}, {min: 65, scorer: 3, assist: 1}], mvp: 5, likes: 31, comments: [{userId: 4, text: "Emre fırtına gibi oynadı", time: "5s"}], photos: true },
];

const OPEN_MATCHES = [
  { id: 201, title: "Cumartesi Akşam Halısaha", date: "1 Mar 2026", time: "20:00", location: "Kadıköy Spor Merkezi", format: "6v6", organizer: 2, maxPlayers: 12, currentPlayers: 8, level: "Herkes", approvalMode: "Herkesi Kabul Et", joined: false, friendJoined: null, participants: [2, 3, 5] },
  { id: 202, title: "Caddebostan Tenis Kortu Yanı Maç", date: "28 Şub 2026", time: "19:00", location: "Caddebostan Halısaha", format: "5v5", organizer: 3, maxPlayers: 10, currentPlayers: 7, level: "Orta+", approvalMode: "Onay ile Kabul Et", joined: true, friendJoined: null, participants: [3, 1, 4] },
  { id: 203, title: "Beşiktaş Hafta Sonu Maçı", date: "1 Mar 2026", time: "16:00", location: "BJK Halısaha", format: "7v7", organizer: 4, maxPlayers: 14, currentPlayers: 5, level: "Herkes", approvalMode: "Herkesi Kabul Et", joined: false, friendJoined: 5, participants: [4, 5, 2] },
  { id: 204, title: "Ataşehir Gece Maçı", date: "2 Mar 2026", time: "22:00", location: "Ataşehir Spor Tesisi", format: "5v5", organizer: 5, maxPlayers: 10, currentPlayers: 9, level: "İyi+", approvalMode: "Onay ile Kabul Et", joined: false, friendJoined: null, participants: [5, 1] },
];

const getUserById = (id) => USERS.find(u => u.id === id) || USERS[0];

// --- Icons (simple SVG) ---
const Icon = ({ name, size = 18, color = T.text2 }) => {
  const icons = {
    home: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    ball: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 000 20M2 12h20"/></svg>,
    user: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    search: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    bell: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
    chat: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    back: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>,
    chevDown: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>,
    filter: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
    heart: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
    comment: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>,
    share: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>,
    trophy: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M6 9H4a2 2 0 01-2-2V5a2 2 0 012-2h2M18 9h2a2 2 0 002-2V5a2 2 0 00-2-2h-2M9 22h6M12 17v5"/><path d="M6 3h12v6a6 6 0 01-12 0V3z"/></svg>,
    calendar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    chart: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    settings: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
    clock: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    mapPin: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    users: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    fire: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M12 12c2-2.96 0-7-1-8 0 3.038-1.773 4.741-3 6-1.226 1.26-2 3.24-2 5a6 6 0 1012 0c0-1.532-1.056-3.94-2-5-1.786 3-2.791 3-4 2z"/></svg>,
    star: <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
    edit: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    globe: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
  };
  return icons[name] || null;
};

// --- Shared Components ---
const Avatar = ({ emoji, size = 36, border = false }) => (
  <div style={{ width: size, height: size, borderRadius: T.radiusFull, background: `linear-gradient(135deg, ${T.surface2}, ${T.border})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.5, flexShrink: 0, border: border ? `2px solid ${T.accent}` : "none" }}>
    {emoji}
  </div>
);

const Badge = ({ text, color = T.accent, bg = T.accentGhost }) => (
  <span style={{ fontSize: 10, fontWeight: 700, color, background: bg, padding: "2px 8px", borderRadius: 12, letterSpacing: 0.3 }}>{text}</span>
);

const ProgressBar = ({ current, max }) => (
  <div style={{ height: 4, background: T.surface2, borderRadius: 2, overflow: "hidden", flex: 1 }}>
    <div style={{ height: "100%", width: `${(current / max) * 100}%`, background: T.accent, borderRadius: 2, transition: "width 0.3s" }} />
  </div>
);

// Clickable name component - taps navigate to profile
const ClickableName = ({ userId, onProfile, style = {} }) => {
  const user = getUserById(userId);
  return (
    <span
      onClick={(e) => { e.stopPropagation(); onProfile?.(userId); }}
      style={{ fontWeight: 700, color: T.text, cursor: "pointer", textDecoration: "none", ...style }}
    >
      {user.name}
    </span>
  );
};

// --- Phone Frame ---
const PhoneFrame = ({ children }) => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#000", fontFamily: "'DM Sans', 'SF Pro Display', -apple-system, sans-serif", padding: 20 }}>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
    <div style={{ width: 375, height: 812, borderRadius: 44, background: T.bg, overflow: "hidden", position: "relative", boxShadow: "0 8px 48px rgba(0,0,0,0.4), 0 0 0 2px #2A2A2A", display: "flex", flexDirection: "column" }}>
      {/* Status bar */}
      <div style={{ height: 50, padding: "12px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>13:58</span>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <div style={{ width: 16, height: 10, border: `1px solid ${T.text}`, borderRadius: 2, position: "relative" }}>
            <div style={{ position: "absolute", left: 1, top: 1, bottom: 1, width: "70%", background: T.text, borderRadius: 1 }} />
          </div>
        </div>
      </div>
      {children}
    </div>
  </div>
);

// --- Top Navbar ---
const TopNav = ({ left, center, right, onSearch, onNotif, onChat }) => (
  <div style={{ height: 44, padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
    <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 4 }}>{left}</div>
    {center && <div style={{ flex: 2, textAlign: "center" }}>{center}</div>}
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 14 }}>
      {right}
    </div>
  </div>
);

// --- Tab Bar ---
const TabBar = ({ active, onTab }) => {
  const tabs = [
    { id: "home", icon: "home", label: "Ana Sayfa" },
    { id: "matches", icon: "ball", label: "Maçlar" },
    { id: "profile", icon: "user", label: "Profil" },
  ];
  return (
    <div style={{ height: 68, background: T.bg2, borderTop: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-around", paddingBottom: 8, flexShrink: 0 }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onTab(t.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "none", border: "none", cursor: "pointer", padding: "6px 20px" }}>
          <Icon name={t.icon} size={22} color={active === t.id ? T.accent : T.text3} />
          <span style={{ fontSize: 10, fontWeight: active === t.id ? 700 : 500, color: active === t.id ? T.accent : T.text3 }}>{t.label}</span>
        </button>
      ))}
    </div>
  );
};

// --- Match Card (Feed) --- UPDATED: clickable names everywhere
const MatchCard = ({ match, onTap, onProfile }) => {
  const user = getUserById(match.userId);
  const [liked, setLiked] = useState(false);
  return (
    <div style={{ background: T.surface, borderRadius: T.radius, margin: "0 0 12px", overflow: "hidden", border: `1px solid ${T.border}` }}>
      {/* Header */}
      <div style={{ padding: "12px 14px 8px", display: "flex", alignItems: "center", gap: 10 }}>
        <div onClick={() => onProfile?.(user.id)} style={{ cursor: "pointer" }}><Avatar emoji={user.avatar} size={34} /></div>
        <div style={{ flex: 1 }} onClick={() => onProfile?.(user.id)}>
          <span style={{ fontSize: 13, fontWeight: 700, color: T.text, cursor: "pointer" }}>{user.name}</span>
          <div style={{ fontSize: 11, color: T.text3, marginTop: 1 }}>{match.date} · {match.time}</div>
        </div>
        <span style={{ fontSize: 16, color: T.text3, cursor: "pointer" }}>⋮</span>
      </div>
      {/* Title + Stats */}
      <div style={{ padding: "0 14px 8px" }} onClick={() => onTap?.(match)}>
        <div style={{ fontSize: 15, fontWeight: 800, color: T.text, marginBottom: 6, cursor: "pointer" }}>{match.title}</div>
        <div style={{ display: "flex", gap: 12, fontSize: 12, color: T.text2 }}>
          <span>⏱ {match.duration}</span>
          <span>⚽ {match.score[0]}-{match.score[1]}</span>
          <span>👥 {match.format}</span>
        </div>
      </div>
      {/* Score display */}
      <div onClick={() => onTap?.(match)} style={{ padding: "10px 14px", background: T.bg2, display: "flex", alignItems: "center", justifyContent: "center", gap: 16, cursor: "pointer" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 11, color: T.text2, marginBottom: 4 }}>{match.team1Name}</div>
          <div style={{ display: "flex", gap: 4 }}>{match.team1.map(id => <div key={id} onClick={(e) => { e.stopPropagation(); onProfile?.(id); }} style={{ cursor: "pointer" }}><Avatar emoji={getUserById(id).avatar} size={24} /></div>)}</div>
        </div>
        <div style={{ fontSize: 28, fontWeight: 800, color: T.text, letterSpacing: 2 }}>
          {match.score[0]} <span style={{ color: T.text3, fontSize: 18 }}>—</span> {match.score[1]}
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 11, color: T.text2, marginBottom: 4 }}>{match.team2Name}</div>
          <div style={{ display: "flex", gap: 4 }}>{match.team2.map(id => <div key={id} onClick={(e) => { e.stopPropagation(); onProfile?.(id); }} style={{ cursor: "pointer" }}><Avatar emoji={getUserById(id).avatar} size={24} /></div>)}</div>
        </div>
      </div>
      {/* Photos placeholder */}
      {match.photos && (
        <div style={{ padding: "8px 14px 4px", display: "flex", gap: 6 }}>
          {[1,2].map(i => <div key={i} style={{ width: 80, height: 80, borderRadius: T.radiusSm, background: `linear-gradient(135deg, ${T.surface2}, ${T.border})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: T.text3 }}>📸</div>)}
        </div>
      )}
      {/* MVP - clickable name */}
      {match.mvp && (
        <div style={{ padding: "6px 14px", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 11, color: T.orange }}>⭐ Maçın Yıldızı:</span>
          <ClickableName userId={match.mvp} onProfile={onProfile} style={{ fontSize: 11 }} />
        </div>
      )}
      {/* Interaction */}
      <div style={{ padding: "8px 14px 6px", display: "flex", alignItems: "center", gap: 20, borderTop: `1px solid ${T.border}` }}>
        <button onClick={(e) => { e.stopPropagation(); setLiked(!liked); }} style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: 5, cursor: "pointer", padding: 0 }}>
          <Icon name="heart" size={18} color={liked ? T.red : T.text3} />
          <span style={{ fontSize: 12, color: liked ? T.red : T.text3, fontWeight: 600 }}>{match.likes + (liked ? 1 : 0)}</span>
        </button>
        <button style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: 5, cursor: "pointer", padding: 0 }}>
          <Icon name="comment" size={18} color={T.text3} />
          <span style={{ fontSize: 12, color: T.text3, fontWeight: 600 }}>{match.comments.length}</span>
        </button>
        <button style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: 5, cursor: "pointer", padding: 0 }}>
          <Icon name="share" size={18} color={T.text3} />
        </button>
      </div>
      {/* Likes line - clickable name */}
      {match.likes > 0 && (
        <div style={{ padding: "0 14px 6px", fontSize: 11, color: T.text2 }}>
          <span style={{ fontWeight: 700, color: T.text }}>Beğenenler: </span>
          <ClickableName userId={2} onProfile={onProfile} style={{ fontSize: 11 }} />
          <span> ve diğerleri</span>
        </div>
      )}
      {/* Last comment - clickable username */}
      {match.comments.length > 0 && (
        <div style={{ padding: "0 14px 6px" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <div onClick={() => onProfile?.(match.comments[0].userId)} style={{ cursor: "pointer" }}>
              <Avatar emoji={getUserById(match.comments[0].userId).avatar} size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <ClickableName userId={match.comments[0].userId} onProfile={onProfile} style={{ fontSize: 11 }} />
              <span style={{ fontSize: 11, color: T.text3, marginLeft: 6 }}>{match.comments[0].time}</span>
              <div style={{ fontSize: 12, color: T.text2, marginTop: 2 }}>{match.comments[0].text}</div>
            </div>
          </div>
        </div>
      )}
      {/* Add comment */}
      <div style={{ padding: "4px 14px 10px", display: "flex", alignItems: "center", gap: 8 }}>
        <Avatar emoji={USERS[0].avatar} size={22} />
        <div style={{ flex: 1, fontSize: 12, color: T.text3, background: T.bg2, borderRadius: 20, padding: "7px 12px" }}>
          Bir yorum ekle...
        </div>
      </div>
    </div>
  );
};

// --- Open Match Card (Matches Tab) ---
const OpenMatchCard = ({ match, highlight, friendName, onTap }) => {
  const org = getUserById(match.organizer);
  return (
    <div onClick={() => onTap?.(match)} style={{ background: highlight ? T.surface : T.surface, borderRadius: T.radius, padding: 14, margin: "0 0 10px", cursor: "pointer", border: highlight ? `1.5px solid ${T.accent}` : `1px solid ${T.border}`, position: "relative", borderLeft: highlight ? `4px solid ${T.accent}` : undefined }}>
      {highlight && <Badge text="Katılıyorsun ✓" color={T.bg} bg={T.accent} />}
      {friendName && !highlight && <div style={{ marginBottom: 6 }}><Badge text={`🤝 ${friendName} katılıyor`} color={T.accent} bg={T.accentGhost} /></div>}
      <div style={{ fontSize: 14, fontWeight: 800, color: T.text, marginTop: highlight ? 8 : 0 }}>{match.title}</div>
      <div style={{ display: "flex", gap: 10, marginTop: 6, fontSize: 11, color: T.text2, flexWrap: "wrap" }}>
        <span>📅 {match.date} · {match.time}</span>
        <span>📍 {match.location}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
        <Avatar emoji={org.avatar} size={22} />
        <span style={{ fontSize: 11, color: T.text2 }}>{org.name}</span>
        <span style={{ fontSize: 11, color: T.text3 }}>· {match.format}</span>
        {match.level !== "Herkes" && <Badge text={match.level} color={T.orange} bg="rgba(245,158,11,0.12)" />}
        {match.approvalMode === "Onay ile Kabul Et" && <Badge text="Onay gerekli" color={T.blue} bg="rgba(59,130,246,0.12)" />}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
        <span style={{ fontSize: 11, color: T.text2, fontWeight: 600 }}>{match.currentPlayers}/{match.maxPlayers} oyuncu</span>
        <ProgressBar current={match.currentPlayers} max={match.maxPlayers} />
      </div>
    </div>
  );
};

// --- Mini Bar Chart (Hevy-style) ---
const BarChart = ({ data, height = 100, label = "Maç" }) => {
  const max = Math.max(...data, 1);
  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height, padding: "0 4px" }}>
        {data.map((v, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
            <div style={{ width: "100%", height: `${(v / max) * 100}%`, minHeight: v > 0 ? 4 : 0, background: i === data.length - 1 ? T.accent : T.blue, borderRadius: "3px 3px 0 0", transition: "height 0.3s" }} />
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
        {["", "", "", "", "", "", "", "", "", "", "", ""].map((_, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 8, color: T.text3 }}>
            {i === 0 ? "12h" : i === 5 ? "6h" : i === 11 ? "Bu" : ""}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        {["Maç", "Gol", "Süre"].map((l, i) => (
          <button key={l} style={{ fontSize: 11, fontWeight: i === 0 ? 700 : 500, color: i === 0 ? T.accent : T.text3, background: i === 0 ? T.accentGhost : "transparent", border: "none", borderRadius: 16, padding: "4px 12px", cursor: "pointer" }}>{l}</button>
        ))}
      </div>
    </div>
  );
};

// --- Pano Grid (Hevy-style) --- UPDATED: 3 items (removed Maçlar), side by side
const PanoGrid = () => {
  const items = [
    { icon: "chart", label: "İstatistikler" },
    { icon: "trophy", label: "Başarılar" },
    { icon: "calendar", label: "Takvim" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      {items.map(item => (
        <div key={item.label} style={{ background: T.surface2, borderRadius: T.radius, padding: "14px 10px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer" }}>
          <Icon name={item.icon} size={20} color={T.text2} />
          <span style={{ fontSize: 11, fontWeight: 600, color: T.text, textAlign: "center" }}>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

// ============================================================
// PAGES
// ============================================================

// --- Splash ---
const SplashPage = ({ onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 1800); return () => clearTimeout(t); }, []);
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: T.bg }}>
      <div style={{ fontSize: 48, marginBottom: 12, animation: "pulse 1s ease-in-out infinite" }}>⚽</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: T.text, letterSpacing: -0.5 }}>Spor<span style={{ color: T.accent }}>Wave</span></div>
      <div style={{ fontSize: 12, color: T.text3, marginTop: 8 }}>Maçını bul. Skorunu tut. Paylaş.</div>
      <div style={{ marginTop: 32, width: 24, height: 24, border: `2px solid ${T.accent}`, borderTopColor: "transparent", borderRadius: T.radiusFull, animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } } @keyframes pulse { 0%,100% { transform: scale(1) } 50% { transform: scale(1.1) } }`}</style>
    </div>
  );
};

// --- Home Feed ---
const HomePage = ({ onMatchTap, onProfile, feedMode, setFeedMode }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <TopNav
        left={
          <button onClick={() => setShowDropdown(!showDropdown)} style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: 4, cursor: "pointer", padding: 0 }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: T.text }}>{feedMode === "home" ? "Ana Sayfa" : "Keşfet"}</span>
            <Icon name="chevDown" size={18} color={T.text} />
          </button>
        }
        right={<>
          <button style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}><Icon name="search" size={22} color={T.text2} /></button>
          <div style={{ position: "relative" }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}><Icon name="bell" size={22} color={T.text2} /></button>
            <div style={{ position: "absolute", top: -2, right: -2, width: 8, height: 8, background: T.red, borderRadius: T.radiusFull, border: `2px solid ${T.bg}` }} />
          </div>
        </>}
      />
      {/* Dropdown */}
      {showDropdown && (
        <div style={{ position: "absolute", top: 94, left: 16, zIndex: 100, background: T.surface2, borderRadius: T.radius, border: `1px solid ${T.border}`, padding: 4, boxShadow: "0 8px 32px rgba(0,0,0,0.3)", width: 220 }}>
          {[{ id: "home", icon: "home", label: "Ana Sayfa (Takip edilenler)" }, { id: "discover", icon: "globe", label: "Keşfet" }].map(opt => (
            <button key={opt.id} onClick={() => { setFeedMode(opt.id); setShowDropdown(false); }} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", background: "none", border: "none", cursor: "pointer", borderRadius: T.radiusSm }}>
              <Icon name={opt.icon} size={18} color={feedMode === opt.id ? T.text : T.text3} />
              <span style={{ fontSize: 13, color: feedMode === opt.id ? T.text : T.text3, fontWeight: feedMode === opt.id ? 700 : 400, flex: 1, textAlign: "left" }}>{opt.label}</span>
              {feedMode === opt.id && <Icon name="check" size={16} color={T.text} />}
            </button>
          ))}
        </div>
      )}
      {/* Suggested users (only in Discover) */}
      {feedMode === "discover" && (
        <div style={{ padding: "8px 0 4px" }}>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", padding: "0 16px", scrollbarWidth: "none" }}>
            {USERS.slice(1).map(u => (
              <div key={u.id} onClick={() => onProfile?.(u.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: 72, cursor: "pointer" }}>
                <Avatar emoji={u.avatar} size={48} />
                <span style={{ fontSize: 10, color: T.text2, textAlign: "center", maxWidth: 72, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.name.split(" ")[0]}</span>
                <button onClick={e => e.stopPropagation()} style={{ fontSize: 9, fontWeight: 700, color: T.accent, background: T.accentGhost, border: "none", borderRadius: 10, padding: "3px 10px", cursor: "pointer" }}>Takip Et</button>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Feed */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 14px 14px", scrollbarWidth: "none" }}>
        {PAST_MATCHES.map(m => (
          <MatchCard key={m.id} match={m} onTap={onMatchTap} onProfile={onProfile} />
        ))}
      </div>
    </div>
  );
};

// --- Matches Tab ---
const MatchesPage = ({ onUpcomingTap, onFAB }) => {
  const [showFilter, setShowFilter] = useState(false);
  const joined = OPEN_MATCHES.filter(m => m.joined);
  const friendMatches = OPEN_MATCHES.filter(m => !m.joined && m.friendJoined);
  const other = OPEN_MATCHES.filter(m => !m.joined && !m.friendJoined);
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <TopNav
        left={<span style={{ fontSize: 20, fontWeight: 800, color: T.text }}>Maçlar</span>}
        right={
          <button onClick={() => setShowFilter(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <Icon name="filter" size={20} color={T.text2} />
          </button>
        }
      />
      <div style={{ flex: 1, overflowY: "auto", padding: "4px 14px 80px", scrollbarWidth: "none" }}>
        {/* Joined matches - highlighted */}
        {joined.length > 0 && joined.map(m => (
          <OpenMatchCard key={m.id} match={m} highlight={true} onTap={onUpcomingTap} />
        ))}
        {/* Friend matches */}
        {friendMatches.map(m => (
          <OpenMatchCard key={m.id} match={m} friendName={getUserById(m.friendJoined).name} onTap={onUpcomingTap} />
        ))}
        {/* Other open matches */}
        {other.map(m => (
          <OpenMatchCard key={m.id} match={m} onTap={onUpcomingTap} />
        ))}
      </div>
      {/* FAB */}
      <button onClick={onFAB} style={{ position: "absolute", bottom: 86, right: 22, width: 54, height: 54, borderRadius: 16, background: T.accent, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 20px rgba(183,240,0,0.35)`, zIndex: 50 }}>
        <Icon name="plus" size={26} color={T.bg} />
      </button>
      {/* Filter Popup */}
      {showFilter && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "flex-end" }} onClick={() => setShowFilter(false)}>
          <div onClick={e => e.stopPropagation()} style={{ width: "100%", background: T.bg2, borderRadius: "20px 20px 0 0", padding: 20, maxHeight: "60%" }}>
            <div style={{ width: 40, height: 4, background: T.border, borderRadius: 2, margin: "0 auto 16px" }} />
            <div style={{ fontSize: 16, fontWeight: 800, color: T.text, marginBottom: 16 }}>Filtrele</div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: T.text2, marginBottom: 8 }}>Konum</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["Tümü", "Kadıköy", "Beşiktaş", "Bakırköy", "Ataşehir"].map((l, i) => (
                  <button key={l} style={{ fontSize: 11, padding: "6px 14px", borderRadius: 16, background: i === 0 ? T.accent : T.surface2, color: i === 0 ? T.bg : T.text2, border: "none", fontWeight: 600, cursor: "pointer" }}>{l}</button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: T.text2, marginBottom: 8 }}>Tarih</div>
              <div style={{ display: "flex", gap: 6 }}>
                {["Tümü", "Bugün", "Bu Hafta", "Bu Ay"].map((l, i) => (
                  <button key={l} style={{ fontSize: 11, padding: "6px 14px", borderRadius: 16, background: i === 0 ? T.accent : T.surface2, color: i === 0 ? T.bg : T.text2, border: "none", fontWeight: 600, cursor: "pointer" }}>{l}</button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: T.text2, marginBottom: 8 }}>Görünüm</div>
              <div style={{ display: "flex", gap: 6 }}>
                {["Tüm Maçlar", "Katıldıklarım", "Açık Maçlar"].map((l, i) => (
                  <button key={l} style={{ fontSize: 11, padding: "6px 12px", borderRadius: 16, background: i === 0 ? T.accent : T.surface2, color: i === 0 ? T.bg : T.text2, border: "none", fontWeight: 600, cursor: "pointer" }}>{l}</button>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowFilter(false)} style={{ flex: 1, padding: "12px", borderRadius: T.radius, background: T.accent, color: T.bg, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer" }}>Uygula</button>
              <button style={{ padding: "12px 20px", borderRadius: T.radius, background: T.surface2, color: T.text2, fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer" }}>Sıfırla</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- FAB Bottom Sheet ---
const FABSheet = ({ onClose, onStart, onCreate }) => (
  <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "flex-end" }} onClick={onClose}>
    <div onClick={e => e.stopPropagation()} style={{ width: "100%", background: T.bg2, borderRadius: "20px 20px 0 0", padding: 20 }}>
      <div style={{ width: 40, height: 4, background: T.border, borderRadius: 2, margin: "0 auto 16px" }} />
      <div style={{ fontSize: 16, fontWeight: 800, color: T.text, marginBottom: 16 }}>Ne yapmak istiyorsun?</div>
      <button onClick={onStart} style={{ width: "100%", padding: 16, background: T.surface, borderRadius: T.radius, border: `1px solid ${T.border}`, marginBottom: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 14, textAlign: "left" }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: T.accentGhost, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🎮</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>Maç Başlat</div>
          <div style={{ fontSize: 11, color: T.text3, marginTop: 2 }}>Hemen oynayacağın bir maçı başlat ve skor tut</div>
        </div>
      </button>
      <button onClick={onCreate} style={{ width: "100%", padding: 16, background: T.surface, borderRadius: T.radius, border: `1px solid ${T.border}`, cursor: "pointer", display: "flex", alignItems: "center", gap: 14, textAlign: "left" }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: T.accentGhost, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>📢</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>Maç Oluştur</div>
          <div style={{ fontSize: 11, color: T.text3, marginTop: 2 }}>İleri tarihli maç planla ve oyuncu bul</div>
        </div>
      </button>
    </div>
  </div>
);

// --- Live Score Page ---
const LiveScorePage = ({ onBack, onFinish }) => {
  const [score, setScore] = useState([0, 0]);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);
  const [goals, setGoals] = useState([]);
  const [toast, setToast] = useState(null);
  const interval = useRef(null);

  useEffect(() => {
    if (running) {
      interval.current = setInterval(() => setSeconds(s => s + 1), 1000);
    } else {
      clearInterval(interval.current);
    }
    return () => clearInterval(interval.current);
  }, [running]);

  const addGoal = (team) => {
    const newScore = [...score];
    newScore[team] += 1;
    setScore(newScore);
    const min = Math.floor(seconds / 60);
    const goal = { min, team, id: Date.now() };
    setGoals(prev => [...prev, goal]);
    setToast(goal.id);
    setTimeout(() => setToast(null), 5000);
  };

  const undoGoal = (goalId) => {
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      const newScore = [...score];
      newScore[goal.team] -= 1;
      setScore(newScore);
      setGoals(prev => prev.filter(g => g.id !== goalId));
      setToast(null);
    }
  };

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: T.bg }}>
      <TopNav
        left={<button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}><Icon name="back" size={24} color={T.text} /></button>}
        center={<span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>Canlı Maç</span>}
        right={<div style={{ width: 8, height: 8, background: T.red, borderRadius: T.radiusFull, animation: "pulse 1s ease-in-out infinite" }} />}
      />
      {/* Timer */}
      <div style={{ textAlign: "center", padding: "8px 0" }}>
        <div style={{ fontSize: 36, fontWeight: 800, color: T.text, fontVariantNumeric: "tabular-nums" }}>{formatTime(seconds)}</div>
        <button onClick={() => setRunning(!running)} style={{ fontSize: 12, fontWeight: 600, color: running ? T.orange : T.green, background: running ? "rgba(245,158,11,0.12)" : "rgba(34,197,94,0.12)", border: "none", borderRadius: 12, padding: "4px 14px", marginTop: 4, cursor: "pointer" }}>
          {running ? "⏸ Duraklat" : "▶ Devam"}
        </button>
      </div>
      {/* Score */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "12px 20px", gap: 20 }}>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.blue, marginBottom: 6 }}>Sarı Takım</div>
          <div style={{ fontSize: 56, fontWeight: 800, color: T.text, lineHeight: 1 }}>{score[0]}</div>
          <button onClick={() => addGoal(0)} style={{ marginTop: 12, width: "100%", padding: "12px", borderRadius: T.radius, background: T.blue, color: T.white, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer" }}>+ Gol</button>
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, color: T.text3 }}>—</div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.red, marginBottom: 6 }}>Kırmızı Takım</div>
          <div style={{ fontSize: 56, fontWeight: 800, color: T.text, lineHeight: 1 }}>{score[1]}</div>
          <button onClick={() => addGoal(1)} style={{ marginTop: 12, width: "100%", padding: "12px", borderRadius: T.radius, background: T.red, color: T.white, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer" }}>+ Gol</button>
        </div>
      </div>
      {/* Goals list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 20px", scrollbarWidth: "none" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: T.text2, marginBottom: 8 }}>Gol Geçmişi</div>
        {goals.length === 0 && <div style={{ fontSize: 12, color: T.text3, textAlign: "center", padding: 20 }}>Henüz gol yok</div>}
        {goals.map(g => (
          <div key={g.id} style={{ display: "flex", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${T.border}` }}>
            <span style={{ fontSize: 12, color: T.text3, width: 36 }}>{g.min}'</span>
            <span style={{ fontSize: 13, color: T.text }}>⚽</span>
            <span style={{ fontSize: 12, color: g.team === 0 ? T.blue : T.red, fontWeight: 600, marginLeft: 8, flex: 1 }}>
              {g.team === 0 ? "Sarı" : "Kırmızı"} Takım
            </span>
          </div>
        ))}
      </div>
      {/* Toast */}
      {toast && (
        <div style={{ position: "absolute", bottom: 80, left: 20, right: 20, background: T.surface2, borderRadius: T.radius, padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 100, border: `1px solid ${T.border}` }}>
          <span style={{ fontSize: 13, color: T.text }}>⚽ Gol eklendi</span>
          <button onClick={() => undoGoal(toast)} style={{ fontSize: 12, fontWeight: 700, color: T.accent, background: "none", border: "none", cursor: "pointer" }}>Geri Al</button>
        </div>
      )}
      {/* Finish */}
      <div style={{ padding: "12px 20px 20px", flexShrink: 0 }}>
        <button onClick={() => onFinish?.(score, seconds, goals)} style={{ width: "100%", padding: "14px", borderRadius: T.radius, background: T.accent, color: T.bg, fontWeight: 800, fontSize: 15, border: "none", cursor: "pointer" }}>
          Maçı Bitir
        </button>
      </div>
    </div>
  );
};

// --- Match Summary Page ---
const MatchSummaryPage = ({ score, duration, onSave, onBack }) => (
  <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
    <TopNav
      left={<button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}><Icon name="back" size={24} color={T.text} /></button>}
      center={<span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>Maç Özeti</span>}
    />
    <div style={{ flex: 1, overflowY: "auto", padding: "8px 20px 20px", scrollbarWidth: "none" }}>
      {/* Score */}
      <div style={{ background: T.surface, borderRadius: T.radius, padding: 20, textAlign: "center", marginBottom: 16, border: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 20 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.blue, marginBottom: 4 }}>Sarı Takım</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: T.text }}>{score[0]}</div>
          </div>
          <div style={{ fontSize: 20, color: T.text3, fontWeight: 800 }}>—</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.red, marginBottom: 4 }}>Kırmızı Takım</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: T.text }}>{score[1]}</div>
          </div>
        </div>
        <div style={{ fontSize: 12, color: T.text3, marginTop: 8 }}>⏱ {Math.floor(duration / 60)} dk</div>
      </div>
      {/* Title */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: T.text2, marginBottom: 6 }}>Maç Başlığı</div>
        <div style={{ background: T.surface, borderRadius: T.radiusSm, padding: "10px 12px", color: T.text3, fontSize: 13, border: `1px solid ${T.border}` }}>Kadıköy Halısaha Maçı</div>
      </div>
      {/* Photos */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: T.text2, marginBottom: 6 }}>Fotoğraflar</div>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ width: 72, height: 72, borderRadius: T.radiusSm, background: T.surface2, display: "flex", alignItems: "center", justifyContent: "center", border: `1.5px dashed ${T.border}`, cursor: "pointer" }}>
            <Icon name="plus" size={24} color={T.text3} />
          </div>
        </div>
      </div>
      {/* MVP */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: T.text2, marginBottom: 6 }}>⭐ Maçın Yıldızı</div>
        <div style={{ display: "flex", gap: 8 }}>
          {USERS.slice(0, 4).map(u => (
            <div key={u.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer" }}>
              <Avatar emoji={u.avatar} size={40} />
              <span style={{ fontSize: 9, color: T.text3 }}>{u.name.split(" ")[0]}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Note */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: T.text2, marginBottom: 6 }}>Not (opsiyonel)</div>
        <div style={{ background: T.surface, borderRadius: T.radiusSm, padding: "10px 12px", color: T.text3, fontSize: 13, border: `1px solid ${T.border}`, minHeight: 48 }}>Maç hakkında bir şey yaz...</div>
      </div>
    </div>
    {/* Buttons */}
    <div style={{ padding: "12px 20px 20px", display: "flex", gap: 10, flexShrink: 0 }}>
      <button onClick={onSave} style={{ flex: 2, padding: "14px", borderRadius: T.radius, background: T.accent, color: T.bg, fontWeight: 800, fontSize: 14, border: "none", cursor: "pointer" }}>Kaydet & Paylaş</button>
      <button onClick={onSave} style={{ flex: 1, padding: "14px", borderRadius: T.radius, background: T.surface2, color: T.text2, fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer" }}>Gizli Kaydet</button>
    </div>
  </div>
);

// --- Profile Page --- UPDATED: Pano only for self, match cards link to detail
const ProfilePage = ({ userId, isSelf = true, onBack, onProfile, onMatchTap }) => {
  const user = getUserById(userId || 1);
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {isSelf ? (
        <TopNav
          left={<span style={{ fontSize: 17, fontWeight: 800, color: T.text }}>{user.username}</span>}
          right={<>
            <button style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}><Icon name="edit" size={20} color={T.text2} /></button>
            <button style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}><Icon name="share" size={20} color={T.text2} /></button>
            <button style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}><Icon name="settings" size={20} color={T.text2} /></button>
          </>}
        />
      ) : (
        <TopNav
          left={<button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}><Icon name="back" size={24} color={T.text} /></button>}
          center={<span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{user.username}</span>}
        />
      )}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 20px", scrollbarWidth: "none" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "8px 0 16px" }}>
          <Avatar emoji={user.avatar} size={72} border={user.verified} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: T.text }}>{user.name} {user.verified && <span style={{ color: T.accent }}>✓</span>}</div>
            <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
              {[{ n: user.matches, l: "Maç" }, { n: user.followers, l: "Takipçi" }, { n: user.following, l: "Takip" }].map(s => (
                <div key={s.l} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: T.text }}>{s.n}</div>
                  <div style={{ fontSize: 10, color: T.text3 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Follow button (other user) */}
        {!isSelf && (
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <button style={{ flex: 1, padding: "10px", borderRadius: T.radiusSm, background: T.accent, color: T.bg, fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer" }}>+ Takip Et</button>
            <button style={{ flex: 1, padding: "10px", borderRadius: T.radiusSm, background: T.surface2, color: T.text, fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer" }}>💬 Mesaj</button>
          </div>
        )}
        {/* Weekly summary */}
        <div style={{ marginBottom: 4 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: 20, fontWeight: 800, color: T.text }}>{user.weeklyMatches[user.weeklyMatches.length - 1]} maç</span>
              <span style={{ fontSize: 12, color: T.text3, marginLeft: 6 }}>bu hafta</span>
            </div>
            <button style={{ fontSize: 12, color: T.blue, background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Son 3 ay ▾</button>
          </div>
        </div>
        {/* Chart */}
        <div style={{ marginBottom: 16 }}>
          <BarChart data={user.weeklyMatches} />
        </div>
        {/* Pano - ONLY for self profile */}
        {isSelf && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: T.text3, fontWeight: 600, marginBottom: 8 }}>Pano</div>
            <PanoGrid />
          </div>
        )}
        {/* Streak */}
        <div style={{ background: T.accentGhost, borderRadius: T.radius, padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 8, border: `1px solid rgba(183,240,0,0.15)` }}>
          <span style={{ fontSize: 18 }}>🔥</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: T.accent }}>4 haftalık seri!</span>
          <span style={{ fontSize: 11, color: T.text3, marginLeft: "auto" }}>En uzun: 7 hafta</span>
        </div>
        {/* Badges */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: T.text3, fontWeight: 600, marginBottom: 8 }}>Rozetler</div>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", scrollbarWidth: "none" }}>
            {["🏅 50 Maç", "✅ Tam Katılım", "🎙️ Organizatör"].map(b => (
              <div key={b} style={{ background: T.surface2, borderRadius: T.radiusSm, padding: "8px 12px", fontSize: 11, fontWeight: 600, color: T.text2, whiteSpace: "nowrap" }}>{b}</div>
            ))}
          </div>
        </div>
        {/* Stats summary */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
          {[{ n: user.goals, l: "Gol", e: "⚽" }, { n: user.assists, l: "Asist", e: "👟" }, { n: user.mvpCount, l: "MVP", e: "⭐" }].map(s => (
            <div key={s.l} style={{ background: T.surface, borderRadius: T.radiusSm, padding: "12px 10px", textAlign: "center", border: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 16 }}>{s.e}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: T.text, marginTop: 4 }}>{s.n}</div>
              <div style={{ fontSize: 10, color: T.text3 }}>{s.l}</div>
            </div>
          ))}
        </div>
        {/* Recent matches - now clickable to match detail */}
        <div style={{ fontSize: 12, color: T.text3, fontWeight: 600, marginBottom: 8 }}>Son Maçlar</div>
        {PAST_MATCHES.filter(m => m.userId === user.id || m.team1.includes(user.id) || m.team2.includes(user.id)).slice(0, 2).map(m => (
          <MatchCard key={m.id} match={m} onTap={onMatchTap} onProfile={onProfile} />
        ))}
      </div>
    </div>
  );
};

// --- Match Detail Page --- UPDATED: clickable scorer/assist names + team rosters
const MatchDetailPage = ({ match, onBack, onProfile }) => {
  const [liked, setLiked] = useState(false);
  if (!match) return null;

  // Calculate per-player stats for rosters
  const getPlayerStats = (playerId) => {
    const goals = match.goals.filter(g => g.scorer === playerId).length;
    const assists = match.goals.filter(g => g.assist === playerId).length;
    return { goals, assists };
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <TopNav
        left={<button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}><Icon name="back" size={24} color={T.text} /></button>}
        center={<span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>Maç Detay</span>}
      />
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 20px", scrollbarWidth: "none" }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: T.text, marginBottom: 4 }}>⚽ {match.title}</div>
        {/* Score */}
        <div style={{ background: T.surface, borderRadius: T.radius, padding: 20, textAlign: "center", marginBottom: 14, border: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 20 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.blue, marginBottom: 4 }}>{match.team1Name}</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: T.text }}>{match.score[0]}</div>
            </div>
            <div style={{ fontSize: 20, color: T.text3, fontWeight: 800 }}>—</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.red, marginBottom: 4 }}>{match.team2Name}</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: T.text }}>{match.score[1]}</div>
            </div>
          </div>
        </div>
        {/* Meta */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14, fontSize: 11, color: T.text2 }}>
          <span style={{ background: T.surface2, borderRadius: 12, padding: "4px 10px" }}>📅 {match.date}</span>
          <span style={{ background: T.surface2, borderRadius: 12, padding: "4px 10px" }}>⏱ {match.duration}</span>
          <span style={{ background: T.surface2, borderRadius: 12, padding: "4px 10px" }}>📍 {match.location}</span>
          <span style={{ background: T.surface2, borderRadius: 12, padding: "4px 10px" }}>👥 {match.format}</span>
        </div>

        {/* Team Rosters - NEW */}
        <div style={{ fontSize: 12, fontWeight: 700, color: T.text2, marginBottom: 8 }}>Takım Kadroları</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {/* Team 1 */}
          <div style={{ flex: 1, background: T.surface, borderRadius: T.radius, padding: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.blue, marginBottom: 8, textAlign: "center" }}>{match.team1Name}</div>
            {match.team1.map(id => {
              const u = getUserById(id);
              const stats = getPlayerStats(id);
              return (
                <div key={id} onClick={() => onProfile?.(id)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: `1px solid ${T.border}`, cursor: "pointer" }}>
                  <Avatar emoji={u.avatar} size={24} border={match.mvp === id} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: T.text }}>{u.name}</div>
                    <div style={{ fontSize: 9, color: T.text3 }}>
                      {stats.goals > 0 && `⚽${stats.goals} `}
                      {stats.assists > 0 && `👟${stats.assists}`}
                      {stats.goals === 0 && stats.assists === 0 && "—"}
                    </div>
                  </div>
                  {match.mvp === id && <span style={{ fontSize: 10 }}>⭐</span>}
                </div>
              );
            })}
          </div>
          {/* Team 2 */}
          <div style={{ flex: 1, background: T.surface, borderRadius: T.radius, padding: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.red, marginBottom: 8, textAlign: "center" }}>{match.team2Name}</div>
            {match.team2.map(id => {
              const u = getUserById(id);
              const stats = getPlayerStats(id);
              return (
                <div key={id} onClick={() => onProfile?.(id)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: `1px solid ${T.border}`, cursor: "pointer" }}>
                  <Avatar emoji={u.avatar} size={24} border={match.mvp === id} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: T.text }}>{u.name}</div>
                    <div style={{ fontSize: 9, color: T.text3 }}>
                      {stats.goals > 0 && `⚽${stats.goals} `}
                      {stats.assists > 0 && `👟${stats.assists}`}
                      {stats.goals === 0 && stats.assists === 0 && "—"}
                    </div>
                  </div>
                  {match.mvp === id && <span style={{ fontSize: 10 }}>⭐</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* MVP */}
        {match.mvp && (
          <div style={{ background: "rgba(245,158,11,0.08)", borderRadius: T.radius, padding: "10px 14px", marginBottom: 14, display: "flex", alignItems: "center", gap: 10, border: `1px solid rgba(245,158,11,0.15)` }}>
            <span style={{ fontSize: 18 }}>⭐</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: T.orange }}>Maçın Yıldızı</span>
            <div onClick={() => onProfile?.(match.mvp)} style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto", cursor: "pointer" }}>
              <Avatar emoji={getUserById(match.mvp).avatar} size={24} border />
              <span style={{ fontSize: 12, fontWeight: 700, color: T.text }}>{getUserById(match.mvp).name}</span>
            </div>
          </div>
        )}
        {/* Goal timeline - clickable scorer/assist names */}
        <div style={{ fontSize: 12, fontWeight: 700, color: T.text2, marginBottom: 8 }}>Gol Zaman Çizelgesi</div>
        {match.goals.map((g, i) => {
          const isTeam1 = match.team1.includes(g.scorer);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", padding: "6px 0", borderBottom: i < match.goals.length - 1 ? `1px solid ${T.border}` : "none" }}>
              <span style={{ fontSize: 11, color: T.text3, width: 28, fontWeight: 600 }}>{g.min}'</span>
              <span style={{ fontSize: 13 }}>⚽</span>
              <span
                onClick={() => onProfile?.(g.scorer)}
                style={{ fontSize: 12, fontWeight: 700, color: isTeam1 ? T.blue : T.red, marginLeft: 6, cursor: "pointer" }}
              >
                {getUserById(g.scorer).name}
              </span>
              {g.assist && (
                <span style={{ fontSize: 11, color: T.text3, marginLeft: 6 }}>
                  (Asist: <span onClick={() => onProfile?.(g.assist)} style={{ fontWeight: 600, cursor: "pointer", color: T.text2 }}>{getUserById(g.assist).name}</span>)
                </span>
              )}
            </div>
          );
        })}

        {/* Photos */}
        {match.photos && (
          <div style={{ marginTop: 14, marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.text2, marginBottom: 8 }}>Fotoğraflar</div>
            <div style={{ display: "flex", gap: 6 }}>
              {[1,2,3].map(i => <div key={i} style={{ width: 80, height: 80, borderRadius: T.radiusSm, background: `linear-gradient(135deg, ${T.surface2}, ${T.border})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: T.text3 }}>📸</div>)}
            </div>
          </div>
        )}

        {/* Interaction */}
        <div style={{ padding: "12px 0 8px", display: "flex", alignItems: "center", gap: 20, borderTop: `1px solid ${T.border}`, marginTop: 8 }}>
          <button onClick={() => setLiked(!liked)} style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: 5, cursor: "pointer", padding: 0 }}>
            <Icon name="heart" size={18} color={liked ? T.red : T.text3} />
            <span style={{ fontSize: 12, color: liked ? T.red : T.text3, fontWeight: 600 }}>{match.likes + (liked ? 1 : 0)}</span>
          </button>
          <button style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: 5, cursor: "pointer", padding: 0 }}>
            <Icon name="comment" size={18} color={T.text3} />
            <span style={{ fontSize: 12, color: T.text3, fontWeight: 600 }}>{match.comments.length}</span>
          </button>
          <button style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: 5, cursor: "pointer", padding: 0 }}>
            <Icon name="share" size={18} color={T.text3} />
          </button>
        </div>
        {/* Likes line - clickable */}
        {match.likes > 0 && (
          <div style={{ padding: "0 0 6px", fontSize: 11, color: T.text2 }}>
            <span style={{ fontWeight: 700, color: T.text }}>Beğenenler: </span>
            <ClickableName userId={2} onProfile={onProfile} style={{ fontSize: 11 }} />
            <span> ve diğerleri</span>
          </div>
        )}
        {/* Comments - clickable names */}
        {match.comments.map((c, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "6px 0" }}>
            <div onClick={() => onProfile?.(c.userId)} style={{ cursor: "pointer" }}>
              <Avatar emoji={getUserById(c.userId).avatar} size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <ClickableName userId={c.userId} onProfile={onProfile} style={{ fontSize: 11 }} />
              <span style={{ fontSize: 11, color: T.text3, marginLeft: 6 }}>{c.time}</span>
              <div style={{ fontSize: 12, color: T.text2, marginTop: 2 }}>{c.text}</div>
            </div>
          </div>
        ))}
        {/* Add comment */}
        <div style={{ padding: "8px 0 0", display: "flex", alignItems: "center", gap: 8 }}>
          <Avatar emoji={USERS[0].avatar} size={22} />
          <div style={{ flex: 1, fontSize: 12, color: T.text3, background: T.bg2, borderRadius: 20, padding: "7px 12px" }}>
            Bir yorum ekle...
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Planned Match Detail Page (S12) --- NEW: for upcoming/open matches
const PlannedMatchDetailPage = ({ match, onBack, onProfile }) => {
  if (!match) return null;
  const org = getUserById(match.organizer);
  const participants = (match.participants || []).map(id => getUserById(id));

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <TopNav
        left={<button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}><Icon name="back" size={24} color={T.text} /></button>}
        center={<span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>Maç Detay</span>}
      />
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 20px", scrollbarWidth: "none" }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: T.text, marginBottom: 12 }}>⚽ {match.title}</div>

        {/* Organizer */}
        <div onClick={() => onProfile?.(org.id)} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, cursor: "pointer" }}>
          <Avatar emoji={org.avatar} size={36} />
          <div>
            <div style={{ fontSize: 12, color: T.text3 }}>Organizatör</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{org.name}</div>
          </div>
        </div>

        {/* Info card */}
        <div style={{ background: T.surface, borderRadius: T.radius, padding: 16, marginBottom: 14, border: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, fontSize: 12, color: T.text2 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Icon name="calendar" size={14} color={T.text3} />
              <span>{match.date} · {match.time}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Icon name="mapPin" size={14} color={T.text3} />
              <span>{match.location}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Icon name="users" size={14} color={T.text3} />
              <span>{match.format}</span>
            </div>
          </div>
          {match.level !== "Herkes" && (
            <div style={{ marginTop: 10 }}>
              <Badge text={`Seviye: ${match.level}`} color={T.orange} bg="rgba(245,158,11,0.12)" />
            </div>
          )}
          {match.approvalMode === "Onay ile Kabul Et" && (
            <div style={{ marginTop: 6 }}>
              <Badge text="Onay gerekli" color={T.blue} bg="rgba(59,130,246,0.12)" />
            </div>
          )}
        </div>

        {/* Capacity */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: T.text2 }}>Kontenjan</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: T.text }}>{match.currentPlayers}/{match.maxPlayers} oyuncu</span>
          </div>
          <ProgressBar current={match.currentPlayers} max={match.maxPlayers} />
        </div>

        {/* Participants */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.text2, marginBottom: 8 }}>Katılımcılar</div>
          {participants.map(u => (
            <div key={u.id} onClick={() => onProfile?.(u.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: `1px solid ${T.border}`, cursor: "pointer" }}>
              <Avatar emoji={u.avatar} size={32} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{u.name}</div>
                <div style={{ fontSize: 11, color: T.text3 }}>@{u.username}</div>
              </div>
              {u.id === match.organizer && <Badge text="Organizatör" />}
            </div>
          ))}
          {match.currentPlayers > participants.length && (
            <div style={{ fontSize: 11, color: T.text3, padding: "8px 0", textAlign: "center" }}>
              +{match.currentPlayers - participants.length} diğer oyuncu
            </div>
          )}
        </div>

        {/* CTA Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {!match.joined ? (
            <button style={{ width: "100%", padding: "14px", borderRadius: T.radius, background: T.accent, color: T.bg, fontWeight: 800, fontSize: 14, border: "none", cursor: "pointer" }}>
              Katıl ({match.maxPlayers - match.currentPlayers} yer kaldı)
            </button>
          ) : (
            <div style={{ width: "100%", padding: "14px", borderRadius: T.radius, background: T.accentGhost, textAlign: "center", fontWeight: 700, fontSize: 14, color: T.accent, border: `1px solid ${T.accent}` }}>
              ✓ Katılıyorsun
            </div>
          )}
          <button style={{ width: "100%", padding: "12px", borderRadius: T.radius, background: T.surface2, color: T.text, fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer" }}>
            💬 Mesaj Gönder
          </button>
          <button style={{ width: "100%", padding: "12px", borderRadius: T.radius, background: T.surface2, color: T.text, fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer" }}>
            📱 WhatsApp ile Mesaj
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// MAIN APP — UPDATED: Navigation history stack for proper back behavior
// ============================================================
export default function App() {
  // Navigation history stack: each entry = { page, data }
  const [history, setHistory] = useState([{ page: "splash", data: null }]);
  const [tab, setTab] = useState("home");
  const [feedMode, setFeedMode] = useState("home");
  const [showFAB, setShowFAB] = useState(false);
  const [liveScore, setLiveScore] = useState(null);

  // Current page is the last item in history
  const current = history[history.length - 1];
  const page = current.page;

  // Push a new page onto the stack
  const navigate = (p, data = null) => {
    setHistory(prev => [...prev, { page: p, data }]);
  };

  // Go back to previous page
  const goBack = () => {
    setHistory(prev => {
      if (prev.length <= 1) return prev;
      return prev.slice(0, -1);
    });
  };

  // Tab navigation: clear stack and go to tab root
  const handleTab = (t) => {
    setTab(t);
    setHistory([{ page: t, data: null }]);
    setShowFAB(false);
  };

  return (
    <PhoneFrame>
      {page === "splash" && <SplashPage onDone={() => { setTab("home"); setHistory([{ page: "home", data: null }]); }} />}

      {page === "home" && (
        <>
          <HomePage
            feedMode={feedMode}
            setFeedMode={setFeedMode}
            onMatchTap={(m) => navigate("matchDetail", m)}
            onProfile={(id) => navigate("otherProfile", id)}
          />
          <TabBar active={tab} onTab={handleTab} />
        </>
      )}

      {page === "matches" && (
        <>
          <MatchesPage
            onUpcomingTap={(m) => navigate("plannedMatchDetail", m)}
            onFAB={() => setShowFAB(true)}
          />
          <TabBar active={tab} onTab={handleTab} />
          {showFAB && <FABSheet onClose={() => setShowFAB(false)} onStart={() => { setShowFAB(false); navigate("liveScore"); }} onCreate={() => { setShowFAB(false); }} />}
        </>
      )}

      {page === "profile" && (
        <>
          <ProfilePage
            isSelf={true}
            onProfile={(id) => navigate("otherProfile", id)}
            onMatchTap={(m) => navigate("matchDetail", m)}
          />
          <TabBar active={tab} onTab={handleTab} />
        </>
      )}

      {page === "otherProfile" && (
        <ProfilePage
          userId={current.data}
          isSelf={false}
          onBack={goBack}
          onProfile={(id) => navigate("otherProfile", id)}
          onMatchTap={(m) => navigate("matchDetail", m)}
        />
      )}

      {page === "matchDetail" && (
        <MatchDetailPage
          match={current.data}
          onBack={goBack}
          onProfile={(id) => navigate("otherProfile", id)}
        />
      )}

      {page === "plannedMatchDetail" && (
        <PlannedMatchDetailPage
          match={current.data}
          onBack={goBack}
          onProfile={(id) => navigate("otherProfile", id)}
        />
      )}

      {page === "liveScore" && (
        <LiveScorePage
          onBack={goBack}
          onFinish={(score, duration) => { setLiveScore({ score, duration }); navigate("matchSummary"); }}
        />
      )}

      {page === "matchSummary" && (
        <MatchSummaryPage
          score={liveScore?.score || [0, 0]}
          duration={liveScore?.duration || 0}
          onBack={goBack}
          onSave={() => { setTab("home"); setHistory([{ page: "home", data: null }]); }}
        />
      )}
    </PhoneFrame>
  );
}
