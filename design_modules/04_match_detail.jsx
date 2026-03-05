import { useState, useEffect, useRef } from "react";
import T from "./theme.js";

// ============================================================
// SPORWAVE MODULE 4 — Maç Detay (S11, S12, S13, S41, S30)
// S11: Geçmiş maç detay (oynanmış)
// S12: Planlanan maç detay (henüz oynanmamış)
// S13: Başvuru yönetimi (host)
// S41: Oyuncu Davet → S12'deki inline Invite Drawer olarak taşındı (standalone kaldırıldı)
// S30: Shareable kart (maç sonrası)
// S40: Kaldırıldı — MVP oylama S08 Maçlarım tab'ında inline olarak yapılıyor
// ============================================================
const FH="'Plus Jakarta Sans','SF Pro Display',-apple-system,sans-serif";
const FB="'SF Pro Display','SF Pro Text',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";

// Mock Users (same as other modules)
const AVATARS=[
  "/assets/images/avatars/avatar_01.jpg",
  "/assets/images/avatars/avatar_02.jpg",
  "/assets/images/avatars/avatar_03.jpg",
  "/assets/images/avatars/avatar_04.jpg",
  "/assets/images/avatars/avatar_05.jpeg",
  "/assets/images/avatars/avatar_06.jpg",
  "/assets/images/avatars/avatar_07.jpg",
  "/assets/images/avatars/avatar_08.jpg",
];
const U=[
  {id:1,name:"Berk Başdemir",un:"berkbasdemir",av:"BB",img:AVATARS[0],att:94,follow:true,level:"mid"},
  {id:2,name:"Ali Demir",un:"alidemir",av:"AD",img:AVATARS[1],att:88,follow:true,level:"mid"},
  {id:3,name:"Mehmet Kaya",un:"mkaya",av:"MK",img:AVATARS[2],att:91,follow:false,level:"good"},
  {id:4,name:"Serhan Gürakan",un:"serhangurakan",av:"SG",img:AVATARS[3],att:96,follow:true,level:"good"},
  {id:5,name:"Can Yıldız",un:"canyildiz",av:"CY",img:AVATARS[4],att:85,follow:false,level:"beginner"},
  {id:6,name:"Oğuz Han",un:"oguzhan",av:"OH",img:AVATARS[5],att:92,follow:false,level:"mid"},
  {id:7,name:"Kerem Aktaş",un:"keremm",av:"KA",img:AVATARS[6],att:78,follow:false,level:"beginner"},
  {id:8,name:"Burak Şen",un:"buraksen",av:"BŞ",img:AVATARS[7],att:90,follow:false,level:"mid"},
  {id:9,name:"Tolga Sarı",un:"tolga",av:"TS",att:0,follow:false,level:"mid",guest:true},
  {id:10,name:"Yusuf Eren",un:"yusuf",av:"YE",att:0,follow:false,level:"beginner",guest:true},
];
const uf=id=>U.find(u=>u.id===id);

// Mock: Past match (S11)
const PAST_MATCH={
  id:1,title:"Kadıköy Halısaha Maçı",date:"25 Şub",time:"20:00",loc:"Kadıköy Spor Tesisleri",fmt:"6v6",dur:"1s 20dk",
  sc:[6,3],host:1,mvp:[4],
  guests:[{id:"g1",name:"Tolga"}],
  tA:[1,2,4,"g1"],tB:[3,5,6],
  noShow:[],
  goals:[
    {min:3,scorer:4,assist:1,team:"A"},
    {min:12,scorer:3,assist:null,team:"B"},
    {min:18,scorer:1,assist:2,team:"A"},
    {min:25,scorer:4,assist:null,team:"A"},
    {min:30,scorer:"g1",assist:1,team:"A"},
    {min:33,scorer:5,assist:3,team:"B"},
    {min:41,scorer:2,assist:4,team:"A"},
    {min:55,scorer:6,assist:5,team:"B"},
    {min:68,scorer:4,assist:1,team:"A"},
  ],
  posts:[
    {id:102,userId:4,caption:"MVP seçilmek güzel hissettirdi",likes:12,coms:4},
    {id:101,userId:1,caption:"Ev sahibi olarak güzel bir maçtı!",likes:8,coms:3},
    {id:103,userId:2,caption:null,likes:4,coms:1},
  ],
};

// Mock: Planned match (S12)
const PLANNED_MATCH={
  id:101,title:"Cumartesi Akşam Maçı",desc:"Her seviyeden oyuncu bekliyoruz, keyifli bir maç olacak. Sahada buluşalım!",date:"1 Mar",time:"20:00",loc:{name:"Kadıköy Spor Tesisleri",addr:"Caferağa Mah. Moda Cad. No:12, Kadıköy",lat:40.9867,lng:29.0287,type:"place"},fmt:"6v6",
  host:2,joined:9,max:12,level:"Herkes",mode:"open",vis:"public",
  players:[2,1,4,3,7,8,5],
  guests:[{id:"g1",name:"Tolga"},{id:"g2",name:"Yusuf"}],
  tA:[2,1,4], // Takım A (atanmış)
  tB:[3,7],   // Takım B (atanmış)
  // players + guests içinde tA+tB dışındakiler → yedekler
  hostTakeover:null,
};

// Mock: Match chat messages
const CHAT_MSGS=[
  {id:1,from:2,text:"Herkese merhaba! Sahayı ayarladım.",time:"10:00"},
  {id:2,from:1,text:"Süper Ali, saat kaçta buluşuyoruz?",time:"10:15"},
  {id:3,from:2,text:"20:00'de sahada olalım, 19:45 gibi gelin ısınırız",time:"10:20"},
  {id:4,from:3,text:"Ben kaleci oynayabilirim",time:"11:00"},
  {id:5,from:7,text:"Forma getirmemiz gerekiyor mu?",time:"11:30"},
  {id:6,from:2,text:"Sahada forma var, merak etmeyin",time:"11:35"},
  {id:7,from:4,text:"Ben biraz geç kalabilirim",time:"15:20"},
];

// Mock: Planned match with approval mode (S13)
const APPROVAL_MATCH={
  id:102,title:"Pazar Sabah Maçı",date:"2 Mar",time:"10:00",loc:{name:"Beşiktaş Halısaha",addr:"Sinanpaşa Mah. Beşiktaş Cad. No:5, Beşiktaş",lat:41.0422,lng:29.0046,type:"place"},fmt:"5v5",
  host:1,joined:6,max:10,level:"Orta+",mode:"approval",vis:"public",
  players:[1,2,4],
  pending:[{uid:6,level:"mid",date:"Bugün"},{uid:7,level:"beginner",date:"Dün"},{uid:5,level:"beginner",date:"Dün"}],
  approved:[1,2,4],
};

// S40 mock data kaldırıldı — MVP oylama S08'de inline

// Location data (shared with S31)
const LOC_RESULTS=[
  {id:"l1",name:"Kadıköy Spor Tesisleri",addr:"Caferağa Mah. Moda Cad. No:12, Kadıköy",lat:40.9867,lng:29.0287},
  {id:"l2",name:"Kadıköy Arena Halısaha",addr:"Rasimpaşa Mah. Rıhtım Cad. No:44, Kadıköy",lat:40.9901,lng:29.0234},
  {id:"l3",name:"Kadıköy Sahil Halısaha",addr:"Osmanağa Mah. Bahariye Cad. No:78, Kadıköy",lat:40.9845,lng:29.0312},
  {id:"l4",name:"Beşiktaş Halısaha",addr:"Sinanpaşa Mah. Beşiktaş Cad. No:5, Beşiktaş",lat:41.0422,lng:29.0046},
  {id:"l5",name:"Ataşehir Arena",addr:"Küçükbakkalköy Mah. Kayışdağı Cad. No:22, Ataşehir",lat:40.9923,lng:29.1145},
];
const CITIES=["İstanbul","Ankara","İzmir","Bursa","Antalya"];
const DISTRICTS={"İstanbul":["Kadıköy","Beşiktaş","Üsküdar","Ataşehir","Bakırköy","Şişli","Maltepe","Kartal"],"Ankara":["Çankaya","Keçiören","Yenimahalle"],"İzmir":["Konak","Karşıyaka","Bornova"],"Bursa":["Osmangazi","Nilüfer"],"Antalya":["Muratpaşa","Konyaaltı"]};

