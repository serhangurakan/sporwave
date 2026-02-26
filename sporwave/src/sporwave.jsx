import { useState, useEffect, useRef } from "react";

// ============================================================
// SPORWAVE INTERACTIVE PROTOTYPE — 41 Pages, Full Navigation
// Design System: Dark theme (#0B0F14), Accent #B7F000
// ============================================================

const ACCENT = "#B7F000";
const BG = "#0B0F14";
const CARD = "#141A22";
const CARD_BORDER = "#1E2730";
const TEXT = "#F0F2F5";
const TEXT_DIM = "#8A95A5";
const ORANGE = "#FF8C42";
const RED = "#FF4757";
const GREEN = "#2ED573";

// Mock data
const USERS = [
  { id: 1, name: "Berk Yılmaz", username: "berk26", avatar: "BY", matches: 47, goals: 23, assists: 15, mvp: 8, attendance: 94 },
  { id: 2, name: "Ali Demir", username: "alidemir", avatar: "AD", matches: 32, goals: 18, assists: 9, mvp: 3, attendance: 88 },
  { id: 3, name: "Mehmet Kaya", username: "mkaya", avatar: "MK", matches: 28, goals: 12, assists: 7, mvp: 2, attendance: 91 },
  { id: 4, name: "Emre Çelik", username: "emrecelik", avatar: "EÇ", matches: 41, goals: 30, assists: 11, mvp: 6, attendance: 96 },
  { id: 5, name: "Can Yıldız", username: "canyildiz", avatar: "CY", matches: 19, goals: 8, assists: 5, mvp: 1, attendance: 85 },
  { id: 6, name: "Oğuz Han", username: "oguzhan", avatar: "OH", matches: 36, goals: 15, assists: 20, mvp: 4, attendance: 92 },
];

const MATCHES = [
  { id: 1, title: "Kadıköy Halısaha Maçı", date: "25 Şub, 20:00", location: "Kadıköy Spor Tesisleri", format: "6v6", score: [5, 3], duration: "1s 20dk", state: "archived", host: 1, teamA: [1, 2, 4], teamB: [3, 5, 6], mvp: 4, likes: 12, comments: 5 },
  { id: 2, title: "Cumartesi Akşam Maçı", date: "1 Mar, 21:00", location: "Ataşehir Arena", format: "5v5", score: null, state: "open", host: 2, teamA: [2], teamB: [6], capacity: 10, joined: 5 },
  { id: 3, title: "Beşiktaş Sahil Maçı", date: "28 Şub, 19:00", location: "Beşiktaş Halısaha", format: "7v7", score: [2, 2], duration: "1s 10dk", state: "archived", host: 6, teamA: [6, 3], teamB: [1, 5], mvp: 6, likes: 8, comments: 3 },
  { id: 4, title: "Üsküdar Dostluk Maçı", date: "2 Mar, 18:00", location: "", format: "6v6", score: null, state: "open", host: 3, teamA: [], teamB: [], capacity: 12, joined: 7 },
  { id: 5, title: "Pazar Ligi Maçı", date: "3 Mar, 10:00", location: "Maltepe Spor Sahası", format: "5v5", score: null, state: "open", host: 1, teamA: [1, 4], teamB: [2], capacity: 10, joined: 4 },
];

const GOALS = [
  { matchId: 1, minute: 5, scorer: 4, assist: 2, team: "A" },
  { matchId: 1, minute: 12, scorer: 1, assist: 4, team: "A" },
  { matchId: 1, minute: 18, scorer: 3, assist: 5, team: "B" },
  { matchId: 1, minute: 25, scorer: 4, assist: 1, team: "A" },
  { matchId: 1, minute: 33, scorer: 5, assist: 6, team: "B" },
  { matchId: 1, minute: 40, scorer: 2, assist: null, team: "A" },
  { matchId: 1, minute: 55, scorer: 6, assist: 3, team: "B" },
  { matchId: 1, minute: 62, scorer: 4, assist: 2, team: "A" },
];

const NOTIFICATIONS = [
  { id: 1, icon: "👍", text: "Ali maçını beğendi", time: "2dk", target: "S11", targetId: 1 },
  { id: 2, icon: "💬", text: "Mehmet maçına yorum yaptı", time: "15dk", target: "S11", targetId: 1 },
  { id: 3, icon: "👥", text: "Can seni takip etmeye başladı", time: "1sa", target: "S16", targetId: 5 },
  { id: 4, icon: "📢", text: "Ali yeni bir maç oluşturdu", time: "3sa", target: "S12", targetId: 2 },
  { id: 5, icon: "⚽", text: "Yarınki maçın yaklaşıyor!", time: "5sa", target: "S12", targetId: 5 },
  { id: 7, icon: "⭐", text: "Maçını değerlendir!", time: "1g", target: "S40", targetId: 1 },
];

const MESSAGES = [
  { id: 1, type: "dm", user: USERS[1], lastMsg: "Cumartesi var mısın?", time: "14:30", unread: 2 },
  { id: 2, type: "match", title: "Cumartesi Akşam Maçı", lastMsg: "Emre: Sahayı ben ayarlarım", time: "12:15", unread: 5, icon: "⚽" },
  { id: 3, type: "dm", user: USERS[4], lastMsg: "Gel bi maç yapalım", time: "Dün", unread: 0 },
  { id: 4, type: "match", title: "Üsküdar Dostluk Maçı", lastMsg: "Mehmet: Saha önerisi olan?", time: "Dün", unread: 0, icon: "⚽" },
];

const STATE_COLORS = {
  draft: "#6B7280", open: GREEN, full: ORANGE, started: ACCENT,
  ended: "#A78BFA", rating: "#F59E0B", archived: TEXT_DIM
};

const STATE_LABELS = {
  draft: "Taslak", open: "Açık", full: "Dolu", started: "Devam Ediyor",
  ended: "Bitti", rating: "Puanlama", archived: "Arşiv"
};

// ============================================================
// COMPONENTS
// ============================================================

function Avatar({ initials, size = 36, color = ACCENT, onClick }) {
  return (
    <div onClick={onClick} style={{
      width: size, height: size, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
      background: `${color}22`, border: `1.5px solid ${color}55`, color: color,
      fontSize: size * 0.35, fontWeight: 700, cursor: onClick ? "pointer" : "default",
      flexShrink: 0, letterSpacing: "-0.5px"
    }}>{initials}</div>
  );
}

function Badge({ children, color = ACCENT, bg }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 600,
      color: color, background: bg || `${color}18`, whiteSpace: "nowrap"
    }}>{children}</span>
  );
}

function Button({ children, primary, danger, small, full, onClick, disabled, style: s }) {
  const bg = danger ? RED : primary ? ACCENT : "transparent";
  const c = danger ? "#fff" : primary ? BG : TEXT;
  const border = !primary && !danger ? `1px solid ${CARD_BORDER}` : "none";
  return (
    <button disabled={disabled} onClick={onClick} style={{
      padding: small ? "6px 12px" : "10px 20px", borderRadius: 10, border,
      background: disabled ? `${TEXT_DIM}33` : bg, color: disabled ? TEXT_DIM : c,
      fontSize: small ? 12 : 14, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
      width: full ? "100%" : "auto", transition: "all .15s", ...s
    }}>{children}</button>
  );
}

function Card({ children, onClick, highlight, orange, style: s }) {
  return (
    <div onClick={onClick} style={{
      background: CARD, borderRadius: 14, padding: 16,
      border: orange ? `1.5px solid ${ORANGE}` : highlight ? `1.5px solid ${ACCENT}44` : `1px solid ${CARD_BORDER}`,
      cursor: onClick ? "pointer" : "default", transition: "all .15s", ...s
    }}>{children}</div>
  );
}

function TabBar({ active, onNavigate }) {
  const tabs = [
    { id: "S05", icon: "🏠", label: "Ana Sayfa" },
    { id: "S08", icon: "⚽", label: "Maçlar" },
    { id: "S15", icon: "👤", label: "Profil" },
  ];
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, height: 64,
      background: "#0A0E13", borderTop: `1px solid ${CARD_BORDER}`,
      display: "flex", justifyContent: "space-around", alignItems: "center", zIndex: 100,
      maxWidth: 430, margin: "0 auto"
    }}>
      {tabs.map(t => (
        <div key={t.id} onClick={() => onNavigate(t.id)} style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
          cursor: "pointer", padding: "6px 16px", borderRadius: 12,
          transition: "all .2s"
        }}>
          <span style={{ fontSize: 20 }}>{t.icon}</span>
          <span style={{
            fontSize: 10, fontWeight: active === t.id ? 700 : 500,
            color: active === t.id ? ACCENT : TEXT_DIM,
            transition: "color .2s"
          }}>{t.label}</span>
          {active === t.id && <div style={{ width: 4, height: 4, borderRadius: 2, background: ACCENT, marginTop: -2 }} />}
        </div>
      ))}
    </div>
  );
}

function TopNav({ onNavigate, title, showBack, backTarget }) {
  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 50, padding: "12px 16px",
      background: `${BG}ee`, backdropFilter: "blur(12px)",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      borderBottom: `1px solid ${CARD_BORDER}22`
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {showBack && (
          <span onClick={() => onNavigate(backTarget || "BACK")} style={{
            cursor: "pointer", fontSize: 18, color: TEXT, padding: "4px 8px"
          }}>←</span>
        )}
        <span onClick={() => !showBack && onNavigate("S05")} style={{
          fontWeight: 800, fontSize: title ? 16 : 20,
          color: title ? TEXT : ACCENT, cursor: "pointer",
          letterSpacing: title ? 0 : "-0.5px"
        }}>{title || "SporWave"}</span>
      </div>
      <div style={{ display: "flex", gap: 16 }}>
        <span onClick={() => onNavigate("S07")} style={{ cursor: "pointer", fontSize: 18 }}>🔍</span>
        <span onClick={() => onNavigate("S19")} style={{ cursor: "pointer", fontSize: 18, position: "relative" }}>
          🔔<span style={{ position: "absolute", top: -4, right: -6, width: 8, height: 8, borderRadius: 4, background: RED }} />
        </span>
        <span onClick={() => onNavigate("S17")} style={{ cursor: "pointer", fontSize: 18, position: "relative" }}>
          💬<span style={{ position: "absolute", top: -4, right: -6, width: 8, height: 8, borderRadius: 4, background: ACCENT }} />
        </span>
      </div>
    </div>
  );
}

