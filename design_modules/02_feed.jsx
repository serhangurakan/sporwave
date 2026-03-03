import { useState, useEffect, useRef } from "react";
import T from "./theme.js";

// ============================================================
// SPORWAVE MODULE 2 v3 — Feed & Search (S05, S07, S42, S43)
// Two-layer model: M (matches, shared) + P (posts, per-player)
// PostCard replaces MatchCard — single owner, post-based engagement
// ============================================================
const FONT_H = "'Plus Jakarta Sans', 'SF Pro Display', -apple-system, sans-serif";
const FONT_B = "'SF Pro Display', 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

// — MOCK DATA —
const AVATARS = [
  "/assets/images/avatars/avatar_01.jpg",
  "/assets/images/avatars/avatar_02.jpg",
  "/assets/images/avatars/avatar_03.jpg",
  "/assets/images/avatars/avatar_04.jpg",
  "/assets/images/avatars/avatar_05.jpeg",
  "/assets/images/avatars/avatar_06.jpg",
  "/assets/images/avatars/avatar_07.jpg",
  "/assets/images/avatars/avatar_08.jpg",
];
const U = [
  { id: 1, name: "Berk Yılmaz", un: "berk26", av: "BY", img: AVATARS[0], matches: 47, follow: true },
  { id: 2, name: "Ali Demir", un: "alidemir", av: "AD", img: AVATARS[1], matches: 32, follow: true },
  { id: 3, name: "Mehmet Kaya", un: "mkaya", av: "MK", img: AVATARS[2], matches: 28, follow: false },
  { id: 4, name: "Emre Çelik", un: "emrecelik", av: "EÇ", img: AVATARS[3], matches: 41, follow: true },
  { id: 5, name: "Can Yıldız", un: "canyildiz", av: "CY", img: AVATARS[4], matches: 19, follow: false },
  { id: 6, name: "Oğuz Han", un: "oguzhan", av: "OH", img: AVATARS[5], matches: 36, follow: false },
  { id: 7, name: "Kerem Aktaş", un: "keremm", av: "KA", img: AVATARS[6], matches: 14, follow: false },
  { id: 8, name: "Burak Şen", un: "buraksen", av: "BŞ", img: AVATARS[7], matches: 22, follow: false },
];
const uf = id => U.find(u => u.id === id);

// Katman 1: Match data (shared, immutable)
const M = [
  { id:1, title:"Kadıköy Halısaha Maçı", date:"25 Şub", time:"20:00", loc:"Kadıköy Spor", fmt:"6v6", sc:[5,3], dur:"1s 20dk", host:1, tA:[1,2,4], tB:[3,5,6], mvp:4 },
  { id:3, title:"Beşiktaş Sahil Maçı", date:"28 Şub", time:"19:00", loc:"Beşiktaş Halısaha", fmt:"7v7", sc:[2,2], dur:"1s 10dk", host:6, tA:[6,3,7], tB:[1,5,8], mvp:6 },
  { id:6, title:"Ataşehir Gece Maçı", date:"22 Şub", time:"21:30", loc:"Ataşehir Arena", fmt:"5v5", sc:[4,1], dur:"55dk", host:3, tA:[3,7,8], tB:[5,6], mvp:3 },
];
const mf = id => M.find(m => m.id === id);

// Katman 2: Posts (per-player, personal)
const P = [
  { id:102, matchId:1, userId:4, caption:"MVP seçilmek güzel hissettirdi", photos:0, status:"visible", date:"25 Şub", likes:12, coms:4, likedByMe:false,
    likers:[1,2,3,5,6,7,8,4],
    comments:[
      {uid:1, text:"Hak ettin MVP'yi 👏", t:"2sa"},
      {uid:3, text:"Skor gerçekçi değil 😂", t:"45dk"},
      {uid:6, text:"Bir daha ne zaman?", t:"30dk"},
      {uid:2, text:"Süper oynadın", t:"20dk"},
    ]},
  { id:101, matchId:1, userId:1, caption:"Ev sahibi olarak güzel bir maçtı!", photos:2, imgs:["/assets/images/posts/sporwave_sample_photo_01.jpeg","/assets/images/posts/sporwave_sample_photo_02.jpeg"], status:"visible", date:"25 Şub", likes:8, coms:3, likedByMe:false,
    likers:[2,4,3,5,6,7,8],
    comments:[
      {uid:2, text:"Harika maçtı, tekrarlayalım! 🔥", t:"2sa"},
      {uid:5, text:"Emre yine fark yarattı", t:"1sa"},
      {uid:4, text:"Teşekkürler herkese 💪", t:"15dk"},
    ]},
  { id:103, matchId:1, userId:2, caption:null, photos:0, status:"visible", date:"25 Şub", likes:4, coms:1, likedByMe:true,
    likers:[1,4,5,6],
    comments:[
      {uid:4, text:"Güzel pas kombinasyonları vardı", t:"3sa"},
    ]},
  { id:201, matchId:3, userId:6, caption:"Berabere ama güzel oyundu, ev sahibi olarak memnunum", photos:0, status:"visible", date:"28 Şub", likes:8, coms:3, likedByMe:true,
    likers:[1,3,7,5,8,2,4,6],
    comments:[
      {uid:1, text:"Tekrarı olsun 🙏", t:"4sa"},
      {uid:7, text:"Savunma sağlamdı", t:"3sa"},
      {uid:3, text:"Güzel sahada oynamak farklı", t:"2sa"},
    ]},
  { id:202, matchId:3, userId:1, caption:"Beşiktaş sahası çok iyiydi", photos:1, imgs:["/assets/images/posts/sporwave_sample_photo_03.jpeg"], status:"visible", date:"28 Şub", likes:5, coms:2, likedByMe:false,
    likers:[6,3,7,2,4],
    comments:[
      {uid:6, text:"Yine bekleriz!", t:"5sa"},
      {uid:2, text:"Sahayı beğendim ben de", t:"4sa"},
    ]},
  { id:301, matchId:6, userId:3, caption:"Host olarak teşekkür ederim herkese, Ataşehir Arena her zamanki gibi mükemmeldi", photos:3, imgs:["/assets/images/posts/sporwave_sample_photo_04.jpeg","/assets/images/posts/sporwave_sample_photo_01.jpeg","/assets/images/posts/sporwave_sample_photo_02.jpeg"], status:"visible", date:"22 Şub", likes:15, coms:5, likedByMe:false,
    likers:[7,8,5,6,1,2,4,3],
    comments:[
      {uid:7, text:"Mehmet abinin maçı 💪", t:"3g"},
      {uid:8, text:"Ataşehir sahası çok iyi", t:"2g"},
      {uid:5, text:"Revanche istiyorum", t:"1g"},
      {uid:6, text:"Güzel maçtı", t:"20sa"},
      {uid:1, text:"Ben de katılmak isterdim", t:"15sa"},
    ]},
  { id:302, matchId:6, userId:7, caption:null, photos:0, status:"visible", date:"22 Şub", likes:6, coms:2, likedByMe:false,
    likers:[3,8,5,6,1,2],
    comments:[
      {uid:3, text:"İyi oynadın", t:"2g"},
      {uid:8, text:"Sıradaki maç ne zaman?", t:"1g"},
    ]},
];

