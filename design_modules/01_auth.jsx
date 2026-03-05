import { useState, useEffect } from "react";
import T from "./theme.js";

// ============================================================
// SPORWAVE MODULE 1 — Auth & Onboarding (S01-S04, S32)
// v2: SVG icons, brand logos, proper focus states, date picker
// ============================================================

// — FONTS —
const FONT_HEADING = "'Plus Jakarta Sans', 'SF Pro Display', -apple-system, sans-serif";
const FONT_BODY = "'SF Pro Display', 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

// — SVG ICONS —
const Icons = {
  mail: (color = T.textDim) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <path d="M22 7l-10 6L2 7" />
    </svg>
  ),
  lock: (color = T.textDim) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  ),
  user: (color = T.textDim) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M20 21a8 8 0 10-16 0" />
    </svg>
  ),
  calendar: (color = T.textDim) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <rect x="7" y="14" width="3" height="3" rx="0.5" fill={color} stroke="none" opacity="0.4" />
    </svg>
  ),
  city: (color = T.textDim) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18" /><path d="M5 21V7l8-4v18" /><path d="M19 21V11l-6-4" />
      <line x1="9" y1="9" x2="9" y2="9.01" /><line x1="9" y1="13" x2="9" y2="13.01" /><line x1="9" y1="17" x2="9" y2="17.01" />
    </svg>
  ),
  pin: (color = T.textDim) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  ),
  camera: (color = T.textDim) => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  ),
  key: (color = T.textDim) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  ),
  rules: (color = T.textDim) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14,2 14,8 20,8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  check: (color = T.accent) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20,6 9,17 4,12" />
    </svg>
  ),
  arrowLeft: (color = T.textDim) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12,19 5,12 12,5" />
    </svg>
  ),
  google: () => (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill={T.googleBlue}/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill={T.googleGreen}/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.97 11.97 0 001 12c0 1.94.46 3.77 1.18 5.07l3.66-2.84z" fill={T.googleYellow}/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill={T.googleRed}/>
    </svg>
  ),
  apple: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={T.text}>
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
    </svg>
  ),
  sparkle: (color = T.accent) => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
    </svg>
  ),
  successCheck: (color = T.green) => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="9,12 11,14 15,10" />
    </svg>
  ),
};

// — SHARED COMPONENTS —

function InputField({ placeholder, type = "text", icon, value, onChange, error }) {
  const [focused, setFocused] = useState(false);
  const isDate = type === "date";
  return (
    <div style={{ marginBottom: error ? 4 : 12 }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 12, background: T.card,
        border: `1.5px solid ${error ? T.red : focused ? T.accent : T.cardBorder}`,
        borderRadius: 12, padding: "12px 16px",
        transition: "border-color .2s, box-shadow .2s",
        boxShadow: focused ? `0 0 0 3px ${T.accent}18` : "none",
      }}>
        {icon && <span style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
          {typeof icon === "function" ? icon(focused ? T.accent : T.textDim) : icon}
        </span>}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            background: "none", border: "none", color: T.text, fontSize: 14,
            width: "100%", outline: "none", fontWeight: 500,
            letterSpacing: type === "password" ? "2px" : "0",
            colorScheme: isDate ? "dark" : undefined,
          }}
        />
      </div>
      {error && <div style={{ fontSize: 11, color: T.red, padding: "4px 16px 8px", fontWeight: 500 }}>{error}</div>}
    </div>
  );
}

function Button({ children, primary, danger, ghost, full, small, onClick, disabled, style: s }) {
  const [hover, setHover] = useState(false);
  const bg = danger ? T.red : primary ? T.accent : "transparent";
  const c = danger ? T.white : primary ? T.white : T.text;
  const border = !primary && !danger ? `1.5px solid ${ghost ? "transparent" : T.cardBorder}` : "1.5px solid transparent";
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: small ? "8px 16px" : "12px 24px",
        borderRadius: 12, border,
        background: disabled ? `${T.textDim}22` : bg,
        color: disabled ? T.textDim : c,
        fontSize: small ? 13 : 15, fontWeight: 700,
        cursor: disabled ? "not-allowed" : "pointer",
        width: full ? "100%" : "auto",
        transition: "all .2s cubic-bezier(.4,0,.2,1)",
        transform: hover && !disabled ? "translateY(-1px)" : "none",
        boxShadow: hover && primary && !disabled ? `0 4px 20px ${T.accent}33` : "none",
        letterSpacing: "0.2px",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        ...s
      }}
    >{children}</button>
  );
}