function FAB({ onClick }) {
  return (
    <div onClick={onClick} style={{
      position: "fixed", bottom: 80, right: 20, width: 56, height: 56,
      borderRadius: "50%", background: ACCENT, display: "flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer", boxShadow: `0 4px 20px ${ACCENT}44`, zIndex: 60,
      fontSize: 28, color: BG, fontWeight: 300, transition: "transform .2s"
    }}>+</div>
  );
}

function MatchCard({ match, onNavigate, compact }) {
  const host = USERS.find(u => u.id === match.host);
  const isArchived = match.state === "archived";
  return (
    <Card onClick={() => onNavigate(isArchived ? "S11" : "S12", match.id)} style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Avatar initials={host.avatar} size={28} />
          <span style={{ fontSize: 12, color: TEXT_DIM }}>{host.name} {isArchived ? "maç tamamladı" : "organize ediyor"}</span>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <Badge color={STATE_COLORS[match.state]}>{STATE_LABELS[match.state]}</Badge>
        </div>
      </div>
      <div style={{ fontWeight: 700, fontSize: 15, color: TEXT, marginBottom: 6 }}>{match.title}</div>
      {isArchived && match.score ? (
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
            <span style={{ fontSize: 11, color: TEXT_DIM }}>Takım A</span>
            <span style={{ fontSize: 28, fontWeight: 800, color: ACCENT }}>{match.score[0]}</span>
            <span style={{ fontSize: 16, color: TEXT_DIM }}>—</span>
            <span style={{ fontSize: 28, fontWeight: 800, color: TEXT }}>{match.score[1]}</span>
            <span style={{ fontSize: 11, color: TEXT_DIM }}>Takım B</span>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: TEXT_DIM }}>👥 {match.joined}/{match.capacity}</span>
          <div style={{ flex: 1, height: 4, borderRadius: 2, background: `${TEXT_DIM}33` }}>
            <div style={{ width: `${(match.joined / match.capacity) * 100}%`, height: 4, borderRadius: 2, background: ACCENT, transition: "width .3s" }} />
          </div>
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 12, fontSize: 12, color: TEXT_DIM }}>
          <span>📅 {match.date}</span>
          <span>📍 {match.location?.split(" — ")[0]?.substring(0, 20)}</span>
          <span>⚽ {match.format}</span>
        </div>
      </div>
      {isArchived && !compact && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, paddingTop: 10, borderTop: `1px solid ${CARD_BORDER}` }}>
          <div style={{ display: "flex", gap: 16, fontSize: 13, color: TEXT_DIM }}>
            <span>👍 {match.likes}</span>
            <span>💬 {match.comments}</span>
            <span>↗ Paylaş</span>
          </div>
          {match.mvp && <span style={{ fontSize: 12, color: "#FFD700" }}>⭐ {USERS.find(u => u.id === match.mvp)?.name}</span>}
        </div>
      )}
    </Card>
  );
}

function StatBox({ label, value, accent }) {
  return (
    <div style={{
      flex: 1, background: CARD, borderRadius: 12, padding: "14px 10px", textAlign: "center",
      border: `1px solid ${CARD_BORDER}`
    }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: accent ? ACCENT : TEXT }}>{value}</div>
      <div style={{ fontSize: 11, color: TEXT_DIM, marginTop: 2 }}>{label}</div>
    </div>
  );
}

function SectionTitle({ children }) {
  return <div style={{ fontSize: 13, fontWeight: 700, color: TEXT_DIM, marginBottom: 10, letterSpacing: "0.5px", textTransform: "uppercase" }}>{children}</div>;
}

function InputField({ placeholder, type = "text", icon, value, onChange }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10, background: CARD,
      border: `1px solid ${CARD_BORDER}`, borderRadius: 10, padding: "10px 14px", marginBottom: 10
    }}>
      {icon && <span>{icon}</span>}
      <input
        type={type} placeholder={placeholder} value={value} onChange={onChange}
        style={{
          background: "none", border: "none", color: TEXT, fontSize: 14, width: "100%",
          outline: "none"
        }}
      />
    </div>
  );
}

// ============================================================
// PAGES
// ============================================================

// S01: Login
function S01({ onNavigate }) {
  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", alignItems: "center", minHeight: "80vh", justifyContent: "center" }}>
      <div style={{ fontSize: 42, fontWeight: 900, color: ACCENT, marginBottom: 4, letterSpacing: "-2px" }}>SporWave</div>
      <div style={{ fontSize: 13, color: TEXT_DIM, marginBottom: 40 }}>Sahaya çık, maçını paylaş</div>
      <div style={{ width: "100%" }}>
        <InputField placeholder="E-posta" icon="📧" />
        <InputField placeholder="Şifre" type="password" icon="🔒" />
        <Button primary full onClick={() => onNavigate("S05")} style={{ marginTop: 8 }}>Giriş Yap</Button>
        <div style={{ textAlign: "center", margin: "12px 0", fontSize: 12, color: TEXT_DIM }}>
          <span onClick={() => onNavigate("S03")} style={{ cursor: "pointer", color: ACCENT }}>Şifremi Unuttum</span>
        </div>
        <div style={{ textAlign: "center", margin: "16px 0", fontSize: 12, color: TEXT_DIM }}>— veya —</div>
        <Button full onClick={() => onNavigate("S05")} style={{ marginBottom: 8 }}>Google ile devam et</Button>
        <Button full onClick={() => onNavigate("S05")}>Apple ile devam et</Button>
        <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: TEXT_DIM }}>
          Hesabın yok mu? <span onClick={() => onNavigate("S02")} style={{ color: ACCENT, cursor: "pointer", fontWeight: 600 }}>Kayıt Ol</span>
        </div>
      </div>
    </div>
  );
}

// S02: Register
function S02({ onNavigate }) {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ fontSize: 28, fontWeight: 800, color: ACCENT, marginBottom: 4 }}>SporWave</div>
      <div style={{ fontSize: 14, color: TEXT_DIM, marginBottom: 24 }}>Yeni hesap oluştur</div>
      <InputField placeholder="E-posta" icon="📧" />
      <InputField placeholder="Şifre" type="password" icon="🔒" />
      <InputField placeholder="Şifre tekrar" type="password" icon="🔒" />
      <label style={{ display: "flex", gap: 8, fontSize: 12, color: TEXT_DIM, marginBottom: 16, alignItems: "flex-start" }}>
        <input type="checkbox" style={{ marginTop: 2 }} />
        <span><span style={{ color: ACCENT, cursor: "pointer" }}>KVKK</span> ve <span style={{ color: ACCENT, cursor: "pointer" }}>Kullanım Şartları</span>'nı kabul ediyorum</span>
      </label>
      <Button primary full onClick={() => onNavigate("S04")}>Kayıt Ol</Button>
      <Button full onClick={() => onNavigate("S04")} style={{ marginTop: 8 }}>Google ile kayıt ol</Button>
      <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: TEXT_DIM }}>
        Zaten hesabın var mı? <span onClick={() => onNavigate("S01")} style={{ color: ACCENT, cursor: "pointer", fontWeight: 600 }}>Giriş Yap</span>
      </div>
    </div>
  );
}

// S03: Forgot Password
function S03({ onNavigate }) {
  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", alignItems: "center", minHeight: "60vh", justifyContent: "center" }}>
      <div style={{ fontSize: 20, fontWeight: 700, color: TEXT, marginBottom: 8 }}>Şifremi Unuttum</div>
      <div style={{ fontSize: 13, color: TEXT_DIM, marginBottom: 24, textAlign: "center" }}>E-posta adresini gir, sıfırlama linki gönderelim</div>
      <div style={{ width: "100%" }}>
        <InputField placeholder="E-posta" icon="📧" />
        <Button primary full>Sıfırlama Linki Gönder</Button>
      </div>
      <div style={{ marginTop: 20, fontSize: 13, color: ACCENT, cursor: "pointer" }} onClick={() => onNavigate("S01")}>← Giriş Yap'a Dön</div>
    </div>
  );
}

