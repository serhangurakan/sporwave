import { useState, useEffect } from "react";
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
  {id:104,title:"Kadıköy Gece Maçı",desc:"Her seviyeden oyuncu bekliyoruz, keyifli bir maç olacak. Sahada buluşalım!",date:"8 Mar",time:"21:30",loc:{name:"Kadıköy Arena",addr:"Rasimpaşa Mah. Rıhtım Cad. No:44, Kadıköy",lat:40.9901,lng:29.0234,type:"place"},fmt:"6v6",host:1,joined:10,max:12,level:"İyi",mode:"open",vis:"followers",myMatch:true,friendsInMatch:[],distance:0.8},
  {id:101,title:"Cumartesi Akşam Maçı",desc:"Rekabetçi bir maç planlıyoruz, kaleci var. Seviye fark etmez herkes gelsin.",date:"1 Mar",time:"20:00",loc:{name:"Kadıköy Spor Tesisleri",addr:"Caferağa Mah. Moda Cad. No:12, Kadıköy",lat:40.9867,lng:29.0287,type:"place"},fmt:"6v6",host:2,joined:7,max:12,level:"Herkes",mode:"open",vis:"public",myMatch:false,friendsInMatch:["Emre"],distance:1.2},
  {id:103,title:"Ataşehir Turnuva",desc:"Ataşehir'de düzenlenen hafta sonu turnuvası, kayıt ücretsiz.",date:"5 Mar",time:"19:00",loc:{city:"İstanbul",district:"Ataşehir",type:"area"},fmt:"7v7",host:3,joined:4,max:14,level:"Herkes",mode:"open",vis:"public",myMatch:false,friendsInMatch:["Ali","Emre"],distance:8.4},
  {id:102,title:"Pazar Sabah Maçı",desc:"Sabah erken maçı, uyanabilen gelsin. Maç sonrası kahvaltı yapıyoruz.",date:"2 Mar",time:"10:00",loc:{name:"Beşiktaş Halısaha",addr:"Sinanpaşa Mah. Beşiktaş Cad. No:5, Beşiktaş",lat:41.0422,lng:29.0046,type:"place"},fmt:"5v5",host:6,joined:9,max:10,level:"Orta+",mode:"approval",vis:"public",myMatch:false,friendsInMatch:[],distance:5.7},
];

// Icons
const I={
  filter:c=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/></svg>,
  plus:c=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c||T.onAccent} strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
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
function Btn({children,primary,danger,small,full,ghost,onClick,disabled,st}){const[h,setH]=useState(false);return <button disabled={disabled} onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{padding:small?"7px 14px":"12px 20px",borderRadius:10,border:primary||danger?"none":`1.5px solid ${ghost?"transparent":T.cardBorder}`,background:disabled?`${T.textDim}22`:danger?T.red:primary?T.accent:"transparent",color:disabled?T.textDim:danger?T.white:primary?T.onAccent:T.text,fontSize:small?12:14,fontWeight:600,cursor:disabled?"not-allowed":"pointer",width:full?"100%":"auto",transition:"all .2s",transform:h&&!disabled?"translateY(-1px)":"none",display:"flex",alignItems:"center",justifyContent:"center",gap:6,...st}}>{children}</button>;}
function Badge({children,c=T.accent,st}){return <span style={{display:"inline-flex",alignItems:"center",gap:3,padding:"2px 8px",borderRadius:20,fontSize:11,fontWeight:600,color:T.white,background:c,whiteSpace:"nowrap",...st}}>{children}</span>;}
function SectionLabel({children,mt=16}){return <div style={{margin:`${mt}px 16px 8px`,fontSize:14,fontWeight:600,color:"#6B7280",letterSpacing:"0.02em"}}>{children}</div>;}

function TabBar({active,onNav}){const tabs=[{id:"S05",ic:I.home,l:"Ana Sayfa"},{id:"S08",ic:I.football,l:"Maçlar"},{id:"S15",ic:I.user,l:"Profil"}];const handleTabClick=(tabId)=>{if(tabId==="S05"){window.location.assign("/02_feed");return;}if(tabId==="S15"){window.location.assign("/05_profile");return;}onNav(tabId);};return <div style={{position:"fixed",bottom:0,left:0,right:0,height:56,background:T.bgAlt,borderTop:`1px solid ${T.cardBorder}`,display:"flex",justifyContent:"space-around",alignItems:"center",zIndex:100,maxWidth:430,margin:"0 auto"}}>{tabs.map(t=><div key={t.id} onClick={()=>handleTabClick(t.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:"pointer",padding:"8px 20px"}}><span style={{display:"flex"}}>{t.ic(active===t.id?T.accent:T.textMuted)}</span><span style={{fontSize:10,fontWeight:active===t.id?700:500,color:active===t.id?T.accent:T.textMuted}}>{t.l}</span></div>)}</div>;}

function CapacityBar({joined,max}){const pct=joined/max*100;return <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{flex:1,height:4,borderRadius:2,background:`${T.textDim}18`}}><div style={{height:4,borderRadius:2,background:T.accent,width:`${pct}%`,transition:"width .3s"}}/></div><span style={{fontSize:11,color:T.textMuted,fontWeight:500,whiteSpace:"nowrap"}}>{joined}/{max}</span></div>;}

// Dummy halısaha data (Google Places API mock)
const VENUES=[
  {id:1,name:"Kadıköy Arena Halısaha",address:"Caferağa Mah. Moda Cad. No:12, Kadıköy",rating:4.8,reviews:124,open:true,price:"350₺/saat",img:null,tags:["Işıklı","Kapalı","Otopark"]},
  {id:2,name:"Beşiktaş Sahil Futbol Sahası",address:"Barbaros Bulvarı Yanı, Beşiktaş",rating:4.5,reviews:87,open:true,price:"300₺/saat",img:null,tags:["Açık","Deniz Manzarası"]},
  {id:3,name:"Ataşehir Premium Halısaha",address:"Küçükbakkalköy Mah. Bostancı Yolu, Ataşehir",rating:4.9,reviews:210,open:false,price:"400₺/saat",img:null,tags:["Işıklı","Kapalı","Duş","Kafeterya"]},
];