function SocialButton({ icon, label, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: "100%", padding: "12px 20px", borderRadius: 12,
        border: `1.5px solid ${hover ? T.textDim + "66" : T.cardBorder}`,
        background: hover ? T.card : "transparent",
        color: T.text, fontSize: 14, fontWeight: 600,
        cursor: "pointer", transition: "all .2s",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
        marginBottom: 12,
      }}
    >
      <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>
      {label}
    </button>
  );
}

function ProgressBar({ current, total }) {
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 28, padding: "0 4px" }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{
          flex: 1, height: 4, borderRadius: 4,
          background: i < current ? T.accent : i === current ? `${T.accent}55` : `${T.textDim}22`,
          transition: "background .4s ease",
        }} />
      ))}
    </div>
  );
}

function Divider({ text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
      <div style={{ flex: 1, height: 1, background: T.cardBorder }} />
      <span style={{ fontSize: 12, color: T.textMuted, fontWeight: 500 }}>{text}</span>
      <div style={{ flex: 1, height: 1, background: T.cardBorder }} />
    </div>
  );
}

function Checkbox({ checked, onToggle, children }) {
  return (
    <label style={{
      display: "flex", gap: 12, fontSize: 13, color: T.textDim,
      alignItems: "flex-start", cursor: "pointer", lineHeight: 1.5,
    }} onClick={onToggle}>
      <div style={{
        width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
        border: `1.5px solid ${checked ? T.accent : T.cardBorder}`,
        background: checked ? `${T.accent}22` : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all .2s",
      }}>
        {checked && Icons.check()}
      </div>
      <span style={{ fontWeight: 500 }}>{children}</span>
    </label>
  );
}

function PageShell({ children, center }) {
  return (
    <div style={{
      padding: "24px 20px", minHeight: "100vh",
      display: "flex", flexDirection: "column",
      justifyContent: center ? "center" : "flex-start",
    }}>{children}</div>
  );
}

function BackLink({ onClick, label = "Geri" }) {
  return (
    <div onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      fontSize: 14, color: T.textDim, cursor: "pointer", fontWeight: 500,
      marginBottom: 8, marginTop: 20, padding: "4px 0",
    }}>
      {Icons.arrowLeft(T.textDim)}
      {label}
    </div>
  );
}

function PasswordStrength({ password }) {
  if (!password) return null;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNum = /[0-9]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);
  const score = [password.length >= 8, hasLower && hasUpper, hasNum, hasSpecial].filter(Boolean).length;
  const strength = Math.min(score, 3);
  const labels = ["Zayıf", "Orta", "İyi", "Güçlü"];
  const colors = [T.red, T.orange, T.accent, T.green];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, padding: "0 4px" }}>
      <div style={{ display: "flex", gap: 4, flex: 1 }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i <= strength ? colors[strength] : `${T.textDim}22`,
            transition: "background .3s"
          }} />
        ))}
      </div>
      <span style={{ fontSize: 10, color: colors[strength], fontWeight: 600 }}>{labels[strength]}</span>
    </div>
  );
}

// — PAGES —

