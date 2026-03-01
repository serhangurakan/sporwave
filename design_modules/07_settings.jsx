import { useState, useRef } from "react";
import T from "./theme.js";

// ============================================================
// SPORWAVE MODULE 7 — Ayarlar & Güvenlik
// S20: Menü
// S21: Ayarlar
// S24: Arkadaşlarını Davet Et
// S25: Topluluk Kuralları
// S26: Yardım & SSS
// S27: Kullanıcı Doğrulama
// S28: Raporla (Bottom Sheet)
// S29: Engelle (Onay Dialog)
// S34: Hata Sayfası
// ============================================================
const FH="'Plus Jakarta Sans','SF Pro Display',-apple-system,sans-serif";
const FB="'SF Pro Display','SF Pro Text',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";

// Mock User
const ME={id:1,name:"Berk Başdemir",un:"berkbasdemir",av:"BB",email:"berk@sporwave.app",phone:"+905551234567",verified:true,city:"Kadıköy"};

// Icons
const I={
  arrowLeft:c=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.text} strokeWidth="2" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12,19 5,12 12,5"/></svg>,
  chevRight:c=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c||T.textMuted} strokeWidth="2" strokeLinecap="round"><polyline points="9,18 15,12 9,6"/></svg>,
  chevDown:c=><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2.5" strokeLinecap="round"><polyline points="6,9 12,15 18,9"/></svg>,
  users:c=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  link:c=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>,
  scroll:c=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  settings:c=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  help:c=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  shield:c=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  check:c=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c||T.accent} strokeWidth="3" strokeLinecap="round"><polyline points="20,6 9,17 4,12"/></svg>,
  logout:c=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.red} strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  sun:c=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c||T.gold} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  moon:c=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c||T.purple} strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>,
  lock:c=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  bell:c=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  eye:c=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  info:c=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  trash:c=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.red} strokeWidth="2" strokeLinecap="round"><polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>,
  copy:c=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>,
  whatsapp:c=><svg width="18" height="18" viewBox="0 0 24 24" fill={c||T.green}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
  instagram:c=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c||T.purple} strokeWidth="2" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill={c||T.purple} stroke="none"/></svg>,
  phone:c=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>,
  mail:c=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  flag:c=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c||T.red} strokeWidth="2" strokeLinecap="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>,
  block:c=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c||T.red} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>,
  home:c=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>,
  football:c=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15 15 0 014 10 15 15 0 01-4 10 15 15 0 01-4-10 15 15 0 014-10z"/><path d="M2 12h20"/></svg>,
  user:c=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 10-16 0"/></svg>,
  alertTriangle:c=><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={c||T.orange} strokeWidth="1.5" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  refresh:c=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.text} strokeWidth="2" strokeLinecap="round"><polyline points="23,4 23,10 17,10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>,
  x:c=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
};