function S08({hasActiveWidget}){
  const [pageMode,setPageMode]=useState("matches"); // "matches" | "venues"
  const [dropOpen,setDropOpen]=useState(false);
  const [flash,setFlash]=useState(false);
  const [filter,setFilter]=useState(false);
  const cities=["İstanbul","Ankara","İzmir","Bursa","Antalya","Adana"];
  const [city,setCity]=useState("İstanbul"); // default: kullanıcının profil şehri
  const [cityOpen,setCityOpen]=useState(false);
  const districts=["Tümü","Kadıköy","Beşiktaş","Üsküdar","Ataşehir","Maltepe","Bakırköy","Şişli","Beylikdüzü","Kartal","Pendik","Sarıyer","Fatih","Bağcılar","Küçükçekmece"];
  const [district,setDistrict]=useState("Tümü");
  const [districtOpen,setDistrictOpen]=useState(false);
  const [dateFilter,setDateFilter]=useState(null);

  const upcomingMatch=PLANNED.find(m=>m.myMatch)||null;
  const openMatches=[...PLANNED.filter(m=>!m.myMatch)].sort((a,b)=>{
    if(a.distance!=null&&b.distance!=null) return a.distance-b.distance;
    return 0; // fallback: data order (already date-sorted)
  });

  return <div style={{paddingBottom:hasActiveWidget?156:80}}>
    {/* Header — sticky */}
    <div style={{position:"sticky",top:32,zIndex:50,background:`${T.bg}ee`,backdropFilter:"blur(12px)"}}>
      <div style={{padding:"8px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        {/* Mode dropdown — feed TopNav stili */}
        <div style={{position:"relative"}}>
          <div onClick={()=>{setFlash(true);setTimeout(()=>setFlash(false),180);setDropOpen(!dropOpen);setCityOpen(false);}} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:8,padding:"8px 0",opacity:flash?0.4:1,transition:"opacity .1s"}}>
            <span style={{fontSize:20,fontWeight:800,color:T.text,fontFamily:FH}}>{pageMode==="matches"?"Maçlar":"Halısahalar"}</span>
            <span style={{display:"flex",transform:dropOpen?"rotate(180deg)":"none",transition:"transform .2s"}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.textDim} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6,9 12,15 18,9"/></svg></span>
          </div>
          {dropOpen&&<div style={{position:"absolute",top:44,left:0,background:T.card,border:`1px solid ${T.cardBorder}`,borderRadius:12,padding:8,zIndex:60,boxShadow:T.shadowSm,minWidth:180}}>
            {[{id:"matches",ic:c=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15 15 0 014 10 15 15 0 01-4 10 15 15 0 01-4-10 15 15 0 014-10z"/><path d="M2 12h20"/></svg>,l:"Maçlar"},{id:"venues",ic:c=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>,l:"Halısahalar"}].map(o=><div key={o.id} onClick={()=>{setPageMode(o.id);setDropOpen(false);}} style={{padding:"12px 16px",borderRadius:8,cursor:"pointer",display:"flex",alignItems:"center",gap:12,background:"transparent"}}>
              <span style={{display:"flex"}}>{o.ic(pageMode===o.id?T.accent:T.textDim)}</span>
              <span style={{fontSize:14,fontWeight:pageMode===o.id?700:500,color:pageMode===o.id?T.accent:T.text,flex:1}}>{o.l}</span>
              {pageMode===o.id&&<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20,6 9,17 4,12"/></svg>}
            </div>)}
          </div>}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,visibility:pageMode==="matches"?"visible":"hidden"}}>
          {/* City dropdown */}
          <div style={{position:"relative"}}>
            <div onClick={()=>{setCityOpen(!cityOpen);setDistrictOpen(false);}} style={{display:"flex",alignItems:"center",gap:4,padding:"6px 10px",borderRadius:8,border:`1px solid ${cityOpen?T.accent:T.cardBorder}`,cursor:"pointer",background:cityOpen?`${T.accent}08`:"transparent",transition:"all .2s"}}>
              {I.pin(cityOpen?T.accent:T.textDim)}
              <span style={{fontSize:12,fontWeight:600,color:cityOpen?T.accent:T.text}}>{city}</span>
              <span style={{fontSize:9,color:T.textDim,transform:cityOpen?"rotate(180deg)":"none",transition:"transform .2s"}}>▼</span>
            </div>
            {cityOpen&&<div style={{position:"absolute",right:0,top:38,background:T.card,borderRadius:12,border:`1px solid ${T.cardBorder}`,padding:4,minWidth:140,zIndex:100,boxShadow:T.shadowLg,maxHeight:220,overflowY:"auto"}}>
              {cities.map(c=><div key={c} onClick={()=>{setCity(c);setCityOpen(false);}} style={{padding:"10px 12px",borderRadius:8,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",fontSize:13,fontWeight:city===c?700:500,color:city===c?T.accent:T.text}} onMouseEnter={e=>e.currentTarget.style.background=`${T.textDim}10`} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <span>{c}</span>
                {city===c&&<span style={{fontSize:12,color:T.accent}}>✓</span>}
              </div>)}
            </div>}
          </div>
          {/* Filter icon */}
          <span onClick={()=>{setFilter(!filter);setDistrictOpen(false);setCityOpen(false);}} style={{cursor:"pointer",display:"flex",padding:6,borderRadius:8,background:filter?`${T.accent}10`:"transparent"}}>{I.filter(filter?T.accent:T.textDim)}</span>
        </div>
      </div>
      <div style={{borderBottom:`1px solid ${T.cardBorder}`}}/>
    </div>

    {/* Filter drawer */}
    {filter&&<div style={{position:"fixed",bottom:0,left:0,right:0,top:0,maxWidth:430,margin:"0 auto",zIndex:150,display:"flex",alignItems:"flex-end"}}>
      <div onClick={()=>{setFilter(false);setDistrictOpen(false);}} style={{position:"absolute",inset:0,background:T.overlayScrim}}/>
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
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>{["Bugün","Bu hafta","Bu ay"].map(d=><span key={d} onClick={()=>setDateFilter(dateFilter===d?null:d)} style={{display:"inline-flex",alignItems:"center",padding:"6px 12px",borderRadius:20,fontSize:12,fontWeight:600,color:dateFilter===d?T.onAccent:T.textDim,background:dateFilter===d?T.accent:`${T.textDim}18`,cursor:"pointer",transition:"all .2s"}}>{d}</span>)}</div>

        <div style={{display:"flex",gap:8}}><Btn small primary full onClick={()=>{setFilter(false);setDistrictOpen(false);}}>Uygula</Btn><Btn small ghost onClick={()=>{setDistrict("Tümü");setDateFilter(null);}}>Sıfırla</Btn></div>
      </div>
    </div>}

    {/* === Halısahalar modu === */}
    {pageMode==="venues"&&<div>
      {/* Venues Header — konum */}
      <div style={{padding:"12px 16px 8px",display:"flex",alignItems:"center",gap:6,borderBottom:`1px solid ${T.cardBorder}`}}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="2" strokeLinecap="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
        <span style={{fontSize:12,fontWeight:600,color:T.accent}}>{city}</span>
        <span style={{fontSize:12,color:T.textMuted}}>yakınındaki halısahalar</span>
        <span style={{marginLeft:"auto",fontSize:11,fontWeight:600,color:T.textDim,background:`${T.textDim}14`,padding:"2px 8px",borderRadius:20}}>{VENUES.length} sonuç</span>
      </div>
      {VENUES.map((v,i)=><div key={v.id}>
        {i>0&&<div style={{height:1,background:T.cardBorder,margin:"0 16px"}}/>}
        <div style={{padding:"14px 16px",cursor:"pointer",display:"flex",gap:12,alignItems:"flex-start"}} onClick={()=>{}}>
          {/* Fotoğraf — sol */}
          <div style={{width:88,height:88,borderRadius:12,background:T.card,border:`1px solid ${T.cardBorder}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,overflow:"hidden"}}>
            <span style={{fontSize:28,opacity:.3}}>🏟️</span>
          </div>
          {/* Bilgiler — sağ */}
          <div style={{flex:1,minWidth:0}}>
            {/* Name + open badge */}
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8,marginBottom:4}}>
              <span style={{fontSize:14,fontWeight:700,color:T.text,fontFamily:FH,lineHeight:1.3}}>{v.name}</span>
              <span style={{fontSize:10,fontWeight:600,color:v.open?T.success:T.red,background:v.open?`${T.success}18`:`${T.red}18`,padding:"2px 7px",borderRadius:20,flexShrink:0}}>{v.open?"Açık":"Kapalı"}</span>
            </div>
            {/* Address */}
            <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:6}}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="2" strokeLinecap="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
              <span style={{fontSize:11,color:T.textDim,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{v.address}</span>
            </div>
            {/* Rating + price */}
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
              <div style={{display:"flex",alignItems:"center",gap:3}}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill={T.gold} stroke={T.gold} strokeWidth="1"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>
                <span style={{fontSize:11,fontWeight:600,color:T.text}}>{v.rating}</span>
                <span style={{fontSize:11,color:T.textMuted}}>({v.reviews})</span>
              </div>
              <span style={{fontSize:11,color:T.textMuted}}>·</span>
              <span style={{fontSize:11,fontWeight:600,color:T.accent}}>{v.price}</span>
            </div>
            {/* Tags */}
            <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
              {v.tags.map(tag=><span key={tag} style={{fontSize:10,fontWeight:600,color:T.textDim,background:`${T.textDim}14`,padding:"2px 6px",borderRadius:20}}>{tag}</span>)}
            </div>
          </div>
        </div>
      </div>)}
    </div>}

    {/* === Maçlar modu === */}
    {pageMode==="matches"&&<div style={{paddingTop:16}}>
      {/* Section 1: Yaklaşan Maçın */}
      {upcomingMatch&&<>
        <SectionLabel mt={0}>Yaklaşan Maçın</SectionLabel>
        <MatchListCard m={upcomingMatch} isMine={true}/>
      </>}

      {/* Section 2: Yakınındaki Maçlar */}
      {openMatches.length>0
        ? <>
            <SectionLabel mt={upcomingMatch?24:0}>Yakınındaki Maçlar</SectionLabel>
            {openMatches.map(m=><MatchListCard key={m.id} m={m} isMine={false}/>)}
          </>
        : <div style={{textAlign:"center",padding:"48px 24px"}}><div style={{marginBottom:12,opacity:.5}}>{I.football(T.textMuted)}</div><div style={{fontSize:14,color:T.textDim}}>Şu an açık maç yok</div><div style={{fontSize:12,color:T.textMuted,marginTop:4}}>İlk maçı sen oluştur!</div></div>
      }
    </div>}

  </div>;
}

function MatchListCard({m,isMine}){
  const host=uf(m.host);
  const spotsLeft=m.max-m.joined;
  const friends=m.friendsInMatch||[];
  const friendUsers=friends.map(name=>U.find(u=>u.name.split(" ")[0]===name)).filter(Boolean);
  const participantIds=[m.host,...[1,3,7,8,5].filter(id=>id!==m.host)].slice(0,Math.min(m.joined,3));
  const overflowCount=Math.max(0,m.joined-participantIds.length);
  const [pressed,setPressed]=useState(false);

  return <div
    onClick={()=>window.location.assign(`/04_match_detail?view=S12&role=${isMine?"host":"guest"}`)}
    onMouseDown={()=>setPressed(true)}
    onMouseUp={()=>setPressed(false)}
    onMouseLeave={()=>setPressed(false)}
    onTouchStart={()=>setPressed(true)}
    onTouchEnd={()=>setPressed(false)}
    style={{
      margin:"0 16px 16px",
      background:T.card,
      borderRadius:16,
      border:`1px solid rgba(0,0,0,.06)`,
      padding:18,
      cursor:"pointer",
      transform:pressed?"scale(0.98)":"scale(1)",
      transition:"transform .15s ease",
      position:"relative",
      overflow:"hidden",
    }}
  >
    {/* Katılıyorsun badge */}
    {isMine&&<div style={{display:"flex",marginBottom:8}}>
      <Badge c={T.accent}>{I.check(T.onAccent)} Katılıyorsun</Badge>
    </div>}

    {/* Friend badge — avatar + isim */}
    {!isMine&&friendUsers.length>0&&<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
      <Av i={friendUsers[0].av} img={friendUsers[0].img} s={18}/>
      <span style={{fontSize:11,fontWeight:600,color:T.accent,background:`${T.accent}12`,padding:"2px 8px",borderRadius:20}}>
        {friendUsers[0].name.split(" ")[0]}{friendUsers.length>1?` +${friendUsers.length-1} kişi`:""} katıldı
      </span>
    </div>}

    {/* Title + arrow */}
    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8,marginBottom:8}}>
      <div style={{fontWeight:700,fontSize:16,color:T.text,fontFamily:FH,flex:1,lineHeight:1.3}}>{m.title}</div>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity={0.4} style={{flexShrink:0,marginTop:3}}><polyline points="9,6 15,12 9,18"/></svg>
    </div>

    {/* Location + time */}
    <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:10}}>
      <div style={{display:"flex",alignItems:"center",gap:5,fontSize:13,color:T.textDim}}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.textDim} strokeWidth="2" strokeLinecap="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
        <span style={{fontWeight:500,flex:1}}>{m.loc.name?.split(" ")[0]||m.loc.district}</span>
        {m.distance!=null&&<span style={{fontSize:11,color:T.textMuted,fontWeight:500}}>{m.distance} km</span>}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:5,fontSize:13,color:T.textDim}}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.textDim} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
        <span>{m.date} • {m.time}</span>
      </div>
    </div>

    {/* Host + format */}
    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:12,fontSize:12,color:T.textDim}}>
      <Av i={host?.av} img={host?.img} s={18}/>
      <span style={{fontWeight:600,color:T.textDim}}>{host?.name?.split(" ")[0]} (Host) • {m.fmt}</span>
    </div>

    {/* Participants avatars */}
    <div style={{display:"flex",marginBottom:12}}>
      {participantIds.map((uid,idx)=>{const u=uf(uid);if(!u)return null;return <div key={uid} style={{marginLeft:idx===0?0:-8,zIndex:participantIds.length-idx}}><Av i={u.av} img={u.img} s={32} st={{border:`2px solid ${T.card}`}}/></div>;})}
      {overflowCount>0&&<div style={{marginLeft:-8,width:32,height:32,borderRadius:"50%",background:T.bgAlt,border:`2px solid ${T.card}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:T.textDim}}>+{overflowCount}</div>}
    </div>

    {/* Capacity bar + single-line count */}
    <div style={{display:"flex",flexDirection:"column",gap:6}}>
      <div style={{height:4,borderRadius:2,background:`${T.textDim}18`,overflow:"hidden"}}>
        <div style={{height:4,borderRadius:2,background:spotsLeft<=2?T.orange:T.accent,width:`${m.joined/m.max*100}%`,transition:"width .3s"}}/>
      </div>
      <span style={{fontSize:12,fontWeight:500,color:T.textMuted}}>{m.joined} / {m.max} oyuncu • <span style={{color:spotsLeft<=2?T.orange:T.textMuted,fontWeight:700}}>{spotsLeft} yer kaldı</span></span>
    </div>
  </div>;
}

// S09: Bottom Sheet
function S09({onNav}){
  return <div style={{position:"fixed",bottom:0,left:0,right:0,top:0,maxWidth:430,margin:"0 auto",zIndex:150,display:"flex",alignItems:"flex-end"}}>
    <div onClick={()=>onNav("S08")} style={{position:"absolute",inset:0,background:T.overlayScrim}}/>
    <div style={{position:"relative",width:"100%",background:T.card,borderRadius:"20px 20px 0 0",padding:"20px 20px 32px",marginBottom:56,zIndex:151}}>
      <div style={{width:40,height:4,borderRadius:2,background:T.cardBorder,margin:"0 auto 20px"}}/>
      <div style={{fontSize:18,fontWeight:800,color:T.text,marginBottom:20,fontFamily:FH}}>Ne yapmak istiyorsun?</div>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
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

// S10: Maç Sonu
function S10({onNav,onEndMatch}){
  const [canScore]=useState(true);
  const [teamA]=useState([{id:1,name:"Berk",av:"BY"},{id:2,name:"Ali",av:"AD"},{id:"g1",name:"Tolga",av:"T",guest:true}]);
  const [teamB]=useState([{id:3,name:"Mehmet",av:"MK"}]);
  const [score,setScore]=useState([3,2]);
  const [goals,setGoals]=useState([
    {id:1,team:"A",min:12,scorer:1,assist:2},
    {id:2,team:"B",min:23,scorer:3,assist:null},
    {id:3,team:"A",min:35,scorer:2,assist:1},
    {id:4,team:"A",min:58,scorer:1,assist:null},
    {id:5,team:"B",min:72,scorer:3,assist:null},
  ]);
  const [toast,setToast]=useState(null);
  const [deletePopup,setDeletePopup]=useState(false);
  const [goalDrawer,setGoalDrawer]=useState(null);

  const getPlayerName=(id,team)=>{const list=team==="A"?teamA:teamB;const p=list.find(x=>x.id===id);return p?p.name:null;};
  const drawerPlayers=goalDrawer?(()=>{const list=goalDrawer.team==="A"?teamA:teamB;if(goalDrawer.phase==="assist"){const g=goals.find(x=>x.id===goalDrawer.goalId);return g?.scorer!=null?list.filter(p=>p.id!==g.scorer):list;}return list;})():[];

  const addGoal=(team)=>{
    const min=90;
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
    <div onClick={goalDrawer.phase==="scorer"?skipScorer:skipAssist} style={{position:"absolute",inset:0,background:T.overlayScrim}}/>
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
                <Av i={p.av} s={36} c={T.textDim} st={{background:T.guestBg,color:T.white}}/>
                <div style={{position:"absolute",bottom:-2,right:-2,width:14,height:14,borderRadius:"50%",background:T.textMuted,display:"flex",alignItems:"center",justifyContent:"center",border:`1.5px solid ${T.card}`}}>
                  <span style={{color:T.white,fontSize:8,fontWeight:700}}>M</span>
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
    <div onClick={()=>setDeletePopup(false)} style={{position:"absolute",inset:0,background:T.overlayScrim}}/>
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
      {canScore&&<span onClick={()=>removeGoal(g.id)} style={{cursor:"pointer",display:"flex"}}>{I.trash()}</span>}
    </div>;
  };

  // ========== MATCH END PAGE ==========
  return <div style={{padding:"0",paddingBottom:56,minHeight:"100vh",display:"flex",flexDirection:"column"}}>
    <div style={{display:"flex",alignItems:"center",padding:"16px 20px 8px"}}>
      <div onClick={()=>onNav("S08")} style={{width:40,height:40,borderRadius:12,background:T.card,border:`1px solid ${T.cardBorder}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",marginRight:12}}>
        {I10.arrowLeft(T.text)}
      </div>
      <div style={{fontSize:20,fontWeight:800,color:T.text,fontFamily:FH}}>Maç Sonu</div>
    </div>
    <div style={{padding:"0 20px",flex:1,display:"flex",flexDirection:"column"}}>

    <div style={{display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20}}>
      <div style={{flex:1,textAlign:"center"}}>
        <div style={{fontSize:12,fontWeight:700,color:T.accent,marginBottom:8}}>Takım A</div>
        <div style={{fontSize:52,fontWeight:900,fontFamily:FH,color:T.accent}}>{score[0]}</div>
        {canScore&&<><div onClick={()=>addGoal("A")} style={{margin:"12px auto 0",width:56,height:56,borderRadius:16,background:T.accent,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:22,fontWeight:900,color:T.onAccent,boxShadow:`0 4px 16px ${T.accent}44`}}>+</div>
        <div style={{fontSize:11,color:T.textDim,marginTop:6}}>Gol Ekle</div></>}
      </div>
      <div style={{fontSize:24,color:T.textMuted,fontWeight:300,padding:"0 8px"}}>–</div>
      <div style={{flex:1,textAlign:"center"}}>
        <div style={{fontSize:12,fontWeight:700,color:T.orange,marginBottom:8}}>Takım B</div>
        <div style={{fontSize:52,fontWeight:900,fontFamily:FH,color:T.orange}}>{score[1]}</div>
        {canScore&&<><div onClick={()=>addGoal("B")} style={{margin:"12px auto 0",width:56,height:56,borderRadius:16,background:T.orange,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:22,fontWeight:900,color:T.onAccent,boxShadow:`0 4px 16px ${T.orange}44`}}>+</div>
        <div style={{fontSize:11,color:T.textDim,marginTop:6}}>Gol Ekle</div></>}
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
      <div style={{fontSize:14,color:T.textDim,lineHeight:1.6}}>Tüm katılımcılar için kişisel post oluşturulur. Fotoğraf ve not eklemek post üzerinden yapılır.</div>
    </div>

    <Btn primary full onClick={()=>{if(onEndMatch)onEndMatch();window.location.assign("/03_matches?view=S08&tab=mine");}} st={{fontSize:15,fontWeight:700,padding:"14px 24px",borderRadius:12}}>Kaydet & Paylaş</Btn>
    <div onClick={()=>setDeletePopup(true)} style={{textAlign:"center",marginTop:16,fontSize:14,color:T.red,cursor:"pointer",fontWeight:600}}>Maçı Sil</div>

    <GoalDrawerUI/>
    <DeletePopupUI/>
    </div>
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
    <div onClick={()=>onNav("S08")} style={{position:"absolute",inset:0,background:T.overlayScrim}}/>
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

const TR_DAYS=["Pazar","Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi"];
const TR_MONTHS_SHORT=["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"];

function S31({onNav}){
  // Form state
  const [fmt,setFmt]=useState("6v6");
  const [dateVal,setDateVal]=useState(null);
  const [timeVal,setTimeVal]=useState(null);
  const [selectedLoc,setSelectedLoc]=useState(null);
  const [locQuery,setLocQuery]=useState("");
  const [locCity,setLocCity]=useState("İstanbul");
  const [matchName,setMatchName]=useState("");
  const [titleEdited,setTitleEdited]=useState(false);

  // UI state
  const [drawer,setDrawer]=useState(null);
  const [attempted,setAttempted]=useState(false);

  // Drawer temp state
  const [tmpDate,setTmpDate]=useState("");
  const [tmpStartTime,setTmpStartTime]=useState("");
  const [tmpEndTime,setTmpEndTime]=useState("");
  const [tmpTitle,setTmpTitle]=useState("");

  // Auto title
  const locShort=selectedLoc?selectedLoc.name.split(" ").slice(0,2).join(" "):"";
  const autoTitle=(()=>{
    if(!dateVal||!timeVal)return locShort?`${locShort} Halısaha Maçı`:"Halısaha Maçı";
    const d=new Date(dateVal+"T"+timeVal.split(" ")[0]);const day=TR_DAYS[d.getDay()];
    return `${day} ${timeVal.split(" ")[0]}${locShort?" "+locShort:""} Halısaha Maçı`;
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

  // SVG icons for field rows
  const FIELD_ICONS={
    pin:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.textDim} strokeWidth="2" strokeLinecap="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>,
    calendar:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.textDim} strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    clock:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.textDim} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>,
    users:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.textDim} strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    edit:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.textDim} strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  };

  // Sub-components
  const FieldRow=({icon,label,value,onClick,error})=><div onClick={onClick} style={{display:"flex",alignItems:"center",height:56,cursor:"pointer",borderBottom:`1px solid ${error?T.red+"66":T.cardBorder+"33"}`}}>
    <span style={{marginRight:12,display:"flex",flexShrink:0}}>{icon}</span>
    <span style={{fontSize:14,fontWeight:400,color:T.text,whiteSpace:"nowrap"}}>{label}</span>
    {value&&<span style={{marginLeft:"auto",fontSize:13,fontWeight:500,color:T.accent,maxWidth:"55%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",textAlign:"right"}}>{value}</span>}
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.textDim} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft:value?8:"auto",flexShrink:0}}><polyline points="9,6 15,12 9,18"/></svg>
  </div>;

  const DrawerWrap=({children})=><div style={{position:"fixed",inset:0,zIndex:300,display:"flex",alignItems:"flex-end",maxWidth:430,margin:"0 auto"}}>
    <div onClick={()=>setDrawer(null)} style={{position:"absolute",inset:0,background:T.overlayScrim}}/>
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
    <div style={{fontSize:24,fontWeight:800,color:T.text,letterSpacing:"-0.5px",fontFamily:FH,marginBottom:20}}>Maç Oluştur</div>

    {/* Sport selector */}
    <div style={{padding:"0 0 20px"}}>
      <div style={{fontSize:11,fontWeight:600,color:T.textMuted,textTransform:"uppercase",letterSpacing:.6,marginBottom:2}}>Spor</div>
      <div style={{fontSize:17,fontWeight:700,color:T.text,marginBottom:4}}>Futbol</div>
      <div style={{fontSize:13,color:T.textDim,marginBottom:12}}>Maç Formatını Seç</div>
      <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:2,scrollbarWidth:"none",msOverflowStyle:"none"}}>
        {["5v5","6v6","7v7","8v8","9v9","10v10","11v11","Kadınlar"].map(f=>{
          const w="calc(25% - 6px)";
          return <div key={f} onClick={()=>setFmt(f)} style={{minWidth:w,flex:`0 0 ${w}`,padding:"12px 0",borderRadius:8,textAlign:"center",fontSize:13,fontWeight:600,whiteSpace:"nowrap",cursor:"pointer",background:fmt===f?T.accent:`${T.textDim}18`,color:fmt===f?T.onAccent:T.textDim,transition:"all .15s",border:"none"}}>{f}</div>;
        })}
      </div>
    </div>

    {/* Field rows — ordered: Konum, Tarih, Saat, Kontenjan, Başlık */}
    <FieldRow icon={FIELD_ICONS.pin} label="Konum" value={locDisplay} onClick={()=>setDrawer("location")} error={locError}/>
    <FieldRow icon={FIELD_ICONS.calendar} label="Tarih" value={dateDisplay} onClick={()=>{setTmpDate(dateVal||"");setDrawer("date");}} error={dateError}/>
    <FieldRow icon={FIELD_ICONS.clock} label="Saat" value={timeDisplay} onClick={()=>{const parts=timeVal?timeVal.split(" – "):["",""];setTmpStartTime(parts[0]||"");setTmpEndTime(parts[1]||"");setDrawer("time");}} error={timeError}/>
    <FieldRow icon={FIELD_ICONS.edit} label="Maç Başlığı" value={displayTitle} onClick={()=>{setTmpTitle(displayTitle);setDrawer("title");}}/>

    {/* Validation errors */}
    {errMsg&&<div style={{fontSize:11,color:T.red,fontWeight:600,marginTop:8,paddingLeft:4}}>{errMsg}</div>}

    {/* Spacer */}
    <div style={{flex:1}}/>

    {/* Maç Oluştur CTA */}
    <Btn primary full onClick={handlePublish} st={{fontSize:15,fontWeight:700,padding:"14px 24px",borderRadius:12,marginTop:32}}>Maç Oluştur</Btn>

    {/* ===== DRAWERS ===== */}

    {/* Konum Drawer — bottom sheet */}
    {drawer==="location"&&<div style={{position:"fixed",inset:0,zIndex:300,display:"flex",alignItems:"flex-end",maxWidth:430,margin:"0 auto"}}>
      <div onClick={()=>setDrawer(null)} style={{position:"absolute",inset:0,background:T.overlayScrimStrong}}/>
      <div style={{position:"relative",width:"100%",background:T.card,borderRadius:"20px 20px 0 0",zIndex:301,maxHeight:"82vh",display:"flex",flexDirection:"column"}}>
        <div style={{width:40,height:4,borderRadius:2,background:T.cardBorder,margin:"14px auto 0",flexShrink:0}}/>
        <div style={{padding:"14px 20px 12px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
          <div style={{fontSize:18,fontWeight:700,color:T.text}}>Konum Seç</div>
          <div onClick={()=>setDrawer(null)} style={{width:32,height:32,borderRadius:8,background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.textDim} strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </div>
        </div>
        <div style={{padding:"0 20px 12px",flexShrink:0}}>
          <div style={{background:T.bg,borderRadius:12,border:`1.5px solid ${locQuery.length>=2?T.accent:T.cardBorder}`,padding:"14px 16px",display:"flex",alignItems:"center",gap:12,transition:"border-color .2s"}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={locQuery.length>=2?T.accent:T.textDim} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input value={locQuery} onChange={e=>setLocQuery(e.target.value)} placeholder="Saha adı veya adres ara..." autoFocus style={{background:"none",border:"none",color:T.text,fontSize:15,width:"100%",outline:"none",fontWeight:500,fontFamily:"inherit"}}/>
            {locQuery.length>0&&<span onClick={()=>setLocQuery("")} style={{cursor:"pointer",display:"flex",flexShrink:0}}>{I.x(T.textDim)}</span>}
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"0 20px 32px"}}>
          {locQuery.length<2&&<>
            <div style={{fontSize:12,fontWeight:600,color:T.textMuted,textTransform:"uppercase",letterSpacing:.5,marginBottom:10}}>Yakındaki Sahalar</div>
            {LOC_RESULTS.map((loc,i)=><div key={loc.id} onClick={()=>{setSelectedLoc({...loc,type:"place"});setLocQuery("");setDrawer(null);}} style={{padding:"14px 0",cursor:"pointer",display:"flex",alignItems:"flex-start",gap:12,borderBottom:i<LOC_RESULTS.length-1?`1px solid ${T.cardBorder}33`:"none"}}>
              <span style={{display:"flex",marginTop:2,flexShrink:0}}>{FIELD_ICONS.pin}</span>
              <div><div style={{fontSize:14,fontWeight:600,color:T.text}}>{loc.name}</div><div style={{fontSize:12,color:T.textDim,marginTop:3}}>{loc.addr}</div></div>
            </div>)}
          </>}
          {locQuery.length>=2&&locFiltered.map((loc,i)=><div key={loc.id} onClick={()=>{setSelectedLoc({...loc,type:"place"});setLocQuery("");setDrawer(null);}} style={{padding:"14px 0",cursor:"pointer",display:"flex",alignItems:"flex-start",gap:12,borderBottom:i<locFiltered.length-1?`1px solid ${T.cardBorder}33`:"none"}}>
            <span style={{display:"flex",marginTop:2,flexShrink:0}}>{FIELD_ICONS.pin}</span>
            <div><div style={{fontSize:14,fontWeight:600,color:T.text}}>{loc.name}</div><div style={{fontSize:12,color:T.textDim,marginTop:3}}>{loc.addr}</div></div>
          </div>)}
          {locQuery.length>=2&&locFiltered.length===0&&<div style={{textAlign:"center",padding:"32px 0",fontSize:13,color:T.textMuted}}>Sonuç bulunamadı</div>}
        </div>
      </div>
    </div>}

    {/* Tarih Drawer */}
    {drawer==="date"&&<DrawerWrap>
      <div style={{fontSize:16,fontWeight:700,color:T.text,marginBottom:16}}>Tarih Seç</div>
      {(()=>{
        const today=new Date();
        const opts=[
          {label:"Bugün",date:today},
          {label:"Yarın",date:new Date(today.getTime()+86400000)},
          {label:"Öbürgün",date:new Date(today.getTime()+2*86400000)},
        ];
        const fmtDateVal=(d)=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
        const quickVals=opts.map(o=>fmtDateVal(o.date));
        return <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
          {opts.map(o=>{const v=fmtDateVal(o.date);const sel=tmpDate===v;return <div key={o.label} onClick={()=>setTmpDate(v)} style={{padding:"14px 16px",borderRadius:12,cursor:"pointer",background:sel?`${T.accent}12`:T.bg,border:`1.5px solid ${sel?T.accent:T.cardBorder}`,display:"flex",alignItems:"center",justifyContent:"space-between",transition:"all .15s"}}>
            <span style={{fontSize:14,fontWeight:600,color:sel?T.accent:T.text}}>{o.label}</span>
            <span style={{fontSize:13,color:T.textMuted}}>{o.date.getDate()} {TR_MONTHS_SHORT[o.date.getMonth()]}</span>
          </div>;})}
          <div style={{padding:"14px 16px",borderRadius:12,cursor:"pointer",background:T.bg,border:`1.5px solid ${tmpDate&&!quickVals.includes(tmpDate)?T.accent:T.cardBorder}`,transition:"border-color .15s"}}>
            <div style={{fontSize:13,fontWeight:600,color:T.textDim,marginBottom:8}}>Özel Tarih</div>
            <input type="date" value={tmpDate&&!quickVals.includes(tmpDate)?tmpDate:""} onChange={e=>setTmpDate(e.target.value)} style={{background:"none",border:"none",color:T.text,fontSize:14,width:"100%",outline:"none",fontWeight:500,fontFamily:"inherit"}}/>
          </div>
        </div>;
      })()}
      <Btn primary full disabled={!tmpDate} onClick={()=>{if(tmpDate){setDateVal(tmpDate);setDrawer(null);}}} st={{borderRadius:12}}>Tamam</Btn>
    </DrawerWrap>}

    {/* Saat Drawer */}
    {drawer==="time"&&<DrawerWrap>
      <div style={{fontSize:16,fontWeight:700,color:T.text,marginBottom:16}}>Saat Seç</div>
      {/* 4 period cards */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
        {[
          {id:"morning",label:"Morning",sub:"Sabah",range:"12:00 AM – 9:00 AM",start:"06:00",end:"09:00"},
          {id:"day",label:"Day",sub:"Gündüz",range:"9:00 AM – 4:00 PM",start:"09:00",end:"16:00"},
          {id:"evening",label:"Evening",sub:"Akşam",range:"4:00 PM – 9:00 PM",start:"16:00",end:"21:00"},
          {id:"night",label:"Night",sub:"Gece",range:"9:00 PM – 12:00 AM",start:"21:00",end:"00:00"},
        ].map(p=>{
          const sel=tmpStartTime===p.start&&tmpEndTime===p.end;
          return <div key={p.id} onClick={()=>{setTmpStartTime(p.start);setTmpEndTime(p.end);}} style={{padding:"16px 14px",borderRadius:10,cursor:"pointer",background:sel?`${T.accent}15`:T.bg,border:`1.5px solid ${sel?T.accent:T.cardBorder}`,transition:"all .15s"}}>
            <div style={{fontSize:15,fontWeight:700,color:sel?T.accent:T.text,marginBottom:2}}>{p.label}</div>
            <div style={{fontSize:11,fontWeight:600,color:sel?T.accent:T.textDim,marginBottom:6}}>{p.sub}</div>
            <div style={{fontSize:11,color:T.textMuted,lineHeight:1.4}}>{p.range}</div>
          </div>;
        })}
      </div>
      {/* Custom time */}
      <div style={{background:T.bg,borderRadius:12,border:`1px solid ${T.cardBorder}`,padding:"14px 16px",marginBottom:16}}>
        <div style={{fontSize:12,fontWeight:600,color:T.textMuted,marginBottom:12}}>Özel bir saat girebilirsiniz</div>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <div style={{flex:1}}>
            <div style={{fontSize:11,color:T.textMuted,marginBottom:6}}>Başlangıç</div>
            <input type="time" value={tmpStartTime} onChange={e=>setTmpStartTime(e.target.value)} style={{background:"none",border:`1.5px solid ${T.cardBorder}`,borderRadius:10,color:T.text,fontSize:15,width:"100%",outline:"none",fontWeight:500,fontFamily:"inherit",padding:"10px 12px"}}/>
          </div>
          <div style={{color:T.textMuted,paddingTop:18,fontSize:18,fontWeight:300}}>–</div>
          <div style={{flex:1}}>
            <div style={{fontSize:11,color:T.textMuted,marginBottom:6}}>Bitiş</div>
            <input type="time" value={tmpEndTime} onChange={e=>setTmpEndTime(e.target.value)} style={{background:"none",border:`1.5px solid ${T.cardBorder}`,borderRadius:10,color:T.text,fontSize:15,width:"100%",outline:"none",fontWeight:500,fontFamily:"inherit",padding:"10px 12px"}}/>
          </div>
        </div>
      </div>
      <Btn primary full disabled={!tmpStartTime} onClick={()=>{if(tmpStartTime){setTimeVal(tmpStartTime+(tmpEndTime?` – ${tmpEndTime}`:""));setDrawer(null);}}} st={{borderRadius:12}}>Tamam</Btn>
    </DrawerWrap>}



    {/* Maç Başlığı Drawer */}
    {drawer==="title"&&<DrawerWrap>
      <div style={{fontSize:16,fontWeight:700,color:T.text,marginBottom:16}}>Maç Başlığı</div>
      <div style={{background:T.bg,borderRadius:12,border:`1.5px solid ${T.cardBorder}`,padding:"12px 16px",marginBottom:16}}>
        <input value={tmpTitle} onChange={e=>setTmpTitle(e.target.value)} placeholder={autoTitle} style={{background:"none",border:"none",color:T.text,fontSize:14,width:"100%",outline:"none",fontWeight:500,fontFamily:"inherit"}}/>
      </div>
      <Btn primary full onClick={()=>{if(tmpTitle.trim()&&tmpTitle.trim()!==autoTitle){setMatchName(tmpTitle.trim());setTitleEdited(true);}else{setMatchName("");setTitleEdited(false);}setDrawer(null);}} st={{borderRadius:12}}>Tamam</Btn>
    </DrawerWrap>}

  </div>;
}

// ============================================================
// MAIN
// ============================================================
export default function SporWaveMatches(){
  const [cur,setCur]=useState("S08");
  const [fade,setFade]=useState(true);

  useEffect(()=>{if(!document.querySelector('link[href*="Plus+Jakarta+Sans"]')){const l=document.createElement("link");l.href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap";l.rel="stylesheet";document.head.appendChild(l);}},[]);
  useEffect(()=>{
    const view=new URLSearchParams(window.location.search).get("view");
    const allowed=["S08","S10","S14","S31"];
    if(view&&allowed.includes(view))setCur(view);
  },[]);

  const nav=(p)=>{setFade(false);setTimeout(()=>{setCur(p);setFade(true);},120);};

  const handleDeleteMatch=()=>{};

  const isMatchesView=["S08","S14"].includes(cur);

  const pg=()=>{
    switch(cur){
      case "S08":case "S14":return <S08 onNav={nav} hasActiveWidget={false}/>;
      case "S10":return <S10 onNav={nav} onEndMatch={handleDeleteMatch}/>;
      case "S31":return <S31 onNav={nav}/>;
      default:return <S08 onNav={nav}/>;
    }
  };

  return <div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",background:T.bg,color:T.text,fontFamily:FB,position:"relative",boxShadow:T.shadowPage}}>
    <div style={{position:"sticky",top:0,zIndex:200,background:T.bgAlt,borderBottom:`1px solid ${T.cardBorder}`,padding:"6px 8px",display:"flex",gap:4,flexWrap:"wrap",alignItems:"center"}}>
      {[{p:"S08",l:"Maçlar"},{p:"S10",l:"Maç Sonu"},{p:"S14",l:"Seviye"},{p:"S31",l:"Oluştur"}].map(n=><span key={n.p} onClick={()=>nav(n.p)} style={{padding:"4px 10px",borderRadius:6,fontSize:11,fontWeight:600,background:cur===n.p?T.accent:`${T.textDim}22`,color:cur===n.p?T.onAccent:T.textDim,cursor:"pointer"}}>{n.l}</span>)}
      <span style={{marginLeft:"auto",width:1,height:16,background:T.cardBorder,flexShrink:0}}/>
    </div>
    <div style={{opacity:fade?1:0,transform:fade?"none":"translateY(6px)",transition:"all .12s ease"}}>{pg()}</div>
    {/* Fixed elements OUTSIDE transform div */}
    {isMatchesView&&<div style={{position:"fixed",bottom:80,left:0,right:0,maxWidth:430,margin:"0 auto",pointerEvents:"none",zIndex:90,display:"flex",justifyContent:"flex-end",paddingRight:24}}>
      <div onClick={()=>nav("S31")} style={{width:56,height:56,borderRadius:16,background:T.accent,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:`0 4px 24px ${T.accent}44`,pointerEvents:"auto"}}>{I.plus(T.onAccent)}</div>
    </div>}
    {cur==="S14"&&<S14 onNav={nav}/>}
    {isMatchesView&&<TabBar active="S08" onNav={nav}/>}
  </div>;
}