// S04: Onboarding
function S04({ onNavigate }) {
  const [step, setStep] = useState(1);
  const sports = ["Futbol ⚽", "Basketbol 🏀", "Tenis 🎾", "Padel 🏓", "Koşu 🏃", "Bisiklet 🚴", "Voleybol 🏐", "Yüzme 🏊", "Fitness 💪", "Diğer ➕"];
  const [selected, setSelected] = useState(["Futbol ⚽"]);
  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
        {[1,2,3,4].map(s => (
          <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: s <= step ? ACCENT : `${TEXT_DIM}33`, transition: "background .3s" }} />
        ))}
      </div>
      {step === 1 && (
        <>
          <div style={{ fontSize: 20, fontWeight: 700, color: TEXT, marginBottom: 20 }}>Temel Bilgiler</div>
          <InputField placeholder="İsim" />
          <InputField placeholder="Soyisim" />
          <InputField placeholder="Doğum Tarihi" icon="📅" />
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {["Erkek", "Kadın", "Belirtmek istemiyorum"].map(g => (
              <Button key={g} small style={{ flex: 1, fontSize: 11 }}>{g}</Button>
            ))}
          </div>
          <Button primary full onClick={() => setStep(2)}>Devam</Button>
        </>
      )}
      {step === 2 && (
        <>
          <div style={{ fontSize: 20, fontWeight: 700, color: TEXT, marginBottom: 20 }}>Profil Fotoğrafı</div>
          <div style={{ width: 120, height: 120, borderRadius: "50%", background: CARD, border: `2px dashed ${CARD_BORDER}`, margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>📷</div>
          <Button primary full onClick={() => setStep(3)}>Fotoğraf Yükle</Button>
          <div style={{ textAlign: "center", marginTop: 12, fontSize: 13, color: TEXT_DIM, cursor: "pointer" }} onClick={() => setStep(3)}>Sonra Ekle</div>
        </>
      )}
      {step === 3 && (
        <>
          <div style={{ fontSize: 20, fontWeight: 700, color: TEXT, marginBottom: 4 }}>Hangi sporları yapıyorsun?</div>
          <div style={{ fontSize: 12, color: TEXT_DIM, marginBottom: 16 }}>Gelecek planlarımız için bize yardımcı olur</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
            {sports.map(s => (
              <div key={s} onClick={() => setSelected(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s])} style={{
                padding: "12px 14px", borderRadius: 10, background: CARD, textAlign: "center", fontSize: 13,
                border: selected.includes(s) ? `2px solid ${ACCENT}` : `1px solid ${CARD_BORDER}`,
                color: selected.includes(s) ? ACCENT : TEXT, cursor: "pointer", fontWeight: selected.includes(s) ? 600 : 400
              }}>{s}</div>
            ))}
          </div>
          <Button primary full onClick={() => setStep(4)}>Devam</Button>
        </>
      )}
      {step === 4 && (
        <>
          <div style={{ fontSize: 20, fontWeight: 700, color: TEXT, marginBottom: 20 }}>Konum & Kurallar</div>
          <InputField placeholder="Şehir seç" icon="🏙️" />
          <InputField placeholder="İlçe seç" icon="📍" />
          <Card style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.5 }}>SporWave topluluğumuzda saygılı iletişim, no-show yasağı ve adil oyun temel kurallarımızdır.</div>
            <div style={{ fontSize: 12, color: ACCENT, marginTop: 8, cursor: "pointer" }}>Detayları Gör →</div>
          </Card>
          <label style={{ display: "flex", gap: 8, fontSize: 12, color: TEXT_DIM, marginBottom: 16 }}>
            <input type="checkbox" /><span>Topluluk Kurallarını kabul ediyorum</span>
          </label>
          <Button primary full onClick={() => onNavigate("S05")}>Başla! 🚀</Button>
        </>
      )}
    </div>
  );
}

// S05: Home Feed
function S05({ onNavigate }) {
  const [mode, setMode] = useState("home");
  const [dropOpen, setDropOpen] = useState(false);
  return (
    <>
      <div style={{ padding: "0 16px 8px", display: "flex", alignItems: "center", gap: 8 }}>
        <div onClick={() => setDropOpen(!dropOpen)} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: TEXT }}>{mode === "home" ? "🏠 Ana Sayfa" : "🌐 Keşfet"}</span>
          <span style={{ fontSize: 10, color: TEXT_DIM }}>▾</span>
        </div>
        {dropOpen && (
          <div style={{ position: "absolute", top: 90, left: 16, background: CARD, border: `1px solid ${CARD_BORDER}`, borderRadius: 12, padding: 8, zIndex: 60, boxShadow: "0 8px 32px rgba(0,0,0,.5)" }}>
            <div onClick={() => { setMode("home"); setDropOpen(false); }} style={{ padding: "8px 16px", borderRadius: 8, cursor: "pointer", color: mode === "home" ? ACCENT : TEXT, fontSize: 14 }}>🏠 Ana Sayfa</div>
            <div onClick={() => { setMode("explore"); setDropOpen(false); }} style={{ padding: "8px 16px", borderRadius: 8, cursor: "pointer", color: mode === "explore" ? ACCENT : TEXT, fontSize: 14 }}>🌐 Keşfet</div>
          </div>
        )}
      </div>
      {mode === "explore" && (
        <div style={{ padding: "0 16px 12px" }}>
          <SectionTitle>Önerilen Kullanıcılar</SectionTitle>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8 }}>
            {USERS.slice(1, 5).map(u => (
              <div key={u.id} onClick={() => onNavigate("S16", u.id)} style={{
                minWidth: 100, background: CARD, borderRadius: 12, padding: "12px 10px",
                textAlign: "center", border: `1px solid ${CARD_BORDER}`, cursor: "pointer"
              }}>
                <Avatar initials={u.avatar} size={40} />
                <div style={{ fontSize: 12, fontWeight: 600, color: TEXT, marginTop: 6 }}>{u.name.split(" ")[0]}</div>
                <div style={{ fontSize: 10, color: ACCENT, marginTop: 4, cursor: "pointer" }}>+ Takip Et</div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{ padding: "0 16px 100px" }}>
        {MATCHES.filter(m => m.state === "archived").map(m => (
          <MatchCard key={m.id} match={m} onNavigate={onNavigate} />
        ))}
        {MATCHES.filter(m => m.state === "archived").length === 0 && (
          <div style={{ textAlign: "center", padding: 40, color: TEXT_DIM }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⚽</div>
            <div>Henüz kimseyi takip etmiyorsun</div>
            <Button primary onClick={() => setMode("explore")} style={{ marginTop: 16 }}>Keşfet'e Git</Button>
          </div>
        )}
      </div>
    </>
  );
}

// S07: Search
function S07({ onNavigate }) {
  const [q, setQ] = useState("");
  const filtered = USERS.filter(u => u.name.toLowerCase().includes(q.toLowerCase()) || u.username.includes(q.toLowerCase()));
  return (
    <div style={{ padding: "0 16px 100px" }}>
      <InputField placeholder="Kullanıcı ara..." icon="🔍" value={q} onChange={e => setQ(e.target.value)} />
      {filtered.map(u => (
        <div key={u.id} onClick={() => onNavigate("S16", u.id)} style={{
          display: "flex", alignItems: "center", gap: 12, padding: "12px 0",
          borderBottom: `1px solid ${CARD_BORDER}`, cursor: "pointer"
        }}>
          <Avatar initials={u.avatar} size={40} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: TEXT }}>{u.name}</div>
            <div style={{ fontSize: 12, color: TEXT_DIM }}>@{u.username} · {u.matches} maç</div>
          </div>
          <Button small primary>Takip Et</Button>
        </div>
      ))}
    </div>
  );
}

// S08: Matches Page
function S08({ onNavigate }) {
  return (
    <div style={{ padding: "0 16px 100px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontWeight: 700, fontSize: 16, color: TEXT }}>Maçlar</span>
        <Badge>🔽 Filtrele</Badge>
      </div>
      <Card orange style={{ marginBottom: 12 }} onClick={() => onNavigate("S40", 1)}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span>⭐</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: ORANGE }}>Bu maçı değerlendir</div>
            <div style={{ fontSize: 12, color: TEXT_DIM }}>Kadıköy Halısaha Maçı · 5-3</div>
          </div>
        </div>
      </Card>
      <SectionTitle>Katıldığım Yaklaşan Maçlar</SectionTitle>
      {MATCHES.filter(m => m.state === "open" && [1, 2].includes(m.host)).map(m => (
        <Card key={m.id} highlight onClick={() => onNavigate("S12", m.id)} style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontWeight: 600, fontSize: 14, color: TEXT }}>{m.title}</span>
            <Badge color={ACCENT}>Katılıyorsun ✓</Badge>
          </div>
          <div style={{ fontSize: 12, color: TEXT_DIM, display: "flex", gap: 10 }}>
            <span>📅 {m.date}</span><span>📍 {m.location?.substring(0, 18)}</span><span>⚽ {m.format}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
            <span style={{ fontSize: 11, color: TEXT_DIM }}>👥 {m.joined}/{m.capacity}</span>
            <div style={{ flex: 1, height: 3, borderRadius: 2, background: `${TEXT_DIM}33` }}>
              <div style={{ width: `${(m.joined / m.capacity) * 100}%`, height: 3, borderRadius: 2, background: ACCENT }} />
            </div>
          </div>
        </Card>
      ))}
      <SectionTitle style={{ marginTop: 16 }}>Açık Maçlar</SectionTitle>
      {MATCHES.filter(m => m.state === "open").map(m => (
        <MatchCard key={m.id} match={m} onNavigate={onNavigate} compact />
      ))}
      <FAB onClick={() => onNavigate("S09")} />
    </div>
  );
}

