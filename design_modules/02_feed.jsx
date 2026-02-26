import { useState, useEffect } from "react";

// ============================================================
// SPORWAVE MODULE 2 v2 — Feed & Search (S05, S07, S33, S42, S43)
// TopNav: no logo, dropdown left, icons only on home, sticky
// Match card: no team avatars on score, MVP under score, max 2 comments
// New pages: S42 Comments, S43 Likes
// ============================================================

const T = {
  accent: "#B7F000", bg: "#0B0F14", bgAlt: "#060810",
  card: "#141A22", cardBorder: "#1E2730",
  text: "#F0F2F5", textDim: "#8A95A5", textMuted: "#5A6577",
  red: "#FF4757", green: "#2ED573", orange: "#FF8C42", gold: "#FFD700",
};
const FONT_H = "'Plus Jakarta Sans', 'SF Pro Display', -apple-system, sans-serif";
const FONT_B = "'SF Pro Display', 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

// — MOCK DATA —
const U = [
  { id: 1, name: "Berk Yılmaz", un: "berk26", av: "BY", matches: 47, follow: true },
  { id: 2, name: "Ali Demir", un: "alidemir", av: "AD", matches: 32, follow: true },
  { id: 3, name: "Mehmet Kaya", un: "mkaya", av: "MK", matches: 28, follow: false },
  { id: 4, name: "Emre Çelik", un: "emrecelik", av: "EÇ", matches: 41, follow: true },
  { id: 5, name: "Can Yıldız", un: "canyildiz", av: "CY", matches: 19, follow: false },
  { id: 6, name: "Oğuz Han", un: "oguzhan", av: "OH", matches: 36, follow: false },
  { id: 7, name: "Kerem Aktaş", un: "keremm", av: "KA", matches: 14, follow: false },
  { id: 8, name: "Burak Şen", un: "buraksen", av: "BŞ", matches: 22, follow: false },
];
const uf = id => U.find(u => u.id === id);

