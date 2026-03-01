import { useState, useEffect } from "react";

// ============================================================
// SPORWAVE MODULE 4 — Maç Detay (S11, S12, S13, S40, S41, S30)
// S11: Geçmiş maç detay (oynanmış)
// S12: Planlanan maç detay (henüz oynanmamış)
// S13: Başvuru yönetimi (host)
// S40: Puanlama & Attendance (maç sonrası)
// S41: Oyuncu davet (bottom sheet)
// S30: Shareable kart (maç sonrası)
// ============================================================

const T={accent:"#B7F000",bg:"#0B0F14",bgAlt:"#060810",card:"#141A22",cardBorder:"#1E2730",text:"#F0F2F5",textDim:"#8A95A5",textMuted:"#5A6577",red:"#FF4757",green:"#2ED573",orange:"#FF8C42",gold:"#FFD700",purple:"#A78BFA"};
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
  sc:[5,3],host:1,mvp:[4],
  tA:[1,2,4],tB:[3,5,6],
  noShow:[],
  goals:[
    {min:3,scorer:4,assist:1,team:"A"},
    {min:12,scorer:3,assist:null,team:"B"},
    {min:18,scorer:1,assist:2,team:"A"},
    {min:25,scorer:4,assist:null,team:"A"},
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
  id:101,title:"Cumartesi Akşam Maçı",desc:"Her seviyeden oyuncu bekliyoruz, keyifli bir maç olacak. Sahada buluşalım!",date:"1 Mar",time:"20:00",loc:"Kadıköy Spor Tesisleri",fmt:"6v6",
  host:2,joined:7,max:12,level:"Herkes",mode:"open",vis:"public",
  players:[2,1,4,3,7,8,5],
  tA:[2,1,4], // Takım A (atanmış)
  tB:[3,7],   // Takım B (atanmış)
  // players içinde tA+tB dışındakiler → takımsız (unassigned)
  hostTakeover:null, // or {requester:3,votesYes:2,votesNo:1,total:7,deadline:"23sa"}
};

// Mock: Planned match with approval mode (S13)
const APPROVAL_MATCH={
  id:102,title:"Pazar Sabah Maçı",date:"2 Mar",time:"10:00",loc:"Beşiktaş Halısaha",fmt:"5v5",
  host:1,joined:6,max:10,level:"Orta+",mode:"approval",vis:"public",
  players:[1,2,4],
  pending:[{uid:6,level:"mid",date:"Bugün"},{uid:7,level:"beginner",date:"Dün"},{uid:5,level:"beginner",date:"Dün"}],
  approved:[1,2,4],
};

// Mock: Unrated match (S40)
const UNRATED_MATCH={
  id:201,title:"Perşembe Maçı",date:"27 Şub",time:"19:00",sc:[3,2],fmt:"5v5",
  players:[1,2,3,4,5,6,7,8],
};

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
  play:c=><svg width="16" height="16" viewBox="0 0 24 24" fill={c||T.bg} style={{marginLeft:1}}><polygon points="5,3 19,12 5,21"/></svg>,
  vote:c=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c||T.accent} strokeWidth="2" strokeLinecap="round"><path d="M14 9V5a3 3 0 00-6 0v4"/><rect x="2" y="9" width="20" height="13" rx="2"/><path d="M12 17v-4"/></svg>,
};