// S09: Match Options Bottom Sheet
function S09({ onNavigate }) {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: TEXT, marginBottom: 20 }}>Ne yapmak istiyorsun?</div>
      {[
        { icon: "🎮", title: "Maç Başlat", desc: "Hemen oynayacağın bir maçı başlat ve skor tut", target: "S10" },
        { icon: "📢", title: "Maç Oluştur", desc: "İleri tarihli maç planla ve oyuncu bul", target: "S31" },
      ].map(o => (
        <Card key={o.target} onClick={() => onNavigate(o.target)} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <span style={{ fontSize: 28 }}>{o.icon}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: TEXT }}>{o.title}</div>
              <div style={{ fontSize: 12, color: TEXT_DIM, marginTop: 2 }}>{o.desc}</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// S10: Start Match (Live Score)
function S10({ onNavigate }) {
  const [step, setStep] = useState(1);
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);
  const timerRef = useRef(null);
  useEffect(() => {
    if (running) { timerRef.current = setInterval(() => setTimer(t => t + 1), 1000); }
    else { clearInterval(timerRef.current); }
    return () => clearInterval(timerRef.current);
  }, [running]);
  const formatTime = s => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  if (step === 1) return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>{[1,2,3,4].map(s => <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: s <= 1 ? ACCENT : `${TEXT_DIM}33` }} />)}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: TEXT, marginBottom: 20 }}>Maç Kurulumu</div>
      <SectionTitle>Format</SectionTitle>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["5v5", "6v6", "7v7", "Özel"].map(f => <Button key={f} small>{f}</Button>)}
      </div>
      <SectionTitle>Konum</SectionTitle>
      <InputField placeholder="Konum ara veya GPS kullan" icon="📍" />
      <Button primary full onClick={() => setStep(2)}>Devam</Button>
    </div>
  );
  if (step === 2) return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>{[1,2,3,4].map(s => <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: s <= 2 ? ACCENT : `${TEXT_DIM}33` }} />)}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: TEXT, marginBottom: 20 }}>Takım Kurulumu</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <div style={{ textAlign: "center", fontWeight: 700, color: ACCENT, marginBottom: 8 }}>Takım 1</div>
          <Card><div style={{ textAlign: "center", color: TEXT_DIM, padding: 16 }}>Oyuncu ekle +</div></Card>
        </div>
        <div>
          <div style={{ textAlign: "center", fontWeight: 700, color: TEXT, marginBottom: 8 }}>Takım 2</div>
          <Card><div style={{ textAlign: "center", color: TEXT_DIM, padding: 16 }}>Oyuncu ekle +</div></Card>
        </div>
      </div>
      <div style={{ textAlign: "center", margin: "16px 0", fontSize: 13, color: TEXT_DIM, cursor: "pointer" }} onClick={() => setStep(3)}>Atla — Sonra eklerim</div>
      <Button primary full onClick={() => setStep(3)}>Devam</Button>
    </div>
  );
  if (step === 3) return (
    <div style={{ padding: 24, textAlign: "center" }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>{[1,2,3,4].map(s => <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: s <= 3 ? ACCENT : `${TEXT_DIM}33` }} />)}</div>
      <div style={{ fontSize: 14, color: TEXT_DIM, marginBottom: 8 }}>Canlı Skor</div>
      <div style={{ fontSize: 48, fontWeight: 900, letterSpacing: "-2px", margin: "20px 0" }}>
        <span style={{ color: ACCENT }}>{scoreA}</span>
        <span style={{ color: TEXT_DIM, margin: "0 12px", fontSize: 28 }}>—</span>
        <span style={{ color: TEXT }}>{scoreB}</span>
      </div>
      <div style={{ fontSize: 11, color: TEXT_DIM, marginBottom: 4 }}>Takım 1 vs Takım 2</div>
      <div style={{ fontSize: 32, fontWeight: 700, color: running ? ACCENT : TEXT_DIM, marginBottom: 20, fontVariantNumeric: "tabular-nums" }}>{formatTime(timer)}</div>
      <div onClick={() => setRunning(!running)} style={{ display: "inline-block", padding: "6px 20px", borderRadius: 20, background: `${running ? RED : ACCENT}22`, color: running ? RED : ACCENT, fontSize: 12, cursor: "pointer", marginBottom: 24 }}>
        {running ? "⏸ Duraklat" : "▶ Başlat"}
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <div onClick={() => setScoreA(s => s + 1)} style={{ flex: 1, padding: "20px 0", borderRadius: 14, background: `${ACCENT}22`, border: `2px solid ${ACCENT}44`, cursor: "pointer", fontSize: 16, fontWeight: 700, color: ACCENT }}>+ Gol ⚽</div>
        <div onClick={() => setScoreB(s => s + 1)} style={{ flex: 1, padding: "20px 0", borderRadius: 14, background: `${TEXT_DIM}11`, border: `2px solid ${CARD_BORDER}`, cursor: "pointer", fontSize: 16, fontWeight: 700, color: TEXT }}>+ Gol ⚽</div>
      </div>
      <Button danger full onClick={() => setStep(4)}>Maçı Bitir</Button>
    </div>
  );
  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>{[1,2,3,4].map(s => <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: ACCENT }} />)}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: TEXT, marginBottom: 4 }}>Maç Özeti</div>
      <div style={{ textAlign: "center", fontSize: 40, fontWeight: 900, margin: "20px 0" }}>
        <span style={{ color: ACCENT }}>{scoreA}</span><span style={{ color: TEXT_DIM, margin: "0 12px", fontSize: 24 }}>—</span><span style={{ color: TEXT }}>{scoreB}</span>
      </div>
      <div style={{ textAlign: "center", fontSize: 13, color: TEXT_DIM, marginBottom: 20 }}>Süre: {formatTime(timer)}</div>
      <InputField placeholder="Maç Başlığı (opsiyonel)" icon="✏️" />
      <Button primary full onClick={() => onNavigate("S05")} style={{ marginBottom: 8 }}>Kaydet & Paylaş</Button>
      <Button full onClick={() => onNavigate("S05")}>Kaydet (Gizli)</Button>
    </div>
  );
}