// S32: Splash Screen
function S32({ onNavigate }) {
  const [show, setShow] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 100);
    setTimeout(() => setFadeOut(true), 1800);
    setTimeout(() => onNavigate("S01"), 2200);
  }, []);

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: T.bg, position: "relative", overflow: "hidden",
      opacity: fadeOut ? 0 : 1, transition: "opacity .4s ease",
    }}>
      <div style={{
        fontSize: 52, fontWeight: 900, color: T.accent,
        letterSpacing: "-3px", lineHeight: 1, fontFamily: FONT_HEADING,
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0) scale(1)" : "translateY(20px) scale(0.9)",
        transition: "all .8s cubic-bezier(.16,1,.3,1)",
      }}>SporWave</div>
      <div style={{
        fontSize: 14, color: T.textDim, marginTop: 8, fontWeight: 500,
        letterSpacing: "1px",
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(10px)",
        transition: "all .8s cubic-bezier(.16,1,.3,1) .2s",
      }}>Sahaya çık, maçını paylaş</div>

      <div style={{
        position: "absolute", bottom: 80, width: 8, height: 8, borderRadius: 4,
        background: T.accent, opacity: show ? 1 : 0,
        transition: "opacity .5s .6s",
        boxShadow: `0 0 20px ${T.accent}66`,
      }} />
    </div>
  );
}

// S01: Login
function S01({ onNavigate }) {
  return (
    <PageShell center>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ fontSize: 44, fontWeight: 900, color: T.accent, letterSpacing: "-2.5px", lineHeight: 1, fontFamily: FONT_HEADING }}>
          SporWave
        </div>
        <div style={{ fontSize: 14, color: T.textDim, marginTop: 8, fontWeight: 500, letterSpacing: "0.5px" }}>
          Sahaya çık, maçını paylaş
        </div>
      </div>

      <InputField placeholder="E-posta" icon={Icons.mail} />
      <InputField placeholder="Şifre" type="password" icon={Icons.lock} />

      <Button primary full onClick={() => onNavigate("S05")} style={{ marginTop: 4 }}>
        Giriş Yap
      </Button>

      <div style={{ textAlign: "center", marginTop: 12 }}>
        <span onClick={() => onNavigate("S03")} style={{ fontSize: 13, color: T.accent, cursor: "pointer", fontWeight: 500 }}>
          Şifremi Unuttum
        </span>
      </div>

      <Divider text="veya" />

      <SocialButton icon={<Icons.google />} label="Google ile devam et" onClick={() => onNavigate("S05")} />
      <SocialButton icon={<Icons.apple />} label="Apple ile devam et" onClick={() => onNavigate("S05")} />

      <div style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: T.textDim }}>
        Hesabın yok mu?{" "}
        <span onClick={() => onNavigate("S02")} style={{ color: T.accent, cursor: "pointer", fontWeight: 700 }}>Kayıt Ol</span>
      </div>
    </PageShell>
  );
}

// S02: Register
function S02({ onNavigate }) {
  const [pw, setPw] = useState("");
  const [agreed, setAgreed] = useState(false);
  return (
    <PageShell>
      <BackLink onClick={() => onNavigate("S01")} />

      <div style={{ fontSize: 28, fontWeight: 800, color: T.accent, letterSpacing: "-1px", marginBottom: 4, fontFamily: FONT_HEADING }}>
        SporWave
      </div>
      <div style={{ fontSize: 14, color: T.textDim, marginBottom: 28, fontWeight: 500 }}>
        Yeni hesap oluştur
      </div>

      <InputField placeholder="E-posta" icon={Icons.mail} />
      <InputField placeholder="Şifre" type="password" icon={Icons.lock} value={pw} onChange={e => setPw(e.target.value)} />
      <PasswordStrength password={pw} />
      <InputField placeholder="Şifre tekrar" type="password" icon={Icons.lock} />

      <div style={{ marginBottom: 20 }}>
        <Checkbox checked={agreed} onToggle={() => setAgreed(!agreed)}>
          <span style={{ color: T.accent, fontWeight: 600 }}>KVKK</span>
          {" "}ve{" "}
          <span style={{ color: T.accent, fontWeight: 600 }}>Kullanım Şartları</span>'nı okudum ve kabul ediyorum
        </Checkbox>
      </div>

      <Button primary full onClick={() => onNavigate("S04")}>Kayıt Ol</Button>

      <Divider text="veya" />

      <SocialButton icon={<Icons.google />} label="Google ile kayıt ol" onClick={() => onNavigate("S04")} />
      <SocialButton icon={<Icons.apple />} label="Apple ile kayıt ol" onClick={() => onNavigate("S04")} />

      <div style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: T.textDim }}>
        Zaten hesabın var mı?{" "}
        <span onClick={() => onNavigate("S01")} style={{ color: T.accent, cursor: "pointer", fontWeight: 700 }}>Giriş Yap</span>
      </div>
    </PageShell>
  );
}

