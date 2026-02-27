import { useState, useEffect, useRef } from "react";

// ============================================================
// SPORWAVE MODULE 3 — Maçlar Core (S08, S09, S10, S14, S31)
// ============================================================

const T={accent:"#B7F000",bg:"#0B0F14",bgAlt:"#060810",card:"#141A22",cardBorder:"#1E2730",text:"#F0F2F5",textDim:"#8A95A5",textMuted:"#5A6577",red:"#FF4757",green:"#2ED573",orange:"#FF8C42",gold:"#FFD700",purple:"#A78BFA"};
const FH="'Plus Jakarta Sans','SF Pro Display',-apple-system,sans-serif";
const FB="'SF Pro Display','SF Pro Text',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";

// Mock data
const U=[
  {id:1,name:"Berk Yılmaz",un:"berk26",av:"BY",att:94,follow:true},
  {id:2,name:"Ali Demir",un:"alidemir",av:"AD",att:88,follow:true},
  {id:3,name:"Mehmet Kaya",un:"mkaya",av:"MK",att:91,follow:false},
  {id:4,name:"Emre Çelik",un:"emrecelik",av:"EÇ",att:96,follow:true},
  {id:5,name:"Can Yıldız",un:"canyildiz",av:"CY",att:85,follow:false},
  {id:6,name:"Oğuz Han",un:"oguzhan",av:"OH",att:92,follow:false},
  {id:7,name:"Kerem Aktaş",un:"keremm",av:"KA",att:78,follow:false},
  {id:8,name:"Burak Şen",un:"buraksen",av:"BŞ",att:90,follow:false},
];
const uf=id=>U.find(u=>u.id===id);

const PLANNED=[
  {id:101,title:"Cumartesi Akşam Maçı",date:"1 Mar",time:"20:00",loc:"Kadıköy Spor Tesisleri",fmt:"6v6",host:2,joined:7,max:12,level:"Herkes",mode:"open",vis:"public",myMatch:true,friendJoined:"Emre"},
  {id:102,title:"Pazar Sabah Maçı",date:"2 Mar",time:"10:00",loc:"Beşiktaş Halısaha",fmt:"5v5",host:6,joined:9,max:10,level:"Orta+",mode:"approval",vis:"public",myMatch:false,friendJoined:null},
  {id:103,title:"Ataşehir Turnuva",date:"5 Mar",time:"19:00",loc:null,fmt:"7v7",host:3,joined:4,max:14,level:"Herkes",mode:"open",vis:"public",myMatch:false,friendJoined:"Ali"},
  {id:104,title:"Kadıköy Gece Maçı",date:"8 Mar",time:"21:30",loc:"Kadıköy Arena",fmt:"6v6",host:1,joined:10,max:12,level:"İyi",mode:"open",vis:"followers",myMatch:true,friendJoined:null},
];

const UNRATED=[{id:201,title:"Perşembe Maçı",date:"27 Şub",sc:[3,2],host:4}];

// Icons
const I={
  filter:c=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/></svg>,
  plus:c=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c||T.bg} strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  football:c=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15 15 0 014 10 15 15 0 01-4 10 15 15 0 01-4-10 15 15 0 014-10z"/><path d="M2 12h20"/></svg>,
  home:c=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>,
  user:c=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 10-16 0"/></svg>,
  arrowLeft:c=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.text} strokeWidth="2" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12,19 5,12 12,5"/></svg>,
  star:c=><svg width="16" height="16" viewBox="0 0 24 24" fill={c||T.gold} stroke={c||T.gold} strokeWidth="1"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>,
  clock:c=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||T.textMuted} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>,
  pin:c=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||T.textMuted} strokeWidth="2" strokeLinecap="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>,
  users:c=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||T.textMuted} strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  gamepad:c=><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={c||T.accent} strokeWidth="1.8" strokeLinecap="round"><line x1="6" y1="12" x2="18" y2="12"/><line x1="12" y1="6" x2="12" y2="18"/><rect x="2" y="6" width="20" height="12" rx="3"/></svg>,
  megaphone:c=><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={c||T.purple} strokeWidth="1.8" strokeLinecap="round"><path d="M3 11l18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 11-5.8-1.6"/></svg>,
  x:c=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  check:c=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||T.accent} strokeWidth="3" strokeLinecap="round"><polyline points="20,6 9,17 4,12"/></svg>,
  pause:c=><svg width="16" height="16" viewBox="0 0 24 24" fill={c||T.text}><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>,
  play:c=><svg width="16" height="16" viewBox="0 0 24 24" fill={c||T.text}><polygon points="5,3 19,12 5,21"/></svg>,
  undo:c=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||T.text} strokeWidth="2" strokeLinecap="round"><polyline points="1,4 1,10 7,10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>,
  trash:c=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||T.red} strokeWidth="2" strokeLinecap="round"><polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>,
  camera:c=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="1.8" strokeLinecap="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  share:c=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16,6 12,2 8,6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>,
  eye:c=><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c||T.green} strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  lock:c=><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c||T.textMuted} strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
};

