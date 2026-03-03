import { useState, useEffect, useRef } from "react";
import T from "./theme.js";

// ============================================================
// SPORWAVE MODULE 3 — Maçlar Core (S08, S09, S10, S14, S31)
// ============================================================
const FH="'Plus Jakarta Sans','SF Pro Display',-apple-system,sans-serif";
const FB="'SF Pro Display','SF Pro Text',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";

// Mock data
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
  {id:1,name:"Berk Yılmaz",un:"berk26",av:"BY",img:AVATARS[0],att:94,follow:true},
  {id:2,name:"Ali Demir",un:"alidemir",av:"AD",img:AVATARS[1],att:88,follow:true},
  {id:3,name:"Mehmet Kaya",un:"mkaya",av:"MK",img:AVATARS[2],att:91,follow:false},
  {id:4,name:"Emre Çelik",un:"emrecelik",av:"EÇ",img:AVATARS[3],att:96,follow:true},
  {id:5,name:"Can Yıldız",un:"canyildiz",av:"CY",img:AVATARS[4],att:85,follow:false},
  {id:6,name:"Oğuz Han",un:"oguzhan",av:"OH",img:AVATARS[5],att:92,follow:false},
  {id:7,name:"Kerem Aktaş",un:"keremm",av:"KA",img:AVATARS[6],att:78,follow:false},
  {id:8,name:"Burak Şen",un:"buraksen",av:"BŞ",img:AVATARS[7],att:90,follow:false},
];
const uf=id=>U.find(u=>u.id===id);

const PLANNED=[
  {id:104,title:"Kadıköy Gece Maçı",desc:"Her seviyeden oyuncu bekliyoruz, keyifli bir maç olacak. Sahada buluşalım!",date:"8 Mar",time:"21:30",loc:{name:"Kadıköy Arena",addr:"Rasimpaşa Mah. Rıhtım Cad. No:44, Kadıköy",lat:40.9901,lng:29.0234,type:"place"},fmt:"6v6",host:1,joined:10,max:12,level:"İyi",mode:"open",vis:"followers",myMatch:true,friendsInMatch:[]},
  {id:101,title:"Cumartesi Akşam Maçı",desc:"Rekabetçi bir maç planlıyoruz, kaleci var. Seviye fark etmez herkes gelsin.",date:"1 Mar",time:"20:00",loc:{name:"Kadıköy Spor Tesisleri",addr:"Caferağa Mah. Moda Cad. No:12, Kadıköy",lat:40.9867,lng:29.0287,type:"place"},fmt:"6v6",host:2,joined:7,max:12,level:"Herkes",mode:"open",vis:"public",myMatch:false,friendsInMatch:["Emre"]},
  {id:103,title:"Ataşehir Turnuva",desc:"Ataşehir'de düzenlenen hafta sonu turnuvası, kayıt ücretsiz.",date:"5 Mar",time:"19:00",loc:{city:"İstanbul",district:"Ataşehir",type:"area"},fmt:"7v7",host:3,joined:4,max:14,level:"Herkes",mode:"open",vis:"public",myMatch:false,friendsInMatch:["Ali","Emre"]},
  {id:102,title:"Pazar Sabah Maçı",desc:"Sabah erken maçı, uyanabilen gelsin. Maç sonrası kahvaltı yapıyoruz.",date:"2 Mar",time:"10:00",loc:{name:"Beşiktaş Halısaha",addr:"Sinanpaşa Mah. Beşiktaş Cad. No:5, Beşiktaş",lat:41.0422,lng:29.0046,type:"place"},fmt:"5v5",host:6,joined:9,max:10,level:"Orta+",mode:"approval",vis:"public",myMatch:false,friendsInMatch:[]},
];

const UNRATED=[{id:201,title:"Perşembe Maçı",date:"27 Şub",time:"20:00",loc:{name:"Kadıköy Spor",addr:"Caferağa Mah. Moda Cad. No:12, Kadıköy",lat:40.9867,lng:29.0287,type:"place"},sc:[3,2],host:4,players:[2,3,4,5,6,7]}];

// Icons
const I={
  filter:c=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/></svg>,
  plus:c=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c||"#0D0D0D"} strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  football:c=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15 15 0 014 10 15 15 0 01-4 10 15 15 0 01-4-10 15 15 0 014-10z"/><path d="M2 12h20"/></svg>,
  home:c=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>,
  user:c=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 10-16 0"/></svg>,
  arrowLeft:c=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.text} strokeWidth="2" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12,19 5,12 12,5"/></svg>,
  star:c=><svg width="16" height="16" viewBox="0 0 24 24" fill={c||T.gold} stroke={c||T.gold} strokeWidth="1"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>,
  clock:c=><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c||T.textMuted} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>,
  pin:c=><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c||T.textMuted} strokeWidth="2" strokeLinecap="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>,
  users:c=><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c||T.textMuted} strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
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
  search:c=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
};