// S03: Forgot Password
function S03({ onNavigate }) {
  const [sent, setSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleSend = () => {
    setSent(true);
    setCountdown(60);
  };

  const handleResend = () => {
    setCountdown(60);
  };

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <PageShell center>
      <BackLink onClick={() => onNavigate("S01")} />

      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: T.text, marginBottom: 8, fontFamily: FONT_HEADING }}>Şifremi Unuttum</div>
        <div style={{ fontSize: 14, color: T.textDim, marginBottom: 28, lineHeight: 1.5 }}>
          E-posta adresini gir, sıfırlama linki gönderelim
        </div>
      </div>

      {!sent ? (
        <>
          <InputField placeholder="E-posta adresin" icon={Icons.mail} />
          <Button primary full onClick={handleSend} style={{ marginTop: 8 }}>Sıfırlama Linki Gönder</Button>
        </>
      ) : (
        <>
          <div style={{
            background: `${T.green}12`, border: `1.5px solid ${T.green}28`,
            borderRadius: 14, padding: 20, textAlign: "center",
          }}>
            <div style={{ marginBottom: 12, display: "flex", justifyContent: "center" }}>{Icons.successCheck()}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: T.green, marginBottom: 8 }}>Link gönderildi!</div>
            <div style={{ fontSize: 13, color: T.textDim, lineHeight: 1.5 }}>
              E-postanı kontrol et. Spam klasörüne de bakmanı öneririz.
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: 16 }}>
            {countdown > 0 ? (
              <span style={{ fontSize: 13, color: T.textMuted, fontWeight: 500 }}>
                {countdown}sn sonra tekrar gönderebilirsin
              </span>
            ) : (
              <span onClick={handleResend} style={{ fontSize: 14, color: T.accent, cursor: "pointer", fontWeight: 600 }}>
                Tekrar Gönder
              </span>
            )}
          </div>

          <div onClick={() => onNavigate("S01")} style={{
            textAlign: "center", marginTop: 20,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            fontSize: 14, color: T.accent, cursor: "pointer", fontWeight: 600,
          }}>
            {Icons.arrowLeft(T.accent)} Giriş Yap'a Dön
          </div>
        </>
      )}
    </PageShell>
  );
}

// Mock: taken usernames (for unique check demo)
const TAKEN_USERNAMES = ["berk26","alidemir","mkaya","emrecelik","canyildiz","oguzhan","keremm","buraksen"];