// Shared Components
function Av({i,img,s=32,c=T.accent,onClick,st}){return <div onClick={onClick} style={{width:s,height:s,borderRadius:"50%",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",background:`${c}18`,border:`1.5px solid ${c}44`,color:c,fontSize:s*.34,fontWeight:700,cursor:onClick?"pointer":"default",flexShrink:0,...st}}>{img?<img src={img} alt="" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>:i}</div>;}
function Btn({children,primary,danger,small,full,ghost,onClick,disabled,st}){const[h,setH]=useState(false);return <button disabled={disabled} onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{padding:small?"7px 14px":"12px 20px",borderRadius:10,border:primary||danger?"none":`1.5px solid ${ghost?"transparent":T.cardBorder}`,background:disabled?`${T.textDim}22`:danger?T.red:primary?T.accent:"transparent",color:disabled?T.textDim:danger?"#fff":primary?T.bg:T.text,fontSize:small?12:14,fontWeight:600,cursor:disabled?"not-allowed":"pointer",width:full?"100%":"auto",transition:"all .2s",transform:h&&!disabled?"translateY(-1px)":"none",display:"flex",alignItems:"center",justifyContent:"center",gap:6,...st}}>{children}</button>;}
function Badge({children,c=T.accent,st}){return <span style={{display:"inline-flex",alignItems:"center",gap:3,padding:"2px 8px",borderRadius:20,fontSize:11,fontWeight:600,color:c,background:`${c}15`,whiteSpace:"nowrap",...st}}>{children}</span>;}
function CapacityBar({joined,max}){const pct=joined/max*100;return <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{flex:1,height:4,borderRadius:2,background:`${T.textDim}22`}}><div style={{height:4,borderRadius:2,background:pct>=90?T.orange:T.accent,width:`${pct}%`,transition:"width .3s"}}/></div><span style={{fontSize:11,color:T.textDim,fontWeight:600,whiteSpace:"nowrap"}}>{joined}/{max}</span></div>;}
function TabBar({active,onNav}){
  const tabs=[{id:"S05",ic:I.home,l:"Ana Sayfa"},{id:"S08",ic:I.football,l:"Maçlar"},{id:"S15",ic:I.user,l:"Profil"}];
  const handleTabClick=(tabId)=>{
    if(tabId==="S05"){window.location.assign("/02_feed");return;}
    if(tabId==="S15"){window.location.assign("/05_profile");return;}
    if(tabId==="S08"){onNav("S08");return;}
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

  // Count goals & assists per player
  const stats={};
  m.goals.forEach(g=>{
    if(g.scorer){stats[g.scorer]=stats[g.scorer]||{g:0,a:0};stats[g.scorer].g++;}
    if(g.assist){stats[g.assist]=stats[g.assist]||{g:0,a:0};stats[g.assist].a++;}
  });

  const PlayerRow=({uid,team})=>{
    const u=uf(uid);if(!u)return null;
    const s=stats[uid];
    const isMvp=m.mvp.includes(uid);
    const isNoShow=m.noShow.includes(uid);
    return <div onClick={()=>!u.guest&&onNav("S16",uid)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:`1px solid ${T.cardBorder}22`,cursor:u.guest?"default":"pointer",opacity:isNoShow?.5:1}}>
      <Av i={u.av} img={u.img} s={32} c={isMvp?T.gold:team==="A"?T.accent:T.orange}/>
      <div style={{flex:1}}>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <span style={{fontSize:13,fontWeight:600,color:u.guest?T.textDim:T.text}}>{u.name}</span>
          {isMvp&&<Badge c={T.gold}>{I.star(T.gold)} MVP</Badge>}
          {u.guest&&<Badge c={T.textMuted}>Misafir</Badge>}
          {isNoShow&&<Badge c={T.red}>Katılmadı</Badge>}
        </div>
      </div>
      {s&&<div style={{display:"flex",gap:8,fontSize:11,color:T.textDim}}>
        {s.g>0&&<span style={{fontWeight:600}}>{s.g} gol</span>}
        {s.a>0&&<span>{s.a} asist</span>}
      </div>}
    </div>;
  };

  return <div style={{paddingBottom:80}}>
    {/* Header */}
    <div style={{padding:"12px 16px 0"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
        <span onClick={()=>onNav("S08")} style={{cursor:"pointer",display:"flex"}}>{I.arrowLeft()}</span>
        <span style={{fontSize:18,fontWeight:800,color:T.text,fontFamily:FH,flex:1}}>Maç Detay</span>
        <span onClick={()=>onNav("S30")} style={{cursor:"pointer",display:"flex"}}>{I.share(T.textDim)}</span>
      </div>
    </div>

    {/* Title + Score */}
    <div style={{textAlign:"center",padding:"0 16px 20px"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:12}}>
        {I.football(T.accent)}
        <span style={{fontSize:20,fontWeight:800,color:T.text,fontFamily:FH}}>{m.title}</span>
      </div>
      <div style={{fontSize:48,fontWeight:900,fontFamily:FH,marginBottom:8}}>
        <span style={{color:m.sc[0]>m.sc[1]?T.accent:T.text}}>{m.sc[0]}</span>
        <span style={{color:T.textMuted,margin:"0 12px",fontSize:24}}>–</span>
        <span style={{color:m.sc[1]>m.sc[0]?T.accent:T.text}}>{m.sc[1]}</span>
      </div>
      <div style={{display:"flex",justifyContent:"center",gap:12,fontSize:12,color:T.textDim,flexWrap:"wrap"}}>
        <span style={{display:"flex",alignItems:"center",gap:4}}>{I.clock()} {m.date}, {m.time}</span>
        <span style={{display:"flex",alignItems:"center",gap:4}}>{I.pin()} {m.loc}</span>
        <Badge c={T.textDim}>{m.fmt}</Badge>
        <span style={{display:"flex",alignItems:"center",gap:4}}>{I.clock()} {m.dur}</span>
      </div>
    </div>

    {/* MVP highlight */}
    {mvps.length>0&&<div style={{margin:"0 16px 16px",background:`${T.gold}08`,borderRadius:14,border:`1.5px solid ${T.gold}22`,padding:"14px 16px",textAlign:"center"}}>
      <div style={{fontSize:12,fontWeight:700,color:T.gold,marginBottom:8,textTransform:"uppercase",letterSpacing:.5}}>{mvps.length>1?"Co-MVP":"Maçın Yıldızı"}</div>
      <div style={{display:"flex",justifyContent:"center",gap:16}}>
        {mvps.map(u=><div key={u.id} onClick={()=>onNav("S16",u.id)} style={{cursor:"pointer",textAlign:"center"}}>
          <Av i={u.av} img={u.img} s={48} c={T.gold} st={{margin:"0 auto",border:`2px solid ${T.gold}`}}/>
          <div style={{fontSize:13,fontWeight:700,color:T.gold,marginTop:6}}>{u.name}</div>
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
          const scorer=uf(g.scorer);
          const assister=g.assist?uf(g.assist):null;
          return <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<m.goals.length-1?`1px solid ${T.cardBorder}22`:"none"}}>
            <span style={{fontSize:11,color:T.textMuted,width:28,fontWeight:600}}>{g.min}'</span>
            <Badge c={g.team==="A"?T.accent:T.orange}>{g.team==="A"?"A":"B"}</Badge>
            <div style={{flex:1,fontSize:13}}>
              <span onClick={()=>onNav("S16",scorer.id)} style={{color:T.text,fontWeight:600,cursor:"pointer"}}>{scorer.name}</span>
              {assister&&<span style={{color:T.textDim}}> ({assister.name.split(" ")[0]} asist)</span>}
            </div>
          </div>;
        })}
      </div>
    </div>

    {/* Posts from this match */}
    <div style={{padding:"0 16px"}}>
      <div style={{fontSize:12,fontWeight:700,color:T.textMuted,marginBottom:10,textTransform:"uppercase",letterSpacing:.5}}>Bu Maçın Postları</div>
      {m.posts.map(p=>{
        const owner=uf(p.userId);
        return <div key={p.id} onClick={()=>onNav("S42",p.id)} style={{background:T.card,borderRadius:12,border:`1px solid ${T.cardBorder}`,padding:"12px 14px",marginBottom:8,cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
          <Av i={owner.av} img={owner.img} s={36}/>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:600,color:T.text}}>{owner.name}</div>
            <div style={{fontSize:12,color:T.textDim,marginTop:2}}>{p.caption||"Post paylaştı"}</div>
          </div>
          <div style={{fontSize:11,color:T.textMuted,textAlign:"right"}}>
            <div>{p.likes} beğeni</div>
            <div>{p.coms} yorum</div>
          </div>
        </div>;
      })}
    </div>
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
  const remaining=m.max-m.joined;
  const [players,setPlayers]=useState(m.players);
  const [joined,setJoined]=useState(m.joined);
  const [tA,setTA]=useState(m.tA||[]);
  const [tB,setTB]=useState(m.tB||[]);
  const [dragTarget,setDragTarget]=useState(null);
  const [showEditDrawer,setShowEditDrawer]=useState(false);
  const [showInviteDrawer,setShowInviteDrawer]=useState(false);
  const [removeConfirm,setRemoveConfirm]=useState(null); // uid to confirm removal
  const [editForm,setEditForm]=useState({title:m.title,date:m.date,time:m.time,loc:m.loc,fmt:m.fmt,level:m.level,vis:m.vis});
  const [inviteQ,setInviteQ]=useState("");
  const [inviteSent,setInviteSent]=useState([]);
  const friends=U.filter(u=>u.follow&&u.id!==1);
  const filteredFriends=inviteQ.length>0?friends.filter(u=>u.name.toLowerCase().includes(inviteQ.toLowerCase())||u.un.toLowerCase().includes(inviteQ.toLowerCase())):friends;

  const assigned=new Set([...tA,...tB]);
  const unassigned=players.filter(uid=>!assigned.has(uid));
  const teamSize=parseInt(m.fmt); // "6v6" → 6

  // Host: assign player to team
  const assignToTeam=(uid,team)=>{
    if(team==="A"&&tA.length<teamSize){setTA(a=>[...a.filter(x=>x!==uid),uid]);setTB(b=>b.filter(x=>x!==uid));}
    else if(team==="B"&&tB.length<teamSize){setTB(b=>[...b.filter(x=>x!==uid),uid]);setTA(a=>a.filter(x=>x!==uid));}
    setDragTarget(null);
  };
  // Host: unassign player from team (move back to Katılımcılar)
  const unassignPlayer=(uid)=>{
    setTA(a=>a.filter(x=>x!==uid));
    setTB(b=>b.filter(x=>x!==uid));
  };
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
    // En eski katılımcı = players listesinde host (uid=2) hariç ilk kişi
    const others=players.filter(uid=>uid!==m.host);
    if(others.length>0){
      // Host transferi simülasyonu: viewMode → guest, yeni host bildirimi
      alert(`Host yetkisi ${uf(others[0])?.name}'a devredildi.`);
    }
    setPlayers(p=>p.filter(x=>x!==m.host));
    setTA(a=>a.filter(x=>x!==m.host));
    setTB(b=>b.filter(x=>x!==m.host));
    setJoined(j=>j-1);
    setViewMode("guest");
    setShowDotsMenu(false);
  };
  // Guest: join match
  const joinMatch=()=>{
    setPlayers(p=>[...p,1]);
    setJoined(j=>j+1);
    setViewMode("player");
  };
  // Player: leave match
  const leaveMatch=()=>{
    setPlayers(p=>p.filter(x=>x!==1));
    setTA(a=>a.filter(x=>x!==1));
    setTB(b=>b.filter(x=>x!==1));
    setJoined(j=>j-1);
    setViewMode("guest");
  };

  const BADGE_H=18;
  const PlayerCell=({uid,teamColor})=>{
    const u=uf(uid);if(!u)return null;
    const isHostUser=uid===m.host;
    const isDragging=dragTarget===uid;
    return <div
      style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"4px 4px 8px",cursor:isHost?"grab":"default",opacity:isDragging?.6:1,transition:"opacity .15s"}}
      onClick={isHost?()=>setDragTarget(isDragging?null:uid):()=>onNav("S16",uid)}
    >
      <div style={{height:BADGE_H,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
        {isHostUser&&<Badge c={T.gold} st={{fontSize:8,padding:"1px 5px",lineHeight:1.2}}>{I.crown(T.gold)}</Badge>}
      </div>
      <div style={{position:"relative"}}>
        <Av i={u.av} img={u.img} s={36} c={isDragging?T.accent:teamColor}/>
        {isHost&&uid!==m.host&&<div
          onClick={e=>{e.stopPropagation();unassignPlayer(uid);}}
          style={{position:"absolute",top:-4,right:-4,width:16,height:16,borderRadius:"50%",background:T.textMuted,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}
        ><span style={{color:"#fff",fontSize:9,fontWeight:700,lineHeight:1}}>✕</span></div>}
      </div>
      <span style={{fontSize:10,fontWeight:600,color:T.text,textAlign:"center",maxWidth:56,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.name.split(" ")[0]}</span>
    </div>;
  };

  const EmptySlot=({team})=><div
    style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"4px 4px 8px",cursor:dragTarget?isHost?"pointer":"default":"default"}}
    onClick={dragTarget&&isHost?()=>assignToTeam(dragTarget,team):undefined}
  >
    <div style={{height:BADGE_H}}/>
    <div style={{width:36,height:36,borderRadius:"50%",border:`1.5px dashed ${dragTarget&&isHost?T.accent:T.cardBorder}`,display:"flex",alignItems:"center",justifyContent:"center",background:dragTarget&&isHost?`${T.accent}10`:"transparent",transition:"all .2s"}}>
      <span style={{fontSize:16,color:dragTarget&&isHost?T.accent:T.textMuted,lineHeight:1}}>+</span>
    </div>
    <span style={{fontSize:10,color:dragTarget&&isHost?T.accent:T.textMuted}}>Boş</span>
  </div>;

  const emptyA=teamSize-tA.length;
  const emptyB=teamSize-tB.length;
  const rowCount=Math.ceil(Math.max(tA.length+emptyA,tB.length+emptyB)/3);
  const slotsA=[...tA.map(uid=>({uid,empty:false})),...Array.from({length:emptyA},(_,i)=>({uid:null,empty:true,k:`ea${i}`}))];
  const slotsB=[...tB.map(uid=>({uid,empty:false})),...Array.from({length:emptyB},(_,i)=>({uid:null,empty:true,k:`eb${i}`}))];

  return <div style={{paddingBottom:80}}>
    {/* State switcher (dev only) */}
    <div style={{background:`${T.cardBorder}44`,padding:"6px 12px",display:"flex",gap:6,alignItems:"center"}}>
      <span style={{fontSize:10,color:T.textMuted,fontWeight:600,marginRight:4}}>STATE:</span>
      {["host","player","guest"].map(m=><span key={m} onClick={()=>setViewMode(m)} style={{padding:"3px 10px",borderRadius:6,fontSize:11,fontWeight:600,cursor:"pointer",background:viewMode===m?T.accent:`${T.textDim}22`,color:viewMode===m?T.bg:T.textDim}}>{m==="host"?"Host":m==="player"?"Katılımcı":"Misafir"}</span>)}
    </div>
    <div style={{background:`${T.cardBorder}44`,padding:"6px 12px",display:"flex",gap:6,alignItems:"center"}}>
      <span style={{fontSize:10,color:T.textMuted,fontWeight:600,marginRight:4}}>MATCH:</span>
      {["planning","playing"].map(s=><span key={s} onClick={()=>setMatchState(s)} style={{padding:"3px 10px",borderRadius:6,fontSize:11,fontWeight:600,cursor:"pointer",background:matchState===s?T.accent:`${T.textDim}22`,color:matchState===s?T.bg:T.textDim}}>{s==="planning"?"Maç Planlama":"Maç Oynanıyor"}</span>)}
    </div>

    {/* Header */}
    <div style={{padding:"12px 16px 0"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
        <div onClick={()=>window.location.assign(matchState==="playing"?"/03_matches?view=S10":"/03_matches")} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>{I.arrowLeft()}<span style={{fontSize:14,fontWeight:600,color:T.textDim}}>{matchState==="playing"?"Canlı Skor":"Maçlar"}</span></div>
        <span style={{flex:1}}/>
      </div>
    </div>

    {/* Title */}
    <div style={{padding:"0 16px 16px"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
        <span style={{fontSize:20,fontWeight:800,color:T.text,fontFamily:FH}}>{m.title}</span>
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

      {/* Info card */}
      <div style={{background:T.card,borderRadius:14,border:`1px solid ${T.cardBorder}`,padding:16,marginBottom:16}}>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",flexDirection:"column",gap:10,flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{display:"flex",width:28}}>{I.clock(T.accent)}</span>
                <span style={{fontSize:14,color:T.text,fontWeight:500}}>{m.date}, {m.time}</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{display:"flex",width:28}}>{I.pin(T.accent)}</span>
                <span style={{fontSize:14,color:m.loc?T.text:T.orange,fontWeight:500}}>{m.loc||"Saha belirlenecek"}</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{display:"flex",width:28}}>{I.football(T.accent)}</span>
                <span style={{fontSize:14,color:T.text,fontWeight:500}}>{m.fmt}</span>
                <Badge c={T.textDim}>{m.level}</Badge>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{display:"flex",width:28}}>{m.vis==="public"?I.eye():I.lock()}</span>
                <span style={{fontSize:14,color:T.text,fontWeight:500}}>{m.vis==="public"?"Herkese Görünür":"Sadece Katılımcılara"}</span>
              </div>
            </div>
            {isHost&&<span onClick={()=>setShowEditDrawer(true)} style={{alignSelf:"flex-start",marginLeft:12,padding:"5px 10px",borderRadius:8,border:`1px solid ${T.cardBorder}`,fontSize:11,fontWeight:600,color:T.textDim,cursor:"pointer",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:4}}>{I.edit(T.textDim)} Düzenle</span>}
          </div>
        </div>
      </div>

      {/* Capacity */}
      <div style={{marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
          <span style={{fontSize:13,fontWeight:600,color:T.text}}>{joined}/{m.max} oyuncu</span>
          <span style={{fontSize:12,color:(m.max-joined)<=2?T.orange:T.textDim}}>{m.max-joined} yer kaldı</span>
        </div>
        <CapacityBar joined={joined} max={m.max}/>
      </div>
    </div>

    {/* Drag hint (host only) */}
    {isHost&&<div style={{margin:"0 16px 12px",background:`${T.accent}08`,borderRadius:10,border:`1px solid ${T.accent}22`,padding:"8px 12px",display:"flex",alignItems:"center",gap:8}}>
      <span style={{fontSize:12,color:T.accent}}>↕</span>
      <span style={{fontSize:11,color:T.textDim}}>Oyuncuya tıkla → boş slota yerleştir. ✕ ile maçtan çıkar.</span>
    </div>}

    {/* Teams */}
    <div style={{padding:"0 16px",marginBottom:16}}>
      {/* Header row */}
      <div style={{display:"flex",marginBottom:8}}>
        <div style={{flex:3,fontSize:11,fontWeight:700,color:T.accent,textAlign:"center",textTransform:"uppercase",letterSpacing:.5}}>Takım A</div>
        <div style={{width:17}}/>
        <div style={{flex:3,fontSize:11,fontWeight:700,color:T.orange,textAlign:"center",textTransform:"uppercase",letterSpacing:.5}}>Takım B</div>
      </div>
      {/* Rows */}
      {Array.from({length:rowCount}).map((_,row)=>{
        const rowA=slotsA.slice(row*3,row*3+3);
        const rowB=slotsB.slice(row*3,row*3+3);
        return <div key={row} style={{display:"flex",alignItems:"flex-start",marginBottom:4}}>
          <div style={{flex:3,display:"grid",gridTemplateColumns:"repeat(3,1fr)"}}>
            {rowA.map((s,i)=>s.empty?<EmptySlot key={s.k||i} team="A"/>:<PlayerCell key={s.uid} uid={s.uid} teamColor={T.accent}/>)}
          </div>
          <div style={{width:1,background:T.cardBorder,margin:"0 8px",alignSelf:"stretch"}}/>
          <div style={{flex:3,display:"grid",gridTemplateColumns:"repeat(3,1fr)"}}>
            {rowB.map((s,i)=>s.empty?<EmptySlot key={s.k||i} team="B"/>:<PlayerCell key={s.uid} uid={s.uid} teamColor={T.orange}/>)}
          </div>
        </div>;
      })}

      {/* Unassigned players */}
      {unassigned.length>0&&<>
        <div style={{fontSize:11,fontWeight:700,color:T.textMuted,marginTop:16,marginBottom:8,textTransform:"uppercase",letterSpacing:.5}}>Katılımcılar ({unassigned.length})</div>
        {unassigned.map(uid=>{
          const u=uf(uid);if(!u)return null;
          const lv=LEVELS[u.level];
          const isDragging=dragTarget===uid;
          return <div key={uid} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:`1px solid ${T.cardBorder}22`,background:isDragging?`${T.accent}08`:"transparent",borderRadius:isDragging?8:0,cursor:isHost?"pointer":"default"}} onClick={isHost?()=>setDragTarget(isDragging?null:uid):()=>onNav("S16",uid)}>
            <Av i={u.av} img={u.img} s={36} c={isDragging?T.accent:T.textDim}/>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontSize:13,fontWeight:600,color:T.text}}>{u.name}</span>
                {uid===m.host&&<Badge c={T.gold}>{I.crown(T.gold)} Host</Badge>}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginTop:2}}>
                {lv&&<span style={{fontSize:11,color:lv.c,fontWeight:600}}>{lv.l}</span>}
                <span style={{fontSize:11,color:T.textMuted}}>%{u.att} katılım</span>
              </div>
            </div>
            {isHost&&uid!==m.host&&<span onClick={e=>{e.stopPropagation();setRemoveConfirm(uid);}} style={{cursor:"pointer",display:"flex",padding:4,color:T.textMuted,fontSize:16,fontWeight:700}}>✕</span>}
            {isDragging&&<span style={{fontSize:10,color:T.accent,fontWeight:600}}>→ Takım seç</span>}
          </div>;
        })}
      </>}
    </div>

    {/* Remove player confirm modal (host) */}
    {removeConfirm&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
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
      <div onClick={()=>setShowEditDrawer(false)} style={{position:"absolute",inset:0,background:"rgba(0,0,0,.6)"}}/>
      <div style={{position:"relative",width:"100%",background:T.card,borderRadius:"20px 20px 0 0",padding:"20px 20px 32px",zIndex:301,maxHeight:"80vh",overflowY:"auto"}}>
        <div style={{width:40,height:4,borderRadius:2,background:T.cardBorder,margin:"0 auto 20px"}}/>
        <div style={{fontSize:18,fontWeight:800,color:T.text,fontFamily:FH,marginBottom:20}}>Maçı Düzenle</div>
        {[
          {label:"Maç Başlığı",key:"title",placeholder:"ör. Cuma Akşamı Maçı"},
          {label:"Tarih",key:"date",placeholder:"ör. 8 Mar"},
          {label:"Saat",key:"time",placeholder:"ör. 20:00"},
          {label:"Konum",key:"loc",placeholder:"Saha adı"},
          {label:"Format",key:"fmt",placeholder:"ör. 6v6"},
          {label:"Seviye",key:"level",placeholder:"ör. Herkes"},
        ].map(f=><div key={f.key} style={{marginBottom:14}}>
          <div style={{fontSize:11,fontWeight:700,color:T.textMuted,marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>{f.label}</div>
          <input value={editForm[f.key]} onChange={e=>setEditForm(prev=>({...prev,[f.key]:e.target.value}))} placeholder={f.placeholder} style={{width:"100%",background:T.bg,border:`1.5px solid ${T.cardBorder}`,borderRadius:10,padding:"10px 14px",color:T.text,fontSize:14,outline:"none",boxSizing:"border-box"}}/>
        </div>)}
        <div style={{marginBottom:14}}>
          <div style={{fontSize:11,fontWeight:700,color:T.textMuted,marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>Görünürlük</div>
          <div style={{display:"flex",gap:8}}>
            {["public","private"].map(v=><div key={v} onClick={()=>setEditForm(prev=>({...prev,vis:v}))} style={{flex:1,padding:"10px 0",textAlign:"center",borderRadius:10,border:`1.5px solid ${editForm.vis===v?T.accent:T.cardBorder}`,background:editForm.vis===v?`${T.accent}10`:"transparent",fontSize:13,fontWeight:600,color:editForm.vis===v?T.accent:T.textDim,cursor:"pointer"}}>{v==="public"?"Herkese Açık":"Sadece Katılımcılar"}</div>)}
          </div>
        </div>
        <Btn full primary onClick={()=>setShowEditDrawer(false)} st={{marginTop:8}}>Kaydet</Btn>
      </div>
    </div>}

    {/* Invite Drawer (host) */}
    {showInviteDrawer&&<div style={{position:"fixed",inset:0,zIndex:300,display:"flex",alignItems:"flex-end",maxWidth:430,margin:"0 auto"}}>
      <div onClick={()=>setShowInviteDrawer(false)} style={{position:"absolute",inset:0,background:"rgba(0,0,0,.6)"}}/>
      <div style={{position:"relative",width:"100%",background:T.card,borderRadius:"20px 20px 0 0",padding:"20px 20px 32px",maxHeight:"70vh",display:"flex",flexDirection:"column",zIndex:301}}>
        <div style={{width:40,height:4,borderRadius:2,background:T.cardBorder,margin:"0 auto 16px"}}/>
        <div style={{fontSize:18,fontWeight:800,color:T.text,fontFamily:FH,marginBottom:16}}>Oyuncu Davet Et</div>
        <div style={{background:T.bg,borderRadius:12,border:`1.5px solid ${T.cardBorder}`,padding:"10px 14px",display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
          {I.search(T.textDim)}
          <input value={inviteQ} onChange={e=>setInviteQ(e.target.value)} placeholder="İsim veya kullanıcı adı ara..." style={{background:"none",border:"none",color:T.text,fontSize:14,width:"100%",outline:"none",fontWeight:500}}/>
        </div>
        <div style={{flex:1,overflowY:"auto"}}>
          {filteredFriends.map(u=><div key={u.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:`1px solid ${T.cardBorder}22`}}>
            <Av i={u.av} img={u.img} s={36}/>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:500,color:T.text}}>{u.name}</div>
              <div style={{fontSize:11,color:T.textDim}}>@{u.un} · %{u.att} katılım</div>
            </div>
            <Btn small primary={!inviteSent.includes(u.id)} onClick={()=>{if(!inviteSent.includes(u.id))setInviteSent(s=>[...s,u.id]);}} st={inviteSent.includes(u.id)?{background:`${T.green}22`,color:T.green,border:`1.5px solid ${T.green}44`}:{}}>{inviteSent.includes(u.id)?"Gönderildi":"Davet Et"}</Btn>
          </div>)}
          {filteredFriends.length===0&&<div style={{textAlign:"center",padding:"24px 0",color:T.textMuted,fontSize:13}}>Sonuç bulunamadı</div>}
        </div>
      </div>
    </div>}

    {/* CTA Buttons */}
    <div style={{padding:"0 16px"}}>
      {isHost?<>
        <Btn full st={{marginBottom:8}}>{I.share(T.text)} Paylaş</Btn>
        {m.mode==="approval"&&<Btn full onClick={()=>onNav("S13")} st={{marginBottom:8}}>Başvuruları Gör</Btn>}
        <Btn full onClick={()=>setShowInviteDrawer(true)} st={{marginBottom:8}}>Oyuncu Davet Et</Btn>
        <Btn full onClick={hostLeave} st={{marginBottom:8}}>Maçtan Çık</Btn>
        {matchState==="playing"?<Btn full onClick={()=>window.location.assign("/03_matches?view=S10&page=end")} st={{marginBottom:8,color:T.red}}>Maçı Bitir</Btn>
        :<Btn full primary onClick={()=>window.location.assign("/03_matches?view=S10")} st={{marginBottom:8}}>{I.play(T.bg)} Maçı Başlat</Btn>}
      </>:isPlayer?<>
        <Btn full st={{marginBottom:8}}>{I.share(T.text)} Paylaş</Btn>
        <Btn full st={{marginBottom:8}}>{I.chat(T.text)} Maç Sohbeti</Btn>
        <Btn full onClick={leaveMatch} st={{marginBottom:8}}>Maçtan Çık</Btn>
        {matchState==="playing"?<Btn full onClick={()=>window.location.assign("/03_matches?view=S10&page=end")} st={{marginBottom:8,color:T.red}}>Maçı Bitir</Btn>
        :<Btn full primary onClick={()=>window.location.assign("/03_matches?view=S10")} st={{marginBottom:8}}>{I.play(T.bg)} Maçı Başlat</Btn>}
      </>:<>
        <Btn full st={{marginBottom:8}}>{I.share(T.text)} Paylaş</Btn>
        <Btn full primary onClick={joinMatch} st={{marginBottom:8}}>Maça Katıl ({m.max-joined} yer kaldı)</Btn>
      </>}
    </div>
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
        return <div key={uid} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:`1px solid ${T.cardBorder}22`}}>
          <Av i={u.av} img={u.img} s={32}/>
          <span style={{fontSize:13,fontWeight:500,color:T.text,flex:1}}>{u.name}</span>
          <Badge c={T.green}>{I.check(T.green)} Onaylı</Badge>
        </div>;
      })}
    </div>
  </div>;
}