// S11: Match Detail (Past)
function S11({ onNavigate, id }) {
  const match = MATCHES.find(m => m.id === id) || MATCHES[0];
  const matchGoals = GOALS.filter(g => g.matchId === match.id);
  const host = USERS.find(u => u.id === match.host);
  return (
    <div style={{ padding: "0 16px 100px" }}>
      <div style={{ textAlign: "center", margin: "16px 0" }}>
        <div style={{ fontWeight: 800, fontSize: 18, color: TEXT, marginBottom: 4 }}>{match.title}</div>
        <div style={{ fontSize: 12, color: TEXT_DIM }}>{match.date} · {match.duration} · {match.format}</div>
      </div>
      <div style={{ textAlign: "center", margin: "16px 0 24px" }}>
        <span style={{ fontSize: 11, color: TEXT_DIM }}>Takım A</span>
        <div style={{ fontSize: 56, fontWeight: 900, letterSpacing: "-3px" }}>
          <span style={{ color: ACCENT }}>{match.score?.[0]}</span>
          <span style={{ color: TEXT_DIM, margin: "0 16px", fontSize: 32 }}>—</span>
          <span style={{ color: TEXT }}>{match.score?.[1]}</span>
        </div>
        <span style={{ fontSize: 11, color: TEXT_DIM }}>Takım B</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        <div>
          <div style={{ textAlign: "center", fontWeight: 700, color: ACCENT, marginBottom: 8, fontSize: 13 }}>Takım A</div>
          {(match.teamA || []).map(uid => {
            const u = USERS.find(x => x.id === uid);
            const goals = matchGoals.filter(g => g.scorer === uid).length;
            const assists = matchGoals.filter(g => g.assist === uid).length;
            return u && (
              <div key={uid} onClick={() => onNavigate("S16", uid)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", cursor: "pointer" }}>
                <Avatar initials={u.avatar} size={28} color={ACCENT} />
                <div>
                  <div style={{ fontSize: 13, color: TEXT, fontWeight: uid === match.mvp ? 700 : 400 }}>{u.name.split(" ")[0]} {uid === match.mvp && "⭐"}</div>
                  <div style={{ fontSize: 11, color: TEXT_DIM }}>{goals > 0 && `${goals} gol`}{goals > 0 && assists > 0 && " · "}{assists > 0 && `${assists} asist`}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div>
          <div style={{ textAlign: "center", fontWeight: 700, color: TEXT, marginBottom: 8, fontSize: 13 }}>Takım B</div>
          {(match.teamB || []).map(uid => {
            const u = USERS.find(x => x.id === uid);
            const goals = matchGoals.filter(g => g.scorer === uid).length;
            const assists = matchGoals.filter(g => g.assist === uid).length;
            return u && (
              <div key={uid} onClick={() => onNavigate("S16", uid)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", cursor: "pointer" }}>
                <Avatar initials={u.avatar} size={28} color={TEXT_DIM} />
                <div>
                  <div style={{ fontSize: 13, color: TEXT, fontWeight: uid === match.mvp ? 700 : 400 }}>{u.name.split(" ")[0]} {uid === match.mvp && "⭐"}</div>
                  <div style={{ fontSize: 11, color: TEXT_DIM }}>{goals > 0 && `${goals} gol`}{goals > 0 && assists > 0 && " · "}{assists > 0 && `${assists} asist`}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {matchGoals.length > 0 && (
        <>
          <SectionTitle>Gol Zaman Çizelgesi</SectionTitle>
          {matchGoals.map((g, i) => {
            const scorer = USERS.find(u => u.id === g.scorer);
            const assister = g.assist ? USERS.find(u => u.id === g.assist) : null;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: `1px solid ${CARD_BORDER}22` }}>
                <span style={{ fontSize: 12, color: TEXT_DIM, width: 28, textAlign: "right" }}>{g.minute}'</span>
                <span>⚽</span>
                <span onClick={() => onNavigate("S16", g.scorer)} style={{ fontSize: 13, color: g.team === "A" ? ACCENT : TEXT, fontWeight: 600, cursor: "pointer" }}>{scorer?.name.split(" ")[0]}</span>
                {assister && <span style={{ fontSize: 11, color: TEXT_DIM }}>(Asist: <span onClick={() => onNavigate("S16", g.assist)} style={{ color: TEXT_DIM, cursor: "pointer" }}>{assister.name.split(" ")[0]}</span>)</span>}
              </div>
            );
          })}
        </>
      )}
      <div style={{ display: "flex", gap: 16, marginTop: 20, fontSize: 14, color: TEXT_DIM }}>
        <span>👍 {match.likes}</span><span>💬 {match.comments}</span><span>↗ Paylaş</span>
      </div>
    </div>
  );
}

// S12: Planned Match Detail
function S12({ onNavigate, id }) {
  const match = MATCHES.find(m => m.id === id) || MATCHES[1];
  const host = USERS.find(u => u.id === match.host);
  return (
    <div style={{ padding: "0 16px 100px" }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 800, fontSize: 18, color: TEXT, marginBottom: 4 }}>{match.title}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <Avatar initials={host.avatar} size={24} onClick={() => onNavigate("S16", host.id)} />
          <span style={{ fontSize: 13, color: TEXT_DIM }}>Organizatör: <span style={{ color: TEXT, cursor: "pointer" }} onClick={() => onNavigate("S16", host.id)}>{host.name}</span></span>
        </div>
      </div>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div><div style={{ fontSize: 11, color: TEXT_DIM }}>📅 Tarih/Saat</div><div style={{ fontSize: 13, color: TEXT, fontWeight: 600 }}>{match.date}</div></div>
          <div><div style={{ fontSize: 11, color: TEXT_DIM }}>📍 Konum</div><div style={{ fontSize: 13, color: TEXT, fontWeight: 600 }}>{match.location}</div></div>
          <div><div style={{ fontSize: 11, color: TEXT_DIM }}>⚽ Format</div><div style={{ fontSize: 13, color: TEXT, fontWeight: 600 }}>{match.format}</div></div>
          <div><div style={{ fontSize: 11, color: TEXT_DIM }}>👥 Kontenjan</div><div style={{ fontSize: 13, color: TEXT, fontWeight: 600 }}>{match.joined}/{match.capacity}</div></div>
        </div>
      </Card>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
        <div style={{ flex: 1, height: 6, borderRadius: 3, background: `${TEXT_DIM}33` }}>
          <div style={{ width: `${(match.joined / match.capacity) * 100}%`, height: 6, borderRadius: 3, background: ACCENT }} />
        </div>
        <span style={{ fontSize: 12, color: ACCENT, fontWeight: 700 }}>{match.joined}/{match.capacity}</span>
      </div>
      <SectionTitle>Katılımcılar</SectionTitle>
      {[...(match.teamA || []), ...(match.teamB || [])].map(uid => {
        const u = USERS.find(x => x.id === uid);
        return u && (
          <div key={uid} onClick={() => onNavigate("S16", uid)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: `1px solid ${CARD_BORDER}22`, cursor: "pointer" }}>
            <Avatar initials={u.avatar} size={34} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{u.name} {uid === match.host && "👑"}</div>
              <div style={{ fontSize: 11, color: TEXT_DIM }}>{u.matches} maç · %{u.attendance} katılım</div>
            </div>
          </div>
        );
      })}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 20 }}>
        <Button primary style={{ flex: 1 }}>Katıl ({match.capacity - match.joined} yer kaldı)</Button>
        <Button onClick={() => onNavigate("S35", match.id)} style={{ flex: 1 }}>💬 Maç Sohbeti</Button>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <Button small>📱 WhatsApp</Button>
        <Button small>👑 Host Devral</Button>
        <Button small>📋 Davet Linki</Button>
      </div>
    </div>
  );
}

// S13: Application Management
function S13({ onNavigate }) {
  return (
    <div style={{ padding: "0 16px" }}>
      <SectionTitle>Başvurular</SectionTitle>
      {USERS.slice(2, 5).map(u => (
        <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 0", borderBottom: `1px solid ${CARD_BORDER}22` }}>
          <Avatar initials={u.avatar} size={36} onClick={() => onNavigate("S16", u.id)} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{u.name}</div>
            <div style={{ fontSize: 11, color: TEXT_DIM }}>⚡ Orta · %{u.attendance} katılım</div>
          </div>
          <Button small primary>Onayla</Button>
          <Button small danger>Reddet</Button>
        </div>
      ))}
    </div>
  );
}

// S15: Own Profile
function S15({ onNavigate }) {
  const u = USERS[0];
  const weeklyData = [3, 2, 4, 1, 3, 5, 2, 4, 3, 2, 4, 3];
  return (
    <div style={{ padding: "0 16px 100px" }}>
      <div style={{ textAlign: "center", padding: "16px 0" }}>
        <Avatar initials={u.avatar} size={72} />
        <div style={{ fontWeight: 800, fontSize: 18, color: TEXT, marginTop: 8 }}>{u.name}</div>
        <div style={{ fontSize: 13, color: TEXT_DIM }}>@{u.username} · ✓ Doğrulanmış</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 12 }}>
          <div style={{ textAlign: "center" }}><div style={{ fontWeight: 700, color: TEXT }}>{u.matches}</div><div style={{ fontSize: 11, color: TEXT_DIM }}>Maç</div></div>
          <div style={{ textAlign: "center", cursor: "pointer" }} onClick={() => onNavigate("S22")}><div style={{ fontWeight: 700, color: TEXT }}>156</div><div style={{ fontSize: 11, color: TEXT_DIM }}>Takipçi</div></div>
          <div style={{ textAlign: "center", cursor: "pointer" }} onClick={() => onNavigate("S22")}><div style={{ fontWeight: 700, color: TEXT }}>89</div><div style={{ fontSize: 11, color: TEXT_DIM }}>Takip</div></div>
        </div>
        <Badge color={GREEN} style={{ marginTop: 8 }}>%{u.attendance} Katılım</Badge>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <Button small onClick={() => onNavigate("S23")}>✏️ Düzenle</Button>
        <Button small>↗ Paylaş</Button>
        <Button small onClick={() => onNavigate("S20")}>⚙️ Ayarlar</Button>
      </div>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 24, fontWeight: 800, color: ACCENT }}>3 <span style={{ fontSize: 13, fontWeight: 400, color: TEXT_DIM }}>maç bu hafta</span></div>
      </Card>
      <SectionTitle>Haftalık Aktivite</SectionTitle>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 80 }}>
          {weeklyData.map((v, i) => (
            <div key={i} style={{ flex: 1, background: i === weeklyData.length - 1 ? ACCENT : `${ACCENT}44`, borderRadius: 3, height: `${(v / 5) * 100}%`, minHeight: 4, transition: "height .3s" }} />
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          {["Maç", "Gol", "Süre"].map((p, i) => (
            <span key={p} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 12, background: i === 0 ? `${ACCENT}22` : "transparent", color: i === 0 ? ACCENT : TEXT_DIM, cursor: "pointer" }}>{p}</span>
          ))}
        </div>
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
        <Card style={{ textAlign: "center", cursor: "pointer" }}>
          <div style={{ fontSize: 18 }}>📊</div><div style={{ fontSize: 11, color: TEXT_DIM, marginTop: 4 }}>İstatistikler</div>
        </Card>
        <Card style={{ textAlign: "center", cursor: "pointer" }}>
          <div style={{ fontSize: 18 }}>🏆</div><div style={{ fontSize: 11, color: TEXT_DIM, marginTop: 4 }}>Başarılar</div>
        </Card>
        <Card style={{ textAlign: "center", cursor: "pointer" }}>
          <div style={{ fontSize: 18 }}>📅</div><div style={{ fontSize: 11, color: TEXT_DIM, marginTop: 4 }}>Takvim</div>
        </Card>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <StatBox label="Gol" value={u.goals} accent />
        <StatBox label="Asist" value={u.assists} />
        <StatBox label="MVP" value={u.mvp} accent />
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto" }}>
        {["🏅 50 Maç", "✅ %100 Katılım", "🎙️ Süper Organizatör"].map(b => <Badge key={b} color={"#FFD700"}>{b}</Badge>)}
      </div>
      <Card style={{ marginBottom: 12, background: `${ACCENT}11`, border: `1px solid ${ACCENT}33` }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: ACCENT }}>🔥 4 haftalık serin!</div>
        <div style={{ fontSize: 12, color: TEXT_DIM }}>En uzun seri: 6 hafta</div>
      </Card>
      <SectionTitle>Maç Geçmişi</SectionTitle>
      {MATCHES.filter(m => m.state === "archived").map(m => (
        <MatchCard key={m.id} match={m} onNavigate={onNavigate} compact />
      ))}
    </div>
  );
}

// S16: Other User Profile
function S16({ onNavigate, id }) {
  const u = USERS.find(x => x.id === id) || USERS[1];
  return (
    <div style={{ padding: "0 16px 100px" }}>
      <div style={{ textAlign: "center", padding: "16px 0" }}>
        <Avatar initials={u.avatar} size={72} />
        <div style={{ fontWeight: 800, fontSize: 18, color: TEXT, marginTop: 8 }}>{u.name}</div>
        <div style={{ fontSize: 13, color: TEXT_DIM }}>@{u.username}</div>
        <Badge color={GREEN} style={{ marginTop: 6 }}>%{u.attendance} Katılım</Badge>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 12 }}>
          <div style={{ textAlign: "center" }}><div style={{ fontWeight: 700, color: TEXT }}>{u.matches}</div><div style={{ fontSize: 11, color: TEXT_DIM }}>Maç</div></div>
          <div style={{ textAlign: "center" }}><div style={{ fontWeight: 700, color: TEXT }}>{u.goals}</div><div style={{ fontSize: 11, color: TEXT_DIM }}>Gol</div></div>
          <div style={{ textAlign: "center" }}><div style={{ fontWeight: 700, color: TEXT }}>{u.mvp}</div><div style={{ fontSize: 11, color: TEXT_DIM }}>MVP</div></div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <Button primary style={{ flex: 1 }}>+ Takip Et</Button>
        <Button onClick={() => onNavigate("S18", u.id)} style={{ flex: 1 }}>💬 Mesaj</Button>
        <Button small>📱</Button>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <StatBox label="Gol" value={u.goals} accent />
        <StatBox label="Asist" value={u.assists} />
        <StatBox label="MVP" value={u.mvp} accent />
      </div>
    </div>
  );
}