// Levels
const LEVELS={beginner:{l:"Başlangıç",c:T.green},mid:{l:"Orta",c:T.accent},good:{l:"İyi",c:T.orange},pro:{l:"Profesyonel",c:T.gold}};

// Icons
const I={
  arrowLeft:c=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.text} strokeWidth="2" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12,19 5,12 12,5"/></svg>,
  star:c=><svg width="16" height="16" viewBox="0 0 24 24" fill={c||T.gold} stroke={c||T.gold} strokeWidth="1"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>,
  clock:c=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||T.textMuted} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>,
  pin:c=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||T.textMuted} strokeWidth="2" strokeLinecap="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>,
  users:c=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||T.textMuted} strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  football:c=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15 15 0 014 10 15 15 0 01-4 10 15 15 0 01-4-10 15 15 0 014-10z"/><path d="M2 12h20"/></svg>,
  home:c=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>,
  user:c=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 10-16 0"/></svg>,
  share:c=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16,6 12,2 8,6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>,
  chat:c=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  check:c=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||T.accent} strokeWidth="3" strokeLinecap="round"><polyline points="20,6 9,17 4,12"/></svg>,
  x:c=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||T.red} strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  crown:c=><svg width="16" height="16" viewBox="0 0 24 24" fill={c||T.gold} stroke={c||T.gold} strokeWidth="1"><path d="M2 20h20L19 8l-5 5-2-7-2 7-5-5z"/></svg>,
  copy:c=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>,
  dots:c=><svg width="16" height="16" viewBox="0 0 24 24" fill={c||T.textDim}><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>,
  edit:c=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  search:c=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  eye:c=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||T.green} strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  lock:c=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||T.textMuted} strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  whatsapp:c=><svg width="16" height="16" viewBox="0 0 24 24" fill={c||T.green}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
  download:c=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  instagram:c=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c||T.purple} strokeWidth="2" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill={c||T.purple} stroke="none"/></svg>,
  gamepad:c=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c||T.accent} strokeWidth="2" strokeLinecap="round"><rect x="2" y="6" width="20" height="12" rx="3"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="12" y1="6" x2="12" y2="18"/></svg>,
  send:c=><svg width="20" height="20" viewBox="0 0 24 24" fill={c||T.accent} stroke="none"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>,
  attach:c=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.49"/></svg>,
  play:c=><svg width="16" height="16" viewBox="0 0 24 24" fill={c||T.bg} style={{marginLeft:1}}><polygon points="5,3 19,12 5,21"/></svg>,
  vote:c=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c||T.accent} strokeWidth="2" strokeLinecap="round"><path d="M14 9V5a3 3 0 00-6 0v4"/><rect x="2" y="9" width="20" height="13" rx="2"/><path d="M12 17v-4"/></svg>,
  info:c=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||T.textMuted} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="8" strokeWidth="2.5"/><line x1="12" y1="12" x2="12" y2="16"/></svg>,
};