// S04: Onboarding (4 steps)
function S04({ onNavigate }) {
  const [step, setStep] = useState(0);
  const [gender, setGender] = useState(null);
  const [sports, setSports] = useState(["Futbol"]);
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const [birthDate, setBirthDate] = useState("");
  const [photoSheet, setPhotoSheet] = useState(false);
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [unFocused, setUnFocused] = useState(false);

  const handleUsername = (val) => {
    const clean = val.toLowerCase().replace(/[^a-z0-9._]/g, "");
    setUsername(clean);
    if (clean.length > 0 && TAKEN_USERNAMES.includes(clean)) {
      setUsernameError("Bu kullanıcı adı alınmış");
    } else {
      setUsernameError("");
    }
  };

  const sportsList = [
    { label: "Futbol", icon: "⚽" }, { label: "Basketbol", icon: "🏀" },
    { label: "Tenis", icon: "🎾" }, { label: "Padel", icon: "🏓" },
    { label: "Koşu", icon: "🏃" }, { label: "Bisiklet", icon: "🚲" },
    { label: "Voleybol", icon: "🏐" }, { label: "Yüzme", icon: "🏊" },
    { label: "Fitness", icon: "💪" }, { label: "Diğer", icon: "➕" },
  ];

  const genders = [
    { id: "male", label: "Erkek", icon: "♂" },
    { id: "female", label: "Kadın", icon: "♀" },
    { id: "other", label: "Belirtmek\nistemiyorum", icon: "—" },
  ];

  const stepTitles = ["Temel Bilgiler", "Profil Fotoğrafı", "Spor Tercihleri", "Konum & Kurallar"];

  return (
    <PageShell>
      <div style={{ marginTop: 16 }}>
        <ProgressBar current={step} total={4} />
      </div>
      {step > 0 && (
        <BackLink onClick={() => setStep(s => s - 1)} />
      )}

      <div style={{ marginBottom: 8 }}>
        <span style={{ fontSize: 12, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>
          Adım {step + 1}/4
        </span>
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color: T.text, marginBottom: 24, letterSpacing: "-0.5px", fontFamily: FONT_HEADING }}>
        {stepTitles[step]}
      </div>

      {/* Step 1 */}
      {step === 0 && (
        <>
          {/* Username */}
          <div style={{ marginBottom: usernameError ? 4 : 12 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 0, background: T.card,
              border: `1.5px solid ${usernameError ? T.red : unFocused ? T.accent : T.cardBorder}`,
              borderRadius: 12, transition: "border-color .2s, box-shadow .2s",
              boxShadow: unFocused ? `0 0 0 3px ${T.accent}18` : "none",
            }}>
              <span style={{ padding: "12px 0 12px 16px", color: T.textMuted, fontSize: 14, fontWeight: 500 }}>@</span>
              <input
                placeholder="kullaniciadi"
                value={username}
                onChange={e => handleUsername(e.target.value)}
                onFocus={() => setUnFocused(true)}
                onBlur={() => setUnFocused(false)}
                style={{ background: "none", border: "none", color: T.text, fontSize: 14, width: "100%", outline: "none", fontWeight: 500, padding: "12px 16px 12px 4px" }}
              />
            </div>
            {usernameError && <div style={{ fontSize: 11, color: T.red, padding: "4px 16px 8px", fontWeight: 500 }}>{usernameError}</div>}
          </div>
          <InputField placeholder="İsim" icon={Icons.user} />
          <InputField placeholder="Soyisim" icon={Icons.user} />
          <InputField placeholder="Doğum Tarihi" icon={Icons.calendar} type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} />

          <div style={{ fontSize: 13, color: T.textDim, marginBottom: 12, fontWeight: 600 }}>Cinsiyet</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            {genders.map(g => (
              <div key={g.id} onClick={() => setGender(g.id)} style={{
                flex: 1, padding: "16px 8px", borderRadius: 12,
                background: gender === g.id ? `${T.accent}12` : T.card,
                border: `1.5px solid ${gender === g.id ? T.accent : T.cardBorder}`,
                textAlign: "center", cursor: "pointer", transition: "all .2s",
              }}>
                <div style={{ fontSize: 20, marginBottom: 4, fontWeight: 300, color: gender === g.id ? T.accent : T.textDim }}>{g.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 600, whiteSpace: "pre-line", color: gender === g.id ? T.accent : T.textDim, lineHeight: 1.3 }}>{g.label}</div>
              </div>
            ))}
          </div>
          <Button primary full onClick={() => setStep(1)}>Devam</Button>
        </>
      )}

      {/* Step 2 */}
      {step === 1 && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ position: "relative", marginBottom: 24 }}>
            <div
              onClick={() => !photoUploaded && setPhotoSheet(true)}
              style={{
                width: 140, height: 140, borderRadius: "50%",
                background: photoUploaded ? "none" : T.card,
                border: photoUploaded ? `2px solid ${T.accent}` : `2px dashed ${T.cardBorder}`,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                cursor: "pointer", overflow: "hidden",
              }}
            >
              {photoUploaded ? (
                <div style={{
                  width: "100%", height: "100%",
                  background: `linear-gradient(135deg, ${T.shimmerLight} 0%, ${T.shimmerMid} 50%, ${T.shimmerLight} 100%)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ fontSize: 48 }}>🧑</span>
                </div>
              ) : (
                <>
                  {Icons.camera(T.textMuted)}
                  <span style={{ fontSize: 12, color: T.textMuted, marginTop: 8, fontWeight: 500 }}>Fotoğraf Ekle</span>
                </>
              )}
            </div>
            {photoUploaded && (
              <div onClick={() => setPhotoUploaded(false)} style={{
                position: "absolute", top: 4, right: 4,
                width: 28, height: 28, borderRadius: "50%",
                background: T.card, border: `1px solid ${T.cardBorder}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18" /><path d="M6 6l12 12" />
                </svg>
              </div>
            )}
          </div>
          <div style={{ width: "100%" }}>
            <Button primary full onClick={() => setStep(2)}>
              {photoUploaded ? "Devam" : "Fotoğraf Yükle"}
            </Button>
          </div>
          {!photoUploaded && (
            <div onClick={() => setStep(2)} style={{ textAlign: "center", marginTop: 16, fontSize: 14, color: T.textDim, cursor: "pointer", fontWeight: 500 }}>
              Sonra Ekle →
            </div>
          )}
        </div>
      )}

      {/* Photo Bottom Sheet */}
      {photoSheet && (
        <div
          onClick={() => setPhotoSheet(false)}
          style={{
            position: "fixed", inset: 0, background: T.overlayScrim,
            zIndex: 1000, display: "flex", alignItems: "flex-end", justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%", maxWidth: 430, background: T.card,
              borderRadius: "20px 20px 0 0", padding: "20px 20px 32px",
            }}
          >
            <div style={{
              width: 40, height: 4, borderRadius: 2, background: T.cardBorder,
              margin: "0 auto 20px",
            }} />
            <div style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 16, fontFamily: FONT_HEADING }}>
              Fotoğraf Seç
            </div>
            <div
              onClick={() => { setPhotoUploaded(true); setPhotoSheet(false); }}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "16px 0", borderBottom: `1px solid ${T.cardBorder}`,
                cursor: "pointer",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.textDim} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              <span style={{ fontSize: 15, color: T.text, fontWeight: 500 }}>Fotoğraf Çek</span>
            </div>
            <div
              onClick={() => { setPhotoUploaded(true); setPhotoSheet(false); }}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "16px 0", cursor: "pointer",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.textDim} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              <span style={{ fontSize: 15, color: T.text, fontWeight: 500 }}>Galeriden Seç</span>
            </div>
            <div
              onClick={() => setPhotoSheet(false)}
              style={{
                textAlign: "center", marginTop: 16,
                fontSize: 14, color: T.textDim, cursor: "pointer", fontWeight: 500,
              }}
            >
              Vazgeç
            </div>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 2 && (
        <>
          <div style={{ fontSize: 13, color: T.textDim, marginBottom: 20, lineHeight: 1.5 }}>
            Gelecek planlarımız için bize yardımcı olur. Birden fazla seçebilirsin.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
            {sportsList.map(s => {
              const selected = sports.includes(s.label);
              return (
                <div key={s.label} onClick={() => setSports(p => p.includes(s.label) ? p.filter(x => x !== s.label) : [...p, s.label])} style={{
                  padding: "16px 12px", borderRadius: 12,
                  background: selected ? `${T.accent}10` : T.card,
                  border: `1.5px solid ${selected ? T.accent : T.cardBorder}`,
                  textAlign: "center", cursor: "pointer", transition: "all .2s",
                }}>
                  <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: selected ? 700 : 500, color: selected ? T.accent : T.text }}>{s.label}</div>
                </div>
              );
            })}
          </div>
          {sports.length > 0 && (
            <div style={{ fontSize: 12, color: T.textMuted, textAlign: "center", marginBottom: 16 }}>
              {sports.length} spor seçildi
            </div>
          )}
          <Button primary full onClick={() => setStep(3)}>Devam</Button>
        </>
      )}

      {/* Step 4 */}
      {step === 3 && (
        <>
          <InputField placeholder="Şehir seç" icon={Icons.city} />
          <InputField placeholder="İlçe seç" icon={Icons.pin} />

          <div style={{
            background: T.card, borderRadius: 14,
            border: `1px solid ${T.cardBorder}`,
            padding: "16px 20px", marginBottom: 16, marginTop: 4,
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ display: "flex" }}>{Icons.rules(T.accent)}</span>
              Topluluk Kuralları
            </div>
            <div style={{ fontSize: 13, color: T.textDim, lineHeight: 1.6 }}>
              SporWave topluluğumuzda saygılı iletişim, no-show yasağı ve adil oyun temel kurallarımızdır.
            </div>
            <div style={{ fontSize: 13, color: T.accent, marginTop: 12, cursor: "pointer", fontWeight: 600 }}>
              Detayları Gör →
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <Checkbox checked={rulesAccepted} onToggle={() => setRulesAccepted(!rulesAccepted)}>
              Topluluk Kurallarını kabul ediyorum
            </Checkbox>
          </div>

          <Button primary full onClick={() => onNavigate("S05")}>Başla! 🚀</Button>
        </>
      )}

    </PageShell>
  );
}