// Components
function Av({i,s=32,c=T.accent,onClick,st}){return <div onClick={onClick} style={{width:s,height:s,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:`${c}18`,border:`1.5px solid ${c}44`,color:c,fontSize:s*.34,fontWeight:700,cursor:onClick?"pointer":"default",flexShrink:0,...st}}>{i}</div>;}
function Btn({children,primary,danger,small,full,ghost,onClick,disabled,st}){const[h,setH]=useState(false);return <button disabled={disabled} onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{padding:small?"7px 14px":"12px 20px",borderRadius:10,border:primary||danger?"none":`1.5px solid ${ghost?"transparent":T.cardBorder}`,background:disabled?`${T.textDim}22`:danger?T.red:primary?T.accent:"transparent",color:disabled?T.textDim:danger?"#fff":primary?T.bg:T.text,fontSize:small?12:14,fontWeight:600,cursor:disabled?"not-allowed":"pointer",width:full?"100%":"auto",transition:"all .2s",transform:h&&!disabled?"translateY(-1px)":"none",display:"flex",alignItems:"center",justifyContent:"center",gap:6,...st}}>{children}</button>;}
function Badge({children,c=T.accent,st}){return <span style={{display:"inline-flex",alignItems:"center",gap:3,padding:"2px 8px",borderRadius:20,fontSize:11,fontWeight:600,color:c,background:`${c}15`,whiteSpace:"nowrap",...st}}>{children}</span>;}
function ProgressBar({current,total}){return <div style={{display:"flex",gap:6,marginBottom:24,padding:"0 4px"}}>{Array.from({length:total},(_,i)=><div key={i} style={{flex:1,height:4,borderRadius:4,background:i<current?T.accent:i===current?`${T.accent}55`:`${T.textDim}22`,transition:"background .4s"}}/>)}</div>;}
function TabBar({active,onNav}){const tabs=[{id:"S05",ic:I.home,l:"Ana Sayfa"},{id:"S08",ic:I.football,l:"Maçlar"},{id:"S15",ic:I.user,l:"Profil"}];return <div style={{position:"fixed",bottom:0,left:0,right:0,height:56,background:T.bgAlt,borderTop:`1px solid ${T.cardBorder}`,display:"flex",justifyContent:"space-around",alignItems:"center",zIndex:100,maxWidth:430,margin:"0 auto"}}>{tabs.map(t=><div key={t.id} onClick={()=>onNav(t.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",padding:"6px 20px"}}><span style={{display:"flex"}}>{t.ic(active===t.id?T.accent:T.textMuted)}</span><span style={{fontSize:10,fontWeight:active===t.id?700:500,color:active===t.id?T.accent:T.textMuted}}>{t.l}</span></div>)}</div>;}

function CapacityBar({joined,max}){const pct=joined/max*100;return <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{flex:1,height:4,borderRadius:2,background:`${T.textDim}22`}}><div style={{height:4,borderRadius:2,background:pct>=90?T.orange:T.accent,width:`${pct}%`,transition:"width .3s"}}/></div><span style={{fontSize:11,color:T.textDim,fontWeight:600,whiteSpace:"nowrap"}}>{joined}/{max}</span></div>;}

// S08: Matches Page
function S08({onNav}){
  const [filter,setFilter]=useState(false);
  const myMatches=PLANNED.filter(m=>m.myMatch);
  const openMatches=PLANNED.filter(m=>!m.myMatch);

  return <div style={{paddingBottom:80}}>
    {/* Header */}
    <div style={{padding:"14px 16px 8px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <span style={{fontSize:20,fontWeight:800,color:T.text,fontFamily:FH}}>Maçlar</span>
      <span onClick={()=>setFilter(!filter)} style={{cursor:"pointer",display:"flex",padding:6,borderRadius:8,background:filter?`${T.accent}15`:"transparent"}}>{I.filter(filter?T.accent:T.textDim)}</span>
    </div>

    {/* Filter popup */}
    {filter&&<div style={{margin:"0 16px 12px",background:T.card,borderRadius:14,border:`1px solid ${T.cardBorder}`,padding:16}}>
      <div style={{fontSize:13,fontWeight:700,color:T.text,marginBottom:10}}>Filtre</div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>{["Bugün","Bu hafta","Bu ay"].map(d=><Badge key={d} c={T.textDim}>{d}</Badge>)}</div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>{["Tüm Maçlar","Katıldıklarım","Açık Maçlar"].map(d=><Badge key={d} c={T.textDim}>{d}</Badge>)}</div>
      <div style={{display:"flex",gap:8}}><Btn small primary full>Uygula</Btn><Btn small ghost onClick={()=>setFilter(false)}>Sıfırla</Btn></div>
    </div>}

    {/* Unrated matches */}
    {UNRATED.length>0&&<div style={{padding:"0 16px 12px"}}>
      {UNRATED.map(m=><div key={m.id} onClick={()=>onNav("S40",m.id)} style={{background:T.card,borderRadius:14,border:`2px solid ${T.orange}`,padding:"14px 16px",cursor:"pointer",marginBottom:8}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
          <Badge c={T.orange}>{I.star(T.orange)} Değerlendir</Badge>
        </div>
        <div style={{fontWeight:700,fontSize:14,color:T.text,fontFamily:FH}}>{m.title}</div>
        <div style={{fontSize:12,color:T.textDim,marginTop:4}}>{m.date} · Skor: {m.sc[0]}-{m.sc[1]}</div>
      </div>)}
    </div>}

    {/* Continue match banner */}
    <div style={{margin:"0 16px 12px",background:`${T.accent}12`,border:`1.5px solid ${T.accent}33`,borderRadius:14,padding:"12px 16px",cursor:"pointer"}} onClick={()=>onNav("S10")}>
      <div style={{fontSize:13,fontWeight:700,color:T.accent}}>⏸️ Devam eden maçın var — Devam Et</div>
    </div>

    {/* My upcoming matches */}
    {myMatches.length>0&&<div style={{padding:"0 16px"}}>
      <div style={{fontSize:12,fontWeight:700,color:T.textMuted,marginBottom:10,textTransform:"uppercase",letterSpacing:.5}}>Katıldığım Maçlar</div>
      {myMatches.map(m=><MatchListCard key={m.id} m={m} onNav={onNav} isMine/>)}
    </div>}

    {/* Open matches */}
    <div style={{padding:"0 16px"}}>
      <div style={{fontSize:12,fontWeight:700,color:T.textMuted,marginBottom:10,marginTop:16,textTransform:"uppercase",letterSpacing:.5}}>Açık Maçlar</div>
      {openMatches.length>0?openMatches.map(m=><MatchListCard key={m.id} m={m} onNav={onNav}/>):
        <div style={{textAlign:"center",padding:"32px 0"}}><div style={{marginBottom:12,opacity:.5}}>{I.football(T.textMuted)}</div><div style={{fontSize:14,color:T.textDim}}>Şu an açık maç yok</div><div style={{fontSize:12,color:T.textMuted,marginTop:4}}>İlk maçı sen oluştur!</div></div>}
    </div>

    {/* FAB */}
    <div onClick={()=>onNav("S09")} style={{position:"fixed",bottom:72,right:24,width:56,height:56,borderRadius:16,background:T.accent,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:`0 4px 24px ${T.accent}44`,zIndex:90,maxWidth:430,transition:"transform .2s"}}>{I.plus(T.bg)}</div>
  </div>;
}

function MatchListCard({m,onNav,isMine}){
  const host=uf(m.host);
  return <div onClick={()=>onNav("S12",m.id)} style={{background:T.card,borderRadius:14,border:`1px solid ${T.cardBorder}`,padding:"14px 16px",marginBottom:10,cursor:"pointer",borderLeft:isMine?`3px solid ${T.accent}`:"none"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
      <div style={{flex:1}}>
        <div style={{fontWeight:700,fontSize:14,color:T.text,marginBottom:4,fontFamily:FH}}>{m.title}</div>
        <div style={{display:"flex",gap:10,fontSize:12,color:T.textDim,marginBottom:8,flexWrap:"wrap",alignItems:"center"}}>
          <span style={{display:"flex",alignItems:"center",gap:3}}>{I.clock()} {m.date}, {m.time}</span>
          {m.loc&&<span style={{display:"flex",alignItems:"center",gap:3}}>{I.pin()} {m.loc.split(" ")[0]}</span>}
          {!m.loc&&<span style={{color:T.orange,fontSize:11}}>Saha belirlenecek</span>}
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:4}}>
        {m.vis==="public"?<span style={{display:"flex"}}>{I.eye()}</span>:<span style={{display:"flex"}}>{I.lock()}</span>}
      </div>
    </div>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
      <Av i={host?.av} s={20}/>
      <span style={{fontSize:12,color:T.textDim}}>{host?.name?.split(" ")[0]}</span>
      <span style={{fontSize:11,color:T.textMuted}}>·</span>
      <Badge c={T.textDim}>{m.fmt}</Badge>
      {m.level!=="Herkes"&&<Badge c={T.orange}>{m.level}</Badge>}
      {m.mode==="approval"&&<Badge c={T.purple}>Onay gerekli</Badge>}
    </div>
    <CapacityBar joined={m.joined} max={m.max}/>
    {isMine&&<Badge c={T.accent} st={{marginTop:8}}>{I.check()} Katılıyorsun</Badge>}
    {m.friendJoined&&!isMine&&<div style={{fontSize:11,color:T.accent,marginTop:6,fontWeight:600}}>🤝 {m.friendJoined} katılıyor</div>}
  </div>;
}

// S09: Bottom Sheet
function S09({onNav}){
  return <div style={{position:"fixed",bottom:0,left:0,right:0,top:0,zIndex:150,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
    <div onClick={()=>onNav("S08")} style={{position:"absolute",inset:0,background:"rgba(0,0,0,.6)"}}/>
    <div style={{position:"relative",width:"100%",maxWidth:430,background:T.card,borderRadius:"20px 20px 0 0",padding:"20px 20px 32px",zIndex:151}}>
      <div style={{width:40,height:4,borderRadius:2,background:T.cardBorder,margin:"0 auto 20px"}}/>
      <div style={{fontSize:18,fontWeight:800,color:T.text,marginBottom:20,fontFamily:FH}}>Ne yapmak istiyorsun?</div>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <div onClick={()=>onNav("S10")} style={{background:T.bg,borderRadius:16,border:`1.5px solid ${T.cardBorder}`,padding:"20px",cursor:"pointer",display:"flex",gap:16,alignItems:"center",transition:"border-color .2s"}}>
          <div style={{width:52,height:52,borderRadius:14,background:`${T.accent}12`,border:`1.5px solid ${T.accent}28`,display:"flex",alignItems:"center",justifyContent:"center"}}>{I.gamepad()}</div>
          <div><div style={{fontWeight:700,fontSize:15,color:T.text,fontFamily:FH}}>Maç Başlat</div><div style={{fontSize:12,color:T.textDim,marginTop:3}}>Hemen oynayacağın bir maçı başlat ve skor tut</div></div>
        </div>
        <div onClick={()=>onNav("S31")} style={{background:T.bg,borderRadius:16,border:`1.5px solid ${T.cardBorder}`,padding:"20px",cursor:"pointer",display:"flex",gap:16,alignItems:"center",transition:"border-color .2s"}}>
          <div style={{width:52,height:52,borderRadius:14,background:`${T.purple}12`,border:`1.5px solid ${T.purple}28`,display:"flex",alignItems:"center",justifyContent:"center"}}>{I.megaphone()}</div>
          <div><div style={{fontWeight:700,fontSize:15,color:T.text,fontFamily:FH}}>Maç Oluştur</div><div style={{fontSize:12,color:T.textDim,marginTop:3}}>İleri tarihli maç planla ve oyuncu bul</div></div>
        </div>
      </div>
    </div>
  </div>;
}

// S10: Live Match (4 Steps)
function S10({onNav}){
  const [step,setStep]=useState(0);
  const [fmt,setFmt]=useState("5v5");
  const [teamA,setTeamA]=useState([{id:1,name:"Berk",av:"BY"},{id:2,name:"Ali",av:"AD"}]);
  const [teamB,setTeamB]=useState([{id:3,name:"Mehmet",av:"MK"}]);
  const [score,setScore]=useState([0,0]);
  const [goals,setGoals]=useState([]);
  const [running,setRunning]=useState(false);
  const [seconds,setSeconds]=useState(0);
  const [toast,setToast]=useState(null);
  const [title,setTitle]=useState("");
  const timerRef=useRef(null);

  useEffect(()=>{if(running){timerRef.current=setInterval(()=>setSeconds(s=>s+1),1000);}else{clearInterval(timerRef.current);}return()=>clearInterval(timerRef.current);},[running]);

  const fmtTime=s=>{const m=Math.floor(s/60);const sec=s%60;return `${m}:${sec<10?"0":""}${sec}`;};
  const addGoal=(team)=>{const min=Math.floor(seconds/60);const g={id:Date.now(),team,min,scorer:null,assist:null};const ns=[...score];ns[team==="A"?0:1]++;setScore(ns);setGoals([g,...goals]);setToast(g.id);setTimeout(()=>setToast(null),5000);};
  const undoGoal=(gid)=>{const g=goals.find(x=>x.id===gid);if(!g)return;const ns=[...score];ns[g.team==="A"?0:1]--;setScore(ns);setGoals(goals.filter(x=>x.id!==gid));setToast(null);};
  const removeGoal=(gid)=>{const g=goals.find(x=>x.id===gid);if(!g)return;const ns=[...score];ns[g.team==="A"?0:1]--;setScore(ns);setGoals(goals.filter(x=>x.id!==gid));};

  const fmts=["5v5","6v6","7v7","Özel"];

  return <div style={{paddingBottom:40}}>
    {/* Step header */}
    <div style={{padding:"12px 16px 0"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
        {step>0&&<span onClick={()=>setStep(step-1)} style={{cursor:"pointer",display:"flex"}}>{I.arrowLeft()}</span>}
        <span style={{fontSize:18,fontWeight:800,color:T.text,fontFamily:FH}}>{["Maç Kurulumu","Takım Kur","Canlı Skor","Kaydet & Paylaş"][step]}</span>
      </div>
      <ProgressBar current={step} total={4}/>
    </div>

    {/* Step 1: Setup */}
    {step===0&&<div style={{padding:"0 16px"}}>
      <div style={{fontSize:13,color:T.textDim,marginBottom:10,fontWeight:600}}>Maç Formatı</div>
      <div style={{display:"flex",gap:8,marginBottom:24}}>
        {fmts.map(f=><div key={f} onClick={()=>setFmt(f)} style={{flex:1,padding:"14px 8px",borderRadius:12,background:fmt===f?`${T.accent}12`:T.card,border:`1.5px solid ${fmt===f?T.accent:T.cardBorder}`,textAlign:"center",cursor:"pointer",transition:"all .2s"}}>
          <div style={{fontSize:14,fontWeight:fmt===f?700:500,color:fmt===f?T.accent:T.text}}>{f}</div>
        </div>)}
      </div>
      <div style={{fontSize:13,color:T.textDim,marginBottom:10,fontWeight:600}}>Konum</div>
      <div style={{background:T.card,borderRadius:12,border:`1.5px solid ${T.cardBorder}`,padding:"12px 14px",marginBottom:24,display:"flex",alignItems:"center",gap:10}}>
        {I.pin(T.accent)}<span style={{fontSize:14,color:T.text,fontWeight:500}}>Kadıköy Spor Tesisleri</span><Badge c={T.green}>GPS</Badge>
      </div>
      <Btn primary full onClick={()=>setStep(1)}>Başlat</Btn>
    </div>}

    {/* Step 2: Teams */}
    {step===1&&<div style={{padding:"0 16px"}}>
      <div style={{display:"flex",gap:12,marginBottom:16}}>
        <div style={{flex:1}}>
          <div style={{fontSize:13,fontWeight:700,color:T.accent,marginBottom:10,textAlign:"center"}}>Takım A</div>
          {teamA.map(p=><div key={p.id} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0",borderBottom:`1px solid ${T.cardBorder}22`}}><Av i={p.av} s={28}/><span style={{fontSize:13,color:T.text}}>{p.name}</span></div>)}
          <div style={{padding:"10px 0",fontSize:12,color:T.accent,cursor:"pointer",fontWeight:600}}>+ Oyuncu Ekle</div>
        </div>
        <div style={{width:1,background:T.cardBorder}}/>
        <div style={{flex:1}}>
          <div style={{fontSize:13,fontWeight:700,color:T.orange,marginBottom:10,textAlign:"center"}}>Takım B</div>
          {teamB.map(p=><div key={p.id} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0",borderBottom:`1px solid ${T.cardBorder}22`}}><Av i={p.av} s={28}/><span style={{fontSize:13,color:T.text}}>{p.name}</span></div>)}
          <div style={{padding:"10px 0",fontSize:12,color:T.orange,cursor:"pointer",fontWeight:600}}>+ Oyuncu Ekle</div>
        </div>
      </div>
      <div style={{fontSize:12,color:T.textMuted,textAlign:"center",marginBottom:16}}>Sürükle-bırak ile takım değiştir</div>
      <Btn primary full onClick={()=>{setStep(2);setRunning(true);}}>Devam</Btn>
      <div onClick={()=>{setStep(2);setRunning(true);}} style={{textAlign:"center",marginTop:12,fontSize:13,color:T.textDim,cursor:"pointer"}}>Atla — Sonra eklerim</div>
    </div>}

    {/* Step 3: Live Score */}
    {step===2&&<div style={{padding:"0 16px"}}>
      {/* Timer */}
      <div style={{textAlign:"center",marginBottom:20}}>
        <div style={{fontSize:42,fontWeight:900,fontFamily:FH,color:T.text,letterSpacing:"-2px"}}>{fmtTime(seconds)}</div>
        <div style={{display:"flex",justifyContent:"center",gap:12,marginTop:8}}>
          <div onClick={()=>setRunning(!running)} style={{width:40,height:40,borderRadius:12,background:T.card,border:`1px solid ${T.cardBorder}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>{running?I.pause():I.play()}</div>
        </div>
      </div>

      {/* Score */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:0,marginBottom:16}}>
        <div style={{flex:1,textAlign:"center"}}>
          <div style={{fontSize:12,fontWeight:700,color:T.accent,marginBottom:8}}>Takım A</div>
          <div style={{fontSize:52,fontWeight:900,fontFamily:FH,color:T.accent}}>{score[0]}</div>
          <div onClick={()=>addGoal("A")} style={{margin:"12px auto 0",width:56,height:56,borderRadius:16,background:`${T.accent}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:22,fontWeight:900,color:T.bg,boxShadow:`0 4px 16px ${T.accent}44`}}>+</div>
          <div style={{fontSize:11,color:T.textDim,marginTop:6}}>Gol</div>
        </div>
        <div style={{fontSize:24,color:T.textMuted,fontWeight:300,padding:"0 8px"}}>–</div>
        <div style={{flex:1,textAlign:"center"}}>
          <div style={{fontSize:12,fontWeight:700,color:T.orange,marginBottom:8}}>Takım B</div>
          <div style={{fontSize:52,fontWeight:900,fontFamily:FH,color:T.orange}}>{score[1]}</div>
          <div onClick={()=>addGoal("B")} style={{margin:"12px auto 0",width:56,height:56,borderRadius:16,background:T.orange,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:22,fontWeight:900,color:T.bg,boxShadow:`0 4px 16px ${T.orange}44`}}>+</div>
          <div style={{fontSize:11,color:T.textDim,marginTop:6}}>Gol</div>
        </div>
      </div>

      {/* Toast */}
      {toast&&<div style={{background:T.card,border:`1.5px solid ${T.accent}44`,borderRadius:12,padding:"10px 14px",marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:13,color:T.text}}>⚽ Gol eklendi</span>
        <span onClick={()=>undoGoal(toast)} style={{fontSize:12,color:T.accent,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>{I.undo(T.accent)} Geri Al</span>
      </div>}

      {/* Goal timeline */}
      {goals.length>0&&<div style={{background:T.card,borderRadius:14,border:`1px solid ${T.cardBorder}`,padding:"12px 14px",marginBottom:16}}>
        <div style={{fontSize:12,fontWeight:700,color:T.textMuted,marginBottom:8}}>GOL GEÇMİŞİ</div>
        {goals.map(g=><div key={g.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${T.cardBorder}22`}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:11,color:T.textMuted,width:28}}>{g.min}'</span>
            <span style={{fontSize:13}}>⚽</span>
            <Badge c={g.team==="A"?T.accent:T.orange}>{g.team==="A"?"Takım A":"Takım B"}</Badge>
          </div>
          <span onClick={()=>removeGoal(g.id)} style={{cursor:"pointer",display:"flex"}}>{I.trash()}</span>
        </div>)}
      </div>}

      {/* End match */}
      <Btn danger full onClick={()=>{setRunning(false);setStep(3);}}>Maçı Bitir</Btn>
    </div>}

    {/* Step 4: Save & Share */}
    {step===3&&<div style={{padding:"0 16px"}}>
      <div style={{textAlign:"center",marginBottom:20}}>
        <div style={{fontSize:48,fontWeight:900,fontFamily:FH}}>
          <span style={{color:score[0]>score[1]?T.accent:T.text}}>{score[0]}</span>
          <span style={{color:T.textMuted,margin:"0 12px",fontSize:24}}>–</span>
          <span style={{color:score[1]>score[0]?T.accent:T.text}}>{score[1]}</span>
        </div>
        <div style={{fontSize:13,color:T.textDim,marginTop:4}}>Süre: {fmtTime(seconds)} · {fmt}</div>
      </div>

      <div style={{fontSize:13,color:T.textDim,marginBottom:8,fontWeight:600}}>Maç Başlığı (opsiyonel)</div>
      <div style={{background:T.card,borderRadius:12,border:`1.5px solid ${T.cardBorder}`,padding:"12px 14px",marginBottom:16}}>
        <input placeholder="Kadıköy Halısaha Maçı" value={title} onChange={e=>setTitle(e.target.value)} style={{background:"none",border:"none",color:T.text,fontSize:14,width:"100%",outline:"none",fontWeight:500}}/>
      </div>

      <div style={{background:`${T.accent}10`,borderRadius:12,padding:"12px 16px",marginBottom:16,border:`1px solid ${T.accent}22`}}>
        <div style={{fontSize:12,color:T.accent,fontWeight:600,marginBottom:4}}>Maç kaydedildiğinde:</div>
        <div style={{fontSize:12,color:T.textDim,lineHeight:1.5}}>Tüm katılımcılar için kişisel post oluşturulur. Fotoğraf ve not eklemek post üzerinden yapılır.</div>
      </div>

      <Btn primary full onClick={()=>onNav("S08")}>Kaydet & Paylaş</Btn>
    </div>}
  </div>;
}

// S14: Experience Level
function S14({onNav}){
  const [sel,setSel]=useState(null);
  const levels=[
    {id:"beginner",icon:"🌱",label:"Başlangıç",desc:"Spora yeni başlıyorum",c:T.green},
    {id:"mid",icon:"⚡",label:"Orta",desc:"Düzenli oynuyorum",c:T.accent},
    {id:"good",icon:"🔥",label:"İyi",desc:"Deneyimliyim",c:T.orange},
    {id:"pro",icon:"🏆",label:"Profesyonel",desc:"Yarışma seviyesi",c:T.gold},
  ];
  return <div style={{position:"fixed",bottom:0,left:0,right:0,top:0,zIndex:150,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
    <div onClick={()=>onNav("S08")} style={{position:"absolute",inset:0,background:"rgba(0,0,0,.6)"}}/>
    <div style={{position:"relative",width:"100%",maxWidth:430,background:T.card,borderRadius:"20px 20px 0 0",padding:"20px 20px 32px",zIndex:151}}>
      <div style={{width:40,height:4,borderRadius:2,background:T.cardBorder,margin:"0 auto 16px"}}/>
      <div style={{fontSize:18,fontWeight:800,color:T.text,marginBottom:4,fontFamily:FH}}>Deneyim Seviyeni Seç</div>
      <div style={{fontSize:13,color:T.textDim,marginBottom:20}}>Maç sahibi seviyeni görerek karar verecek</div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {levels.map(l=><div key={l.id} onClick={()=>setSel(l.id)} style={{padding:"14px 16px",borderRadius:12,background:sel===l.id?`${l.c}10`:T.bg,border:`1.5px solid ${sel===l.id?l.c:T.cardBorder}`,cursor:"pointer",display:"flex",alignItems:"center",gap:12,transition:"all .2s"}}>
          <span style={{fontSize:22}}>{l.icon}</span>
          <div><div style={{fontWeight:700,fontSize:14,color:sel===l.id?l.c:T.text}}>{l.label}</div><div style={{fontSize:12,color:T.textDim}}>{l.desc}</div></div>
        </div>)}
      </div>
      <Btn primary full disabled={!sel} onClick={()=>onNav("S08")} st={{marginTop:16}}>Katıl</Btn>
    </div>
  </div>;
}

// S31: Create Match (4 Steps)
function S31({onNav}){
  const [step,setStep]=useState(0);
  const [fmt,setFmt]=useState("6v6");
  const [locMode,setLocMode]=useState(null);
  const [privacy,setPrivacy]=useState("public");
  const [accept,setAccept]=useState("open");
  const [invites,setInvites]=useState([]);

  const fmts=["5v5","6v6","7v7","Özel"];
  const privacyOpts=[{id:"public",l:"Herkese açık"},{id:"followers",l:"Sadece takipçilere"},{id:"invite",l:"Sadece davet ile"}];
  const locModes=[{id:"known",l:"Saha Biliyorum",ic:"📍"},{id:"suggest",l:"Önerisine Açığım",ic:"🗺️"},{id:"none",l:"Konumsuz",ic:"❌"}];

  return <div style={{paddingBottom:40}}>
    <div style={{padding:"12px 16px 0"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
        {step>0?<span onClick={()=>setStep(step-1)} style={{cursor:"pointer",display:"flex"}}>{I.arrowLeft()}</span>:<span onClick={()=>onNav("S08")} style={{cursor:"pointer",display:"flex"}}>{I.arrowLeft()}</span>}
        <span style={{fontSize:18,fontWeight:800,color:T.text,fontFamily:FH}}>Maç Oluştur</span>
      </div>
      <ProgressBar current={step} total={4}/>
    </div>

    {/* Step 1: Details */}
    {step===0&&<div style={{padding:"0 16px"}}>
      <div style={{fontSize:12,color:T.textMuted,fontWeight:600,marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>Adım 1/4 — Detaylar</div>
      <div style={{fontSize:20,fontWeight:800,color:T.text,marginBottom:20,fontFamily:FH}}>Maç Detayları</div>
      <div style={{marginBottom:16}}>
        <div style={{background:T.card,borderRadius:12,border:`1.5px solid ${T.cardBorder}`,padding:"12px 14px",marginBottom:12}}><input placeholder="Cumartesi Halısaha Maçı" style={{background:"none",border:"none",color:T.text,fontSize:14,width:"100%",outline:"none",fontWeight:500}}/></div>
        <div style={{background:T.card,borderRadius:12,border:`1.5px solid ${T.cardBorder}`,padding:"12px 14px",marginBottom:12,minHeight:60}}><textarea placeholder="Açıklama (opsiyonel)" rows={2} style={{background:"none",border:"none",color:T.text,fontSize:14,width:"100%",outline:"none",fontWeight:500,resize:"none"}}/></div>
      </div>
      <div style={{fontSize:13,color:T.textDim,marginBottom:10,fontWeight:600}}>Maç Formatı</div>
      <div style={{display:"flex",gap:8,marginBottom:24}}>
        {fmts.map(f=><div key={f} onClick={()=>setFmt(f)} style={{flex:1,padding:"14px 8px",borderRadius:12,background:fmt===f?`${T.accent}12`:T.card,border:`1.5px solid ${fmt===f?T.accent:T.cardBorder}`,textAlign:"center",cursor:"pointer"}}>
          <div style={{fontSize:14,fontWeight:fmt===f?700:500,color:fmt===f?T.accent:T.text}}>{f}</div>
        </div>)}
      </div>
      <Btn primary full onClick={()=>setStep(1)}>Devam</Btn>
    </div>}

    {/* Step 2: Date & Location */}
    {step===1&&<div style={{padding:"0 16px"}}>
      <div style={{fontSize:12,color:T.textMuted,fontWeight:600,marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>Adım 2/4 — Tarih & Konum</div>
      <div style={{fontSize:20,fontWeight:800,color:T.text,marginBottom:20,fontFamily:FH}}>Ne Zaman, Nerede?</div>
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        <div style={{flex:1,background:T.card,borderRadius:12,border:`1.5px solid ${T.cardBorder}`,padding:"12px 14px"}}><input type="date" style={{background:"none",border:"none",color:T.text,fontSize:14,width:"100%",outline:"none",colorScheme:"dark"}}/></div>
        <div style={{flex:1,background:T.card,borderRadius:12,border:`1.5px solid ${T.cardBorder}`,padding:"12px 14px"}}><input type="time" style={{background:"none",border:"none",color:T.text,fontSize:14,width:"100%",outline:"none",colorScheme:"dark"}}/></div>
      </div>
      <div style={{fontSize:13,color:T.textDim,marginBottom:10,fontWeight:600}}>Konum</div>
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:24}}>
        {locModes.map(l=><div key={l.id} onClick={()=>setLocMode(l.id)} style={{padding:"14px 16px",borderRadius:12,background:locMode===l.id?`${T.accent}10`:T.card,border:`1.5px solid ${locMode===l.id?T.accent:T.cardBorder}`,cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:20}}>{l.ic}</span>
          <span style={{fontSize:14,fontWeight:locMode===l.id?700:500,color:locMode===l.id?T.accent:T.text}}>{l.l}</span>
        </div>)}
      </div>
      <Btn primary full onClick={()=>setStep(2)}>Devam</Btn>
    </div>}

    {/* Step 3: Settings */}
    {step===2&&<div style={{padding:"0 16px"}}>
      <div style={{fontSize:12,color:T.textMuted,fontWeight:600,marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>Adım 3/4 — Katılım Ayarları</div>
      <div style={{fontSize:20,fontWeight:800,color:T.text,marginBottom:20,fontFamily:FH}}>Katılım Ayarları</div>

      <div style={{fontSize:13,color:T.textDim,marginBottom:8,fontWeight:600}}>Maks. Oyuncu</div>
      <div style={{background:T.card,borderRadius:12,border:`1.5px solid ${T.cardBorder}`,padding:"12px 14px",marginBottom:16}}><input type="number" defaultValue={12} placeholder="12" style={{background:"none",border:"none",color:T.text,fontSize:14,width:"100%",outline:"none",fontWeight:500}}/></div>

      <div style={{fontSize:13,color:T.textDim,marginBottom:8,fontWeight:600}}>Seviye Tercihi</div>
      <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>{["Herkes","Başlangıç","Orta","İyi","Profesyonel"].map(l=><Badge key={l} c={T.textDim} st={{cursor:"pointer",padding:"6px 12px"}}>{l}</Badge>)}</div>

      <div style={{fontSize:13,color:T.textDim,marginBottom:8,fontWeight:600}}>Kabul Modu</div>
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        {[{id:"open",l:"Herkesi Kabul Et"},{id:"approval",l:"Onay ile Kabul Et"}].map(a=><div key={a.id} onClick={()=>setAccept(a.id)} style={{flex:1,padding:"12px",borderRadius:10,background:accept===a.id?`${T.accent}10`:T.card,border:`1.5px solid ${accept===a.id?T.accent:T.cardBorder}`,textAlign:"center",cursor:"pointer",fontSize:12,fontWeight:accept===a.id?700:500,color:accept===a.id?T.accent:T.text}}>{a.l}</div>)}
      </div>

      <div style={{fontSize:13,color:T.textDim,marginBottom:8,fontWeight:600}}>Gizlilik</div>
      <div style={{display:"flex",gap:6,marginBottom:24,flexWrap:"wrap"}}>
        {privacyOpts.map(p=><div key={p.id} onClick={()=>setPrivacy(p.id)} style={{padding:"8px 14px",borderRadius:10,background:privacy===p.id?`${T.accent}10`:T.card,border:`1.5px solid ${privacy===p.id?T.accent:T.cardBorder}`,cursor:"pointer",fontSize:12,fontWeight:privacy===p.id?700:500,color:privacy===p.id?T.accent:T.text}}>{p.l}</div>)}
      </div>
      <Btn primary full onClick={()=>setStep(3)}>Devam</Btn>
    </div>}

    {/* Step 4: Invite */}
    {step===3&&<div style={{padding:"0 16px"}}>
      <div style={{fontSize:12,color:T.textMuted,fontWeight:600,marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>Adım 4/4 — Davet</div>
      <div style={{fontSize:20,fontWeight:800,color:T.text,marginBottom:20,fontFamily:FH}}>Arkadaşlarını Davet Et</div>
      {U.filter(u=>u.follow&&u.id!==1).map(u=><div key={u.id} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 0",borderBottom:`1px solid ${T.cardBorder}22`}}>
        <Av i={u.av} s={36}/>
        <div style={{flex:1}}><div style={{fontSize:14,color:T.text,fontWeight:500}}>{u.name}</div><div style={{fontSize:11,color:T.textDim}}>%{u.att} katılım</div></div>
        <Btn small primary={!invites.includes(u.id)} onClick={()=>setInvites(p=>p.includes(u.id)?p:[ ...p,u.id])} st={invites.includes(u.id)?{background:`${T.green}22`,color:T.green,border:`1.5px solid ${T.green}44`}:{}}>{invites.includes(u.id)?"Gönderildi ✓":"Davet Et"}</Btn>
      </div>)}
      <Btn primary full onClick={()=>onNav("S08")} st={{marginTop:20}}>Yayınla 📢</Btn>
      <div onClick={()=>onNav("S08")} style={{textAlign:"center",marginTop:12,fontSize:13,color:T.textDim,cursor:"pointer"}}>Atla</div>
    </div>}
  </div>;
}

// ============================================================
// MAIN
// ============================================================
export default function SporWaveMatches(){
  const [cur,setCur]=useState("S08");
  const [curId,setCurId]=useState(null);
  const [fade,setFade]=useState(true);

  useEffect(()=>{if(!document.querySelector('link[href*="Plus+Jakarta+Sans"]')){const l=document.createElement("link");l.href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap";l.rel="stylesheet";document.head.appendChild(l);}},[]);

  const nav=(p,id)=>{setFade(false);setTimeout(()=>{setCur(p);setCurId(id||null);setFade(true);},120);};

  const pg=()=>{
    switch(cur){
      case "S08":return <S08 onNav={nav}/>;
      case "S09":return <><S08 onNav={nav}/><S09 onNav={nav}/></>;
      case "S10":return <S10 onNav={nav}/>;
      case "S14":return <><S08 onNav={nav}/><S14 onNav={nav}/></>;
      case "S31":return <S31 onNav={nav}/>;
      default:return <S08 onNav={nav}/>;
    }
  };

  const showTabs=["S08","S09","S14"].includes(cur);

  return <div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",background:T.bg,color:T.text,fontFamily:FB,position:"relative",boxShadow:"0 0 60px rgba(0,0,0,.5)"}}>
    <div style={{position:"sticky",top:0,zIndex:200,background:T.bgAlt,borderBottom:`1px solid ${T.cardBorder}`,padding:"6px 8px",display:"flex",gap:4}}>
      {[{p:"S08",l:"Maçlar"},{p:"S09",l:"FAB Menu"},{p:"S10",l:"Canlı Skor"},{p:"S14",l:"Seviye"},{p:"S31",l:"Oluştur"}].map(n=><span key={n.p} onClick={()=>nav(n.p)} style={{padding:"4px 10px",borderRadius:6,fontSize:11,fontWeight:600,background:cur===n.p?T.accent:`${T.textDim}22`,color:cur===n.p?T.bg:T.textDim,cursor:"pointer"}}>{n.l}</span>)}
    </div>
    <div style={{opacity:fade?1:0,transform:fade?"translateY(0)":"translateY(6px)",transition:"all .12s ease"}}>{pg()}</div>
    {showTabs&&<TabBar active="S08" onNav={nav}/>}
  </div>;
}