// ============================================================
// S40: Puanlama & Attendance (Maç Sonrası)
// ============================================================
function S40({onNav}){
  const m=UNRATED_MATCH;
  const [mvpVote,setMvpVote]=useState(null);
  const [attendance,setAttendance]=useState({});
  const [submitted,setSubmitted]=useState(false);

  const toggleAtt=(uid,val)=>{setAttendance(a=>({...a,[uid]:a[uid]===val?null:val}));};

  if(submitted){
    return <div style={{padding:"60px 16px",textAlign:"center"}}>
      <div style={{fontSize:48,marginBottom:16}}>{I.check(T.accent)}</div>
      <div style={{fontSize:20,fontWeight:800,color:T.text,fontFamily:FH,marginBottom:8}}>Gönderildi</div>
      <div style={{fontSize:14,color:T.textDim,marginBottom:24}}>MVP oyun ve katılım bildirimin kaydedildi.</div>
      <Btn primary onClick={()=>onNav("S08")}>Maçlara Dön</Btn>
    </div>;
  }

  return <div style={{paddingBottom:80}}>
    {/* Header */}
    <div style={{padding:"12px 16px 0"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
        <span onClick={()=>onNav("S08")} style={{cursor:"pointer",display:"flex"}}>{I.arrowLeft()}</span>
        <span style={{fontSize:18,fontWeight:800,color:T.text,fontFamily:FH}}>Puanlama</span>
      </div>
    </div>

    {/* Match summary */}
    <div style={{textAlign:"center",padding:"0 16px 20px",borderBottom:`1px solid ${T.cardBorder}22`}}>
      <div style={{fontSize:16,fontWeight:700,color:T.text,fontFamily:FH,marginBottom:8}}>{m.title}</div>
      <div style={{fontSize:36,fontWeight:900,fontFamily:FH,marginBottom:4}}>
        <span style={{color:m.sc[0]>m.sc[1]?T.accent:T.text}}>{m.sc[0]}</span>
        <span style={{color:T.textMuted,margin:"0 8px",fontSize:20}}>–</span>
        <span style={{color:m.sc[1]>m.sc[0]?T.accent:T.text}}>{m.sc[1]}</span>
      </div>
      <div style={{fontSize:12,color:T.textDim}}>{m.date} · {m.fmt}</div>
    </div>

    {/* MVP Vote */}
    <div style={{padding:"16px 16px 0"}}>
      <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:4,fontFamily:FH}}>Maçın Yıldızını Seç</div>
      <div style={{fontSize:12,color:T.textDim,marginBottom:12}}>En iyi oynayan kişiyi seç (1 oy hakkın var)</div>
      <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:20}}>
        {m.players.filter(uid=>uid!==1).map(uid=>{
          const u=uf(uid);if(!u)return null;
          const sel=mvpVote===uid;
          return <div key={uid} onClick={()=>setMvpVote(sel?null:uid)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:12,background:sel?`${T.gold}10`:T.card,border:`1.5px solid ${sel?T.gold:T.cardBorder}`,cursor:"pointer",transition:"all .2s"}}>
            <Av i={u.av} img={u.img} s={32} c={sel?T.gold:T.accent}/>
            <span style={{fontSize:13,fontWeight:sel?700:500,color:sel?T.gold:T.text,flex:1}}>{u.name}</span>
            {sel&&<span style={{display:"flex"}}>{I.star(T.gold)}</span>}
          </div>;
        })}
      </div>
    </div>

    {/* Attendance */}
    <div style={{padding:"0 16px"}}>
      <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:4,fontFamily:FH}}>Katılım Durumunu Bildir</div>
      <div style={{fontSize:12,color:T.textDim,marginBottom:12}}>Her oyuncu için katılıp katılmadığını bildir</div>
      <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:20}}>
        {m.players.filter(uid=>uid!==1).map(uid=>{
          const u=uf(uid);if(!u)return null;
          const val=attendance[uid];
          return <div key={uid} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:12,background:T.card,border:`1px solid ${T.cardBorder}`}}>
            <Av i={u.av} img={u.img} s={28}/>
            <span style={{fontSize:13,color:T.text,flex:1,fontWeight:500}}>{u.name}</span>
            <div style={{display:"flex",gap:4}}>
              <div onClick={()=>toggleAtt(uid,"yes")} style={{padding:"4px 10px",borderRadius:8,background:val==="yes"?`${T.green}20`:"transparent",border:`1.5px solid ${val==="yes"?T.green:T.cardBorder}`,cursor:"pointer",fontSize:11,fontWeight:600,color:val==="yes"?T.green:T.textMuted}}>Geldi</div>
              <div onClick={()=>toggleAtt(uid,"no")} style={{padding:"4px 10px",borderRadius:8,background:val==="no"?`${T.red}20`:"transparent",border:`1.5px solid ${val==="no"?T.red:T.cardBorder}`,cursor:"pointer",fontSize:11,fontWeight:600,color:val==="no"?T.red:T.textMuted}}>Gelmedi</div>
            </div>
          </div>;
        })}
      </div>

      <Btn primary full onClick={()=>setSubmitted(true)}>Gönder</Btn>
    </div>
  </div>;
}

