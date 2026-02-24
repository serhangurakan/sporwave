import { useState, useEffect, useRef } from "react";

// ============================================================
// SPORWAVE v3 — Interactive Wireframe (Complete Rebuild)
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
  { id: 101, title: "Kadıköy Halısaha Klasik", date: "23 Şub 2026", time: "20:00", duration: "1s 25dk", score: [5, 3], format: "6v6", location: "Fenerbahçe Halısaha", userId: 1, team1: [1, 2, 5], team2: [3, 4], team1Name: "Mavi Takım", team2Name: "Kırmızı Takım", goals: [{min: 8, scorer: 1, assist: 2}, {min: 15, scorer: 5, assist: 1}, {min: 22, scorer: 3, assist: 4}, {min: 30, scorer: 1, assist: 5}, {min: 38, scorer: 2, assist: null}, {min: 45, scorer: 5, assist: 2}, {min: 55, scorer: 3, assist: null}, {min: 62, scorer: 1, assist: 2}], mvp: 1, likes: 24, comments: [{userId: 2, text: "Harika maçtı! 🔥", time: "2s"}, {userId: 3, text: "Rövanş istiyoruz", time: "1s"}], photos: true },
  { id: 102, title: "Beşiktaş Pazar Maçı", date: "22 Şub 2026", time: "18:00", duration: "1s 10dk", score: [2, 2], format: "5v5", location: "BJK Halısaha", userId: 2, team1: [2, 4], team2: [3, 5], team1Name: "Mavi", team2Name: "Beyaz", goals: [{min: 12, scorer: 2, assist: 4}, {min: 25, scorer: 5, assist: 3}, {min: 40, scorer: 4, assist: 2}, {min: 58, scorer: 3, assist: null}], mvp: 5, likes: 18, comments: [{userId: 1, text: "Güzel beraberlik 👏", time: "3s"}], photos: false },
  { id: 103, title: "Bakırköy Akşam Maçı", date: "21 Şub 2026", time: "21:00", duration: "1s 30dk", score: [4, 1], format: "7v7", location: "Bakırköy Spor Tesisi", userId: 5, team1: [5, 1, 3], team2: [2, 4], team1Name: "Yeşil", team2Name: "Turuncu", goals: [{min: 5, scorer: 5, assist: 1}, {min: 18, scorer: 1, assist: 5}, {min: 33, scorer: 5, assist: 3}, {min: 50, scorer: 2, assist: 4}, {min: 65, scorer: 3, assist: 1}], mvp: 5, likes: 31, comments: [{userId: 4, text: "Emre fırtına gibi oynadı", time: "5s"}], photos: true },
];

const OPEN_MATCHES = [
  { id: 201, title: "Cumartesi Akşam Halısaha", date: "1 Mar 2026", time: "20:00", location: "Kadıköy Spor Merkezi", format: "6v6", organizer: 2, maxPlayers: 12, currentPlayers: 8, level: "Herkes", approvalMode: "Herkesi Kabul Et", joined: false, friendJoined: null, participants: [2, 3, 5] },
  { id: 202, title: "Caddebostan Tenis Kortu Yanı Maç", date: "28 Şub 2026", time: "19:00", location: "Caddebostan Halısaha", format: "5v5", organizer: 3, maxPlayers: 10, currentPlayers: 7, level: "Orta+", approvalMode: "Onay ile Kabul Et", joined: true, friendJoined: null, participants: [3, 1, 4] },
  { id: 203, title: "Beşiktaş Hafta Sonu Maçı", date: "1 Mar 2026", time: "16:00", location: "BJK Halısaha", format: "7v7", organizer: 4, maxPlayers: 14, currentPlayers: 5, level: "Herkes", approvalMode: "Herkesi Kabul Et", joined: false, friendJoined: 5, participants: [4, 5, 2] },
  { id: 204, title: "Ataşehir Gece Maçı", date: "2 Mar 2026", time: "22:00", location: "Ataşehir Spor Tesisi", format: "5v5", organizer: 5, maxPlayers: 10, currentPlayers: 9, level: "İyi+", approvalMode: "Onay ile Kabul Et", joined: false, friendJoined: null, participants: [5, 1] },
];

const CONVERSATIONS = [
  { id: 1, userId: 2, lastMessage: "Yarınki maça geliyorsun değil mi?", time: "14:30", unread: 2 },
  { id: 2, userId: 3, lastMessage: "Harika maçtı dün!", time: "Dün", unread: 0 },
  { id: 3, userId: 5, lastMessage: "Rövanş ne zaman?", time: "Paz", unread: 1 },
  { id: 4, userId: 4, lastMessage: "Halısaha rezervasyon onaylandı", time: "22 Şub", unread: 0 },
];

const CHAT_MESSAGES = {
  2: [
    { id: 1, from: 2, text: "Selam! Yarın maç var, gelecek misin?", time: "14:20" },
    { id: 2, from: 1, text: "Tabii, saat kaçta?", time: "14:22" },
    { id: 3, from: 2, text: "20:00'de Kadıköy Halısaha", time: "14:25" },
    { id: 4, from: 2, text: "Yarınki maça geliyorsun değil mi?", time: "14:30" },
  ],
  3: [
    { id: 1, from: 3, text: "Dünkü maç çok iyiydi", time: "22:10" },
    { id: 2, from: 1, text: "Aynen, süper geçti!", time: "22:15" },
    { id: 3, from: 3, text: "Harika maçtı dün!", time: "22:20" },
  ],
  5: [
    { id: 1, from: 5, text: "Geçen haftaki maçın rövanşı lazım", time: "Paz" },
    { id: 2, from: 1, text: "Haha kesinlikle", time: "Paz" },
    { id: 3, from: 5, text: "Rövanş ne zaman?", time: "Paz" },
  ],
  4: [
    { id: 1, from: 4, text: "Halısaha rezervasyon onaylandı", time: "22 Şub" },
    { id: 2, from: 1, text: "Süper, teşekkürler!", time: "22 Şub" },
  ],
};

const NOTIFICATIONS = [
  { id: 1, type: "like", userId: 2, text: "maçını beğendi", time: "2s önce", matchId: 101, read: false },
  { id: 2, type: "comment", userId: 3, text: "maçına yorum yaptı: \"Rövanş istiyoruz\"", time: "1s önce", matchId: 101, read: false },
  { id: 3, type: "follow", userId: 4, text: "seni takip etmeye başladı", time: "3s önce", read: false },
  { id: 4, type: "matchReminder", userId: null, text: "Yarınki maçın yaklaşıyor!", time: "5s önce", matchId: 202, read: true },
  { id: 5, type: "like", userId: 5, text: "maçını beğendi", time: "1g önce", matchId: 103, read: true },
  { id: 6, type: "badge", userId: null, text: "50 Maç Kulübü'ne hoş geldin!", time: "2g önce", read: true },
  { id: 7, type: "follow", userId: 5, text: "seni takip etmeye başladı", time: "3g önce", read: true },
  { id: 8, type: "comment", userId: 2, text: "maçına yorum yaptı: \"Harika maçtı!\"", time: "3g önce", matchId: 102, read: true },
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
    send: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    phone: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>,
    lock: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
    mail: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></svg>,
    image: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    link: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>,
    logout: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    help: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    shield: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    eye: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    eyeOff: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
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

// --- Reusable BottomSheet ---
const BottomSheet = ({ onClose, children, title }) => (
  <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "flex-end" }} onClick={onClose}>
    <div onClick={e => e.stopPropagation()} style={{ width: "100%", background: T.bg2, borderRadius: "20px 20px 0 0", padding: 20, maxHeight: "70%", overflowY: "auto" }}>
      <div style={{ width: 40, height: 4, background: T.border, borderRadius: 2, margin: "0 auto 16px" }} />
      {title && <div style={{ fontSize: 16, fontWeight: 800, color: T.text, marginBottom: 16 }}>{title}</div>}
      {children}
    </div>
  </div>
);

// --- Reusable TextInput & TextArea ---
const TextInput = ({ value, onChange, placeholder, type = "text", style = {} }) => (
  <input
    type={type}
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    style={{ width: "100%", background: T.surface, borderRadius: T.radiusSm, padding: "10px 12px", color: T.text, fontSize: 13, border: `1px solid ${T.border}`, outline: "none", boxSizing: "border-box", ...style }}
  />
);

const TextArea = ({ value, onChange, placeholder, rows = 3, style = {} }) => (
  <textarea
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    rows={rows}
    style={{ width: "100%", background: T.surface, borderRadius: T.radiusSm, padding: "10px 12px", color: T.text, fontSize: 13, border: `1px solid ${T.border}`, outline: "none", resize: "none", fontFamily: "inherit", boxSizing: "border-box", ...style }}
  />
);