// S17: Messages List
function S17({ onNavigate }) {
  return (
    <div style={{ padding: "0 16px 100px" }}>
      <InputField placeholder="Konuşma ara..." icon="🔍" />
      {MESSAGES.map(m => (
        <div key={m.id} onClick={() => onNavigate(m.type === "match" ? "S35" : "S18", m.id)} style={{
          display: "flex", alignItems: "center", gap: 12, padding: "14px 0",
          borderBottom: `1px solid ${CARD_BORDER}22`, cursor: "pointer"
        }}>
          {m.type === "dm" ? <Avatar initials={m.user.avatar} size={42} /> : (
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: `${ACCENT}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{m.icon}</div>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: TEXT }}>{m.type === "dm" ? m.user.name : m.title}</div>
            <div style={{ fontSize: 12, color: TEXT_DIM, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.lastMsg}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: TEXT_DIM }}>{m.time}</div>
            {m.unread > 0 && <div style={{ width: 18, height: 18, borderRadius: 9, background: ACCENT, color: BG, fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 4, marginLeft: "auto" }}>{m.unread}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

// S18: DM Chat
function S18({ onNavigate, id }) {
  const other = USERS[id ? Math.min(id, USERS.length - 1) : 1];
  const msgs = [
    { from: "them", text: "Cumartesi var mısın?", time: "14:28" },
    { from: "me", text: "Geliyorum, saat kaçta?", time: "14:30" },
    { from: "them", text: "21:00 gibi düşünüyoruz", time: "14:31" },
    { from: "me", text: "Tamam ben ordayım 👍", time: "14:32" },
    { from: "invite", text: "📩 Ali seni Cumartesi Akşam Maçı'na davet etti", target: "S12", targetId: 2 },
  ];
  return (
    <div style={{ padding: "0 16px 80px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0 16px", borderBottom: `1px solid ${CARD_BORDER}22` }}>
        <Avatar initials={other.avatar} size={36} onClick={() => onNavigate("S16", other.id)} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, color: TEXT, fontSize: 14 }}>{other.name}</div>
          <div style={{ fontSize: 11, color: TEXT_DIM }}>Çevrimiçi</div>
        </div>
        <Button small>📱 WhatsApp</Button>
      </div>
      <div style={{ padding: "16px 0" }}>
        {msgs.map((m, i) => m.from === "invite" ? (
          <Card key={i} onClick={() => onNavigate(m.target, m.targetId)} style={{ margin: "8px 0", background: `${ACCENT}11`, border: `1px solid ${ACCENT}33` }}>
            <div style={{ fontSize: 13, color: TEXT }}>{m.text}</div>
            <div style={{ fontSize: 12, color: ACCENT, marginTop: 4 }}>Detayları Gör →</div>
          </Card>
        ) : (
          <div key={i} style={{ display: "flex", justifyContent: m.from === "me" ? "flex-end" : "flex-start", marginBottom: 8 }}>
            <div style={{
              maxWidth: "75%", padding: "8px 12px", borderRadius: 14,
              background: m.from === "me" ? ACCENT : CARD, color: m.from === "me" ? BG : TEXT,
              fontSize: 14, borderBottomRightRadius: m.from === "me" ? 4 : 14,
              borderBottomLeftRadius: m.from === "me" ? 14 : 4,
            }}>
              {m.text}
              <div style={{ fontSize: 10, color: m.from === "me" ? `${BG}88` : TEXT_DIM, textAlign: "right", marginTop: 2 }}>{m.time}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "10px 16px", background: BG, borderTop: `1px solid ${CARD_BORDER}`, display: "flex", gap: 8, maxWidth: 430, margin: "0 auto" }}>
        <div style={{ flex: 1 }}><InputField placeholder="Mesaj yaz..." /></div>
        <Button primary small>Gönder</Button>
      </div>
    </div>
  );
}

// S19: Notifications
function S19({ onNavigate }) {
  return (
    <div style={{ padding: "0 16px 100px" }}>
      {NOTIFICATIONS.map(n => (
        <div key={n.id} onClick={() => onNavigate(n.target, n.targetId)} style={{
          display: "flex", alignItems: "center", gap: 12, padding: "14px 0",
          borderBottom: `1px solid ${CARD_BORDER}22`, cursor: "pointer"
        }}>
          <span style={{ fontSize: 20 }}>{n.icon}</span>
          <div style={{ flex: 1, fontSize: 13, color: TEXT }}>{n.text}</div>
          <span style={{ fontSize: 11, color: TEXT_DIM }}>{n.time}</span>
        </div>
      ))}
    </div>
  );
}

// S20: Menu
function S20({ onNavigate }) {
  const items = [
    { icon: "👥", label: "Takipçiler & Takip", target: "S22" },
    { icon: "🔗", label: "Arkadaşlarını Davet Et", target: "S24" },
    { icon: "📜", label: "Topluluk Kuralları", target: "S25" },
    { icon: "⚙️", label: "Ayarlar", target: "S21" },
    { icon: "❓", label: "Yardım & SSS", target: "S26" },
    { icon: "📱", label: "Hesabını Doğrula", target: "S27" },
  ];
  return (
    <div style={{ padding: "0 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 0", marginBottom: 8, borderBottom: `1px solid ${CARD_BORDER}` }}>
        <Avatar initials="BY" size={48} />
        <div><div style={{ fontWeight: 700, color: TEXT }}>Berk Yılmaz</div><div style={{ fontSize: 12, color: TEXT_DIM }}>@berk26</div></div>
      </div>
      {items.map(item => (
        <div key={item.target} onClick={() => onNavigate(item.target)} style={{
          display: "flex", alignItems: "center", gap: 12, padding: "14px 0",
          borderBottom: `1px solid ${CARD_BORDER}22`, cursor: "pointer"
        }}>
          <span style={{ fontSize: 18 }}>{item.icon}</span>
          <span style={{ fontSize: 14, color: TEXT }}>{item.label}</span>
        </div>
      ))}
      <div style={{ padding: "20px 0", textAlign: "center" }}>
        <Button danger onClick={() => onNavigate("S01")}>Çıkış Yap</Button>
      </div>
    </div>
  );
}

// S21: Settings
function S21({ onNavigate }) {
  return (
    <div style={{ padding: "0 16px" }}>
      <SectionTitle>Görünüm</SectionTitle>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 14, color: TEXT }}>Tema: Koyu</span>
          <div style={{ width: 44, height: 24, borderRadius: 12, background: ACCENT, padding: 2, cursor: "pointer" }}>
            <div style={{ width: 20, height: 20, borderRadius: 10, background: BG, marginLeft: 20 }} />
          </div>
        </div>
      </Card>
      <SectionTitle>Hesap</SectionTitle>
      {["Şifre Değiştir", "E-posta Değiştir", "Telefon Numarası"].map(s => (
        <div key={s} style={{ padding: "12px 0", borderBottom: `1px solid ${CARD_BORDER}22`, fontSize: 14, color: TEXT, cursor: "pointer" }}>{s}</div>
      ))}
      <SectionTitle style={{ marginTop: 16 }}>Bildirimler</SectionTitle>
      {["Push bildirim", "Beğeniler", "Yorumlar", "Maç hatırlatıcı", "Maç daveti", "Host devralma"].map(s => (
        <div key={s} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${CARD_BORDER}22` }}>
          <span style={{ fontSize: 13, color: TEXT }}>{s}</span>
          <div style={{ width: 36, height: 20, borderRadius: 10, background: ACCENT, padding: 2, cursor: "pointer" }}>
            <div style={{ width: 16, height: 16, borderRadius: 8, background: BG, marginLeft: 16 }} />
          </div>
        </div>
      ))}
      <div style={{ padding: "24px 0", textAlign: "center" }}>
        <Button danger>Hesabı Sil</Button>
      </div>
    </div>
  );
}

// S22: Followers/Following
function S22({ onNavigate }) {
  const [tab, setTab] = useState("followers");
  return (
    <div style={{ padding: "0 16px" }}>
      <div style={{ display: "flex", gap: 0, marginBottom: 16 }}>
        {["followers", "following"].map(t => (
          <div key={t} onClick={() => setTab(t)} style={{
            flex: 1, textAlign: "center", padding: "10px 0", fontSize: 14, fontWeight: 600,
            color: tab === t ? ACCENT : TEXT_DIM, borderBottom: `2px solid ${tab === t ? ACCENT : "transparent"}`, cursor: "pointer"
          }}>{t === "followers" ? "Takipçiler" : "Takip Edilenler"}</div>
        ))}
      </div>
      {USERS.slice(1).map(u => (
        <div key={u.id} onClick={() => onNavigate("S16", u.id)} style={{
          display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: `1px solid ${CARD_BORDER}22`, cursor: "pointer"
        }}>
          <Avatar initials={u.avatar} size={36} />
          <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{u.name}</div><div style={{ fontSize: 12, color: TEXT_DIM }}>@{u.username}</div></div>
          <Button small primary>Takip Et</Button>
        </div>
      ))}
    </div>
  );
}

// Simple page shells for remaining pages
function SimplePage({ title, desc, onNavigate, children }) {
  return (
    <div style={{ padding: "0 16px 100px" }}>
      <div style={{ fontWeight: 700, fontSize: 18, color: TEXT, marginBottom: 4 }}>{title}</div>
      {desc && <div style={{ fontSize: 13, color: TEXT_DIM, marginBottom: 16 }}>{desc}</div>}
      {children}
    </div>
  );
}

