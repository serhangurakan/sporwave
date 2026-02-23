import { useState, useCallback, useEffect } from "react";

const C = {
  // Yüzeyler
  bg:"#F7F9FC",  s:"#FFFFFF",  s2:"#F1F4F8", b:"#E6EAF0",
  // Metin
  t:"#0F172A",  d:"#475569",  d2:"#94A3B8", dis:"#CBD5E1",
  // Accent
  a:"#5A7A00",  ap:"#4A6900", ad:"rgba(90,122,0,0.10)", at:"#5A7A00",
  // Durum
  r:"#EF4444",  bl:"#3B82F6", o:"#F59E0B",  g:"#22C55E",
  // Sabit
  bk:"#0B0F14", w:"#fff",
  // Buton
  btn:"#B7F000",
};

const events=[
  {id:1,title:"Türkiye İş Bankası 48. İstanbul Maratonu",date:"1 Kasım 2026",time:"09:00",city:"İstanbul",dist:"Avrupa Yakası",sport:"Koşu",e:"🏃",price:"Ücretsiz Seyir",src:"official",srcHandle:"istanbul.istanbul",catC:"#EF4444",interested:1240,going:312,verified:true,lastVerified:"2 gün önce",desc:"Türkiye'nin en prestijli koşu etkinliği. 42km maraton, 21km yarı maraton ve 10km halk koşusu kategorileri. Katılım koşulları için resmi kayıt sayfasını ziyaret edin."},
  {id:2,title:"Istanbul HYROX 2026",date:"15 Mart 2026",time:"08:00",city:"İstanbul",dist:"Ataşehir",sport:"HYROX",e:"🏋️",price:"€120",src:"instagram",srcHandle:"@hyrox",catC:"#F59E0B",interested:428,going:186,verified:true,lastVerified:"1 gün önce",desc:"Dünyanın 1 numaralı fitness yarışması HYROX İstanbul'a geliyor. 8 istasyon ve 8km koşu. Bireysel ve takım kategorileri mevcut."},
  {id:3,title:"Max Runners Bayram Koşusu",date:"29 Ekim 2026",time:"08:30",city:"İstanbul",dist:"Beşiktaş",sport:"Koşu",e:"🏅",price:"Ücretsiz",src:"instagram",srcHandle:"@maxrunners",catC:"#EF4444",interested:215,going:89,verified:false,lastVerified:"5 gün önce",desc:"Max Runners topluluğu olarak Cumhuriyet Bayramı'nı birlikte kutluyoruz! Beşiktaş sahil bandında 5km ve 10km parkurlar. Herkese açık, kayıt gerekmez."},
  {id:4,title:"Antalya Triathlon Festivali",date:"20 Nisan 2026",time:"07:00",city:"Antalya",dist:"Konyaaltı",sport:"Triatlon",e:"🏊",price:"300₺",src:"facebook",srcHandle:"AntalyaTriathlon",catC:"#3B82F6",interested:178,going:64,verified:false,lastVerified:"1 hafta önce",desc:"Antalya'nın eşsiz manzarasında triatlon festivali. Yüzme, bisiklet ve koşudan oluşan Sprint, Olympic ve Half mesafe kategorileri."},
];
const acts=[
  {id:1,sport:"Futbol",title:"Halısaha Maçı",desc:"Kadıköy'de akşam 7'de halısaha maçı, 3 kişi arıyoruz",city:"İstanbul",dist:"Kadıköy",date:"21 Şub Cts",time:"19:00",cur:7,max:10,level:"Orta",mode:"all",owner:"Ahmet K."},
  {id:2,sport:"Tenis",title:"Tenis Kort Arkadaşı",desc:"Tenis kortum var müsait akşam saat 19.00 yakınında olan arkadaşlarımı bekliyorum",city:"İstanbul",dist:"Beşiktaş",date:"22 Şub Paz",time:"19:00",cur:1,max:2,level:"İyi",mode:"approve",owner:"Elif S."},
  {id:3,sport:"Basketbol",title:"3v3 Basketbol",desc:"Sahada 3v3 oynamak için 4 kişi lazım",city:"İstanbul",dist:"Şişli",date:"23 Şub Pzt",time:"18:00",cur:2,max:6,level:"Herkes",mode:"all",owner:"Can D."},
];
const lessons=[
  {id:1,sport:"Padel",title:"Etiler Padel Dersleri",desc:"Profesyonel Antrenörlerle Kaliteli Padel Eğitimi",fac:"Etiler Padel İstanbul",price:"500₺/seans",type:"1-1",dr:"1 Şub - 28 Şub 2026",time:"12:00-14:00",e:"🎾",r:4.8},
  {id:2,sport:"Yoga",title:"Sabah Yoga Grubu",desc:"Her seviyeye uygun grup yoga dersleri",fac:"Zen Studio Kadıköy",price:"200₺/seans",type:"Grup",dr:"Her Hafta",time:"08:00-09:30",e:"🧘",r:4.9},
  {id:3,sport:"Okçuluk",title:"Geleneksel Okçuluk Eğitimi",desc:"Başlangıç seviyesinden ileri seviyeye okçuluk dersleri",fac:"Okmeydanı Okçuluk Kulübü",price:"350₺/seans",type:"1-1",dr:"Hafta içi",time:"10:00-18:00",e:"🏹",r:4.7},
];
const msgs=[
  {id:1,name:"Ahmet K.",last:"Tamam, maçta görüşürüz!",time:"14:32",unread:2,av:"AK"},
  {id:2,name:"Elif S.",last:"Tenis seviyeniz nedir?",time:"Dün",unread:0,av:"ES"},
  {id:3,name:"Zen Studio",last:"Rezervasyonunuz onaylandı ✓",time:"Pzt",unread:1,av:"ZS"},
];
const notifs=[
  {id:1,txt:"Halısaha Maçı başvurunuz onaylandı!",time:"2 saat önce",t:"ok", linkPg:"act-det",linkDet:acts[0]},
  {id:2,txt:"Yeni padel dersi eklendi: Beşiktaş Academy",time:"5 saat önce",t:"info",linkPg:"ders-det",linkDet:lessons[0]},
  {id:3,txt:"İstanbul Maratonu kayıtları başladı!",time:"Dün",t:"info",linkPg:"evt-det",linkDet:events[0]},
  {id:4,txt:"Can D. seni Basketbol etkinliğine davet etti",time:"Dün",t:"inv", linkPg:"act-det",linkDet:acts[2]},
];
// friends array kaldırıldı — arkadaşlık durumu artık App state'indeki friendships ile yönetilir
const users={
  "Ahmet K.":{name:"Ahmet K.",av:"AK",sport:"Futbol",city:"İstanbul",scores:{sp:4.6,kg:88,org:null},badges:["Güvenilir Sporcu 🏅"],acts:12},
  "Elif S.":{name:"Elif S.",av:"ES",sport:"Tenis",city:"İstanbul",scores:{sp:4.8,kg:95,org:4.3},badges:["Güvenilir Sporcu 🏅","Maç Kurucusu 🎤"],acts:8},
  "Can D.":{name:"Can D.",av:"CD",sport:"Basketbol",city:"İstanbul",scores:{sp:4.3,kg:75,org:null},badges:[],acts:5},
  "Mert Y.":{name:"Mert Y.",av:"MY",sport:"Koşu",city:"İstanbul",scores:{sp:4.5,kg:82,org:null},badges:[],acts:7},
};
// Yaklaşan aktiviteler (gelecek tarihli)
const myUpcoming=[
  {e:"⚽",t:"Halısaha Maçı",d:"28 Şub Cts 19:00",st:"Onaylandı",stC:"g",det:{...acts[0]}},
  {e:"🏃",t:"İstanbul Maratonu",d:"1 Kas 2026",st:"Kayıtlı",stC:"g",det:{...events[0]}},
  {e:"🎾",t:"Padel Dersi",d:"5 Mar Sal 12:00",st:"Onay bekliyor",stC:"o",det:{...lessons[0]}},
];
// Geçmiş aktiviteler (tamamlanmış)
const myPast=[
  {e:"🏀",t:"3v3 Basketbol",d:"10 Şub Pzt 18:00",st:"Tamamlandı",stC:"d",rated:true},
  {e:"🎾",t:"Tenis Kort Arkadaşı",d:"15 Şub Cts 19:00",st:"Tamamlandı",stC:"d",rated:false},
  {e:"🧘",t:"Sabah Yoga Grubu",d:"18 Şub Sal 08:00",st:"Tamamlandı",stC:"d",rated:true},
];

const sportF=["Hepsi","Futbol","Tenis","Basketbol","Padel","Yoga"];
const cityF=["Tüm Şehirler","İstanbul","Ankara","İzmir","Antalya"];
const levels=["Başlangıç","Orta","İyi","Profesyonel"];
const sportGrid=[{e:"⚽",n:"Futbol"},{e:"🎾",n:"Tenis"},{e:"🏀",n:"Basketbol"},{e:"🏐",n:"Voleybol"},{e:"♟️",n:"Satranç"},{e:"🏓",n:"Masa Tenisi"},{e:"🎱",n:"Padel"},{e:"➕",n:"Diğer"}];
const favSports=["⚽ Futbol","🎾 Tenis","🏀 Basketbol","🏐 Voleybol","🏃 Koşu","🧘 Yoga","🏊 Yüzme","♟️ Satranç","🏋️ Fitness"];

const LogoSvg = () => (
  <svg width="42" height="24" viewBox="0 0 70 40" fill="none">
    <path d="M42.1261 8.00107C42.5309 7.98553 42.9239 8.1395 43.2104 8.42596L53.0909 18.3066L59.3353 12.0624C59.9033 11.4944 60.8242 11.4944 61.3923 12.0624C61.9603 12.6305 61.9603 13.5514 61.3923 14.1194L54.1195 21.3922C53.5515 21.9602 52.6305 21.9602 52.0625 21.3922L42.264 11.5937L32.3772 23.1284C32.1135 23.436 31.7335 23.6197 31.3286 23.6353C30.9238 23.6508 30.5308 23.4969 30.2443 23.2104L20.2745 13.2405L10.3858 21.4811C9.76863 21.9954 8.85147 21.9119 8.33719 21.2948C7.82292 20.6777 7.90624 19.7606 8.52335 19.2463L19.4324 10.1553L19.4875 10.1116C20.0633 9.6766 20.8769 9.72895 21.3922 10.2443L31.1905 20.0425L41.0775 8.50794C41.3412 8.20033 41.7212 8.01663 42.1261 8.00107Z" fill="#5A7A00"/>
    <path opacity="0.3" d="M42.154 17.8187C42.3564 17.811 42.553 17.888 42.6962 18.0312L53.091 28.426L59.8495 21.6676C60.1335 21.3835 60.5941 21.3835 60.8781 21.6676C61.1621 21.9516 61.1621 22.4121 60.8781 22.6962L53.6053 29.9688C53.3213 30.2528 52.8609 30.2528 52.5769 29.9688L42.2229 19.615L31.825 31.746C31.6932 31.8998 31.5032 31.9917 31.3008 31.9995C31.0984 32.0072 30.9018 31.9303 30.7585 31.7871L20.319 21.3475L9.92012 30.0133C9.61156 30.2704 9.15297 30.2288 8.89584 29.9202C8.6387 29.6117 8.68049 29.1531 8.98906 28.896L19.8981 19.805L19.9256 19.7831C20.2135 19.5656 20.6202 19.5918 20.8779 19.8494L31.2317 30.2031L41.6298 18.0722L41.6552 18.044C41.7854 17.9072 41.9642 17.826 42.154 17.8187Z" fill="#5A7A00"/>
  </svg>
);

const Ico = {
  back: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>,
  menu: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>,
  msg: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>,
  bell: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>,
  x: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
  plus: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>,
  send: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>,
  chr: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>,
  cal: <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>,
  pin: <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
  ppl: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  star: <svg width="13" height="13" fill="#F59E0B" stroke="#F59E0B" strokeWidth="1" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
};

const SE = (e) => e === "Futbol" ? "⚽" : e === "Tenis" ? "🎾" : e === "Basketbol" ? "🏀" : "🏐";

// ─── S28: Boş Durum Component'i (Reusable) ──────────────────────────────────
const EmptyState = ({type, onAction}) => {
  const states = {
    etkinlik: {icon:"🏆",title:"Henüz etkinlik eklenmedi",desc:"Yakında yeni etkinlikler eklenecek!",btn:null},
    aktivite: {icon:"⚽",title:"İlk aktiviteyi sen oluştur!",desc:"Spor arkadaşı bulmak için yeni bir aktivite başlat.",btn:"+ Aktivite Oluştur"},
    mesaj: {icon:"💬",title:"Henüz mesajınız yok",desc:"Aktivitelere katılarak yeni insanlarla tanışın!",btn:null},
    bildirim: {icon:"🔔",title:"Bildiriminiz bulunmuyor",desc:"Aktivitelere katıldığınızda bildirim alacaksınız.",btn:null},
    arkadas: {icon:"👥",title:"Henüz arkadaşın yok",desc:"Aktivitelerde tanıştığın kişileri arkadaş olarak ekle!",btn:null},
  };
  const s = states[type] || states.aktivite;
  return (
    <div style={{padding:"60px 30px",textAlign:"center"}}>
      <div style={{fontSize:56,marginBottom:16}}>{s.icon}</div>
      <div style={{fontSize:16,fontWeight:700,color:"#0F172A",marginBottom:8}}>{s.title}</div>
      <div style={{fontSize:13,color:"#475569",lineHeight:1.6,marginBottom:20}}>{s.desc}</div>
      {s.btn && onAction && (
        <button onClick={onAction} style={{padding:"12px 24px",borderRadius:12,border:"none",background:"#B7F000",color:"#0B0F14",fontSize:14,fontWeight:700,cursor:"pointer"}}>
          {s.btn}
        </button>
      )}
    </div>
  );
};