// Shared Components
function Av({i,s=32,c=T.accent,onClick,st}){return <div onClick={onClick} style={{width:s,height:s,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:`${c}18`,border:`1.5px solid ${c}44`,color:c,fontSize:s*.34,fontWeight:700,cursor:onClick?"pointer":"default",flexShrink:0,...st}}>{i}</div>;}
function Btn({children,primary,danger,small,full,ghost,onClick,disabled,st}){const[h,setH]=useState(false);return <button disabled={disabled} onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{padding:small?"7px 14px":"12px 20px",borderRadius:10,border:primary||danger?"none":`1.5px solid ${ghost?"transparent":T.cardBorder}`,background:disabled?`${T.textDim}22`:danger?T.red:primary?T.accent:"transparent",color:disabled?T.textDim:danger?"#fff":primary?"#0D0D0D":T.text,fontSize:small?12:14,fontWeight:600,cursor:disabled?"not-allowed":"pointer",width:full?"100%":"auto",transition:"all .2s",transform:h&&!disabled?"translateY(-1px)":"none",display:"flex",alignItems:"center",justifyContent:"center",gap:6,...st}}>{children}</button>;}
function TabBar({active,onNav}){const tabs=[{id:"S05",ic:I.home,l:"Ana Sayfa"},{id:"S08",ic:I.football,l:"Maçlar"},{id:"S15",ic:I.user,l:"Profil"}];return <div style={{position:"fixed",bottom:0,left:0,right:0,height:56,background:T.bgAlt,borderTop:`1px solid ${T.cardBorder}`,display:"flex",justifyContent:"space-around",alignItems:"center",zIndex:100,maxWidth:430,margin:"0 auto"}}>{tabs.map(t=><div key={t.id} onClick={()=>onNav(t.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",padding:"6px 20px"}}><span style={{display:"flex"}}>{t.ic(active===t.id?T.accent:T.textMuted)}</span><span style={{fontSize:10,fontWeight:active===t.id?700:500,color:active===t.id?T.accent:T.textMuted}}>{t.l}</span></div>)}</div>;}
function Toggle({on,onToggle}){return <div onClick={onToggle} style={{width:44,height:24,borderRadius:12,background:on?T.accent:`${T.textMuted}44`,cursor:"pointer",position:"relative",transition:"background .2s",flexShrink:0}}><div style={{position:"absolute",top:2,left:on?22:2,width:20,height:20,borderRadius:"50%",background:"#fff",transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.3)"}}/></div>;}

// MenuItem helper
function MenuItem({icon,label,desc,onClick,danger,right,badge}){
  return <div onClick={onClick} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",cursor:"pointer",transition:"background .15s"}}
    onMouseEnter={e=>e.currentTarget.style.background=`${T.card}88`}
    onMouseLeave={e=>e.currentTarget.style.background="transparent"}
  >
    <div style={{display:"flex"}}>{icon}</div>
    <div style={{flex:1}}>
      <div style={{fontSize:14,fontWeight:500,color:danger?T.red:T.text}}>{label}</div>
      {desc&&<div style={{fontSize:12,color:T.textMuted,marginTop:2}}>{desc}</div>}
    </div>
    {badge&&<span style={{background:T.accent,color:"#0D0D0D",fontSize:10,fontWeight:700,borderRadius:10,padding:"1px 6px"}}>{badge}</span>}
    {right||<div style={{display:"flex"}}>{I.chevRight(T.textMuted)}</div>}
  </div>;
}

// Section header
function SectionTitle({children}){return <div style={{padding:"16px 16px 8px",fontSize:12,fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:.5}}>{children}</div>;}

// ============================================================
// S20: Menü
// ============================================================
function S20({onNav}){
  const[confirmLogout,setConfirmLogout]=useState(false);

  return <div style={{minHeight:"100vh",background:T.bg,fontFamily:FB,paddingBottom:20}}>
    {/* Header */}
    <div style={{position:"sticky",top:0,zIndex:50,background:T.bg,borderBottom:`1px solid ${T.cardBorder}`,padding:"12px 16px",display:"flex",alignItems:"center",gap:12}}>
      <div onClick={()=>onNav?.("S15")} style={{cursor:"pointer",display:"flex",padding:4}}>{I.arrowLeft(T.text)}</div>
      <h1 style={{fontFamily:FH,fontSize:20,fontWeight:800,color:T.text,margin:0}}>Menü</h1>
    </div>

    {/* Profile Mini Card */}
    <div style={{padding:"20px 16px",display:"flex",alignItems:"center",gap:14,borderBottom:`1px solid ${T.cardBorder}`}}>
      <Av i={ME.av} s={52}/>
      <div style={{flex:1}}>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <span style={{fontWeight:700,fontSize:16,color:T.text}}>{ME.name}</span>
          {ME.verified&&<span style={{display:"flex"}}>{I.check(T.accent)}</span>}
        </div>
        <div style={{fontSize:13,color:T.textMuted,marginTop:2}}>@{ME.un}</div>
      </div>
    </div>

    {/* Menu Items */}
    <div style={{marginTop:8}}>
      <MenuItem icon={I.users(T.textDim)} label="Takipçiler & Takip" onClick={()=>onNav?.("S22")}/>
      <MenuItem icon={I.link(T.accent)} label="Arkadaşlarını Davet Et" onClick={()=>onNav?.("S24")}/>
      <MenuItem icon={I.scroll(T.textDim)} label="Topluluk Kuralları" onClick={()=>onNav?.("S25")}/>
      <MenuItem icon={I.settings(T.textDim)} label="Ayarlar" onClick={()=>onNav?.("S21")}/>
      <MenuItem icon={I.help(T.textDim)} label="Yardım & SSS" onClick={()=>onNav?.("S26")}/>
      {!ME.verified&&<MenuItem icon={I.shield(T.orange)} label="Hesabını Doğrula" desc="Profilinde doğrulanmış rozeti kazan" onClick={()=>onNav?.("S27")}/>}
      {ME.verified&&<MenuItem icon={I.shield(T.green)} label="Hesap Doğrulandı" right={<span style={{fontSize:12,color:T.green,fontWeight:600}}>Doğrulanmış</span>}/>}
    </div>

    <div style={{height:1,background:T.cardBorder,margin:"8px 16px"}}/>

    {/* Logout */}
    <MenuItem icon={I.logout(T.red)} label="Çıkış Yap" danger onClick={()=>setConfirmLogout(true)} right={<span/>}/>

    {/* Logout Confirmation Dialog */}
    {confirmLogout&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.35)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:20}}>
      <div style={{background:T.card,border:`1px solid ${T.cardBorder}`,borderRadius:16,padding:24,maxWidth:320,width:"100%",textAlign:"center"}}>
        <div style={{fontSize:16,fontWeight:700,color:T.text,marginBottom:8}}>Çıkış Yap</div>
        <div style={{fontSize:14,color:T.textDim,marginBottom:24}}>Hesabından çıkış yapmak istediğine emin misin?</div>
        <div style={{display:"flex",gap:12}}>
          <Btn full onClick={()=>setConfirmLogout(false)}>İptal</Btn>
          <Btn full danger onClick={()=>{setConfirmLogout(false);alert("Çıkış yapıldı");}}>Çıkış Yap</Btn>
        </div>
      </div>
    </div>}
  </div>;
}

// ============================================================
// S21: Ayarlar
// ============================================================
function S21({onNav,onBack}){
  const[theme,setTheme]=useState("dark");
  const[pushNotif,setPushNotif]=useState(true);
  const[notifLikes,setNotifLikes]=useState(true);
  const[notifComments,setNotifComments]=useState(true);
  const[notifFollowers,setNotifFollowers]=useState(true);
  const[notifMatchReminder,setNotifMatchReminder]=useState(true);
  const[notifInvite,setNotifInvite]=useState(true);
  const[notifHostVote,setNotifHostVote]=useState(true);
  const[profilePrivacy,setProfilePrivacy]=useState("public");
  const[matchPrivacy,setMatchPrivacy]=useState("public");
  const[locationShare,setLocationShare]=useState(true);
  const[showDeleteConfirm,setShowDeleteConfirm]=useState(false);
  const[showBlockedUsers,setShowBlockedUsers]=useState(false);
  const[blockedUsers,setBlockedUsers]=useState([
    {id:10,name:"Kaan Yılmaz",un:"kaanyilmaz",av:"KY",date:"15 Şub 2026"},
    {id:11,name:"Emre Çelik",un:"emrecelik",av:"EÇ",date:"22 Şub 2026"},
  ]);

  const privacyOptions=[{id:"public",label:"Herkese Açık"},{id:"followers",label:"Sadece Takipçilere"},{id:"hidden",label:"Gizli"}];
  const profilePrivacyOpts=privacyOptions.filter(o=>o.id!=="hidden");

  return <div style={{minHeight:"100vh",background:T.bg,fontFamily:FB,paddingBottom:40}}>
    {/* Header */}
    <div style={{position:"sticky",top:0,zIndex:50,background:T.bg,borderBottom:`1px solid ${T.cardBorder}`,padding:"12px 16px",display:"flex",alignItems:"center",gap:12}}>
      <div onClick={onBack} style={{cursor:"pointer",display:"flex",padding:4}}>{I.arrowLeft(T.text)}</div>
      <h1 style={{fontFamily:FH,fontSize:20,fontWeight:800,color:T.text,margin:0}}>Ayarlar</h1>
    </div>

    {/* Görünüm */}
    <SectionTitle>Görünüm</SectionTitle>
    <div style={{padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        {theme==="dark"?I.moon(T.purple):I.sun(T.gold)}
        <span style={{fontSize:14,color:T.text,fontWeight:500}}>Tema</span>
      </div>
      <div style={{display:"flex",background:T.card,borderRadius:8,border:`1px solid ${T.cardBorder}`,overflow:"hidden"}}>
        {[{id:"dark",label:"Koyu"},{id:"light",label:"Açık"}].map(o=>
          <div key={o.id} onClick={()=>setTheme(o.id)} style={{padding:"6px 16px",fontSize:12,fontWeight:theme===o.id?700:500,color:theme===o.id?"#0D0D0D":T.textDim,background:theme===o.id?T.accent:"transparent",cursor:"pointer",transition:"all .2s"}}>{o.label}</div>
        )}
      </div>
    </div>

    {/* Hesap */}
    <SectionTitle>Hesap</SectionTitle>
    <MenuItem icon={I.lock(T.textDim)} label="Şifre Değiştir" onClick={()=>alert("Şifre değiştirme ekranı")}/>
    <MenuItem icon={I.mail(T.textDim)} label="E-posta Değiştir" desc={ME.email} onClick={()=>alert("E-posta değiştirme ekranı")}/>
    <MenuItem icon={I.phone(T.textDim)} label="Telefon Numarası" desc={ME.phone||"Belirtilmemiş"} onClick={()=>alert("Telefon düzenleme ekranı")}/>

    {/* Bildirimler */}
    <SectionTitle>Bildirimler</SectionTitle>
    <div style={{padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        {I.bell(T.textDim)}
        <span style={{fontSize:14,color:T.text,fontWeight:500}}>Push Bildirimler</span>
      </div>
      <Toggle on={pushNotif} onToggle={()=>setPushNotif(!pushNotif)}/>
    </div>
    {pushNotif&&<div style={{padding:"0 16px 0 48px"}}>
      {[
        {label:"Beğeniler",on:notifLikes,set:setNotifLikes},
        {label:"Yorumlar",on:notifComments,set:setNotifComments},
        {label:"Yeni Takipçi",on:notifFollowers,set:setNotifFollowers},
        {label:"Maç Hatırlatıcı",on:notifMatchReminder,set:setNotifMatchReminder},
        {label:"Maç Daveti",on:notifInvite,set:setNotifInvite},
        {label:"Host Devralma Oylamaları",on:notifHostVote,set:setNotifHostVote},
      ].map(n=><div key={n.label} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${T.cardBorder}`}}>
        <span style={{fontSize:13,color:T.textDim}}>{n.label}</span>
        <Toggle on={n.on} onToggle={()=>n.set(!n.on)}/>
      </div>)}
    </div>}

    {/* Gizlilik */}
    <SectionTitle>Gizlilik</SectionTitle>
    <div style={{padding:"10px 16px"}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
        {I.eye(T.textDim)}
        <span style={{fontSize:14,color:T.text,fontWeight:500}}>Profil Gizliliği</span>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        {profilePrivacyOpts.map(o=><div key={o.id} onClick={()=>setProfilePrivacy(o.id)} style={{flex:1,padding:"10px 16px",borderRadius:12,border:`1.5px solid ${profilePrivacy===o.id?T.accent:T.cardBorder}`,background:profilePrivacy===o.id?`${T.accent}12`:T.card,cursor:"pointer",textAlign:"center",fontSize:12,fontWeight:profilePrivacy===o.id?700:500,color:profilePrivacy===o.id?T.accent:T.textDim,transition:"all .2s"}}>{o.label}</div>)}
      </div>

      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
        {I.football(T.textDim)}
        <span style={{fontSize:14,color:T.text,fontWeight:500}}>Maç Geçmişi Gizliliği</span>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        {privacyOptions.map(o=><div key={o.id} onClick={()=>setMatchPrivacy(o.id)} style={{flex:1,padding:"10px 16px",borderRadius:12,border:`1.5px solid ${matchPrivacy===o.id?T.accent:T.cardBorder}`,background:matchPrivacy===o.id?`${T.accent}12`:T.card,cursor:"pointer",textAlign:"center",fontSize:12,fontWeight:matchPrivacy===o.id?700:500,color:matchPrivacy===o.id?T.accent:T.textDim,transition:"all .2s"}}>{o.label}</div>)}
      </div>

      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"4px 0"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.textDim} strokeWidth="2" strokeLinecap="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
          <span style={{fontSize:14,color:T.text,fontWeight:500}}>Konum Paylaşımı</span>
        </div>
        <Toggle on={locationShare} onToggle={()=>setLocationShare(!locationShare)}/>
      </div>

      <div style={{height:1,background:T.cardBorder,margin:"12px 0"}}/>

      <MenuItem icon={I.block(T.textDim)} label="Engellenen Kullanıcılar" desc="Engellediğin kullanıcıları yönet" onClick={()=>setShowBlockedUsers(true)}/>
    </div>

    {/* Hakkında */}
    <SectionTitle>Hakkında</SectionTitle>
    <MenuItem icon={I.scroll(T.textDim)} label="Topluluk Kuralları" onClick={()=>onNav?.("S25")}/>
    <MenuItem icon={I.scroll(T.textDim)} label="Gizlilik Politikası" onClick={()=>alert("Gizlilik Politikası")}/>
    <MenuItem icon={I.scroll(T.textDim)} label="Kullanım Şartları" onClick={()=>alert("Kullanım Şartları")}/>
    <MenuItem icon={I.scroll(T.textDim)} label="KVKK Aydınlatma Metni" onClick={()=>alert("KVKK Aydınlatma Metni")}/>
    <div style={{padding:"14px 16px",display:"flex",alignItems:"center",gap:12}}>
      <div style={{display:"flex"}}>{I.info(T.textDim)}</div>
      <div style={{flex:1}}>
        <div style={{fontSize:14,color:T.text,fontWeight:500}}>Uygulama Versiyonu</div>
      </div>
      <span style={{fontSize:13,color:T.textMuted}}>v1.0.0 (MVP)</span>
    </div>

    <div style={{height:1,background:T.cardBorder,margin:"12px 16px"}}/>

    {/* Hesabı Sil */}
    <MenuItem icon={I.trash(T.red)} label="Hesabı Sil" danger onClick={()=>setShowDeleteConfirm(true)} right={<span/>}/>

    {/* Delete Confirmation */}
    {showDeleteConfirm&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.35)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:20}}>
      <div style={{background:T.card,border:`1px solid ${T.cardBorder}`,borderRadius:16,padding:24,maxWidth:340,width:"100%",textAlign:"center"}}>
        <div style={{display:"flex",justifyContent:"center",marginBottom:12}}>{I.trash(T.red)}</div>
        <div style={{fontSize:16,fontWeight:700,color:T.text,marginBottom:8}}>Hesabı Sil</div>
        <div style={{fontSize:14,color:T.textDim,marginBottom:8,lineHeight:1.5}}>Hesabını silmek istediğine emin misin? Bu işlem geri alınamaz.</div>
        <div style={{fontSize:12,color:T.textMuted,marginBottom:24,lineHeight:1.4}}>Tüm maç geçmişin, postların, mesajların ve profil bilgilerin kalıcı olarak silinecek.</div>
        <div style={{display:"flex",gap:12}}>
          <Btn full onClick={()=>setShowDeleteConfirm(false)}>İptal</Btn>
          <Btn full danger onClick={()=>{setShowDeleteConfirm(false);alert("Hesap silindi");}}>Hesabı Sil</Btn>
        </div>
      </div>
    </div>}

    {/* Engellenen Kullanıcılar Modal */}
    {showBlockedUsers&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:200,display:"flex",flexDirection:"column"}}>
      <div style={{background:T.bg,maxWidth:430,width:"100%",margin:"0 auto",flex:1,display:"flex",flexDirection:"column"}}>
        <div style={{padding:"16px 16px 12px",display:"flex",alignItems:"center",gap:12,borderBottom:`1px solid ${T.cardBorder}`}}>
          <div onClick={()=>setShowBlockedUsers(false)} style={{cursor:"pointer",display:"flex"}}>{I.arrowLeft(T.text)}</div>
          <span style={{fontSize:16,fontWeight:700,color:T.text,fontFamily:FH}}>Engellenen Kullanıcılar</span>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"8px 0"}}>
          {blockedUsers.length===0?<div style={{textAlign:"center",padding:"60px 20px"}}>
            <div style={{fontSize:40,marginBottom:12}}>🚫</div>
            <div style={{fontSize:15,fontWeight:600,color:T.text,marginBottom:4}}>Engellenen kullanıcın yok</div>
            <div style={{fontSize:13,color:T.textMuted}}>Engellediğin kullanıcılar burada görünecek</div>
          </div>:blockedUsers.map(u=><div key={u.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px"}}>
            <Av i={u.av} s={40}/>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:600,color:T.text}}>{u.name}</div>
              <div style={{fontSize:12,color:T.textMuted}}>@{u.un} · Engellendi: {u.date}</div>
            </div>
            <Btn small onClick={()=>{if(confirm(`${u.name} kullanıcısının engelini kaldırmak istiyor musun?`)){setBlockedUsers(prev=>prev.filter(x=>x.id!==u.id));}}} st={{borderColor:T.red,color:T.red}}>Engeli Kaldır</Btn>
          </div>)}
        </div>
      </div>
    </div>}
  </div>;
}

// ============================================================
// S24: Arkadaşlarını Davet Et
// ============================================================
function S24({onBack}){
  const[copied,setCopied]=useState(false);
  const refLink="sporwave.app/davet/berk2026";

  const handleCopy=()=>{
    navigator.clipboard?.writeText(`https://${refLink}`).catch(()=>{});
    setCopied(true);
    setTimeout(()=>setCopied(false),2000);
  };

  return <div style={{minHeight:"100vh",background:T.bg,fontFamily:FB}}>
    {/* Header */}
    <div style={{position:"sticky",top:0,zIndex:50,background:T.bg,borderBottom:`1px solid ${T.cardBorder}`,padding:"12px 16px",display:"flex",alignItems:"center",gap:12}}>
      <div onClick={onBack} style={{cursor:"pointer",display:"flex",padding:4}}>{I.arrowLeft(T.text)}</div>
      <h1 style={{fontFamily:FH,fontSize:20,fontWeight:800,color:T.text,margin:0}}>Arkadaşlarını Davet Et</h1>
    </div>

    <div style={{padding:"40px 20px",display:"flex",flexDirection:"column",alignItems:"center",gap:24}}>
      {/* Illustration */}
      <div style={{width:120,height:120,borderRadius:"50%",background:`${T.accent}12`,border:`2px solid ${T.accent}33`,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="1.5" strokeLinecap="round">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
          <line x1="23" y1="11" x2="17" y2="11"/><line x1="20" y1="8" x2="20" y2="14"/>
        </svg>
      </div>

      <div style={{textAlign:"center"}}>
        <div style={{fontSize:18,fontWeight:700,color:T.text,fontFamily:FH,marginBottom:8}}>Arkadaşlarını SporWave'e Davet Et</div>
        <div style={{fontSize:14,color:T.textDim,lineHeight:1.5}}>Referans linkini paylaş, birlikte oynayın!</div>
      </div>

      {/* Ref Link */}
      <div style={{width:"100%",maxWidth:360}}>
        <div style={{background:T.card,border:`1px solid ${T.cardBorder}`,borderRadius:12,padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
          <span style={{fontSize:13,color:T.accent,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{refLink}</span>
          <div onClick={handleCopy} style={{cursor:"pointer",display:"flex",padding:4,flexShrink:0}}>
            {copied?I.check(T.accent):I.copy(T.textDim)}
          </div>
        </div>
        {copied&&<div style={{textAlign:"center",fontSize:12,color:T.accent,marginTop:8,fontWeight:600}}>Link kopyalandı!</div>}
      </div>

      {/* Share Buttons */}
      <div style={{width:"100%",maxWidth:360,display:"flex",flexDirection:"column",gap:12}}>
        <Btn full onClick={()=>alert("Linki kopyalandı")} primary>
          {I.copy(T.text)} Linki Kopyala
        </Btn>
        <Btn full onClick={()=>alert("WhatsApp ile paylaşılıyor...")} st={{background:`${T.green}18`,border:`1.5px solid ${T.green}44`,color:T.green}}>
          {I.whatsapp()} WhatsApp ile Paylaş
        </Btn>
        <Btn full onClick={()=>alert("Instagram ile paylaşılıyor...")} st={{background:`${T.purple}18`,border:`1.5px solid ${T.purple}44`,color:T.purple}}>
          {I.instagram()} Instagram ile Paylaş
        </Btn>
      </div>
    </div>
  </div>;
}

// ============================================================
// S25: Topluluk Kuralları
// ============================================================
const RULES=[
  {title:"Katılım Taahhüdü",content:"Katılacağını belirttiğin maçlara mutlaka git. No-show (gelmeme) durumunda katılım puanın düşer. Tekrarlayan no-show davranışı hesap kısıtlamasına yol açabilir."},
  {title:"Saygılı İletişim",content:"Tüm kullanıcılara saygılı ol. Küfür, hakaret, ayrımcılık ve nefret söylemi kesinlikle yasaktır. Maç sırasında ve uygulama içinde sportmence davran."},
  {title:"Gerçek Profil",content:"Fake profil, sahte bilgiler ve yanıltıcı içerik oluşturma yasaktır. Profil fotoğrafın seni yansıtmalı, bilgilerin doğru olmalıdır."},
  {title:"Sahte İlan Yasağı",content:"Gerçek olmayan maç ilanları oluşturma, sahte skor bildirme veya katılımcı sayısını manipüle etme yasaktır."},
  {title:"Taciz & Uygunsuz İçerik",content:"Taciz, tehdit, stalking ve uygunsuz içerik paylaşımı kesinlikle yasaktır. Bu tür davranışlar anında hesap kapatma ile sonuçlanabilir."},
  {title:"İhlal Bildirimi",content:"Kuralları ihlal eden bir kullanıcı gördüğünde profil sayfasındaki veya mesaj ekranındaki 'Raporla' butonunu kullan. Tüm raporlar ekibimiz tarafından incelenir."},
];

function S25({onBack}){
  return <div style={{minHeight:"100vh",background:T.bg,fontFamily:FB}}>
    <div style={{position:"sticky",top:0,zIndex:50,background:T.bg,borderBottom:`1px solid ${T.cardBorder}`,padding:"12px 16px",display:"flex",alignItems:"center",gap:12}}>
      <div onClick={onBack} style={{cursor:"pointer",display:"flex",padding:4}}>{I.arrowLeft(T.text)}</div>
      <h1 style={{fontFamily:FH,fontSize:20,fontWeight:800,color:T.text,margin:0}}>Topluluk Kuralları</h1>
    </div>

    <div style={{padding:"20px 16px"}}>
      <div style={{fontSize:14,color:T.textDim,marginBottom:20,lineHeight:1.5}}>
        SporWave'i herkes için güvenli ve eğlenceli bir platform olarak tutmak için aşağıdaki kurallara uymanı bekliyoruz.
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {RULES.map((r,i)=><div key={i} style={{background:T.card,border:`1px solid ${T.cardBorder}`,borderRadius:12,padding:16}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
            <span style={{width:24,height:24,borderRadius:8,background:`${T.accent}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:T.accent}}>{i+1}</span>
            <span style={{fontSize:14,fontWeight:700,color:T.text}}>{r.title}</span>
          </div>
          <div style={{fontSize:13,color:T.textDim,lineHeight:1.5}}>{r.content}</div>
        </div>)}
      </div>
    </div>
  </div>;
}

// ============================================================
// S26: Yardım & SSS
// ============================================================
const FAQ=[
  {q:"Nasıl maç oluşturabilirim?",a:"Maçlar sekmesindeki '+' butonuna tıkla, maç detaylarını gir, tarih ve konum belirle, katılım ayarlarını yap ve yayınla. Maçın otomatik olarak listelenir ve arkadaşlarını davet edebilirsin."},
  {q:"Skor takibi nasıl çalışır?",a:"Maç başlatıldıktan sonra canlı skor ekranı açılır. Gol atan oyuncuyu ve asist yapanı seçerek skor kaydedebilirsin. Maç bittiğinde skor kilitlenir."},
  {q:"Maça nasıl katılabilirim?",a:"Maçlar sekmesinden açık maçları gör, ilgini çeken maça tıkla ve 'Katıl' butonuna bas. Host onay modunu seçmişse başvurun onaylanmayı bekler."},
  {q:"Hesabımı nasıl silebilirim?",a:"Ayarlar > Hesabı Sil yolunu izle. Dikkat: Bu işlem geri alınamaz ve tüm verilerin kalıcı olarak silinir."},
  {q:"Katılım puanı nasıl hesaplanır?",a:"Son 10 maçında katılacağını söyleyip gerçekten geldiğin maçların oranı ile hesaplanır. İlk 5 maçında katılım puanı gösterilmez."},
  {q:"Birini nasıl engellerim?",a:"Kullanıcının profilindeki veya sohbet ekranındaki '⋮' menüsünden 'Engelle' seçeneğini kullan. Engellenen kullanıcı seni göremez ve sana mesaj atamaz."},
  {q:"MVP oylama nasıl çalışır?",a:"Maç bittikten sonra 24 saat içinde en iyi oyuncuyu seç. En çok oy alan oyuncu MVP seçilir. Eşitlik durumunda Co-MVP gösterilir."},
  {q:"Maç sohbeti ne zaman kapanır?",a:"Maç arşivlendiğinde (bitiş + 24 saat sonra) sohbet mesajları otomatik olarak silinir. Sadece metadata korunur."},
];

function S26({onBack}){
  const[openIdx,setOpenIdx]=useState(null);
  const[contactForm,setContactForm]=useState(false);
  const[contactMsg,setContactMsg]=useState("");

  return <div style={{minHeight:"100vh",background:T.bg,fontFamily:FB}}>
    <div style={{position:"sticky",top:0,zIndex:50,background:T.bg,borderBottom:`1px solid ${T.cardBorder}`,padding:"12px 16px",display:"flex",alignItems:"center",gap:12}}>
      <div onClick={onBack} style={{cursor:"pointer",display:"flex",padding:4}}>{I.arrowLeft(T.text)}</div>
      <h1 style={{fontFamily:FH,fontSize:20,fontWeight:800,color:T.text,margin:0}}>Yardım & SSS</h1>
    </div>

    <div style={{padding:"16px"}}>
      {/* FAQ */}
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {FAQ.map((item,i)=><div key={i} style={{background:T.card,border:`1px solid ${openIdx===i?T.accent:T.cardBorder}`,borderRadius:12,overflow:"hidden",transition:"border-color .2s"}}>
          <div onClick={()=>setOpenIdx(openIdx===i?null:i)} style={{padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer"}}>
            <span style={{fontSize:14,fontWeight:600,color:openIdx===i?T.accent:T.text,flex:1,paddingRight:8}}>{item.q}</span>
            <div style={{display:"flex",transform:openIdx===i?"rotate(180deg)":"rotate(0)",transition:"transform .2s"}}>{I.chevDown(openIdx===i?T.accent:T.textMuted)}</div>
          </div>
          {openIdx===i&&<div style={{padding:"0 16px 14px",fontSize:13,color:T.textDim,lineHeight:1.5,borderTop:`1px solid ${T.cardBorder}`}}>
            <div style={{paddingTop:12}}>{item.a}</div>
          </div>}
        </div>)}
      </div>

      {/* Contact Section */}
      <div style={{marginTop:32}}>
        <SectionTitle>İletişim</SectionTitle>
        <div style={{background:T.card,border:`1px solid ${T.cardBorder}`,borderRadius:12,padding:16,marginTop:8}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
            {I.mail(T.textDim)}
            <span style={{fontSize:14,color:T.text}}>destek@sporwave.app</span>
          </div>
          {!contactForm?(
            <Btn full onClick={()=>setContactForm(true)}>Destek Talebi Oluştur</Btn>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <textarea value={contactMsg} onChange={e=>setContactMsg(e.target.value)} placeholder="Sorunu veya önerini yaz..." rows={4} style={{width:"100%",padding:"12px 14px",borderRadius:10,border:`1.5px solid ${T.cardBorder}`,background:T.bg,color:T.text,fontSize:14,fontFamily:FB,outline:"none",resize:"vertical",boxSizing:"border-box"}} onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.cardBorder}/>
              <div style={{display:"flex",gap:8}}>
                <Btn full onClick={()=>{setContactForm(false);setContactMsg("");}}>İptal</Btn>
                <Btn full primary onClick={()=>{setContactForm(false);setContactMsg("");alert("Destek talebiniz gönderildi!");}}>Gönder</Btn>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>;
}

// ============================================================
// S27: Kullanıcı Doğrulama Akışı
// ============================================================
function S27({onBack}){
  const[step,setStep]=useState(1);
  const[phone,setPhone]=useState("+90");
  const[otp,setOtp]=useState(["","","","","",""]);
  const[verified,setVerified]=useState(false);
  const[timer,setTimer]=useState(0);
  const otpRefs=useRef([]);

  const sendOtp=()=>{
    if(phone.length<13)return;
    setStep(2);
    setTimer(60);
    const iv=setInterval(()=>setTimer(t=>{if(t<=1){clearInterval(iv);return 0;}return t-1;}),1000);
  };

  const handleOtpChange=(i,v)=>{
    if(v.length>1)v=v.slice(-1);
    const next=[...otp];
    next[i]=v;
    setOtp(next);
    if(v&&i<5)otpRefs.current[i+1]?.focus();
  };

  const handleOtpKey=(i,e)=>{
    if(e.key==="Backspace"&&!otp[i]&&i>0)otpRefs.current[i-1]?.focus();
  };

  const verifyOtp=()=>{
    const code=otp.join("");
    if(code.length===6){setVerified(true);}
  };

  return <div style={{minHeight:"100vh",background:T.bg,fontFamily:FB}}>
    <div style={{position:"sticky",top:0,zIndex:50,background:T.bg,borderBottom:`1px solid ${T.cardBorder}`,padding:"12px 16px",display:"flex",alignItems:"center",gap:12}}>
      <div onClick={onBack} style={{cursor:"pointer",display:"flex",padding:4}}>{I.arrowLeft(T.text)}</div>
      <h1 style={{fontFamily:FH,fontSize:20,fontWeight:800,color:T.text,margin:0}}>Hesap Doğrulama</h1>
    </div>

    <div style={{padding:"40px 20px",display:"flex",flexDirection:"column",alignItems:"center"}}>
      {verified?(
        <div style={{textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:16}}>
          <div style={{width:80,height:80,borderRadius:"50%",background:`${T.green}18`,border:`2px solid ${T.green}44`,display:"flex",alignItems:"center",justifyContent:"center"}}>
            {I.check(T.green)}
          </div>
          <div style={{fontSize:20,fontWeight:700,color:T.text,fontFamily:FH}}>Doğrulandı!</div>
          <div style={{fontSize:14,color:T.textDim,lineHeight:1.5}}>Profilinde artık "Doğrulanmış" rozeti görünecek.</div>
          <Btn primary onClick={onBack} st={{marginTop:16}}>Geri Dön</Btn>
        </div>
      ):step===1?(
        <>
          <div style={{width:80,height:80,borderRadius:"50%",background:`${T.accent}12`,border:`2px solid ${T.accent}33`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:24}}>
            {I.phone(T.accent)}
          </div>
          <div style={{fontSize:18,fontWeight:700,color:T.text,fontFamily:FH,textAlign:"center",marginBottom:8}}>Telefon Numaranı Doğrula</div>
          <div style={{fontSize:14,color:T.textDim,textAlign:"center",marginBottom:32,lineHeight:1.5}}>SMS ile doğrulama kodu göndereceğiz.</div>

          <div style={{width:"100%",maxWidth:320}}>
            <label style={{fontSize:12,fontWeight:600,color:T.textDim,marginBottom:6,display:"block"}}>Telefon Numarası</label>
            <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+90 5XX XXX XX XX" style={{width:"100%",padding:"12px 14px",borderRadius:10,border:`1.5px solid ${T.cardBorder}`,background:T.card,color:T.text,fontSize:16,fontFamily:FB,outline:"none",boxSizing:"border-box",letterSpacing:1}} onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.cardBorder}/>
            <Btn full primary onClick={sendOtp} disabled={phone.length<13} st={{marginTop:16}}>Doğrulama Kodu Gönder</Btn>
          </div>
        </>
      ):(
        <>
          <div style={{width:80,height:80,borderRadius:"50%",background:`${T.accent}12`,border:`2px solid ${T.accent}33`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:24}}>
            {I.shield(T.accent)}
          </div>
          <div style={{fontSize:18,fontWeight:700,color:T.text,fontFamily:FH,textAlign:"center",marginBottom:8}}>Doğrulama Kodu</div>
          <div style={{fontSize:14,color:T.textDim,textAlign:"center",marginBottom:32,lineHeight:1.5}}>{phone} numarasına gönderilen 6 haneli kodu gir.</div>

          <div style={{display:"flex",gap:8,marginBottom:24}}>
            {otp.map((d,i)=><input key={i} ref={el=>otpRefs.current[i]=el} value={d} onChange={e=>handleOtpChange(i,e.target.value)} onKeyDown={e=>handleOtpKey(i,e)} maxLength={1} style={{width:44,height:52,borderRadius:10,border:`1.5px solid ${d?T.accent:T.cardBorder}`,background:T.card,color:T.text,fontSize:22,fontWeight:700,textAlign:"center",fontFamily:FH,outline:"none",transition:"border-color .2s"}} onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>{if(!d)e.target.style.borderColor=T.cardBorder;}}/>)}
          </div>

          <Btn full primary onClick={verifyOtp} disabled={otp.join("").length<6} st={{maxWidth:320}}>Doğrula</Btn>

          <div style={{marginTop:20,fontSize:13,color:T.textMuted,textAlign:"center"}}>
            {timer>0?<span>{timer}sn sonra tekrar gönderebilirsin</span>:<span onClick={()=>{setTimer(60);const iv=setInterval(()=>setTimer(t=>{if(t<=1){clearInterval(iv);return 0;}return t-1;}),1000);}} style={{color:T.accent,cursor:"pointer",fontWeight:600}}>Tekrar Gönder</span>}
          </div>
          <div onClick={()=>{setStep(1);setOtp(["","","","","",""]);}} style={{marginTop:12,fontSize:13,color:T.textDim,cursor:"pointer"}}>Numarayı Değiştir</div>
        </>
      )}
    </div>
  </div>;
}

// ============================================================
// S28: Raporla (Bottom Sheet)
// ============================================================
function S28({onClose,userName}){
  const[selected,setSelected]=useState(null);
  const[otherText,setOtherText]=useState("");
  const[submitted,setSubmitted]=useState(false);

  const categories=[
    {id:"fake",label:"Fake Profil",icon:"👤"},
    {id:"content",label:"Uygunsuz İçerik",icon:"🚫"},
    {id:"spam",label:"Spam",icon:"📧"},
    {id:"noshow",label:"No-show / Gelmiyor",icon:"❌"},
    {id:"harass",label:"Taciz / Kötü Davranış",icon:"⚠️"},
    {id:"other",label:"Diğer",icon:"💬"},
  ];

  const handleSubmit=()=>{
    if(!selected)return;
    if(selected==="other"&&!otherText.trim())return;
    setSubmitted(true);
  };

  if(submitted){
    return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.35)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:200}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:T.card,borderRadius:"20px 20px 0 0",padding:"24px 20px 32px",maxWidth:430,width:"100%",textAlign:"center"}}>
        <div style={{width:60,height:60,borderRadius:"50%",background:`${T.green}18`,border:`2px solid ${T.green}44`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>{I.check(T.green)}</div>
        <div style={{fontSize:16,fontWeight:700,color:T.text,marginBottom:8}}>Rapor Gönderildi</div>
        <div style={{fontSize:14,color:T.textDim,marginBottom:24}}>Teşekkürler, ekibimiz inceleyecek.</div>
        <Btn full primary onClick={onClose}>Tamam</Btn>
      </div>
    </div>;
  }

  return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.35)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:200}} onClick={onClose}>
    <div onClick={e=>e.stopPropagation()} style={{background:T.card,borderRadius:"20px 20px 0 0",padding:"20px 20px 32px",maxWidth:430,width:"100%"}}>
      {/* Handle */}
      <div style={{width:40,height:4,borderRadius:2,background:T.cardBorder,margin:"0 auto 16px"}}/>

      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
        <div style={{fontSize:16,fontWeight:700,color:T.text,fontFamily:FH}}>
          {userName?"Raporla":"Kullanıcıyı Raporla"}
        </div>
        <div onClick={onClose} style={{cursor:"pointer",display:"flex",padding:4}}>{I.x(T.textDim)}</div>
      </div>

      {userName&&<div style={{fontSize:13,color:T.textDim,marginBottom:16}}>{userName} adlı kullanıcıyı neden raporluyorsun?</div>}

      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
        {categories.map(c=><div key={c.id} onClick={()=>setSelected(c.id)} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderRadius:10,border:`1.5px solid ${selected===c.id?T.accent:T.cardBorder}`,background:selected===c.id?`${T.accent}12`:T.bg,cursor:"pointer",transition:"all .2s"}}>
          <span style={{fontSize:16}}>{c.icon}</span>
          <span style={{fontSize:14,fontWeight:selected===c.id?600:500,color:selected===c.id?T.accent:T.text}}>{c.label}</span>
        </div>)}
      </div>

      {selected==="other"&&<textarea value={otherText} onChange={e=>setOtherText(e.target.value)} placeholder="Detayları yaz..." rows={3} style={{width:"100%",padding:"12px 14px",borderRadius:10,border:`1.5px solid ${T.cardBorder}`,background:T.bg,color:T.text,fontSize:14,fontFamily:FB,outline:"none",resize:"none",marginBottom:16,boxSizing:"border-box"}} onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.cardBorder}/>}

      <Btn full primary onClick={handleSubmit} disabled={!selected||(selected==="other"&&!otherText.trim())}>Gönder</Btn>
    </div>
  </div>;
}

// ============================================================
// S29: Engelle (Onay Dialog)
// ============================================================
function S29({userName,onConfirm,onCancel}){
  return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.35)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:20}} onClick={onCancel}>
    <div onClick={e=>e.stopPropagation()} style={{background:T.card,border:`1px solid ${T.cardBorder}`,borderRadius:16,padding:24,maxWidth:340,width:"100%",textAlign:"center"}}>
      <div style={{display:"flex",justifyContent:"center",marginBottom:12}}>{I.block(T.red)}</div>
      <div style={{fontSize:16,fontWeight:700,color:T.text,marginBottom:8}}>Bu kullanıcıyı engellemek istiyor musun?</div>
      <div style={{fontSize:14,color:T.textDim,marginBottom:8,lineHeight:1.5}}>
        <strong style={{color:T.text}}>{userName||"Bu kullanıcı"}</strong> seni göremez, sana mesaj atamaz ve maçlarında görünmez.
      </div>
      <div style={{fontSize:12,color:T.textMuted,marginBottom:24}}>Bu işlemi daha sonra Ayarlar'dan geri alabilirsin.</div>
      <div style={{display:"flex",gap:12}}>
        <Btn full onClick={onCancel}>İptal</Btn>
        <Btn full danger onClick={onConfirm}>Engelle</Btn>
      </div>
    </div>
  </div>;
}

// ============================================================
// S34: Hata Sayfası
// ============================================================
function S34({onRetry,onHome}){
  return <div style={{minHeight:"100vh",background:T.bg,fontFamily:FB,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
    <div style={{textAlign:"center",maxWidth:320}}>
      {I.alertTriangle(T.orange)}
      <div style={{fontSize:20,fontWeight:700,color:T.text,fontFamily:FH,marginTop:20,marginBottom:8}}>Bir Şeyler Ters Gitti</div>
      <div style={{fontSize:14,color:T.textDim,marginBottom:32,lineHeight:1.5}}>Sayfa yüklenirken bir hata oluştu. Lütfen tekrar dene.</div>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <Btn full primary onClick={onRetry}>{I.refresh(T.bg)} Tekrar Dene</Btn>
        <div onClick={onHome} style={{fontSize:14,color:T.accent,cursor:"pointer",fontWeight:600,padding:8}}>Ana Sayfaya Dön</div>
      </div>
    </div>
  </div>;
}

// ============================================================
// Dev Ribbon
// ============================================================
function DevRibbon({page,setPage}){
  const pages=["S20","S21","S24","S25","S26","S27","S28","S29","S34"];
  const labels={S20:"Menü",S21:"Ayarlar",S24:"Davet",S25:"Kurallar",S26:"SSS",S27:"Doğrulama",S28:"Raporla",S29:"Engelle",S34:"Hata"};
  return <div style={{position:"fixed",top:0,left:0,right:0,zIndex:999,background:"rgba(11,15,20,.92)",backdropFilter:"blur(8px)",borderBottom:`1px solid ${T.cardBorder}`,display:"flex",alignItems:"center",gap:0,padding:"0 4px",maxWidth:430,margin:"0 auto",height:36,overflowX:"auto"}}>
    <style>{`::-webkit-scrollbar{display:none}`}</style>
    {pages.map(p=><div key={p} onClick={()=>setPage(p)} style={{padding:"8px 8px",fontSize:10,fontWeight:page===p?700:500,color:page===p?T.accent:T.textDim,cursor:"pointer",borderBottom:page===p?`2px solid ${T.accent}`:"2px solid transparent",transition:"all .15s",whiteSpace:"nowrap",flexShrink:0}}>{p} {labels[p]}</div>)}
  </div>;
}

// ============================================================
// Main App
// ============================================================
export default function SettingsModule(){
  const[page,setPage]=useState("S20");
  const[showReport,setShowReport]=useState(false);
  const[showBlock,setShowBlock]=useState(false);

  const nav=(target,data)=>{
    if(["S20","S21","S24","S25","S26","S27"].includes(target)){setPage(target);}
    else if(target==="S28"){setShowReport(true);}
    else if(target==="S29"){setShowBlock(true);}
    else if(target==="S34"){setPage("S34");}
    // Cross-module
    else if(target==="S15")alert("→ Profil");
    else if(target==="S22")alert("→ Takipçiler & Takip (Modül 5)");
    else alert(`→ ${target}: ${JSON.stringify(data)}`);
  };

  const goBack=()=>setPage("S20");

  return <div style={{maxWidth:430,margin:"0 auto",position:"relative",background:T.bg,minHeight:"100vh"}}>
    <DevRibbon page={page} setPage={setPage}/>
    <div style={{paddingTop:36}}>
      {page==="S20"&&<S20 onNav={nav}/>}
      {page==="S21"&&<S21 onNav={nav} onBack={goBack}/>}
      {page==="S24"&&<S24 onBack={goBack}/>}
      {page==="S25"&&<S25 onBack={goBack}/>}
      {page==="S26"&&<S26 onBack={goBack}/>}
      {page==="S27"&&<S27 onBack={goBack}/>}
      {page==="S28"&&<S28 onClose={()=>setPage("S20")} userName="Ali Demir"/>}
      {page==="S29"&&<S29 userName="Ali Demir" onConfirm={()=>{alert("Engellendi");setPage("S20");}} onCancel={()=>setPage("S20")}/>}
      {page==="S34"&&<S34 onRetry={()=>alert("Tekrar deneniyor...")} onHome={()=>setPage("S20")}/>}
    </div>

    {/* Overlays */}
    {showReport&&<S28 onClose={()=>setShowReport(false)} userName="Ali Demir"/>}
    {showBlock&&<S29 userName="Ali Demir" onConfirm={()=>{alert("Engellendi");setShowBlock(false);}} onCancel={()=>setShowBlock(false)}/>}
  </div>;
}