// — SVG ICONS —
const I = {
  search: c => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  bell: c => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  chat: c => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  chevDown: c => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2.5" strokeLinecap="round"><polyline points="6,9 12,15 18,9"/></svg>,
  home: c => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>,
  compass: c => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88"/></svg>,
  heart: c => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"/></svg>,
  heartFill: c => <svg width="18" height="18" viewBox="0 0 24 24" fill={c||T.red} stroke={c||T.red} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"/></svg>,
  comment: c => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>,
  share: c => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16,6 12,2 8,6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>,
  send: c => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/></svg>,
  more: c => <svg width="16" height="16" viewBox="0 0 24 24" fill={c||T.textMuted}><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>,
  star: c => <svg width="14" height="14" viewBox="0 0 24 24" fill={c||T.gold} stroke={c||T.gold} strokeWidth="1"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>,
  football: c => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15 15 0 014 10 15 15 0 01-4 10 15 15 0 01-4-10 15 15 0 014-10z"/><path d="M2 12h20"/></svg>,
  user: c => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 10-16 0"/></svg>,
  plus: c => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  arrowLeft: c => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.text} strokeWidth="2" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12,19 5,12 12,5"/></svg>,
  clock: c => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c||T.textMuted} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>,
  mapPin: c => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c||T.textMuted} strokeWidth="2" strokeLinecap="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>,
  users: c => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c||T.textMuted} strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  empty: c => <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={c||T.textMuted} strokeWidth="1" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M8 15h8"/><circle cx="9" cy="9" r="1" fill={c||T.textMuted}/><circle cx="15" cy="9" r="1" fill={c||T.textMuted}/></svg>,
  noResult: c => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={c||T.textMuted} strokeWidth="1.2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>,
  edit: c => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  eyeOff: c => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  trash: c => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c||T.red} strokeWidth="2" strokeLinecap="round"><polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>,
  flag: c => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>,
};