// Components
function Av({i,img,s=32,c=T.accent,onClick,st}){return <div onClick={onClick} style={{width:s,height:s,borderRadius:"50%",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",background:`${c}18`,border:"none",color:c,fontSize:s*.34,fontWeight:700,cursor:onClick?"pointer":"default",flexShrink:0,...st}}>{img?<img src={img} alt="" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>:i}</div>;}
function Btn({children,primary,danger,small,full,ghost,onClick,disabled,st}){const[h,setH]=useState(false);return <button disabled={disabled} onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{padding:small?"7px 14px":"12px 20px",borderRadius:10,border:primary||danger?"none":`1.5px solid ${ghost?"transparent":T.cardBorder}`,background:disabled?`${T.textDim}22`:danger?T.red:primary?T.accent:"transparent",color:disabled?T.textDim:danger?"#fff":primary?"#fff":T.text,fontSize:small?12:14,fontWeight:600,cursor:disabled?"not-allowed":"pointer",width:full?"100%":"auto",transition:"all .2s",transform:h&&!disabled?"translateY(-1px)":"none",display:"flex",alignItems:"center",justifyContent:"center",gap:6,...st}}>{children}</button>;}
function Badge({children,c=T.accent,st}){return <span style={{display:"inline-flex",alignItems:"center",gap:3,padding:"2px 8px",borderRadius:20,fontSize:11,fontWeight:600,color:"#fff",background:c,whiteSpace:"nowrap",...st}}>{children}</span>;}

function TabBar({active,onNav}){const tabs=[{id:"S05",ic:I.home,l:"Ana Sayfa"},{id:"S08",ic:I.football,l:"Maçlar"},{id:"S15",ic:I.user,l:"Profil"}];const handleTabClick=(tabId)=>{if(tabId==="S05"){window.location.assign("/02_feed");return;}if(tabId==="S15"){window.location.assign("/05_profile");return;}onNav(tabId);};return <div style={{position:"fixed",bottom:0,left:0,right:0,height:56,background:T.bgAlt,borderTop:`1px solid ${T.cardBorder}`,display:"flex",justifyContent:"space-around",alignItems:"center",zIndex:100,maxWidth:430,margin:"0 auto"}}>{tabs.map(t=><div key={t.id} onClick={()=>handleTabClick(t.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:"pointer",padding:"8px 20px"}}><span style={{display:"flex"}}>{t.ic(active===t.id?T.accent:T.textMuted)}</span><span style={{fontSize:10,fontWeight:active===t.id?700:500,color:active===t.id?T.accent:T.textMuted}}>{t.l}</span></div>)}</div>;}

function CapacityBar({joined,max}){const pct=joined/max*100;return <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{flex:1,height:4,borderRadius:2,background:`${T.textDim}18`}}><div style={{height:4,borderRadius:2,background:T.accent,width:`${pct}%`,transition:"width .3s"}}/></div><span style={{fontSize:11,color:T.textMuted,fontWeight:500,whiteSpace:"nowrap"}}>{joined}/{max}</span></div>;}

// S08: Matches Page (2 tabs: Maç Bul | Maçlarım)
function S08({onNav,showUnrated,hasActiveWidget}){
  const [activeTab,setActiveTab]=useState("find"); // "find" | "mine"
  const [filter,setFilter]=useState(false);
  const cities=["İstanbul","Ankara","İzmir","Bursa","Antalya","Adana"];
  const [city,setCity]=useState("İstanbul"); // default: kullanıcının profil şehri
  const [cityOpen,setCityOpen]=useState(false);
  const districts=["Tümü","Kadıköy","Beşiktaş","Üsküdar","Ataşehir","Maltepe","Bakırköy","Şişli","Beylikdüzü","Kartal","Pendik","Sarıyer","Fatih","Bağcılar","Küçükçekmece"];
  const [district,setDistrict]=useState("Tümü");
  const [districtOpen,setDistrictOpen]=useState(false);
  const [dateFilter,setDateFilter]=useState(null);
  // Inline MVP voting state
  const [expandedRating,setExpandedRating]=useState(null);
  const [mvpVote,setMvpVote]=useState(null);
  const [mvpSubmitted,setMvpSubmitted]=useState({});

  const openMatches=PLANNED.filter(m=>!m.myMatch);
  const myMatches=PLANNED.filter(m=>m.myMatch);

  return <div style={{paddingBottom:hasActiveWidget?156:80}}>
    {/* Header — sticky */}
    <div style={{position:"sticky",top:32,zIndex:50,background:`${T.bg}ee`,backdropFilter:"blur(12px)",borderBottom:`1px solid ${T.cardBorder}`}}>
      <div style={{padding:"8px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:20,fontWeight:800,color:T.text,fontFamily:FH}}>Maçlar</span>
        {activeTab==="find"&&<div style={{display:"flex",alignItems:"center",gap:8}}>
          {/* City dropdown */}
          <div style={{position:"relative"}}>
            <div onClick={()=>{setCityOpen(!cityOpen);setDistrictOpen(false);}} style={{display:"flex",alignItems:"center",gap:4,padding:"6px 10px",borderRadius:8,border:`1px solid ${cityOpen?T.accent:T.cardBorder}`,cursor:"pointer",background:cityOpen?`${T.accent}08`:"transparent",transition:"all .2s"}}>
              {I.pin(cityOpen?T.accent:T.textDim)}
              <span style={{fontSize:12,fontWeight:600,color:cityOpen?T.accent:T.text}}>{city}</span>
              <span style={{fontSize:9,color:T.textDim,transform:cityOpen?"rotate(180deg)":"none",transition:"transform .2s"}}>▼</span>
            </div>
            {cityOpen&&<div style={{position:"absolute",right:0,top:38,background:T.card,borderRadius:12,border:`1px solid ${T.cardBorder}`,padding:4,minWidth:140,zIndex:100,boxShadow:"0 8px 24px rgba(0,0,0,.25)",maxHeight:220,overflowY:"auto"}}>
              {cities.map(c=><div key={c} onClick={()=>{setCity(c);setCityOpen(false);}} style={{padding:"10px 12px",borderRadius:8,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",fontSize:13,fontWeight:city===c?700:500,color:city===c?T.accent:T.text}} onMouseEnter={e=>e.currentTarget.style.background=`${T.textDim}10`} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <span>{c}</span>
                {city===c&&<span style={{fontSize:12,color:T.accent}}>✓</span>}
              </div>)}
            </div>}
          </div>
          {/* Filter icon */}
          <span onClick={()=>{setFilter(!filter);setDistrictOpen(false);setCityOpen(false);}} style={{cursor:"pointer",display:"flex",padding:6,borderRadius:8,background:filter?`${T.accent}10`:"transparent"}}>{I.filter(filter?T.accent:T.textDim)}</span>
        </div>}
      </div>
      {/* Tabs */}
      <div style={{display:"flex",padding:"0 16px"}}>
        {[{id:"find",label:"Maç Bul"},{id:"mine",label:"Maçlarım"}].map(tab=><div key={tab.id} onClick={()=>{setActiveTab(tab.id);if(tab.id==="mine")setFilter(false);}} style={{flex:1,textAlign:"center",padding:"10px 0",fontSize:13,fontWeight:700,color:activeTab===tab.id?T.accent:T.textDim,borderBottom:activeTab===tab.id?`2px solid ${T.accent}`:"2px solid transparent",cursor:"pointer",transition:"all .2s"}}>{tab.label}</div>)}
      </div>
    </div>

    {/* Filter drawer (only Maç Bul tab) */}
    {activeTab==="find"&&filter&&<div style={{position:"fixed",bottom:0,left:0,right:0,top:0,maxWidth:430,margin:"0 auto",zIndex:150,display:"flex",alignItems:"flex-end"}}>
      <div onClick={()=>{setFilter(false);setDistrictOpen(false);}} style={{position:"absolute",inset:0,background:"rgba(0,0,0,.35)"}}/>
      <div style={{position:"relative",width:"100%",background:T.card,borderRadius:"20px 20px 0 0",padding:"20px 20px 32px",marginBottom:56,zIndex:151}}>
        <div style={{width:40,height:4,borderRadius:2,background:T.cardBorder,margin:"0 auto 20px"}}/>
        <div style={{fontSize:18,fontWeight:800,color:T.text,marginBottom:20,fontFamily:FH}}>Filtrele</div>

        {/* İlçe */}
        <div style={{fontSize:12,fontWeight:700,color:T.textDim,marginBottom:8,textTransform:"uppercase",letterSpacing:.5}}>İlçe</div>
        <div onClick={()=>setDistrictOpen(!districtOpen)} style={{cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 12px",borderRadius:10,border:`1.5px solid ${districtOpen?T.accent:T.cardBorder}`,background:T.bg,marginBottom:districtOpen?0:16}}>
          <span style={{fontSize:13,fontWeight:600,color:district==="Tümü"?T.textDim:T.accent}}>{district}</span>
          <span style={{fontSize:11,color:T.textDim,transform:districtOpen?"rotate(180deg)":"none",transition:"transform .2s"}}>▼</span>
        </div>
        {districtOpen&&<div style={{maxHeight:180,overflowY:"auto",borderRadius:"0 0 10px 10px",border:`1px solid ${T.cardBorder}`,borderTop:"none",marginBottom:16}}>
          {districts.map(d=><div key={d} onClick={()=>{setDistrict(d);setDistrictOpen(false);}} style={{padding:"10px 12px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",background:district===d?`${T.accent}12`:"transparent",transition:"background .15s"}} onMouseEnter={e=>{if(district!==d)e.currentTarget.style.background=`${T.textDim}10`;}} onMouseLeave={e=>{if(district!==d)e.currentTarget.style.background=district===d?`${T.accent}12`:"transparent";}}>
            <span style={{fontSize:13,fontWeight:district===d?700:500,color:district===d?T.accent:T.text}}>{d}</span>
            {district===d&&<span style={{fontSize:13,color:T.accent}}>✓</span>}
          </div>)}
        </div>}

        {/* Tarih */}
        <div style={{fontSize:12,fontWeight:700,color:T.textDim,marginBottom:8,textTransform:"uppercase",letterSpacing:.5}}>Tarih</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>{["Bugün","Bu hafta","Bu ay"].map(d=><span key={d} onClick={()=>setDateFilter(dateFilter===d?null:d)} style={{display:"inline-flex",alignItems:"center",padding:"6px 12px",borderRadius:20,fontSize:12,fontWeight:600,color:dateFilter===d?"#0D0D0D":T.textDim,background:dateFilter===d?T.accent:`${T.textDim}18`,cursor:"pointer",transition:"all .2s"}}>{d}</span>)}</div>

        <div style={{display:"flex",gap:8}}><Btn small primary full onClick={()=>{setFilter(false);setDistrictOpen(false);}}>Uygula</Btn><Btn small ghost onClick={()=>{setDistrict("Tümü");setDateFilter(null);}}>Sıfırla</Btn></div>
      </div>
    </div>}

    {/* === Maç Bul tab === */}
    {activeTab==="find"&&<div>
      {openMatches.length>0
        ? openMatches.map((m,i)=><>
            {i>0&&<div key={`div-${m.id}`} style={{height:8,background:T.bgAlt}}/>}
            <MatchListCard key={m.id} m={m} onNav={onNav} isMine={false}/>
          </>)
        : <div style={{textAlign:"center",padding:"48px 24px"}}><div style={{marginBottom:12,opacity:.5}}>{I.football(T.textMuted)}</div><div style={{fontSize:14,color:T.textDim}}>Şu an açık maç yok</div><div style={{fontSize:12,color:T.textMuted,marginTop:4}}>İlk maçı sen oluştur!</div></div>
      }
    </div>}

    {/* === Maçlarım tab === */}
    {activeTab==="mine"&&<div>
      {/* Unrated matches (top) — inline MVP voting */}
      {showUnrated&&UNRATED.length>0&&<div>
        {UNRATED.filter(m=>!mvpSubmitted[m.id]).map(m=>{
          const isExpanded=expandedRating===m.id;
          const players=(m.players||[]).filter(pid=>pid!==1).map(pid=>uf(pid)).filter(Boolean);
          return <div key={m.id}>
            <div onClick={()=>{setExpandedRating(isExpanded?null:m.id);setMvpVote(null);}} style={{background:isExpanded?`${T.accent}14`:`${T.accent}08`,borderRadius:0,borderLeft:`4px solid ${T.accent}`,borderBottom:isExpanded?"none":`1px solid ${T.cardBorder}`,padding:"14px 16px",cursor:"pointer"}}>
              <div style={{marginBottom:6}}><Badge c={T.accent}>{I.star("#fff")} Bu maçı değerlendir</Badge></div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,marginBottom:4}}>
                <div style={{fontWeight:700,fontSize:16,color:T.text,fontFamily:FH,flex:1,lineHeight:1.4}}>{m.title}</div>
                <div style={{fontSize:14,fontWeight:900,letterSpacing:"-0.5px",fontFamily:FH,color:T.accent,flexShrink:0}}>{m.sc[0]}–{m.sc[1]}</div>
              </div>
              <div style={{display:"flex",gap:10,fontSize:12,color:T.textDim,alignItems:"center",flexWrap:"wrap"}}>
                <span style={{display:"flex",alignItems:"center",gap:3}}>{I.clock()} {m.date} · {m.time}</span>
                {m.loc&&<span style={{display:"flex",alignItems:"center",gap:3}}>{I.pin()} {m.loc.name?.split(" ")[0]||m.loc.district}</span>}
              </div>
            </div>
            {/* Inline MVP voting panel */}
            {isExpanded&&<div style={{background:`${T.accent}08`,borderLeft:`4px solid ${T.accent}`,borderBottom:`1px solid ${T.cardBorder}`,padding:"0 16px 16px"}}>
              <div style={{fontSize:13,fontWeight:700,color:T.text,marginBottom:8,fontFamily:FH}}>Maçın Yıldızını Seç</div>
              <div style={{fontSize:11,color:T.textDim,marginBottom:12}}>En iyi oynayan kişiyi seç (1 oy hakkın var)</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:mvpVote?12:0}}>
                {players.map(u=>{
                  const sel=mvpVote===u.id;
                  return <div key={u.id} onClick={e=>{e.stopPropagation();setMvpVote(sel?null:u.id);}} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:"pointer",padding:6,borderRadius:12,background:sel?`${T.accent}18`:"transparent",border:sel?`1.5px solid ${T.accent}`:"1.5px solid transparent",transition:"all .2s",minWidth:56}}>
                    <Av i={u.av} img={u.img} s={40} c={sel?T.accent:T.textDim}/>
                    <span style={{fontSize:10,fontWeight:sel?700:500,color:sel?T.accent:T.textDim,textAlign:"center",lineHeight:1.2,maxWidth:60,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.name.split(" ")[0]}</span>
                  </div>;
                })}
              </div>
              {mvpVote&&<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:T.card,borderRadius:12,padding:"10px 16px",border:`1.5px solid ${T.accent}`}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  {I.star(T.accent)}
                  <span style={{fontSize:14,fontWeight:700,color:T.accent}}>{uf(mvpVote)?.name}</span>
                </div>
                <div onClick={e=>{e.stopPropagation();setMvpSubmitted(prev=>({...prev,[m.id]:true}));setExpandedRating(null);setMvpVote(null);}} style={{width:36,height:36,borderRadius:10,background:T.accent,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>{I.check("#fff")}</div>
              </div>}
            </div>}
          </div>;
        })}
        {UNRATED.some(m=>!mvpSubmitted[m.id])&&<div style={{height:8,background:T.bgAlt}}/>}
      </div>}

      {/* My matches */}
      {myMatches.length>0
        ? myMatches.map((m,i)=><>
            {i>0&&<div key={`div-${m.id}`} style={{height:8,background:T.bgAlt}}/>}
            <MatchListCard key={m.id} m={m} onNav={onNav} isMine={true}/>
          </>)
        : !showUnrated||UNRATED.length===0
          ? <div style={{textAlign:"center",padding:"48px 24px"}}><div style={{marginBottom:12,opacity:.5}}>{I.football(T.textMuted)}</div><div style={{fontSize:15,fontWeight:600,color:T.textDim,marginBottom:6}}>Henüz bir maça katılmadın.</div><div style={{fontSize:13,color:T.textMuted,lineHeight:1.5}}>Açık maçlara göz at ve ilk maçına katıl!</div></div>
          : null
      }
    </div>}

  </div>;
}

function MatchListCard({m,onNav,isMine}){
  const host=uf(m.host);
  const spotsLeft=m.max-m.joined;
  const almostFull=spotsLeft<=2;
  const levelLabel = m.level && m.level !== "Herkes" ? m.level : "Herkes";
  const levelColor = m.level && m.level !== "Herkes" ? T.orange : T.textDim;
  const acceptLabel = m.mode === "approval" ? "Onay gerekli" : "Açık";
  const acceptColor = m.mode === "approval" ? T.purple : T.textDim;
  const friends=m.friendsInMatch||[];
  const statusBadge = isMine
    ? <Badge c={T.accent}>{I.check("#fff")} Katılıyorsun</Badge>
    : null;
  return <div onClick={()=>window.location.assign("/04_match_detail?view=S12")} style={{background:isMine?`${T.accent}14`:"none",borderRadius:0,borderLeft:isMine?`4px solid ${T.accent}`:`4px solid ${T.cardBorder}`,borderBottom:`1px solid ${T.cardBorder}`,padding:"14px 16px",cursor:"pointer"}}>
    {/* Status row */}
    {statusBadge&&<div style={{display:"flex",justifyContent:"flex-start",marginBottom:8}}>{statusBadge}</div>}
    {/* Friend badge (Maç Bul tab) */}
    {!isMine&&friends.length>0&&<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
      <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600,color:T.accent,background:`${T.accent}14`}}>{I.users(T.accent)} Takip ettiğin {friends.length} kişi bu maçta</span>
    </div>}
    {/* Title row */}
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,marginBottom:4}}>
      <div style={{fontWeight:700,fontSize:16,color:T.text,fontFamily:FH,flex:1,lineHeight:1.4}}>{m.title}</div>
    </div>
    {/* Description */}
    {m.desc&&<div style={{fontSize:13,color:T.textDim,lineHeight:1.5,marginBottom:8,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{m.desc}</div>}
    {/* Date / location */}
    <div style={{display:"flex",gap:10,fontSize:12,color:T.textDim,marginBottom:8,flexWrap:"wrap",alignItems:"center",lineHeight:1.4}}>
      <span style={{display:"flex",alignItems:"center",gap:3}}>{I.clock()} {m.date} · {m.time}</span>
      <span style={{display:"flex",alignItems:"center",gap:3,color:T.accent}}>{I.pin(T.accent)} {m.loc.name?.split(" ")[0]||m.loc.district}</span>
    </div>
    {/* Host row + almost full */}
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8,lineHeight:1.4}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <Av i={host?.av} img={host?.img} s={20}/>
        <span style={{fontSize:12,color:T.textDim}}>{host?.name?.split(" ")[0]}</span>
        <span style={{fontSize:11,color:T.textMuted}}>·</span>
        <Badge c={T.textDim}>{m.fmt}</Badge>
      </div>
      {almostFull&&<span style={{fontSize:11,fontWeight:700,color:T.text}}>Son {spotsLeft} yer!</span>}
    </div>
    <CapacityBar joined={m.joined} max={m.max}/>
  </div>;
}