// --- Reusable Toggle ---
const Toggle = ({ on, onToggle }) => (
  <div onClick={onToggle} style={{ width: 44, height: 24, borderRadius: 12, background: on ? T.accent : T.surface2, cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
    <div style={{ width: 20, height: 20, borderRadius: 10, background: T.white, position: "absolute", top: 2, left: on ? 22 : 2, transition: "left 0.2s" }} />
  </div>
);

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

// ============================================================
// PART 2 — Page Components (with all fixes applied)
// ============================================================

// --- MatchCard (Fix #4: Heart fill, Fix #5: Real comment input, Fix #3: Three-dot menu) ---
const MatchCard = ({ match, onTap, onProfile, onReport }) => {
  const user = getUserById(match.userId);
  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [localComments, setLocalComments] = useState(match.comments);
  const [showAllComments, setShowAllComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const addComment = () => {
    if (!commentText.trim()) return;
    setLocalComments(prev => [...prev, { userId: 1, text: commentText, time: "Az önce" }]);
    setCommentText("");
  };

  return (
    <div style={{ background: T.surface, borderRadius: T.radius, margin: "0 0 12px", overflow: "hidden", border: `1px solid ${T.border}` }}>
      {/* Header */}
      <div style={{ padding: "12px 14px 8px", display: "flex", alignItems: "center", gap: 10 }}>
        <div onClick={() => onProfile?.(user.id)} style={{ cursor: "pointer" }}><Avatar emoji={user.avatar} size={34} /></div>
        <div style={{ flex: 1 }} onClick={() => onProfile?.(user.id)}>
          <span style={{ fontSize: 13, fontWeight: 700, color: T.text, cursor: "pointer" }}>{user.name}</span>
          <div style={{ fontSize: 11, color: T.text3, marginTop: 1 }}>{match.date} · {match.time}</div>
        </div>
        <span onClick={(e) => { e.stopPropagation(); setShowMenu(true); }} style={{ fontSize: 16, color: T.text3, cursor: "pointer", padding: "4px 8px" }}>⋮</span>
      </div>
      {/* Title + Stats */}
      <div style={{ padding: "0 14px 8px", cursor: "pointer" }} onClick={() => onTap?.(match)}>
        <div style={{ fontSize: 15, fontWeight: 800, color: T.text, marginBottom: 6 }}>{match.title}</div>
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
      {/* Photos */}
      {match.photos && (
        <div style={{ padding: "8px 14px 4px", display: "flex", gap: 6 }}>
          {[1,2].map(i => <div key={i} style={{ width: 80, height: 80, borderRadius: T.radiusSm, background: `linear-gradient(135deg, ${T.surface2}, ${T.border})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: T.text3 }}>📸</div>)}
        </div>
      )}
      {/* MVP */}
      {match.mvp && (
        <div style={{ padding: "6px 14px", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 11, color: T.orange }}>⭐ Maçın Yıldızı:</span>
          <ClickableName userId={match.mvp} onProfile={onProfile} style={{ fontSize: 11 }} />
        </div>
      )}
      {/* Interaction bar */}
      <div style={{ padding: "8px 14px 6px", display: "flex", alignItems: "center", gap: 20, borderTop: `1px solid ${T.border}` }}>
        <button onClick={(e) => { e.stopPropagation(); setLiked(!liked); }} style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: 5, cursor: "pointer", padding: 0 }}>
          <svg width={18} height={18} viewBox="0 0 24 24" fill={liked ? T.red : "none"} stroke={liked ? T.red : T.text3} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
          <span style={{ fontSize: 12, color: liked ? T.red : T.text3, fontWeight: 600 }}>{match.likes + (liked ? 1 : 0)}</span>
        </button>
        <button onClick={(e) => { e.stopPropagation(); setShowAllComments(!showAllComments); }} style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: 5, cursor: "pointer", padding: 0 }}>
          <Icon name="comment" size={18} color={T.text3} />
          <span style={{ fontSize: 12, color: T.text3, fontWeight: 600 }}>{localComments.length}</span>
        </button>
        <button style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: 5, cursor: "pointer", padding: 0 }}>
          <Icon name="share" size={18} color={T.text3} />
        </button>
      </div>
      {/* Likes */}
      {match.likes > 0 && (
        <div style={{ padding: "0 14px 6px", fontSize: 11, color: T.text2 }}>
          <span style={{ fontWeight: 700, color: T.text }}>Beğenenler: </span>
          <ClickableName userId={2} onProfile={onProfile} style={{ fontSize: 11 }} />
          <span> ve diğerleri</span>
        </div>
      )}
      {/* Comments */}
      {showAllComments ? localComments.map((c, i) => (
        <div key={i} style={{ padding: "4px 14px", display: "flex", gap: 8, alignItems: "flex-start" }}>
          <div onClick={() => onProfile?.(c.userId)} style={{ cursor: "pointer" }}><Avatar emoji={getUserById(c.userId).avatar} size={22} /></div>
          <div style={{ flex: 1 }}>
            <ClickableName userId={c.userId} onProfile={onProfile} style={{ fontSize: 11 }} />
            <span style={{ fontSize: 11, color: T.text3, marginLeft: 6 }}>{c.time}</span>
            <div style={{ fontSize: 12, color: T.text2, marginTop: 2 }}>{c.text}</div>
          </div>
        </div>
      )) : localComments.length > 0 && (
        <div style={{ padding: "0 14px 6px", display: "flex", gap: 8, alignItems: "flex-start" }}>
          <div onClick={() => onProfile?.(localComments[0].userId)} style={{ cursor: "pointer" }}><Avatar emoji={getUserById(localComments[0].userId).avatar} size={22} /></div>
          <div style={{ flex: 1 }}>
            <ClickableName userId={localComments[0].userId} onProfile={onProfile} style={{ fontSize: 11 }} />
            <span style={{ fontSize: 11, color: T.text3, marginLeft: 6 }}>{localComments[0].time}</span>
            <div style={{ fontSize: 12, color: T.text2, marginTop: 2 }}>{localComments[0].text}</div>
          </div>
        </div>
      )}
      {/* Comment input - REAL INPUT (Fix #5) */}
      <div style={{ padding: "4px 14px 10px", display: "flex", alignItems: "center", gap: 8 }}>
        <Avatar emoji={USERS[0].avatar} size={22} />
        <input
          value={commentText}
          onChange={e => setCommentText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addComment()}
          placeholder="Bir yorum ekle..."
          style={{ flex: 1, fontSize: 12, color: T.text, background: T.bg2, borderRadius: 20, padding: "7px 12px", border: "none", outline: "none" }}
        />
        {commentText && <button onClick={addComment} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}><Icon name="send" size={16} color={T.accent} /></button>}
      </div>
      {/* Menu bottom sheet (Fix #3) */}
      {showMenu && (
        <BottomSheet onClose={() => setShowMenu(false)} title="Seçenekler">
          <button onClick={() => { setShowMenu(false); onReport?.("report", match.userId); }} style={{ width: "100%", padding: "14px", background: T.surface, borderRadius: T.radiusSm, border: `1px solid ${T.border}`, color: T.text, fontSize: 14, fontWeight: 600, cursor: "pointer", marginBottom: 8, textAlign: "left" }}>🚩 Raporla</button>
          <button onClick={() => { setShowMenu(false); onReport?.("block", match.userId); }} style={{ width: "100%", padding: "14px", background: T.surface, borderRadius: T.radiusSm, border: `1px solid ${T.border}`, color: T.red, fontSize: 14, fontWeight: 600, cursor: "pointer", textAlign: "left" }}>🚫 Engelle</button>
        </BottomSheet>
      )}
    </div>
  );
};

// --- OpenMatchCard (no changes) ---
const OpenMatchCard = ({ match, onTap, onProfile }) => {
  const organizer = getUserById(match.organizer);
  const spotsLeft = match.maxPlayers - match.currentPlayers;
  const isJoined = match.joined;
  const friendUser = match.friendJoined && !match.joined ? getUserById(match.friendJoined) : null;
  return (
    <div onClick={() => onTap?.(match)} style={{ background: T.surface, borderRadius: T.radius, padding: "16px", margin: "0 0 12px", cursor: "pointer", border: isJoined ? `2px solid ${T.accent}` : `1px solid ${T.border}` }}>
      {/* Top badge */}
      {isJoined && (
        <div style={{ marginBottom: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: T.bg, background: T.accent, padding: "4px 12px", borderRadius: 14 }}>Katılıyorsun ✓</span>
        </div>
      )}
      {friendUser && (
        <div style={{ marginBottom: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: T.accent, background: T.accentGhost, padding: "4px 12px", borderRadius: 14 }}>🤝 {friendUser.name} katılıyor</span>
        </div>
      )}
      {/* Title */}
      <div style={{ fontSize: 16, fontWeight: 800, color: T.text, marginBottom: 8 }}>{match.title}</div>
      {/* Date & Location */}
      <div style={{ display: "flex", gap: 12, fontSize: 11, color: T.text2, marginBottom: 10, flexWrap: "wrap" }}>
        <span>📅 {match.date} · {match.time}</span>
        <span>📍 {match.location}</span>
      </div>
      {/* Organizer + format + level badges */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <div onClick={(e) => { e.stopPropagation(); onProfile?.(organizer.id); }} style={{ cursor: "pointer" }}><Avatar emoji={organizer.avatar} size={24} /></div>
        <span style={{ fontSize: 12, color: T.text2 }}>{organizer.name}</span>
        <span style={{ fontSize: 11, color: T.text3 }}>· {match.format}</span>
        {match.level !== "Herkes" && <Badge text={match.level} color={T.orange} bg="rgba(245,158,11,0.12)" />}
        {match.approvalMode === "Onay ile Kabul Et" && <Badge text="Onay gerekli" color={T.text2} bg={T.surface2} />}
      </div>
      {/* Player count + progress bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: T.text, whiteSpace: "nowrap" }}>{match.currentPlayers}/{match.maxPlayers} oyuncu</span>
        <ProgressBar current={match.currentPlayers} max={match.maxPlayers} />
        <span style={{ fontSize: 11, color: spotsLeft <= 2 ? T.red : T.accent, fontWeight: 600, whiteSpace: "nowrap" }}>{spotsLeft} kişi kaldı</span>
      </div>
    </div>
  );
};

// --- BarChart (no changes) ---
const BarChart = ({ data, labels, height = 80 }) => {
  const max = Math.max(...data, 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height, padding: "0 4px" }}>
      {data.map((val, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{ width: "100%", height: `${(val / max) * 100}%`, background: `linear-gradient(180deg, ${T.accent}, ${T.accentDark})`, borderRadius: 3, minHeight: val > 0 ? 4 : 0, transition: "height 0.3s" }} />
          {labels && <span style={{ fontSize: 8, color: T.text3 }}>{labels[i]}</span>}
        </div>
      ))}
    </div>
  );
};

// --- PanoGrid (Fix #9: buttons must be clickable, open modals) ---
const PanoGrid = ({ onItemTap }) => {
  const items = [
    { icon: "chart", label: "İstatistikler", id: "stats" },
    { icon: "trophy", label: "Başarılar", id: "achievements" },
    { icon: "calendar", label: "Takvim", id: "calendar" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      {items.map(item => (
        <div key={item.label} onClick={() => onItemTap?.(item.id)} style={{ background: T.surface2, borderRadius: T.radius, padding: "14px 10px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer" }}>
          <Icon name={item.icon} size={20} color={T.text2} />
          <span style={{ fontSize: 11, fontWeight: 600, color: T.text, textAlign: "center" }}>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

// --- SplashPage (no changes) ---
const SplashPage = ({ onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 2000); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: T.bg }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>⚽</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: T.accent, letterSpacing: 2, marginBottom: 4 }}>SPORWAVE</div>
      <div style={{ fontSize: 12, color: T.text3, letterSpacing: 3 }}>HALIŞAHA SOSYAL AĞI</div>
    </div>
  );
};

// --- HomePage (S05: dropdown Ana Sayfa/Keşfet + Önerilen Kullanıcılar) ---
const HomePage = ({ onMatchTap, onProfile, feedMode, setFeedMode, onSearch, onNotifications, onMessages, onReport }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [followedUsers, setFollowedUsers] = useState([2, 5]); // dummy: user follows Ali and Emre
  const suggestedUsers = USERS.filter(u => u.id !== 1 && !followedUsers.includes(u.id));

  const dropdownLabel = feedMode === "home" ? "Ana Sayfa" : "Keşfet";

  const handleFollow = (userId) => {
    setFollowedUsers(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
  };

  // Ana Sayfa: matches by followed users; Keşfet: all matches
  const feedMatches = feedMode === "home"
    ? PAST_MATCHES.filter(m => followedUsers.includes(m.userId))
    : PAST_MATCHES;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Top bar */}
      <TopNav
        left={
          <div style={{ position: "relative" }}>
            <button onClick={() => setDropdownOpen(!dropdownOpen)} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", padding: 0, cursor: "pointer" }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: T.text }}>{dropdownLabel}</span>
              <span style={{ fontSize: 12, color: T.text3, marginTop: 2 }}>▾</span>
            </button>
            {dropdownOpen && (
              <>
                <div onClick={() => setDropdownOpen(false)} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 99 }} />
                <div style={{ position: "absolute", top: "100%", left: 0, marginTop: 6, background: T.surface, borderRadius: T.radius, minWidth: 240, zIndex: 100, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}>
                  <button onClick={() => { setFeedMode?.("home"); setDropdownOpen(false); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", background: "none", border: "none", borderBottom: `1px solid ${T.border}`, cursor: "pointer", textAlign: "left" }}>
                    <span style={{ fontSize: 18 }}>🏠</span>
                    <span style={{ flex: 1, fontSize: 14, fontWeight: 700, color: T.text }}>Ana Sayfa (Takip edilenler)</span>
                    {feedMode === "home" && <span style={{ fontSize: 16, color: T.text }}>✓</span>}
                  </button>
                  <button onClick={() => { setFeedMode?.("discover"); setDropdownOpen(false); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                    <span style={{ fontSize: 18 }}>🌐</span>
                    <span style={{ flex: 1, fontSize: 14, fontWeight: 700, color: T.text }}>Keşfet</span>
                    {feedMode === "discover" && <span style={{ fontSize: 16, color: T.text }}>✓</span>}
                  </button>
                </div>
              </>
            )}
          </div>
        }
        right={<>
          <span onClick={() => onSearch?.()} style={{ cursor: "pointer" }}><Icon name="search" size={20} color={T.text2} /></span>
          <span onClick={() => onNotifications?.()} style={{ cursor: "pointer", position: "relative" }}>
            <Icon name="bell" size={20} color={T.text2} />
            <div style={{ position: "absolute", top: -2, right: -2, width: 8, height: 8, borderRadius: 4, background: T.red }} />
          </span>
          <span onClick={() => onMessages?.()} style={{ cursor: "pointer" }}><Icon name="chat" size={20} color={T.text2} /></span>
        </>}
      />
      {/* Feed */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 12px 12px" }}>
        {/* Keşfet: Önerilen Kullanıcılar (S05) */}
        {feedMode === "discover" && suggestedUsers.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.text, padding: "8px 4px 6px" }}>Önerilen Kullanıcılar</div>
            <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8 }}>
              {suggestedUsers.map(u => (
                <div key={u.id} style={{ minWidth: 120, background: T.surface, borderRadius: T.radius, padding: "14px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, border: `1px solid ${T.border}`, flexShrink: 0 }}>
                  <div onClick={() => onProfile?.(u.id)} style={{ cursor: "pointer" }}><Avatar emoji={u.avatar} size={40} /></div>
                  <div onClick={() => onProfile?.(u.id)} style={{ fontSize: 12, fontWeight: 600, color: T.text, cursor: "pointer", textAlign: "center" }}>{u.name}</div>
                  <div style={{ fontSize: 10, color: T.text3 }}>{u.matches} maç</div>
                  <button onClick={() => handleFollow(u.id)} style={{ padding: "4px 14px", borderRadius: 14, fontSize: 11, fontWeight: 600, border: "none", cursor: "pointer", background: followedUsers.includes(u.id) ? T.surface2 : T.accent, color: followedUsers.includes(u.id) ? T.text2 : T.bg }}>
                    {followedUsers.includes(u.id) ? "Takip Ediliyor" : "Takip Et"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Ana Sayfa empty state */}
        {feedMode === "home" && feedMatches.length === 0 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 20px", gap: 16 }}>
            <div style={{ fontSize: 48 }}>👥</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: T.text }}>Henüz kimseyi takip etmiyorsun</div>
            <div style={{ fontSize: 13, color: T.text3, textAlign: "center" }}>Takip ettiğin kullanıcıların maçları burada görünecek</div>
            <button onClick={() => setFeedMode?.("discover")} style={{ padding: "10px 24px", borderRadius: 20, fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer", background: T.accent, color: T.bg }}>Keşfet'e Git</button>
          </div>
        )}
        {/* Match feed */}
        {feedMatches.map(match => (
          <MatchCard key={match.id} match={match} onTap={onMatchTap} onProfile={onProfile} onReport={onReport} />
        ))}
      </div>
    </div>
  );
};

// --- MatchesPage (no changes, already has onUpcomingTap) ---
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
        {/* Katıldığım maçlar (accent border via OpenMatchCard) */}
        {joined.map(m => (
          <OpenMatchCard key={m.id} match={m} onTap={onUpcomingTap} />
        ))}
        {/* Arkadaşların katıldığı maçlar */}
        {friendMatches.map(m => (
          <OpenMatchCard key={m.id} match={m} onTap={onUpcomingTap} />
        ))}
        {/* Diğer açık maçlar */}
        {other.map(m => (
          <OpenMatchCard key={m.id} match={m} onTap={onUpcomingTap} />
        ))}
      </div>
      {/* FAB + butonu */}
      <button onClick={onFAB} style={{ position: "absolute", bottom: 86, right: 22, width: 54, height: 54, borderRadius: 16, background: T.accent, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(183,240,0,0.35)", zIndex: 50 }}>
        <Icon name="plus" size={26} color={T.bg} />
      </button>
      {/* Filtre Popup */}
      {showFilter && (
        <BottomSheet onClose={() => setShowFilter(false)} title="Filtrele">
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
        </BottomSheet>
      )}
    </div>
  );
};

// --- FABSheet ---
const FABSheet = ({ onClose, onStartLive, onCreateMatch }) => (
  <BottomSheet onClose={onClose} title="Ne yapmak istiyorsun?">
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <button onClick={onStartLive} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px", background: T.surface, borderRadius: T.radius, border: `1px solid ${T.border}`, cursor: "pointer", width: "100%" }}>
        <div style={{ width: 40, height: 40, borderRadius: T.radiusFull, background: "rgba(239,68,68,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="fire" size={20} color={T.red} />
        </div>
        <div style={{ textAlign: "left" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>Maç Başlat</div>
          <div style={{ fontSize: 11, color: T.text3 }}>Hemen oynayacağın bir maçı başlat ve skor tut</div>
        </div>
      </button>
      <button onClick={onCreateMatch} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px", background: T.surface, borderRadius: T.radius, border: `1px solid ${T.border}`, cursor: "pointer", width: "100%" }}>
        <div style={{ width: 40, height: 40, borderRadius: T.radiusFull, background: T.accentGhost, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="calendar" size={20} color={T.accent} />
        </div>
        <div style={{ textAlign: "left" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>Maç Oluştur</div>
          <div style={{ fontSize: 11, color: T.text3 }}>İleri tarihli maç planla ve oyuncu bul</div>
        </div>
      </button>
    </div>
  </BottomSheet>
);

// --- LiveScorePage (Fix #6: Goal scorer/assist selection popup) ---
const LiveScorePage = ({ onBack, onFinish }) => {
  const [score, setScore] = useState([0, 0]);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);
  const [goals, setGoals] = useState([]);
  const [toast, setToast] = useState(null);
  const [scorerPopup, setScorerPopup] = useState(null); // { team, goalId, step: "scorer"|"assist" }
  const [confirmEnd, setConfirmEnd] = useState(false);
  const interval = useRef(null);
  const players = USERS;

  useEffect(() => {
    if (running) { interval.current = setInterval(() => setSeconds(s => s + 1), 1000); }
    else { clearInterval(interval.current); }
    return () => clearInterval(interval.current);
  }, [running]);

  const addGoal = (team) => {
    const newScore = [...score];
    newScore[team] += 1;
    setScore(newScore);
    const min = Math.floor(seconds / 60);
    const goalId = Date.now();
    const goal = { min, team, id: goalId, scorer: null, assist: null };
    setGoals(prev => [...prev, goal]);
    setScorerPopup({ team, goalId, step: "scorer" });
    setToast(goalId);
    setTimeout(() => setToast(prev => prev === goalId ? null : prev), 5000);
  };

  const selectScorer = (playerId) => {
    setGoals(prev => prev.map(g => g.id === scorerPopup.goalId ? { ...g, scorer: playerId } : g));
    setScorerPopup(prev => ({ ...prev, step: "assist" }));
  };

  const selectAssist = (playerId) => {
    setGoals(prev => prev.map(g => g.id === scorerPopup.goalId ? { ...g, assist: playerId } : g));
    setScorerPopup(null);
  };

  const skipScorer = () => {
    setScorerPopup(prev => prev?.step === "scorer" ? { ...prev, step: "assist" } : null);
  };

  const skipAssist = () => { setScorerPopup(null); };

  const undoGoal = (goalId) => {
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      const ns = [...score];
      ns[goal.team] -= 1;
      setScore(ns);
      setGoals(prev => prev.filter(g => g.id !== goalId));
      setToast(null);
    }
  };

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: T.bg }}>
      {/* Header */}
      <TopNav
        left={<span onClick={onBack} style={{ cursor: "pointer" }}><Icon name="back" size={22} color={T.text} /></span>}
        center={<span style={{ fontSize: 16, fontWeight: 700, color: T.text }}>Canlı Maç</span>}
        right={<div style={{ width: 10, height: 10, borderRadius: 5, background: T.red }} />}
      />

      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px" }}>
        {/* Timer */}
        <div style={{ textAlign: "center", padding: "24px 0 12px" }}>
          <div style={{ fontSize: 56, fontWeight: 800, color: T.text, fontVariantNumeric: "tabular-nums", letterSpacing: 4 }}>
            {formatTime(seconds)}
          </div>
          <button onClick={() => setRunning(!running)} style={{ marginTop: 10, padding: "8px 24px", borderRadius: 20, fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", background: T.surface2, color: T.text2 }}>
            {running ? "⏸ Duraklat" : "▶ Devam Et"}
          </button>
        </div>

        {/* Score board */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, padding: "20px 0 24px" }}>
          {/* Team 1 */}
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.blue, marginBottom: 10 }}>Mavi Takım</div>
            <div style={{ fontSize: 64, fontWeight: 800, color: T.text, lineHeight: 1 }}>{score[0]}</div>
          </div>
          <div style={{ fontSize: 20, fontWeight: 600, color: T.text3, padding: "0 8px", marginTop: 20 }}>—</div>
          {/* Team 2 */}
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.red, marginBottom: 10 }}>Kırmızı Takım</div>
            <div style={{ fontSize: 64, fontWeight: 800, color: T.text, lineHeight: 1 }}>{score[1]}</div>
          </div>
        </div>

        {/* + Gol buttons */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
          <button onClick={() => addGoal(0)} style={{ flex: 1, padding: "16px", borderRadius: 14, fontSize: 16, fontWeight: 800, border: "none", cursor: "pointer", background: T.blue, color: "#fff" }}>+ Gol</button>
          <button onClick={() => addGoal(1)} style={{ flex: 1, padding: "16px", borderRadius: 14, fontSize: 16, fontWeight: 800, border: "none", cursor: "pointer", background: T.red, color: "#fff" }}>+ Gol</button>
        </div>

        {/* Goals history */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text2, marginBottom: 10 }}>Gol Geçmişi</div>
          {goals.length === 0 && (
            <div style={{ textAlign: "center", padding: "20px 0", fontSize: 13, color: T.text3 }}>Henüz gol yok</div>
          )}
          {goals.map(g => (
            <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: `1px solid ${T.border}` }}>
              <span style={{ fontSize: 12, color: T.text3, width: 30 }}>{g.min}'</span>
              <span style={{ fontSize: 14, color: g.team === 0 ? T.blue : T.red }}>⚽</span>
              <span style={{ flex: 1, fontSize: 13, color: T.text }}>
                {g.scorer ? getUserById(g.scorer).name : "?"} {g.assist ? `(Asist: ${getUserById(g.assist).name})` : ""}
              </span>
              <span onClick={() => undoGoal(g.id)} style={{ fontSize: 11, color: T.red, cursor: "pointer", padding: "4px 8px" }}>Geri Al</span>
            </div>
          ))}
        </div>

        {/* Toast notification for undo */}
        {toast && (
          <div style={{ position: "fixed", bottom: 120, left: "50%", transform: "translateX(-50%)", background: T.surface2, borderRadius: T.radius, padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, zIndex: 100, boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}>
            <span style={{ fontSize: 12, color: T.text }}>Gol eklendi</span>
            <span onClick={() => undoGoal(toast)} style={{ fontSize: 12, color: T.accent, fontWeight: 700, cursor: "pointer" }}>Geri Al</span>
          </div>
        )}
      </div>

      {/* Maçı Bitir - bottom fixed */}
      <div style={{ padding: "12px 20px 20px", flexShrink: 0 }}>
        <button onClick={() => setConfirmEnd(true)} style={{ width: "100%", padding: "16px", borderRadius: 14, fontSize: 16, fontWeight: 800, border: "none", cursor: "pointer", background: T.accent, color: T.bg }}>Maçı Bitir</button>
      </div>

      {/* Scorer popup (Fix #6) */}
      {scorerPopup && scorerPopup.step === "scorer" && (
        <BottomSheet onClose={() => setScorerPopup(null)} title="Kim attı?">
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {players.map(p => (
              <button key={p.id} onClick={() => selectScorer(p.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: T.surface, borderRadius: T.radiusSm, border: `1px solid ${T.border}`, cursor: "pointer", width: "100%" }}>
                <Avatar emoji={p.avatar} size={28} />
                <span style={{ fontSize: 13, color: T.text, fontWeight: 600 }}>{p.name}</span>
              </button>
            ))}
            <button onClick={skipScorer} style={{ padding: "12px", background: T.surface2, borderRadius: T.radiusSm, border: "none", color: T.text3, fontSize: 13, fontWeight: 600, cursor: "pointer", width: "100%", marginTop: 4 }}>Belirtme</button>
          </div>
        </BottomSheet>
      )}

      {/* Assist popup (Fix #6) */}
      {scorerPopup && scorerPopup.step === "assist" && (
        <BottomSheet onClose={() => setScorerPopup(null)} title="Asist?">
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {players.map(p => (
              <button key={p.id} onClick={() => selectAssist(p.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: T.surface, borderRadius: T.radiusSm, border: `1px solid ${T.border}`, cursor: "pointer", width: "100%" }}>
                <Avatar emoji={p.avatar} size={28} />
                <span style={{ fontSize: 13, color: T.text, fontWeight: 600 }}>{p.name}</span>
              </button>
            ))}
            <button onClick={skipAssist} style={{ padding: "12px", background: T.surface2, borderRadius: T.radiusSm, border: "none", color: T.text3, fontSize: 13, fontWeight: 600, cursor: "pointer", width: "100%", marginTop: 4 }}>Yok</button>
            <button onClick={skipAssist} style={{ padding: "12px", background: T.surface2, borderRadius: T.radiusSm, border: "none", color: T.text3, fontSize: 13, fontWeight: 600, cursor: "pointer", width: "100%", marginTop: 2 }}>Atla</button>
          </div>
        </BottomSheet>
      )}

      {/* Confirm end dialog */}
      {confirmEnd && (
        <BottomSheet onClose={() => setConfirmEnd(false)} title="Maçı Bitir">
          <p style={{ fontSize: 13, color: T.text2, marginBottom: 16 }}>Maçı bitirmek istediğine emin misin?</p>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setConfirmEnd(false)} style={{ flex: 1, padding: "12px", borderRadius: T.radiusSm, border: `1px solid ${T.border}`, background: T.surface, color: T.text, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>İptal</button>
            <button onClick={() => { setConfirmEnd(false); setRunning(false); onFinish?.(score, goals, seconds); }} style={{ flex: 1, padding: "12px", borderRadius: T.radiusSm, border: "none", background: T.accent, color: T.bg, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Bitir</button>
          </div>
        </BottomSheet>
      )}
    </div>
  );
};

// --- MatchSummaryPage (Fix #6: goals with scorer/assist, Fix #8: real text inputs) ---
const MatchSummaryPage = ({ onBack, score, duration, goals = [], onShareable, onSave }) => {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [selectedMVP, setSelectedMVP] = useState(null);
  const [editGoals, setEditGoals] = useState(goals);
  const [editingGoal, setEditingGoal] = useState(null); // goalId being edited

  const formatDuration = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}dk ${secs}sn`;
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: T.bg }}>
      <TopNav
        left={<span onClick={onBack} style={{ cursor: "pointer" }}><Icon name="back" size={22} color={T.text} /></span>}
        center={<span style={{ fontSize: 16, fontWeight: 700, color: T.text }}>Maç Özeti</span>}
      />
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 16px" }}>
        {/* Score display */}
        <div style={{ textAlign: "center", padding: "20px 0", background: T.surface, borderRadius: T.radius, marginBottom: 16 }}>
          <div style={{ fontSize: 36, fontWeight: 800, color: T.text }}>{score?.[0] ?? 0} — {score?.[1] ?? 0}</div>
          <div style={{ fontSize: 12, color: T.text3, marginTop: 6 }}>Süre: {typeof duration === "number" ? formatDuration(duration) : duration || "—"}</div>
        </div>

        {/* Goals list with scorer/assist names */}
        {editGoals.length > 0 && (
          <div style={{ background: T.surface, borderRadius: T.radius, padding: "12px", marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 10 }}>Goller</div>
            {editGoals.map(g => (
              <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: `1px solid ${T.border}` }}>
                <span style={{ fontSize: 11, color: T.text3, width: 30 }}>{g.min}'</span>
                <span style={{ fontSize: 12, color: g.team === 0 ? T.accent : T.blue }}>⚽</span>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 12, color: T.text, fontWeight: 600 }}>{g.scorer ? getUserById(g.scorer).name : "Belirtilmedi"}</span>
                  {g.assist && <span style={{ fontSize: 11, color: T.text3, marginLeft: 6 }}>(Asist: {getUserById(g.assist).name})</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Match title (Fix #8: real text input) */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: T.text2, marginBottom: 6, display: "block" }}>Maç Başlığı</label>
          <TextInput value={title} onChange={setTitle} placeholder="Ör: Kadıköy Halısaha Klasik" />
        </div>

        {/* Note (Fix #8: real textarea) */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: T.text2, marginBottom: 6, display: "block" }}>Not Ekle</label>
          <TextArea value={note} onChange={setNote} placeholder="Maç hakkında not yaz..." rows={3} />
        </div>

        {/* MVP Selector */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: T.text2, marginBottom: 10, display: "block" }}>Maçın Yıldızı (MVP)</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {USERS.slice(0, 5).map(p => (
              <div key={p.id} onClick={() => setSelectedMVP(p.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", padding: "8px", borderRadius: T.radiusSm, background: selectedMVP === p.id ? T.accentGhost : T.surface, border: selectedMVP === p.id ? `2px solid ${T.accent}` : `1px solid ${T.border}` }}>
                <Avatar emoji={p.avatar} size={32} border={selectedMVP === p.id} />
                <span style={{ fontSize: 10, color: selectedMVP === p.id ? T.accent : T.text2, fontWeight: 600 }}>{p.name.split(" ")[0]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <button onClick={() => onSave?.({ title, note, mvp: selectedMVP, goals: editGoals })} style={{ flex: 1, padding: "14px", borderRadius: T.radius, border: "none", background: T.accent, color: T.bg, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Kaydet ve Paylaş</button>
        </div>
        <button onClick={() => onShareable?.({ score, title, goals: editGoals, mvp: selectedMVP })} style={{ width: "100%", padding: "12px", borderRadius: T.radius, border: `1px solid ${T.border}`, background: T.surface, color: T.text2, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Paylaşılabilir Kart Oluştur</button>
      </div>
    </div>
  );
};

// --- ProfilePage (Fix #9: PanoGrid buttons, Fix #10: edit/settings buttons navigate) ---
const ProfilePage = ({ userId, onMatchTap, onProfile, onBack, onEdit, onSettings, onPanoItem }) => {
  const user = userId ? getUserById(userId) : USERS[0];
  const isSelf = !userId || userId === 1;
  const [followState, setFollowState] = useState(false);
  const [activeTab, setActiveTab] = useState("matches");

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <TopNav
        left={onBack ? <span onClick={onBack} style={{ cursor: "pointer" }}><Icon name="back" size={22} color={T.text} /></span> : null}
        center={<span style={{ fontSize: 16, fontWeight: 700, color: T.text }}>{user.username}</span>}
        right={isSelf ? <span onClick={() => onSettings?.()} style={{ cursor: "pointer" }}><Icon name="settings" size={20} color={T.text2} /></span> : null}
      />
      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Profile header */}
        <div style={{ padding: "0 16px 12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
            <Avatar emoji={user.avatar} size={64} border={user.verified} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: T.text }}>{user.name}</span>
                {user.verified && <span style={{ fontSize: 12, color: T.accent }}>✓</span>}
              </div>
              <div style={{ fontSize: 11, color: T.text3 }}>📍 {user.city}</div>
              {user.bio && <div style={{ fontSize: 12, color: T.text2, marginTop: 4 }}>{user.bio}</div>}
            </div>
          </div>
          {/* Stats row */}
          <div style={{ display: "flex", gap: 20, marginBottom: 12 }}>
            {[
              { label: "Maç", value: user.matches },
              { label: "Takipçi", value: user.followers },
              { label: "Takip", value: user.following },
            ].map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: T.text }}>{s.value}</div>
                <div style={{ fontSize: 10, color: T.text3 }}>{s.label}</div>
              </div>
            ))}
          </div>
          {/* Action buttons (Fix #10) */}
          {isSelf ? (
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => onEdit?.()} style={{ flex: 1, padding: "8px", borderRadius: T.radiusSm, fontSize: 12, fontWeight: 600, border: `1px solid ${T.border}`, background: T.surface, color: T.text, cursor: "pointer" }}>Profili Düzenle</button>
              <button onClick={() => onSettings?.()} style={{ padding: "8px 12px", borderRadius: T.radiusSm, fontSize: 12, fontWeight: 600, border: `1px solid ${T.border}`, background: T.surface, color: T.text2, cursor: "pointer" }}>
                <Icon name="settings" size={16} color={T.text2} />
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setFollowState(!followState)} style={{ flex: 1, padding: "8px", borderRadius: T.radiusSm, fontSize: 12, fontWeight: 700, border: "none", background: followState ? T.surface2 : T.accent, color: followState ? T.text : T.bg, cursor: "pointer" }}>
                {followState ? "Takiptesin" : "Takip Et"}
              </button>
              <button style={{ padding: "8px 12px", borderRadius: T.radiusSm, fontSize: 12, fontWeight: 600, border: `1px solid ${T.border}`, background: T.surface, color: T.text, cursor: "pointer" }}>Mesaj</button>
            </div>
          )}
        </div>

        {/* Pano Grid (Fix #9) */}
        <div style={{ padding: "0 16px 12px" }}>
          <PanoGrid onItemTap={onPanoItem} />
        </div>

        {/* Quick stats */}
        <div style={{ padding: "0 16px 12px" }}>
          <div style={{ background: T.surface, borderRadius: T.radius, padding: "12px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, textAlign: "center" }}>
              {[
                { label: "Gol", value: user.goals, color: T.accent },
                { label: "Asist", value: user.assists, color: T.blue },
                { label: "Galibiyet", value: user.wins, color: T.green },
                { label: "MVP", value: user.mvpCount, color: T.orange },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: T.text3 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly activity chart */}
        <div style={{ padding: "0 16px 12px" }}>
          <div style={{ background: T.surface, borderRadius: T.radius, padding: "12px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.text, marginBottom: 10 }}>Haftalık Aktivite</div>
            <BarChart data={user.weeklyMatches} labels={["O","Ş","M","N","M","H","T","A","E","E","K","A"]} />
          </div>
        </div>

        {/* Tab selector */}
        <div style={{ display: "flex", padding: "0 16px 10px", gap: 8 }}>
          {[{ id: "matches", label: "Maçlar" }, { id: "about", label: "Hakkında" }].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ flex: 1, padding: "8px", borderRadius: T.radiusSm, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer", background: activeTab === t.id ? T.accent : T.surface2, color: activeTab === t.id ? T.bg : T.text2 }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ padding: "0 12px 20px" }}>
          {activeTab === "matches" ? (
            PAST_MATCHES.filter(m => m.team1.includes(user.id) || m.team2.includes(user.id) || m.userId === user.id).length > 0
              ? PAST_MATCHES.filter(m => m.team1.includes(user.id) || m.team2.includes(user.id) || m.userId === user.id).map(match => (
                <MatchCard key={match.id} match={match} onTap={onMatchTap} onProfile={onProfile} />
              ))
              : <div style={{ textAlign: "center", padding: "30px 0", color: T.text3, fontSize: 13 }}>Henüz maç yok</div>
          ) : (
            <div style={{ background: T.surface, borderRadius: T.radius, padding: "14px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { label: "Şehir", value: user.city },
                  { label: "Toplam Maç", value: user.matches },
                  { label: "Galibiyet / Mağlubiyet", value: `${user.wins}G - ${user.losses}M - ${user.draws}B` },
                  { label: "Gol / Asist", value: `${user.goals}G - ${user.assists}A` },
                ].map(item => (
                  <div key={item.label} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 12, color: T.text3 }}>{item.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- MatchDetailPage (S11: full match detail with rosters, interactions, comments) ---
const MatchDetailPage = ({ match, onBack, onProfile }) => {
  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [localComments, setLocalComments] = useState(match?.comments || []);
  const [showAllComments, setShowAllComments] = useState(false);

  if (!match) return null;
  const user = getUserById(match.userId);

  // Compute per-player gol/asist stats from goals data
  const playerStats = {};
  match.goals.forEach(g => {
    if (!playerStats[g.scorer]) playerStats[g.scorer] = { goals: 0, assists: 0 };
    playerStats[g.scorer].goals++;
    if (g.assist) {
      if (!playerStats[g.assist]) playerStats[g.assist] = { goals: 0, assists: 0 };
      playerStats[g.assist].assists++;
    }
  });

  const addComment = () => {
    if (!commentText.trim()) return;
    setLocalComments(prev => [...prev, { userId: 1, text: commentText, time: "Az önce" }]);
    setCommentText("");
  };

  const renderPlayerRow = (id) => {
    const p = getUserById(id);
    const stats = playerStats[id] || { goals: 0, assists: 0 };
    return (
      <div key={id} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 0", borderBottom: `1px solid ${T.border}` }}>
        <div onClick={() => onProfile?.(id)} style={{ cursor: "pointer" }}><Avatar emoji={p.avatar} size={26} /></div>
        <div style={{ flex: 1 }}><ClickableName userId={id} onProfile={onProfile} style={{ fontSize: 12 }} /></div>
        {stats.goals > 0 && <span style={{ fontSize: 10, color: T.text2, background: T.bg2, borderRadius: 10, padding: "2px 6px" }}>⚽ {stats.goals}</span>}
        {stats.assists > 0 && <span style={{ fontSize: 10, color: T.text2, background: T.bg2, borderRadius: 10, padding: "2px 6px" }}>🅰️ {stats.assists}</span>}
        {match.mvp === id && <span style={{ fontSize: 14 }} title="MVP">⭐</span>}
      </div>
    );
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <TopNav
        left={<span onClick={onBack} style={{ cursor: "pointer" }}><Icon name="back" size={22} color={T.text} /></span>}
        center={<span style={{ fontSize: 16, fontWeight: 700, color: T.text }}>Maç Detayı</span>}
      />
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 16px" }}>
        {/* Match info */}
        <div style={{ background: T.surface, borderRadius: T.radius, padding: "16px", marginBottom: 12 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: T.text, marginBottom: 8 }}>{match.title}</div>
          <div style={{ display: "flex", gap: 10, fontSize: 11, color: T.text2, flexWrap: "wrap", marginBottom: 12 }}>
            <span>📅 {match.date}</span>
            <span>⏰ {match.time}</span>
            <span>⏱ {match.duration}</span>
            <span>📍 {match.location}</span>
            <span>👥 {match.format}</span>
          </div>
          {/* Shared by */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div onClick={() => onProfile?.(user.id)} style={{ cursor: "pointer" }}><Avatar emoji={user.avatar} size={24} /></div>
            <ClickableName userId={user.id} onProfile={onProfile} style={{ fontSize: 12 }} />
            <span style={{ fontSize: 11, color: T.text3 }}>tarafından paylaşıldı</span>
          </div>
        </div>

        {/* Score */}
        <div style={{ background: T.surface, borderRadius: T.radius, padding: "20px 16px", marginBottom: 12, textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{match.team1Name}</div>
            <div style={{ fontSize: 36, fontWeight: 800, color: T.text }}>{match.score[0]} — {match.score[1]}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{match.team2Name}</div>
          </div>
        </div>

        {/* Team Rosters (S11: yan yana iki kolon) */}
        <div style={{ background: T.surface, borderRadius: T.radius, padding: "14px", marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 10 }}>Takım Kadroları</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.accent, marginBottom: 6 }}>{match.team1Name}</div>
              {match.team1.map(id => renderPlayerRow(id))}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.accent, marginBottom: 6 }}>{match.team2Name}</div>
              {match.team2.map(id => renderPlayerRow(id))}
            </div>
          </div>
        </div>

        {/* Goals timeline */}
        <div style={{ background: T.surface, borderRadius: T.radius, padding: "14px", marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 10 }}>Gol Zaman Çizelgesi</div>
          {match.goals.map((g, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: i < match.goals.length - 1 ? `1px solid ${T.border}` : "none" }}>
              <span style={{ fontSize: 11, color: T.text3, width: 30 }}>{g.min}'</span>
              <span style={{ fontSize: 12 }}>⚽</span>
              <ClickableName userId={g.scorer} onProfile={onProfile} style={{ fontSize: 12 }} />
              {g.assist && (
                <span style={{ fontSize: 11, color: T.text3 }}>
                  (Asist: <ClickableName userId={g.assist} onProfile={onProfile} style={{ fontSize: 11, fontWeight: 600 }} />)
                </span>
              )}
            </div>
          ))}
        </div>

        {/* MVP (S11: altın çerçeve vurgulu) */}
        {match.mvp && (
          <div style={{ background: T.surface, borderRadius: T.radius, padding: "14px", display: "flex", alignItems: "center", gap: 10, marginBottom: 12, border: `2px solid ${T.orange}` }}>
            <span style={{ fontSize: 20 }}>⭐</span>
            <div>
              <div style={{ fontSize: 11, color: T.orange, fontWeight: 600 }}>Maçın Yıldızı</div>
              <ClickableName userId={match.mvp} onProfile={onProfile} style={{ fontSize: 13, fontWeight: 700 }} />
            </div>
          </div>
        )}

        {/* Photos */}
        {match.photos && (
          <div style={{ background: T.surface, borderRadius: T.radius, padding: "14px", marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 10 }}>Fotoğraflar</div>
            <div style={{ display: "flex", gap: 8 }}>
              {[1,2,3].map(i => (
                <div key={i} style={{ width: 80, height: 80, borderRadius: T.radiusSm, background: `linear-gradient(135deg, ${T.surface2}, ${T.border})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: T.text3 }}>📸</div>
              ))}
            </div>
          </div>
        )}

        {/* Interaction section (S11: beğeni/yorum/paylaş + beğenenler + yorumlar) */}
        <div style={{ background: T.surface, borderRadius: T.radius, padding: "12px 14px", marginBottom: 12 }}>
          {/* Interaction bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 10 }}>
            <button onClick={() => setLiked(!liked)} style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: 5, cursor: "pointer", padding: 0 }}>
              <svg width={18} height={18} viewBox="0 0 24 24" fill={liked ? T.red : "none"} stroke={liked ? T.red : T.text3} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
              <span style={{ fontSize: 12, color: liked ? T.red : T.text3, fontWeight: 600 }}>{match.likes + (liked ? 1 : 0)}</span>
            </button>
            <button onClick={() => setShowAllComments(!showAllComments)} style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: 5, cursor: "pointer", padding: 0 }}>
              <Icon name="comment" size={18} color={T.text3} />
              <span style={{ fontSize: 12, color: T.text3, fontWeight: 600 }}>{localComments.length}</span>
            </button>
            <button style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: 5, cursor: "pointer", padding: 0 }}>
              <Icon name="share" size={18} color={T.text3} />
            </button>
          </div>
          {/* Beğenenler satırı */}
          {match.likes > 0 && (
            <div style={{ fontSize: 11, color: T.text2, marginBottom: 8 }}>
              <span style={{ fontWeight: 700, color: T.text }}>Beğenenler: </span>
              <ClickableName userId={2} onProfile={onProfile} style={{ fontSize: 11 }} />
              <span> ve {match.likes - 1} kişi daha</span>
            </div>
          )}
          {/* Comments list */}
          {showAllComments ? localComments.map((c, i) => (
            <div key={i} style={{ padding: "4px 0", display: "flex", gap: 8, alignItems: "flex-start" }}>
              <div onClick={() => onProfile?.(c.userId)} style={{ cursor: "pointer" }}><Avatar emoji={getUserById(c.userId).avatar} size={22} /></div>
              <div style={{ flex: 1 }}>
                <ClickableName userId={c.userId} onProfile={onProfile} style={{ fontSize: 11 }} />
                <span style={{ fontSize: 11, color: T.text3, marginLeft: 6 }}>{c.time}</span>
                <div style={{ fontSize: 12, color: T.text2, marginTop: 2 }}>{c.text}</div>
              </div>
            </div>
          )) : localComments.length > 0 && (
            <div style={{ padding: "4px 0", display: "flex", gap: 8, alignItems: "flex-start" }}>
              <div onClick={() => onProfile?.(localComments[0].userId)} style={{ cursor: "pointer" }}><Avatar emoji={getUserById(localComments[0].userId).avatar} size={22} /></div>
              <div style={{ flex: 1 }}>
                <ClickableName userId={localComments[0].userId} onProfile={onProfile} style={{ fontSize: 11 }} />
                <span style={{ fontSize: 11, color: T.text3, marginLeft: 6 }}>{localComments[0].time}</span>
                <div style={{ fontSize: 12, color: T.text2, marginTop: 2 }}>{localComments[0].text}</div>
              </div>
            </div>
          )}
          {localComments.length > 1 && !showAllComments && (
            <div onClick={() => setShowAllComments(true)} style={{ fontSize: 11, color: T.text3, cursor: "pointer", padding: "4px 0" }}>
              Tüm {localComments.length} yorumu gör...
            </div>
          )}
          {/* Comment input */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
            <Avatar emoji={USERS[0].avatar} size={22} />
            <input
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addComment()}
              placeholder="Bir yorum ekle..."
              style={{ flex: 1, fontSize: 12, color: T.text, background: T.bg2, borderRadius: 20, padding: "7px 12px", border: "none", outline: "none" }}
            />
            {commentText && <button onClick={addComment} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}><Icon name="send" size={16} color={T.accent} /></button>}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- PlannedMatchDetailPage (no changes needed) ---
const PlannedMatchDetailPage = ({ match, onBack, onProfile }) => {
  const [joined, setJoined] = useState(match?.joined || false);
  if (!match) return null;
  const organizer = getUserById(match.organizer);
  const spotsLeft = match.maxPlayers - match.currentPlayers - (joined && !match.joined ? 1 : 0);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <TopNav
        left={<span onClick={onBack} style={{ cursor: "pointer" }}><Icon name="back" size={22} color={T.text} /></span>}
        center={<span style={{ fontSize: 16, fontWeight: 700, color: T.text }}>Maç Detayı</span>}
      />
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 16px" }}>
        {/* Match info */}
        <div style={{ background: T.surface, borderRadius: T.radius, padding: "16px", marginBottom: 12 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: T.text, marginBottom: 4 }}>{match.title}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div onClick={() => onProfile?.(organizer.id)} style={{ cursor: "pointer" }}><Avatar emoji={organizer.avatar} size={24} /></div>
            <ClickableName userId={organizer.id} onProfile={onProfile} style={{ fontSize: 12 }} />
            <span style={{ fontSize: 11, color: T.text3 }}>tarafından organize edildi</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { icon: "calendar", label: match.date },
              { icon: "clock", label: match.time },
              { icon: "mapPin", label: match.location },
              { icon: "users", label: `${match.format} · ${match.level}` },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Icon name={item.icon} size={16} color={T.text3} />
                <span style={{ fontSize: 12, color: T.text2 }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Capacity */}
        <div style={{ background: T.surface, borderRadius: T.radius, padding: "14px", marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: T.text2 }}>Kapasite</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: spotsLeft <= 2 ? T.red : T.accent }}>{spotsLeft} kişi kaldı</span>
          </div>
          <ProgressBar current={match.currentPlayers + (joined && !match.joined ? 1 : 0)} max={match.maxPlayers} />
          <div style={{ fontSize: 11, color: T.text3, marginTop: 6 }}>{match.currentPlayers + (joined && !match.joined ? 1 : 0)} / {match.maxPlayers} oyuncu</div>
        </div>

        {/* Participants */}
        <div style={{ background: T.surface, borderRadius: T.radius, padding: "14px", marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 10 }}>Katılımcılar</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {match.participants.map(id => {
              const p = getUserById(id);
              return (
                <div key={id} onClick={() => onProfile?.(id)} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <Avatar emoji={p.avatar} size={28} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{p.name}</span>
                  {id === match.organizer && <Badge text="Organizatör" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Approval mode info */}
        {match.approvalMode === "Onay ile Kabul Et" && (
          <div style={{ background: T.surface, borderRadius: T.radius, padding: "14px", marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
            <Icon name="shield" size={18} color={T.orange} />
            <div style={{ fontSize: 12, color: T.text2 }}>Bu maça katılmak organizatör onayı gerektirir</div>
          </div>
        )}

        {/* Join button */}
        <button onClick={() => setJoined(!joined)} style={{ width: "100%", padding: "14px", borderRadius: T.radius, border: "none", background: joined ? T.surface2 : T.accent, color: joined ? T.text : T.bg, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
          {joined ? (match.approvalMode === "Onay ile Kabul Et" ? "Başvuru Gönderildi ✓" : "Katılımdan Çık") : (match.approvalMode === "Onay ile Kabul Et" ? "Katılmak İçin Başvur" : "Katıl")}
        </button>
      </div>
    </div>
  );
};

// ============================================================
// PART 3 — Batch 2 Page Components
// ============================================================

// --- LoginPage (S01) ---
const LoginPage = ({ onBack, onRegister, onForgotPassword, onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: T.bg }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "0 24px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 56, marginBottom: 8 }}>⚽</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: T.accent, letterSpacing: 2 }}>SporWave</div>
        </div>

        {/* Email input */}
        <div style={{ marginBottom: 12 }}>
          <TextInput value={email} onChange={setEmail} placeholder="E-posta adresi" type="email" />
        </div>

        {/* Password input */}
        <div style={{ marginBottom: 8 }}>
          <TextInput value={password} onChange={setPassword} placeholder="Şifre" type="password" />
        </div>

        {/* Forgot password link */}
        <div style={{ textAlign: "right", marginBottom: 20 }}>
          <span onClick={() => onForgotPassword?.()} style={{ fontSize: 12, color: T.accentText, cursor: "pointer", fontWeight: 600 }}>Şifremi Unuttum</span>
        </div>

        {/* Login button */}
        <button onClick={() => onLogin?.()} style={{ width: "100%", padding: "14px", borderRadius: T.radius, border: "none", background: T.accent, color: T.bg, fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 20 }}>
          Giriş Yap
        </button>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: T.border }} />
          <span style={{ fontSize: 12, color: T.text3, fontWeight: 500 }}>veya</span>
          <div style={{ flex: 1, height: 1, background: T.border }} />
        </div>

        {/* Google button */}
        <button style={{ width: "100%", padding: "12px", borderRadius: T.radius, border: `1px solid ${T.border}`, background: T.surface, color: T.text, fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>🔵</span> Google ile devam et
        </button>

        {/* Apple button */}
        <button style={{ width: "100%", padding: "12px", borderRadius: T.radius, border: `1px solid ${T.border}`, background: T.surface, color: T.text, fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>🍎</span> Apple ile devam et
        </button>

        {/* Register link */}
        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: 13, color: T.text3 }}>Hesabın yok mu? </span>
          <span onClick={() => onRegister?.()} style={{ fontSize: 13, color: T.accentText, fontWeight: 700, cursor: "pointer" }}>Kayıt Ol</span>
        </div>
      </div>
    </div>
  );
};

// --- RegisterPage (S02) ---
const RegisterPage = ({ onBack, onLogin, onRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [kvkkAccepted, setKvkkAccepted] = useState(false);

  const getPasswordStrength = () => {
    if (password.length === 0) return { width: "0%", color: T.border, label: "" };
    if (password.length < 4) return { width: "25%", color: T.red, label: "Zayıf" };
    if (password.length < 8) return { width: "50%", color: T.orange, label: "Orta" };
    if (password.length < 12) return { width: "75%", color: T.blue, label: "İyi" };
    return { width: "100%", color: T.green, label: "Güçlü" };
  };
  const strength = getPasswordStrength();

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: T.bg }}>
      {/* TopNav with back */}
      <TopNav
        left={<span onClick={onBack} style={{ cursor: "pointer" }}><Icon name="back" size={22} color={T.text} /></span>}
        center={<span style={{ fontSize: 16, fontWeight: 700, color: T.text }}>Kayıt Ol</span>}
      />

      <div style={{ flex: 1, overflowY: "auto", padding: "0 24px 24px" }}>
        {/* Small logo */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <span style={{ fontSize: 28 }}>⚽</span>
          <span style={{ fontSize: 18, fontWeight: 800, color: T.accent, letterSpacing: 1, marginLeft: 6 }}>SporWave</span>
        </div>

        {/* Email */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: T.text2, marginBottom: 6, display: "block" }}>E-posta</label>
          <TextInput value={email} onChange={setEmail} placeholder="ornek@email.com" type="email" />
        </div>

        {/* Password */}
        <div style={{ marginBottom: 4 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: T.text2, marginBottom: 6, display: "block" }}>Şifre</label>
          <TextInput value={password} onChange={setPassword} placeholder="En az 8 karakter" type="password" />
        </div>

        {/* Password strength indicator */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ height: 4, background: T.surface2, borderRadius: 2, overflow: "hidden", marginTop: 6 }}>
            <div style={{ height: "100%", width: strength.width, background: strength.color, borderRadius: 2, transition: "width 0.3s, background 0.3s" }} />
          </div>
          {strength.label && <span style={{ fontSize: 10, color: strength.color, fontWeight: 600, marginTop: 4, display: "inline-block" }}>{strength.label}</span>}
        </div>

        {/* Password confirm */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: T.text2, marginBottom: 6, display: "block" }}>Şifre Tekrar</label>
          <TextInput value={passwordConfirm} onChange={setPasswordConfirm} placeholder="Şifreyi tekrar girin" type="password" />
          {passwordConfirm.length > 0 && password !== passwordConfirm && (
            <span style={{ fontSize: 10, color: T.red, marginTop: 4, display: "inline-block" }}>Şifreler eşleşmiyor</span>
          )}
        </div>

        {/* KVKK checkbox */}
        <div onClick={() => setKvkkAccepted(!kvkkAccepted)} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 20, cursor: "pointer" }}>
          <div style={{ width: 20, height: 20, borderRadius: 4, border: `2px solid ${kvkkAccepted ? T.accent : T.border}`, background: kvkkAccepted ? T.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
            {kvkkAccepted && <Icon name="check" size={14} color={T.bg} />}
          </div>
          <span style={{ fontSize: 12, color: T.text2, lineHeight: "18px" }}>
            <span style={{ color: T.accentText, fontWeight: 600 }}>KVKK Aydınlatma Metni</span>'ni okudum ve kabul ediyorum.
          </span>
        </div>

        {/* Register button */}
        <button onClick={() => onRegister?.()} style={{ width: "100%", padding: "14px", borderRadius: T.radius, border: "none", background: kvkkAccepted ? T.accent : T.surface2, color: kvkkAccepted ? T.bg : T.text3, fontSize: 15, fontWeight: 700, cursor: kvkkAccepted ? "pointer" : "default", marginBottom: 16, opacity: kvkkAccepted ? 1 : 0.6 }}>
          Kayıt Ol
        </button>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 1, background: T.border }} />
          <span style={{ fontSize: 12, color: T.text3, fontWeight: 500 }}>veya</span>
          <div style={{ flex: 1, height: 1, background: T.border }} />
        </div>

        {/* Google button */}
        <button style={{ width: "100%", padding: "12px", borderRadius: T.radius, border: `1px solid ${T.border}`, background: T.surface, color: T.text, fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>🔵</span> Google ile devam et
        </button>

        {/* Apple button */}
        <button style={{ width: "100%", padding: "12px", borderRadius: T.radius, border: `1px solid ${T.border}`, background: T.surface, color: T.text, fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>🍎</span> Apple ile devam et
        </button>

        {/* Login link */}
        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: 13, color: T.text3 }}>Zaten hesabın var mı? </span>
          <span onClick={() => onLogin?.()} style={{ fontSize: 13, color: T.accentText, fontWeight: 700, cursor: "pointer" }}>Giriş Yap</span>
        </div>
      </div>
    </div>
  );
};

// --- ForgotPasswordPage (S03) ---
const ForgotPasswordPage = ({ onBack }) => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: T.bg }}>
      <TopNav
        left={<span onClick={onBack} style={{ cursor: "pointer" }}><Icon name="back" size={22} color={T.text} /></span>}
        center={<span style={{ fontSize: 16, fontWeight: 700, color: T.text }}>Şifremi Unuttum</span>}
      />

      <div style={{ flex: 1, overflowY: "auto", padding: "0 24px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {!sent ? (
          <>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <Icon name="mail" size={48} color={T.text3} />
              <div style={{ fontSize: 14, color: T.text2, marginTop: 12, lineHeight: "20px" }}>
                Kayıtlı e-posta adresini gir, sana şifre sıfırlama linki gönderelim.
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <TextInput value={email} onChange={setEmail} placeholder="E-posta adresi" type="email" />
            </div>

            <button onClick={() => { if (email.trim()) setSent(true); }} style={{ width: "100%", padding: "14px", borderRadius: T.radius, border: "none", background: email.trim() ? T.accent : T.surface2, color: email.trim() ? T.bg : T.text3, fontSize: 14, fontWeight: 700, cursor: email.trim() ? "pointer" : "default", marginBottom: 20, opacity: email.trim() ? 1 : 0.6 }}>
              Sıfırlama Linki Gönder
            </button>
          </>
        ) : (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✉️</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 8 }}>Link Gönderildi!</div>
            <div style={{ fontSize: 13, color: T.text2, lineHeight: "20px", marginBottom: 24 }}>
              <span style={{ color: T.accent, fontWeight: 600 }}>{email}</span> adresine şifre sıfırlama linki gönderdik. Lütfen e-postanı kontrol et.
            </div>
          </div>
        )}

        <div style={{ textAlign: "center" }}>
          <span onClick={() => onBack?.()} style={{ fontSize: 13, color: T.accentText, fontWeight: 600, cursor: "pointer" }}>Giriş Yap'a Dön</span>
        </div>
      </div>
    </div>
  );
};

// --- OnboardingPage (S04 - 4 steps) ---
const OnboardingPage = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  // Step 1
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("");
  // Step 2
  const [photoUploaded, setPhotoUploaded] = useState(false);
  // Step 3
  const [selectedSports, setSelectedSports] = useState([]);
  // Step 4
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [rulesAccepted, setRulesAccepted] = useState(false);

  const sports = [
    { label: "Futbol", emoji: "⚽" },
    { label: "Basketbol", emoji: "🏀" },
    { label: "Tenis", emoji: "🎾" },
    { label: "Padel", emoji: "🏓" },
    { label: "Koşu", emoji: "🏃" },
    { label: "Bisiklet", emoji: "🚴" },
    { label: "Voleybol", emoji: "🏐" },
    { label: "Yüzme", emoji: "🏊" },
    { label: "Fitness", emoji: "💪" },
    { label: "Diğer", emoji: "➕" },
  ];

  const toggleSport = (label) => {
    setSelectedSports(prev => prev.includes(label) ? prev.filter(s => s !== label) : [...prev, label]);
  };

  const genders = ["Erkek", "Kadın", "Belirtmek İstemiyorum"];
  const cities = ["İstanbul", "Ankara", "İzmir"];
  const districts = city === "İstanbul" ? ["Kadıköy", "Beşiktaş", "Bakırköy", "Ataşehir", "Üsküdar"] : city === "Ankara" ? ["Çankaya", "Keçiören", "Mamak"] : city === "İzmir" ? ["Konak", "Bornova", "Karşıyaka"] : [];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: T.bg }}>
      {/* Progress bar */}
      <div style={{ padding: "8px 24px 0" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {[1, 2, 3, 4].map(s => (
            <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: s <= step ? T.accent : T.surface2, transition: "background 0.3s" }} />
          ))}
        </div>
        <div style={{ fontSize: 11, color: T.text3, marginTop: 6, textAlign: "center" }}>Adım {step} / 4</div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px 24px" }}>

        {/* Step 1 - Basic Info */}
        {step === 1 && (
          <>
            <div style={{ fontSize: 20, fontWeight: 800, color: T.text, marginBottom: 4 }}>Merhaba!</div>
            <div style={{ fontSize: 13, color: T.text2, marginBottom: 24 }}>Seni tanıyalım.</div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: T.text2, marginBottom: 6, display: "block" }}>Ad</label>
              <TextInput value={firstName} onChange={setFirstName} placeholder="Adın" />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: T.text2, marginBottom: 6, display: "block" }}>Soyad</label>
              <TextInput value={lastName} onChange={setLastName} placeholder="Soyadın" />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: T.text2, marginBottom: 6, display: "block" }}>Doğum Tarihi</label>
              <input
                type="date"
                value={birthdate}
                onChange={e => setBirthdate(e.target.value)}
                style={{ width: "100%", background: T.surface, borderRadius: T.radiusSm, padding: "10px 12px", color: T.text, fontSize: 13, border: `1px solid ${T.border}`, outline: "none", boxSizing: "border-box", colorScheme: "dark" }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: T.text2, marginBottom: 10, display: "block" }}>Cinsiyet</label>
              <div style={{ display: "flex", gap: 8 }}>
                {genders.map(g => (
                  <button key={g} onClick={() => setGender(g)} style={{ flex: 1, padding: "10px 6px", borderRadius: 20, fontSize: 11, fontWeight: 600, border: gender === g ? `2px solid ${T.accent}` : `1px solid ${T.border}`, background: gender === g ? T.accentGhost : T.surface, color: gender === g ? T.accent : T.text2, cursor: "pointer" }}>
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={() => setStep(2)} style={{ width: "100%", padding: "14px", borderRadius: T.radius, border: "none", background: T.accent, color: T.bg, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              Devam
            </button>
          </>
        )}

        {/* Step 2 - Photo */}
        {step === 2 && (
          <>
            <div style={{ fontSize: 20, fontWeight: 800, color: T.text, marginBottom: 4 }}>Profil Fotoğrafı</div>
            <div style={{ fontSize: 13, color: T.text2, marginBottom: 32 }}>Diğer oyuncular seni tanısın.</div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 32 }}>
              {/* Big circle placeholder */}
              <div style={{ width: 120, height: 120, borderRadius: "50%", background: photoUploaded ? `linear-gradient(135deg, ${T.accentGhost}, ${T.surface2})` : `linear-gradient(135deg, ${T.surface2}, ${T.border})`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, border: photoUploaded ? `3px solid ${T.accent}` : `2px dashed ${T.border}` }}>
                {photoUploaded ? (
                  <span style={{ fontSize: 48 }}>🧑‍💼</span>
                ) : (
                  <Icon name="image" size={36} color={T.text3} />
                )}
              </div>

              <button onClick={() => setPhotoUploaded(true)} style={{ padding: "10px 24px", borderRadius: T.radius, border: `1px solid ${T.accent}`, background: T.accentGhost, color: T.accent, fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 12 }}>
                Fotoğraf Yükle
              </button>

              <span onClick={() => setStep(3)} style={{ fontSize: 12, color: T.text3, cursor: "pointer", fontWeight: 500 }}>Sonra Ekle</span>
            </div>

            <button onClick={() => setStep(3)} style={{ width: "100%", padding: "14px", borderRadius: T.radius, border: "none", background: T.accent, color: T.bg, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              Devam
            </button>
          </>
        )}

        {/* Step 3 - Sports */}
        {step === 3 && (
          <>
            <div style={{ fontSize: 20, fontWeight: 800, color: T.text, marginBottom: 4 }}>Hangi sporları yapıyorsun?</div>
            <div style={{ fontSize: 13, color: T.text2, marginBottom: 24 }}>Birden fazla seçebilirsin.</div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 32 }}>
              {sports.map(s => {
                const selected = selectedSports.includes(s.label);
                return (
                  <button key={s.label} onClick={() => toggleSport(s.label)} style={{ padding: "14px 10px", borderRadius: T.radius, border: selected ? `2px solid ${T.accent}` : `1px solid ${T.border}`, background: selected ? T.accentGhost : T.surface, color: selected ? T.accent : T.text, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <span style={{ fontSize: 18 }}>{s.emoji}</span> {s.label}
                  </button>
                );
              })}
            </div>

            <button onClick={() => setStep(4)} style={{ width: "100%", padding: "14px", borderRadius: T.radius, border: "none", background: T.accent, color: T.bg, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              Devam
            </button>
          </>
        )}

        {/* Step 4 - Location & Rules */}
        {step === 4 && (
          <>
            <div style={{ fontSize: 20, fontWeight: 800, color: T.text, marginBottom: 4 }}>Konum ve Kurallar</div>
            <div style={{ fontSize: 13, color: T.text2, marginBottom: 24 }}>Son adım!</div>

            {/* City dropdown */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: T.text2, marginBottom: 6, display: "block" }}>Şehir</label>
              <select
                value={city}
                onChange={e => { setCity(e.target.value); setDistrict(""); }}
                style={{ width: "100%", background: T.surface, borderRadius: T.radiusSm, padding: "10px 12px", color: city ? T.text : T.text3, fontSize: 13, border: `1px solid ${T.border}`, outline: "none", boxSizing: "border-box", appearance: "none", WebkitAppearance: "none" }}
              >
                <option value="" style={{ background: T.surface, color: T.text3 }}>Şehir Seç</option>
                {cities.map(c => <option key={c} value={c} style={{ background: T.surface, color: T.text }}>{c}</option>)}
              </select>
            </div>

            {/* District dropdown */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: T.text2, marginBottom: 6, display: "block" }}>İlçe</label>
              <select
                value={district}
                onChange={e => setDistrict(e.target.value)}
                style={{ width: "100%", background: T.surface, borderRadius: T.radiusSm, padding: "10px 12px", color: district ? T.text : T.text3, fontSize: 13, border: `1px solid ${T.border}`, outline: "none", boxSizing: "border-box", appearance: "none", WebkitAppearance: "none" }}
                disabled={!city}
              >
                <option value="" style={{ background: T.surface, color: T.text3 }}>İlçe Seç</option>
                {districts.map(d => <option key={d} value={d} style={{ background: T.surface, color: T.text }}>{d}</option>)}
              </select>
            </div>

            {/* Community rules */}
            <div style={{ background: T.surface, borderRadius: T.radius, padding: "14px", marginBottom: 16, border: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 8 }}>Topluluk Kuralları</div>
              <div style={{ fontSize: 11, color: T.text2, lineHeight: "18px" }}>
                1. Saygılı ve sportmence davranışlar beklenmektedir.{"\n"}
                2. Fair play kurallarına uyunuz.{"\n"}
                3. Kişisel bilgileri izinsiz paylaşmayınız.{"\n"}
                4. Nefret söylemi ve ayrımcılık yasaktır.{"\n"}
                5. Sahte profil oluşturmayınız.
              </div>
            </div>

            {/* Rules checkbox */}
            <div onClick={() => setRulesAccepted(!rulesAccepted)} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, cursor: "pointer" }}>
              <div style={{ width: 20, height: 20, borderRadius: 4, border: `2px solid ${rulesAccepted ? T.accent : T.border}`, background: rulesAccepted ? T.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {rulesAccepted && <Icon name="check" size={14} color={T.bg} />}
              </div>
              <span style={{ fontSize: 12, color: T.text2, fontWeight: 600 }}>Kabul Ediyorum</span>
            </div>

            <button onClick={() => { if (rulesAccepted) onComplete?.(); }} style={{ width: "100%", padding: "14px", borderRadius: T.radius, border: "none", background: rulesAccepted ? T.accent : T.surface2, color: rulesAccepted ? T.bg : T.text3, fontSize: 15, fontWeight: 700, cursor: rulesAccepted ? "pointer" : "default", opacity: rulesAccepted ? 1 : 0.6 }}>
              Başla! 🚀
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// --- SearchPage (S07) ---
const SearchPage = ({ onBack, onProfile }) => {
  const [searchText, setSearchText] = useState("");
  const [followStates, setFollowStates] = useState({});

  const results = searchText.trim().length > 0
    ? USERS.filter(u =>
        u.name.toLowerCase().includes(searchText.toLowerCase()) ||
        u.username.toLowerCase().includes(searchText.toLowerCase())
      )
    : [];

  const toggleFollow = (userId) => {
    setFollowStates(prev => ({ ...prev, [userId]: !prev[userId] }));
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: T.bg }}>
      <TopNav
        left={<span onClick={onBack} style={{ cursor: "pointer" }}><Icon name="back" size={22} color={T.text} /></span>}
        center={<span style={{ fontSize: 16, fontWeight: 700, color: T.text }}>Ara</span>}
      />

      {/* Search input */}
      <div style={{ padding: "0 16px 12px" }}>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>
            <Icon name="search" size={16} color={T.text3} />
          </div>
          <input
            autoFocus
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            placeholder="Kullanıcı ara..."
            style={{ width: "100%", background: T.surface, borderRadius: T.radius, padding: "10px 12px 10px 36px", color: T.text, fontSize: 13, border: `1px solid ${T.border}`, outline: "none", boxSizing: "border-box" }}
          />
        </div>
      </div>

      {/* Results */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px" }}>
        {searchText.trim().length > 0 && results.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: T.text3, fontSize: 13 }}>
            Kullanıcı bulunamadı
          </div>
        )}

        {results.map(u => (
          <div key={u.id} onClick={() => onProfile?.(u.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${T.border}`, cursor: "pointer" }}>
            <Avatar emoji={u.avatar} size={40} border={u.verified} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{u.name}</span>
                {u.verified && <span style={{ fontSize: 11, color: T.accent }}>✓</span>}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, color: T.text3 }}>@{u.username}</span>
                <span style={{ fontSize: 10, color: T.text3 }}>⚽ {u.matches} maç</span>
              </div>
            </div>
            <button onClick={(e) => { e.stopPropagation(); toggleFollow(u.id); }} style={{ padding: "6px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700, border: "none", cursor: "pointer", background: followStates[u.id] ? T.surface2 : T.accent, color: followStates[u.id] ? T.text2 : T.bg }}>
              {followStates[u.id] ? "Takipte" : "Takip Et"}
            </button>
          </div>
        ))}

        {/* Show all users when search is empty */}
        {searchText.trim().length === 0 && (
          <>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 10, marginTop: 4 }}>Önerilen Kullanıcılar</div>
            {USERS.slice(1).map(u => (
              <div key={u.id} onClick={() => onProfile?.(u.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${T.border}`, cursor: "pointer" }}>
                <Avatar emoji={u.avatar} size={40} border={u.verified} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{u.name}</span>
                    {u.verified && <span style={{ fontSize: 11, color: T.accent }}>✓</span>}
                  </div>
                  <span style={{ fontSize: 11, color: T.text3 }}>@{u.username}</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); toggleFollow(u.id); }} style={{ padding: "6px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700, border: "none", cursor: "pointer", background: followStates[u.id] ? T.surface2 : T.accent, color: followStates[u.id] ? T.text2 : T.bg }}>
                  {followStates[u.id] ? "Takipte" : "Takip Et"}
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

// --- MessagesListPage (S17) ---
const MessagesListPage = ({ onBack, onChat, onProfile }) => {
  const [searchText, setSearchText] = useState("");

  const filtered = CONVERSATIONS.filter(c => {
    if (!searchText.trim()) return true;
    const user = getUserById(c.userId);
    return user.name.toLowerCase().includes(searchText.toLowerCase()) || user.username.toLowerCase().includes(searchText.toLowerCase());
  });

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: T.bg }}>
      <TopNav
        left={<span onClick={onBack} style={{ cursor: "pointer" }}><Icon name="back" size={22} color={T.text} /></span>}
        center={<span style={{ fontSize: 16, fontWeight: 700, color: T.text }}>Mesajlar</span>}
      />

      {/* Search */}
      <div style={{ padding: "0 16px 10px" }}>
        <TextInput value={searchText} onChange={setSearchText} placeholder="Sohbet ara..." />
      </div>

      {/* Conversations list */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {filtered.map(conv => {
          const user = getUserById(conv.userId);
          return (
            <div key={conv.id} onClick={() => onChat?.(conv.userId)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: `1px solid ${T.border}`, cursor: "pointer" }}>
              <div onClick={(e) => { e.stopPropagation(); onProfile?.(user.id); }} style={{ cursor: "pointer" }}>
                <Avatar emoji={user.avatar} size={44} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                  <span style={{ fontSize: 14, fontWeight: conv.unread > 0 ? 800 : 600, color: T.text }}>{user.name}</span>
                  <span style={{ fontSize: 10, color: conv.unread > 0 ? T.accent : T.text3, fontWeight: conv.unread > 0 ? 600 : 400 }}>{conv.time}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: conv.unread > 0 ? T.text : T.text3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 220, fontWeight: conv.unread > 0 ? 600 : 400 }}>{conv.lastMessage}</span>
                  {conv.unread > 0 && (
                    <div style={{ minWidth: 18, height: 18, borderRadius: 9, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: T.bg }}>{conv.unread}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: T.text3, fontSize: 13 }}>Sohbet bulunamadı</div>
        )}
      </div>
    </div>
  );
};

// --- ChatPage (S18) ---
const ChatPage = ({ userId, onBack, onProfile }) => {
  const user = getUserById(userId);
  const [messages, setMessages] = useState(CHAT_MESSAGES[userId] || []);
  const [inputText, setInputText] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!inputText.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), from: 1, text: inputText, time: "Az önce" }]);
    setInputText("");
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: T.bg }}>
      {/* Header */}
      <div style={{ height: 52, padding: "0 12px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
        <span onClick={onBack} style={{ cursor: "pointer" }}><Icon name="back" size={22} color={T.text} /></span>
        <div onClick={() => onProfile?.(user.id)} style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, cursor: "pointer" }}>
          <Avatar emoji={user.avatar} size={32} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{user.name}</div>
            <div style={{ fontSize: 10, color: T.text3 }}>Çevrimiçi</div>
          </div>
        </div>
        <span onClick={() => setShowMenu(true)} style={{ cursor: "pointer", padding: "4px 8px", fontSize: 18, color: T.text3 }}>⋮</span>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }}>
        {messages.map(msg => {
          const isSent = msg.from === 1;
          return (
            <div key={msg.id} style={{ display: "flex", justifyContent: isSent ? "flex-end" : "flex-start", marginBottom: 8 }}>
              <div style={{ maxWidth: "75%", padding: "10px 14px", borderRadius: isSent ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: isSent ? T.accent : T.surface2, color: isSent ? T.bg : T.text }}>
                <div style={{ fontSize: 13, lineHeight: "18px" }}>{msg.text}</div>
                <div style={{ fontSize: 9, marginTop: 4, textAlign: "right", color: isSent ? "rgba(11,15,20,0.5)" : T.text3 }}>{msg.time}</div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div style={{ padding: "8px 12px 12px", borderTop: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <input
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="Mesaj yaz..."
          style={{ flex: 1, background: T.surface, borderRadius: 24, padding: "10px 16px", color: T.text, fontSize: 13, border: `1px solid ${T.border}`, outline: "none" }}
        />
        <button onClick={sendMessage} style={{ width: 40, height: 40, borderRadius: "50%", background: inputText.trim() ? T.accent : T.surface2, border: "none", cursor: inputText.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="send" size={18} color={inputText.trim() ? T.bg : T.text3} />
        </button>
      </div>

      {/* Menu */}
      {showMenu && (
        <BottomSheet onClose={() => setShowMenu(false)} title="Seçenekler">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button onClick={() => setShowMenu(false)} style={{ width: "100%", padding: "14px", background: T.surface, borderRadius: T.radiusSm, border: `1px solid ${T.border}`, color: T.text, fontSize: 14, fontWeight: 600, cursor: "pointer", textAlign: "left" }}>
              📱 WhatsApp'a Geç
            </button>
            <button onClick={() => setShowMenu(false)} style={{ width: "100%", padding: "14px", background: T.surface, borderRadius: T.radiusSm, border: `1px solid ${T.border}`, color: T.red, fontSize: 14, fontWeight: 600, cursor: "pointer", textAlign: "left" }}>
              🚫 Engelle
            </button>
            <button onClick={() => setShowMenu(false)} style={{ width: "100%", padding: "14px", background: T.surface, borderRadius: T.radiusSm, border: `1px solid ${T.border}`, color: T.orange, fontSize: 14, fontWeight: 600, cursor: "pointer", textAlign: "left" }}>
              🚩 Raporla
            </button>
          </div>
        </BottomSheet>
      )}
    </div>
  );
};

// --- NotificationsPage (S19) ---
const NotificationsPage = ({ onBack, onProfile, onMatchDetail }) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case "like": return { emoji: "❤️", color: T.red };
      case "comment": return { emoji: "💬", color: T.blue };
      case "follow": return { emoji: "👤", color: T.accent };
      case "badge": return { emoji: "🏆", color: T.orange };
      case "matchReminder": return { emoji: "⏰", color: T.green };
      default: return { emoji: "🔔", color: T.text3 };
    }
  };

  const handleClick = (notif) => {
    if ((notif.type === "like" || notif.type === "comment") && notif.matchId) {
      onMatchDetail?.(notif.matchId);
    } else if (notif.type === "follow" && notif.userId) {
      onProfile?.(notif.userId);
    } else if (notif.type === "matchReminder" && notif.matchId) {
      onMatchDetail?.(notif.matchId);
    }
    // "badge" type does nothing on click
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: T.bg }}>
      <TopNav
        left={<span onClick={onBack} style={{ cursor: "pointer" }}><Icon name="back" size={22} color={T.text} /></span>}
        center={<span style={{ fontSize: 16, fontWeight: 700, color: T.text }}>Bildirimler</span>}
      />

      <div style={{ flex: 1, overflowY: "auto" }}>
        {NOTIFICATIONS.map(notif => {
          const typeInfo = getTypeIcon(notif.type);
          const user = notif.userId ? getUserById(notif.userId) : null;
          return (
            <div key={notif.id} onClick={() => handleClick(notif)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: `1px solid ${T.border}`, cursor: notif.type !== "badge" ? "pointer" : "default", borderLeft: !notif.read ? `3px solid ${T.accent}` : "3px solid transparent", background: !notif.read ? "rgba(183,240,0,0.03)" : "transparent" }}>
              {/* Type icon or avatar */}
              {user ? (
                <div onClick={(e) => { e.stopPropagation(); onProfile?.(user.id); }} style={{ cursor: "pointer", position: "relative" }}>
                  <Avatar emoji={user.avatar} size={40} />
                  <div style={{ position: "absolute", bottom: -2, right: -2, width: 18, height: 18, borderRadius: 9, background: T.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 10 }}>{typeInfo.emoji}</span>
                  </div>
                </div>
              ) : (
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: T.surface2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                  {typeInfo.emoji}
                </div>
              )}

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: T.text, lineHeight: "18px" }}>
                  {user && <span style={{ fontWeight: 700 }}>{user.name} </span>}
                  <span style={{ color: T.text2 }}>{notif.text}</span>
                </div>
                <div style={{ fontSize: 10, color: T.text3, marginTop: 3 }}>{notif.time}</div>
              </div>

              {!notif.read && (
                <div style={{ width: 8, height: 8, borderRadius: 4, background: T.accent, flexShrink: 0 }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- CreateMatchPage (S31 - 3 steps) ---
const CreateMatchPage = ({ onBack, onComplete }) => {
  const [step, setStep] = useState(1);
  // Step 1
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [format, setFormat] = useState("5v5");
  // Step 2
  const [matchDate, setMatchDate] = useState("");
  const [matchTime, setMatchTime] = useState("");
  const [location, setLocation] = useState("");
  const [venueName, setVenueName] = useState("");
  // Step 3
  const [maxPlayers, setMaxPlayers] = useState(10);
  const [level, setLevel] = useState("Herkes");
  const [approvalMode, setApprovalMode] = useState("open");
  const [privacy, setPrivacy] = useState("public");

  const formats = ["5v5", "6v6", "7v7", "Özel"];
  const levels = ["Herkes", "Başlangıç", "Orta", "İyi", "Profesyonel"];
  const approvalModes = [
    { id: "open", label: "Herkesi Kabul Et", desc: "Katılım anında onaylanır" },
    { id: "approval", label: "Onay ile Kabul Et", desc: "Her katılım senin onayını bekler" },
  ];
  const privacyOptions = [
    { id: "public", label: "Herkese Açık", icon: "globe" },
    { id: "followers", label: "Takipçilerim", icon: "users" },
    { id: "private", label: "Sadece Davetliler", icon: "lock" },
  ];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: T.bg }}>
      {/* Header */}
      <TopNav
        left={<span onClick={onBack} style={{ cursor: "pointer" }}><Icon name="back" size={22} color={T.text} /></span>}
        center={<span style={{ fontSize: 16, fontWeight: 700, color: T.text }}>Maç Oluştur</span>}
      />

      {/* Progress bar */}
      <div style={{ padding: "0 24px 8px" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: s <= step ? T.accent : T.surface2, transition: "background 0.3s" }} />
          ))}
        </div>
        <div style={{ fontSize: 11, color: T.text3, marginTop: 6, textAlign: "center" }}>Adım {step} / 3</div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "8px 24px 24px" }}>

        {/* Step 1 - Match Details */}
        {step === 1 && (
          <>
            <div style={{ fontSize: 18, fontWeight: 800, color: T.text, marginBottom: 4 }}>Maç Bilgileri</div>
            <div style={{ fontSize: 12, color: T.text2, marginBottom: 20 }}>Maçının detaylarını gir.</div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: T.text2, marginBottom: 6, display: "block" }}>Başlık</label>
              <TextInput value={title} onChange={setTitle} placeholder="Ör: Cumartesi Akşam Halısaha" />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: T.text2, marginBottom: 6, display: "block" }}>Açıklama</label>
              <TextArea value={description} onChange={setDescription} placeholder="Maç hakkında kısa bir açıklama..." rows={3} />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: T.text2, marginBottom: 10, display: "block" }}>Format</label>
              <div style={{ display: "flex", gap: 8 }}>
                {formats.map(f => (
                  <button key={f} onClick={() => setFormat(f)} style={{ flex: 1, padding: "10px 8px", borderRadius: 20, fontSize: 12, fontWeight: 700, border: format === f ? `2px solid ${T.accent}` : `1px solid ${T.border}`, background: format === f ? T.accentGhost : T.surface, color: format === f ? T.accent : T.text2, cursor: "pointer" }}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={() => setStep(2)} style={{ width: "100%", padding: "14px", borderRadius: T.radius, border: "none", background: T.accent, color: T.bg, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              Devam
            </button>
          </>
        )}

        {/* Step 2 - Date & Location */}
        {step === 2 && (
          <>
            <div style={{ fontSize: 18, fontWeight: 800, color: T.text, marginBottom: 4 }}>Tarih ve Konum</div>
            <div style={{ fontSize: 12, color: T.text2, marginBottom: 20 }}>Ne zaman ve nerede?</div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: T.text2, marginBottom: 6, display: "block" }}>Tarih</label>
              <input
                type="date"
                value={matchDate}
                onChange={e => setMatchDate(e.target.value)}
                style={{ width: "100%", background: T.surface, borderRadius: T.radiusSm, padding: "10px 12px", color: T.text, fontSize: 13, border: `1px solid ${T.border}`, outline: "none", boxSizing: "border-box", colorScheme: "dark" }}
              />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: T.text2, marginBottom: 6, display: "block" }}>Saat</label>
              <input
                type="time"
                value={matchTime}
                onChange={e => setMatchTime(e.target.value)}
                style={{ width: "100%", background: T.surface, borderRadius: T.radiusSm, padding: "10px 12px", color: T.text, fontSize: 13, border: `1px solid ${T.border}`, outline: "none", boxSizing: "border-box", colorScheme: "dark" }}
              />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: T.text2, marginBottom: 6, display: "block" }}>Konum</label>
              <TextInput value={location} onChange={setLocation} placeholder="Ör: Kadıköy, İstanbul" />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: T.text2, marginBottom: 6, display: "block" }}>Tesis Adı</label>
              <TextInput value={venueName} onChange={setVenueName} placeholder="Ör: Fenerbahçe Halısaha" />
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setStep(1)} style={{ flex: 1, padding: "14px", borderRadius: T.radius, border: `1px solid ${T.border}`, background: T.surface, color: T.text, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                Geri
              </button>
              <button onClick={() => setStep(3)} style={{ flex: 2, padding: "14px", borderRadius: T.radius, border: "none", background: T.accent, color: T.bg, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                Devam
              </button>
            </div>
          </>
        )}

        {/* Step 3 - Participation Settings */}
        {step === 3 && (
          <>
            <div style={{ fontSize: 18, fontWeight: 800, color: T.text, marginBottom: 4 }}>Katılım Ayarları</div>
            <div style={{ fontSize: 12, color: T.text2, marginBottom: 20 }}>Maçın kurallarını belirle.</div>

            {/* Max players */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: T.text2, marginBottom: 6, display: "block" }}>Maksimum Oyuncu Sayısı</label>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button onClick={() => setMaxPlayers(Math.max(2, maxPlayers - 1))} style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${T.border}`, background: T.surface, color: T.text, fontSize: 18, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                <input
                  type="number"
                  value={maxPlayers}
                  onChange={e => { const v = parseInt(e.target.value); if (!isNaN(v) && v >= 2 && v <= 30) setMaxPlayers(v); }}
                  style={{ width: 60, textAlign: "center", background: T.surface, borderRadius: T.radiusSm, padding: "8px", color: T.text, fontSize: 18, fontWeight: 700, border: `1px solid ${T.border}`, outline: "none", boxSizing: "border-box" }}
                />
                <button onClick={() => setMaxPlayers(Math.min(30, maxPlayers + 1))} style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${T.border}`, background: T.surface, color: T.text, fontSize: 18, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
              </div>
            </div>

            {/* Level pills */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: T.text2, marginBottom: 10, display: "block" }}>Seviye</label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {levels.map(l => (
                  <button key={l} onClick={() => setLevel(l)} style={{ padding: "8px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700, border: level === l ? `2px solid ${T.accent}` : `1px solid ${T.border}`, background: level === l ? T.accentGhost : T.surface, color: level === l ? T.accent : T.text2, cursor: "pointer" }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Approval mode */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: T.text2, marginBottom: 10, display: "block" }}>Kabul Modu</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {approvalModes.map(m => (
                  <div key={m.id} onClick={() => setApprovalMode(m.id)} style={{ padding: "12px 14px", borderRadius: T.radiusSm, border: approvalMode === m.id ? `2px solid ${T.accent}` : `1px solid ${T.border}`, background: approvalMode === m.id ? T.accentGhost : T.surface, cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 18, height: 18, borderRadius: 9, border: `2px solid ${approvalMode === m.id ? T.accent : T.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {approvalMode === m.id && <div style={{ width: 10, height: 10, borderRadius: 5, background: T.accent }} />}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: approvalMode === m.id ? T.accent : T.text }}>{m.label}</div>
                      <div style={{ fontSize: 10, color: T.text3, marginTop: 2 }}>{m.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: T.text2, marginBottom: 10, display: "block" }}>Gizlilik</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {privacyOptions.map(p => (
                  <div key={p.id} onClick={() => setPrivacy(p.id)} style={{ padding: "12px 14px", borderRadius: T.radiusSm, border: privacy === p.id ? `2px solid ${T.accent}` : `1px solid ${T.border}`, background: privacy === p.id ? T.accentGhost : T.surface, cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 18, height: 18, borderRadius: 9, border: `2px solid ${privacy === p.id ? T.accent : T.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {privacy === p.id && <div style={{ width: 10, height: 10, borderRadius: 5, background: T.accent }} />}
                    </div>
                    <Icon name={p.icon} size={16} color={privacy === p.id ? T.accent : T.text3} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: privacy === p.id ? T.accent : T.text }}>{p.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setStep(2)} style={{ flex: 1, padding: "14px", borderRadius: T.radius, border: `1px solid ${T.border}`, background: T.surface, color: T.text, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                Geri
              </button>
              <button onClick={() => onComplete?.()} style={{ flex: 2, padding: "14px", borderRadius: T.radius, border: "none", background: T.accent, color: T.bg, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                Yayınla 📢
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ============================================================
// PART 4 — Batch 3 Pages (S20–S34)
// ============================================================

// --- S20: MenuPage ---
const MenuPage = ({ onBack, onSettings, onFollowers, onInvite, onRules, onHelp, onVerify, onLogout }) => {
  const me = USERS[0];
  const menuItems = [
    { icon: "users", label: "Takipçiler & Takip", action: onFollowers },
    { icon: "link", label: "Arkadaşlarını Davet Et", action: onInvite },
    { icon: "shield", label: "Topluluk Kuralları", action: onRules },
    { icon: "settings", label: "Ayarlar", action: onSettings },
    { icon: "help", label: "Yardım & SSS", action: onHelp },
    { icon: "phone", label: "Hesabını Doğrula", action: onVerify },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: T.bg }}>
      <TopNav
        left={<div onClick={onBack} style={{ cursor: "pointer" }}><Icon name="back" color={T.text} /></div>}
        center={<span style={{ fontWeight: 800, fontSize: 16, color: T.text }}>Menü</span>}
        right={null}
      />
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 24px" }}>
        {/* Profile mini card */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 16, background: T.surface, borderRadius: T.radius, marginBottom: 20 }}>
          <Avatar emoji={me.avatar} size={48} border={me.verified} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: T.text }}>{me.name} {me.verified && <span style={{ fontSize: 12 }}>✅</span>}</div>
            <div style={{ fontSize: 13, color: T.text2 }}>@{me.username}</div>
          </div>
        </div>

        {/* Menu items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {menuItems.map((item, i) => (
            <div key={i} onClick={item.action} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 12px", borderRadius: T.radiusSm, cursor: "pointer", transition: "background 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = T.surface}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <div style={{ width: 36, height: 36, borderRadius: T.radiusSm, background: T.surface2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={item.icon} size={18} color={T.accent} />
              </div>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: T.text }}>{item.label}</span>
              <Icon name="back" size={14} color={T.text3} />
            </div>
          ))}
        </div>

        {/* Logout button */}
        <button onClick={onLogout} style={{ width: "100%", marginTop: 32, padding: 14, borderRadius: T.radius, border: `1px solid ${T.red}`, background: "transparent", color: T.red, fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Icon name="logout" size={18} color={T.red} />
          Çıkış Yap
        </button>
      </div>
    </div>
  );
};

// --- S21: SettingsPage ---
const SettingsPage = ({ onBack, onRules }) => {
  const [theme, setTheme] = useState(true); // true = dark
  const [pushNotif, setPushNotif] = useState(true);
  const [likesNotif, setLikesNotif] = useState(true);
  const [commentsNotif, setCommentsNotif] = useState(true);
  const [followNotif, setFollowNotif] = useState(true);
  const [matchReminder, setMatchReminder] = useState(true);
  const [profilePrivacy, setProfilePrivacy] = useState("public");
  const [locationSharing, setLocationSharing] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const SectionTitle = ({ text }) => (
    <div style={{ fontSize: 11, fontWeight: 700, color: T.text3, textTransform: "uppercase", letterSpacing: 1, marginTop: 20, marginBottom: 8 }}>{text}</div>
  );
  const SettingRow = ({ label, right, onClick }) => (
    <div onClick={onClick} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${T.border}`, cursor: onClick ? "pointer" : "default" }}>
      <span style={{ fontSize: 14, color: T.text }}>{label}</span>
      {right || (onClick && <Icon name="back" size={14} color={T.text3} />)}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: T.bg }}>
      <TopNav
        left={<div onClick={onBack} style={{ cursor: "pointer" }}><Icon name="back" color={T.text} /></div>}
        center={<span style={{ fontWeight: 800, fontSize: 16, color: T.text }}>Ayarlar</span>}
        right={null}
      />
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 24px" }}>
        {/* Görünüm */}
        <SectionTitle text="Görünüm" />
        <SettingRow label={theme ? "Koyu Tema" : "Açık Tema"} right={<Toggle on={theme} onToggle={() => setTheme(!theme)} />} />

        {/* Hesap */}
        <SectionTitle text="Hesap" />
        <SettingRow label="Şifre Değiştir" onClick={() => {}} />
        <SettingRow label="E-posta Değiştir" onClick={() => {}} />
        <SettingRow label="Telefon Numarası" onClick={() => {}} />

        {/* Bildirimler */}
        <SectionTitle text="Bildirimler" />
        <SettingRow label="Push Bildirimler" right={<Toggle on={pushNotif} onToggle={() => setPushNotif(!pushNotif)} />} />
        <SettingRow label="Beğeniler" right={<Toggle on={likesNotif} onToggle={() => setLikesNotif(!likesNotif)} />} />
        <SettingRow label="Yorumlar" right={<Toggle on={commentsNotif} onToggle={() => setCommentsNotif(!commentsNotif)} />} />
        <SettingRow label="Yeni Takipçi" right={<Toggle on={followNotif} onToggle={() => setFollowNotif(!followNotif)} />} />
        <SettingRow label="Maç Hatırlatıcı" right={<Toggle on={matchReminder} onToggle={() => setMatchReminder(!matchReminder)} />} />

        {/* Gizlilik */}
        <SectionTitle text="Gizlilik" />
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 14, color: T.text, marginBottom: 8 }}>Profil Gizliliği</div>
          <div style={{ display: "flex", gap: 0, borderRadius: T.radiusSm, overflow: "hidden", border: `1px solid ${T.border}` }}>
            {[{ v: "public", l: "Herkese Açık" }, { v: "followers", l: "Sadece Takipçilere" }].map(opt => (
              <div key={opt.v} onClick={() => setProfilePrivacy(opt.v)} style={{ flex: 1, padding: "10px 0", textAlign: "center", fontSize: 12, fontWeight: 600, cursor: "pointer", background: profilePrivacy === opt.v ? T.accent : T.surface, color: profilePrivacy === opt.v ? T.bg : T.text2, transition: "all 0.2s" }}>
                {opt.l}
              </div>
            ))}
          </div>
        </div>
        <SettingRow label="Konum Paylaşımı" right={<Toggle on={locationSharing} onToggle={() => setLocationSharing(!locationSharing)} />} />

        {/* Hakkında */}
        <SectionTitle text="Hakkında" />
        <SettingRow label="Topluluk Kuralları" onClick={onRules} />
        <SettingRow label="Gizlilik Politikası" onClick={() => {}} />
        <SettingRow label="Kullanım Şartları" onClick={() => {}} />
        <SettingRow label="KVKK" onClick={() => {}} />
        <SettingRow label="Versiyon" right={<span style={{ fontSize: 13, color: T.text3 }}>1.0.0</span>} />

        {/* Hesabı Sil */}
        <SectionTitle text="" />
        {!deleteConfirm ? (
          <button onClick={() => setDeleteConfirm(true)} style={{ width: "100%", marginTop: 16, padding: 14, borderRadius: T.radius, border: `1px solid ${T.red}`, background: "transparent", color: T.red, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            Hesabı Sil
          </button>
        ) : (
          <div style={{ background: "rgba(239,68,68,0.1)", padding: 16, borderRadius: T.radius, marginTop: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.red, marginBottom: 8 }}>Emin misin?</div>
            <div style={{ fontSize: 12, color: T.text2, marginBottom: 12 }}>Bu işlem geri alınamaz. Tüm verilerin silinecek.</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setDeleteConfirm(false)} style={{ flex: 1, padding: 10, borderRadius: T.radiusSm, border: `1px solid ${T.border}`, background: T.surface, color: T.text, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>İptal</button>
              <button style={{ flex: 1, padding: 10, borderRadius: T.radiusSm, border: "none", background: T.red, color: T.white, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Sil</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- S22: FollowersPage ---
const FollowersPage = ({ onBack, onProfile }) => {
  const [tab, setTab] = useState("followers");
  const [search, setSearch] = useState("");
  const [followState, setFollowState] = useState({});
  const followers = USERS.slice(1);
  const following = USERS.slice(2);
  const list = tab === "followers" ? followers : following;
  const filtered = list.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.username.toLowerCase().includes(search.toLowerCase()));

  const toggleFollow = (userId) => {
    setFollowState(prev => ({ ...prev, [userId]: !prev[userId] }));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: T.bg }}>
      <TopNav
        left={<div onClick={onBack} style={{ cursor: "pointer" }}><Icon name="back" color={T.text} /></div>}
        center={<span style={{ fontWeight: 800, fontSize: 16, color: T.text }}>@{USERS[0].username}</span>}
        right={null}
      />
      <div style={{ padding: "0 16px" }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, marginBottom: 12, borderRadius: T.radiusSm, overflow: "hidden", border: `1px solid ${T.border}` }}>
          {[{ v: "followers", l: `Takipçiler (${followers.length})` }, { v: "following", l: `Takip Edilenler (${following.length})` }].map(t => (
            <div key={t.v} onClick={() => setTab(t.v)} style={{ flex: 1, padding: "10px 0", textAlign: "center", fontSize: 12, fontWeight: 700, cursor: "pointer", background: tab === t.v ? T.accent : T.surface, color: tab === t.v ? T.bg : T.text2, transition: "all 0.2s" }}>
              {t.l}
            </div>
          ))}
        </div>
        {/* Search */}
        <TextInput value={search} onChange={setSearch} placeholder="Ara..." style={{ marginBottom: 12 }} />
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 24px" }}>
        {filtered.map(user => {
          const isFollowing = tab === "following" ? true : followState[user.id];
          return (
            <div key={user.id} onClick={() => onProfile?.(user.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${T.border}`, cursor: "pointer" }}>
              <Avatar emoji={user.avatar} size={40} border={user.verified} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user.name} {user.verified && <span style={{ fontSize: 11 }}>✅</span>}
                </div>
                <div style={{ fontSize: 12, color: T.text2 }}>@{user.username}</div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); toggleFollow(user.id); }}
                style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer", border: isFollowing ? `1px solid ${T.border}` : "none", background: isFollowing ? "transparent" : T.accent, color: isFollowing ? T.text2 : T.bg, transition: "all 0.2s" }}
              >
                {isFollowing ? "Takip Ediliyor" : "Takip Et"}
              </button>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 32, color: T.text3, fontSize: 13 }}>Sonuç bulunamadı</div>
        )}
      </div>
    </div>
  );
};

// --- S23: ProfileEditPage ---
const ProfileEditPage = ({ onBack, onSave }) => {
  const me = USERS[0];
  const [username, setUsername] = useState(me.username);
  const [name, setName] = useState("Berk");
  const [surname, setSurname] = useState("Başdemir");
  const [bio, setBio] = useState(me.bio);
  const [birthdate, setBirthdate] = useState("1998-05-15");
  const [gender, setGender] = useState("Erkek");
  const [city, setCity] = useState("İstanbul");
  const [district, setDistrict] = useState("Kadıköy");
  const [favSports, setFavSports] = useState(["Futbol", "Basketbol"]);
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");

  const allSports = ["Futbol", "Basketbol", "Voleybol", "Tenis", "Yüzme", "Koşu", "Bisiklet", "Boks", "Padel", "Masa Tenisi"];
  const genders = ["Erkek", "Kadın", "Belirtmek İstemiyorum"];
  const cities = ["İstanbul", "Ankara", "İzmir", "Bursa", "Antalya"];
  const districts = ["Kadıköy", "Beşiktaş", "Bakırköy", "Ataşehir", "Üsküdar", "Sarıyer"];

  const toggleSport = (s) => {
    setFavSports(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: T.bg }}>
      <TopNav
        left={<div onClick={onBack} style={{ cursor: "pointer" }}><Icon name="back" color={T.text} /></div>}
        center={<span style={{ fontWeight: 800, fontSize: 16, color: T.text }}>Profili Düzenle</span>}
        right={null}
      />
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 24px" }}>
        {/* Avatar */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <div style={{ position: "relative", cursor: "pointer" }}>
            <Avatar emoji={me.avatar} size={80} border />
            <div style={{ position: "absolute", bottom: -4, left: "50%", transform: "translateX(-50%)", background: T.accent, color: T.bg, fontSize: 10, fontWeight: 700, padding: "2px 10px", borderRadius: 10, whiteSpace: "nowrap" }}>
              Değiştir
            </div>
          </div>
        </div>

        {/* Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: T.text2, marginBottom: 4, display: "block" }}>Kullanıcı Adı</label>
            <TextInput value={username} onChange={setUsername} placeholder="@kullaniciadi" />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, color: T.text2, marginBottom: 4, display: "block" }}>Ad</label>
              <TextInput value={name} onChange={setName} placeholder="Ad" />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, color: T.text2, marginBottom: 4, display: "block" }}>Soyad</label>
              <TextInput value={surname} onChange={setSurname} placeholder="Soyad" />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, color: T.text2, marginBottom: 4, display: "block" }}>Biyografi</label>
            <TextArea value={bio} onChange={(v) => v.length <= 150 && setBio(v)} placeholder="Kendinden bahset..." rows={3} />
            <div style={{ fontSize: 11, color: bio.length >= 140 ? T.orange : T.text3, textAlign: "right", marginTop: 2 }}>{bio.length}/150</div>
          </div>
          <div>
            <label style={{ fontSize: 12, color: T.text2, marginBottom: 4, display: "block" }}>Doğum Tarihi</label>
            <TextInput value={birthdate} onChange={setBirthdate} type="date" />
          </div>

          {/* Gender */}
          <div>
            <label style={{ fontSize: 12, color: T.text2, marginBottom: 6, display: "block" }}>Cinsiyet</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {genders.map(g => (
                <div key={g} onClick={() => setGender(g)} style={{ padding: "8px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", background: gender === g ? T.accent : T.surface, color: gender === g ? T.bg : T.text2, border: gender === g ? "none" : `1px solid ${T.border}`, transition: "all 0.2s" }}>
                  {g}
                </div>
              ))}
            </div>
          </div>

          {/* City / District */}
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, color: T.text2, marginBottom: 4, display: "block" }}>Şehir</label>
              <select value={city} onChange={e => setCity(e.target.value)} style={{ width: "100%", background: T.surface, borderRadius: T.radiusSm, padding: "10px 12px", color: T.text, fontSize: 13, border: `1px solid ${T.border}`, outline: "none", boxSizing: "border-box" }}>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, color: T.text2, marginBottom: 4, display: "block" }}>İlçe</label>
              <select value={district} onChange={e => setDistrict(e.target.value)} style={{ width: "100%", background: T.surface, borderRadius: T.radiusSm, padding: "10px 12px", color: T.text, fontSize: 13, border: `1px solid ${T.border}`, outline: "none", boxSizing: "border-box" }}>
                {districts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          {/* Favorite Sports */}
          <div>
            <label style={{ fontSize: 12, color: T.text2, marginBottom: 6, display: "block" }}>Favori Sporlar</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {allSports.map(s => (
                <div key={s} onClick={() => toggleSport(s)} style={{ padding: "8px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", background: favSports.includes(s) ? T.accent : T.surface, color: favSports.includes(s) ? T.bg : T.text2, border: favSports.includes(s) ? "none" : `1px solid ${T.border}`, transition: "all 0.2s" }}>
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Social media */}
          <div>
            <label style={{ fontSize: 12, color: T.text2, marginBottom: 4, display: "block" }}>Instagram</label>
            <TextInput value={instagram} onChange={setInstagram} placeholder="@instagram_kullaniciadi" />
          </div>
          <div>
            <label style={{ fontSize: 12, color: T.text2, marginBottom: 4, display: "block" }}>Twitter</label>
            <TextInput value={twitter} onChange={setTwitter} placeholder="@twitter_kullaniciadi" />
          </div>
        </div>

        {/* Save button */}
        <button onClick={onSave} style={{ width: "100%", marginTop: 20, padding: 14, borderRadius: T.radius, border: "none", background: T.accent, color: T.bg, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
          Kaydet
        </button>
      </div>
    </div>
  );
};

// --- S24: InviteFriendsPage ---
const InviteFriendsPage = ({ onBack }) => {
  const [copied, setCopied] = useState(false);
  const referralLink = "sporwave.app/davet/berk2026";

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: T.bg }}>
      <TopNav
        left={<div onClick={onBack} style={{ cursor: "pointer" }}><Icon name="back" color={T.text} /></div>}
        center={<span style={{ fontWeight: 800, fontSize: 16, color: T.text }}>Arkadaşlarını Davet Et</span>}
        right={null}
      />
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 24px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Illustration */}
        <div style={{ fontSize: 64, margin: "24px 0 12px" }}>🎉</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: T.text, marginBottom: 6, textAlign: "center" }}>Arkadaşlarını Davet Et</div>
        <div style={{ fontSize: 13, color: T.text2, textAlign: "center", marginBottom: 28, maxWidth: 280 }}>
          Arkadaşlarını SporWave'e davet et, birlikte maç organize edin!
        </div>

        {/* Referral link */}
        <div style={{ width: "100%", background: T.surface, borderRadius: T.radius, padding: 16, marginBottom: 16, border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 11, color: T.text3, marginBottom: 6, fontWeight: 600 }}>Davet Linkin</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ flex: 1, padding: "10px 12px", background: T.bg, borderRadius: T.radiusSm, fontSize: 13, color: T.accent, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", border: `1px solid ${T.border}` }}>
              {referralLink}
            </div>
            <button onClick={handleCopy} style={{ padding: "10px 16px", borderRadius: T.radiusSm, border: "none", background: copied ? T.green : T.accent, color: T.bg, fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", transition: "background 0.2s" }}>
              {copied ? "Kopyalandı!" : "Linki Kopyala"}
            </button>
          </div>
        </div>

        {/* Share buttons */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
          <button style={{ width: "100%", padding: 14, borderRadius: T.radius, border: "none", background: "#25D366", color: T.white, fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>💬</span> WhatsApp ile Paylaş
          </button>
          <button style={{ width: "100%", padding: 14, borderRadius: T.radius, border: "none", background: "linear-gradient(135deg, #833AB4, #FD1D1D, #F77737)", color: T.white, fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>📷</span> Instagram ile Paylaş
          </button>
        </div>
      </div>
    </div>
  );
};

// --- S25: CommunityRulesPage ---
const CommunityRulesPage = ({ onBack }) => {
  const rules = [
    { title: "1. No-Show Yasağı", desc: "Katılacağını belirttiğin maçlara gelmelisin. Üst üste 3 kez gelmeme durumunda hesabın geçici olarak askıya alınabilir. Gelemeyeceğin durumlarda maçtan en az 2 saat önce çekilmelisin." },
    { title: "2. Saygılı Davranış", desc: "Tüm oyunculara saygılı davran. Küfür, hakaret, ayrımcılık ve her türlü kötü davranış yasaktır. Sahada fair-play kurallarına uyulmalıdır." },
    { title: "3. Sahte Profil Yasağı", desc: "Gerçek kimlik bilgilerin ile kayıt olmalısın. Sahte profiller, yanıltıcı bilgiler ve başkasının yerine geçme girişimleri tespit edildiğinde hesap kalıcı olarak kapatılır." },
    { title: "4. Taciz ve Zorbalık Yasağı", desc: "Uygulama içi mesajlarda veya saha dışında taciz, tehdit, zorbalık ve ısrarcı davranışlar kesinlikle yasaktır. Bu tür davranışlar bildirildiğinde hızla incelenir." },
    { title: "5. Raporlama ve İhbar", desc: "Kurallara uymayan kullanıcıları raporla butonuyla bildir. Asılsız raporlama da yaptırıma tabidir. Ekibimiz her raporu 24 saat içinde inceler." },
    { title: "6. İçerik Kuralları", desc: "Paylaşılan fotoğraflar, yorumlar ve mesajlar topluluk standartlarına uygun olmalıdır. Uygunsuz, müstehcen veya şiddete teşvik eden içerikler anında kaldırılır." },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: T.bg }}>
      <TopNav
        left={<div onClick={onBack} style={{ cursor: "pointer" }}><Icon name="back" color={T.text} /></div>}
        center={<span style={{ fontWeight: 800, fontSize: 16, color: T.text }}>Topluluk Kuralları</span>}
        right={null}
      />
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 24px" }}>
        <div style={{ fontSize: 13, color: T.text2, marginBottom: 16, lineHeight: 1.5 }}>
          SporWave topluluğunun güvenli ve keyifli bir ortam olması için aşağıdaki kurallara uyulması gerekmektedir.
        </div>
        {rules.map((rule, i) => (
          <div key={i} style={{ marginBottom: 16, padding: 14, background: T.surface, borderRadius: T.radius, borderLeft: `3px solid ${T.accent}` }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: T.text, marginBottom: 6 }}>{rule.title}</div>
            <div style={{ fontSize: 13, color: T.text2, lineHeight: 1.6 }}>{rule.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- S26: HelpPage ---
const HelpPage = ({ onBack }) => {
  const [expanded, setExpanded] = useState(null);
  const faqs = [
    { q: "Nasıl maç oluşturabilirim?", a: "Ana sayfadaki '+' butonuna veya Maçlar sekmesindeki 'Maç Oluştur' butonuna tıklayarak yeni bir maç oluşturabilirsin. Maç detaylarını (tarih, saat, konum, format) doldurduktan sonra yayınla." },
    { q: "Skor takibi nasıl çalışır?", a: "Maç sırasında veya sonrasında skor takibi yapabilirsin. Maç detay sayfasından 'Skor Gir' butonuna tıkla, goller ve asistleri ekle. Maç bitince sonuçlar otomatik profillere yansır." },
    { q: "Nasıl oyuncu bulabilirim?", a: "Maçlar sekmesinden açık maçları görebilirsin. Katılmak istediğin maça 'Katıl' butonuyla başvur. Ayrıca keşfet sayfasından yakınındaki oyuncuları bulabilirsin." },
    { q: "Hesabımı nasıl silebilirim?", a: "Ayarlar > Hesabı Sil yolunu izleyerek hesabını kalıcı olarak silebilirsin. Bu işlem geri alınamaz ve tüm verilerin silinir." },
    { q: "Bildirimlerimi nasıl kapatırım?", a: "Ayarlar > Bildirimler bölümünden her bildirim türünü ayrı ayrı açıp kapatabilirsin. Push bildirimlerini tamamen kapatmak için ana toggle'ı kapat." },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: T.bg }}>
      <TopNav
        left={<div onClick={onBack} style={{ cursor: "pointer" }}><Icon name="back" color={T.text} /></div>}
        center={<span style={{ fontWeight: 800, fontSize: 16, color: T.text }}>Yardım & SSS</span>}
        right={null}
      />
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 24px" }}>
        {/* FAQ Accordion */}
        {faqs.map((faq, i) => (
          <div key={i} style={{ marginBottom: 8, background: T.surface, borderRadius: T.radius, overflow: "hidden" }}>
            <div onClick={() => setExpanded(expanded === i ? null : i)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", cursor: "pointer" }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: T.text, flex: 1, paddingRight: 8 }}>{faq.q}</span>
              <div style={{ transform: expanded === i ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                <Icon name="chevDown" size={16} color={T.text3} />
              </div>
            </div>
            {expanded === i && (
              <div style={{ padding: "0 16px 14px", fontSize: 13, color: T.text2, lineHeight: 1.6 }}>
                {faq.a}
              </div>
            )}
          </div>
        ))}

        {/* Contact section */}
        <div style={{ marginTop: 24, padding: 20, background: T.surface, borderRadius: T.radius, textAlign: "center" }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>💌</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 4 }}>Sorun mu yaşıyorsun?</div>
          <div style={{ fontSize: 13, color: T.text2, marginBottom: 8 }}>Bize ulaş, yardımcı olalım.</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.accent }}>destek@sporwave.app</div>
        </div>
      </div>
    </div>
  );
};

// --- S27: VerificationPage ---
const VerificationPage = ({ onBack, onComplete }) => {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [verified, setVerified] = useState(false);
  const [sending, setSending] = useState(false);
  const otpRefs = useRef([]);

  const handleSendCode = () => {
    if (phone.length >= 10) {
      setSending(true);
      setTimeout(() => {
        setSending(false);
        setStep(2);
      }, 1000);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join("");
    if (code.length === 6) {
      setVerified(true);
      setTimeout(() => onComplete?.(), 2000);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: T.bg }}>
      <TopNav
        left={<div onClick={onBack} style={{ cursor: "pointer" }}><Icon name="back" color={T.text} /></div>}
        center={<span style={{ fontWeight: 800, fontSize: 16, color: T.text }}>Hesap Doğrulama</span>}
        right={null}
      />
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 24px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {verified ? (
          /* Success state */
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <div style={{ width: 80, height: 80, borderRadius: T.radiusFull, background: T.accentGhost, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, animation: "pulse 1s ease-in-out" }}>
              ✅
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: T.text }}>Doğrulandı!</div>
            <div style={{ fontSize: 14, color: T.text2, textAlign: "center" }}>Hesabın başarıyla doğrulandı. Profilinde doğrulama rozeti gösterilecek.</div>
          </div>
        ) : step === 1 ? (
          /* Step 1: Phone */
          <div style={{ width: "100%", marginTop: 32 }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📱</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 4 }}>Telefon Numaranı Doğrula</div>
              <div style={{ fontSize: 13, color: T.text2 }}>Bir doğrulama kodu göndereceğiz</div>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              <div style={{ padding: "10px 12px", background: T.surface, borderRadius: T.radiusSm, color: T.text2, fontSize: 14, fontWeight: 600, border: `1px solid ${T.border}`, flexShrink: 0 }}>+90</div>
              <TextInput value={phone} onChange={(v) => setPhone(v.replace(/\D/g, "").slice(0, 10))} placeholder="5XX XXX XX XX" type="tel" />
            </div>
            <button onClick={handleSendCode} disabled={phone.length < 10} style={{ width: "100%", padding: 14, borderRadius: T.radius, border: "none", background: phone.length >= 10 ? T.accent : T.surface2, color: phone.length >= 10 ? T.bg : T.text3, fontSize: 15, fontWeight: 700, cursor: phone.length >= 10 ? "pointer" : "not-allowed", transition: "all 0.2s" }}>
              {sending ? "Gönderiliyor..." : "Kod Gönder"}
            </button>
          </div>
        ) : (
          /* Step 2: OTP */
          <div style={{ width: "100%", marginTop: 32 }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔐</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 4 }}>Doğrulama Kodu</div>
              <div style={{ fontSize: 13, color: T.text2 }}>+90 {phone} numarasına gönderilen 6 haneli kodu gir</div>
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 20 }}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => otpRefs.current[i] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(i, e)}
                  style={{ width: 44, height: 52, textAlign: "center", fontSize: 20, fontWeight: 700, background: T.surface, borderRadius: T.radiusSm, color: T.text, border: digit ? `2px solid ${T.accent}` : `1px solid ${T.border}`, outline: "none" }}
                />
              ))}
            </div>
            <button onClick={handleVerify} disabled={otp.join("").length < 6} style={{ width: "100%", padding: 14, borderRadius: T.radius, border: "none", background: otp.join("").length === 6 ? T.accent : T.surface2, color: otp.join("").length === 6 ? T.bg : T.text3, fontSize: 15, fontWeight: 700, cursor: otp.join("").length === 6 ? "pointer" : "not-allowed", transition: "all 0.2s" }}>
              Doğrula
            </button>
            <div onClick={() => setStep(1)} style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: T.accent, cursor: "pointer", fontWeight: 600 }}>
              Numarayı Değiştir
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- S28: ReportSheet ---
const ReportSheet = ({ onClose, type, userName }) => {
  const [selected, setSelected] = useState(null);
  const [otherText, setOtherText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    { id: "fake", label: "Fake profil", icon: "🎭" },
    { id: "inappropriate", label: "Uygunsuz içerik", icon: "🚫" },
    { id: "spam", label: "Spam", icon: "📧" },
    { id: "noshow", label: "No-show / Gelmiyor", icon: "👻" },
    { id: "harassment", label: "Taciz / Kötü davranış", icon: "⚠️" },
    { id: "other", label: "Diğer", icon: "📝" },
  ];

  const handleSubmit = () => {
    if (selected) {
      setSubmitted(true);
    }
  };

  return (
    <BottomSheet onClose={onClose} title={type === "match" ? "Maçı Raporla" : userName ? `${userName} Raporla` : "Raporla"}>
      {submitted ? (
        <div style={{ textAlign: "center", padding: "24px 0" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 6 }}>Teşekkürler</div>
          <div style={{ fontSize: 13, color: T.text2 }}>Ekibimiz en kısa sürede inceleyecek.</div>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
            {categories.map(cat => (
              <div
                key={cat.id}
                onClick={() => setSelected(cat.id)}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: T.radiusSm, cursor: "pointer", background: selected === cat.id ? T.accentGhost : T.surface, border: selected === cat.id ? `1px solid ${T.accent}` : `1px solid ${T.border}`, transition: "all 0.15s" }}
              >
                <span style={{ fontSize: 18 }}>{cat.icon}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: selected === cat.id ? T.accent : T.text }}>{cat.label}</span>
              </div>
            ))}
          </div>
          {selected === "other" && (
            <div style={{ marginBottom: 16 }}>
              <TextArea value={otherText} onChange={setOtherText} placeholder="Lütfen detayları açıkla..." rows={3} />
            </div>
          )}
          <button onClick={handleSubmit} disabled={!selected} style={{ width: "100%", padding: 14, borderRadius: T.radius, border: "none", background: selected ? T.accent : T.surface2, color: selected ? T.bg : T.text3, fontSize: 15, fontWeight: 700, cursor: selected ? "pointer" : "not-allowed", transition: "all 0.2s" }}>
            Gönder
          </button>
        </>
      )}
    </BottomSheet>
  );
};

// --- S29: BlockDialog ---
const BlockDialog = ({ onClose, userName, onConfirm }) => (
  <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={onClose}>
    <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 320, background: T.bg2, borderRadius: T.radiusLg, padding: 24, textAlign: "center" }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>🚫</div>
      <div style={{ fontSize: 16, fontWeight: 800, color: T.text, marginBottom: 8 }}>
        Bu kullanıcıyı engellemek istiyor musun?
      </div>
      <div style={{ fontSize: 13, color: T.text2, lineHeight: 1.6, marginBottom: 20 }}>
        <strong style={{ color: T.text }}>{userName}</strong> seni takip edemeyecek, mesaj gönderemeyecek ve maçlarını göremeyecek. Bu işlemi daha sonra geri alabilirsin.
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onClose} style={{ flex: 1, padding: 12, borderRadius: T.radius, border: `1px solid ${T.border}`, background: T.surface, color: T.text, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          İptal
        </button>
        <button onClick={onConfirm} style={{ flex: 1, padding: 12, borderRadius: T.radius, border: "none", background: T.red, color: T.white, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
          Engelle
        </button>
      </div>
    </div>
  </div>
);

// --- S30: ShareableCardPage ---
const ShareableCardPage = ({ score, mvpName, goals, assists, onBack, onSkip }) => {
  const displayScore = score || [5, 3];
  const displayMvp = mvpName || "Berk Başdemir";
  const displayGoals = goals ?? 2;
  const displayAssists = assists ?? 1;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: T.bg }}>
      <TopNav
        left={<div onClick={onBack} style={{ cursor: "pointer" }}><Icon name="back" color={T.text} /></div>}
        center={<span style={{ fontWeight: 800, fontSize: 16, color: T.text }}>Maç Kartı</span>}
        right={<span onClick={onSkip} style={{ fontSize: 13, color: T.text2, cursor: "pointer", fontWeight: 600 }}>Atla</span>}
      />
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 24px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Card */}
        <div style={{ width: "100%", maxWidth: 300, aspectRatio: "9/16", borderRadius: 20, background: `linear-gradient(160deg, ${T.bg2} 0%, ${T.surface} 100%)`, border: `3px solid ${T.accent}`, padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", marginTop: 12, marginBottom: 20, position: "relative", overflow: "hidden" }}>
          {/* Decorative accent circle */}
          <div style={{ position: "absolute", top: -40, right: -40, width: 120, height: 120, borderRadius: "50%", background: T.accentGhost, opacity: 0.5 }} />
          <div style={{ position: "absolute", bottom: -30, left: -30, width: 100, height: 100, borderRadius: "50%", background: T.accentGhost, opacity: 0.3 }} />

          {/* Brand */}
          <div style={{ fontSize: 16, fontWeight: 800, color: T.accent, letterSpacing: 2, zIndex: 1 }}>SPORWAVE</div>

          {/* Score */}
          <div style={{ zIndex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 11, color: T.text3, fontWeight: 600, marginBottom: 4 }}>SONUÇ</div>
            <div style={{ fontSize: 48, fontWeight: 800, color: T.text, letterSpacing: 4 }}>
              {displayScore[0]} <span style={{ color: T.text3, fontSize: 28 }}>-</span> {displayScore[1]}
            </div>
          </div>

          {/* MVP */}
          <div style={{ zIndex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 11, color: T.text3, fontWeight: 600, marginBottom: 4 }}>MVP</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: T.accent }}>🏅 {displayMvp}</div>
          </div>

          {/* Personal Stats */}
          <div style={{ zIndex: 1, display: "flex", gap: 24 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: T.text }}>{displayGoals}</div>
              <div style={{ fontSize: 11, color: T.text3, fontWeight: 600 }}>GOL</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: T.text }}>{displayAssists}</div>
              <div style={{ fontSize: 11, color: T.text3, fontWeight: 600 }}>ASİST</div>
            </div>
          </div>

          {/* QR placeholder */}
          <div style={{ zIndex: 1, width: 56, height: 56, background: T.surface2, borderRadius: T.radiusSm, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 10, color: T.text3, textAlign: "center", lineHeight: 1.2 }}>QR<br/>Code</div>
          </div>
        </div>

        {/* Share buttons */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
          <button style={{ width: "100%", padding: 14, borderRadius: T.radius, border: "none", background: "linear-gradient(135deg, #833AB4, #FD1D1D, #F77737)", color: T.white, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            Instagram'da Paylaş
          </button>
          <button style={{ width: "100%", padding: 14, borderRadius: T.radius, border: "none", background: "#25D366", color: T.white, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            WhatsApp'ta Paylaş
          </button>
          <button style={{ width: "100%", padding: 14, borderRadius: T.radius, border: `1px solid ${T.border}`, background: T.surface, color: T.text, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};

// --- StatsModal (Profile İstatistikler) ---
const StatsModal = ({ user, onClose }) => {
  const u = user || USERS[0];
  const winRate = u.matches > 0 ? Math.round((u.wins / u.matches) * 100) : 0;
  const stats = [
    { label: "Toplam Maç", value: u.matches },
    { label: "Galibiyet", value: u.wins, color: T.green },
    { label: "Mağlubiyet", value: u.losses, color: T.red },
    { label: "Beraberlik", value: u.draws, color: T.orange },
    { label: "Kazanma Oranı", value: `%${winRate}`, color: T.accent },
    { label: "Toplam Gol", value: u.goals },
    { label: "Toplam Asist", value: u.assists },
    { label: "MVP Sayısı", value: u.mvpCount, color: T.accent },
  ];

  return (
    <BottomSheet onClose={onClose} title="İstatistikler">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ padding: 14, background: T.surface, borderRadius: T.radius, textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color || T.text, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: T.text3, fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </BottomSheet>
  );
};

// --- AchievementsModal (Profile Başarılar) ---
const AchievementsModal = ({ onClose }) => {
  const earned = [
    { icon: "🏅", title: "50 Maç Kulübü", desc: "50 maça katıldın!" },
    { icon: "✅", title: "Tam Katılım", desc: "Hiç maç kaçırmadın" },
    { icon: "🎙️", title: "Süper Organizatör", desc: "10+ maç organize ettin" },
    { icon: "🆕", title: "Yeni Üye", desc: "SporWave'e hoş geldin!" },
  ];
  const locked = [
    { icon: "💯", title: "100 Maç", desc: "100 maça katıl", progress: 60, max: 100 },
    { icon: "🎯", title: "Gol Kralı", desc: "50 gol at", progress: 34, max: 50 },
  ];

  return (
    <BottomSheet onClose={onClose} title="Başarılar">
      {/* Earned */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        {earned.map((b, i) => (
          <div key={i} style={{ padding: 14, background: T.surface, borderRadius: T.radius, textAlign: "center", border: `1px solid ${T.accentGhost}` }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>{b.icon}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.text, marginBottom: 2 }}>{b.title}</div>
            <div style={{ fontSize: 10, color: T.text3 }}>{b.desc}</div>
          </div>
        ))}
      </div>
      {/* Locked */}
      <div style={{ fontSize: 12, fontWeight: 700, color: T.text3, marginBottom: 8 }}>Kilitli</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {locked.map((b, i) => (
          <div key={i} style={{ padding: 14, background: T.surface, borderRadius: T.radius, display: "flex", alignItems: "center", gap: 12, opacity: 0.6 }}>
            <div style={{ fontSize: 28, filter: "grayscale(100%)" }}>{b.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 2 }}>{b.title}</div>
              <div style={{ fontSize: 11, color: T.text3, marginBottom: 6 }}>{b.desc}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <ProgressBar current={b.progress} max={b.max} />
                <span style={{ fontSize: 10, color: T.text3, fontWeight: 600, whiteSpace: "nowrap" }}>{b.progress}/{b.max}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </BottomSheet>
  );
};

// --- CalendarModal (Profile Takvim) ---
const CalendarModal = ({ onClose }) => {
  const now = new Date();
  const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  const dayNames = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = now.getDate();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  // Match days (dummy)
  const matchDays = [3, 7, 10, 14, 18, 21, 23, 28];

  const cells = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <BottomSheet onClose={onClose} title="Takvim">
      {/* Month header */}
      <div style={{ textAlign: "center", fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 14 }}>
        {monthNames[month]} {year}
      </div>
      {/* Day names */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 6 }}>
        {dayNames.map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 700, color: T.text3, padding: 4 }}>{d}</div>
        ))}
      </div>
      {/* Days grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
        {cells.map((day, i) => (
          <div key={i} style={{ aspectRatio: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRadius: T.radiusSm, background: day === today ? T.accentGhost : "transparent", position: "relative" }}>
            {day && (
              <>
                <span style={{ fontSize: 13, fontWeight: day === today ? 700 : 400, color: day === today ? T.accent : T.text }}>{day}</span>
                {matchDays.includes(day) && (
                  <div style={{ width: 4, height: 4, borderRadius: 2, background: T.accent, marginTop: 2 }} />
                )}
              </>
            )}
          </div>
        ))}
      </div>
      {/* Legend */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, justifyContent: "center" }}>
        <div style={{ width: 6, height: 6, borderRadius: 3, background: T.accent }} />
        <span style={{ fontSize: 11, color: T.text3 }}>Maç günü</span>
      </div>
    </BottomSheet>
  );
};

// --- S34: ErrorPage ---
const ErrorPage = ({ onRetry, onHome }) => (
  <div style={{ display: "flex", flexDirection: "column", height: "100%", background: T.bg, alignItems: "center", justifyContent: "center", padding: 32 }}>
    <div style={{ fontSize: 64, marginBottom: 16 }}>⚠️</div>
    <div style={{ fontSize: 20, fontWeight: 800, color: T.text, marginBottom: 8, textAlign: "center" }}>Bir şeyler ters gitti</div>
    <div style={{ fontSize: 14, color: T.text2, textAlign: "center", marginBottom: 32, maxWidth: 280 }}>
      Beklenmeyen bir hata oluştu. Lütfen tekrar dene veya ana sayfaya dön.
    </div>
    <button onClick={onRetry} style={{ width: "100%", maxWidth: 280, padding: 14, borderRadius: T.radius, border: "none", background: T.accent, color: T.bg, fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 12 }}>
      Tekrar Dene
    </button>
    <span onClick={onHome} style={{ fontSize: 14, color: T.accent, cursor: "pointer", fontWeight: 600 }}>
      Ana Sayfaya Dön
    </span>
  </div>
);

// ============================================================
// Part 5 — Main App Component (Routing & Overlays)
// ============================================================

export default function App() {
  const [history, setHistory] = useState([{ page: "splash", data: null }]);
  const [tab, setTab] = useState("home");
  const [feedMode, setFeedMode] = useState("home");
  const [showFAB, setShowFAB] = useState(false);
  const [liveScore, setLiveScore] = useState(null);
  const [liveGoals, setLiveGoals] = useState([]);

  // Overlay states
  const [reportTarget, setReportTarget] = useState(null); // { type: "report"|"block", userId }
  const [showStats, setShowStats] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const current = history[history.length - 1];
  const page = current.page;

  const navigate = (p, data = null) => {
    setHistory(prev => [...prev, { page: p, data }]);
  };

  const goBack = () => {
    setHistory(prev => prev.length <= 1 ? prev : prev.slice(0, -1));
  };

  const handleTab = (t) => {
    setTab(t);
    setHistory([{ page: t, data: null }]);
    setShowFAB(false);
  };

  const handleReport = (type, userId) => {
    setReportTarget({ type, userId });
  };

  const handlePanoItem = (id) => {
    if (id === "stats") setShowStats(true);
    else if (id === "achievements") setShowAchievements(true);
    else if (id === "calendar") setShowCalendar(true);
  };

  // Helper to find a past match by id (for notifications that reference matchId)
  const findPastMatch = (matchId) => PAST_MATCHES.find(m => m.id === matchId);
  const findOpenMatch = (matchId) => OPEN_MATCHES.find(m => m.id === matchId);

  return (
    <PhoneFrame>
      {/* === SPLASH === */}
      {page === "splash" && <SplashPage onDone={() => { setTab("home"); setHistory([{ page: "home", data: null }]); }} />}

      {/* === HOME === */}
      {page === "home" && (
        <>
          <HomePage
            feedMode={feedMode}
            setFeedMode={setFeedMode}
            onMatchTap={(m) => navigate("matchDetail", m)}
            onProfile={(id) => navigate("otherProfile", id)}
            onSearch={() => navigate("search")}
            onNotifications={() => navigate("notifications")}
            onMessages={() => navigate("messages")}
            onReport={handleReport}
          />
          <TabBar active={tab} onTab={handleTab} />
        </>
      )}

      {/* === MATCHES === */}
      {page === "matches" && (
        <>
          <MatchesPage
            onUpcomingTap={(m) => navigate("plannedMatchDetail", m)}
            onFAB={() => setShowFAB(true)}
          />
          <TabBar active={tab} onTab={handleTab} />
          {showFAB && (
            <FABSheet
              onClose={() => setShowFAB(false)}
              onStartLive={() => { setShowFAB(false); navigate("liveScore"); }}
              onCreateMatch={() => { setShowFAB(false); navigate("createMatch"); }}
            />
          )}
        </>
      )}

      {/* === PROFILE === */}
      {page === "profile" && (
        <>
          <ProfilePage
            isSelf={true}
            onProfile={(id) => navigate("otherProfile", id)}
            onMatchTap={(m) => navigate("matchDetail", m)}
            onEdit={() => navigate("profileEdit")}
            onSettings={() => navigate("menu")}
            onPanoItem={handlePanoItem}
          />
          <TabBar active={tab} onTab={handleTab} />
        </>
      )}

      {/* === OTHER PROFILE === */}
      {page === "otherProfile" && (
        <ProfilePage
          userId={current.data}
          isSelf={false}
          onBack={goBack}
          onProfile={(id) => navigate("otherProfile", id)}
          onMatchTap={(m) => navigate("matchDetail", m)}
        />
      )}

      {/* === MATCH DETAIL === */}
      {page === "matchDetail" && (
        <MatchDetailPage
          match={current.data}
          onBack={goBack}
          onProfile={(id) => navigate("otherProfile", id)}
          onReport={handleReport}
        />
      )}

      {/* === PLANNED MATCH DETAIL === */}
      {page === "plannedMatchDetail" && (
        <PlannedMatchDetailPage
          match={current.data}
          onBack={goBack}
          onProfile={(id) => navigate("otherProfile", id)}
        />
      )}

      {/* === LIVE SCORE === */}
      {page === "liveScore" && (
        <LiveScorePage
          onBack={goBack}
          onFinish={(score, duration, goals) => {
            setLiveScore({ score, duration });
            setLiveGoals(goals || []);
            navigate("matchSummary");
          }}
        />
      )}

      {/* === MATCH SUMMARY === */}
      {page === "matchSummary" && (
        <MatchSummaryPage
          score={liveScore?.score || [0, 0]}
          duration={liveScore?.duration || 0}
          goals={liveGoals}
          onBack={goBack}
          onSave={() => navigate("shareableCard", { score: liveScore?.score || [0,0] })}
        />
      )}

      {/* === SHAREABLE CARD === */}
      {page === "shareableCard" && (
        <ShareableCardPage
          score={current.data?.score || liveScore?.score || [0, 0]}
          mvpName="Berk Başdemir"
          goals={2}
          assists={1}
          onBack={goBack}
          onSkip={() => { setTab("home"); setHistory([{ page: "home", data: null }]); }}
        />
      )}

      {/* === LOGIN === */}
      {page === "login" && (
        <LoginPage
          onBack={goBack}
          onRegister={() => navigate("register")}
          onForgotPassword={() => navigate("forgotPassword")}
          onLogin={() => goBack()}
        />
      )}

      {/* === REGISTER === */}
      {page === "register" && (
        <RegisterPage
          onBack={goBack}
          onLogin={() => { goBack(); navigate("login"); }}
          onRegister={() => navigate("onboarding")}
        />
      )}

      {/* === FORGOT PASSWORD === */}
      {page === "forgotPassword" && (
        <ForgotPasswordPage onBack={goBack} />
      )}

      {/* === ONBOARDING === */}
      {page === "onboarding" && (
        <OnboardingPage onComplete={() => { setTab("home"); setHistory([{ page: "home", data: null }]); }} />
      )}

      {/* === SEARCH === */}
      {page === "search" && (
        <SearchPage
          onBack={goBack}
          onProfile={(id) => navigate("otherProfile", id)}
        />
      )}

      {/* === MESSAGES === */}
      {page === "messages" && (
        <MessagesListPage
          onBack={goBack}
          onChat={(userId) => navigate("chat", userId)}
          onProfile={(id) => navigate("otherProfile", id)}
        />
      )}

      {/* === CHAT === */}
      {page === "chat" && (
        <ChatPage
          userId={current.data}
          onBack={goBack}
          onProfile={(id) => navigate("otherProfile", id)}
        />
      )}

      {/* === NOTIFICATIONS === */}
      {page === "notifications" && (
        <NotificationsPage
          onBack={goBack}
          onProfile={(id) => navigate("otherProfile", id)}
          onMatchDetail={(matchId) => {
            const pm = findPastMatch(matchId);
            if (pm) navigate("matchDetail", pm);
            else {
              const om = findOpenMatch(matchId);
              if (om) navigate("plannedMatchDetail", om);
            }
          }}
        />
      )}

      {/* === CREATE MATCH === */}
      {page === "createMatch" && (
        <CreateMatchPage
          onBack={goBack}
          onComplete={() => { setTab("matches"); setHistory([{ page: "matches", data: null }]); }}
        />
      )}

      {/* === MENU === */}
      {page === "menu" && (
        <MenuPage
          onBack={goBack}
          onSettings={() => navigate("settings")}
          onFollowers={() => navigate("followers")}
          onInvite={() => navigate("invite")}
          onRules={() => navigate("rules")}
          onHelp={() => navigate("help")}
          onVerify={() => navigate("verify")}
          onLogout={() => { setTab("home"); setHistory([{ page: "home", data: null }]); }}
        />
      )}

      {/* === SETTINGS === */}
      {page === "settings" && (
        <SettingsPage
          onBack={goBack}
          onRules={() => navigate("rules")}
        />
      )}

      {/* === FOLLOWERS === */}
      {page === "followers" && (
        <FollowersPage
          onBack={goBack}
          onProfile={(id) => navigate("otherProfile", id)}
        />
      )}

      {/* === PROFILE EDIT === */}
      {page === "profileEdit" && (
        <ProfileEditPage
          onBack={goBack}
          onSave={goBack}
        />
      )}

      {/* === INVITE === */}
      {page === "invite" && <InviteFriendsPage onBack={goBack} />}

      {/* === RULES === */}
      {page === "rules" && <CommunityRulesPage onBack={goBack} />}

      {/* === HELP === */}
      {page === "help" && <HelpPage onBack={goBack} />}

      {/* === VERIFY === */}
      {page === "verify" && <VerificationPage onBack={goBack} onComplete={goBack} />}

      {/* === ERROR === */}
      {page === "error" && (
        <ErrorPage
          onRetry={goBack}
          onHome={() => { setTab("home"); setHistory([{ page: "home", data: null }]); }}
        />
      )}

      {/* === OVERLAYS === */}
      {reportTarget?.type === "report" && (
        <ReportSheet
          onClose={() => setReportTarget(null)}
          userName={getUserById(reportTarget.userId)?.name || "Kullanıcı"}
        />
      )}
      {reportTarget?.type === "block" && (
        <BlockDialog
          onClose={() => setReportTarget(null)}
          userName={getUserById(reportTarget.userId)?.name || "Kullanıcı"}
          onConfirm={() => setReportTarget(null)}
        />
      )}
      {showStats && <StatsModal user={USERS[0]} onClose={() => setShowStats(false)} />}
      {showAchievements && <AchievementsModal onClose={() => setShowAchievements(false)} />}
      {showCalendar && <CalendarModal onClose={() => setShowCalendar(false)} />}
    </PhoneFrame>
  );
}