// Shared Components
function Av({i,img,s=32,c=T.accent,onClick,st}){return <div onClick={onClick} style={{width:s,height:s,borderRadius:"50%",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",background:`${c}18`,border:`1.5px solid ${c}44`,color:c,fontSize:s*.34,fontWeight:700,cursor:onClick?"pointer":"default",flexShrink:0,...st}}>{img?<img src={img} alt="" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>:i}</div>;}
function Btn({children,primary,danger,small,full,ghost,onClick,disabled,st}){const[h,setH]=useState(false);return <button disabled={disabled} onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{padding:small?"7px 14px":"12px 20px",borderRadius:10,border:primary||danger?"none":`1.5px solid ${ghost?"transparent":T.cardBorder}`,background:disabled?`${T.textDim}22`:danger?T.red:primary?T.accent:"transparent",color:disabled?T.textDim:danger?"#fff":primary?"#fff":T.text,fontSize:small?12:14,fontWeight:600,cursor:disabled?"not-allowed":"pointer",width:full?"100%":"auto",transition:"all .2s",transform:h&&!disabled?"translateY(-1px)":"none",display:"flex",alignItems:"center",justifyContent:"center",gap:6,...st}}>{children}</button>;}
function Badge({children,c=T.accent,st}){return <span style={{display:"inline-flex",alignItems:"center",gap:3,padding:"2px 8px",borderRadius:20,fontSize:11,fontWeight:600,color:c,background:`${c}15`,whiteSpace:"nowrap",...st}}>{children}</span>;}
function CapacityBar({joined,max}){const pct=joined/max*100;return <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{flex:1,height:4,borderRadius:2,background:`${T.textDim}22`}}><div style={{height:4,borderRadius:2,background:pct>=90?T.orange:T.accent,width:`${pct}%`,transition:"width .3s"}}/></div><span style={{fontSize:11,color:T.textDim,fontWeight:600,whiteSpace:"nowrap"}}>{joined}/{max}</span></div>;}
function TabBar({active,onNav}){
  const tabs=[{id:"S05",ic:I.home,l:"Ana Sayfa"},{id:"S08",ic:I.football,l:"Maçlar"},{id:"S15",ic:I.user,l:"Profil"}];
  const handleTabClick=(tabId)=>{
    if(tabId==="S05"){window.location.assign("/02_feed");return;}
    if(tabId==="S08"){window.location.assign("/03_matches");return;}
    if(tabId==="S15"){window.location.assign("/05_profile");return;}
    onNav(tabId);
  };
  return <div style={{position:"fixed",bottom:0,left:0,right:0,height:56,background:T.bgAlt,borderTop:`1px solid ${T.cardBorder}`,display:"flex",zIndex:100,maxWidth:430,margin:"0 auto"}}>
    {tabs.map(t=><div key={t.id} onClick={()=>handleTabClick(t.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,cursor:"pointer",padding:"8px 0"}}><span style={{display:"flex"}}>{t.ic(active===t.id?T.accent:T.textMuted)}</span><span style={{fontSize:10,fontWeight:active===t.id?700:500,color:active===t.id?T.accent:T.textMuted}}>{t.l}</span></div>)}
  </div>;
}

// ============================================================
// S11: Geçmiş Maç Detay (Oynanmış)
// ============================================================
function S11({onNav}){
  const m=PAST_MATCH;
  const host=uf(m.host);
  const mvps=m.mvp.map(id=>uf(id));
  const gf11=(id)=>{const g=m.guests?.find(x=>x.id===id);return g?{id:g.id,name:g.name,av:g.name[0].toUpperCase(),guest:true}:null;};
  const pf11=(id)=>typeof id==="string"?gf11(id):uf(id);

  // Count goals & assists per player
  const stats={};
  m.goals.forEach(g=>{
    if(g.scorer){stats[g.scorer]=stats[g.scorer]||{g:0,a:0};stats[g.scorer].g++;}
    if(g.assist){stats[g.assist]=stats[g.assist]||{g:0,a:0};stats[g.assist].a++;}
  });

  const PlayerRow=({uid,team})=>{
    const u=pf11(uid);if(!u)return null;
    const s=stats[uid];
    const isMvp=m.mvp.includes(uid);
    const isNoShow=m.noShow.includes(uid);
    return <div onClick={()=>!u.guest&&onNav("S16",uid)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:`1px solid ${T.cardBorder}`,cursor:u.guest?"default":"pointer",opacity:isNoShow?.5:1}}>
      <Av i={u.av} img={u.img} s={32} c={isMvp?T.accent:team==="A"?T.accent:T.orange} st={u.guest?{background:"#6B7280",color:"#fff"}:{}}/>
      <div style={{flex:1}}>
        <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
          {isMvp&&<span style={{display:"flex",flexShrink:0}}>{I.star(T.accent)}</span>}
          <span style={{fontSize:13,fontWeight:600,color:u.guest?T.textDim:T.text}}>{u.name}</span>
          {u.guest&&<Badge c={T.textMuted}>Misafir</Badge>}
          {isNoShow&&<Badge c={T.red}>Katılmadı</Badge>}
        </div>
        {s&&<div style={{display:"flex",gap:8,fontSize:11,color:T.textDim,marginTop:3}}>
          {s.g>0&&<span style={{fontWeight:600}}>{s.g} gol</span>}
          {s.a>0&&<span>{s.a} asist</span>}
        </div>}
      </div>
    </div>;
  };

  return <div style={{paddingBottom:80}}>
    {/* Header */}
    <div style={{padding:"12px 16px 0"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
        <span onClick={()=>window.location.assign("/02_feed")} style={{cursor:"pointer",display:"flex"}}>{I.arrowLeft()}</span>
        <span style={{fontSize:18,fontWeight:800,color:T.text,fontFamily:FH,flex:1}}>Maç Detay</span>
        <span onClick={()=>onNav("S30","past")} style={{cursor:"pointer",display:"flex"}}>{I.share(T.textDim)}</span>
      </div>
    </div>

    {/* Title + Score */}
    <div style={{textAlign:"center",padding:"0 16px 20px"}}>
      <div style={{marginBottom:12}}>
        <span style={{fontSize:20,fontWeight:800,color:T.text,fontFamily:FH}}>{m.title}</span>
      </div>
      <div style={{fontSize:48,fontWeight:900,fontFamily:FH,marginBottom:8}}>
        <span style={{color:T.text}}>{m.sc[0]}</span>
        <span style={{color:T.textMuted,margin:"0 12px",fontSize:24}}>–</span>
        <span style={{color:T.text}}>{m.sc[1]}</span>
      </div>
      <div style={{display:"flex",justifyContent:"center",gap:12,fontSize:12,color:T.textDim,flexWrap:"wrap"}}>
        <span style={{display:"flex",alignItems:"center",gap:4}}>{I.clock()} {m.date}, {m.time}</span>
        <span style={{display:"flex",alignItems:"center",gap:4}}>{I.pin()} {m.loc}</span>
        <Badge c={T.textDim}>{m.fmt}</Badge>
        <span style={{display:"flex",alignItems:"center",gap:4}}>{I.clock()} {m.dur}</span>
      </div>
    </div>

    {/* MVP highlight */}
    {mvps.length>0&&<div style={{margin:"0 16px 16px",background:`${T.accent}08`,borderRadius:14,border:`1.5px solid ${T.accent}22`,padding:"14px 16px",textAlign:"center"}}>
      <div style={{fontSize:12,fontWeight:700,color:T.accent,marginBottom:8,textTransform:"uppercase",letterSpacing:.5}}>{mvps.length>1?"Co-MVP":"Maçın Yıldızı"}</div>
      <div style={{display:"flex",justifyContent:"center",gap:16}}>
        {mvps.map(u=><div key={u.id} onClick={()=>onNav("S16",u.id)} style={{cursor:"pointer",textAlign:"center"}}>
          <Av i={u.av} img={u.img} s={48} c={T.accent} st={{margin:"0 auto",border:`2px solid ${T.accent}`}}/>
          <div style={{fontSize:13,fontWeight:700,color:T.accent,marginTop:6}}>{u.name}</div>
          {stats[u.id]&&<div style={{fontSize:11,color:T.textDim,marginTop:2}}>{stats[u.id].g} gol, {stats[u.id].a} asist</div>}
        </div>)}
      </div>
    </div>}

    {/* Team rosters */}
    <div style={{display:"flex",gap:12,padding:"0 16px",marginBottom:16}}>
      <div style={{flex:1}}>
        <div style={{fontSize:12,fontWeight:700,color:T.accent,marginBottom:8,textAlign:"center",textTransform:"uppercase",letterSpacing:.5}}>Takım A</div>
        {m.tA.map(uid=><PlayerRow key={uid} uid={uid} team="A"/>)}
      </div>
      <div style={{width:1,background:T.cardBorder}}/>
      <div style={{flex:1}}>
        <div style={{fontSize:12,fontWeight:700,color:T.orange,marginBottom:8,textAlign:"center",textTransform:"uppercase",letterSpacing:.5}}>Takım B</div>
        {m.tB.map(uid=><PlayerRow key={uid} uid={uid} team="B"/>)}
      </div>
    </div>

    {/* Goal timeline */}
    <div style={{padding:"0 16px",marginBottom:16}}>
      <div style={{fontSize:12,fontWeight:700,color:T.textMuted,marginBottom:10,textTransform:"uppercase",letterSpacing:.5}}>Gol Zaman Çizelgesi</div>
      <div style={{background:T.card,borderRadius:14,border:`1px solid ${T.cardBorder}`,padding:"12px 14px"}}>
        {m.goals.map((g,i)=>{
          const scorer=pf11(g.scorer);
          const assister=g.assist?pf11(g.assist):null;
          return <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<m.goals.length-1?`1px solid ${T.cardBorder}`:"none"}}>
            <span style={{fontSize:11,color:T.textMuted,width:28,fontWeight:600}}>{g.min}'</span>
            <Badge c={g.team==="A"?T.accent:T.orange}>{g.team==="A"?"A":"B"}</Badge>
            <div style={{flex:1,fontSize:13}}>
              <span onClick={scorer?.guest?undefined:()=>onNav("S16",scorer?.id)} style={{color:scorer?.guest?T.textDim:T.text,fontWeight:600,cursor:scorer?.guest?"default":"pointer"}}>{scorer?.name||"Belirtilmemiş"}</span>
              {assister&&<span style={{color:T.textDim}}> ({assister.name.split(" ")[0]} asist)</span>}
            </div>
          </div>;
        })}
      </div>
    </div>

  </div>;
}

// ============================================================
// InlineChat — S12 içinde kullanılan maç sohbet bileşeni
// ============================================================
function InlineChat({isPlayer,onJoin}){
  const chatRef=useRef(null);
  const inputRef=useRef(null);
  const [chatMsgs,setChatMsgs]=useState(CHAT_MSGS);
  const [chatInput,setChatInput]=useState("");
  const ME_ID=1;

  const sendChatMsg=()=>{
    if(!chatInput.trim())return;
    setChatMsgs(prev=>[...prev,{id:Date.now(),from:ME_ID,text:chatInput.trim(),time:new Date().toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"})}]);
    setChatInput("");
    inputRef.current?.focus();
    setTimeout(()=>chatRef.current?.scrollTo({top:chatRef.current.scrollHeight,behavior:"smooth"}),50);
  };

  return <div style={{margin:"0 16px 16px",position:"relative"}}>
    <div style={{background:T.card,borderRadius:14,border:`1px solid ${T.cardBorder}`,overflow:"hidden"}}>
      <div ref={chatRef} style={{height:260,overflowY:"auto",padding:"12px 12px 8px",display:"flex",flexDirection:"column",gap:4,filter:!isPlayer?"blur(5px)":"none",userSelect:!isPlayer?"none":"auto",pointerEvents:!isPlayer?"none":"auto",transition:"filter .3s"}}>
        {chatMsgs.map((msg,idx)=>{
          const isMe=msg.from===ME_ID;
          const sender=uf(msg.from);
          const prev=chatMsgs[idx-1];
          const showName=!isMe&&(!prev||prev.from!==msg.from);
          return <div key={msg.id} style={{alignSelf:isMe?"flex-end":"flex-start",maxWidth:"75%",marginTop:showName?6:0}}>
            <div style={{display:"flex",gap:6,alignItems:"flex-start"}}>
              {!isMe&&<div style={{width:24,flexShrink:0}}>{showName&&sender&&<Av i={sender.av} img={sender.img} s={24}/>}</div>}
              <div>
                {showName&&sender&&<div style={{fontSize:10,fontWeight:600,color:T.accent,marginBottom:2}}>{sender.name.split(" ")[0]}</div>}
                <div style={{background:isMe?T.accent:`${T.bgAlt}`,border:isMe?"none":`1px solid ${T.cardBorder}`,borderRadius:isMe?"12px 12px 3px 12px":"12px 12px 12px 3px",padding:"8px 12px"}}>
                  <div style={{fontSize:13,color:isMe?"#fff":T.text,lineHeight:1.4,wordBreak:"break-word"}}>{msg.text}</div>
                </div>
                <div style={{fontSize:10,color:T.textMuted,marginTop:2,textAlign:isMe?"right":"left"}}>{msg.time}</div>
              </div>
            </div>
          </div>;
        })}
      </div>
      <div style={{borderTop:`1px solid ${T.cardBorder}`,padding:"8px 10px",display:"flex",alignItems:"center",gap:6,background:T.card,filter:!isPlayer?"blur(5px)":"none",pointerEvents:!isPlayer?"none":"auto",transition:"filter .3s"}}>
        <div style={{cursor:"pointer",display:"flex",padding:2}} onClick={()=>alert("Fotoğraf ekleme (demo)")}>{I.attach(T.textDim)}</div>
        <input ref={inputRef} value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendChatMsg();}}} placeholder="Mesaj yaz..." style={{flex:1,padding:"8px 12px",borderRadius:16,border:`1.5px solid ${T.cardBorder}`,background:T.bg,color:T.text,fontSize:13,fontFamily:FB,outline:"none"}} onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.cardBorder}/>
        <div onClick={sendChatMsg} style={{cursor:chatInput.trim()?"pointer":"default",display:"flex",padding:2,opacity:chatInput.trim()?1:.4,transition:"opacity .15s"}}>{I.send(chatInput.trim()?T.accent:T.textMuted)}</div>
      </div>
    </div>
    {!isPlayer&&<div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,zIndex:10,borderRadius:14}}>
      <div style={{fontSize:13,fontWeight:600,color:T.text,textAlign:"center"}}>Sohbete katılmak için maça katıl</div>
      <Btn small primary onClick={onJoin}>Maça Katıl</Btn>
    </div>}
  </div>;
}