// ============================================================
// MAIN APP
// ============================================================

export default function SporWaveAuth() {
  const [current, setCurrent] = useState("S32");
  const [fadeClass, setFadeClass] = useState(true);

  // Load Plus Jakarta Sans from Google Fonts
  useEffect(() => {
    if (!document.querySelector('link[href*="Plus+Jakarta+Sans"]')) {
      const link = document.createElement("link");
      link.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap";
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
  }, []);

  const navigate = (page) => {
    setFadeClass(false);
    setTimeout(() => {
      setCurrent(page);
      setFadeClass(true);
    }, 150);
  };

  const renderPage = () => {
    switch (current) {
      case "S32": return <S32 onNavigate={navigate} />;
      case "S01": return <S01 onNavigate={navigate} />;
      case "S02": return <S02 onNavigate={navigate} />;
      case "S03": return <S03 onNavigate={navigate} />;
      case "S04": return <S04 onNavigate={navigate} />;
      case "S05": return (
        <PageShell center>
          <div style={{ textAlign: "center" }}>
            <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}>{Icons.sparkle(T.accent)}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: T.accent, marginBottom: 8, fontFamily: FONT_HEADING }}>Hoş geldin!</div>
            <div style={{ fontSize: 14, color: T.textDim, marginBottom: 24 }}>Auth & Onboarding modülü tamamlandı</div>
            <Button primary onClick={() => navigate("S32")}>Başa Dön</Button>
          </div>
        </PageShell>
      );
      default: return <S01 onNavigate={navigate} />;
    }
  };

  return (
    <div style={{
      maxWidth: 430, margin: "0 auto", minHeight: "100vh",
      background: T.bg, color: T.text,
      fontFamily: FONT_BODY,
      position: "relative", boxShadow: T.shadowPage,
      overflow: "hidden",
    }}>
      {/* Dev nav ribbon */}
      <div style={{
        position: "sticky", top: 0, zIndex: 200, background: T.bgAlt,
        borderBottom: `1px solid ${T.cardBorder}`, padding: "8px 8px",
        display: "flex", gap: 4, overflowX: "auto", flexWrap: "nowrap",
      }}>
        {[
          { p: "S32", l: "Splash" }, { p: "S01", l: "Login" },
          { p: "S02", l: "Kayıt" }, { p: "S03", l: "Şifre" },
          { p: "S04", l: "Onboarding" },
        ].map(n => (
          <span key={n.p} onClick={() => navigate(n.p)} style={{
            padding: "4px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600,
            whiteSpace: "nowrap",
            background: current === n.p ? T.accent : `${T.textDim}22`,
            color: current === n.p ? T.onAccent : T.textDim,
            cursor: "pointer", transition: "all .15s",
          }}>{n.l}</span>
        ))}
      </div>

      <div style={{
        opacity: fadeClass ? 1 : 0,
        transform: fadeClass ? "translateY(0)" : "translateY(8px)",
        transition: "all .15s ease",
      }}>
        {renderPage()}
      </div>
    </div>
  );
}