const M = [
  { id:1, title:"Kadıköy Halısaha Maçı", date:"25 Şub", time:"20:00", loc:"Kadıköy Spor", fmt:"6v6", sc:[5,3], dur:"1s 20dk", host:1, tA:[1,2,4], tB:[3,5,6], mvp:4, likes:12, coms:5, shares:2, photos:2, likedByMe:false,
    likers:[2,3,5,6,7,8,4,1],
    comments:[
      {uid:2, text:"Harika maçtı, tekrarlayalım! 🔥", t:"2sa"},
      {uid:5, text:"Emre yine fark yarattı", t:"1sa"},
      {uid:3, text:"Skor gerçekçi değil 😂", t:"45dk"},
      {uid:6, text:"Bir daha ne zaman?", t:"30dk"},
      {uid:4, text:"Teşekkürler herkese 💪", t:"15dk"},
    ]},
  { id:3, title:"Beşiktaş Sahil Maçı", date:"28 Şub", time:"19:00", loc:"Beşiktaş Halısaha", fmt:"7v7", sc:[2,2], dur:"1s 10dk", host:6, tA:[6,3,7], tB:[1,5,8], mvp:6, likes:8, coms:3, shares:1, photos:0, likedByMe:true,
    likers:[1,6,3,7,5,8,2,4],
    comments:[
      {uid:6, text:"Berabere ama güzel oyundu", t:"5sa"},
      {uid:1, text:"Tekrarı olsun 🙏", t:"4sa"},
      {uid:7, text:"Savunma sağlamdı", t:"3sa"},
    ]},
  { id:6, title:"Ataşehir Gece Maçı", date:"22 Şub", time:"21:30", loc:"Ataşehir Arena", fmt:"5v5", sc:[4,1], dur:"55dk", host:3, tA:[3,7,8], tB:[5,6], mvp:3, likes:15, coms:7, shares:4, photos:3, likedByMe:false,
    likers:[3,7,8,5,6,1,2,4],
    comments:[
      {uid:7, text:"Mehmet abinin maçı 💪", t:"3g"},
      {uid:8, text:"Ataşehir sahası çok iyi", t:"2g"},
      {uid:5, text:"Revanche istiyorum", t:"1g"},
      {uid:6, text:"Güzel maçtı", t:"20sa"},
      {uid:3, text:"Host olarak teşekkür ederim herkese", t:"18sa"},
      {uid:1, text:"Ben de katılmak isterdim", t:"15sa"},
      {uid:2, text:"Sıradaki maç ne zaman?", t:"10sa"},
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
};

// — COMPONENTS —
function Av({ i, s = 32, c = T.accent, onClick, st }) {
  return <div onClick={onClick} style={{ width:s, height:s, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", background:`${c}18`, border:`1.5px solid ${c}44`, color:c, fontSize:s*.34, fontWeight:700, cursor:onClick?"pointer":"default", flexShrink:0, ...st }}>{i}</div>;
}
function StackAv({ ids, max=3, s=24 }) {
  const vis = ids.slice(0, max);
  return <div style={{ display:"flex" }}>{vis.map((uid,i) => { const u=uf(uid); return u && <div key={uid} style={{ marginLeft:i>0?-8:0, zIndex:max-i, position:"relative" }}><Av i={u.av} s={s}/></div>; })}{ids.length>max && <span style={{ fontSize:10, color:T.textDim, marginLeft:4, fontWeight:600 }}>+{ids.length-max}</span>}</div>;
}
function Badge({ children, c=T.accent }) {
  return <span style={{ display:"inline-flex", alignItems:"center", gap:3, padding:"2px 8px", borderRadius:20, fontSize:11, fontWeight:600, color:c, background:`${c}15`, whiteSpace:"nowrap" }}>{children}</span>;
}
function Btn({ children, primary, small, full, onClick, st }) {
  const [h,setH]=useState(false);
  return <button onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{ padding:small?"6px 14px":"12px 20px", borderRadius:10, border:primary?"none":`1.5px solid ${T.cardBorder}`, background:primary?T.accent:"transparent", color:primary?T.bg:T.text, fontSize:small?12:14, fontWeight:600, cursor:"pointer", width:full?"100%":"auto", transition:"all .2s", transform:h?"translateY(-1px)":"none", display:"flex", alignItems:"center", justifyContent:"center", gap:6, ...st }}>{children}</button>;
}
function InpField({ placeholder, icon, value, onChange, autoFocus }) {
  const [f,setF]=useState(false);
  return <div style={{ display:"flex", alignItems:"center", gap:10, background:T.card, border:`1.5px solid ${f?T.accent:T.cardBorder}`, borderRadius:12, padding:"10px 14px", transition:"all .2s", boxShadow:f?`0 0 0 3px ${T.accent}18`:"none" }}>{icon&&<span style={{ flexShrink:0, display:"flex" }}>{typeof icon==="function"?icon(f?T.accent:T.textDim):icon}</span>}<input placeholder={placeholder} value={value} onChange={onChange} autoFocus={autoFocus} onFocus={()=>setF(true)} onBlur={()=>setF(false)} style={{ background:"none", border:"none", color:T.text, fontSize:14, width:"100%", outline:"none", fontWeight:500 }}/></div>;
}
function TopNav({ mode, setMode, dropOpen, setDropOpen, showActions, onNav }) {
  return <div style={{ position:"sticky", top:32, zIndex:50, padding:"8px 16px", background:`${T.bg}ee`, backdropFilter:"blur(12px)", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:`1px solid ${T.cardBorder}22` }}>
    <div style={{ position:"relative" }}>
      <div onClick={()=>setDropOpen(!dropOpen)} style={{ cursor:"pointer", display:"flex", alignItems:"center", gap:6, padding:"6px 10px", borderRadius:10, background:dropOpen?T.card:"transparent", transition:"background .15s" }}>
        <span style={{ display:"flex" }}>{mode==="home"?I.home(T.accent):I.compass(T.accent)}</span>
        <span style={{ fontWeight:700, fontSize:16, color:T.text, fontFamily:FONT_H }}>{mode==="home"?"Ana Sayfa":"Keşfet"}</span>
        <span style={{ display:"flex", transform:dropOpen?"rotate(180deg)":"none", transition:"transform .2s" }}>{I.chevDown(T.textDim)}</span>
      </div>
      {dropOpen && <div style={{ position:"absolute", top:44, left:0, background:T.card, border:`1px solid ${T.cardBorder}`, borderRadius:12, padding:6, zIndex:60, boxShadow:"0 8px 32px rgba(0,0,0,.5)", minWidth:180 }}>
        {[{id:"home",ic:I.home,l:"Ana Sayfa"},{id:"explore",ic:I.compass,l:"Keşfet"}].map(o=><div key={o.id} onClick={()=>{setMode(o.id);setDropOpen(false);}} style={{ padding:"10px 14px", borderRadius:8, cursor:"pointer", display:"flex", alignItems:"center", gap:10, background:mode===o.id?`${T.accent}10`:"transparent" }}><span style={{ display:"flex" }}>{o.ic(mode===o.id?T.accent:T.textDim)}</span><span style={{ fontSize:14, fontWeight:mode===o.id?700:500, color:mode===o.id?T.accent:T.text }}>{o.l}</span></div>)}
      </div>}
    </div>
    {showActions && <div style={{ display:"flex", gap:14, alignItems:"center" }}>
      <span onClick={()=>onNav("S07")} style={{ cursor:"pointer", display:"flex" }}>{I.search()}</span>
      <span onClick={()=>onNav("S19")} style={{ cursor:"pointer", display:"flex", position:"relative" }}>{I.bell()}<span style={{ position:"absolute", top:-2, right:-3, width:7, height:7, borderRadius:4, background:T.red }}/></span>
      <span onClick={()=>onNav("S17")} style={{ cursor:"pointer", display:"flex", position:"relative" }}>{I.chat()}<span style={{ position:"absolute", top:-2, right:-3, width:7, height:7, borderRadius:4, background:T.accent }}/></span>
    </div>}
  </div>;
}
function TabBar({ active, onNav }) {
  const tabs=[{id:"S05",ic:I.home,l:"Ana Sayfa"},{id:"S08",ic:I.football,l:"Maçlar"},{id:"S15",ic:I.user,l:"Profil"}];
  return <div style={{ position:"fixed", bottom:0, left:0, right:0, height:56, background:T.bgAlt, borderTop:`1px solid ${T.cardBorder}`, display:"flex", justifyContent:"space-around", alignItems:"center", zIndex:100, maxWidth:430, margin:"0 auto" }}>
    {tabs.map(t=><div key={t.id} onClick={()=>onNav(t.id)} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2, cursor:"pointer", padding:"6px 20px" }}><span style={{ display:"flex" }}>{t.ic(active===t.id?T.accent:T.textMuted)}</span><span style={{ fontSize:10, fontWeight:active===t.id?700:500, color:active===t.id?T.accent:T.textMuted }}>{t.l}</span></div>)}
  </div>;
}

// — MATCH CARD —
function MatchCard({ match: m, onNav, mode="home" }) {
  const [liked,setLiked]=useState(m.likedByMe);
  const [lc,setLc]=useState(m.likes);
  const host=uf(m.host);
  const all=[...(m.tA||[]),...(m.tB||[])];
  const friends=all.filter(uid=>uf(uid)?.follow);
  const mvp=uf(m.mvp);
  const firstLiker=m.likers?.[0]?uf(m.likers[0]):null;
  const visComments=(m.comments||[]).slice(0,2);

  const hdr=()=>{
    if(mode==="explore") return <><b onClick={()=>onNav("S16",host.id)} style={{cursor:"pointer",color:T.text}}>{host.name}</b>{" ve "}<span style={{color:T.textDim}}>{all.length-1} kişi</span>{" maç tamamladı"}</>;
    const me=friends.find(uid=>uid===1);
    const of=friends.filter(uid=>uid!==1);
    if(me&&of.length===0) return <><b style={{color:T.accent}}>Sen</b>{" maç tamamladın"}</>;
    if(me&&of.length>=1){const f=uf(of[0]);return <><b style={{color:T.accent}}>Sen</b>{" ve "}<b onClick={()=>onNav("S16",f.id)} style={{cursor:"pointer",color:T.text}}>{f.name.split(" ")[0]}</b>{of.length>1?<span style={{color:T.textDim}}>{" ve "}{of.length-1} diğer arkadaşın</span>:""}{" maç tamamladı"}</>;}
    if(of.length===1){const f=uf(of[0]);return <><b onClick={()=>onNav("S16",f.id)} style={{cursor:"pointer",color:T.text}}>{f.name}</b>{" maç tamamladı"}</>;}
    if(of.length>=2){const f=uf(of[0]);return <><b onClick={()=>onNav("S16",f.id)} style={{cursor:"pointer",color:T.text}}>{f.name.split(" ")[0]}</b><span style={{color:T.textDim}}>{" ve "}{of.length-1} diğer arkadaşın</span>{" maç tamamladı"}</>;}
    return <><b onClick={()=>onNav("S16",host.id)} style={{cursor:"pointer",color:T.text}}>{host.name}</b>{" maç tamamladı"}</>;
  };

  const toggleLike=e=>{e.stopPropagation();setLiked(!liked);setLc(c=>liked?c-1:c+1);};

  return <div style={{ background:T.card, borderRadius:16, border:`1px solid ${T.cardBorder}`, marginBottom:16, overflow:"hidden" }}>
    {/* Header */}
    <div style={{ padding:"14px 16px 0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, flex:1 }}>
        <StackAv ids={mode==="explore"?[m.host]:friends.length>0?friends:[m.host]} s={26}/>
        <div style={{ fontSize:13, color:T.textDim, lineHeight:1.3 }}>{hdr()}</div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <span style={{ fontSize:11, color:T.textMuted }}>{m.date}</span>
        <span style={{ cursor:"pointer", display:"flex" }}>{I.more()}</span>
      </div>
    </div>

    {/* Body — clickable */}
    <div onClick={()=>onNav("S11",m.id)} style={{ cursor:"pointer", padding:"10px 16px 0" }}>
      <div style={{ fontWeight:700, fontSize:16, color:T.text, marginBottom:8, fontFamily:FONT_H }}>{m.title}</div>
      <div style={{ display:"flex", gap:12, fontSize:12, color:T.textDim, marginBottom:12, alignItems:"center", flexWrap:"wrap" }}>
        <span style={{ display:"flex", alignItems:"center", gap:3 }}>{I.clock()} {m.dur}</span>
        <span style={{ display:"flex", alignItems:"center", gap:3 }}>{I.mapPin()} {m.loc?.split(" ")[0]}</span>
        <span style={{ display:"flex", alignItems:"center", gap:3 }}>{I.users()} {all.length}</span>
        <Badge c={T.textDim}>{m.fmt}</Badge>
      </div>

      {/* Score — NO team avatars */}
      {m.sc && <div style={{ textAlign:"center", marginBottom:4 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:0 }}>
          <span style={{ fontSize:11, color:T.textDim, marginRight:12 }}>Takım A</span>
          <span style={{ fontSize:38, fontWeight:900, letterSpacing:"-2px", fontFamily:FONT_H }}>
            <span style={{ color:m.sc[0]>m.sc[1]?T.accent:T.text }}>{m.sc[0]}</span>
            <span style={{ color:T.textMuted, margin:"0 8px", fontSize:20 }}>–</span>
            <span style={{ color:m.sc[1]>m.sc[0]?T.accent:T.text }}>{m.sc[1]}</span>
          </span>
          <span style={{ fontSize:11, color:T.textDim, marginLeft:12 }}>Takım B</span>
        </div>
        {/* MVP — right under score, centered */}
        {mvp && <div onClick={e=>{e.stopPropagation();onNav("S16",mvp.id);}} style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:5, marginTop:4, cursor:"pointer" }}>
          {I.star()} <span style={{ fontSize:12, color:T.gold, fontWeight:600 }}>{mvp.name}</span>
        </div>}
      </div>}

      {/* Photos */}
      {m.photos>0 && <div style={{ display:"flex", gap:6, marginTop:8, marginBottom:4, overflowX:"auto" }}>
        {Array.from({length:Math.min(m.photos,4)},(_,i)=><div key={i} style={{ minWidth:100, height:70, borderRadius:10, background:T.cardBorder, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, color:T.textMuted, flexShrink:0 }}>📷</div>)}
      </div>}
    </div>

    {/* Interaction row */}
    <div style={{ padding:"10px 16px 0", display:"flex", gap:20, alignItems:"center", borderTop:`1px solid ${T.cardBorder}44` }}>
      <div onClick={toggleLike} style={{ display:"flex", alignItems:"center", gap:5, cursor:"pointer", fontSize:13, color:liked?T.red:T.textDim, fontWeight:liked?600:400 }}>
        {liked?I.heartFill():I.heart()} {lc}
      </div>
      <div onClick={e=>{e.stopPropagation();onNav("S42",m.id);}} style={{ display:"flex", alignItems:"center", gap:5, cursor:"pointer", fontSize:13, color:T.textDim }}>
        {I.comment()} {m.coms}
      </div>
      <div style={{ display:"flex", alignItems:"center", cursor:"pointer" }}>
        {I.share()}
      </div>
    </div>

    {/* Likers */}
    {lc>0 && <div style={{ padding:"8px 16px 0", fontSize:12, color:T.textDim, display:"flex", alignItems:"center", gap:6 }}>
      <StackAv ids={(m.likers||[]).slice(0,3)} s={18}/>
      <span>
        <b onClick={()=>onNav("S16",firstLiker?.id)} style={{ color:T.text, cursor:"pointer" }}>{liked?"Sen":firstLiker?.name?.split(" ")[0]}</b>
        {lc>1 && <span onClick={()=>onNav("S43",m.id)} style={{ cursor:"pointer" }}> ve <b style={{ color:T.text }}>{lc-1} diğerleri</b></span>}
      </span>
    </div>}

    {/* Comments — max 2 */}
    {visComments.length>0 && <div style={{ padding:"8px 16px 0" }}>
      {visComments.map((c,i)=>{const cu=uf(c.uid);return cu&&<div key={i} style={{ display:"flex", gap:8, alignItems:"flex-start", marginBottom:6 }}>
        <Av i={cu.av} s={22} onClick={()=>onNav("S16",cu.id)}/>
        <div style={{ fontSize:13 }}>
          <span onClick={()=>onNav("S16",cu.id)} style={{ fontWeight:600, color:T.text, cursor:"pointer" }}>{cu.un}</span>
          <span style={{ color:T.textMuted, marginLeft:6 }}>{c.t}</span>
          <div style={{ color:T.textDim, marginTop:1 }}>{c.text}</div>
        </div>
      </div>;})}
    </div>}

    {/* Add comment */}
    <div onClick={()=>onNav("S42",m.id)} style={{ padding:"10px 16px 14px", display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}>
      <Av i="BY" s={22}/>
      <span style={{ fontSize:13, color:T.textMuted }}>Bir yorum ekle...</span>
    </div>
  </div>;
}

// — EMPTY STATE —
function Empty({ icon, title, desc, action, onAction }) {
  return <div style={{ textAlign:"center", padding:"48px 24px" }}>
    <div style={{ marginBottom:16, display:"flex", justifyContent:"center", opacity:.6 }}>{icon}</div>
    <div style={{ fontSize:16, fontWeight:700, color:T.text, marginBottom:6, fontFamily:FONT_H }}>{title}</div>
    <div style={{ fontSize:13, color:T.textDim, marginBottom:20, lineHeight:1.5, maxWidth:260, margin:"0 auto 20px" }}>{desc}</div>
    {action&&<Btn primary onClick={onAction}>{action}</Btn>}
  </div>;
}

// — PAGES —

// S05: Feed
function S05({ onNav, mode, setMode, dropOpen, setDropOpen }) {
  const feed = mode==="home"
    ? M.filter(m=>[...(m.tA||[]),...(m.tB||[])].some(uid=>uf(uid)?.follow))
    : [...M].sort((a,b)=>(b.likes+b.coms*2+b.shares*3)-(a.likes+a.coms*2+a.shares*3)).filter(m=>m.likes+m.coms*2+m.shares*3>0);

  return <div style={{ paddingBottom:80 }}>
    {mode==="explore" && <div style={{ padding:"0 16px 16px" }}>
      <div style={{ fontSize:11, fontWeight:700, color:T.textMuted, marginBottom:10, textTransform:"uppercase", letterSpacing:.5 }}>Önerilen Kullanıcılar</div>
      <div style={{ display:"flex", gap:10, overflowX:"auto", paddingBottom:4 }}>
        {U.filter(u=>!u.follow&&u.id!==1).slice(0,5).map(u=><div key={u.id} onClick={()=>onNav("S16",u.id)} style={{ minWidth:100, background:T.card, borderRadius:14, padding:"14px 10px", textAlign:"center", border:`1px solid ${T.cardBorder}`, cursor:"pointer", flexShrink:0 }}>
          <Av i={u.av} s={40} st={{ margin:"0 auto" }}/>
          <div style={{ fontSize:12, fontWeight:600, color:T.text, marginTop:8 }}>{u.name.split(" ")[0]}</div>
          <div style={{ fontSize:10, color:T.textDim, marginTop:2 }}>@{u.un}</div>
          <div style={{ marginTop:8, fontSize:11, fontWeight:700, color:T.accent, display:"flex", alignItems:"center", justifyContent:"center", gap:3 }}>{I.plus(T.accent)} Takip Et</div>
        </div>)}
      </div>
    </div>}
    <div style={{ padding:"0 16px" }}>
      {feed.length>0 ? feed.map(m=><MatchCard key={m.id} match={m} onNav={onNav} mode={mode}/>) :
        <Empty icon={I.empty()} title="Henüz kimseyi takip etmiyorsun" desc="Takip ettiğin kişilerin maçları burada görünecek" action="Keşfet'e Git" onAction={()=>setMode("explore")}/>}
    </div>
  </div>;
}

// S07: Search
function S07({ onNav }) {
  const [q,setQ]=useState("");
  const res=q.length>0?U.filter(u=>u.name.toLowerCase().includes(q.toLowerCase())||u.un.includes(q.toLowerCase())):[];
  return <div style={{ padding:"0 16px 100px" }}>
    <div style={{ padding:"12px 0", display:"flex", alignItems:"center", gap:10 }}>
      <span onClick={()=>onNav("S05")} style={{ cursor:"pointer", display:"flex" }}>{I.arrowLeft()}</span>
      <div style={{ flex:1 }}><InpField placeholder="Kullanıcı ara..." icon={I.search} value={q} onChange={e=>setQ(e.target.value)} autoFocus/></div>
    </div>
    {q.length===0&&<div style={{ padding:"0" }}>
      <div style={{ fontSize:11, fontWeight:700, color:T.textMuted, marginBottom:12, textTransform:"uppercase", letterSpacing:.5 }}>Önerilen Kullanıcılar</div>
      {U.filter(u=>!u.follow&&u.id!==1).map(u=><div key={u.id} onClick={()=>onNav("S16",u.id)} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:`1px solid ${T.cardBorder}22`, cursor:"pointer" }}>
        <Av i={u.av} s={42}/>
        <div style={{ flex:1 }}><div style={{ fontWeight:600, fontSize:14, color:T.text }}>{u.name}</div><div style={{ fontSize:12, color:T.textDim }}>@{u.un} · {u.matches} maç</div></div>
        <Btn small primary>Takip Et</Btn>
      </div>)}
    </div>}
    {q.length>0&&res.length===0&&<Empty icon={I.noResult()} title="Kullanıcı bulunamadı" desc={`"${q}" ile eşleşen kullanıcı yok`}/>}
    {res.map(u=><div key={u.id} onClick={()=>onNav("S16",u.id)} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:`1px solid ${T.cardBorder}22`, cursor:"pointer" }}>
      <Av i={u.av} s={42}/>
      <div style={{ flex:1 }}><div style={{ fontWeight:600, fontSize:14, color:T.text }}>{u.name}</div><div style={{ fontSize:12, color:T.textDim }}>@{u.un} · {u.matches} maç</div></div>
      <Btn small primary>{u.follow?"✓ Takip":"Takip Et"}</Btn>
    </div>)}
  </div>;
}