// ============================================================
// S12: Planlanan Maç Detay (Henüz oynanmamış)
// ============================================================
function S12({onNav}){
  const m=PLANNED_MATCH;
  const host=uf(m.host);
  // viewMode: "host" | "player" | "guest"
  const [viewMode,setViewMode]=useState("host");
  const [matchState,setMatchState]=useState(()=>{const s=new URLSearchParams(window.location.search).get("state");return s==="playing"?"playing":"planning";}); // "planning" | "playing"
  const isHost=viewMode==="host";
  const isPlayer=viewMode==="host"||viewMode==="player";
  const [hostAfk30,setHostAfk30]=useState(false); // +30dk kuralı simülasyonu
  const [players,setPlayers]=useState(m.players);
  const [joined,setJoined]=useState(m.joined);
  const [tA,setTA]=useState(m.tA||[]);
  const [tB,setTB]=useState(m.tB||[]);
  const [showEditDrawer,setShowEditDrawer]=useState(false);
  const [removeConfirm,setRemoveConfirm]=useState(null);
  const [showDotsMenu,setShowDotsMenu]=useState(false);
  const [showLevelSheet,setShowLevelSheet]=useState(false);
  const [selectedLevel,setSelectedLevel]=useState(null);
  const [joinApplied,setJoinApplied]=useState(false);
  const [editForm,setEditForm]=useState({title:m.title,date:m.date,time:m.time,loc:m.loc,fmt:m.fmt,level:m.level,vis:m.vis});
  const [editLocMode,setEditLocMode]=useState("search");
  const [editLocQuery,setEditLocQuery]=useState("");
  const [editSelectedLoc,setEditSelectedLoc]=useState(m.loc);
  const [editSelCity,setEditSelCity]=useState(m.loc?.type==="area"?m.loc.city:null);
  const [editSelDistrict,setEditSelDistrict]=useState(m.loc?.type==="area"?m.loc.district:null);
  const editLocFiltered=editLocQuery.length>=2?LOC_RESULTS.filter(l=>l.name.toLowerCase().includes(editLocQuery.toLowerCase())||l.addr.toLowerCase().includes(editLocQuery.toLowerCase())):[];
  const [infoTab,setInfoTab]=useState("details"); // "details" | "players"
  const [toast,setToast]=useState(null);
  useEffect(()=>{if(toast){const t=setTimeout(()=>setToast(null),2000);return()=>clearTimeout(t);}},[toast]);

  // Host: remove player from match entirely
  const removePlayer=(uid)=>{
    setPlayers(p=>p.filter(x=>x!==uid));
    setTA(a=>a.filter(x=>x!==uid));
    setTB(b=>b.filter(x=>x!==uid));
    setJoined(j=>j-1);
    setRemoveConfirm(null);
  };
  // Host: leave match → transfer to earliest joined player
  const hostLeave=()=>{
    const others=players.filter(uid=>uid!==m.host);
    if(others.length>0){alert(`Host yetkisi ${uf(others[0])?.name}'a devredildi.`);}
    setPlayers(p=>p.filter(x=>x!==m.host));
    setTA(a=>a.filter(x=>x!==m.host));
    setTB(b=>b.filter(x=>x!==m.host));
    setJoined(j=>j-1);
    setViewMode("guest");
    setShowDotsMenu(false);
  };
  const joinMatch=()=>setShowLevelSheet(true);
  const confirmJoin=()=>{
    setShowLevelSheet(false);
    if(m.mode==="approval"){setJoinApplied(true);}
    else{setPlayers(p=>[...p,1]);setJoined(j=>j+1);setViewMode("player");}
  };
  const leaveMatch=()=>{
    setPlayers(p=>p.filter(x=>x!==1));
    setTA(a=>a.filter(x=>x!==1));
    setTB(b=>b.filter(x=>x!==1));
    setJoined(j=>j-1);
    setViewMode("guest");
  };

  return <div style={{paddingBottom:80}}>
    {/* State switcher (dev only) */}
    <div style={{background:`${T.cardBorder}`,padding:"6px 12px",display:"flex",gap:6,alignItems:"center"}}>
      <span style={{fontSize:10,color:T.textMuted,fontWeight:600,marginRight:4}}>STATE:</span>
      {["host","player","guest"].map(m=><span key={m} onClick={()=>setViewMode(m)} style={{padding:"3px 10px",borderRadius:6,fontSize:11,fontWeight:600,cursor:"pointer",background:viewMode===m?T.accent:`${T.textDim}22`,color:viewMode===m?"#fff":T.textDim}}>{m==="host"?"Host":m==="player"?"Katılımcı":"Misafir"}</span>)}
    </div>
    <div style={{background:`${T.cardBorder}`,padding:"6px 12px",display:"flex",gap:6,alignItems:"center"}}>
      <span style={{fontSize:10,color:T.textMuted,fontWeight:600,marginRight:4}}>MATCH:</span>
      {["planning","playing"].map(s=><span key={s} onClick={()=>setMatchState(s)} style={{padding:"3px 10px",borderRadius:6,fontSize:11,fontWeight:600,cursor:"pointer",background:matchState===s?T.accent:`${T.textDim}22`,color:matchState===s?"#fff":T.textDim}}>{s==="planning"?"Maç Planlama":"Maç Oynanıyor"}</span>)}
    </div>
    <div style={{background:`${T.cardBorder}`,padding:"6px 12px",display:"flex",gap:6,alignItems:"center"}}>
      <span onClick={()=>setHostAfk30(!hostAfk30)} style={{padding:"3px 10px",borderRadius:6,fontSize:11,fontWeight:600,cursor:"pointer",border:`1.5px solid ${hostAfk30?T.orange:"transparent"}`,background:hostAfk30?`${T.orange}15`:`${T.textDim}22`,color:hostAfk30?T.orange:T.textDim}}>⏰ +30dk Kuralı: {hostAfk30?"ON":"OFF"}</span>
    </div>

    {/* Header */}
    <div style={{padding:"12px 16px 0"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
        <div onClick={()=>window.location.assign(matchState==="playing"?"/03_matches?view=S10":"/03_matches")} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>{I.arrowLeft()}<span style={{fontSize:14,fontWeight:600,color:T.textDim}}>{matchState==="playing"?"Canlı Skor":"Maçlar"}</span></div>
      </div>
    </div>

    {/* Title + action buttons */}
    <div style={{padding:"0 16px 0"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
        <span style={{fontSize:20,fontWeight:800,color:T.text,fontFamily:FH,flex:1}}>{m.title}</span>
        {/* Share button */}
        <div onClick={()=>onNav("S30","planned")} style={{width:36,height:36,borderRadius:10,background:T.card,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>{I.share(T.textDim)}</div>
        {/* ⋮ Dots menu (katılımcı/host) */}
        {isPlayer&&<div style={{position:"relative"}}>
          <div onClick={()=>setShowDotsMenu(!showDotsMenu)} style={{width:36,height:36,borderRadius:10,background:showDotsMenu?`${T.accent}10`:T.card,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
            <span style={{fontSize:18,color:T.textDim,lineHeight:1,letterSpacing:2}}>⋮</span>
          </div>
          {showDotsMenu&&<div style={{position:"absolute",right:0,top:42,background:T.card,borderRadius:12,border:`1px solid ${T.cardBorder}`,padding:4,minWidth:160,zIndex:100,boxShadow:"0 8px 24px rgba(0,0,0,.25)"}}>
            {isHost&&<div onClick={()=>{setShowDotsMenu(false);setShowEditDrawer(true);}} style={{padding:"10px 14px",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:600,color:T.text,display:"flex",alignItems:"center",gap:8}} onMouseEnter={e=>e.currentTarget.style.background=`${T.textDim}10`} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>{I.edit(T.textDim)} Düzenle</div>}
            {isHost&&m.mode==="approval"&&<div onClick={()=>{setShowDotsMenu(false);onNav("S13");}} style={{padding:"10px 14px",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:600,color:T.text,display:"flex",alignItems:"center",gap:8}} onMouseEnter={e=>e.currentTarget.style.background=`${T.textDim}10`} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>{I.users(T.textDim)} Başvurular</div>}
            {!isHost&&isPlayer&&<div onClick={()=>{setShowDotsMenu(false);setToast("Host'a bildirim gönderildi — 2 saat içinde yanıt vermezse host yetkin olacak");setTimeout(()=>setToast(null),4000);}} style={{padding:"10px 14px",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:600,color:T.orange,display:"flex",alignItems:"center",gap:8}} onMouseEnter={e=>e.currentTarget.style.background=`${T.orange}10`} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>⚠️ Host Yanıt Vermiyor</div>}
            <div onClick={()=>{setShowDotsMenu(false);isHost?hostLeave():leaveMatch();}} style={{padding:"10px 14px",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:600,color:T.red,display:"flex",alignItems:"center",gap:8}} onMouseEnter={e=>e.currentTarget.style.background=`${T.red}10`} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>Maçtan Çık</div>
          </div>}
        </div>}
      </div>

      {/* Organizer */}
      <div onClick={()=>onNav("S16",host.id)} style={{display:"flex",alignItems:"center",gap:10,marginBottom:16,cursor:"pointer"}}>
        <Av i={host.av} img={host.img} s={32}/>
        <div>
          <div style={{fontSize:13,fontWeight:600,color:T.text}}>{host.name}</div>
          <div style={{fontSize:11,color:T.textDim}}>Organizatör</div>
        </div>
      </div>

      {/* Description */}
      {m.desc&&<div style={{fontSize:14,color:T.textDim,lineHeight:1.6,marginBottom:16}}>{m.desc}</div>}

      {/* Info card with tabs */}
      <div style={{background:T.card,borderRadius:14,border:`1px solid ${T.cardBorder}`,marginBottom:0,overflow:"hidden"}}>
        {/* Tab header */}
        <div style={{display:"flex",borderBottom:`1px solid ${T.cardBorder}`}}>
          {[{id:"details",l:"Detaylar"},{id:"players",l:`Katılımcılar (${joined})`}].map(t=>(
            <div key={t.id} onClick={()=>setInfoTab(t.id)} style={{flex:1,textAlign:"center",padding:"11px 0",fontSize:13,fontWeight:600,color:infoTab===t.id?T.accent:T.textDim,borderBottom:infoTab===t.id?`2px solid ${T.accent}`:"2px solid transparent",cursor:"pointer",transition:"all .2s"}}>
              {t.l}
            </div>
          ))}
        </div>
        {/* Tab content */}
        <div style={{padding:16}}>
          {infoTab==="details"&&<div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{display:"flex",width:28}}>{I.clock(T.accent)}</span>
              <span style={{fontSize:14,color:T.text,fontWeight:500}}>{m.date}, {m.time}</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{display:"flex",width:28}}>{I.pin(T.accent)}</span>
              <div style={{flex:1}}>
                <span style={{fontSize:14,color:T.text,fontWeight:500}}>{m.loc.type==="place"?m.loc.name:`${m.loc.city}, ${m.loc.district}`}</span>
                {m.loc.addr&&<div style={{fontSize:11,color:T.textDim,marginTop:2}}>{m.loc.addr}</div>}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:5,padding:"5px 10px",borderRadius:8,border:`1px solid ${T.accent}55`,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>
                <span style={{display:"flex"}}>{I.pin(T.accent)}</span>
                <span style={{fontSize:11,color:T.accent,fontWeight:600}}>Halısaha Seç</span>
              </div>
            </div>
          </div>}
          {infoTab==="players"&&<div style={{display:"flex",flexDirection:"column",gap:2}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <span style={{fontSize:13,fontWeight:700,color:T.text}}>{joined}/{m.max} katılımcı</span>
              <div style={{flex:1,height:3,borderRadius:2,background:`${T.textDim}22`}}>
                <div style={{height:3,borderRadius:2,background:(joined/m.max)>=.9?T.orange:T.accent,width:`${joined/m.max*100}%`,transition:"width .3s"}}/>
              </div>
              <span style={{fontSize:11,color:(m.max-joined)<=2?T.orange:T.textDim,whiteSpace:"nowrap"}}>{m.max-joined} yer kaldı</span>
            </div>
            {players.map((uid,idx)=>{
              const u=uf(uid);if(!u)return null;
              const isThisHost=uid===m.host;
              const isCoHost=!isThisHost&&idx===1; // second player = co-host
              return <div key={uid} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${T.cardBorder}33`}}>
                <Av i={u.av} img={u.img} s={36}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:600,color:T.text,display:"flex",alignItems:"center",gap:6}}>
                    {u.name}
                    {isThisHost&&<Badge c={T.gold}>{I.crown(T.gold)} Host</Badge>}
                    {isCoHost&&<Badge c={T.accent}>Co-Host</Badge>}
                  </div>
                  <div style={{fontSize:11,color:T.textMuted}}>@{u.un}</div>
                </div>
                {isHost&&!isThisHost&&<div onClick={()=>setRemoveConfirm(uid)} style={{padding:"5px 10px",borderRadius:8,border:`1px solid ${T.red}44`,color:T.red,fontSize:11,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}}>Çıkar</div>}
              </div>;
            })}
            {Array.from({length:m.max-joined}).map((_,i)=>(
              <div key={`e${i}`} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${T.cardBorder}22`}}>
                <div style={{width:36,height:36,borderRadius:"50%",border:`1.5px dashed ${T.cardBorder}`,background:"transparent",flexShrink:0}}/>
                <span style={{fontSize:13,color:T.textMuted}}>Boş yer</span>
              </div>
            ))}
          </div>}
        </div>
      </div>
    </div>

    {/* Chat section label */}
    <div style={{padding:"12px 16px 8px",display:"flex",alignItems:"center",gap:8}}>
      {I.chat(T.textMuted)}
      <span style={{fontSize:12,fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:.5}}>Maç Sohbeti</span>
    </div>

    {/* === Inline Match Chat === */}
    <InlineChat isPlayer={isPlayer} onJoin={joinMatch}/>

    {/* Remove player confirm modal (host) */}
    {removeConfirm&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.35)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{background:T.card,borderRadius:16,padding:24,maxWidth:360,width:"100%",border:`1px solid ${T.cardBorder}`}}>
        <div style={{fontSize:16,fontWeight:800,color:T.text,fontFamily:FH,marginBottom:8}}>Oyuncuyu Çıkar</div>
        <div style={{fontSize:13,color:T.textDim,marginBottom:20}}><span style={{fontWeight:700,color:T.text}}>{uf(removeConfirm)?.name}</span> kişisini maçtan çıkartmak istediğinize emin misiniz?</div>
        <div style={{display:"flex",gap:8}}>
          <Btn full danger onClick={()=>removePlayer(removeConfirm)} st={{flex:1}}>Çıkar</Btn>
          <Btn full onClick={()=>setRemoveConfirm(null)} st={{flex:1}}>İptal</Btn>
        </div>
      </div>
    </div>}


    {/* Edit Drawer (host) */}
    {showEditDrawer&&<div style={{position:"fixed",inset:0,zIndex:300,display:"flex",alignItems:"flex-end",maxWidth:430,margin:"0 auto"}}>
      <div onClick={()=>setShowEditDrawer(false)} style={{position:"absolute",inset:0,background:"rgba(0,0,0,.35)"}}/>
      <div style={{position:"relative",width:"100%",background:T.card,borderRadius:"20px 20px 0 0",padding:"20px 20px 32px",zIndex:301,maxHeight:"80vh",overflowY:"auto"}}>
        <div style={{width:40,height:4,borderRadius:2,background:T.cardBorder,margin:"0 auto 20px"}}/>
        <div style={{fontSize:18,fontWeight:800,color:T.text,fontFamily:FH,marginBottom:20}}>Maçı Düzenle</div>
        {[
          {label:"Maç Başlığı",key:"title",placeholder:"ör. Cuma Akşamı Maçı"},
          {label:"Tarih",key:"date",placeholder:"ör. 8 Mar"},
          {label:"Saat",key:"time",placeholder:"ör. 20:00"},
          {label:"Format",key:"fmt",placeholder:"ör. 6v6"},
          {label:"Seviye",key:"level",placeholder:"ör. Herkes"},
        ].map(f=><div key={f.key} style={{marginBottom:14}}>
          <div style={{fontSize:11,fontWeight:700,color:T.textMuted,marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>{f.label}</div>
          <input value={editForm[f.key]} onChange={e=>setEditForm(prev=>({...prev,[f.key]:e.target.value}))} placeholder={f.placeholder} style={{width:"100%",background:T.bg,border:`1.5px solid ${T.cardBorder}`,borderRadius:10,padding:"10px 14px",color:T.text,fontSize:14,outline:"none",boxSizing:"border-box"}}/>
        </div>)}
        {/* Konum düzenleme */}
        <div style={{marginBottom:14}}>
          <div style={{fontSize:11,fontWeight:700,color:T.textMuted,marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>Konum</div>
          {editSelectedLoc?<div style={{background:`${T.green}10`,borderRadius:10,border:`1.5px solid ${T.green}33`,padding:"12px 14px",display:"flex",alignItems:"center",gap:10}}>
            {I.pin(T.green)}
            <div style={{flex:1}}>
              {editSelectedLoc.type==="place"
                ?<><div style={{fontSize:13,fontWeight:600,color:T.text}}>{editSelectedLoc.name}</div><div style={{fontSize:11,color:T.textDim,marginTop:2}}>{editSelectedLoc.addr}</div></>
                :<div style={{fontSize:13,fontWeight:600,color:T.text}}>{editSelectedLoc.city}, {editSelectedLoc.district}</div>}
            </div>
            <span onClick={()=>{setEditSelectedLoc(null);setEditSelCity(null);setEditSelDistrict(null);setEditLocQuery("");}} style={{fontSize:12,color:T.accent,fontWeight:600,cursor:"pointer"}}>Değiştir</span>
          </div>
          :<div>
            <div style={{display:"flex",gap:0,marginBottom:10,borderBottom:`1px solid ${T.cardBorder}`}}>
              {[{id:"search",l:"📍 Saha Ara"},{id:"area",l:"🏙 İl / İlçe"}].map(t=><div key={t.id} onClick={()=>setEditLocMode(t.id)} style={{flex:1,textAlign:"center",padding:"7px 0",fontSize:12,fontWeight:600,color:editLocMode===t.id?T.accent:T.textDim,borderBottom:editLocMode===t.id?`2px solid ${T.accent}`:"2px solid transparent",cursor:"pointer",transition:"all .2s"}}>{t.l}</div>)}
            </div>
            {editLocMode==="search"&&<>
              <div style={{background:T.bg,borderRadius:10,border:`1.5px solid ${editLocQuery.length>=2?T.accent:T.cardBorder}`,padding:"10px 14px",display:"flex",alignItems:"center",gap:10,transition:"border-color .2s"}}>
                {I.search(editLocQuery.length>=2?T.accent:T.textDim)}
                <input value={editLocQuery} onChange={e=>setEditLocQuery(e.target.value)} placeholder="Saha adı veya adres ara..." style={{background:"none",border:"none",color:T.text,fontSize:13,width:"100%",outline:"none",fontWeight:500}}/>
                {editLocQuery.length>0&&<span onClick={()=>setEditLocQuery("")} style={{cursor:"pointer",display:"flex",flexShrink:0}}>{I.x(T.textDim)}</span>}
              </div>
              {editLocFiltered.length>0&&<div style={{background:T.bg,border:`1px solid ${T.cardBorder}`,borderTop:"none",borderRadius:"0 0 10px 10px",overflow:"hidden"}}>
                {editLocFiltered.map((loc,i)=><div key={loc.id} onClick={()=>{setEditSelectedLoc({...loc,type:"place"});setEditLocQuery("");}} style={{padding:"10px 14px",cursor:"pointer",display:"flex",alignItems:"flex-start",gap:10,borderTop:i>0?`1px solid ${T.cardBorder}`:"none",transition:"background .15s"}} onMouseEnter={e=>e.currentTarget.style.background=`${T.accent}08`} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <span style={{display:"flex",marginTop:2,flexShrink:0}}>{I.pin(T.accent)}</span>
                  <div><div style={{fontSize:13,fontWeight:600,color:T.text}}>{loc.name}</div><div style={{fontSize:11,color:T.textDim,marginTop:2}}>{loc.addr}</div></div>
                </div>)}
              </div>}
              {editLocQuery.length>=2&&editLocFiltered.length===0&&<div style={{padding:"10px 0",textAlign:"center",fontSize:12,color:T.textMuted}}>Sonuç bulunamadı</div>}
            </>}
            {editLocMode==="area"&&<>
              <div style={{fontSize:11,fontWeight:600,color:T.textMuted,marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>İl</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:editSelCity?10:0}}>
                {CITIES.map(c=><span key={c} onClick={()=>{setEditSelCity(c);setEditSelDistrict(null);}} style={{padding:"5px 12px",borderRadius:20,fontSize:12,fontWeight:600,cursor:"pointer",background:editSelCity===c?`${T.accent}18`:`${T.textDim}12`,color:editSelCity===c?T.accent:T.textDim,border:`1.5px solid ${editSelCity===c?T.accent+"44":"transparent"}`,transition:"all .15s"}}>{c}</span>)}
              </div>
              {editSelCity&&<>
                <div style={{fontSize:11,fontWeight:600,color:T.textMuted,marginBottom:6,marginTop:4,textTransform:"uppercase",letterSpacing:.5}}>İlçe</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {(DISTRICTS[editSelCity]||[]).map(d=><span key={d} onClick={()=>{setEditSelDistrict(d);setEditSelectedLoc({city:editSelCity,district:d,type:"area"});}} style={{padding:"5px 12px",borderRadius:20,fontSize:12,fontWeight:600,cursor:"pointer",background:editSelDistrict===d?`${T.accent}18`:`${T.textDim}12`,color:editSelDistrict===d?T.accent:T.textDim,border:`1.5px solid ${editSelDistrict===d?T.accent+"44":"transparent"}`,transition:"all .15s"}}>{d}</span>)}
                </div>
              </>}
            </>}
          </div>}
        </div>
        <div style={{marginBottom:14}}>
          <div style={{fontSize:11,fontWeight:700,color:T.textMuted,marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>Görünürlük</div>
          <div style={{display:"flex",gap:8}}>
            {["public","private"].map(v=><div key={v} onClick={()=>setEditForm(prev=>({...prev,vis:v}))} style={{flex:1,padding:"10px 0",textAlign:"center",borderRadius:10,border:`1.5px solid ${editForm.vis===v?T.accent:T.cardBorder}`,background:editForm.vis===v?`${T.accent}10`:"transparent",fontSize:13,fontWeight:600,color:editForm.vis===v?T.accent:T.textDim,cursor:"pointer"}}>{v==="public"?"Herkese Açık":"Sadece Katılımcılar"}</div>)}
          </div>
        </div>
        <Btn full primary onClick={()=>{setEditForm(prev=>({...prev,loc:editSelectedLoc}));setShowEditDrawer(false);}} st={{marginTop:8}}>Kaydet</Btn>
      </div>
    </div>}


    {/* Level Selection Sheet (guest → katıl) */}
    {showLevelSheet&&<div style={{position:"fixed",inset:0,zIndex:300,display:"flex",alignItems:"flex-end",maxWidth:430,margin:"0 auto"}}>
      <div onClick={()=>{setShowLevelSheet(false);setSelectedLevel(null);}} style={{position:"absolute",inset:0,background:"rgba(0,0,0,.35)"}}/>
      <div style={{position:"relative",width:"100%",background:T.card,borderRadius:"20px 20px 0 0",padding:"20px 20px 32px",zIndex:301}}>
        <div style={{width:40,height:4,borderRadius:2,background:T.cardBorder,margin:"0 auto 20px"}}/>
        <div style={{fontSize:18,fontWeight:800,color:T.text,fontFamily:FH,marginBottom:8}}>Seviyeni Seç</div>
        <div style={{fontSize:13,color:T.textDim,marginBottom:20}}>Maça katılmadan önce seviyeni belirle</div>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:24}}>
          {["Başlangıç","Orta","İyi","Profesyonel"].map(lv=>{
            const sel=selectedLevel===lv;
            const lvData={Başlangıç:T.green,Orta:T.accent,İyi:T.orange,Profesyonel:T.gold};
            const c=lvData[lv]||T.accent;
            return <div key={lv} onClick={()=>setSelectedLevel(lv)} style={{padding:"14px 16px",borderRadius:12,background:sel?`${c}12`:T.bg,border:`1.5px solid ${sel?c:T.cardBorder}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",transition:"all .2s"}}>
              <span style={{fontSize:14,fontWeight:sel?700:500,color:sel?c:T.text}}>{lv}</span>
              {sel&&<span style={{display:"flex"}}>{I.check(c)}</span>}
            </div>;
          })}
        </div>
        <Btn full primary disabled={!selectedLevel} onClick={confirmJoin} st={{fontSize:15,fontWeight:700,padding:"14px 24px",borderRadius:12}}>{m.mode==="approval"?"Başvur":"Katıl"}</Btn>
      </div>
    </div>}

    {/* CTA */}
    <div style={{padding:"0 16px"}}>
      {viewMode==="guest"
        ?joinApplied
          ?<Btn full disabled st={{marginBottom:8,background:`${T.accent}18`,color:T.accent,border:`1.5px solid ${T.accent}44`}}>{I.check(T.accent)} Başvuru Gönderildi</Btn>
          :<Btn full primary onClick={joinMatch} st={{marginBottom:8}}>Maça Katıl ({m.max-joined} yer kaldı)</Btn>
        :matchState==="playing"
          ?<Btn full onClick={()=>window.location.assign("/03_matches?view=S10&page=end")} st={{marginBottom:8,background:T.red,color:"#fff"}}>Maçı Bitir</Btn>
          :<Btn full onClick={()=>{isHost?hostLeave():leaveMatch();}} st={{marginBottom:8,background:T.accent,color:"#fff",border:"none"}}>Maçtan Çık</Btn>
      }
    </div>

    {/* Toast */}
    {toast&&<div style={{position:"fixed",bottom:100,left:"50%",transform:"translateX(-50%)",background:T.card,border:`1px solid ${T.cardBorder}`,borderRadius:12,padding:"10px 20px",zIndex:400,boxShadow:"0 4px 16px rgba(0,0,0,.3)"}}>
      <span style={{fontSize:13,fontWeight:600,color:T.text}}>{toast}</span>
    </div>}
  </div>;
}

// ============================================================
// S13: Başvuru Yönetimi (Host)
// ============================================================
function S13({onNav}){
  const m=APPROVAL_MATCH;
  const [pending,setPending]=useState(m.pending);
  const [approved,setApproved]=useState(m.approved);

  const approve=(uid)=>{setPending(p=>p.filter(x=>x.uid!==uid));setApproved(a=>[...a,uid]);};
  const reject=(uid)=>{setPending(p=>p.filter(x=>x.uid!==uid));};

  return <div style={{paddingBottom:80}}>
    {/* Header */}
    <div style={{padding:"12px 16px 0"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
        <span onClick={()=>onNav("S12")} style={{cursor:"pointer",display:"flex"}}>{I.arrowLeft()}</span>
        <span style={{fontSize:18,fontWeight:800,color:T.text,fontFamily:FH}}>Başvuru Yönetimi</span>
      </div>
      <div style={{fontSize:13,color:T.textDim,marginBottom:16,paddingLeft:30}}>{m.title}</div>
    </div>

    {/* Pending applications */}
    <div style={{padding:"0 16px",marginBottom:24}}>
      <div style={{fontSize:12,fontWeight:700,color:T.textMuted,marginBottom:10,textTransform:"uppercase",letterSpacing:.5}}>Bekleyen Başvurular ({pending.length})</div>
      {pending.length>0?pending.map(app=>{
        const u=uf(app.uid);if(!u)return null;
        const lv=LEVELS[app.level];
        return <div key={app.uid} style={{background:T.card,borderRadius:12,border:`1px solid ${T.cardBorder}`,padding:"14px 16px",marginBottom:8}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
            <Av i={u.av} img={u.img} s={40} onClick={()=>onNav("S16",u.id)}/>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:600,color:T.text}}>{u.name}</div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginTop:2}}>
                {lv&&<Badge c={lv.c}>{lv.l}</Badge>}
                <span style={{fontSize:11,color:T.textMuted}}>%{u.att} katılım</span>
                <span style={{fontSize:11,color:T.textMuted}}>{app.date}</span>
              </div>
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <Btn small primary onClick={()=>approve(app.uid)} st={{flex:1}}>{I.check(T.bg)} Onayla</Btn>
            <Btn small danger onClick={()=>reject(app.uid)} st={{flex:1}}>{I.x("#fff")} Reddet</Btn>
          </div>
        </div>;
      }):<div style={{textAlign:"center",padding:"24px 0",color:T.textMuted,fontSize:13}}>Bekleyen başvuru yok</div>}
    </div>

    {/* Approved players */}
    <div style={{padding:"0 16px"}}>
      <div style={{fontSize:12,fontWeight:700,color:T.textMuted,marginBottom:10,textTransform:"uppercase",letterSpacing:.5}}>Onaylı Katılımcılar ({approved.length})</div>
      {approved.map(uid=>{
        const u=uf(uid);if(!u)return null;
        return <div key={uid} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:`1px solid ${T.cardBorder}`}}>
          <Av i={u.av} img={u.img} s={32}/>
          <span style={{fontSize:13,fontWeight:500,color:T.text,flex:1}}>{u.name}</span>
          <Badge c={T.green}>{I.check(T.green)} Onaylı</Badge>
        </div>;
      })}
    </div>
  </div>;
}

// S40: Kaldırıldı — MVP oylama S08 Maçlarım tab'ında inline olarak yapılıyor

// S41: Oyuncu Davet → S12'deki inline Invite Drawer olarak taşındı (standalone kaldırıldı)

// ============================================================
// S30: Paylaş Kartı (Bitmiş Maç + Planlanan Maç)
// ============================================================
function S30({onNav,mode}){
  const isPast=mode==="past"||!mode;
  const m=isPast?PAST_MATCH:PLANNED_MATCH;
  const me=uf(1);
  const myStats=isPast?m.goals.reduce((acc,g)=>{if(g.scorer===1)acc.g++;if(g.assist===1)acc.a++;return acc;},{g:0,a:0}):null;
  const mvps=isPast?m.mvp.map(id=>uf(id)):[];
  const locName=isPast?m.loc:(m.loc?.type==="place"?m.loc.name:`${m.loc?.city}, ${m.loc?.district}`);

  return <div style={{paddingBottom:80}}>
    {/* Header */}
    <div style={{padding:"12px 16px 0"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
        <span onClick={()=>onNav(isPast?"S11":"S12")} style={{cursor:"pointer",display:"flex"}}>{I.arrowLeft()}</span>
        <span style={{fontSize:18,fontWeight:800,color:T.text,fontFamily:FH}}>Paylaş</span>
      </div>
    </div>

    {/* Shareable card preview */}
    <div style={{margin:"0 16px",background:`linear-gradient(135deg, ${T.card} 0%, ${T.bg} 100%)`,borderRadius:20,border:`1.5px solid ${T.cardBorder}`,padding:24,position:"relative",overflow:"hidden"}}>
      {/* Decorative accent line */}
      <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:T.accent}}/>

      {/* Logo */}
      <div style={{fontSize:14,fontWeight:800,color:T.accent,fontFamily:FH,marginBottom:20,letterSpacing:1}}>SPORWAVE</div>

      {/* Match title */}
      <div style={{fontSize:18,fontWeight:800,color:T.text,fontFamily:FH,marginBottom:16}}>{m.title}</div>

      {isPast?<>
        {/* === Bitmiş maç kartı === */}
        {/* Score */}
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:0}}>
            <div style={{flex:1,textAlign:"center"}}>
              <div style={{fontSize:11,fontWeight:700,color:T.accent,marginBottom:4,textTransform:"uppercase"}}>Takım A</div>
              <div style={{fontSize:48,fontWeight:900,fontFamily:FH,color:m.sc[0]>m.sc[1]?T.accent:T.text}}>{m.sc[0]}</div>
            </div>
            <div style={{fontSize:20,color:T.textMuted,fontWeight:300}}>–</div>
            <div style={{flex:1,textAlign:"center"}}>
              <div style={{fontSize:11,fontWeight:700,color:T.orange,marginBottom:4,textTransform:"uppercase"}}>Takım B</div>
              <div style={{fontSize:48,fontWeight:900,fontFamily:FH,color:m.sc[1]>m.sc[0]?T.accent:T.text}}>{m.sc[1]}</div>
            </div>
          </div>
        </div>

        {/* MVP */}
        {mvps.length>0&&<div style={{textAlign:"center",marginBottom:16}}>
          <div style={{fontSize:11,fontWeight:700,color:T.gold,textTransform:"uppercase",marginBottom:6}}>{mvps.length>1?"Co-MVP":"MVP"}</div>
          <div style={{display:"flex",justifyContent:"center",gap:8}}>
            {mvps.map(u=><div key={u.id} style={{display:"flex",alignItems:"center",gap:6}}>
              {I.star(T.gold)}
              <span style={{fontSize:14,fontWeight:700,color:T.gold}}>{u.name}</span>
            </div>)}
          </div>
        </div>}

        {/* My stats (centered) */}
        <div style={{background:`${T.accent}08`,borderRadius:12,padding:"12px 16px",border:`1px solid ${T.accent}22`,textAlign:"center"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:8}}>
            <Av i={me.av} img={me.img} s={28} c={T.accent}/>
            <span style={{fontSize:14,fontWeight:700,color:T.text}}>{me.name}</span>
          </div>
          <div style={{display:"flex",justifyContent:"center",gap:16}}>
            <div><div style={{fontSize:20,fontWeight:900,color:T.accent,fontFamily:FH}}>{myStats.g}</div><div style={{fontSize:10,color:T.textDim,fontWeight:600}}>GOL</div></div>
            <div><div style={{fontSize:20,fontWeight:900,color:T.accent,fontFamily:FH}}>{myStats.a}</div><div style={{fontSize:10,color:T.textDim,fontWeight:600}}>ASİST</div></div>
          </div>
        </div>
      </>:<>
        {/* === Planlanan maç davet kartı === */}
        {/* Info rows */}
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{display:"flex",width:20}}>{I.clock(T.accent)}</span>
            <span style={{fontSize:14,color:T.text,fontWeight:500}}>{m.date}, {m.time}</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{display:"flex",width:20}}>{I.pin(T.accent)}</span>
            <span style={{fontSize:14,color:T.text,fontWeight:500}}>{locName}</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{display:"flex",width:20}}>{I.football(T.accent)}</span>
            <span style={{fontSize:14,color:T.text,fontWeight:500}}>{m.fmt} · {m.level}</span>
          </div>
        </div>

        {/* Capacity */}
        <div style={{background:`${T.accent}08`,borderRadius:12,padding:"12px 16px",border:`1px solid ${T.accent}22`}}>
          <div style={{fontSize:14,fontWeight:700,color:T.accent,marginBottom:8,textAlign:"center"}}>{m.max-m.joined} yer kaldı!</div>
          <CapacityBar joined={m.joined} max={m.max}/>
        </div>
      </>}

      {/* Meta */}
      <div style={{display:"flex",gap:8,marginTop:16,fontSize:11,color:T.textDim,flexWrap:"wrap"}}>
        <span>{m.date}</span>
        <span>·</span>
        <span>{locName}</span>
        <span>·</span>
        <span>{m.fmt}</span>
      </div>

    </div>

    {/* Share button */}
    <div style={{padding:"20px 16px"}}>
      <Btn full primary>{I.share(T.bg)} Paylaş</Btn>
    </div>
  </div>;
}

// ============================================================
// MAIN
// ============================================================
export default function SporWaveMatchDetail(){
  const [cur,setCur]=useState("S11");
  const [curId,setCurId]=useState(null);
  const [fade,setFade]=useState(true);

  useEffect(()=>{if(!document.querySelector('link[href*="Plus+Jakarta+Sans"]')){const l=document.createElement("link");l.href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap";l.rel="stylesheet";document.head.appendChild(l);}},[]);
  useEffect(()=>{
    const view=new URLSearchParams(window.location.search).get("view");
    const allowed=["S11","S12","S13","S30"];
    if(view&&allowed.includes(view))setCur(view);
  },[]);

  const nav=(p,id)=>{setFade(false);setTimeout(()=>{setCur(p);setCurId(id||null);setFade(true);},120);};

  const pg=()=>{
    switch(cur){
      case "S11":return <S11 onNav={nav}/>;
      case "S12":return <S12 onNav={nav}/>;
      case "S13":return <S13 onNav={nav}/>;
      case "S30":return <S30 onNav={nav} mode={curId}/>;
      default:return <S11 onNav={nav}/>;
    }
  };

  return <div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",background:T.bg,color:T.text,fontFamily:FB,position:"relative",boxShadow:"0 0 40px rgba(0,0,0,.08)"}}>
    {/* Dev ribbon */}
    <div style={{position:"sticky",top:0,zIndex:200,background:T.bgAlt,borderBottom:`1px solid ${T.cardBorder}`,padding:"6px 8px",display:"flex",gap:4,flexWrap:"wrap"}}>
      {[{p:"S11",l:"Geçmiş Maç"},{p:"S12",l:"Planlanan Maç"},{p:"S13",l:"Başvurular"},{p:"S30",l:"Paylaş"}].map(n=><span key={n.p} onClick={()=>nav(n.p)} style={{padding:"4px 10px",borderRadius:6,fontSize:11,fontWeight:600,background:cur===n.p?T.accent:`${T.textDim}22`,color:cur===n.p?"#fff":T.textDim,cursor:"pointer"}}>{n.l}</span>)}
    </div>
    <div style={{opacity:fade?1:0,transform:fade?"none":"translateY(6px)",transition:"all .12s ease"}}>{pg()}</div>
    <TabBar active="S08" onNav={nav}/>
  </div>;
}