// — COMPONENTS —
function Av({ i, img, s = 32, c = T.accent, onClick, st }) {
  return <div onClick={onClick} style={{ width:s, height:s, borderRadius:"50%", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", background:`${c}18`, border:"none", color:c, fontSize:s*.34, fontWeight:700, cursor:onClick?"pointer":"default", flexShrink:0, ...st }}>
    {img ? <img src={img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/> : i}
  </div>;
}
function StackAv({ ids, max=3, s=24 }) {
  const vis = ids.slice(0, max);
  return <div style={{ display:"flex" }}>{vis.map((uid,i) => { const u=uf(uid); return u && <div key={uid} style={{ marginLeft:i>0?-8:0, zIndex:max-i, position:"relative" }}><Av i={u.av} img={u.img} s={s}/></div>; })}{ids.length>max && <span style={{ fontSize:10, color:T.textDim, marginLeft:4, fontWeight:600 }}>+{ids.length-max}</span>}</div>;
}
function Badge({ children, c=T.accent }) {
  return <span style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"2px 8px", borderRadius:20, fontSize:11, fontWeight:600, color:c, background:`${c}15`, whiteSpace:"nowrap" }}>{children}</span>;
}
function Btn({ children, primary, small, full, onClick, st }) {
  const [h,setH]=useState(false);
  return <button onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{ padding:small?"6px 16px":"12px 20px", borderRadius:10, border:primary?"none":`1.5px solid ${T.cardBorder}`, background:primary?T.accent:"transparent", color:primary?"#fff":T.text, fontSize:small?12:14, fontWeight:600, cursor:"pointer", width:full?"100%":"auto", transition:"all .2s", transform:h?"translateY(-1px)":"none", display:"flex", alignItems:"center", justifyContent:"center", gap:8, ...st }}>{children}</button>;
}
function InpField({ placeholder, icon, value, onChange, autoFocus }) {
  const [f,setF]=useState(false);
  return <div style={{ display:"flex", alignItems:"center", gap:12, background:T.card, border:`1.5px solid ${f?T.accent:T.cardBorder}`, borderRadius:12, padding:"12px 16px", transition:"all .2s", boxShadow:f?`0 0 0 3px ${T.accent}18`:"none" }}>{icon&&<span style={{ flexShrink:0, display:"flex" }}>{typeof icon==="function"?icon(f?T.accent:T.textDim):icon}</span>}<input placeholder={placeholder} value={value} onChange={onChange} autoFocus={autoFocus} onFocus={()=>setF(true)} onBlur={()=>setF(false)} style={{ background:"none", border:"none", color:T.text, fontSize:14, width:"100%", outline:"none", fontWeight:500 }}/></div>;
}
function TopNav({ mode, setMode, dropOpen, setDropOpen, showActions, onNav }) {
  const [flash, setFlash] = useState(false);
  const handleClick = () => { setFlash(true); setTimeout(()=>setFlash(false), 180); setDropOpen(!dropOpen); };
  return <div style={{ position:"sticky", top:32, zIndex:50, padding:"8px 16px", background:`${T.bg}ee`, backdropFilter:"blur(12px)", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:`1px solid ${T.cardBorder}` }}>
    <div style={{ position:"relative" }}>
      <div onClick={handleClick} style={{ cursor:"pointer", display:"flex", alignItems:"center", gap:8, padding:"8px 0", borderRadius:10, background:"transparent", opacity:flash?0.4:1, transition:"opacity .1s" }}>
        <span style={{ fontWeight:800, fontSize:20, color:T.text, fontFamily:FONT_H }}>{mode==="home"?"Ana Sayfa":"Keşfet"}</span>
        <span style={{ display:"flex", transform:dropOpen?"rotate(180deg)":"none", transition:"transform .2s" }}>{I.chevDown(T.textDim)}</span>
      </div>
      {dropOpen && <div style={{ position:"absolute", top:44, left:0, background:T.card, border:`1px solid ${T.cardBorder}`, borderRadius:12, padding:8, zIndex:60, boxShadow:"0 4px 16px rgba(0,0,0,.1)", minWidth:180 }}>
        {[{id:"home",ic:I.home,l:"Ana Sayfa"},{id:"explore",ic:I.compass,l:"Keşfet"}].map(o=><div key={o.id} onClick={()=>{setMode(o.id);setDropOpen(false);}} style={{ padding:"12px 16px", borderRadius:8, cursor:"pointer", display:"flex", alignItems:"center", gap:12, background:"transparent" }}><span style={{ display:"flex" }}>{o.ic(mode===o.id?T.accent:T.textDim)}</span><span style={{ fontSize:14, fontWeight:mode===o.id?700:500, color:mode===o.id?T.accent:T.text, flex:1 }}>{o.l}</span>{mode===o.id&&<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20,6 9,17 4,12"/></svg>}</div>)}
      </div>}
    </div>
    {showActions && <div style={{ display:"flex", gap:16, alignItems:"center" }}>
      <span onClick={()=>onNav("S07")} style={{ cursor:"pointer", display:"flex" }}>{I.search()}</span>
      <span onClick={()=>window.location.assign("/06_messaging?view=S19")} style={{ cursor:"pointer", display:"flex", position:"relative" }}>{I.bell()}<span style={{ position:"absolute", top:-2, right:-4, width:8, height:8, borderRadius:4, background:T.red }}/></span>
      <span onClick={()=>window.location.assign("/06_messaging")} style={{ cursor:"pointer", display:"flex", position:"relative" }}>{I.chat()}<span style={{ position:"absolute", top:-2, right:-4, width:8, height:8, borderRadius:4, background:T.accent }}/></span>
    </div>}
  </div>;
}
function TabBar({ active, onNav }) {
  const tabs=[{id:"S05",ic:I.home,l:"Ana Sayfa"},{id:"S08",ic:I.football,l:"Maçlar"},{id:"S15",ic:I.user,l:"Profil"}];
  const handleTabClick = (tabId) => {
    if (tabId === "S08") { window.location.assign("/03_matches"); return; }
    if (tabId === "S15") { window.location.assign("/05_profile"); return; }
    onNav(tabId);
  };
  return <div style={{ position:"fixed", bottom:0, left:0, right:0, height:56, background:T.bgAlt, borderTop:`1px solid ${T.cardBorder}`, display:"flex", justifyContent:"space-around", alignItems:"center", zIndex:100, maxWidth:430, margin:"0 auto" }}>
    {tabs.map(t=><div key={t.id} onClick={()=>handleTabClick(t.id)} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, cursor:"pointer", padding:"8px 20px" }}><span style={{ display:"flex" }}>{t.ic(active===t.id?T.accent:T.textMuted)}</span><span style={{ fontSize:10, fontWeight:active===t.id?700:500, color:active===t.id?T.accent:T.textMuted }}>{t.l}</span></div>)}
  </div>;
}

// — MEDIA SLIDER (foto sayfaları + son sayfa scoreboard) —
function MediaSlider({ photoCount, imgs, scoreContent, onMatchNav }) {
  const total = photoCount + 1; // her fotoğraf 1 sayfa, son sayfa scoreboard
  const [cur, setCur] = useState(0);
  const prev = () => setCur(c => Math.max(0, c - 1));
  const next = () => setCur(c => Math.min(total - 1, c + 1));
  const isScore = cur === total - 1;

  return <div style={{ position:"relative", overflow:"hidden", height:430 }}>
    {/* Slides */}
    <div style={{ display:"flex", height:"100%", width:`${total * 100}%`, transform:`translateX(-${cur * (100/total)}%)`, transition:"transform .28s ease" }}>
      {Array.from({length:photoCount}, (_, i) => (
        <div key={i} style={{ width:`${100/total}%`, height:430, flexShrink:0, background:T.bgAlt }}>
          {imgs[i]
            ? <img src={imgs[i]} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
            : <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:40, color:T.textMuted }}>📷</div>
          }
        </div>
      ))}
      {/* Scoreboard slide */}
      <div onClick={onMatchNav} style={{ width:`${100/total}%`, height:430, borderTop:`2px solid ${T.bgAlt}`, borderBottom:`2px solid ${T.bgAlt}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, cursor:"pointer" }}>
        {scoreContent}
      </div>
    </div>

    {/* Sol / Sağ tap alanları */}
    {cur > 0 && <div onClick={prev} style={{ position:"absolute", left:0, top:0, bottom:32, width:"35%", cursor:"pointer" }}/>}
    {cur < total - 1 && <div onClick={next} style={{ position:"absolute", right:0, top:0, bottom:32, width:"35%", cursor:"pointer" }}/>}

    {/* Sayaç */}
    <div style={{ position:"absolute", top:10, right:10, background:"rgba(0,0,0,.6)", borderRadius:20, padding:"3px 9px", fontSize:11, color:"#fff", fontWeight:600 }}>
      {isScore ? "📊" : `${cur+1}/${photoCount}`}
    </div>

    {/* Dot indicator */}
    <div style={{ position:"absolute", bottom:10, left:0, right:0, display:"flex", justifyContent:"center", gap:5 }}>
      {Array.from({length:total}, (_, i) => (
        <div key={i} onClick={() => setCur(i)} style={{ width:i===cur?16:6, height:6, borderRadius:3, background:i===cur?T.accent:i===total-1?`${T.accent}55`:`${T.text}33`, transition:"all .2s", cursor:"pointer" }}/>
      ))}
    </div>
  </div>;
}

// — POST CARD (replaces MatchCard) —
function PostCard({ post: p, onNav }) {
  const [liked,setLiked]=useState(p.likedByMe);
  const [lc,setLc]=useState(p.likes);
  const [menuOpen,setMenuOpen]=useState(false);
  const owner=uf(p.userId);
  const m=mf(p.matchId);
  const all=[...(m?.tA||[]),...(m?.tB||[])];
  const others=all.filter(uid=>uid!==p.userId);
  const mvp=m?uf(m.mvp):null;
  const firstLiker=p.likers?.[0]?uf(p.likers[0]):null;
  const visComments=(p.comments||[]).slice(0,2);
  const isOwn=p.userId===1;

  const toggleLike=e=>{e.stopPropagation();setLiked(!liked);setLc(c=>liked?c-1:c+1);};

  const scoreOnly = m?.sc ? <div style={{ textAlign:"center" }}>
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
      <span style={{ fontSize:11, color:T.textDim, marginRight:12 }}>Takım A</span>
      <span style={{ fontSize:38, fontWeight:900, letterSpacing:"-2px", fontFamily:FONT_H }}>
        <span style={{ color:T.text }}>{m.sc[0]}</span>
        <span style={{ color:T.textMuted, margin:"0 8px", fontSize:20 }}>–</span>
        <span style={{ color:T.text }}>{m.sc[1]}</span>
      </span>
      <span style={{ fontSize:11, color:T.textDim, marginLeft:12 }}>Takım B</span>
    </div>
    {mvp && <div onClick={e=>{e.stopPropagation();onNav("S16",mvp.id);}} style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:4, marginTop:8, cursor:"pointer" }}>
      {I.star(T.accent)} <span style={{ fontSize:12, color:T.accent, fontWeight:600 }}>{mvp.name}</span>
    </div>}
  </div> : null;

  return <div style={{ background:"none", borderRadius:0, overflow:"hidden", position:"relative" }}>
    {/* Header — single post owner */}
    <div style={{ padding:"16px 16px 0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, flex:1 }}>
        <Av i={owner.av} img={owner.img} s={36} onClick={()=>onNav("S16",owner.id)}/>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span onClick={()=>onNav("S16",owner.id)} style={{ fontWeight:700, fontSize:14, color:T.text, cursor:"pointer" }}>{owner.name}</span>
            {isOwn && <Badge c={T.accent}>Sen</Badge>}
          </div>
          <div style={{ fontSize:12, color:T.textMuted, marginTop:2 }}>@{owner.un} · {p.date}</div>
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        {!isOwn && <span onClick={()=>{}} style={{ cursor:"pointer", fontSize:13, fontWeight:700, color:T.accent }}>Takip Et</span>}
        <div style={{ position:"relative" }}>
          <span onClick={()=>setMenuOpen(!menuOpen)} style={{ cursor:"pointer", display:"flex", padding:4 }}>{I.more()}</span>
          {menuOpen && <div style={{ position:"absolute", top:28, right:0, background:T.card, border:`1px solid ${T.cardBorder}`, borderRadius:12, padding:8, zIndex:60, boxShadow:"0 4px 16px rgba(0,0,0,.1)", minWidth:160 }}>
            {isOwn ? <>
              <div onClick={()=>setMenuOpen(false)} style={{ padding:"12px 16px", borderRadius:8, cursor:"pointer", display:"flex", alignItems:"center", gap:12 }}><span style={{ display:"flex" }}>{I.edit()}</span><span style={{ fontSize:13, color:T.text }}>Düzenle</span></div>
              <div onClick={()=>setMenuOpen(false)} style={{ padding:"12px 16px", borderRadius:8, cursor:"pointer", display:"flex", alignItems:"center", gap:12 }}><span style={{ display:"flex" }}>{I.eyeOff()}</span><span style={{ fontSize:13, color:T.text }}>Gizle</span></div>
              <div onClick={()=>setMenuOpen(false)} style={{ padding:"12px 16px", borderRadius:8, cursor:"pointer", display:"flex", alignItems:"center", gap:12 }}><span style={{ display:"flex" }}>{I.trash()}</span><span style={{ fontSize:13, color:T.red }}>Sil</span></div>
            </> : <>
              <div onClick={()=>setMenuOpen(false)} style={{ padding:"12px 16px", borderRadius:8, cursor:"pointer", display:"flex", alignItems:"center", gap:12 }}><span style={{ display:"flex" }}>{I.flag()}</span><span style={{ fontSize:13, color:T.text }}>Raporla</span></div>
              <div onClick={()=>setMenuOpen(false)} style={{ padding:"12px 16px", borderRadius:8, cursor:"pointer", display:"flex", alignItems:"center", gap:12 }}><span style={{ display:"flex" }}>{I.eyeOff()}</span><span style={{ fontSize:13, color:T.text }}>Engelle</span></div>
            </>}
          </div>}
        </div>
      </div>
    </div>

    {/* Title + Caption + Meta + Score — tıklanabilir alan */}
    <div onClick={()=>m&&window.location.assign("/04_match_detail?view=S11")} style={{ cursor:m?"pointer":"default" }}>
      {/* Title */}
      {m && <div style={{ padding:"12px 16px 0", fontWeight:700, fontSize:16, color:T.text, fontFamily:FONT_H }}>{m.title}</div>}

      {/* Caption */}
      {p.caption && <div style={{ padding:"6px 16px 0", fontSize:14, color:T.textDim, lineHeight:1.5 }}>{p.caption}</div>}

      {/* Meta */}
      {m && <div style={{ padding:"8px 16px 0", display:"flex", gap:12, fontSize:12, color:T.textDim, alignItems:"center", flexWrap:"wrap" }}>
        <span style={{ display:"flex", alignItems:"center", gap:4 }}>{I.clock()} {m.dur}</span>
        <span style={{ display:"flex", alignItems:"center", gap:4 }}>{I.mapPin()} {m.loc?.split(" ")[0]}</span>
        <Badge c={T.textDim}>{m.fmt}</Badge>
        <span style={{ display:"flex", alignItems:"center", gap:4 }}>{I.users()} {all.length}</span>
      </div>}

      {/* Scoreboard / Photo area */}
      <div style={{ marginTop:12 }}>
        {p.photos>0
          ? <MediaSlider photoCount={p.photos} imgs={p.imgs||[]} scoreContent={scoreOnly} onMatchNav={()=>m&&window.location.assign("/04_match_detail?view=S11")}/>
          : <div style={{ borderTop:`2px solid ${T.bgAlt}`, borderBottom:`2px solid ${T.bgAlt}`, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px 16px" }}>
              {scoreOnly}
            </div>
        }
      </div>
    </div>

    {/* Likers */}
    {lc>0 && <div style={{ padding:"8px 16px 0", fontSize:12, color:T.textDim, display:"flex", alignItems:"center", gap:8, marginTop:8 }}>
      <StackAv ids={(p.likers||[]).slice(0,3)} s={20}/>
      <span>
        <b onClick={()=>onNav("S16",firstLiker?.id)} style={{ color:T.text, cursor:"pointer" }}>{liked?"Sen":firstLiker?.name?.split(" ")[0]}</b>
        {lc>1 && <span onClick={()=>onNav("S43",p.id)} style={{ cursor:"pointer" }}> ve <b style={{ color:T.text }}>{lc-1} diğer kişiler beğendi</b></span>}
      </span>
    </div>}

    {/* Interaction row */}
    <div style={{ padding:"12px 16px 0", display:"flex", gap:20, alignItems:"center" }}>
      <div onClick={toggleLike} style={{ display:"flex", alignItems:"center", gap:4, cursor:"pointer", fontSize:13, color:liked?T.red:T.textDim, fontWeight:liked?600:400 }}>
        {liked?I.heartFill():I.heart()} {lc}
      </div>
      <div onClick={e=>{e.stopPropagation();onNav("S42",p.id);}} style={{ display:"flex", alignItems:"center", gap:4, cursor:"pointer", fontSize:13, color:T.textDim }}>
        {I.comment()} {p.coms}
      </div>
      <div style={{ display:"flex", alignItems:"center", cursor:"pointer" }}>
        {I.share()}
      </div>
    </div>

    {/* Comments — max 2 */}
    {visComments.length>0 && <div style={{ padding:"8px 16px 0" }}>
      {visComments.map((c,i)=>{const cu=uf(c.uid);return cu&&<div key={i} style={{ display:"flex", gap:8, alignItems:"flex-start", marginBottom:8 }}>
        <Av i={cu.av} img={cu.img} s={24} onClick={()=>onNav("S16",cu.id)}/>
        <div style={{ fontSize:14 }}>
          <span onClick={()=>onNav("S16",cu.id)} style={{ fontWeight:600, color:T.text, cursor:"pointer" }}>{cu.un}</span>
          <span style={{ color:T.textMuted, marginLeft:8 }}>{c.t}</span>
          <div style={{ color:T.textDim, marginTop:2, lineHeight:1.5 }}>{c.text}</div>
        </div>
      </div>;})}
    </div>}

    {/* Add comment */}
    <div onClick={()=>onNav("S42",p.id)} style={{ padding:"12px 16px 16px", display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}>
      <Av i="BY" img={AVATARS[0]} s={24}/>
      <span style={{ fontSize:13, color:T.textMuted }}>Bir yorum ekle...</span>
    </div>
  </div>;
}

// — EMPTY STATE —
function Empty({ icon, title, desc, action, onAction }) {
  return <div style={{ textAlign:"center", padding:"48px 24px" }}>
    <div style={{ marginBottom:16, display:"flex", justifyContent:"center", opacity:.6 }}>{icon}</div>
    <div style={{ fontSize:16, fontWeight:700, color:T.text, marginBottom:8, fontFamily:FONT_H }}>{title}</div>
    <div style={{ fontSize:13, color:T.textDim, marginBottom:20, lineHeight:1.5, maxWidth:260, margin:"0 auto 20px" }}>{desc}</div>
    {action&&<Btn primary onClick={onAction}>{action}</Btn>}
  </div>;
}

// — PAGES —

// S05: Feed (post-based)
function S05({ onNav, mode, setMode }) {
  const feed = mode==="home"
    ? P.filter(p=>p.status==="visible"&&uf(p.userId)?.follow)
    : [...P].filter(p=>p.status==="visible").sort((a,b)=>(b.likes+b.coms*2)-(a.likes+a.coms*2));
  const hRef=useRef(null);
  const drag=useRef({on:false,x:0,sl:0});
  const onMD=e=>{drag.current={on:true,x:e.pageX-hRef.current.offsetLeft,sl:hRef.current.scrollLeft};hRef.current.style.cursor="grabbing";};
  const onMU=()=>{drag.current.on=false;if(hRef.current)hRef.current.style.cursor="grab";};
  const onMM=e=>{if(!drag.current.on)return;e.preventDefault();hRef.current.scrollLeft=drag.current.sl-(e.pageX-hRef.current.offsetLeft-drag.current.x);};

  return <div style={{ paddingBottom:80 }}>
    <div>
      {feed.length>0 ? <>
        {/* İlk post */}
        <PostCard post={feed[0]} onNav={onNav}/>
        {mode==="explore"&&<div style={{height:8,background:T.bgAlt}}/>}
        {/* Önerilen Kullanıcılar — ilk posttan sonra, sadece Keşfet modunda */}
        {mode==="explore"&&<div style={{padding:"16px 16px 16px"}}>
          <div style={{fontSize:11,fontWeight:700,color:T.textMuted,marginBottom:12,textTransform:"uppercase",letterSpacing:.5}}>Önerilen Kullanıcılar</div>
          <div ref={hRef} className="sw-hscroll" onMouseDown={onMD} onMouseUp={onMU} onMouseLeave={onMU} onMouseMove={onMM} style={{display:"flex",gap:12,overflowX:"auto",paddingBottom:4,cursor:"grab",userSelect:"none"}}>
            {U.filter(u=>!u.follow&&u.id!==1).slice(0,5).map(u=><div key={u.id} onClick={()=>onNav("S16",u.id)} style={{minWidth:104,background:T.card,borderRadius:16,padding:"16px 14px",textAlign:"center",border:`1px solid ${T.cardBorder}`,cursor:"pointer",flexShrink:0}}>
              <Av i={u.av} img={u.img} s={52} st={{margin:"0 auto"}}/>
              <div style={{fontSize:13,fontWeight:600,color:T.text,marginTop:10}}>{u.name.split(" ")[0]}</div>
              <div style={{fontSize:11,color:T.textDim,marginTop:2}}>@{u.un}</div>
              <div style={{marginTop:10,fontSize:11,fontWeight:700,color:T.accent,display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>{I.plus(T.accent)} Takip Et</div>
            </div>)}
          </div>
        </div>}
        {/* Kalan postlar */}
        {feed.slice(1).map(p=><>
          <div key={`div-${p.id}`} style={{height:8,background:T.bgAlt}}/>
          <PostCard key={p.id} post={p} onNav={onNav}/>
        </>)}
      </> :
        <Empty icon={I.empty()} title="Henüz kimseyi takip etmiyorsun" desc="Takip ettiğin kişilerin postları burada görünecek" action="Keşfet'e Git" onAction={()=>setMode("explore")}/>}
    </div>
  </div>;
}

// S07: Search
function S07({ onNav }) {
  const [q,setQ]=useState("");
  const res=q.length>0?U.filter(u=>u.name.toLowerCase().includes(q.toLowerCase())||u.un.includes(q.toLowerCase())):[];
  return <div style={{ padding:"0 16px 100px" }}>
    <div style={{ padding:"12px 0", display:"flex", alignItems:"center", gap:12 }}>
      <span onClick={()=>onNav("S05")} style={{ cursor:"pointer", display:"flex" }}>{I.arrowLeft()}</span>
      <div style={{ flex:1 }}><InpField placeholder="Kullanıcı ara..." icon={I.search} value={q} onChange={e=>setQ(e.target.value)} autoFocus/></div>
    </div>
    {q.length===0&&<div>
      <div style={{ fontSize:11, fontWeight:700, color:T.textMuted, marginBottom:12, textTransform:"uppercase", letterSpacing:.5 }}>Önerilen Kullanıcılar</div>
      {U.filter(u=>!u.follow&&u.id!==1).map(u=><div key={u.id} onClick={()=>onNav("S16",u.id)} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:`1px solid ${T.cardBorder}`, cursor:"pointer" }}>
        <Av i={u.av} img={u.img} s={44}/>
        <div style={{ flex:1 }}><div style={{ fontWeight:600, fontSize:14, color:T.text }}>{u.name}</div><div style={{ fontSize:12, color:T.textDim }}>@{u.un} · {u.matches} maç</div></div>
        <Btn small primary>Takip Et</Btn>
      </div>)}
    </div>}
    {q.length>0&&res.length===0&&<Empty icon={I.noResult()} title="Kullanıcı bulunamadı" desc={`"${q}" ile eşleşen kullanıcı yok`}/>}
    {res.map(u=><div key={u.id} onClick={()=>onNav("S16",u.id)} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:`1px solid ${T.cardBorder}`, cursor:"pointer" }}>
      <Av i={u.av} img={u.img} s={44}/>
      <div style={{ flex:1 }}><div style={{ fontWeight:600, fontSize:14, color:T.text }}>{u.name}</div><div style={{ fontSize:12, color:T.textDim }}>@{u.un} · {u.matches} maç</div></div>
      <Btn small primary>{u.follow?"✓ Takip":"Takip Et"}</Btn>
    </div>)}
  </div>;
}

// S42: Comments Page (post-based)
function S42({ onNav, postId }) {
  const p=P.find(x=>x.id===postId)||P[0];
  const owner=uf(p.userId);
  const m=mf(p.matchId);
  const all=[...(m?.tA||[]),...(m?.tB||[])];
  const mvp=m?uf(m.mvp):null;
  const firstLiker=p.likers?.[0]?uf(p.likers[0]):null;
  const [liked,setLiked]=useState(p.likedByMe);
  const [lc,setLc]=useState(p.likes);
  const toggleLike=()=>{setLiked(!liked);setLc(c=>liked?c-1:c+1);};

  return <div style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 45px)" }}>
    {/* Top bar */}
    <div style={{ padding:"12px 16px", display:"flex", alignItems:"center", gap:12, borderBottom:`1px solid ${T.cardBorder}`, flexShrink:0 }}>
      <span onClick={()=>onNav("S05")} style={{ cursor:"pointer", display:"flex" }}>{I.arrowLeft()}</span>
      <span style={{ fontSize:16, fontWeight:700, color:T.text, fontFamily:FONT_H }}>Yorumlar</span>
    </div>

    {/* Scrollable content */}
    <div style={{ flex:1, overflowY:"auto" }}>
    {/* Post summary — feed kartıyla aynı stil */}
    <div style={{ borderBottom:`1px solid ${T.cardBorder}` }}>
      {/* Header */}
      <div style={{ padding:"16px 16px 0", display:"flex", alignItems:"center", gap:12 }}>
        <Av i={owner.av} img={owner.img} s={36} onClick={()=>onNav("S16",owner.id)}/>
        <div>
          <span onClick={()=>onNav("S16",owner.id)} style={{ fontWeight:700, fontSize:14, color:T.text, cursor:"pointer" }}>{owner.name}</span>
          <div style={{ fontSize:12, color:T.textMuted, marginTop:2 }}>@{owner.un} · {p.date}</div>
        </div>
      </div>

      {/* Title + Caption + Meta + Score — tıklanabilir alan → S11 */}
      <div onClick={()=>m&&window.location.assign("/04_match_detail?view=S11")} style={{ cursor:m?"pointer":"default" }}>
      {/* Title */}
      {m && <div style={{ padding:"12px 16px 0", fontWeight:700, fontSize:16, color:T.text, fontFamily:FONT_H }}>{m.title}</div>}

      {/* Caption */}
      {p.caption && <div style={{ padding:"6px 16px 0", fontSize:14, color:T.textDim, lineHeight:1.5 }}>{p.caption}</div>}

      {/* Meta */}
      {m && <div style={{ padding:"8px 16px 0", display:"flex", gap:12, fontSize:12, color:T.textDim, alignItems:"center", flexWrap:"wrap" }}>
        <span style={{ display:"flex", alignItems:"center", gap:4 }}>{I.clock()} {m.dur}</span>
        <span style={{ display:"flex", alignItems:"center", gap:4 }}>{I.mapPin()} {m.loc?.split(" ")[0]}</span>
        <Badge c={T.textDim}>{m.fmt}</Badge>
        <span style={{ display:"flex", alignItems:"center", gap:4 }}>{I.users()} {all.length}</span>
      </div>}

      {/* Score */}
      {m?.sc && <div style={{ marginTop:12, borderTop:`2px solid ${T.bgAlt}`, borderBottom:`2px solid ${T.bgAlt}`, padding:"20px 16px", textAlign:"center" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
          <span style={{ fontSize:11, color:T.textDim, marginRight:12 }}>Takım A</span>
          <span style={{ fontSize:38, fontWeight:900, letterSpacing:"-2px", fontFamily:FONT_H }}>
            <span style={{ color:T.text }}>{m.sc[0]}</span>
            <span style={{ color:T.textMuted, margin:"0 8px", fontSize:20 }}>–</span>
            <span style={{ color:T.text }}>{m.sc[1]}</span>
          </span>
          <span style={{ fontSize:11, color:T.textDim, marginLeft:12 }}>Takım B</span>
        </div>
        {mvp && <div onClick={e=>{e.stopPropagation();onNav("S16",mvp.id);}} style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:4, marginTop:8, cursor:"pointer" }}>
          {I.star(T.accent)} <span style={{ fontSize:12, color:T.accent, fontWeight:600 }}>{mvp.name}</span>
        </div>}
      </div>}
      </div>

      {/* Likers */}
      {lc>0 && <div style={{ padding:"8px 16px 0", fontSize:12, color:T.textDim, display:"flex", alignItems:"center", gap:8, marginTop:8 }}>
        <StackAv ids={(p.likers||[]).slice(0,3)} s={20}/>
        <span>
          <b onClick={()=>onNav("S16",firstLiker?.id)} style={{ color:T.text, cursor:"pointer" }}>{liked?"Sen":firstLiker?.name?.split(" ")[0]}</b>
          {lc>1 && <span onClick={()=>onNav("S43",p.id)} style={{ cursor:"pointer" }}> ve <b style={{ color:T.text }}>{lc-1} diğer kişiler beğendi</b></span>}
        </span>
      </div>}

      {/* Interaction row */}
      <div style={{ padding:"12px 16px", display:"flex", gap:20, alignItems:"center" }}>
        <div onClick={toggleLike} style={{ display:"flex", alignItems:"center", gap:4, cursor:"pointer", fontSize:13, color:liked?T.red:T.textDim, fontWeight:liked?600:400 }}>
          {liked?I.heartFill():I.heart()} {lc}
        </div>
        <span style={{ fontSize:13, color:T.textDim, display:"flex", alignItems:"center", gap:4 }}>
          {I.comment()} {p.coms}
        </span>
        <div style={{ display:"flex", alignItems:"center", cursor:"pointer" }}>
          {I.share()}
        </div>
      </div>
    </div>

    {/* All comments */}
    <div style={{ padding:"12px 16px" }}>
      {(p.comments||[]).map((c,i)=>{const cu=uf(c.uid);return cu&&<div key={i} style={{ display:"flex", gap:12, marginBottom:16, alignItems:"flex-start" }}>
        <Av i={cu.av} img={cu.img} s={32} onClick={()=>onNav("S16",cu.id)}/>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span onClick={()=>onNav("S16",cu.id)} style={{ fontWeight:600, fontSize:14, color:T.text, cursor:"pointer" }}>{cu.un}</span>
            <span style={{ fontSize:12, color:T.textMuted }}>{c.t}</span>
          </div>
          <div style={{ fontSize:14, color:T.textDim, marginTop:4, lineHeight:1.5 }}>{c.text}</div>
        </div>
      </div>;})}
    </div>
    </div>{/* end scrollable */}

    {/* Input bar — bottom */}
    <div style={{ flexShrink:0, background:T.bgAlt, borderTop:`1px solid ${T.cardBorder}`, padding:"12px 16px", display:"flex", alignItems:"center", gap:12 }}>
      <Av i="BY" img={AVATARS[0]} s={28}/>
      <div style={{ flex:1, background:T.card, borderRadius:20, padding:"8px 16px", display:"flex", alignItems:"center" }}>
        <input placeholder="Bir yorum ekle..." style={{ background:"none", border:"none", color:T.text, fontSize:14, width:"100%", outline:"none" }}/>
      </div>
      <span style={{ cursor:"pointer", display:"flex" }}>{I.send()}</span>
    </div>
  </div>;
}

// S43: Likes Page (post-based)
function S43({ onNav, postId }) {
  const p=P.find(x=>x.id===postId)||P[0];
  const [q,setQ]=useState("");
  const likers=(p.likers||[]).map(uid=>uf(uid)).filter(Boolean);
  const filtered=q?likers.filter(u=>u.name.toLowerCase().includes(q.toLowerCase())||u.un.includes(q.toLowerCase())):likers;

  return <div style={{ paddingBottom:20 }}>
    <div style={{ padding:"12px 16px", display:"flex", alignItems:"center", gap:12, borderBottom:`1px solid ${T.cardBorder}` }}>
      <span onClick={()=>onNav("S05")} style={{ cursor:"pointer", display:"flex" }}>{I.arrowLeft()}</span>
      <span style={{ fontSize:16, fontWeight:700, color:T.text, fontFamily:FONT_H }}>Beğeniler</span>
    </div>
    <div style={{ padding:"12px 16px" }}>
      <InpField placeholder="Kullanıcı adı ara" icon={I.search} value={q} onChange={e=>setQ(e.target.value)}/>
    </div>
    <div style={{ padding:"0 16px" }}>
      {filtered.map(u=><div key={u.id} onClick={()=>onNav("S16",u.id)} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:`1px solid ${T.cardBorder}`, cursor:"pointer" }}>
        <Av i={u.av} img={u.img} s={44}/>
        <div style={{ flex:1 }}><div style={{ fontWeight:600, fontSize:14, color:T.text }}>{u.un}</div><div style={{ fontSize:12, color:T.textDim }}>{u.name}</div></div>
        <Btn small primary>{u.follow?"Takip Ediliyor":"Takip Et"}</Btn>
      </div>)}
    </div>
  </div>;
}

// ============================================================
// MAIN
// ============================================================
export default function SporWaveFeed() {
  const [cur,setCur]=useState("S05");
  const [curId,setCurId]=useState(null);
  const [fade,setFade]=useState(true);
  const [mode,setMode]=useState("home");
  const [drop,setDrop]=useState(false);

  useEffect(()=>{
    if(!document.querySelector('link[href*="Plus+Jakarta+Sans"]')){const l=document.createElement("link");l.href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap";l.rel="stylesheet";document.head.appendChild(l);}
    if(!document.querySelector('#sw-scroll-style')){const s=document.createElement("style");s.id="sw-scroll-style";s.textContent=`.sw-hscroll::-webkit-scrollbar{display:none}.sw-hscroll{scrollbar-width:none;-ms-overflow-style:none}`;document.head.appendChild(s);}
  },[]);

  const nav=(p,id)=>{setFade(false);setTimeout(()=>{setCur(p);setCurId(id||null);setFade(true);setDrop(false);},120);};

  const pg=()=>{
    switch(cur){
      case "S05": return <S05 onNav={nav} mode={mode} setMode={setMode} dropOpen={drop} setDropOpen={setDrop}/>;
      case "S07": return <S07 onNav={nav}/>;
      case "S42": return <S42 onNav={nav} postId={curId}/>;
      case "S43": return <S43 onNav={nav} postId={curId}/>;
      default: return <S05 onNav={nav} mode={mode} setMode={setMode} dropOpen={drop} setDropOpen={setDrop}/>;
    }
  };

  const showActions=cur==="S05";
  const showNav=cur==="S05";
  const showTabs=cur==="S05";

  return <div style={{ maxWidth:430, margin:"0 auto", minHeight:"100vh", background:T.bg, color:T.text, fontFamily:FONT_B, position:"relative", boxShadow:"0 0 40px rgba(0,0,0,.08)" }}>
    {/* Dev ribbon */}
    <div style={{ position:"sticky", top:0, zIndex:200, background:T.bgAlt, borderBottom:`1px solid ${T.cardBorder}`, padding:"8px 8px", display:"flex", gap:4 }}>
      {[{p:"S05",l:"Feed"},{p:"S07",l:"Arama"},{p:"S42",l:"Yorumlar",id:101},{p:"S43",l:"Beğeniler",id:101}].map(n=><span key={n.p} onClick={()=>nav(n.p,n.id)} style={{ padding:"4px 12px", borderRadius:8, fontSize:11, fontWeight:600, background:cur===n.p?T.accent:`${T.textDim}22`, color:cur===n.p?"#fff":T.textDim, cursor:"pointer" }}>{n.l}</span>)}
    </div>
    {showNav&&<TopNav mode={mode} setMode={setMode} dropOpen={drop} setDropOpen={setDrop} showActions={showActions} onNav={nav}/>}
    <div style={{ opacity:fade?1:0, transform:fade?"translateY(0)":"translateY(8px)", transition:"all .12s ease" }}>{pg()}</div>
    {showTabs&&<TabBar active="S05" onNav={nav}/>}
  </div>;
}