export default function App() {
  const [pg, setPg] = useState("kesfet");
  const [tab, setTab] = useState("kesfet");
  const [det, setDet] = useState(null);
  const [hist, setHist] = useState([]);
  const [menu, setMenu] = useState(false);
  const [sheet, setSheet] = useState(null);
  const [logged, setLogged] = useState(false);
  const [sf, setSf] = useState("Hepsi");
  const [cf, setCf] = useState("Tüm Şehirler");
  const [ptab, setPtab] = useState("yaklaşan");
  const [cStep, setCStep] = useState(0);
  const [obStep, setObStep] = useState(0);
  const [selLv, setSelLv] = useState(null);
  const [mt, setMt] = useState("");
  const [rStep, setRStep] = useState(0);
  const [rStars, setRStars] = useState({});
  const [rOrgStar, setROrgStar] = useState(0);
  // Etkinlik etkileşim state
  const [evtInt, setEvtInt] = useState({});   // {id: "interested"}
  // Arkadaşlık sistemi: "none"|"sent"|"received"|"friends"
  const [friendships, setFriendships] = useState({"Ahmet K.":"friends","Elif S.":"none","Can D.":"sent","Mert Y.":"received"});
  const [arTab, setArTab] = useState("arkadaşlar"); // PageArkadaslarim tabı
  const [upTab, setUpTab] = useState("yaklaşan");   // PageKullaniciProfil aktivite tabı
  const [verified, setVerified] = useState(false);  // Kullanıcı telefon doğrulaması durumu

  const nav = useCallback((p, d = null) => {
    setHist(h => [...h, { pg, det, tab }]);
    setDet(d);
    if (["kesfet","oyna","etkinlik","ders","profil"].includes(p)) setTab(p);
    setPg(p); setMenu(false); setSheet(null);
  }, [pg, det, tab]);

  const back = useCallback(() => {
    if (hist.length) {
      const prev = hist[hist.length - 1];
      setHist(h => h.slice(0, -1));
      setPg(prev.pg); setDet(prev.det); setTab(prev.tab);
    }
  }, [hist]);

  const reqLog = (fn) => { if (!logged) { nav("login"); return; } fn && fn(); };

  // Styles
  const sty = {
    phone:{width:375,height:812,background:C.bg,borderRadius:44,overflow:"hidden",position:"relative",display:"flex",flexDirection:"column",border:`3px solid ${C.b}`,boxShadow:"0 8px 48px rgba(0,0,0,0.12)",fontFamily:"SF Pro Display,-apple-system,BlinkMacSystemFont,'Helvetica Neue',sans-serif"},
    topB:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 20px",background:C.s,borderBottom:`1px solid ${C.b}`,minHeight:54,flexShrink:0},
    cnt:{flex:1,overflowY:"auto",overflowX:"hidden"},
    tabB:{display:"flex",borderTop:`1px solid ${C.b}`,background:C.s,flexShrink:0},
    tab:{flex:1,display:"flex",flexDirection:"column",alignItems:"center",padding:"10px 0 8px",cursor:"pointer",gap:3},
    pill:{display:"inline-flex",padding:"7px 16px",borderRadius:20,fontSize:12,fontWeight:600,cursor:"pointer",border:`1px solid ${C.b}`,background:C.s2,color:C.d,whiteSpace:"nowrap",transition:"all .15s"},
    pillA:{background:C.ad,color:C.a,borderColor:C.a},
    card:{background:C.s,border:`1px solid ${C.b}`,borderRadius:14,margin:"0 16px 12px",overflow:"hidden",cursor:"pointer",transition:"border-color .2s",boxShadow:"0 1px 4px rgba(0,0,0,0.06)"},
    cb:{padding:"14px 16px"},
    img:{width:"100%",height:160,background:`linear-gradient(135deg,${C.s2},${C.b})`,display:"flex",alignItems:"center",justifyContent:"center",color:C.d},
    fab:{position:"absolute",bottom:80,right:20,width:56,height:56,borderRadius:16,background:C.btn,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:"0 4px 20px rgba(183,240,0,0.35)",color:C.bk,zIndex:10},
    btn:{width:"100%",padding:"14px",borderRadius:12,border:"none",fontSize:15,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8},
    inp:{width:"100%",padding:"12px 16px",borderRadius:10,border:`1px solid ${C.b}`,background:C.s2,color:C.t,fontSize:14,outline:"none",boxSizing:"border-box"},
    av:{width:40,height:40,borderRadius:"50%",background:`linear-gradient(135deg,#1a4bcc,${C.bl})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:C.w,flexShrink:0},
    tag:{display:"inline-flex",padding:"4px 10px",borderRadius:8,fontSize:11,fontWeight:600,background:C.ad,color:C.a,marginRight:6},
    bSheet:{position:"absolute",bottom:0,left:0,right:0,background:C.s,borderTop:`1px solid ${C.b}`,borderRadius:"20px 20px 0 0",padding:"24px 20px",zIndex:20,boxShadow:"0 -4px 24px rgba(0,0,0,0.08)"},
    overlay:{position:"absolute",inset:0,background:"rgba(15,23,42,0.4)",zIndex:15},
    ic:{width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:C.d,borderRadius:10},
    sub:{fontSize:12,color:C.d,display:"flex",alignItems:"center",gap:5},
    mi:{display:"flex",alignItems:"center",gap:14,padding:"16px 20px",borderBottom:`1px solid ${C.b}`,cursor:"pointer",color:C.t,fontSize:14,fontWeight:500},
    badge:{background:C.r,color:C.w,fontSize:9,fontWeight:700,borderRadius:10,padding:"1px 5px",position:"absolute",top:-2,right:-2,minWidth:14,textAlign:"center"},
  };

  // ---- Status badge colors ----
  const stColor = (stC) => stC==="g" ? C.g : stC==="o" ? C.o : C.d;
  const stBg    = (stC) => stC==="g" ? "rgba(34,197,94,0.15)" : stC==="o" ? "rgba(245,158,11,0.15)" : "rgba(71,85,105,0.12)";

  const TopBar = ({title, showBack, right}) => (
    <div style={sty.topB}>
      {showBack ? <div style={sty.ic} onClick={back}>{Ico.back}</div> :
        <div style={{display:"flex",alignItems:"center",gap:6}}><LogoSvg/><span style={{fontSize:18,fontWeight:800,letterSpacing:-0.5,fontFamily:"'Plus Jakarta Sans',-apple-system,sans-serif"}}><span style={{color:C.t}}>Spor</span><span style={{color:C.a}}>wave</span></span></div>}
      <div style={{fontSize:16,fontWeight:700,color:C.t}}>{showBack ? title : ""}</div>
      <div style={{display:"flex",gap:4}}>
        {right || <>
          <div style={{...sty.ic,position:"relative"}} onClick={()=>reqLog(()=>nav("bildirimler"))}>
            {Ico.bell}{logged && <div style={sty.badge}>4</div>}
          </div>
          <div style={{...sty.ic,position:"relative"}} onClick={()=>reqLog(()=>nav("mesajlar"))}>
            {Ico.msg}{logged && <div style={sty.badge}>3</div>}
          </div>
          <div style={sty.ic} onClick={()=>setMenu(true)}>{Ico.menu}</div>
        </>}
      </div>
    </div>
  );

  const TabBar = () => (
    <div style={sty.tabB}>
      {[{id:"kesfet",l:"Keşfet",e:"🔍"},{id:"oyna",l:"Oyna",e:"⚽"},{id:"etkinlik",l:"Etkinlik",e:"🏆"},{id:"ders",l:"Ders",e:"🎓"},{id:"profil",l:"Profil",e:"👤"}].map(t=>(
        <div key={t.id} style={{...sty.tab,flex:1}} onClick={()=>{t.id==="profil"&&!logged?nav("login"):nav(t.id)}}>
          <span style={{fontSize:18,opacity:tab===t.id?1:.45}}>{t.e}</span>
          <span style={{fontSize:9,fontWeight:600,color:tab===t.id?C.at:C.d2}}>{t.l}</span>
          {tab===t.id && <div style={{width:16,height:2,borderRadius:1,background:C.a,marginTop:1}}/>}
        </div>
      ))}
    </div>
  );

  const Pills = ({items, val, set}) => (
    <div style={{display:"flex",gap:8,padding:"12px 16px",overflowX:"auto",flexShrink:0}}>
      {items.map(i=><div key={i} style={{...sty.pill,...(val===i?sty.pillA:{})}} onClick={()=>set(i)}>{i}</div>)}
    </div>
  );

  const Av = ({name,size=40,bg}) => (
    <div style={{...sty.av,width:size,height:size,fontSize:size*0.33,...(bg?{background:bg}:{})}}>
      {name.split(" ").map(n=>n[0]).join("")}
    </div>
  );

  // ========= HELPERS =========
  const srcLabel = s => s==="official" ? "✅ Resmi" : s==="instagram" ? "📸 Instagram" : "👥 Facebook";
  const srcBtnLabel = s => s==="official" ? "🔗 Resmi Kayıt Sayfası" : s==="instagram" ? "📸 Instagram'da Gör" : "👥 Facebook'ta Gör";
  const freeColor = p => p==="Ücretsiz"||p==="Ücretsiz Seyir" ? C.g : C.t;

  // ========= PAGES =========

  // ─── S00: Keşfet Feed ───────────────────────────────────────────────────────
  const PageKesfet = () => (
    <><TopBar/><div style={sty.cnt}>
      <Pills items={["Yakın","İstanbul","Kadıköy","Beşiktaş","Şişli"]} val={cf} set={setCf}/>

      {/* Yakında Maç */}
      <div style={{padding:"4px 16px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div style={{fontSize:16,fontWeight:800,color:C.t}}>⚽ Yakında Maç</div>
          <span style={{fontSize:12,color:C.at,fontWeight:600,cursor:"pointer"}} onClick={()=>nav("oyna")}>Tümünü Gör</span>
        </div>
        {acts.slice(0,2).map(a=>(
          <div key={a.id} style={{...sty.card,margin:"0 0 10px"}} onClick={()=>nav("act-det",a)}>
            <div style={sty.cb}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <div style={{width:32,height:32,borderRadius:8,background:C.s2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{SE(a.sport)}</div>
                  <div>
                    <div style={{fontSize:13,fontWeight:700,color:C.t}}>{a.title}</div>
                    <div style={{fontSize:11,color:C.d}}>{a.dist} • {a.date} {a.time}</div>
                  </div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:12,color:C.a,fontWeight:700}}>{a.cur}/{a.max}</div>
                  <div style={{fontSize:10,color:C.d}}>kişi</div>
                </div>
              </div>
              <button style={{...sty.btn,background:C.btn,color:C.bk,padding:"8px",fontSize:12,borderRadius:8}} onClick={e=>{e.stopPropagation();reqLog(()=>nav("act-det",a));}}>
                Katıl — {a.max-a.cur} yer kaldı
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bu Hafta Etkinlikler */}
      <div style={{padding:"8px 16px 4px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div style={{fontSize:16,fontWeight:800,color:C.t}}>🏆 Bu Hafta Etkinlikler</div>
          <span style={{fontSize:12,color:C.at,fontWeight:600,cursor:"pointer"}} onClick={()=>nav("etkinlik")}>Tümünü Gör</span>
        </div>
        <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:8}}>
          {events.slice(0,3).map(e=>(
            <div key={e.id} style={{...sty.card,margin:0,minWidth:160,flexShrink:0}} onClick={()=>nav("evt-det",e)}>
              <div style={{...sty.img,height:80}}><span style={{fontSize:28}}>{e.e}</span></div>
              <div style={{padding:"10px 12px"}}>
                <div style={{fontSize:12,fontWeight:700,color:C.t,marginBottom:4,lineHeight:1.3}}>{e.title}</div>
                <div style={{...sty.sub,fontSize:10}}>{Ico.cal}<span>{e.date}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popüler Eğitmenler */}
      <div style={{padding:"8px 16px 20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div style={{fontSize:16,fontWeight:800,color:C.t}}>🎓 Popüler Eğitmenler</div>
          <span style={{fontSize:12,color:C.at,fontWeight:600,cursor:"pointer"}} onClick={()=>nav("ders")}>Tümünü Gör</span>
        </div>
        {lessons.map(l=>(
          <div key={l.id} style={{...sty.card,margin:"0 0 10px"}} onClick={()=>nav("ders-det",l)}>
            <div style={sty.cb}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{display:"flex",gap:10,alignItems:"center"}}>
                  <span style={{fontSize:28}}>{l.e}</span>
                  <div>
                    <div style={{fontSize:13,fontWeight:700,color:C.t}}>{l.title}</div>
                    <div style={{fontSize:11,color:C.d}}>{l.fac}</div>
                  </div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{display:"flex",alignItems:"center",gap:3,marginBottom:2}}>{Ico.star}<span style={{fontSize:12,fontWeight:700,color:C.t}}>{l.r}</span></div>
                  <div style={{fontSize:13,fontWeight:800,color:C.a}}>{l.price}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div><TabBar/></>
  );

  const PageEtkinlik = () => (
    <><TopBar/><div style={sty.cnt}>
      <Pills items={cityF} val={cf} set={setCf}/>
      {events.filter(e=>cf==="Tüm Şehirler"||e.city===cf).map(e=>(
        <div key={e.id} style={{...sty.card,padding:0,overflow:"hidden"}} onClick={()=>nav("evt-det",e)}>
          {/* Banner */}
          <div style={{position:"relative",height:140,background:`linear-gradient(135deg,${e.catC}18,${e.catC}38)`,display:"flex",alignItems:"center",justifyContent:"center",borderLeft:`4px solid ${e.catC}`}}>
            <span style={{fontSize:52}}>{e.e}</span>
            {/* Kaynak rozeti */}
            <div style={{position:"absolute",top:8,right:8,background:"rgba(15,23,42,0.62)",borderRadius:6,padding:"3px 8px"}}>
              <span style={{fontSize:10,color:"#fff",fontWeight:600}}>{srcLabel(e.src)}</span>
            </div>
          </div>
          {/* Bilgi */}
          <div style={{...sty.cb,borderLeft:`4px solid ${e.catC}`}}>
            <div style={{fontSize:14,fontWeight:700,color:C.t,marginBottom:6,lineHeight:1.3}}>{e.title}</div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:6}}>
              <div style={sty.sub}>{Ico.cal}<span>{e.date} {e.time}</span></div>
              <div style={sty.sub}>{Ico.pin}<span>{e.dist}, {e.city}</span></div>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:13,fontWeight:700,color:freeColor(e.price)}}>{e.price}</span>
              <span style={{fontSize:11,color:C.d2}}>{e.interested.toLocaleString()} kişi ilgileniyor</span>
            </div>
          </div>
        </div>
      ))}
      <div style={{height:16}}/>
    </div><TabBar/></>
  );

  const PageEvtDet = () => {
    const e = det;
    const intState = evtInt[e.id];          // undefined | "interested"
    const toggleInt  = v => setEvtInt(p  => ({...p, [e.id]: p[e.id]===v ? undefined : v}));
    // "İlgileniyorum" seçiliyse yaklaşan aktiviteler listesine eklendi
    const interestedAvatars = ["AK","ES","MY","CD"];
    return (
    <><TopBar title="Etkinlik Detay" showBack/><div style={sty.cnt}>

      {/* ── Banner ── */}
      <div style={{position:"relative",height:200,background:`linear-gradient(135deg,${e.catC}18,${e.catC}45)`,display:"flex",alignItems:"center",justifyContent:"center",borderLeft:`5px solid ${e.catC}`}}>
        <span style={{fontSize:64}}>{e.e}</span>
        <div style={{position:"absolute",top:10,right:10,background:"rgba(15,23,42,0.6)",borderRadius:6,padding:"4px 9px"}}>
          <span style={{fontSize:11,color:"#fff",fontWeight:600}}>{srcLabel(e.src)}</span>
        </div>
      </div>

      <div style={{padding:20}}>
        {/* ── Başlık ── */}
        <div style={{fontSize:20,fontWeight:800,color:C.t,marginBottom:6,lineHeight:1.3}}>{e.title}</div>
        {e.verified && (
          <div style={{display:"inline-flex",alignItems:"center",background:C.g+"20",borderRadius:6,padding:"3px 9px",marginBottom:8}}>
            <span style={{fontSize:11,color:C.g,fontWeight:600}}>✅ Doğrulanmış Organizatör</span>
          </div>
        )}
        <div style={{fontSize:11,color:C.d2,marginBottom:14}}>
          {srcLabel(e.src)} · @{e.srcHandle} · Son doğrulama: {e.lastVerified}
        </div>

        {/* ── Bilgi satırları ── */}
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
          <div style={sty.sub}>{Ico.cal}<span>{e.date} · {e.time}</span></div>
          <div style={sty.sub}>{Ico.pin}<span>{e.dist}, {e.city}</span></div>
          <div style={sty.sub}>
            <span>🏷️</span>
            <span style={{background:e.catC+"22",color:e.catC,borderRadius:5,padding:"1px 8px",fontWeight:600,fontSize:11}}>{e.sport}</span>
          </div>
          <div style={sty.sub}><span>💰</span><span style={{fontWeight:700,color:freeColor(e.price)}}>{e.price}</span></div>
        </div>

        {/* ── Açıklama ── */}
        <p style={{fontSize:13,color:C.d,lineHeight:1.7,marginBottom:16}}>{e.desc}</p>

        {/* ── Harita ── */}
        <div style={{background:C.s2,borderRadius:12,height:88,display:"flex",alignItems:"center",justifyContent:"center",color:C.d,fontSize:12,marginBottom:20,border:`1px dashed ${C.b}`}}>📍 Konum Haritası</div>

        {/* ════════════════════════════════════
            CTA 1 — BİRİNCİL: Katılım niyeti
            İlgileniyorum → profilde Yaklaşan Etkinlikler'e eklenir
        ════════════════════════════════════ */}
        <button
          style={{...sty.btn,width:"100%",background:intState==="interested"?C.a:C.s2,color:intState==="interested"?C.bk:C.t,border:`1px solid ${intState==="interested"?C.a:C.b}`,fontWeight:700,fontSize:14,marginBottom:6}}
          onClick={()=>{reqLog(()=>toggleInt("interested"));}}>
          {intState==="interested" ? "💚 İlgileniyorum" : "🤍 İlgileniyorum"}
        </button>
        <div style={{fontSize:11,color:C.d2,textAlign:"center",marginBottom:16}}>
          {e.interested.toLocaleString()} kişi ilgileniyor
          {intState==="interested" && <span style={{color:C.g,fontWeight:600}}> · Profiline eklendi ✓</span>}
        </div>

        {/* ════════════════════════════════════
            CTA 2 — İKİNCİL: Takvime Ekle
        ════════════════════════════════════ */}
        <button style={{...sty.btn,width:"100%",background:C.s2,color:C.t,border:`1px solid ${C.b}`,fontSize:13,fontWeight:600,marginBottom:10}} onClick={()=>reqLog()}>
          {Ico.cal} Takvime Ekle
        </button>

        {/* ════════════════════════════════════
            CTA 3 — BAĞLAMSAL: Kaynağa git
        ════════════════════════════════════ */}
        <button style={{...sty.btn,width:"100%",background:"rgba(59,130,246,0.08)",color:C.bl,border:`1px solid ${C.bl}44`,marginBottom:10,fontSize:13,fontWeight:600}}>
          {srcBtnLabel(e.src)}
        </button>

        {/* ════════════════════════════════════
            CTA 4 — SOSYAL: Paylaş + Kim gidiyor?
            Paylaş → kaynak linkini paylaşır
        ════════════════════════════════════ */}
        <button style={{...sty.btn,width:"100%",background:C.s2,color:C.t,border:`1px solid ${C.b}`,marginBottom:20,fontSize:13}}>
          🔗 Paylaş
        </button>

        {/* Kim İlgileniyor? */}
        <div style={{marginBottom:16}}>
          <div style={{fontSize:14,fontWeight:700,color:C.t,marginBottom:10}}>
            Kim İlgileniyor? <span style={{fontSize:13,color:C.d,fontWeight:400}}>({e.interested} kişi)</span>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            {interestedAvatars.slice(0,Math.min(4,e.interested)).map((av,i)=>(
              <div key={i} style={{width:38,height:38,borderRadius:"50%",background:C.ad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:C.at,border:`2px solid ${C.a}`,cursor:"pointer",flexShrink:0}}
                onClick={()=>nav("kullanici-profil",users[Object.keys(users)[i]])}>
                {av}
              </div>
            ))}
            {e.interested>4 && (
              <div style={{width:38,height:38,borderRadius:"50%",background:C.s2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:C.d,border:`1px solid ${C.b}`}}>
                +{e.interested-4}
              </div>
            )}
          </div>
        </div>

        {/* ── Güven katmanı ── */}
        <div style={{paddingTop:12,borderTop:`1px solid ${C.b}`,textAlign:"center"}}>
          <span style={{fontSize:11,color:C.d2}}>Son güncelleme: {e.lastVerified}</span>
        </div>
      </div>
    </div></>
  );};

  const PageOyna = () => (
    <><TopBar/><div style={sty.cnt}>
      <Pills items={sportF} val={sf} set={setSf}/>
      {acts.filter(a=>sf==="Hepsi"||a.sport===sf).map(a=>(
        <div key={a.id} style={sty.card} onClick={()=>nav("act-det",a)}>
          <div style={sty.cb}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:32,height:32,borderRadius:8,background:C.s2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{SE(a.sport)}</div>
                <span style={{fontSize:14,fontWeight:700,color:C.t}}>{a.sport}</span>
              </div>
              <span style={{fontSize:12,color:C.a,fontWeight:700}}>Kişi {a.cur}/{a.max}</span>
            </div>
            <div style={{fontSize:13,fontWeight:600,color:C.t,marginBottom:4}}>{a.title}</div>
            <div style={{fontSize:12,color:C.d,marginBottom:10,lineHeight:1.5}}>{a.desc}</div>
            <div style={{display:"flex",gap:12}}>
              <div style={sty.sub}>{Ico.pin}<span>{a.dist}</span></div>
              <div style={sty.sub}>{Ico.cal}<span>{a.date} {a.time}</span></div>
            </div>
            {a.mode==="approve" && <div style={{marginTop:8}}>
              <span style={{fontSize:10,padding:"3px 8px",borderRadius:6,background:"rgba(59,130,246,0.12)",color:C.bl,fontWeight:600}}>Onay gerekli</span>
            </div>}
          </div>
        </div>
      ))}
      <div style={{height:80}}/>
    </div>
    <div style={sty.fab} onClick={()=>reqLog(()=>nav("act-create"))}>{Ico.plus}</div>
    <TabBar/></>
  );

  const PageActDet = () => { const a=det; return (
    <><TopBar title="Aktivite Detay" showBack/><div style={sty.cnt}>
      <div style={{padding:20}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
          <span style={{fontSize:36}}>{SE(a.sport)}</span>
          <div><div style={{fontSize:20,fontWeight:800,color:C.t}}>{a.title}</div>
          <div style={{fontSize:13,color:C.d}}>{a.sport} • {a.level}</div></div>
        </div>
        <p style={{fontSize:14,color:C.d,lineHeight:1.7,marginBottom:20}}>{a.desc}</p>
        <div style={{background:C.s,border:`1px solid ${C.b}`,borderRadius:12,padding:16,marginBottom:20,display:"flex",flexDirection:"column",gap:10}}>
          <div style={{display:"flex",alignItems:"center",gap:10,color:C.d}}>{Ico.cal}<span style={{fontSize:13,color:C.t}}>{a.date} - {a.time}</span></div>
          <div style={{display:"flex",alignItems:"center",gap:10,color:C.d}}>{Ico.pin}<span style={{fontSize:13,color:C.t}}>{a.city}, {a.dist}</span></div>
          <div style={{display:"flex",alignItems:"center",gap:10,color:C.d}}>{Ico.ppl}<span style={{fontSize:13,color:C.t}}>{a.cur}/{a.max} kişi</span></div>
        </div>
        <div style={{marginBottom:20}}>
          <div style={{fontSize:14,fontWeight:700,color:C.t,marginBottom:10}}>Oluşturan</div>
          <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>nav("kullanici-profil",users[a.owner]||{name:a.owner,av:a.owner.substring(0,2),sport:a.sport,city:a.city,scores:{sp:4.2,kg:85,org:4.0},badges:[],acts:6})}>
            <Av name={a.owner}/><div><div style={{fontSize:14,fontWeight:600,color:C.t}}>{a.owner}</div><div style={{fontSize:12,color:C.d}}>Organizatör</div></div>
          </div>
        </div>
        <div style={{marginBottom:20}}>
          <div style={{fontSize:14,fontWeight:700,color:C.t,marginBottom:10}}>Katılımcılar ({a.cur}/{a.max})</div>
          <div style={{display:"flex",gap:4}}>
            {Array.from({length:a.cur}).map((_,i)=>{
              const n=String.fromCharCode(65+i)+" "+String.fromCharCode(75+i);
              return <div key={i} style={{cursor:"pointer"}} onClick={()=>nav("kullanici-profil",{name:n,av:String.fromCharCode(65+i)+""+String.fromCharCode(75+i),sport:a.sport,city:a.city,scores:{sp:3.8+i*0.1,kg:70+i*4,org:null},badges:[],acts:2+i})}>
                <Av name={n} size={34} bg={`hsl(${i*60+200},60%,50%)`}/>
              </div>;
            })}
          </div>
        </div>
        {/* Organizatör için: Başvuruları Yönet butonu */}
        {logged && a.mode==="approve" && a.owner==="Ahmet K." && (
          <button style={{...sty.btn,background:C.bl,color:"#fff",marginBottom:10}} onClick={()=>nav("basvuru",a)}>
            📋 Başvuruları Yönet (3 bekliyor)
          </button>
        )}
        {/* Butonlar: Katıl + Mesaj Gönder */}
        <div style={{display:"flex",gap:10}}>
          <button style={{...sty.btn,background:C.btn,color:C.bk,flex:2}} onClick={()=>reqLog(()=>setSheet("lv"))}>
            Katıl ({a.max-a.cur} yer var)
          </button>
          <button style={{...sty.btn,background:C.s2,color:C.t,border:`1px solid ${C.b}`,flex:1}} onClick={()=>reqLog(()=>nav("sohbet",{name:a.owner,av:a.owner.substring(0,2)}))}>
            Mesaj
          </button>
        </div>
      </div>
    </div>
    {sheet==="lv"&&<>
      <div style={sty.overlay} onClick={()=>setSheet(null)}/>
      <div style={sty.bSheet}>
        <div style={{fontSize:16,fontWeight:800,color:C.t,marginBottom:4}}>Deneyim Seviyeniz</div>
        <div style={{fontSize:12,color:C.d,marginBottom:16}}>Aktivite sahibinin sizi değerlendirebilmesi için seviyenizi seçin</div>
        {levels.map(l=><button key={l} onClick={()=>setSelLv(l)} style={{display:"block",width:"100%",padding:"14px 16px",borderRadius:12,border:`1px solid ${selLv===l?C.a:C.b}`,background:selLv===l?C.ad:C.s2,color:C.t,cursor:"pointer",textAlign:"left",fontSize:14,fontWeight:500,marginBottom:8,boxSizing:"border-box"}}>{l}</button>)}
        <button style={{...sty.btn,background:C.btn,color:C.bk,marginTop:8}} onClick={()=>{setSheet(null);setSelLv(null);}}>
          {det?.mode==="approve"?"Başvuru Gönder":"Katıl"}
        </button>
      </div>
    </>}
    </>
  );};

  const PageActCreate = () => {
    const steps=["Spor Dalı","Detaylar","Tarih & Konum","Ayarlar"];
    return (
    <><TopBar title="Aktivite Oluştur" showBack/><div style={sty.cnt}>
      <div style={{padding:"16px 20px"}}>
        <div style={{display:"flex",gap:4,marginBottom:24}}>
          {steps.map((st,i)=><div key={i} style={{flex:1}}>
            <div style={{height:3,borderRadius:2,background:i<=cStep?C.a:C.b,marginBottom:6}}/>
            <div style={{fontSize:10,color:i<=cStep?C.a:C.d,fontWeight:600}}>{st}</div>
          </div>)}
        </div>
        {cStep===0&&<>
          <div style={{fontSize:18,fontWeight:800,color:C.t,marginBottom:16}}>Spor dalını seç</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {sportGrid.map(sp=><div key={sp.n} onClick={()=>setCStep(1)} style={{background:C.s,border:`1px solid ${C.b}`,borderRadius:12,padding:16,textAlign:"center",cursor:"pointer"}}>
              <div style={{fontSize:28,marginBottom:6}}>{sp.e}</div>
              <div style={{fontSize:13,fontWeight:600,color:C.t}}>{sp.n}</div>
            </div>)}
          </div>
        </>}
        {cStep===1&&<>
          <div style={{fontSize:18,fontWeight:800,color:C.t,marginBottom:16}}>Detayları gir</div>
          <div style={{marginBottom:14}}><label style={{fontSize:12,color:C.d,marginBottom:6,display:"block"}}>Başlık</label><input style={sty.inp} placeholder="Örn: Halısaha Maçı"/></div>
          <div style={{marginBottom:20}}><label style={{fontSize:12,color:C.d,marginBottom:6,display:"block"}}>Açıklama</label><textarea style={{...sty.inp,height:100,resize:"none"}} placeholder="Aktivitenizi tanımlayın..."/></div>
          <button style={{...sty.btn,background:C.btn,color:C.bk}} onClick={()=>setCStep(2)}>Devam</button>
        </>}
        {cStep===2&&<>
          <div style={{fontSize:18,fontWeight:800,color:C.t,marginBottom:16}}>Tarih & Konum</div>
          <div style={{marginBottom:14}}><label style={{fontSize:12,color:C.d,marginBottom:6,display:"block"}}>Tarih</label><input style={sty.inp} type="date"/></div>
          <div style={{marginBottom:14}}><label style={{fontSize:12,color:C.d,marginBottom:6,display:"block"}}>Saat</label><input style={sty.inp} type="time"/></div>
          <div style={{marginBottom:20}}><label style={{fontSize:12,color:C.d,marginBottom:6,display:"block"}}>Konum</label><input style={sty.inp} placeholder="Adres veya mekan adı"/>
            <div style={{height:80,background:C.s2,borderRadius:8,marginTop:8,display:"flex",alignItems:"center",justifyContent:"center",color:C.d,fontSize:12,border:`1px dashed ${C.b}`}}>📍 Haritadan seç</div>
          </div>
          <button style={{...sty.btn,background:C.btn,color:C.bk}} onClick={()=>setCStep(3)}>Devam</button>
        </>}
        {cStep===3&&<>
          <div style={{fontSize:18,fontWeight:800,color:C.t,marginBottom:16}}>Ayarlar</div>
          <div style={{marginBottom:14}}><label style={{fontSize:12,color:C.d,marginBottom:6,display:"block"}}>Max Kişi Sayısı</label><input style={sty.inp} type="number" placeholder="10"/></div>
          <div style={{marginBottom:14}}><label style={{fontSize:12,color:C.d,marginBottom:10,display:"block"}}>Deneyim Tercihi</label>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{["Herkes",...levels].map(l=><div key={l} style={{...sty.pill,...(l==="Herkes"?sty.pillA:{})}}>{l}</div>)}</div>
          </div>
          <div style={{marginBottom:20}}><label style={{fontSize:12,color:C.d,marginBottom:10,display:"block"}}>Kabul Modu</label>
            {[{t:"Herkesi Kabul Et",d:"Başvuran herkes otomatik katılır",a:true},{t:"Onay ile Kabul Et",d:"Her başvuruyu kendiniz onaylarsınız",a:false}].map(m=>
              <div key={m.t} style={{background:C.s,border:`1px solid ${m.a?C.a:C.b}`,borderRadius:12,padding:14,marginBottom:8,cursor:"pointer"}}>
                <div style={{fontSize:14,fontWeight:700,color:C.t}}>{m.t}</div>
                <div style={{fontSize:12,color:C.d}}>{m.d}</div>
              </div>
            )}
          </div>
          <button style={{...sty.btn,background:C.btn,color:C.bk}} onClick={()=>{nav("oyna");setCStep(0);}}>Yayınla 🚀</button>
        </>}
      </div>
    </div></>
  );};

  const PageDers = () => (
    <><TopBar/><div style={sty.cnt}>
      <Pills items={["Hepsi","Padel","Yoga","Okçuluk","Tenis"]} val={sf} set={setSf}/>
      {lessons.map(l=>(
        <div key={l.id} style={sty.card} onClick={()=>nav("ders-det",l)}>
          <div style={{...sty.img,height:150}}><span style={{fontSize:48}}>{l.e}</span></div>
          <div style={sty.cb}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"start"}}>
              <div><div style={{fontSize:14,fontWeight:700,color:C.t,marginBottom:2}}>{l.title}</div>
              <div style={{fontSize:12,color:C.d}}>{l.fac}</div></div>
              <div style={{display:"flex",alignItems:"center",gap:3}}>{Ico.star}<span style={{fontSize:13,fontWeight:700,color:C.t}}>{l.r}</span></div>
            </div>
            <div style={{display:"flex",gap:6,marginTop:8}}><span style={sty.tag}>{l.type}</span><span style={sty.tag}>{l.sport}</span></div>
            <div style={{...sty.sub,marginTop:8}}>{Ico.cal}<span>{l.dr}</span><span style={{marginLeft:8}}>{l.time}</span></div>
            <div style={{fontSize:16,fontWeight:800,color:C.a,marginTop:8}}>{l.price}</div>
          </div>
        </div>
      ))}
      <div style={{height:16}}/>
    </div><TabBar/></>
  );

  const PageDersDet = () => { const l=det; return (
    <><TopBar title="Ders Detay" showBack/><div style={sty.cnt}>
      <div style={{...sty.img,height:200}}><span style={{fontSize:64}}>{l.e}</span></div>
      <div style={{padding:20}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
          <div style={{fontSize:20,fontWeight:800,color:C.t}}>{l.title}</div>
          <div style={{display:"flex",alignItems:"center",gap:3}}>{Ico.star}<span style={{fontSize:15,fontWeight:700,color:C.t}}>{l.r}</span></div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
          <Av name={l.fac} size={36} bg={`linear-gradient(135deg,${C.bl},${C.bl})`}/>
          <div><div style={{fontSize:14,fontWeight:600,color:C.t}}>{l.fac}</div><div style={{fontSize:12,color:C.g}}>Doğrulanmış Tesis ✓</div></div>
        </div>
        <p style={{fontSize:13,color:C.d,lineHeight:1.7,marginBottom:16}}>{l.desc}</p>
        <div style={{background:C.s,border:`1px solid ${C.b}`,borderRadius:12,padding:16,marginBottom:20}}>
          {[["Ders Türü",l.type],["Spor Dalı",l.sport],["Tarih",l.dr],["Saat",l.time]].map(([k,v])=>
            <div key={k} style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <span style={{fontSize:13,color:C.d}}>{k}</span><span style={{fontSize:13,fontWeight:600,color:C.t}}>{v}</span>
            </div>
          )}
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <span style={{fontSize:13,color:C.d}}>Fiyat</span><span style={{fontSize:16,fontWeight:800,color:C.a}}>{l.price}</span>
          </div>
        </div>
        {/* WhatsApp ile İletişime Geç butonu */}
        <button 
          style={{...sty.btn,background:"#25D366",color:"#fff",marginBottom:10}} 
          onClick={()=>{
            // WhatsApp'a yönlendir (demo: örnek numara)
            const waNumber = l.waPhone || "905551234567";
            const waText = encodeURIComponent(`Merhaba, ${l.title} dersi hakkında bilgi almak istiyorum.`);
            window.open(`https://wa.me/${waNumber}?text=${waText}`, "_blank");
          }}>
          📱 WhatsApp ile İletişime Geç
        </button>
        <div style={{fontSize:11,color:C.d,textAlign:"center"}}>
          Ders ve rezervasyon detayları için doğrudan iletişime geçin
        </div>
      </div>
    </div></>
  );};

  const PageProfil = () => (
    <><TopBar/><div style={sty.cnt}>
      <div style={{padding:20,display:"flex",flexDirection:"column",alignItems:"center"}}>
        <Av name="Berk K" size={80} bg={`linear-gradient(135deg,${C.a},${C.bl})`}/>
        <div style={{fontSize:20,fontWeight:800,color:C.t,marginTop:12,display:"flex",alignItems:"center",gap:6}}>
          Berk K.
          {verified && <span style={{color:C.g,fontSize:18}}>✓</span>}
        </div>
        <div style={{fontSize:13,color:C.d,marginBottom:12}}>İstanbul</div>
        <div style={{display:"flex",gap:24,marginBottom:14}}>
          <div style={{textAlign:"center"}}><div style={{fontSize:22,fontWeight:800,color:C.at}}>12</div><div style={{fontSize:11,color:C.d}}>Etkinlik</div></div>
          <div style={{textAlign:"center"}}><div style={{fontSize:22,fontWeight:800,color:C.at}}>5</div><div style={{fontSize:11,color:C.d}}>Arkadaş</div></div>
        </div>
        {/* Güven & Skor kartları */}
        <div style={{display:"flex",gap:6,marginBottom:10,width:"100%"}}>
          {[{ic:"⭐",val:"4.7",lbl:"Sportmenlik"},{ic:"📍",val:"%91",lbl:"Katılım Güveni"},{ic:"🎤",val:"4.5",lbl:"Organizasyon"}].map(s=>(
            <div key={s.lbl} style={{flex:1,background:C.s2,borderRadius:12,padding:"10px 6px",border:`1px solid ${C.b}`,textAlign:"center"}}>
              <div style={{fontSize:15,fontWeight:800,color:C.t}}>{s.ic} {s.val}</div>
              <div style={{fontSize:9,color:C.d,marginTop:2}}>{s.lbl}</div>
            </div>
          ))}
        </div>
        {/* Rozetler */}
        <div style={{display:"flex",justifyContent:"center",gap:6,flexWrap:"wrap",marginBottom:10}}>
          {["Güvenilir Sporcu 🏅","Maç Kurucusu 🎤","100 Eşleşme ⚡"].map(b=>(
            <span key={b} style={{fontSize:10,padding:"4px 10px",borderRadius:8,background:C.ad,color:C.at,fontWeight:600}}>{b}</span>
          ))}
        </div>
        <div style={{display:"flex",justifyContent:"center",gap:6,flexWrap:"wrap",marginBottom:12}}>
          {["Tenis","Futbol","Koşu"].map(s=><span key={s} style={sty.tag}>{s}</span>)}
        </div>
        <button style={{...sty.btn,background:C.s2,color:C.t,border:`1px solid ${C.b}`,width:200}} onClick={()=>nav("profil-edit")}>Profili Düzenle</button>
      </div>
      <div style={{display:"flex",borderBottom:`1px solid ${C.b}`}}>
        {["yaklaşan","geçmiş"].map(t=><div key={t} onClick={()=>setPtab(t)} style={{flex:1,textAlign:"center",padding:"12px 0",cursor:"pointer",borderBottom:`2px solid ${ptab===t?C.a:"transparent"}`,color:ptab===t?C.a:C.d,fontSize:14,fontWeight:600,textTransform:"capitalize"}}>{t==="yaklaşan"?"Yaklaşan":"Geçmiş"}</div>)}
      </div>
      <div style={{padding:16}}>
        {ptab==="yaklaşan" ? <>
          {myUpcoming.map((a,i)=>
            <div key={i} style={{...sty.card,margin:"0 0 10px"}} onClick={()=>a.det&&nav(a.e==="🏃"?"evt-det":a.e==="🎾"?"ders-det":"act-det", a.det)}>
              <div style={sty.cb}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:18}}>{a.e}</span>
                    <div><div style={{fontSize:13,fontWeight:600,color:C.t}}>{a.t}</div><div style={{fontSize:11,color:C.d}}>{a.d}</div></div>
                  </div>
                  <span style={{fontSize:10,padding:"3px 8px",borderRadius:6,fontWeight:600,background:stBg(a.stC),color:stColor(a.stC)}}>{a.st}</span>
                </div>
              </div>
            </div>
          )}
        </> : <>
          {myPast.map((a,i)=>
            <div key={i} style={{...sty.card,margin:"0 0 10px"}}>
              <div style={sty.cb}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:18}}>{a.e}</span>
                    <div><div style={{fontSize:13,fontWeight:600,color:C.t}}>{a.t}</div><div style={{fontSize:11,color:C.d}}>{a.d}</div></div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                    <span style={{fontSize:10,padding:"3px 8px",borderRadius:6,fontWeight:600,background:"rgba(71,85,105,0.12)",color:C.d}}>{a.st}</span>
                    {!a.rated && <span style={{fontSize:10,padding:"3px 8px",borderRadius:6,fontWeight:600,background:"rgba(245,158,11,0.15)",color:C.o}}>Puan ver ⭐</span>}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>}
      </div>
    </div><TabBar/></>
  );

  // ─── S03: Şifremi Unuttum ────────────────────────────────────────────────────
  const PageSifremiUnuttum = () => (
    <><TopBar title="Şifremi Unuttum" showBack right={<div style={{width:36}}/>}/><div style={sty.cnt}>
      <div style={{padding:"40px 24px"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontSize:36,marginBottom:12}}>🔑</div>
          <div style={{fontSize:18,fontWeight:800,color:C.t,marginBottom:8}}>Şifreni sıfırla</div>
          <div style={{fontSize:13,color:C.d,lineHeight:1.6}}>E-posta adresine şifre sıfırlama bağlantısı göndereceğiz.</div>
        </div>
        <div style={{marginBottom:20}}>
          <label style={{fontSize:12,color:C.d,marginBottom:6,display:"block"}}>E-posta adresi</label>
          <input style={sty.inp} placeholder="ornek@mail.com" type="email"/>
        </div>
        <button style={{...sty.btn,background:C.btn,color:C.bk,marginBottom:16}}>Sıfırlama Linki Gönder</button>
        <div style={{textAlign:"center"}}>
          <span style={{fontSize:13,color:C.at,cursor:"pointer",fontWeight:600}} onClick={back}>← Girişe geri dön</span>
        </div>
      </div>
    </div></>
  );

  // ─── S11: Başvuru Yönetimi ───────────────────────────────────────────────────
  const PageBasvuruYonetimi = () => {
    const a = det;
    const apps = [
      {name:"Can D.",av:"CD",level:"Orta",sport:"Futbol"},
      {name:"Mert Y.",av:"MY",level:"İyi",sport:"Futbol"},
      {name:"Zeynep A.",av:"ZA",level:"Başlangıç",sport:"Futbol"},
    ];
    return (
    <><TopBar title="Başvuru Yönetimi" showBack/><div style={sty.cnt}>
      <div style={{padding:"14px 20px",borderBottom:`1px solid ${C.b}`,background:C.s2}}>
        <div style={{fontSize:14,fontWeight:700,color:C.t}}>{a?.title||"Halısaha Maçı"}</div>
        <div style={{fontSize:12,color:C.d,marginTop:2}}>{apps.length} bekleyen başvuru</div>
      </div>
      {apps.map((ap,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 20px",borderBottom:`1px solid ${C.b}`}}>
          <div style={{cursor:"pointer"}} onClick={()=>nav("kullanici-profil",users[ap.name]||{name:ap.name,av:ap.av,sport:ap.sport,city:"İstanbul",scores:{sp:4.0,kg:80,org:null},badges:[],acts:3})}>
            <Av name={ap.name}/>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:600,color:C.t}}>{ap.name}</div>
            <div style={{fontSize:12,color:C.d}}>Seviye: {ap.level}</div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button style={{padding:"8px 14px",borderRadius:8,border:"none",background:"rgba(34,197,94,0.12)",color:C.g,fontSize:12,fontWeight:700,cursor:"pointer"}}>✓ Onayla</button>
            <button style={{padding:"8px 14px",borderRadius:8,border:"none",background:"rgba(239,68,68,0.12)",color:C.r,fontSize:12,fontWeight:700,cursor:"pointer"}}>✕ Reddet</button>
          </div>
        </div>
      ))}
      {apps.length===0&&<div style={{padding:40,textAlign:"center",color:C.d}}>
        <div style={{fontSize:32,marginBottom:8}}>✅</div>
        <div style={{fontSize:14,fontWeight:600,color:C.t}}>Tüm başvurular işlendi</div>
      </div>}
    </div></>
  );};

  const PageLogin = () => (
    <><TopBar title="" showBack right={<div style={{width:36}}/>}/><div style={sty.cnt}>
      <div style={{padding:"40px 24px"}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <div style={{fontSize:32,fontWeight:800,marginBottom:4,fontFamily:"'Plus Jakarta Sans',-apple-system,sans-serif",letterSpacing:-0.5}}><span style={{color:C.t}}>Spor</span><span style={{color:C.a}}>wave</span></div>
          <div style={{fontSize:14,color:C.d}}>Spor arkadaşını bul, harekete geç!</div>
        </div>
        <div style={{marginBottom:14}}><input style={sty.inp} placeholder="E-posta adresi"/></div>
        <div style={{marginBottom:20}}><input style={sty.inp} type="password" placeholder="Şifre"/></div>
        <button style={{...sty.btn,background:C.btn,color:C.bk,marginBottom:12}} onClick={()=>{setLogged(true);back();}}>Giriş Yap</button>
        <div style={{textAlign:"center",marginBottom:20}}><span style={{fontSize:13,color:C.at,cursor:"pointer",fontWeight:500}} onClick={()=>nav("sifremi-unuttum")}>Şifremi Unuttum</span></div>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
          <div style={{flex:1,height:1,background:C.b}}/><span style={{fontSize:12,color:C.d}}>veya</span><div style={{flex:1,height:1,background:C.b}}/>
        </div>
        <button style={{...sty.btn,background:C.s2,color:C.t,border:`1px solid ${C.b}`,marginBottom:10}} onClick={()=>{setLogged(true);back();}}>Google ile giriş yap</button>
        <button style={{...sty.btn,background:C.s2,color:C.t,border:`1px solid ${C.b}`}} onClick={()=>{setLogged(true);back();}}>🍎 Apple ile giriş yap</button>
        <div style={{textAlign:"center",marginTop:20}}>
          <span style={{fontSize:13,color:C.d}}>Hesabın yok mu? </span>
          <span style={{fontSize:13,color:C.at,cursor:"pointer",fontWeight:600}} onClick={()=>nav("register")}>Kayıt Ol</span>
        </div>
      </div>
    </div></>
  );

  const PageRegister = () => (
    <><TopBar title="Kayıt Ol" showBack right={<div style={{width:36}}/>}/><div style={sty.cnt}>
      <div style={{padding:"30px 24px"}}>
        {["E-posta adresi","Şifre","Şifre tekrar"].map((p,i)=><div key={i} style={{marginBottom:14}}><input style={sty.inp} placeholder={p} type={i>0?"password":"text"}/></div>)}
        <div style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:20}}>
          <div style={{width:20,height:20,borderRadius:4,border:`2px solid ${C.a}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2,cursor:"pointer"}}>
            <span style={{color:C.a,fontSize:12}}>✓</span>
          </div>
          <span style={{fontSize:12,color:C.d,lineHeight:1.5}}>Kullanım şartlarını ve KVKK aydınlatma metnini okudum, kabul ediyorum.</span>
        </div>
        <button style={{...sty.btn,background:C.btn,color:C.bk}} onClick={()=>{setLogged(true);nav("onboard");}}>Kayıt Ol</button>
      </div>
    </div></>
  );

  const PageOnboard = () => {
    const [selCity, setSelCity] = useState("İstanbul");
    const [rulesAccepted, setRulesAccepted] = useState(false);
    const cities = ["İstanbul","Ankara","İzmir","Antalya","Bursa","Adana"];
    const steps=[
      {t:"Seni tanıyalım",c:<>
        <div style={{marginBottom:14}}><input style={sty.inp} placeholder="İsim"/></div>
        <div style={{marginBottom:14}}><input style={sty.inp} placeholder="Soyisim"/></div>
        <div style={{marginBottom:14}}><label style={{fontSize:12,color:C.d,marginBottom:6,display:"block"}}>Doğum Tarihi</label><input style={sty.inp} type="date"/></div>
      </>},
      {t:"Profil fotoğrafı",c:<div style={{textAlign:"center"}}>
        <div style={{width:120,height:120,borderRadius:"50%",border:`2px dashed ${C.b}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",color:C.d,cursor:"pointer"}}>
          <div><div style={{fontSize:32,marginBottom:4}}>📷</div><div style={{fontSize:12}}>Fotoğraf Ekle</div></div>
        </div>
        <div style={{fontSize:13,color:C.d}}>Daha sonra da ekleyebilirsiniz</div>
      </div>},
      {t:"Favori sporların",c:<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
        {favSports.map(sp=><div key={sp} style={{background:C.s2,border:`1px solid ${C.b}`,borderRadius:10,padding:"12px 6px",textAlign:"center",cursor:"pointer",fontSize:11,fontWeight:500,color:C.t}}>{sp}</div>)}
      </div>},
      {t:"Son adım",c:<>
        <div style={{marginBottom:20}}>
          <label style={{fontSize:12,color:C.d,marginBottom:8,display:"block"}}>Şehrini seç</label>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {cities.map(c=>(
              <div key={c} onClick={()=>setSelCity(c)} style={{background:selCity===c?C.ad:C.s2,border:`1px solid ${selCity===c?C.a:C.b}`,borderRadius:10,padding:"12px 10px",textAlign:"center",cursor:"pointer",fontSize:13,fontWeight:selCity===c?700:500,color:selCity===c?C.at:C.t}}>
                📍 {c}
              </div>
            ))}
          </div>
        </div>
        <div style={{background:C.s,border:`1px solid ${C.b}`,borderRadius:14,padding:16,marginBottom:16}}>
          <div style={{fontSize:14,fontWeight:700,color:C.t,marginBottom:10}}>📋 Topluluk Kuralları</div>
          <div style={{fontSize:12,color:C.d,lineHeight:1.6,marginBottom:12,maxHeight:120,overflowY:"auto"}}>
            • No-show yasağı: Katılacağını belirtip gelmemek yasaktır.<br/>
            • Saygılı iletişim: Hakaret ve taciz yasaktır.<br/>
            • Fake profil yasağı: Sahte kimlik kullanmak yasaktır.<br/>
            • Uygunsuz içerik yasağı: Müstehcen paylaşımlar yasaktır.
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center",cursor:"pointer"}} onClick={()=>setRulesAccepted(!rulesAccepted)}>
            <div style={{width:22,height:22,borderRadius:6,border:`2px solid ${rulesAccepted?C.a:C.b}`,background:rulesAccepted?C.a:C.s,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              {rulesAccepted && <span style={{color:C.bk,fontSize:14,fontWeight:700}}>✓</span>}
            </div>
            <span style={{fontSize:13,color:C.t}}>Topluluk Kurallarını okudum ve kabul ediyorum</span>
          </div>
        </div>
      </>},
    ];
    return (
    <><div style={sty.topB}><div/><div style={{fontSize:13,color:C.d}}>{obStep+1}/{steps.length}</div><div/></div><div style={sty.cnt}>
      <div style={{padding:"30px 24px"}}>
        <div style={{display:"flex",gap:4,marginBottom:30}}>{steps.map((_,i)=><div key={i} style={{flex:1,height:3,borderRadius:2,background:i<=obStep?C.a:C.b}}/>)}</div>
        <div style={{fontSize:22,fontWeight:800,color:C.t,marginBottom:24}}>{steps[obStep].t}</div>
        {steps[obStep].c}
        <button 
          style={{...sty.btn,background:(obStep===3 && !rulesAccepted)?C.dis:C.btn,color:(obStep===3 && !rulesAccepted)?C.d2:C.bk,marginTop:30,cursor:(obStep===3 && !rulesAccepted)?"not-allowed":"pointer"}} 
          onClick={()=>{
            if(obStep===3 && !rulesAccepted) return;
            if(obStep<steps.length-1)setObStep(obStep+1);else{setObStep(0);nav("kesfet");}
          }}>
          {obStep<steps.length-1?"Devam":"Başla! 🚀"}
        </button>
      </div>
    </div></>
  );};

  const PageMesajlar = () => (
    <><TopBar title="Mesajlar" showBack/><div style={sty.cnt}>
      {msgs.map(m=>(
        <div key={m.id} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 20px",borderBottom:`1px solid ${C.b}`,cursor:"pointer"}} onClick={()=>nav("sohbet",m)}>
          <div onClick={e=>{e.stopPropagation();nav("kullanici-profil",users[m.name]||{name:m.name,av:m.av,sport:"Sporcu",city:"İstanbul",scores:{sp:4.0,kg:80,org:null},badges:[],acts:3});}}>
            <Av name={m.name}/>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
              <span style={{fontSize:14,fontWeight:600,color:C.t}}>{m.name}</span>
              <span style={{fontSize:11,color:C.d}}>{m.time}</span>
            </div>
            <div style={{fontSize:13,color:C.d,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.last}</div>
          </div>
          {m.unread>0&&<div style={{width:20,height:20,borderRadius:"50%",background:C.a,color:C.bk,fontSize:11,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{m.unread}</div>}
        </div>
      ))}
    </div></>
  );

  const PageSohbet = () => {
    const tgt = det;
    const tgtUser = users[tgt?.name] || {name:tgt?.name||"?",av:tgt?.av||"?",sport:"Sporcu",city:"İstanbul",scores:{sp:4.0,kg:80,org:null},badges:[],acts:3};
    const sm = [
      {f:"o",t:"Selam! Halısaha maçı için müsait misin?",h:"14:20"},
      {f:"m",t:"Evet, saat 7'de orada olurum",h:"14:25"},
      {f:"o",t:tgt?.last||"Görüşürüz!",h:"14:32"},
    ];
    return (
    <><TopBar title={tgt?.name||"Sohbet"} showBack right={
      <div style={{...sty.ic,cursor:"pointer"}} onClick={()=>nav("kullanici-profil",tgtUser)}>
        <Av name={tgt?.name||"?"} size={28}/>
      </div>
    }/>
      <div style={{...sty.cnt,display:"flex",flexDirection:"column"}}>
        <div style={{flex:1,padding:16,display:"flex",flexDirection:"column",gap:10,justifyContent:"flex-end"}}>
          {sm.map((m,i)=>(
            <div key={i} style={{display:"flex",justifyContent:m.f==="m"?"flex-end":"flex-start",alignItems:"flex-end",gap:8}}>
              {/* Karşı tarafın avatarı — sadece gelen mesajlarda */}
              {m.f==="o" && (
                <div style={{cursor:"pointer",flexShrink:0}} onClick={()=>nav("kullanici-profil",tgtUser)}>
                  <Av name={tgt?.name||"?"} size={28}/>
                </div>
              )}
              <div style={{maxWidth:"72%",padding:"10px 14px",borderRadius:m.f==="m"?"14px 14px 4px 14px":"14px 14px 14px 4px",background:m.f==="m"?C.a:C.s,color:m.f==="m"?C.bk:C.t,fontSize:14,border:m.f==="o"?`1px solid ${C.b}`:"none"}}>
                <div>{m.t}</div>
                <div style={{fontSize:10,marginTop:4,opacity:.6,textAlign:"right"}}>{m.h}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{padding:"10px 16px",borderTop:`1px solid ${C.b}`,display:"flex",gap:10,alignItems:"center",background:C.s}}>
          <input style={{...sty.inp,flex:1}} placeholder="Mesaj yaz..." value={mt} onChange={e=>setMt(e.target.value)}/>
          <div style={{...sty.ic,color:C.a}}>{Ico.send}</div>
        </div>
      </div>
    </>
  );};

  const PageBildirimler = () => (
    <><TopBar title="Bildirimler" showBack/><div style={sty.cnt}>
      {notifs.map(n=>(
        <div key={n.id} style={{padding:"14px 20px",borderBottom:`1px solid ${C.b}`,display:"flex",gap:12,alignItems:"flex-start",cursor:n.linkPg?"pointer":"default"}}
          onClick={()=>n.linkPg&&nav(n.linkPg,n.linkDet)}>
          <div style={{width:36,height:36,borderRadius:10,background:n.t==="ok"?"rgba(34,197,94,0.15)":n.t==="inv"?"rgba(59,130,246,0.12)":"rgba(59,130,246,0.1)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:16}}>
            {n.t==="ok"?"✓":n.t==="inv"?"👤":"🔔"}
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:13,color:C.t,lineHeight:1.5}}>{n.txt}</div>
            <div style={{fontSize:11,color:C.d,marginTop:4}}>{n.time}</div>
            {n.linkPg&&<div style={{fontSize:11,color:C.at,fontWeight:600,marginTop:4}}>Detaya git →</div>}
          </div>
        </div>
      ))}
    </div></>
  );

  // S22: Arkadaşlarım — 3 sekme
  const PageArkadaslarim = () => {
    // friendships'ten filtrelenmiş listeler
    const friendList  = Object.entries(friendships).filter(([,s])=>s==="friends").map(([n])=>users[n]||{name:n,av:n.split(" ").map(x=>x[0]).join(""),sport:"Spor",city:"İstanbul",scores:{sp:4.0,kg:80,org:null},badges:[],acts:3});
    const receivedList= Object.entries(friendships).filter(([,s])=>s==="received").map(([n])=>users[n]||{name:n,av:n.split(" ").map(x=>x[0]).join(""),sport:"Spor",city:"İstanbul",scores:{sp:4.0,kg:80,org:null},badges:[],acts:3});
    const sentList    = Object.entries(friendships).filter(([,s])=>s==="sent").map(([n])=>users[n]||{name:n,av:n.split(" ").map(x=>x[0]).join(""),sport:"Spor",city:"İstanbul",scores:{sp:4.0,kg:80,org:null},badges:[],acts:3});
    const tabs = [{id:"arkadaşlar",l:`Arkadaşlar (${friendList.length})`},{id:"gelen",l:`Gelen (${receivedList.length})`},{id:"gönderilen",l:`Gönderilen (${sentList.length})`}];
    return (
    <><TopBar title="Arkadaşlarım" showBack/><div style={sty.cnt}>
      {/* Sekme çubuğu */}
      <div style={{display:"flex",borderBottom:`1px solid ${C.b}`}}>
        {tabs.map(t=>(
          <div key={t.id} onClick={()=>setArTab(t.id)} style={{flex:1,textAlign:"center",padding:"11px 4px",cursor:"pointer",borderBottom:`2px solid ${arTab===t.id?C.a:"transparent"}`,color:arTab===t.id?C.a:C.d,fontSize:11,fontWeight:600}}>
            {t.l}
          </div>
        ))}
      </div>
      {/* Arama */}
      <div style={{padding:"12px 16px 0"}}><input style={sty.inp} placeholder="Ara..."/></div>

      {/* Arkadaşlar listesi */}
      {arTab==="arkadaşlar" && <>
        {friendList.length===0 && <div style={{padding:40,textAlign:"center",color:C.d,fontSize:13}}>Henüz arkadaşın yok</div>}
        {friendList.map((f,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 20px",borderBottom:`1px solid ${C.b}`,cursor:"pointer"}} onClick={()=>nav("kullanici-profil",f)}>
            <Av name={f.name}/>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:600,color:C.t}}>{f.name}</div>
              <div style={{fontSize:12,color:C.d}}>{f.sport}</div>
            </div>
            <div style={{...sty.ic,color:C.a,border:`1px solid ${C.b}`,borderRadius:10}} onClick={e=>{e.stopPropagation();nav("sohbet",{name:f.name,av:f.av,last:""});}}>{Ico.msg}</div>
          </div>
        ))}
      </>}

      {/* Gelen istekler */}
      {arTab==="gelen" && <>
        {receivedList.length===0 && <div style={{padding:40,textAlign:"center",color:C.d,fontSize:13}}>Gelen istek yok</div>}
        {receivedList.map((f,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 20px",borderBottom:`1px solid ${C.b}`}}>
            <div style={{cursor:"pointer"}} onClick={()=>nav("kullanici-profil",f)}><Av name={f.name}/></div>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:600,color:C.t}}>{f.name}</div>
              <div style={{fontSize:12,color:C.d}}>{f.sport}</div>
            </div>
            <div style={{display:"flex",gap:6}}>
              <button style={{padding:"7px 12px",borderRadius:8,border:"none",background:C.g,color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}} onClick={()=>setFriendships(p=>({...p,[f.name]:"friends"}))}>✓ Kabul</button>
              <button style={{padding:"7px 10px",borderRadius:8,border:`1px solid ${C.b}`,background:C.s2,color:C.r,fontSize:12,fontWeight:600,cursor:"pointer"}} onClick={()=>setFriendships(p=>({...p,[f.name]:"none"}))}>Reddet</button>
            </div>
          </div>
        ))}
      </>}

      {/* Gönderilen istekler */}
      {arTab==="gönderilen" && <>
        {sentList.length===0 && <div style={{padding:40,textAlign:"center",color:C.d,fontSize:13}}>Gönderilen istek yok</div>}
        {sentList.map((f,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 20px",borderBottom:`1px solid ${C.b}`}}>
            <div style={{cursor:"pointer"}} onClick={()=>nav("kullanici-profil",f)}><Av name={f.name}/></div>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:600,color:C.t}}>{f.name}</div>
              <div style={{fontSize:12,color:C.d}}>{f.sport}</div>
            </div>
            <button style={{padding:"7px 12px",borderRadius:8,border:`1px solid ${C.b}`,background:C.s2,color:C.d2,fontSize:12,fontWeight:600,cursor:"pointer"}} onClick={()=>setFriendships(p=>({...p,[f.name]:"none"}))}>İptal</button>
          </div>
        ))}
      </>}
    </div></>
  );};

  const PageKullaniciProfil = () => {
    const u = det || {name:"Kullanıcı",av:"KK",sport:"Spor",city:"İstanbul",scores:{sp:4.0,kg:80,org:null},badges:[],acts:3};
    const fs = friendships[u.name] || "none"; // "none"|"sent"|"received"|"friends"
    const doAdd    = () => { if(!logged){reqLog();return;} setFriendships(p=>({...p,[u.name]:"sent"})); };
    const doCancel = () => setFriendships(p=>({...p,[u.name]:"none"}));
    const doAccept = () => setFriendships(p=>({...p,[u.name]:"friends"}));
    const doReject = () => setFriendships(p=>({...p,[u.name]:"none"}));
    // Demo aktivite listesi
    const uActs = [
      {e:"⚽",t:"Halısaha Maçı",d:"28 Şub 19:00",st:"Yaklaşan",stC:"g"},
      {e:"🎾",t:"Tenis Kort Arkadaşı",d:"5 Mar 19:00",st:"Yaklaşan",stC:"g"},
    ];
    const uPast = [
      {e:"🏀",t:"3v3 Basketbol",d:"10 Şub 18:00",st:"Tamamlandı",stC:"d"},
      {e:"🧘",t:"Sabah Yoga",d:"18 Şub 08:00",st:"Tamamlandı",stC:"d"},
    ];
    return (
    <><TopBar title="Profil" showBack right={
      <div style={sty.ic} onClick={()=>nav("raporla",u)}>⋮</div>
    }/><div style={sty.cnt}>
      {/* ── Profil başlık ── */}
      <div style={{padding:20,display:"flex",flexDirection:"column",alignItems:"center"}}>
        <Av name={u.name} size={80} bg={`linear-gradient(135deg,${C.a},${C.bl})`}/>
        <div style={{fontSize:20,fontWeight:800,color:C.t,marginTop:12}}>{u.name}</div>
        {fs==="friends" && <div style={{fontSize:11,color:C.g,fontWeight:600,marginTop:2}}>✓ Arkadaşsın</div>}
        <div style={{fontSize:13,color:C.d,marginBottom:14,marginTop:4}}>{u.city} · {u.sport}</div>
        {/* Skor kartları */}
        <div style={{display:"flex",gap:6,marginBottom:10,width:"100%"}}>
          <div style={{flex:1,background:C.s2,borderRadius:12,padding:"10px 6px",border:`1px solid ${C.b}`,textAlign:"center"}}>
            <div style={{fontSize:15,fontWeight:800,color:C.t}}>⭐ {u.scores.sp}</div>
            <div style={{fontSize:9,color:C.d,marginTop:2}}>Sportmenlik</div>
          </div>
          <div style={{flex:1,background:C.s2,borderRadius:12,padding:"10px 6px",border:`1px solid ${C.b}`,textAlign:"center"}}>
            <div style={{fontSize:15,fontWeight:800,color:C.t}}>📍 %{u.scores.kg}</div>
            <div style={{fontSize:9,color:C.d,marginTop:2}}>Katılım Güveni</div>
          </div>
          {u.scores.org&&<div style={{flex:1,background:C.s2,borderRadius:12,padding:"10px 6px",border:`1px solid ${C.b}`,textAlign:"center"}}>
            <div style={{fontSize:15,fontWeight:800,color:C.t}}>🎤 {u.scores.org}</div>
            <div style={{fontSize:9,color:C.d,marginTop:2}}>Organizasyon</div>
          </div>}
        </div>
        {/* Rozetler */}
        {u.badges.length>0&&<div style={{display:"flex",justifyContent:"center",gap:6,flexWrap:"wrap",marginBottom:10}}>
          {u.badges.map(b=><span key={b} style={{fontSize:10,padding:"4px 10px",borderRadius:8,background:C.ad,color:C.at,fontWeight:600}}>{b}</span>)}
        </div>}
        <div style={{fontSize:12,color:C.d,marginBottom:16}}>{u.acts} aktivite tamamlandı</div>

        {/* ── Arkadaşlık CTA — 4 durum ── */}
        <div style={{width:"100%",display:"flex",flexDirection:"column",gap:8,marginBottom:4}}>
          {fs==="none" && (
            <button style={{...sty.btn,background:C.btn,color:C.bk,fontWeight:700}} onClick={doAdd}>
              + Arkadaş Ekle
            </button>
          )}
          {fs==="sent" && (
            <button style={{...sty.btn,background:C.s2,color:C.d2,border:`1px solid ${C.b}`}} onClick={doCancel}>
              🕐 İstek Gönderildi — İptal Et
            </button>
          )}
          {fs==="received" && (
            <div style={{display:"flex",gap:8}}>
              <button style={{...sty.btn,flex:1,background:C.g,color:"#fff",fontWeight:700}} onClick={doAccept}>✓ Kabul Et</button>
              <button style={{...sty.btn,flex:1,background:"rgba(239,68,68,0.1)",color:C.r,border:`1px solid rgba(239,68,68,0.3)`}} onClick={doReject}>Reddet</button>
            </div>
          )}
          {/* Mesaj Gönder: arkadaşsak birincil, değilsek ikincil */}
          <button
            style={{...sty.btn,background:fs==="friends"?C.btn:C.s2,color:fs==="friends"?C.bk:C.t,...(fs!=="friends"?{border:`1px solid ${C.b}`}:{})}}
            onClick={()=>nav("sohbet",{name:u.name,av:u.av,last:""})}>
            💬 Mesaj Gönder
          </button>
        </div>
      </div>

      {/* ── Aktiviteler tabları ── */}
      <div style={{display:"flex",borderTop:`1px solid ${C.b}`,borderBottom:`1px solid ${C.b}`}}>
        {["yaklaşan","geçmiş"].map(t=>(
          <div key={t} onClick={()=>setUpTab(t)} style={{flex:1,textAlign:"center",padding:"12px 0",cursor:"pointer",borderBottom:`2px solid ${upTab===t?C.a:"transparent"}`,color:upTab===t?C.a:C.d,fontSize:13,fontWeight:600}}>
            {t==="yaklaşan"?"Yaklaşan":"Geçmiş"}
          </div>
        ))}
      </div>
      <div style={{padding:16}}>
        {(upTab==="yaklaşan" ? uActs : uPast).map((a,i)=>(
          <div key={i} style={{...sty.card,margin:"0 0 10px"}}>
            <div style={sty.cb}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:18}}>{a.e}</span>
                  <div><div style={{fontSize:13,fontWeight:600,color:C.t}}>{a.t}</div><div style={{fontSize:11,color:C.d}}>{a.d}</div></div>
                </div>
                <span style={{fontSize:10,padding:"3px 8px",borderRadius:6,fontWeight:600,background:stBg(a.stC),color:stColor(a.stC)}}>{a.st}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div></>
  );};

  // ─── S31: Raporla & Engelle ──────────────────────────────────────────────────
  const PageRaporla = () => (
    <><TopBar title="Raporla" showBack/><div style={sty.cnt}>
      <div style={{padding:20}}>
        <div style={{fontSize:13,color:C.d,lineHeight:1.6,marginBottom:20}}>
          Bu kullanıcı veya içerik hakkında bir sorun bildirin. Raporlar gizli tutulur, ekibimiz 24 saat içinde inceler.
        </div>
        <div style={{fontSize:14,fontWeight:700,color:C.t,marginBottom:12}}>Rapor nedeni seç</div>
        {["Fake profil","Uygunsuz içerik","Gelmiyor / No-show","Spam","Diğer"].map(r=>(
          <div key={r} style={{background:C.s,border:`1px solid ${C.b}`,borderRadius:12,padding:"14px 16px",marginBottom:8,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
            <span style={{fontSize:14,color:C.t}}>{r}</span>
            <span style={{color:C.d}}>{Ico.chr}</span>
          </div>
        ))}
        <div style={{marginTop:12}}>
          <label style={{fontSize:12,color:C.d,marginBottom:6,display:"block"}}>Açıklama (opsiyonel)</label>
          <textarea style={{...sty.inp,height:80,resize:"none"}} placeholder="Ek bilgi ekleyebilirsiniz..."/>
        </div>
        <button style={{...sty.btn,background:C.r,color:C.w,marginTop:16}}>Rapor Gönder</button>
        <div style={{marginTop:12,padding:14,background:"rgba(239,68,68,0.06)",borderRadius:10,border:`1px solid rgba(239,68,68,0.15)`}}>
          <div style={{fontSize:13,fontWeight:600,color:C.r,marginBottom:4}}>Engelle</div>
          <div style={{fontSize:12,color:C.d,marginBottom:10}}>Bu kullanıcıyı engellerseniz sizi göremez, mesaj gönderemez.</div>
          <button style={{...sty.btn,background:"rgba(239,68,68,0.1)",color:C.r,border:`1px solid rgba(239,68,68,0.2)`,padding:"10px"}}>
            Kullanıcıyı Engelle
          </button>
        </div>
      </div>
    </div></>
  );

  // ─── S32: Topluluk Kuralları ──────────────────────────────────────────────────
  const PageToplulukKurallari = () => (
    <><TopBar title="Topluluk Kuralları" showBack/><div style={sty.cnt}>
      <div style={{padding:20}}>
        {[
          {ic:"⛔",t:"No-Show Yasağı",d:"Katılacağını belirtip gelmemek topluluğu olumsuz etkiler. 3 no-show sonrası hesabın askıya alınabilir."},
          {ic:"🤝",t:"Saygılı İletişim",d:"Tüm mesajlaşmalarda saygılı bir dil kullan. Hakaret, taciz ve ayrımcılık yasaktır."},
          {ic:"🚫",t:"Fake Profil Yasağı",d:"Sahte kimlik veya yanıltıcı bilgi içeren profiller kalıcı olarak kapatılır."},
          {ic:"🔞",t:"Uygunsuz İçerik Yasağı",d:"Müstehcen, şiddet içerikli veya yasadışı paylaşımlar kesinlikle yasaktır."},
          {ic:"🚩",t:"Bildirme Yükümlülüğü",d:"Kural ihlali gördüğünde profil veya içerik üzerindeki ⋮ menüden raporla."},
        ].map(r=>(
          <div key={r.t} style={{background:C.s,border:`1px solid ${C.b}`,borderRadius:14,padding:16,marginBottom:10,boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
            <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
              <div style={{fontSize:24,flexShrink:0}}>{r.ic}</div>
              <div>
                <div style={{fontSize:14,fontWeight:700,color:C.t,marginBottom:4}}>{r.t}</div>
                <div style={{fontSize:13,color:C.d,lineHeight:1.5}}>{r.d}</div>
              </div>
            </div>
          </div>
        ))}
        <div style={{textAlign:"center",padding:16,background:C.ad,borderRadius:12,border:`1px solid rgba(183,240,0,0.3)`}}>
          <div style={{fontSize:12,color:C.at,fontWeight:600,lineHeight:1.5}}>Sporwave güvenli ve keyifli bir spor topluluğu olmayı hedefler. Birlikte güzel bir topluluk inşa edelim! 🏃</div>
        </div>
      </div>
    </div></>
  );

  // ─── S33: Etkinlik Sonrası Puanlama ──────────────────────────────────────────
  const StarPicker = ({val,onChange}) => (
    <div style={{display:"flex",gap:2}}>
      {[1,2,3,4,5].map(s=>(
        <div key={s} onClick={()=>onChange(s)} style={{cursor:"pointer",fontSize:26,color:s<=val?"#F59E0B":"#CBD5E1",lineHeight:1}}>★</div>
      ))}
    </div>
  );

  // ─── S27: Splash Screen ─────────────────────────────────────────────────────
  const PageSplash = () => {
    // Auto-navigate after 2 seconds
    useEffect(()=>{
      const timer = setTimeout(()=>nav("kesfet"), 2000);
      return ()=>clearTimeout(timer);
    }, []);
    return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:`linear-gradient(180deg,${C.bg} 0%,${C.s2} 100%)`}}>
      <div style={{marginBottom:24}}>
        <LogoSvg/>
      </div>
      <div style={{fontSize:32,fontWeight:800,letterSpacing:-0.5,fontFamily:"'Plus Jakarta Sans',-apple-system,sans-serif",marginBottom:8}}>
        <span style={{color:C.t}}>Spor</span><span style={{color:C.a}}>wave</span>
      </div>
      <div style={{fontSize:14,color:C.d,marginBottom:40}}>Spor arkadaşını bul, harekete geç!</div>
      {/* Loading animation */}
      <div style={{display:"flex",gap:6}}>
        {[0,1,2].map(i=>(
          <div key={i} style={{width:8,height:8,borderRadius:"50%",background:C.a,opacity:0.4+i*0.2,animation:`pulse 1.2s ease-in-out ${i*0.2}s infinite`}}/>
        ))}
      </div>
      <style>{`@keyframes pulse{0%,100%{transform:scale(1);opacity:0.4}50%{transform:scale(1.2);opacity:1}}`}</style>
    </div>
  );};

  // ─── S29: Kullanıcı Doğrulama Akışı ───────────────────────────────────────────
  const PageDogrulama = () => {
    const [step, setStep] = useState(0);
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    return (
    <><TopBar title="Hesabını Doğrula" showBack/><div style={sty.cnt}>
      <div style={{padding:20}}>
        {/* Progress */}
        <div style={{display:"flex",gap:4,marginBottom:24}}>
          {[0,1].map(i=><div key={i} style={{flex:1,height:3,borderRadius:2,background:i<=step?C.a:C.b}}/>)}
        </div>

        {step===0 && <>
          <div style={{textAlign:"center",marginBottom:24}}>
            <div style={{fontSize:48,marginBottom:12}}>📱</div>
            <div style={{fontSize:20,fontWeight:800,color:C.t,marginBottom:6}}>Telefon Doğrulama</div>
            <div style={{fontSize:13,color:C.d,lineHeight:1.6}}>Güvenliğin için telefon numaranı doğrula.<br/>Profilinde "Doğrulanmış ✓" rozeti görünecek.</div>
          </div>
          <div style={{marginBottom:20}}>
            <label style={{fontSize:12,color:C.d,marginBottom:6,display:"block"}}>Telefon Numarası</label>
            <div style={{display:"flex",gap:8}}>
              <div style={{...sty.inp,width:70,textAlign:"center",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>🇹🇷 +90</div>
              <input style={sty.inp} placeholder="5XX XXX XX XX" value={phone} onChange={e=>setPhone(e.target.value)} type="tel"/>
            </div>
          </div>
          <button 
            style={{...sty.btn,background:phone.length>=10?C.btn:C.dis,color:phone.length>=10?C.bk:C.d2,cursor:phone.length>=10?"pointer":"not-allowed"}} 
            onClick={()=>{if(phone.length>=10)setStep(1);}}>
            SMS Kodu Gönder
          </button>
        </>}

        {step===1 && <>
          <div style={{textAlign:"center",marginBottom:24}}>
            <div style={{fontSize:48,marginBottom:12}}>✉️</div>
            <div style={{fontSize:20,fontWeight:800,color:C.t,marginBottom:6}}>Kodu Gir</div>
            <div style={{fontSize:13,color:C.d,lineHeight:1.6}}>+90 {phone} numarasına gönderilen<br/>6 haneli doğrulama kodunu gir.</div>
          </div>
          <div style={{marginBottom:20}}>
            <label style={{fontSize:12,color:C.d,marginBottom:6,display:"block"}}>Doğrulama Kodu</label>
            <div style={{display:"flex",gap:8,justifyContent:"center"}}>
              {[0,1,2,3,4,5].map(i=>(
                <input key={i} style={{...sty.inp,width:42,height:50,textAlign:"center",fontSize:20,fontWeight:700,padding:0}} maxLength={1} 
                  value={otp[i]||""} 
                  onChange={e=>{
                    const val = e.target.value;
                    if(/^\d*$/.test(val)){
                      const newOtp = otp.split("");
                      newOtp[i] = val;
                      setOtp(newOtp.join(""));
                      if(val && i<5) e.target.nextElementSibling?.focus();
                    }
                  }}/>
              ))}
            </div>
          </div>
          <button 
            style={{...sty.btn,background:otp.length===6?C.g:C.dis,color:otp.length===6?"#fff":C.d2,cursor:otp.length===6?"pointer":"not-allowed",marginBottom:12}} 
            onClick={()=>{if(otp.length===6){setVerified(true);nav("profil");}}}>
            ✓ Doğrula
          </button>
          <div style={{textAlign:"center"}}>
            <span style={{fontSize:12,color:C.d}}>Kod gelmedi mi? </span>
            <span style={{fontSize:12,color:C.at,fontWeight:600,cursor:"pointer"}}>Tekrar Gönder</span>
          </div>
        </>}

        {/* Avantajlar */}
        <div style={{marginTop:30,padding:16,background:C.s2,borderRadius:14,border:`1px solid ${C.b}`}}>
          <div style={{fontSize:13,fontWeight:700,color:C.t,marginBottom:10}}>Doğrulanmış hesap avantajları:</div>
          {[
            "✅ Profilinde \"Doğrulanmış\" rozeti",
            "🛡️ Toplulukta daha fazla güven",
            "⭐ Aktivitelerde öne çıkma"
          ].map(a=>(
            <div key={a} style={{fontSize:12,color:C.d,marginBottom:6}}>{a}</div>
          ))}
        </div>
      </div>
    </div></>
  );};

  const PageRating = () => {
    const activity = det||acts[0];
    const participants=[{name:"Can D.",av:"CD"},{name:"Mert Y.",av:"MY"},{name:"Zeynep A.",av:"ZA"}];
    return (
    <><TopBar title={`Değerlendirme ${rStep+1}/3`} showBack/><div style={sty.cnt}>
      <div style={{padding:20}}>
        {/* Progress bar */}
        <div style={{display:"flex",gap:4,marginBottom:24}}>
          {[0,1,2].map(i=><div key={i} style={{flex:1,height:3,borderRadius:2,background:i<=rStep?C.a:C.b}}/>)}
        </div>

        {rStep===0&&<>
          <div style={{fontSize:20,fontWeight:800,color:C.t,marginBottom:6}}>Etkinliğe katıldın mı?</div>
          <div style={{fontSize:13,color:C.d,marginBottom:24,lineHeight:1.5}}>{activity.title} · {activity.date||""}</div>
          <button style={{...sty.btn,background:C.g,color:C.w,marginBottom:12}} onClick={()=>setRStep(1)}>✓ Evet, katıldım</button>
          <button style={{...sty.btn,background:C.s2,color:C.t,border:`1px solid ${C.b}`}} onClick={()=>{setRStep(0);setRStars({});setROrgStar(0);nav("kesfet");}}>Hayır, gidemedim</button>
          <div style={{marginTop:20,padding:14,background:C.s2,borderRadius:12,border:`1px solid ${C.b}`}}>
            <div style={{fontSize:12,fontWeight:600,color:C.t,marginBottom:4}}>Organizatör: Gelmeyen var mıydı?</div>
            <div style={{fontSize:12,color:C.d,marginBottom:10}}>No-show katılımcıları işaretleyebilirsin</div>
            {participants.map((p,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                <div style={{width:16,height:16,borderRadius:4,border:`2px solid ${C.b}`,background:C.s,flexShrink:0}}/>
                <Av name={p.name} size={24}/>
                <span style={{fontSize:13,color:C.t}}>{p.name}</span>
              </div>
            ))}
          </div>
        </>}

        {rStep===1&&<>
          <div style={{fontSize:18,fontWeight:800,color:C.t,marginBottom:4}}>Oyuncuları değerlendir</div>
          <div style={{fontSize:12,color:C.d,marginBottom:20}}>Puanlar anonim tutulur — kimse kimin ne puan verdiğini göremez</div>
          {participants.map((p,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 0",borderBottom:`1px solid ${C.b}`}}>
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                <Av name={p.name}/>
                <div style={{fontSize:14,fontWeight:600,color:C.t}}>{p.name}</div>
              </div>
              <StarPicker val={rStars[p.name]||0} onChange={v=>setRStars({...rStars,[p.name]:v})}/>
            </div>
          ))}
          <button style={{...sty.btn,background:C.btn,color:C.bk,marginTop:20}} onClick={()=>setRStep(2)}>Devam</button>
        </>}

        {rStep===2&&<>
          <div style={{fontSize:18,fontWeight:800,color:C.t,marginBottom:4}}>Organizatörü değerlendir</div>
          <div style={{fontSize:12,color:C.d,marginBottom:20}}>Etkinliği düzenleyen kişiyi puanla</div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 0",borderBottom:`1px solid ${C.b}`,marginBottom:16}}>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <Av name={activity.owner||"Ahmet K."}/>
              <div>
                <div style={{fontSize:14,fontWeight:600,color:C.t}}>{activity.owner||"Ahmet K."}</div>
                <div style={{fontSize:11,color:C.d}}>Organizatör</div>
              </div>
            </div>
            <StarPicker val={rOrgStar} onChange={setROrgStar}/>
          </div>
          <div style={{marginBottom:20}}>
            <label style={{fontSize:12,color:C.d,marginBottom:6,display:"block"}}>Yorum (opsiyonel, maks 100 karakter)</label>
            <input style={sty.inp} placeholder="Harika organizasyon!" maxLength={100}/>
          </div>
          <button style={{...sty.btn,background:C.btn,color:C.bk}} onClick={()=>{setRStep(0);setRStars({});setROrgStar(0);nav("profil");}}>
            Gönder ✓
          </button>
        </>}
      </div>
    </div></>
  );};

  const PageAktivitelerim = () => (
    <><TopBar title="Aktivitelerim" showBack/><div style={sty.cnt}>
      <div style={{display:"flex",borderBottom:`1px solid ${C.b}`}}>
        {["Yaklaşan","Geçmiş"].map(t=><div key={t} onClick={()=>setPtab(t.toLowerCase())} style={{flex:1,textAlign:"center",padding:"12px 0",cursor:"pointer",borderBottom:`2px solid ${ptab===t.toLowerCase()?C.a:"transparent"}`,color:ptab===t.toLowerCase()?C.a:C.d,fontSize:14,fontWeight:600}}>{t}</div>)}
      </div>
      <div style={{padding:16}}>
        {ptab==="yaklaşan" ? <>
          {myUpcoming.map((a,i)=>
            <div key={i} style={{...sty.card,margin:"0 0 10px"}} onClick={()=>a.det&&nav(a.e==="🏃"?"evt-det":a.e==="🎾"?"ders-det":"act-det", a.det)}>
              <div style={sty.cb}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:18}}>{a.e}</span>
                    <div><div style={{fontSize:13,fontWeight:600,color:C.t}}>{a.t}</div><div style={{fontSize:11,color:C.d}}>{a.d}</div></div>
                  </div>
                  <span style={{fontSize:10,padding:"3px 8px",borderRadius:6,fontWeight:600,background:stBg(a.stC),color:stColor(a.stC)}}>{a.st}</span>
                </div>
              </div>
            </div>
          )}
        </> : <>
          {myPast.map((a,i)=>
            <div key={i} style={{...sty.card,margin:"0 0 10px"}}>
              <div style={sty.cb}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:18}}>{a.e}</span>
                    <div><div style={{fontSize:13,fontWeight:600,color:C.t}}>{a.t}</div><div style={{fontSize:11,color:C.d}}>{a.d}</div></div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                    <span style={{fontSize:10,padding:"3px 8px",borderRadius:6,fontWeight:600,background:"rgba(71,85,105,0.12)",color:C.d}}>{a.st}</span>
                    {!a.rated && <span style={{fontSize:10,padding:"3px 8px",borderRadius:6,fontWeight:600,background:"rgba(245,158,11,0.15)",color:C.o}}>Puan ver ⭐</span>}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>}
      </div>
    </div></>
  );

  const PageDavet = () => (
    <><TopBar title="Arkadaşlarını Davet Et" showBack/><div style={sty.cnt}>
      <div style={{padding:20,textAlign:"center"}}>
        <div style={{fontSize:48,marginBottom:16}}>🎉</div>
        <div style={{fontSize:16,fontWeight:700,color:C.t,marginBottom:8}}>Arkadaşlarını davet et!</div>
        <div style={{fontSize:13,color:C.d,marginBottom:24,lineHeight:1.6}}>Birlikte spor yapmanın keyfini çıkarın.</div>
        <div style={{background:C.s2,border:`1px solid ${C.b}`,borderRadius:10,padding:14,marginBottom:16,fontSize:13,color:C.at,fontWeight:600}}>sporapp.co/davet/BERK2026</div>
        <button style={{...sty.btn,background:C.btn,color:C.bk,marginBottom:10}}>Linki Kopyala</button>
        <button style={{...sty.btn,background:C.s2,color:C.t,border:`1px solid ${C.b}`}}>WhatsApp ile Paylaş</button>
      </div>
    </div></>
  );

  const PageProfilEdit = () => (
    <><TopBar title="Profili Düzenle" showBack/><div style={sty.cnt}>
      <div style={{padding:20}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <Av name="Berk K" size={80} bg={`linear-gradient(135deg,${C.a},${C.bl})`}/>
          <div style={{fontSize:13,color:C.at,cursor:"pointer",fontWeight:600,marginTop:8}}>Fotoğrafı Değiştir</div>
        </div>
        {[["İsim","Berk"],["Soyisim","K."],["Şehir","İstanbul"]].map(([l,v])=>
          <div key={l} style={{marginBottom:14}}><label style={{fontSize:12,color:C.d,marginBottom:6,display:"block"}}>{l}</label><input style={sty.inp} defaultValue={v}/></div>
        )}
        {/* Doğum Tarihi — düzenlenebilir */}
        <div style={{marginBottom:14}}>
          <label style={{fontSize:12,color:C.d,marginBottom:6,display:"block"}}>Doğum Tarihi</label>
          <input style={sty.inp} type="date" defaultValue="1995-06-15"/>
        </div>
        <div style={{marginBottom:20}}>
          <label style={{fontSize:12,color:C.d,marginBottom:8,display:"block"}}>Favori Sporlar</label>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {["Tenis","Futbol","Koşu","Basketbol","Yoga","Padel"].map(sp=>
              <div key={sp} style={{...sty.pill,...(["Tenis","Futbol","Koşu"].includes(sp)?sty.pillA:{})}}>{sp}</div>
            )}
          </div>
        </div>
        <button style={{...sty.btn,background:C.btn,color:C.bk}}>Kaydet</button>
      </div>
    </div></>
  );

  const PageAyarlar = () => (
    <><TopBar title="Ayarlar" showBack/><div style={sty.cnt}>
      {["Bildirim Tercihleri","Şifre Değiştir","E-posta Değiştir","Dil","Gizlilik Politikası","Kullanım Şartları","KVKK Aydınlatma"].map(i=>
        <div key={i} style={sty.mi}><span>{i}</span><span style={{marginLeft:"auto",color:C.d}}>{Ico.chr}</span></div>
      )}
      <div style={{...sty.mi,color:C.r,borderBottom:"none",marginTop:20}}>Hesabı Sil</div>
    </div></>
  );

  const PageYardim = () => (
    <><TopBar title="Yardım & SSS" showBack/><div style={sty.cnt}>
      <div style={{padding:20}}>
        {["Nasıl aktivite oluşturabilirim?","Ders rezervasyonu nasıl yapılır?","Etkinliğe nasıl kayıt olurum?","Mesajlaşma nasıl çalışır?","Hesabımı nasıl silebilirim?"].map((q,i)=>
          <div key={i} style={{background:C.s,border:`1px solid ${C.b}`,borderRadius:12,padding:16,marginBottom:10,cursor:"pointer"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:14,fontWeight:600,color:C.t}}>{q}</span>
              <span style={{color:C.d}}>{Ico.chr}</span>
            </div>
          </div>
        )}
        <div style={{textAlign:"center",marginTop:20,padding:16,background:C.s,borderRadius:12,border:`1px solid ${C.b}`}}>
          <div style={{fontSize:14,fontWeight:600,color:C.t,marginBottom:4}}>Yardıma mı ihtiyacın var?</div>
          <div style={{fontSize:13,color:C.d}}>destek@sporapp.co</div>
        </div>
      </div>
    </div></>
  );

  const render = () => {
    switch(pg) {
      case "etkinlik": return <PageEtkinlik/>;
      case "evt-det": return <PageEvtDet/>;
      case "oyna": return <PageOyna/>;
      case "act-det": return <PageActDet/>;
      case "act-create": return <PageActCreate/>;
      case "ders": return <PageDers/>;
      case "ders-det": return <PageDersDet/>;
      case "profil": return <PageProfil/>;
      case "profil-edit": return <PageProfilEdit/>;
      case "mesajlar": return <PageMesajlar/>;
      case "sohbet": return <PageSohbet/>;
      case "login": return <PageLogin/>;
      case "register": return <PageRegister/>;
      case "onboard": return <PageOnboard/>;
      case "bildirimler": return <PageBildirimler/>;
      case "aktivitelerim": return <PageAktivitelerim/>;
      case "arkadaslarim": return <PageArkadaslarim/>;
      case "kullanici-profil": return <PageKullaniciProfil/>;
      case "davet": return <PageDavet/>;
      case "ayarlar": return <PageAyarlar/>;
      case "yardim": return <PageYardim/>;
      // ── Yeni sayfalar ──
      case "kesfet": return <PageKesfet/>;
      case "sifremi-unuttum": return <PageSifremiUnuttum/>;
      case "basvuru": return <PageBasvuruYonetimi/>;
      case "raporla": return <PageRaporla/>;
      case "topluluk-kurallari": return <PageToplulukKurallari/>;
      case "rating": return <PageRating/>;
      case "splash": return <PageSplash/>;
      case "dogrulama": return <PageDogrulama/>;
      default: return <PageKesfet/>;
    }
  };

  // Menu drawer — inline JSX (component değil, React hatası önlenir)
  const menuDrawer = menu ? (
    <>
      <div style={sty.overlay} onClick={()=>setMenu(false)}/>
      <div style={{position:"absolute",top:0,right:0,bottom:0,width:280,background:C.s,zIndex:30,borderLeft:`1px solid ${C.b}`,display:"flex",flexDirection:"column"}}>
        <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.b}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:16,fontWeight:700,color:C.t}}>Menü</span>
          <div style={sty.ic} onClick={()=>setMenu(false)}>{Ico.x}</div>
        </div>
        <div style={{flex:1,overflowY:"auto"}}>
          {[{l:"Aktivitelerim",p:"aktivitelerim",e:"📅"},{l:"Arkadaşlarım",p:"arkadaslarim",e:"👥"},{l:"Arkadaşlarını Davet Et",p:"davet",e:"📨"},{l:"Topluluk Kuralları",p:"topluluk-kurallari",e:"📋"},{l:"Ayarlar",p:"ayarlar",e:"⚙️"},{l:"Yardım & SSS",p:"yardim",e:"❓"}].map(i=>
            <div key={i.p} style={sty.mi} onClick={()=>{if(i.p==="yardim"||i.p==="topluluk-kurallari"||logged){setMenu(false);nav(i.p);}else reqLog();}}>
              <span style={{fontSize:18}}>{i.e}</span><span>{i.l}</span><span style={{marginLeft:"auto",color:C.d}}>{Ico.chr}</span>
            </div>
          )}
          {/* Hesabını Doğrula - sadece giriş yapılmışsa görünür */}
          {logged && (
            <div style={{...sty.mi,background:verified?C.ad:"transparent",cursor:verified?"default":"pointer"}} onClick={()=>{if(!verified){setMenu(false);nav("dogrulama");}}}>
              <span style={{fontSize:18}}>{verified?"✅":"📱"}</span>
              <span style={{color:verified?C.g:C.t,fontWeight:verified?600:500}}>
                {verified?"Hesabın Doğrulandı":"Hesabını Doğrula"}
              </span>
              {!verified && <span style={{marginLeft:"auto",color:C.d}}>{Ico.chr}</span>}
            </div>
          )}
        </div>
        {logged&&<div style={{...sty.mi,color:C.r,borderTop:`1px solid ${C.b}`,borderBottom:"none"}} onClick={()=>{setLogged(false);setMenu(false);nav("kesfet");}}>
          <span style={{fontSize:18}}>🚪</span><span>Çıkış Yap</span>
        </div>}
      </div>
    </>
  ) : null;

  return (
    <div style={{minHeight:"100vh",background:"#F0F2F5",display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"}}>
      <div>
        <div style={{textAlign:"center",marginBottom:20}}>
          <h1 style={{fontSize:20,fontWeight:800,color:C.at,margin:0,letterSpacing:-0.5}}>Sporwave Wireframe</h1>
          <p style={{fontSize:12,color:C.d,margin:"6px 0 0"}}>Tıklayarak sayfalar arası gezin • {logged?"✅ Giriş yapıldı":"🔒 Giriş yapılmadı"} • Sayfa: {pg}</p>
        </div>
        <div style={sty.phone}>
          {render()}
          {menuDrawer}
        </div>
        <div style={{textAlign:"center",marginTop:16,display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
          {[["splash","🚀 Splash"],["kesfet","🔍 Keşfet"],["etkinlik","🏆 Etkinlik"],["oyna","⚽ Oyna"],["ders","🎓 Ders"],["login","🔐 Login"],["onboard","👋 Onboard"],["rating","⭐ Rating"]].map(([p,l])=>
            <button key={p} onClick={()=>{if(p==="onboard"){setObStep(0);}if(p==="login"){setLogged(false);}nav(p);}} style={{padding:"6px 12px",borderRadius:8,border:`1px solid ${C.b}`,background:pg===p?C.ad:C.s,color:pg===p?C.a:C.d,fontSize:11,fontWeight:600,cursor:"pointer"}}>{l}</button>
          )}
        </div>
      </div>
    </div>
  );
}