// S09: Bottom Sheet
function S09({onNav}){
  return <div style={{position:"fixed",bottom:0,left:0,right:0,top:0,maxWidth:430,margin:"0 auto",zIndex:150,display:"flex",alignItems:"flex-end"}}>
    <div onClick={()=>onNav("S08")} style={{position:"absolute",inset:0,background:"rgba(0,0,0,.35)"}}/>
    <div style={{position:"relative",width:"100%",background:T.card,borderRadius:"20px 20px 0 0",padding:"20px 20px 32px",marginBottom:56,zIndex:151}}>
      <div style={{width:40,height:4,borderRadius:2,background:T.cardBorder,margin:"0 auto 20px"}}/>
      <div style={{fontSize:18,fontWeight:800,color:T.text,marginBottom:20,fontFamily:FH}}>Ne yapmak istiyorsun?</div>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <div onClick={()=>onNav("S10")} style={{background:T.bg,borderRadius:16,border:`1.5px solid ${T.cardBorder}`,padding:"14px 16px",cursor:"pointer",display:"flex",gap:16,alignItems:"center",transition:"border-color .2s"}}>
          <div style={{width:52,height:52,borderRadius:14,background:"transparent",border:`1.5px solid ${T.accent}`,display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="24" height="24" viewBox="0 0 24 24" fill={T.accent} style={{marginLeft:2}}><polygon points="5,3 19,12 5,21"/></svg></div>
          <div><div style={{fontWeight:700,fontSize:16,color:T.text,fontFamily:FH}}>Maç Başlat</div><div style={{fontSize:12,color:T.textDim,marginTop:3,fontFamily:FB}}>Hemen oynayacağın bir maçı başlat ve skor tut</div></div>
        </div>
        <div onClick={()=>onNav("S31")} style={{background:T.bg,borderRadius:16,border:`1.5px solid ${T.cardBorder}`,padding:"14px 16px",cursor:"pointer",display:"flex",gap:16,alignItems:"center",transition:"border-color .2s"}}>
          <div style={{width:52,height:52,borderRadius:14,background:"transparent",border:`1.5px solid ${T.purple}`,display:"flex",alignItems:"center",justifyContent:"center"}}>{I.megaphone()}</div>
          <div><div style={{fontWeight:700,fontSize:16,color:T.text,fontFamily:FH}}>Maç Oluştur</div><div style={{fontSize:12,color:T.textDim,marginTop:3,fontFamily:FB}}>İleri tarihli maç planla ve oyuncu bul</div></div>
        </div>
      </div>
    </div>
  </div>;
}

// S10: Live Match (3 pages — no progress bar)
// Icons for S10
const I10={
  chevDown:c=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.text} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6,9 12,15 18,9"/></svg>,
  arrowLeft:c=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.text} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15,18 9,12 15,6"/></svg>,
  chevUp:c=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c||T.text} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6,15 12,9 18,15"/></svg>,
  settings:c=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  usersIcon:c=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  edit:c=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
};