// S42: Comments Page
function S42({ onNav, matchId }) {
  const m=M.find(x=>x.id===matchId)||M[0];
  const host=uf(m.host);
  return <div style={{ paddingBottom:80 }}>
    {/* Top bar */}
    <div style={{ padding:"12px 16px", display:"flex", alignItems:"center", gap:12, borderBottom:`1px solid ${T.cardBorder}22` }}>
      <span onClick={()=>onNav("S05")} style={{ cursor:"pointer", display:"flex" }}>{I.arrowLeft()}</span>
      <span style={{ fontSize:16, fontWeight:700, color:T.text, fontFamily:FONT_H }}>Yorumlar</span>
    </div>

    {/* Match summary */}
    <div style={{ padding:"14px 16px", borderBottom:`1px solid ${T.cardBorder}44` }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
        <Av i={host.av} s={32} onClick={()=>onNav("S16",host.id)}/>
        <div><div style={{ fontWeight:600, fontSize:13, color:T.text }}>{host.un}</div><div style={{ fontSize:11, color:T.textMuted }}>{m.date}, {m.time}</div></div>
      </div>
      <div style={{ fontWeight:700, fontSize:15, color:T.text, marginBottom:6, fontFamily:FONT_H }}>{m.title}</div>
      {m.sc&&<div style={{ fontSize:22, fontWeight:900, fontFamily:FONT_H, marginBottom:8 }}>
        <span style={{ color:m.sc[0]>m.sc[1]?T.accent:T.text }}>{m.sc[0]}</span>
        <span style={{ color:T.textMuted, margin:"0 6px", fontSize:14 }}>–</span>
        <span style={{ color:m.sc[1]>m.sc[0]?T.accent:T.text }}>{m.sc[1]}</span>
      </div>}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ display:"flex" }}>{I.heart()}</span>
          <StackAv ids={(m.likers||[]).slice(0,3)} s={18}/>
          <span onClick={()=>onNav("S43",m.id)} style={{ fontSize:13, color:T.text, fontWeight:600, cursor:"pointer" }}>{m.likes} beğeni</span>
        </div>
        <span style={{ fontSize:13, color:T.textDim }}>{m.coms} yorum</span>
      </div>
    </div>

    {/* All comments */}
    <div style={{ padding:"12px 16px" }}>
      {(m.comments||[]).map((c,i)=>{const cu=uf(c.uid);return cu&&<div key={i} style={{ display:"flex", gap:10, marginBottom:16, alignItems:"flex-start" }}>
        <Av i={cu.av} s={32} onClick={()=>onNav("S16",cu.id)}/>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span onClick={()=>onNav("S16",cu.id)} style={{ fontWeight:600, fontSize:14, color:T.text, cursor:"pointer" }}>{cu.un}</span>
            <span style={{ fontSize:12, color:T.textMuted }}>{c.t}</span>
          </div>
          <div style={{ fontSize:14, color:T.textDim, marginTop:3, lineHeight:1.4 }}>{c.text}</div>
        </div>
      </div>;})}
    </div>

    {/* Input bar — fixed bottom */}
    <div style={{ position:"fixed", bottom:0, left:0, right:0, maxWidth:430, margin:"0 auto", background:T.bgAlt, borderTop:`1px solid ${T.cardBorder}`, padding:"10px 16px", display:"flex", alignItems:"center", gap:10, zIndex:90 }}>
      <Av i="BY" s={28}/>
      <div style={{ flex:1, background:T.card, borderRadius:20, padding:"8px 14px", display:"flex", alignItems:"center" }}>
        <input placeholder="Bir yorum ekle..." style={{ background:"none", border:"none", color:T.text, fontSize:14, width:"100%", outline:"none" }}/>
      </div>
      <span style={{ cursor:"pointer", display:"flex" }}>{I.send()}</span>
    </div>
  </div>;
}