// S23: Edit Profile
function S23({ onNavigate }) {
  return (
    <SimplePage title="Profil Düzenle">
      <div style={{ textAlign: "center", marginBottom: 20 }}><Avatar initials="BY" size={72} /><div style={{ fontSize: 12, color: ACCENT, marginTop: 8, cursor: "pointer" }}>Fotoğrafı Değiştir</div></div>
      <InputField placeholder="@kullanıcıadı" icon="@" />
      <InputField placeholder="İsim" /><InputField placeholder="Soyisim" />
      <InputField placeholder="Biyografi (max 150)" icon="✏️" />
      <InputField placeholder="Doğum tarihi" icon="📅" />
      <InputField placeholder="Şehir / İlçe" icon="📍" />
      <Button primary full>Kaydet</Button>
    </SimplePage>
  );
}

// S24: Invite Friends
function S24() {
  return (
    <SimplePage title="Arkadaşlarını Davet Et" desc="Kişiye özel referans linkini paylaş">
      <Card style={{ textAlign: "center", padding: 24, marginBottom: 16 }}>
        <div style={{ fontSize: 14, color: TEXT, fontFamily: "monospace", marginBottom: 12 }}>sporwave.app/davet/berk2026</div>
        <Button primary>Linki Kopyala</Button>
      </Card>
      <div style={{ display: "flex", gap: 8 }}>
        <Button full style={{ flex: 1 }}>📱 WhatsApp ile Paylaş</Button>
        <Button full style={{ flex: 1 }}>📸 Instagram ile Paylaş</Button>
      </div>
    </SimplePage>
  );
}

function S25() { return <SimplePage title="Topluluk Kuralları" desc="SporWave topluluğumuzun temel kuralları"><Card><div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.8 }}>• No-show yasağı ve yaptırımları{"\n"}• Saygılı iletişim zorunluluğu{"\n"}• Fake profil / sahte ilan yasağı{"\n"}• Uygunsuz içerik ve taciz yasağı{"\n"}• İhlal bildirme yöntemi</div></Card></SimplePage>; }
function S26() { return <SimplePage title="Yardım & SSS" desc="Sık sorulan sorular">{["Nasıl maç oluşturabilirim?", "Skor takibi nasıl çalışır?", "Hesabımı nasıl silebilirim?", "Maça nasıl katılabilirim?"].map(q => <Card key={q} style={{ marginBottom: 8 }}><div style={{ fontSize: 14, color: TEXT }}>{q}</div><div style={{ fontSize: 12, color: ACCENT, marginTop: 4 }}>Cevabı Gör →</div></Card>)}</SimplePage>; }

// S27: Verification
function S27() {
  return (
    <SimplePage title="Hesabını Doğrula" desc="Telefon numaranı doğrula, güvenilir profil oluştur">
      <InputField placeholder="+90 5XX XXX XX XX" icon="📱" />
      <Button primary full>Kod Gönder</Button>
      <div style={{ marginTop: 16 }}><InputField placeholder="6 haneli doğrulama kodu" icon="🔢" /></div>
      <Button primary full>Doğrula</Button>
    </SimplePage>
  );
}

// S31: Create Match
function S31({ onNavigate }) {
  const [step, setStep] = useState(1);
  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>{[1,2,3,4].map(s => <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: s <= step ? ACCENT : `${TEXT_DIM}33` }} />)}</div>
      {step === 1 && (<>
        <div style={{ fontSize: 20, fontWeight: 700, color: TEXT, marginBottom: 20 }}>Maç Detayları</div>
        <InputField placeholder="Maç başlığı" icon="✏️" />
        <InputField placeholder="Açıklama (opsiyonel)" />
        <SectionTitle>Format</SectionTitle>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>{["5v5", "6v6", "7v7", "Özel"].map(f => <Button key={f} small>{f}</Button>)}</div>
        <Button primary full onClick={() => setStep(2)}>Devam</Button>
      </>)}
      {step === 2 && (<>
        <div style={{ fontSize: 20, fontWeight: 700, color: TEXT, marginBottom: 20 }}>Tarih & Konum</div>
        <InputField placeholder="Tarih seç" icon="📅" />
        <InputField placeholder="Saat seç" icon="⏰" />
        <SectionTitle>Konum (opsiyonel)</SectionTitle>
        <Card style={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}><span style={{ color: TEXT_DIM }}>🗺️ Harita — Pin at</span></Card>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <Button small style={{ flex: 1 }}>Saha Biliyorum</Button>
          <Button small style={{ flex: 1 }}>Öneriye Açığım</Button>
          <Button small style={{ flex: 1 }}>Konumsuz</Button>
        </div>
        <Button primary full onClick={() => setStep(3)}>Devam</Button>
      </>)}
      {step === 3 && (<>
        <div style={{ fontSize: 20, fontWeight: 700, color: TEXT, marginBottom: 20 }}>Katılım Ayarları</div>
        <InputField placeholder="Maks. oyuncu sayısı" icon="👥" />
        <SectionTitle>Seviye Tercihi</SectionTitle>
        <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>{["Herkes", "Başlangıç", "Orta", "İyi", "Profesyonel"].map(l => <Button key={l} small>{l}</Button>)}</div>
        <SectionTitle>Kabul Modu</SectionTitle>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}><Button small style={{ flex: 1 }}>Herkesi Kabul Et</Button><Button small style={{ flex: 1 }}>Onay ile Kabul Et</Button></div>
        <SectionTitle>Gizlilik</SectionTitle>
        <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>{["Herkese açık", "Sadece takipçilere", "Sadece davet ile"].map(p => <Button key={p} small>{p}</Button>)}</div>
        <Button primary full onClick={() => setStep(4)}>Devam</Button>
      </>)}
      {step === 4 && (<>
        <div style={{ fontSize: 20, fontWeight: 700, color: TEXT, marginBottom: 20 }}>Arkadaşlarını Davet Et</div>
        {USERS.slice(1, 5).map(u => (
          <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: `1px solid ${CARD_BORDER}22` }}>
            <Avatar initials={u.avatar} size={36} />
            <div style={{ flex: 1 }}><div style={{ fontSize: 14, color: TEXT }}>{u.name}</div><div style={{ fontSize: 11, color: TEXT_DIM }}>%{u.attendance} katılım</div></div>
            <Button small primary>Davet Et</Button>
          </div>
        ))}
        <Button primary full onClick={() => onNavigate("S08")} style={{ marginTop: 16 }}>Yayınla 📢</Button>
        <div style={{ textAlign: "center", marginTop: 12, fontSize: 13, color: TEXT_DIM, cursor: "pointer" }} onClick={() => onNavigate("S08")}>Atla</div>
      </>)}
    </div>
  );
}

// S35: Match Chat
function S35({ onNavigate, id }) {
  const match = MATCHES.find(m => m.id === id) || MATCHES[1];
  const msgs = [
    { from: USERS[1], text: "Sahayı ben ayarlarım", time: "12:10" },
    { from: USERS[3], text: "Ben de geliyorum 💪", time: "12:12" },
    { from: USERS[0], text: "Harika, 21:00'de buluşalım", time: "12:15" },
    { from: null, text: "👑 Sistem: Ali host olmak için oylama başlattı", system: true },
  ];
  return (
    <div style={{ padding: "0 16px 80px" }}>
      <div onClick={() => onNavigate("S12", match.id)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0 12px", borderBottom: `1px solid ${CARD_BORDER}22`, cursor: "pointer" }}>
        <span style={{ fontSize: 18 }}>⚽</span>
        <div style={{ flex: 1 }}><div style={{ fontWeight: 600, color: TEXT, fontSize: 14 }}>{match.title}</div><div style={{ fontSize: 11, color: TEXT_DIM }}>{match.joined} katılımcı</div></div>
      </div>
      <div style={{ padding: "12px 0" }}>
        {msgs.map((m, i) => m.system ? (
          <div key={i} style={{ textAlign: "center", fontSize: 12, color: TEXT_DIM, padding: "8px 0" }}>{m.text}</div>
        ) : (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "flex-start" }}>
            <Avatar initials={m.from.avatar} size={28} onClick={() => onNavigate("S16", m.from.id)} />
            <div>
              <div style={{ fontSize: 11, color: ACCENT, fontWeight: 600 }}>{m.from.name.split(" ")[0]}</div>
              <div style={{ background: CARD, padding: "6px 10px", borderRadius: "0 12px 12px 12px", fontSize: 14, color: TEXT, marginTop: 2 }}>{m.text}</div>
              <div style={{ fontSize: 10, color: TEXT_DIM, marginTop: 2 }}>{m.time}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "10px 16px", background: BG, borderTop: `1px solid ${CARD_BORDER}`, display: "flex", gap: 8, maxWidth: 430, margin: "0 auto" }}>
        <div style={{ flex: 1 }}><InputField placeholder="Mesaj yaz..." /></div>
        <Button primary small>Gönder</Button>
      </div>
    </div>
  );
}