// S10: Canlı Skor + Maç Sonu (sadece bu 2 sayfa)
function S10({onNav,onMinimize,onEndMatch,initialSeconds,initialRunning}){
  const [page,setPage]=useState(()=>{const p=new URLSearchParams(window.location.search).get("page");return p==="end"?"end":"live";});
  const [fmt]=useState("5v5");
  const [teamA]=useState([{id:1,name:"Berk",av:"BY"},{id:2,name:"Ali",av:"AD"},{id:"g1",name:"Tolga",av:"T",guest:true}]);
  const [teamB]=useState([{id:3,name:"Mehmet",av:"MK"}]);
  const initEnd=page==="end";
  const [score,setScore]=useState(initEnd?[3,2]:[0,0]);
  const [goals,setGoals]=useState(initEnd?[
    {id:1,team:"A",min:12,scorer:1,assist:2},
    {id:2,team:"B",min:23,scorer:3,assist:null},
    {id:3,team:"A",min:35,scorer:2,assist:1},
    {id:4,team:"A",min:58,scorer:1,assist:null},
    {id:5,team:"B",min:72,scorer:3,assist:null},
  ]:[]);
  const [running,setRunning]=useState(initEnd?false:(initialRunning!=null?initialRunning:true));
  const [seconds,setSeconds]=useState(initEnd?5400:(initialSeconds!=null?initialSeconds:0));
  const [toast,setToast]=useState(null);
  const [deletePopup,setDeletePopup]=useState(false);
  const [goalDrawer,setGoalDrawer]=useState(null);
  const [menuOpen,setMenuOpen]=useState(false);
  const timerRef=useRef(null);

  useEffect(()=>{if(running){timerRef.current=setInterval(()=>setSeconds(s=>s+1),1000);}else{clearInterval(timerRef.current);}return()=>clearInterval(timerRef.current);},[running]);

  const fmtTime=s=>{const m=Math.floor(s/60);const sec=s%60;return `${m}:${sec<10?"0":""}${sec}`;};
  const getPlayerName=(id,team)=>{const list=team==="A"?teamA:teamB;const p=list.find(x=>x.id===id);return p?p.name:null;};
  const drawerPlayers=goalDrawer?(()=>{const list=goalDrawer.team==="A"?teamA:teamB;if(goalDrawer.phase==="assist"){const g=goals.find(x=>x.id===goalDrawer.goalId);return g?.scorer!=null?list.filter(p=>p.id!==g.scorer):list;}return list;})():[];

  const addGoal=(team)=>{
    const min=Math.floor(seconds/60);
    const g={id:Date.now(),team,min,scorer:null,assist:null};
    const ns=[...score];ns[team==="A"?0:1]++;
    setScore(ns);setGoals(prev=>[g,...prev]);
    setToast(g.id);setTimeout(()=>setToast(null),5000);
    setGoalDrawer({team,phase:"scorer",goalId:g.id});
  };
  const editGoal=(g)=>{setGoalDrawer({team:g.team,phase:"scorer",goalId:g.id});};
  const selectScorer=(playerId)=>{
    if(!goalDrawer)return;
    const gid=goalDrawer.goalId;const team=goalDrawer.team;
    setGoals(prev=>prev.map(g=>g.id===gid?{...g,scorer:playerId}:g));
    setGoalDrawer({team,phase:"assist",goalId:gid});
  };
  const selectAssist=(playerId)=>{
    if(!goalDrawer)return;
    setGoals(prev=>prev.map(g=>g.id===goalDrawer.goalId?{...g,assist:playerId}:g));
    setGoalDrawer(null);
  };
  const skipScorer=()=>{setGoalDrawer(null);};
  const skipAssist=()=>{setGoalDrawer(null);};
  const undoGoal=(gid)=>{const g=goals.find(x=>x.id===gid);if(!g)return;const ns=[...score];ns[g.team==="A"?0:1]--;setScore(ns);setGoals(goals.filter(x=>x.id!==gid));setToast(null);};
  const removeGoal=(gid)=>{const g=goals.find(x=>x.id===gid);if(!g)return;const ns=[...score];ns[g.team==="A"?0:1]--;setScore(ns);setGoals(goals.filter(x=>x.id!==gid));};

  // Shared drawer (works on both live + end pages)
  const GoalDrawerUI=()=>goalDrawer?<div style={{position:"fixed",bottom:0,left:0,right:0,top:0,maxWidth:430,margin:"0 auto",zIndex:250,display:"flex",alignItems:"flex-end"}}>
    <div onClick={goalDrawer.phase==="scorer"?skipScorer:skipAssist} style={{position:"absolute",inset:0,background:"rgba(0,0,0,.35)"}}/>
    <div style={{position:"relative",width:"100%",background:T.card,borderRadius:"20px 20px 0 0",padding:"20px 20px 32px",zIndex:251}}>
      <div style={{width:40,height:4,borderRadius:2,background:T.cardBorder,margin:"0 auto 16px"}}/>
      <div style={{fontSize:18,fontWeight:800,color:T.text,marginBottom:16,fontFamily:FH}}>
        {goalDrawer.phase==="scorer"?"Golü kim attı?":"Asisti kim yaptı?"}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:4}}>
        {(()=>{
          const reg=drawerPlayers.filter(p=>!p.guest);
          const gst=drawerPlayers.filter(p=>p.guest);
          return <>
            {reg.map(p=><div key={p.id} onClick={()=>goalDrawer.phase==="scorer"?selectScorer(p.id):selectAssist(p.id)} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderRadius:12,background:T.bg,border:`1px solid ${T.cardBorder}`,cursor:"pointer",transition:"border-color .15s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=T.accent} onMouseLeave={e=>e.currentTarget.style.borderColor=T.cardBorder}>
              <Av i={p.av} img={p.img} s={36}/>
              <span style={{fontSize:14,fontWeight:600,color:T.text}}>{p.name}</span>
            </div>)}
            {gst.length>0&&<div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0"}}>
              <div style={{flex:1,height:1,background:T.cardBorder}}/>
              <span style={{fontSize:10,fontWeight:600,color:T.textMuted,textTransform:"uppercase",letterSpacing:.5}}>Misafirler</span>
              <div style={{flex:1,height:1,background:T.cardBorder}}/>
            </div>}
            {gst.map(p=><div key={p.id} onClick={()=>goalDrawer.phase==="scorer"?selectScorer(p.id):selectAssist(p.id)} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderRadius:12,background:T.bg,border:`1px solid ${T.cardBorder}`,cursor:"pointer",transition:"border-color .15s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=T.accent} onMouseLeave={e=>e.currentTarget.style.borderColor=T.cardBorder}>
              <div style={{position:"relative"}}>
                <Av i={p.av} s={36} c={T.textDim} st={{background:"#6B7280",color:"#fff"}}/>
                <div style={{position:"absolute",bottom:-2,right:-2,width:14,height:14,borderRadius:"50%",background:T.textMuted,display:"flex",alignItems:"center",justifyContent:"center",border:`1.5px solid ${T.card}`}}>
                  <span style={{color:"#fff",fontSize:8,fontWeight:700}}>M</span>
                </div>
              </div>
              <span style={{fontSize:14,fontWeight:600,color:T.text}}>{p.name}</span>
            </div>)}
          </>;
        })()}
      </div>
      <div onClick={goalDrawer.phase==="scorer"?skipScorer:skipAssist} style={{textAlign:"center",marginTop:16,fontSize:14,color:T.textDim,cursor:"pointer",fontWeight:600}}>Atla</div>
    </div>
  </div>:null;

  // Delete popup
  const DeletePopupUI=()=>deletePopup?<div style={{position:"fixed",inset:0,maxWidth:430,margin:"0 auto",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center"}}>
    <div onClick={()=>setDeletePopup(false)} style={{position:"absolute",inset:0,background:"rgba(0,0,0,.35)"}}/>
    <div style={{position:"relative",width:"85%",background:T.card,borderRadius:16,padding:"28px 24px",textAlign:"center",zIndex:301}}>
      <div style={{fontSize:16,fontWeight:700,color:T.text,marginBottom:20,fontFamily:FH}}>Bu maçı silmek istediğinize emin misiniz?</div>
      <Btn danger full onClick={()=>{setDeletePopup(false);onNav("S08");}} st={{fontSize:15,fontWeight:700,padding:"14px 24px",borderRadius:12,marginBottom:10}}>Maçı Sil</Btn>
      <Btn full onClick={()=>setDeletePopup(false)} st={{fontSize:15,fontWeight:600,padding:"14px 24px",borderRadius:12}}>İptal</Btn>
    </div>
  </div>:null;

  // Goal list row (reused in live + end)
  const GoalRow=({g,showEdit})=>{
    const scorerName=g.scorer?getPlayerName(g.scorer,g.team):null;
    const assistName=g.assist?getPlayerName(g.assist,g.team):null;
    return <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${T.cardBorder}`}}>
      <div style={{display:"flex",alignItems:"center",gap:8,flex:1}}>
        <span style={{fontSize:11,color:T.textMuted,width:28}}>{g.min}'</span>
        <Badge c={g.team==="A"?T.accent:T.orange}>{scorerName||`Takım ${g.team}`}</Badge>
        {assistName&&<span style={{fontSize:11,color:T.textDim}}>(Asist: {assistName})</span>}
        {showEdit&&<span onClick={()=>editGoal(g)} style={{cursor:"pointer",display:"flex",marginLeft:4}}>{I10.edit(T.accent)}</span>}
      </div>
      <span onClick={()=>removeGoal(g.id)} style={{cursor:"pointer",display:"flex"}}>{I.trash()}</span>
    </div>;
  };

  // ========== LIVE SCORE PAGE ==========
  if(page==="live") return <div style={{padding:"0 20px",paddingBottom:56,minHeight:"100vh",display:"flex",flexDirection:"column"}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 0 12px"}}>
      <div onClick={()=>{setRunning(false);if(onMinimize)onMinimize(seconds,score);}} style={{width:40,height:40,borderRadius:12,background:T.card,border:`1px solid ${T.cardBorder}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>{I10.chevDown(T.text)}</div>
      <div style={{position:"relative"}}>
        <div onClick={()=>setMenuOpen(!menuOpen)} style={{width:40,height:40,borderRadius:12,background:menuOpen?`${T.accent}10`:T.card,border:`1px solid ${menuOpen?T.accent:T.cardBorder}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={menuOpen?T.accent:T.textDim} strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
        </div>
        {menuOpen&&<div style={{position:"absolute",top:48,right:0,background:T.card,border:`1px solid ${T.cardBorder}`,borderRadius:12,padding:4,minWidth:180,zIndex:100,boxShadow:"0 8px 32px rgba(0,0,0,.3)"}}>
          <div onClick={()=>{setMenuOpen(false);window.location.assign("/04_match_detail?view=S12&state=playing");}} style={{padding:"12px 16px",borderRadius:8,cursor:"pointer",display:"flex",alignItems:"center",gap:10,transition:"background .15s"}} onMouseEnter={e=>e.currentTarget.style.background=`${T.textDim}10`} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            {I10.settings(T.textDim)}<span style={{fontSize:14,fontWeight:600,color:T.text}}>Ayarlar</span>
          </div>
          <div onClick={()=>{setMenuOpen(false);setRunning(false);setPage("end");}} style={{padding:"12px 16px",borderRadius:8,cursor:"pointer",display:"flex",alignItems:"center",gap:10,transition:"background .15s"}} onMouseEnter={e=>e.currentTarget.style.background=`${T.red}10`} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.red} strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
            <span style={{fontSize:14,fontWeight:600,color:T.red}}>Maçı Bitir</span>
          </div>
        </div>}
      </div>
    </div>
    {menuOpen&&<div onClick={()=>setMenuOpen(false)} style={{position:"fixed",inset:0,zIndex:50}}/>}

    <div style={{textAlign:"center",marginBottom:20}}>
      <div style={{fontSize:42,fontWeight:900,fontFamily:FH,color:T.text,letterSpacing:"-2px"}}>{fmtTime(seconds)}</div>
      <div style={{display:"flex",justifyContent:"center",gap:12,marginTop:8}}>
        <div onClick={()=>setRunning(!running)} style={{width:40,height:40,borderRadius:12,background:T.card,border:`1px solid ${T.cardBorder}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>{running?I.pause():I.play()}</div>
      </div>
    </div>

    <div style={{display:"flex",gap:12,marginBottom:20}}>
      <div onClick={()=>addGoal("A")} style={{flex:1,padding:"24px 0",borderRadius:16,background:T.accent,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:`0 4px 16px ${T.accent}44`,transition:"transform .1s",gap:4}} onMouseDown={e=>e.currentTarget.style.transform="scale(0.97)"} onMouseUp={e=>e.currentTarget.style.transform="scale(1)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
        <div style={{fontSize:12,fontWeight:700,color:"#fff",opacity:.8}}>Takım A</div>
        <div style={{fontSize:48,fontWeight:900,fontFamily:FH,color:"#fff",lineHeight:1}}>{score[0]}</div>
        <div style={{fontSize:12,fontWeight:700,color:"#fff",opacity:.7,marginTop:2}}>+ Gol</div>
      </div>
      <div onClick={()=>addGoal("B")} style={{flex:1,padding:"24px 0",borderRadius:16,background:T.orange,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:`0 4px 16px ${T.orange}44`,transition:"transform .1s",gap:4}} onMouseDown={e=>e.currentTarget.style.transform="scale(0.97)"} onMouseUp={e=>e.currentTarget.style.transform="scale(1)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
        <div style={{fontSize:12,fontWeight:700,color:"#fff",opacity:.8}}>Takım B</div>
        <div style={{fontSize:48,fontWeight:900,fontFamily:FH,color:"#fff",lineHeight:1}}>{score[1]}</div>
        <div style={{fontSize:12,fontWeight:700,color:"#fff",opacity:.7,marginTop:2}}>+ Gol</div>
      </div>
    </div>

    {toast&&<div style={{background:T.card,border:`1.5px solid ${T.accent}44`,borderRadius:12,padding:"12px 16px",marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <span style={{fontSize:14,color:T.text}}>Gol eklendi</span>
      <span onClick={()=>undoGoal(toast)} style={{fontSize:13,color:T.accent,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>{I.undo(T.accent)} Geri Al</span>
    </div>}

    {goals.length>0&&<div style={{background:T.card,borderRadius:12,border:`1px solid ${T.cardBorder}`,padding:"12px 16px",marginBottom:20}}>
      <div style={{fontSize:12,fontWeight:700,color:T.textMuted,marginBottom:8}}>GOL GEÇMİŞİ</div>
      {goals.map(g=><GoalRow key={g.id} g={g}/>)}
    </div>}

    <GoalDrawerUI/>
  </div>;

  // ========== MATCH END PAGE ==========
  return <div style={{padding:"24px 20px",paddingBottom:56,minHeight:"100vh",display:"flex",flexDirection:"column"}}>
    <div style={{fontSize:24,fontWeight:800,color:T.text,marginBottom:24,marginTop:8,letterSpacing:"-0.5px",fontFamily:FH}}>Maç Sonu</div>

    <div style={{fontSize:13,color:T.textDim,marginBottom:16,textAlign:"center"}}>Süre: {fmtTime(seconds)} · {fmt}</div>

    <div style={{display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20}}>
      <div style={{flex:1,textAlign:"center"}}>
        <div style={{fontSize:12,fontWeight:700,color:T.accent,marginBottom:8}}>Takım A</div>
        <div style={{fontSize:52,fontWeight:900,fontFamily:FH,color:T.accent}}>{score[0]}</div>
        <div onClick={()=>addGoal("A")} style={{margin:"12px auto 0",width:56,height:56,borderRadius:16,background:T.accent,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:22,fontWeight:900,color:"#0D0D0D",boxShadow:`0 4px 16px ${T.accent}44`}}>+</div>
        <div style={{fontSize:11,color:T.textDim,marginTop:6}}>Gol Ekle</div>
      </div>
      <div style={{fontSize:24,color:T.textMuted,fontWeight:300,padding:"0 8px"}}>–</div>
      <div style={{flex:1,textAlign:"center"}}>
        <div style={{fontSize:12,fontWeight:700,color:T.orange,marginBottom:8}}>Takım B</div>
        <div style={{fontSize:52,fontWeight:900,fontFamily:FH,color:T.orange}}>{score[1]}</div>
        <div onClick={()=>addGoal("B")} style={{margin:"12px auto 0",width:56,height:56,borderRadius:16,background:T.orange,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:22,fontWeight:900,color:"#0D0D0D",boxShadow:`0 4px 16px ${T.orange}44`}}>+</div>
        <div style={{fontSize:11,color:T.textDim,marginTop:6}}>Gol Ekle</div>
      </div>
    </div>

    {toast&&<div style={{background:T.card,border:`1.5px solid ${T.accent}44`,borderRadius:12,padding:"12px 16px",marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <span style={{fontSize:14,color:T.text}}>Gol eklendi</span>
      <span onClick={()=>undoGoal(toast)} style={{fontSize:13,color:T.accent,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>{I.undo(T.accent)} Geri Al</span>
    </div>}

    {goals.length>0&&<div style={{background:T.card,borderRadius:12,border:`1px solid ${T.cardBorder}`,padding:"12px 16px",marginBottom:20}}>
      <div style={{fontSize:12,fontWeight:700,color:T.textMuted,marginBottom:8}}>GOL ZAMANÇİZELGESİ</div>
      {goals.map(g=><GoalRow key={g.id} g={g} showEdit/>)}
    </div>}

    <div style={{background:`${T.accent}10`,borderRadius:12,padding:"14px 16px",marginBottom:24,border:`1px solid ${T.accent}22`}}>
      <div style={{fontSize:13,color:T.accent,fontWeight:600,marginBottom:4}}>Maç kaydedildiğinde:</div>
      <div style={{fontSize:13,color:T.textDim,lineHeight:1.6}}>Tüm katılımcılar için kişisel post oluşturulur. Fotoğraf ve not eklemek post üzerinden yapılır.</div>
    </div>

    <Btn primary full onClick={()=>{if(onEndMatch)onEndMatch();window.location.assign("/03_matches?view=S08&tab=mine");}} st={{fontSize:15,fontWeight:700,padding:"14px 24px",borderRadius:12}}>Kaydet & Paylaş</Btn>
    <div onClick={()=>setDeletePopup(true)} style={{textAlign:"center",marginTop:16,fontSize:14,color:T.red,cursor:"pointer",fontWeight:600}}>Maçı Sil</div>

    <GoalDrawerUI/>
    <DeletePopupUI/>
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
  return <div style={{position:"fixed",bottom:0,left:0,right:0,top:0,maxWidth:430,margin:"0 auto",zIndex:150,display:"flex",alignItems:"flex-end"}}>
    <div onClick={()=>onNav("S08")} style={{position:"absolute",inset:0,background:"rgba(0,0,0,.35)"}}/>
    <div style={{position:"relative",width:"100%",background:T.card,borderRadius:"20px 20px 0 0",padding:"20px 20px 32px",marginBottom:56,zIndex:151}}>
      <div style={{width:40,height:4,borderRadius:2,background:T.cardBorder,margin:"0 auto 16px"}}/>
      <div style={{fontSize:18,fontWeight:800,color:T.text,marginBottom:4,fontFamily:FH}}>Deneyim Seviyeni Seç</div>
      <div style={{fontSize:13,color:T.textDim,marginBottom:20}}>Maç sahibi seviyeni görerek karar verecek</div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {levels.map(l=><div key={l.id} onClick={()=>setSel(l.id)} style={{padding:"14px 16px",borderRadius:12,background:sel===l.id?`${l.c}10`:T.bg,border:`1.5px solid ${sel===l.id?l.c:T.cardBorder}`,cursor:"pointer",display:"flex",alignItems:"center",gap:12,transition:"all .2s"}}>
          <span style={{fontSize:22}}>{l.icon}</span>
          <div><div style={{fontWeight:700,fontSize:14,color:sel===l.id?l.c:T.text}}>{l.label}</div><div style={{fontSize:12,color:T.textDim}}>{l.desc}</div></div>
        </div>)}
      </div>
      <Btn primary full disabled={!sel} onClick={()=>window.location.assign("/04_match_detail?view=S12")} st={{marginTop:16}}>Katıl</Btn>
    </div>
  </div>;
}

// S31: Maç Oluştur (Tek Sayfa + Drawer)
const LOC_RESULTS=[
  {id:"l1",name:"Kadıköy Spor Tesisleri",addr:"Caferağa Mah. Moda Cad. No:12, Kadıköy",lat:40.9867,lng:29.0287},
  {id:"l2",name:"Kadıköy Arena Halısaha",addr:"Rasimpaşa Mah. Rıhtım Cad. No:44, Kadıköy",lat:40.9901,lng:29.0234},
  {id:"l3",name:"Kadıköy Sahil Halısaha",addr:"Osmanağa Mah. Bahariye Cad. No:78, Kadıköy",lat:40.9845,lng:29.0312},
  {id:"l4",name:"Beşiktaş Halısaha",addr:"Sinanpaşa Mah. Beşiktaş Cad. No:5, Beşiktaş",lat:41.0422,lng:29.0046},
  {id:"l5",name:"Ataşehir Arena",addr:"Küçükbakkalköy Mah. Kayışdağı Cad. No:22, Ataşehir",lat:40.9923,lng:29.1145},
];
const QUOTA_OPTIONS=[2,4,6,8,10,12,14,16,18,20,22,"∞"];
const TR_DAYS=["Pazar","Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi"];
const TR_MONTHS_SHORT=["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"];

function S31({onNav}){
  // Form state
  const [dateVal,setDateVal]=useState(null);
  const [timeVal,setTimeVal]=useState(null);
  const [selectedLoc,setSelectedLoc]=useState(null);
  const [locQuery,setLocQuery]=useState("");
  const [quota,setQuota]=useState(10);
  const [matchName,setMatchName]=useState("");
  const [titleEdited,setTitleEdited]=useState(false);
  const [description,setDescription]=useState("");
  const [accept,setAccept]=useState("open");
  const [privacy,setPrivacy]=useState("public");

  // UI state
  const [drawer,setDrawer]=useState(null);
  const [showAdvanced,setShowAdvanced]=useState(false);
  const [attempted,setAttempted]=useState(false);

  // Drawer temp state
  const [tmpDate,setTmpDate]=useState("");
  const [tmpTime,setTmpTime]=useState("");
  const [tmpTitle,setTmpTitle]=useState("");
  const [tmpDesc,setTmpDesc]=useState("");

  // Auto title
  const locShort=selectedLoc?selectedLoc.name.split(" ").slice(0,2).join(" "):"";
  const autoTitle=(()=>{
    if(!dateVal||!timeVal)return locShort?`${locShort} Halısaha Maçı`:"Halısaha Maçı";
    const d=new Date(dateVal+"T"+timeVal);const day=TR_DAYS[d.getDay()];
    return `${day} ${timeVal}${locShort?" "+locShort:""} Halısaha Maçı`;
  })();
  const displayTitle=titleEdited&&matchName?matchName:autoTitle;

  // Location
  const locFiltered=locQuery.length>=2?LOC_RESULTS.filter(l=>l.name.toLowerCase().includes(locQuery.toLowerCase())||l.addr.toLowerCase().includes(locQuery.toLowerCase())):[];
  const locDisplay=selectedLoc?selectedLoc.name:null;

  // Date/time display
  const dateDisplay=dateVal?(()=>{const d=new Date(dateVal+"T00:00");return `${d.getDate()} ${TR_MONTHS_SHORT[d.getMonth()]}, ${TR_DAYS[d.getDay()]}`;})():null;
  const timeDisplay=timeVal||null;

  // Validation
  const locValid=!!selectedLoc;
  const dateValid=!!dateVal;
  const timeValid=!!timeVal;
  const locError=attempted&&!locValid;
  const dateError=attempted&&!dateValid;
  const timeError=attempted&&!timeValid;

  // Publish
  const handlePublish=()=>{
    setAttempted(true);
    if(!locValid||!dateValid||!timeValid)return;
    window.location.assign("/04_match_detail?view=S12");
  };

  // Validation message
  const errFields=[];
  if(attempted&&!locValid)errFields.push("konum");
  if(attempted&&!dateValid)errFields.push("tarih");
  if(attempted&&!timeValid)errFields.push("saat");
  const errMsg=errFields.length>0?`${errFields.join(", ")} seçin`.replace(/^./,c=>c.toUpperCase()):null;

  // Sub-components
  const FieldRow=({icon,label,value,placeholder,onClick,error})=><div onClick={onClick} style={{display:"flex",alignItems:"center",height:56,cursor:"pointer",borderBottom:`1px solid ${error?T.red+"66":T.cardBorder+"33"}`}}>
    <span style={{marginRight:12,fontSize:16,display:"flex",flexShrink:0}}>{icon}</span>
    <span style={{fontSize:14,fontWeight:600,color:T.text,whiteSpace:"nowrap"}}>{label}</span>
    <span style={{marginLeft:"auto",fontSize:13,fontWeight:500,color:value?T.accent:T.textMuted,maxWidth:"50%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",textAlign:"right"}}>{value||placeholder}</span>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.textDim} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft:8,flexShrink:0}}><polyline points="9,6 15,12 9,18"/></svg>
  </div>;

  const DrawerWrap=({children})=><div style={{position:"fixed",inset:0,zIndex:300,display:"flex",alignItems:"flex-end",maxWidth:430,margin:"0 auto"}}>
    <div onClick={()=>setDrawer(null)} style={{position:"absolute",inset:0,background:"rgba(0,0,0,.35)"}}/>
    <div style={{position:"relative",width:"100%",background:T.card,borderRadius:"20px 20px 0 0",padding:"20px 20px 32px",zIndex:301,maxHeight:"80vh",overflowY:"auto"}}>
      <div style={{width:40,height:4,borderRadius:2,background:T.cardBorder,margin:"0 auto 20px"}}/>
      {children}
    </div>
  </div>;

  return <div style={{padding:"24px 20px",paddingBottom:100,minHeight:"100vh",display:"flex",flexDirection:"column",position:"relative"}}>

    {/* Back */}
    <div onClick={()=>onNav("S08")} style={{display:"inline-flex",alignItems:"center",gap:4,cursor:"pointer",marginTop:16,marginBottom:20,padding:"4px 0",alignSelf:"flex-start"}}>
      {I.arrowLeft(T.textDim)}
    </div>

    {/* Title */}
    <div style={{fontSize:24,fontWeight:800,color:T.text,letterSpacing:"-0.5px",fontFamily:FH,marginBottom:24}}>Maç Oluştur</div>

    {/* Field rows — ordered: Konum, Tarih, Saat, Kontenjan, Başlık */}
    <FieldRow icon="📍" label="Konum" value={locDisplay} placeholder="Seçilmedi" onClick={()=>setDrawer("location")} error={locError}/>
    <FieldRow icon="📅" label="Tarih" value={dateDisplay} placeholder="Seçilmedi" onClick={()=>{setTmpDate(dateVal||"");setDrawer("date");}} error={dateError}/>
    <FieldRow icon="🕐" label="Saat" value={timeDisplay} placeholder="Seçilmedi" onClick={()=>{setTmpTime(timeVal||"");setDrawer("time");}} error={timeError}/>
    <FieldRow icon="👥" label="Kontenjan" value={quota==="∞"?"Limitsiz":`${quota} kişi`} onClick={()=>setDrawer("quota")}/>
    <FieldRow icon="✏️" label="Maç Başlığı" value={displayTitle} onClick={()=>{setTmpTitle(displayTitle);setDrawer("title");}}/>

    {/* Validation errors */}
    {errMsg&&<div style={{fontSize:11,color:T.red,fontWeight:600,marginTop:8,paddingLeft:4}}>{errMsg}</div>}

    {/* Gelişmiş Ayarlar */}
    <div onClick={()=>setShowAdvanced(!showAdvanced)} style={{display:"flex",alignItems:"center",height:56,cursor:"pointer",borderTop:`1px solid ${T.cardBorder}33`,marginTop:8}}>
      <span style={{marginRight:12,fontSize:16,display:"flex",flexShrink:0}}>⚙️</span>
      <span style={{fontSize:14,fontWeight:600,color:T.textDim}}>Gelişmiş Ayarlar</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.textDim} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft:"auto",transition:"transform .2s",transform:showAdvanced?"rotate(90deg)":"rotate(0deg)"}}><polyline points="9,6 15,12 9,18"/></svg>
    </div>
    {showAdvanced&&<>
      <FieldRow icon="📝" label="Açıklama" value={description||null} placeholder="Opsiyonel" onClick={()=>{setTmpDesc(description);setDrawer("desc");}}/>
      <FieldRow icon="🔓" label="Kabul Modu" value={accept==="open"?"Herkesi Kabul Et":"Onay ile Kabul Et"} onClick={()=>setDrawer("accept")}/>
      <FieldRow icon="👁️" label="Gizlilik" value={privacy==="public"?"Herkese Açık":"Sadece Davet"} onClick={()=>setDrawer("privacy")}/>
    </>}

    {/* Spacer */}
    <div style={{flex:1}}/>

    {/* Yayınla CTA */}
    <Btn primary full onClick={handlePublish} st={{fontSize:15,fontWeight:700,padding:"14px 24px",borderRadius:12,marginTop:32}}>Yayınla</Btn>

    {/* ===== DRAWERS ===== */}

    {/* Tarih Drawer */}
    {drawer==="date"&&<DrawerWrap>
      <div style={{fontSize:16,fontWeight:700,color:T.text,marginBottom:16}}>Tarih Seç</div>
      <div style={{background:T.bg,borderRadius:12,border:`1.5px solid ${T.accent}`,padding:"14px 16px",marginBottom:20}}>
        <input type="date" value={tmpDate} onChange={e=>setTmpDate(e.target.value)} style={{background:"none",border:"none",color:T.text,fontSize:16,width:"100%",outline:"none",fontWeight:600,fontFamily:"inherit"}}/>
      </div>
      <Btn primary full disabled={!tmpDate} onClick={()=>{if(tmpDate){setDateVal(tmpDate);setDrawer(null);}}} st={{borderRadius:12}}>Tamam</Btn>
    </DrawerWrap>}

    {/* Saat Drawer */}
    {drawer==="time"&&<DrawerWrap>
      <div style={{fontSize:16,fontWeight:700,color:T.text,marginBottom:16}}>Saat Seç</div>
      <div style={{background:T.bg,borderRadius:12,border:`1.5px solid ${T.accent}`,padding:"14px 16px",marginBottom:20}}>
        <input type="time" value={tmpTime} onChange={e=>setTmpTime(e.target.value)} style={{background:"none",border:"none",color:T.text,fontSize:16,width:"100%",outline:"none",fontWeight:600,fontFamily:"inherit"}}/>
      </div>
      <Btn primary full disabled={!tmpTime} onClick={()=>{if(tmpTime){setTimeVal(tmpTime);setDrawer(null);}}} st={{borderRadius:12}}>Tamam</Btn>
    </DrawerWrap>}

    {/* Konum Drawer */}
    {drawer==="location"&&<DrawerWrap>
      <div style={{fontSize:16,fontWeight:700,color:T.text,marginBottom:16}}>Konum Seç</div>
      <div style={{background:T.bg,borderRadius:12,border:`1.5px solid ${locQuery.length>=2?T.accent:T.cardBorder}`,padding:"12px 16px",display:"flex",alignItems:"center",gap:12,transition:"border-color .2s"}}>
        {I.search(locQuery.length>=2?T.accent:T.textDim)}
        <input value={locQuery} onChange={e=>setLocQuery(e.target.value)} placeholder="Saha adı veya adres ara..." style={{background:"none",border:"none",color:T.text,fontSize:14,width:"100%",outline:"none",fontWeight:500}}/>
        {locQuery.length>0&&<span onClick={()=>setLocQuery("")} style={{cursor:"pointer",display:"flex",flexShrink:0}}>{I.x(T.textDim)}</span>}
      </div>
      {locFiltered.length>0&&<div style={{background:T.bg,border:`1px solid ${T.cardBorder}`,borderTop:"none",borderRadius:"0 0 12px 12px",overflow:"hidden"}}>
        {locFiltered.map((loc,i)=><div key={loc.id} onClick={()=>{setSelectedLoc({...loc,type:"place"});setLocQuery("");setDrawer(null);}} style={{padding:"12px 16px",cursor:"pointer",display:"flex",alignItems:"flex-start",gap:12,borderTop:i>0?`1px solid ${T.cardBorder}`:"none",transition:"background .15s"}} onMouseEnter={e=>e.currentTarget.style.background=`${T.accent}08`} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
          <span style={{display:"flex",marginTop:2,flexShrink:0}}>{I.pin(T.accent)}</span>
          <div><div style={{fontSize:14,fontWeight:600,color:T.text}}>{loc.name}</div><div style={{fontSize:12,color:T.textDim,marginTop:2}}>{loc.addr}</div></div>
        </div>)}
      </div>}
      {locQuery.length>=2&&locFiltered.length===0&&<div style={{padding:"12px 0",textAlign:"center",fontSize:13,color:T.textMuted}}>Sonuç bulunamadı</div>}
      {locQuery.length<2&&<div style={{padding:"20px 0 4px",textAlign:"center",fontSize:13,color:T.textMuted}}>Saha veya adres aramaya başlayın</div>}
    </DrawerWrap>}

    {/* Kontenjan Drawer */}
    {drawer==="quota"&&<DrawerWrap>
      <div style={{fontSize:16,fontWeight:700,color:T.text,marginBottom:16}}>Kontenjan</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
        {QUOTA_OPTIONS.map(n=>{const val=n==="∞"?"∞":n;const sel=quota===val;return <div key={n} onClick={()=>{setQuota(val);setDrawer(null);}} style={{padding:"14px 0",borderRadius:12,textAlign:"center",cursor:"pointer",fontSize:15,fontWeight:sel?700:600,background:sel?`${T.accent}15`:T.bg,color:sel?T.accent:T.textDim,border:`1.5px solid ${sel?T.accent:T.cardBorder}`,transition:"all .15s"}}>{n==="∞"?"∞":n}</div>;})}
      </div>
    </DrawerWrap>}

    {/* Maç Başlığı Drawer */}
    {drawer==="title"&&<DrawerWrap>
      <div style={{fontSize:16,fontWeight:700,color:T.text,marginBottom:16}}>Maç Başlığı</div>
      <div style={{background:T.bg,borderRadius:12,border:`1.5px solid ${T.cardBorder}`,padding:"12px 16px",marginBottom:16}}>
        <input value={tmpTitle} onChange={e=>setTmpTitle(e.target.value)} placeholder={autoTitle} style={{background:"none",border:"none",color:T.text,fontSize:14,width:"100%",outline:"none",fontWeight:500}}/>
      </div>
      <Btn primary full onClick={()=>{if(tmpTitle.trim()&&tmpTitle.trim()!==autoTitle){setMatchName(tmpTitle.trim());setTitleEdited(true);}else{setMatchName("");setTitleEdited(false);}setDrawer(null);}} st={{borderRadius:12}}>Tamam</Btn>
    </DrawerWrap>}

    {/* Açıklama Drawer */}
    {drawer==="desc"&&<DrawerWrap>
      <div style={{fontSize:16,fontWeight:700,color:T.text,marginBottom:16}}>Açıklama</div>
      <div style={{background:T.bg,borderRadius:12,border:`1.5px solid ${T.cardBorder}`,padding:"12px 16px",marginBottom:16,minHeight:100}}>
        <textarea value={tmpDesc} onChange={e=>setTmpDesc(e.target.value)} placeholder="Maç hakkında detay yazın..." rows={4} style={{background:"none",border:"none",color:T.text,fontSize:14,width:"100%",outline:"none",fontWeight:500,resize:"none",fontFamily:"inherit"}}/>
      </div>
      <Btn primary full onClick={()=>{setDescription(tmpDesc);setDrawer(null);}} st={{borderRadius:12}}>Tamam</Btn>
    </DrawerWrap>}

    {/* Kabul Modu Drawer */}
    {drawer==="accept"&&<DrawerWrap>
      <div style={{fontSize:16,fontWeight:700,color:T.text,marginBottom:16}}>Kabul Modu</div>
      {[{id:"open",l:"Herkesi Kabul Et",d:"İlk gelen alır"},{id:"approval",l:"Onay ile Kabul Et",d:"Başvuruları sen onaylarsın"}].map(a=><div key={a.id} onClick={()=>{setAccept(a.id);setDrawer(null);}} style={{padding:"14px 16px",borderRadius:12,marginBottom:8,cursor:"pointer",background:accept===a.id?`${T.accent}12`:T.bg,border:`1.5px solid ${accept===a.id?T.accent:T.cardBorder}`,transition:"all .15s"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:20,height:20,borderRadius:"50%",border:`2px solid ${accept===a.id?T.accent:T.cardBorder}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{accept===a.id&&<div style={{width:10,height:10,borderRadius:"50%",background:T.accent}}/>}</div>
          <div><div style={{fontSize:14,fontWeight:600,color:accept===a.id?T.accent:T.text}}>{a.l}</div><div style={{fontSize:12,color:T.textDim,marginTop:2}}>{a.d}</div></div>
        </div>
      </div>)}
    </DrawerWrap>}

    {/* Gizlilik Drawer */}
    {drawer==="privacy"&&<DrawerWrap>
      <div style={{fontSize:16,fontWeight:700,color:T.text,marginBottom:16}}>Gizlilik</div>
      {[{id:"public",l:"Herkese Açık",d:"Maçlar sekmesinde görünür"},{id:"invite",l:"Sadece Davet",d:"Link paylaşarak katılım"}].map(p=><div key={p.id} onClick={()=>{setPrivacy(p.id);setDrawer(null);}} style={{padding:"14px 16px",borderRadius:12,marginBottom:8,cursor:"pointer",background:privacy===p.id?`${T.accent}12`:T.bg,border:`1.5px solid ${privacy===p.id?T.accent:T.cardBorder}`,transition:"all .15s"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:20,height:20,borderRadius:"50%",border:`2px solid ${privacy===p.id?T.accent:T.cardBorder}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{privacy===p.id&&<div style={{width:10,height:10,borderRadius:"50%",background:T.accent}}/>}</div>
          <div><div style={{fontSize:14,fontWeight:600,color:privacy===p.id?T.accent:T.text}}>{p.l}</div><div style={{fontSize:12,color:T.textDim,marginTop:2}}>{p.d}</div></div>
        </div>
      </div>)}
    </DrawerWrap>}

  </div>;
}

// ============================================================
// Active Match Widget (footer üstü — S05, S08, S15'te görünür)
// ============================================================
function ActiveMatchWidget({seconds,score,onResume,onDelete}){
  const [deletePopup,setDeletePopup]=useState(false);
  const [paused,setPaused]=useState(false);
  const [localSec,setLocalSec]=useState(seconds);
  const timerRef=useRef(null);
  const fmtTime=s=>{const m=Math.floor(s/60);const sec=s%60;return `${m}:${sec<10?"0":""}${sec}`;};

  useEffect(()=>{
    if(!paused){timerRef.current=setInterval(()=>setLocalSec(s=>s+1),1000);}
    else{clearInterval(timerRef.current);}
    return()=>clearInterval(timerRef.current);
  },[paused]);

  return <>
    <div style={{position:"fixed",bottom:56,left:0,right:0,maxWidth:430,margin:"0 auto",zIndex:95,padding:"8px 12px"}}>
      <div style={{background:T.accent,borderRadius:14,padding:"14px 16px",display:"flex",alignItems:"center",gap:12}}>
        <div onClick={()=>setPaused(!paused)} style={{display:"flex",alignItems:"center",justifyContent:"center",width:32,height:32,borderRadius:8,background:"rgba(255,255,255,0.15)",cursor:"pointer",flexShrink:0}}>
          {paused?I.play("#fff"):I.pause("#fff")}
        </div>
        <div onClick={()=>onResume(localSec,!paused)} style={{display:"flex",alignItems:"center",gap:8,flex:1,cursor:"pointer"}}>
          <span style={{fontSize:14,fontWeight:700,color:"#fff"}}>{paused?"Maç Durduruldu":"Maç Oynanıyor"}</span>
          <span style={{fontSize:13,color:"#ffffffaa",fontWeight:600}}>{fmtTime(localSec)}</span>
        </div>
        <span onClick={()=>onResume(localSec,!paused)} style={{fontSize:16,fontWeight:900,color:"#fff",cursor:"pointer"}}>{score[0]} – {score[1]}</span>
        <div onClick={e=>{e.stopPropagation();setDeletePopup(true);}} style={{display:"flex",alignItems:"center",justifyContent:"center",width:32,height:32,borderRadius:8,background:"rgba(255,255,255,0.15)",cursor:"pointer",flexShrink:0}}>{I.trash(T.red)}</div>
      </div>
    </div>
    {deletePopup&&<div style={{position:"fixed",inset:0,maxWidth:430,margin:"0 auto",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div onClick={()=>setDeletePopup(false)} style={{position:"absolute",inset:0,background:"rgba(0,0,0,.35)"}}/>
      <div style={{position:"relative",width:"85%",background:T.card,borderRadius:16,padding:"28px 24px",textAlign:"center",zIndex:301}}>
        <div style={{fontSize:16,fontWeight:700,color:T.text,marginBottom:20,fontFamily:FH}}>Bu maçı silmek istediğinize emin misiniz?</div>
        <Btn danger full onClick={()=>{setDeletePopup(false);onDelete();}} st={{fontSize:15,fontWeight:700,padding:"14px 24px",borderRadius:12,marginBottom:10}}>Maçı Sil</Btn>
        <Btn full onClick={()=>setDeletePopup(false)} st={{fontSize:15,fontWeight:600,padding:"14px 24px",borderRadius:12}}>İptal</Btn>
      </div>
    </div>}
  </>;
}

// ============================================================
// MAIN
// ============================================================
export default function SporWaveMatches(){
  const [cur,setCur]=useState("S08");
  const [curId,setCurId]=useState(null);
  const [fade,setFade]=useState(true);
  const [showUnrated,setShowUnrated]=useState(false);
  // Active match minimize state
  const [activeMatch,setActiveMatch]=useState({active:false,minimized:false,seconds:0,score:[0,0]});

  useEffect(()=>{if(!document.querySelector('link[href*="Plus+Jakarta+Sans"]')){const l=document.createElement("link");l.href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap";l.rel="stylesheet";document.head.appendChild(l);}},[]);
  useEffect(()=>{
    const view=new URLSearchParams(window.location.search).get("view");
    const allowed=["S08","S10","S14","S31"];
    if(view&&allowed.includes(view))setCur(view);
  },[]);

  const nav=(p,id)=>{setFade(false);setTimeout(()=>{setCur(p);setCurId(id||null);setFade(true);},120);};

  const handleMinimize=(secs,sc)=>{
    setActiveMatch({active:true,minimized:true,seconds:secs,score:sc});
    nav("S08");
  };
  const handleResume=(secs,running)=>{
    setActiveMatch(prev=>({...prev,minimized:false,seconds:secs??prev.seconds,running:running??true}));
    nav("S10");
  };
  const handleDeleteMatch=()=>{
    setActiveMatch({active:false,minimized:false,seconds:0,score:[0,0]});
  };

  const isMatchesView=["S08","S14"].includes(cur);
  const showWidget=activeMatch.active&&activeMatch.minimized&&isMatchesView;

  const pg=()=>{
    switch(cur){
      case "S08":case "S14":return <S08 onNav={nav} showUnrated={showUnrated} hasActiveWidget={showWidget}/>;
      case "S10":return <S10 onNav={nav} onMinimize={handleMinimize} onEndMatch={handleDeleteMatch} initialSeconds={activeMatch.seconds} initialRunning={activeMatch.running}/>;
      case "S31":return <S31 onNav={nav}/>;
      default:return <S08 onNav={nav} showUnrated={showUnrated}/>;
    }
  };

  return <div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",background:T.bg,color:T.text,fontFamily:FB,position:"relative",boxShadow:"0 0 40px rgba(0,0,0,.08)"}}>
    <div style={{position:"sticky",top:0,zIndex:200,background:T.bgAlt,borderBottom:`1px solid ${T.cardBorder}`,padding:"6px 8px",display:"flex",gap:4,flexWrap:"wrap",alignItems:"center"}}>
      {[{p:"S08",l:"Maçlar"},{p:"S10",l:"Canlı Skor"},{p:"S14",l:"Seviye"},{p:"S31",l:"Oluştur"}].map(n=><span key={n.p} onClick={()=>nav(n.p)} style={{padding:"4px 10px",borderRadius:6,fontSize:11,fontWeight:600,background:cur===n.p?T.accent:`${T.textDim}22`,color:cur===n.p?"#fff":T.textDim,cursor:"pointer"}}>{n.l}</span>)}
      <span style={{marginLeft:"auto",width:1,height:16,background:T.cardBorder,flexShrink:0}}/>
      <span onClick={()=>setShowUnrated(v=>!v)} style={{padding:"4px 10px",borderRadius:6,fontSize:11,fontWeight:600,border:`1.5px solid ${showUnrated?T.orange:"transparent"}`,background:showUnrated?`${T.orange}15`:`${T.textDim}22`,color:showUnrated?T.orange:T.textDim,cursor:"pointer"}}>⭐ Değerlendirme Maçı: {showUnrated?"ON":"OFF"}</span>
      <span onClick={()=>setActiveMatch(prev=>({...prev,active:!prev.active,minimized:!prev.active}))} style={{padding:"4px 10px",borderRadius:6,fontSize:11,fontWeight:600,border:`1.5px solid ${activeMatch.active?T.accent:"transparent"}`,background:activeMatch.active?`${T.accent}15`:`${T.textDim}22`,color:activeMatch.active?T.accent:T.textDim,cursor:"pointer"}}>▶ Aktif Maç: {activeMatch.active?"ON":"OFF"}</span>
    </div>
    <div style={{opacity:fade?1:0,transform:fade?"none":"translateY(6px)",transition:"all .12s ease"}}>{pg()}</div>
    {/* Fixed elements OUTSIDE transform div */}
    {isMatchesView&&!activeMatch.active&&<div style={{position:"fixed",bottom:72,left:0,right:0,maxWidth:430,margin:"0 auto",pointerEvents:"none",zIndex:90,display:"flex",justifyContent:"flex-end",paddingRight:24}}>
      <div onClick={()=>nav("S31")} style={{width:56,height:56,borderRadius:16,background:T.accent,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:`0 4px 24px ${T.accent}44`,pointerEvents:"auto"}}>{I.plus("#fff")}</div>
    </div>}
    {showWidget&&<ActiveMatchWidget seconds={activeMatch.seconds} score={activeMatch.score} onResume={handleResume} onDelete={handleDeleteMatch}/>}
    {cur==="S14"&&<S14 onNav={nav}/>}
    {isMatchesView&&<TabBar active="S08" onNav={nav}/>}
  </div>;
}