// ============================================================
// S41: Oyuncu Davet (Bottom Sheet)
// ============================================================
function S41({onNav}){
  const [q,setQ]=useState("");
  const [sent,setSent]=useState([]);
  const friends=U.filter(u=>u.follow&&u.id!==1);
  const filtered=q.length>0?friends.filter(u=>u.name.toLowerCase().includes(q.toLowerCase())||u.un.toLowerCase().includes(q.toLowerCase())):friends;

  const invite=(uid)=>{if(!sent.includes(uid))setSent(s=>[...s,uid]);};

  return <div style={{position:"fixed",bottom:0,left:0,right:0,top:0,maxWidth:430,margin:"0 auto",zIndex:150,display:"flex",alignItems:"flex-end"}}>
    <div onClick={()=>onNav("S12")} style={{position:"absolute",inset:0,background:"rgba(0,0,0,.6)"}}/>
    <div style={{position:"relative",width:"100%",background:T.card,borderRadius:"20px 20px 0 0",padding:"20px 20px 32px",maxHeight:"70vh",display:"flex",flexDirection:"column",zIndex:151}}>
      <div style={{width:40,height:4,borderRadius:2,background:T.cardBorder,margin:"0 auto 16px"}}/>
      <div style={{fontSize:18,fontWeight:800,color:T.text,marginBottom:16,fontFamily:FH}}>Oyuncu Davet Et</div>

      {/* Search */}
      <div style={{background:T.bg,borderRadius:12,border:`1.5px solid ${T.cardBorder}`,padding:"10px 14px",display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
        {I.search(T.textDim)}
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="İsim veya kullanıcı adı ara..." style={{background:"none",border:"none",color:T.text,fontSize:14,width:"100%",outline:"none",fontWeight:500}}/>
      </div>

      {/* Friend list */}
      <div style={{flex:1,overflowY:"auto"}}>
        {filtered.map(u=><div key={u.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:`1px solid ${T.cardBorder}22`}}>
          <Av i={u.av} img={u.img} s={36}/>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:500,color:T.text}}>{u.name}</div>
            <div style={{fontSize:11,color:T.textDim}}>@{u.un} · %{u.att} katılım</div>
          </div>
          <Btn small primary={!sent.includes(u.id)} onClick={()=>invite(u.id)} st={sent.includes(u.id)?{background:`${T.green}22`,color:T.green,border:`1.5px solid ${T.green}44`}:{}}>{sent.includes(u.id)?"Gönderildi":"Davet Et"}</Btn>
        </div>)}
        {filtered.length===0&&<div style={{textAlign:"center",padding:"24px 0",color:T.textMuted,fontSize:13}}>Sonuç bulunamadı</div>}
      </div>
    </div>
  </div>;
}