// S40: Rating & Attendance
function S40({ onNavigate, id }) {
  const match = MATCHES.find(m => m.id === id) || MATCHES[0];
  const [selectedMvp, setSelectedMvp] = useState(null);
  return (
    <div style={{ padding: "0 16px 100px" }}>
      <Card style={{ marginBottom: 16, textAlign: "center" }}>
        <div style={{ fontWeight: 700, color: TEXT }}>{match.title}</div>
        {match.score && <div style={{ fontSize: 28, fontWeight: 900, marginTop: 4 }}><span style={{ color: ACCENT }}>{match.score[0]}</span><span style={{ color: TEXT_DIM }}> — </span><span style={{ color: TEXT }}>{match.score[1]}</span></div>}
        <div style={{ fontSize: 12, color: TEXT_DIM, marginTop: 4 }}>{match.date}</div>
      </Card>
      <SectionTitle>⭐ Maçın Yıldızını Seç (MVP)</SectionTitle>
      <div style={{ marginBottom: 20 }}>
        {[...new Set([...(match.teamA || []), ...(match.teamB || [])])].map(uid => {
          const u = USERS.find(x => x.id === uid);
          return u && (
            <div key={uid} onClick={() => setSelectedMvp(uid)} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "10px 0",
              borderBottom: `1px solid ${CARD_BORDER}22`, cursor: "pointer",
              background: selectedMvp === uid ? `${ACCENT}11` : "transparent", borderRadius: 8, paddingLeft: 8
            }}>
              <Avatar initials={u.avatar} size={34} color={selectedMvp === uid ? ACCENT : undefined} />
              <div style={{ flex: 1, fontWeight: selectedMvp === uid ? 700 : 400, color: selectedMvp === uid ? ACCENT : TEXT, fontSize: 14 }}>{u.name}</div>
              {selectedMvp === uid && <span style={{ color: ACCENT }}>⭐</span>}
            </div>
          );
        })}
        <div style={{ fontSize: 11, color: TEXT_DIM, marginTop: 8 }}>Eşit oy durumunda Co-MVP gösterilir</div>
      </div>
      <SectionTitle>✅ Katılım Durumunu Bildir</SectionTitle>
      <div style={{ marginBottom: 20 }}>
        {[...new Set([...(match.teamA || []), ...(match.teamB || [])])].map(uid => {
          const u = USERS.find(x => x.id === uid);
          return u && (
            <div key={uid} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: `1px solid ${CARD_BORDER}22` }}>
              <Avatar initials={u.avatar} size={28} />
              <span style={{ flex: 1, fontSize: 14, color: TEXT }}>{u.name}</span>
              <Button small primary>✅ Geldi</Button>
              <Button small danger>❌ Gelmedi</Button>
            </div>
          );
        })}
        <div style={{ fontSize: 11, color: TEXT_DIM, marginTop: 8 }}>%60 çoğunluk kuralı · Min 3 oy · Son 10 maç bazlı hesaplama</div>
      </div>
      <Button primary full onClick={() => onNavigate("S08")}>Gönder</Button>
    </div>
  );
}

// State Machine Visualizer
function StateMachine({ onNavigate }) {
  const states = [
    { id: "draft", label: "Taslak", color: "#6B7280", desc: "Oluşturuldu, yayınlanmadı" },
    { id: "open", label: "Açık", color: GREEN, desc: "Yayında, katılıma açık" },
    { id: "full", label: "Dolu", color: ORANGE, desc: "Kontenjan doldu" },
    { id: "started", label: "Başladı", color: ACCENT, desc: "Canlı skor aktif" },
    { id: "ended", label: "Bitti", color: "#A78BFA", desc: "Skor kilitli" },
    { id: "rating", label: "Puanlama", color: "#F59E0B", desc: "24s MVP + attendance" },
    { id: "archived", label: "Arşiv", color: TEXT_DIM, desc: "Feed + profilde görünür" },
  ];
  return (
    <div style={{ padding: "0 16px 100px" }}>
      <div style={{ fontSize: 18, fontWeight: 800, color: TEXT, marginBottom: 4 }}>Maç State Machine</div>
      <div style={{ fontSize: 12, color: TEXT_DIM, marginBottom: 20 }}>7 state üzerinden maç yaşam döngüsü</div>
      {states.map((s, i) => (
        <div key={s.id}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: `${s.color}22`, border: `2px solid ${s.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: s.color }}>{i + 1}</div>
            <div>
              <div style={{ fontWeight: 700, color: s.color, fontSize: 14 }}>{s.label}</div>
              <div style={{ fontSize: 12, color: TEXT_DIM }}>{s.desc}</div>
            </div>
          </div>
          {i < states.length - 1 && (
            <div style={{ marginLeft: 19, height: 20, borderLeft: `2px dashed ${CARD_BORDER}` }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================

const PAGE_TITLES = {
  S01: "Giriş Yap", S02: "Kayıt Ol", S03: "Şifremi Unuttum", S04: "Onboarding",
  S05: null, S07: "Kullanıcı Ara", S08: null, S09: "Maç Seçenekleri",
  S10: "Maç Başlat", S11: "Maç Detay", S12: "Planlanan Maç", S13: "Başvurular",
  S15: null, S16: "Kullanıcı Profili", S17: "Mesajlar", S18: "Sohbet",
  S19: "Bildirimler", S20: "Menü", S21: "Ayarlar", S22: "Takipçiler",
  S23: "Profil Düzenle", S24: "Davet Et", S25: "Kurallar", S26: "Yardım",
  S27: "Doğrulama", S31: "Maç Oluştur", S35: "Maç Sohbeti",
  S40: "Puanlama",
  STATE: "State Machine",
};

const TAB_PAGES = ["S05", "S08", "S15"];
const BACK_PAGES = { S01: null, S02: "S01", S03: "S01", S04: "S01" };

export default function SporWave() {
  const [history, setHistory] = useState([{ page: "S05", id: null }]);
  const current = history[history.length - 1];

  const navigate = (page, id = null) => {
    if (page === "BACK") {
      setHistory(h => h.length > 1 ? h.slice(0, -1) : h);
      return;
    }
    if (TAB_PAGES.includes(page)) {
      setHistory([{ page, id }]);
    } else {
      setHistory(h => [...h, { page, id }]);
    }
  };

  const showBack = !TAB_PAGES.includes(current.page) && history.length > 1;
  const showTabs = !["S01", "S02", "S03", "S04"].includes(current.page);
  const activeTab = TAB_PAGES.includes(current.page) ? current.page : (history.find(h => TAB_PAGES.includes(h.page))?.page || "S05");

  const renderPage = () => {
    switch (current.page) {
      case "S01": return <S01 onNavigate={navigate} />;
      case "S02": return <S02 onNavigate={navigate} />;
      case "S03": return <S03 onNavigate={navigate} />;
      case "S04": return <S04 onNavigate={navigate} />;
      case "S05": return <S05 onNavigate={navigate} />;
      case "S07": return <S07 onNavigate={navigate} />;
      case "S08": return <S08 onNavigate={navigate} />;
      case "S09": return <S09 onNavigate={navigate} />;
      case "S10": return <S10 onNavigate={navigate} />;
      case "S11": return <S11 onNavigate={navigate} id={current.id} />;
      case "S12": return <S12 onNavigate={navigate} id={current.id} />;
      case "S13": return <S13 onNavigate={navigate} />;
      case "S15": return <S15 onNavigate={navigate} />;
      case "S16": return <S16 onNavigate={navigate} id={current.id} />;
      case "S17": return <S17 onNavigate={navigate} />;
      case "S18": return <S18 onNavigate={navigate} id={current.id} />;
      case "S19": return <S19 onNavigate={navigate} />;
      case "S20": return <S20 onNavigate={navigate} />;
      case "S21": return <S21 onNavigate={navigate} />;
      case "S22": return <S22 onNavigate={navigate} />;
      case "S23": return <S23 onNavigate={navigate} />;
      case "S24": return <S24 onNavigate={navigate} />;
      case "S25": return <S25 onNavigate={navigate} />;
      case "S26": return <S26 onNavigate={navigate} />;
      case "S27": return <S27 onNavigate={navigate} />;
      case "S31": return <S31 onNavigate={navigate} />;
      case "S35": return <S35 onNavigate={navigate} id={current.id} />;
      case "S40": return <S40 onNavigate={navigate} id={current.id} />;
      case "STATE": return <StateMachine onNavigate={navigate} />;
      default: return <S05 onNavigate={navigate} />;
    }
  };

  return (
    <div style={{
      maxWidth: 430, margin: "0 auto", minHeight: "100vh",
      background: BG, color: TEXT, fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      position: "relative", boxShadow: "0 0 60px rgba(0,0,0,.5)"
    }}>
      {/* Quick nav ribbon */}
      <div style={{
        position: "sticky", top: 0, zIndex: 200, background: "#060810",
        borderBottom: `1px solid ${CARD_BORDER}`, padding: "6px 8px",
        display: "flex", gap: 4, overflowX: "auto", flexWrap: "nowrap"
      }}>
        {[
          { p: "S01", l: "Login" }, { p: "S04", l: "Onboard" }, { p: "S05", l: "Feed" },
          { p: "S08", l: "Maçlar" }, { p: "S09", l: "Oluştur" }, { p: "S10", l: "Canlı Skor" },
          { p: "S11", l: "Maç Detay", id: 1 }, { p: "S12", l: "Planlanan", id: 2 },
          { p: "S15", l: "Profil" }, { p: "S16", l: "Profil 2", id: 2 },
          { p: "S17", l: "Mesajlar" }, { p: "S18", l: "DM", id: 1 },
          { p: "S19", l: "Bildirim" }, { p: "S31", l: "Oluştur" }, { p: "S35", l: "Maç Chat", id: 2 },
          { p: "S40", l: "Puan", id: 1 },
          { p: "STATE", l: "State ⚙️" },
        ].map(n => (
          <span key={n.p + (n.id||"")} onClick={() => navigate(n.p, n.id)} style={{
            padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: 600, whiteSpace: "nowrap",
            background: current.page === n.p ? ACCENT : `${TEXT_DIM}22`,
            color: current.page === n.p ? BG : TEXT_DIM, cursor: "pointer"
          }}>{n.l}</span>
        ))}
      </div>

      {!["S01", "S02", "S03", "S04"].includes(current.page) && (
        <TopNav onNavigate={navigate} title={PAGE_TITLES[current.page]} showBack={showBack} />
      )}

      <div style={{ paddingBottom: showTabs ? 64 : 0 }}>
        {renderPage()}
      </div>

      {showTabs && <TabBar active={activeTab} onNavigate={navigate} />}
    </div>
  );
}