// S43: Likes Page
function S43({ onNav, matchId }) {
  const m=M.find(x=>x.id===matchId)||M[0];
  const [q,setQ]=useState("");
  const likers=(m.likers||[]).map(uid=>uf(uid)).filter(Boolean);
  const filtered=q?likers.filter(u=>u.name.toLowerCase().includes(q.toLowerCase())||u.un.includes(q.toLowerCase())):likers;

  return <div style={{ paddingBottom:20 }}>
    <div style={{ padding:"12px 16px", display:"flex", alignItems:"center", gap:12, borderBottom:`1px solid ${T.cardBorder}22` }}>
      <span onClick={()=>onNav("S05")} style={{ cursor:"pointer", display:"flex" }}>{I.arrowLeft()}</span>
      <span style={{ fontSize:16, fontWeight:700, color:T.text, fontFamily:FONT_H }}>Beğeniler</span>
    </div>
    <div style={{ padding:"12px 16px" }}>
      <InpField placeholder="Kullanıcı adı ara" icon={I.search} value={q} onChange={e=>setQ(e.target.value)}/>
    </div>
    <div style={{ padding:"0 16px" }}>
      {filtered.map(u=><div key={u.id} onClick={()=>onNav("S16",u.id)} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:`1px solid ${T.cardBorder}22`, cursor:"pointer" }}>
        <Av i={u.av} s={44}/>
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

  useEffect(()=>{if(!document.querySelector('link[href*="Plus+Jakarta+Sans"]')){const l=document.createElement("link");l.href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap";l.rel="stylesheet";document.head.appendChild(l);}},[]);

  const nav=(p,id)=>{setFade(false);setTimeout(()=>{setCur(p);setCurId(id||null);setFade(true);setDrop(false);},120);};

  const pg=()=>{
    switch(cur){
      case "S05": return <S05 onNav={nav} mode={mode} setMode={setMode} dropOpen={drop} setDropOpen={setDrop}/>;
      case "S07": return <S07 onNav={nav}/>;
      case "S42": return <S42 onNav={nav} matchId={curId}/>;
      case "S43": return <S43 onNav={nav} matchId={curId}/>;
      default: return <S05 onNav={nav} mode={mode} setMode={setMode} dropOpen={drop} setDropOpen={setDrop}/>;
    }
  };

  const showActions=cur==="S05";
  const showNav=cur==="S05";
  const showTabs=cur==="S05";

  return <div style={{ maxWidth:430, margin:"0 auto", minHeight:"100vh", background:T.bg, color:T.text, fontFamily:FONT_B, position:"relative", boxShadow:"0 0 60px rgba(0,0,0,.5)" }}>
    {/* Dev ribbon */}
    <div style={{ position:"sticky", top:0, zIndex:200, background:T.bgAlt, borderBottom:`1px solid ${T.cardBorder}`, padding:"6px 8px", display:"flex", gap:4 }}>
      {[{p:"S05",l:"Feed"},{p:"S07",l:"Arama"},{p:"S42",l:"Yorumlar",id:1},{p:"S43",l:"Beğeniler",id:1}].map(n=><span key={n.p} onClick={()=>nav(n.p,n.id)} style={{ padding:"4px 10px", borderRadius:6, fontSize:11, fontWeight:600, background:cur===n.p?T.accent:`${T.textDim}22`, color:cur===n.p?T.bg:T.textDim, cursor:"pointer" }}>{n.l}</span>)}
    </div>
    {showNav&&<TopNav mode={mode} setMode={setMode} dropOpen={drop} setDropOpen={setDrop} showActions={showActions} onNav={nav}/>}
    <div style={{ opacity:fade?1:0, transform:fade?"translateY(0)":"translateY(6px)", transition:"all .12s ease" }}>{pg()}</div>
    {showTabs&&<TabBar active="S05" onNav={nav}/>}
  </div>;
}