// ============================================================
// S30: Shareable Kart (Maç Sonrası)
// ============================================================
function S30({onNav}){
  const m=PAST_MATCH;
  const me=uf(1);
  const myStats=m.goals.reduce((acc,g)=>{if(g.scorer===1)acc.g++;if(g.assist===1)acc.a++;return acc;},{g:0,a:0});
  const mvps=m.mvp.map(id=>uf(id));

  return <div style={{paddingBottom:80}}>
    {/* Header */}
    <div style={{padding:"12px 16px 0"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
        <span onClick={()=>onNav("S11")} style={{cursor:"pointer",display:"flex"}}>{I.arrowLeft()}</span>
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

      {/* My stats */}
      <div style={{background:`${T.accent}08`,borderRadius:12,padding:"12px 16px",border:`1px solid ${T.accent}22`}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
          <Av i={me.av} img={me.img} s={28} c={T.accent}/>
          <span style={{fontSize:14,fontWeight:700,color:T.text}}>{me.name}</span>
        </div>
        <div style={{display:"flex",gap:16}}>
          <div><div style={{fontSize:20,fontWeight:900,color:T.accent,fontFamily:FH}}>{myStats.g}</div><div style={{fontSize:10,color:T.textDim,fontWeight:600}}>GOL</div></div>
          <div><div style={{fontSize:20,fontWeight:900,color:T.accent,fontFamily:FH}}>{myStats.a}</div><div style={{fontSize:10,color:T.textDim,fontWeight:600}}>ASİST</div></div>
        </div>
      </div>

      {/* Meta */}
      <div style={{display:"flex",gap:8,marginTop:16,fontSize:11,color:T.textDim,flexWrap:"wrap"}}>
        <span>{m.date}</span>
        <span>·</span>
        <span>{m.loc}</span>
        <span>·</span>
        <span>{m.fmt}</span>
      </div>

      {/* QR placeholder */}
      <div style={{position:"absolute",bottom:20,right:20,width:48,height:48,borderRadius:8,background:`${T.textDim}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:T.textMuted,fontWeight:600}}>QR</div>
    </div>

    {/* Share buttons */}
    <div style={{padding:"20px 16px",display:"flex",flexDirection:"column",gap:8}}>
      <Btn full primary>{I.instagram(T.bg)} Instagram'da Paylaş</Btn>
      <Btn full st={{background:`${T.green}15`,border:`1.5px solid ${T.green}33`,color:T.green}}>{I.whatsapp(T.green)} WhatsApp'ta Paylaş</Btn>
      <Btn full>{I.download(T.text)} Kaydet</Btn>
      <div onClick={()=>onNav("S11")} style={{textAlign:"center",marginTop:4,fontSize:13,color:T.textDim,cursor:"pointer"}}>Atla</div>
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
    const allowed=["S11","S12","S13","S40","S30"];
    if(view&&allowed.includes(view))setCur(view);
  },[]);

  const nav=(p,id)=>{setFade(false);setTimeout(()=>{setCur(p);setCurId(id||null);setFade(true);},120);};

  const pg=()=>{
    switch(cur){
      case "S11":return <S11 onNav={nav}/>;
      case "S12":return <S12 onNav={nav}/>;
      case "S13":return <S13 onNav={nav}/>;
      case "S40":return <S40 onNav={nav}/>;
      case "S30":return <S30 onNav={nav}/>;
      default:return <S11 onNav={nav}/>;
    }
  };

  return <div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",background:T.bg,color:T.text,fontFamily:FB,position:"relative",boxShadow:"0 0 60px rgba(0,0,0,.5)"}}>
    {/* Dev ribbon */}
    <div style={{position:"sticky",top:0,zIndex:200,background:T.bgAlt,borderBottom:`1px solid ${T.cardBorder}`,padding:"6px 8px",display:"flex",gap:4,flexWrap:"wrap"}}>
      {[{p:"S11",l:"Geçmiş Maç"},{p:"S12",l:"Planlanan Maç"},{p:"S13",l:"Başvurular"},{p:"S40",l:"Puanlama"},{p:"S41",l:"Davet"},{p:"S30",l:"Paylaş"}].map(n=><span key={n.p} onClick={()=>nav(n.p)} style={{padding:"4px 10px",borderRadius:6,fontSize:11,fontWeight:600,background:cur===n.p?T.accent:`${T.textDim}22`,color:cur===n.p?T.bg:T.textDim,cursor:"pointer"}}>{n.l}</span>)}
    </div>
    <div style={{opacity:fade?1:0,transform:fade?"none":"translateY(6px)",transition:"all .12s ease"}}>{pg()}</div>
    {cur==="S41"&&<S41 onNav={nav}/>}
    <TabBar active="S08" onNav={nav}/>
  </div>;
}
