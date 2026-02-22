import { useState, useCallback } from "react";

const C = {
  bg:"#0B0F14",s:"#11161D",s2:"#161C24",b:"#232A34",
  t:"#e8e8f0",d:"#5A6478",a:"#C8FF00",ad:"rgba(200,255,0,0.12)",
  r:"#EF4444",bl:"#2D6BFF",p:"#2D6BFF",tl:"#2D6BFF",o:"#F59E0B",g:"#22C55E",w:"#fff"
};

const events=[
  {id:1,title:"Türkiye İş Bankası 48. İstanbul Maratonu",date:"1 Kasım 2026",city:"İstanbul",sport:"Koşu",e:"🏃"},
  {id:2,title:"Istanbul HYROX 2026",date:"15 Mart 2026",city:"İstanbul",sport:"HYROX",e:"🏋️"},
  {id:3,title:"Max Runners Bayram Koşusu",date:"29 Ekim 2026",city:"İstanbul",sport:"Koşu",e:"🏅"},
  {id:4,title:"Antalya Triathlon Festivali",date:"20 Nisan 2026",city:"Antalya",sport:"Triatlon",e:"🏊"},
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
  {id:1,txt:"Halısaha Maçı başvurunuz onaylandı!",time:"2 saat önce",t:"ok"},
  {id:2,txt:"Yeni padel dersi eklendi: Beşiktaş Academy",time:"5 saat önce",t:"info"},
  {id:3,txt:"İstanbul Maratonu kayıtları başladı!",time:"Dün",t:"info"},
  {id:4,txt:"Can D. seni Basketbol etkinliğine davet etti",time:"Dün",t:"inv"},
];
const sportF=["Hepsi","Futbol","Tenis","Basketbol","Padel","Yoga"];
const cityF=["Tüm Şehirler","İstanbul","Ankara","İzmir","Antalya"];
const levels=["Başlangıç","Orta","İyi","Profesyonel"];
const sportGrid=[{e:"⚽",n:"Futbol"},{e:"🎾",n:"Tenis"},{e:"🏀",n:"Basketbol"},{e:"🏐",n:"Voleybol"},{e:"♟️",n:"Satranç"},{e:"🏓",n:"Masa Tenisi"},{e:"🎱",n:"Padel"},{e:"➕",n:"Diğer"}];
const favSports=["⚽ Futbol","🎾 Tenis","🏀 Basketbol","🏐 Voleybol","🏃 Koşu","🧘 Yoga","🏊 Yüzme","♟️ Satranç","🏋️ Fitness"];

const Ico = {
  back: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>,
  menu: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>,
  msg: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>,
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

export default function App() {
  const [pg, setPg] = useState("etkinlik");
  const [tab, setTab] = useState("etkinlik");
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

  const nav = useCallback((p, d = null) => {
    setHist(h => [...h, { pg, det, tab }]);
    setDet(d);
    if (["etkinlik","bireysel","ders","profil"].includes(p)) setTab(p);
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
    phone:{width:375,height:812,background:C.bg,borderRadius:44,overflow:"hidden",position:"relative",display:"flex",flexDirection:"column",border:`3px solid ${C.b}`,boxShadow:"0 0 80px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.05)"},
    topB:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 20px",background:C.s,borderBottom:`1px solid ${C.b}`,minHeight:54,flexShrink:0},
    cnt:{flex:1,overflowY:"auto",overflowX:"hidden"},
    tabB:{display:"flex",borderTop:`1px solid ${C.b}`,background:C.s,flexShrink:0},
    tab:{flex:1,display:"flex",flexDirection:"column",alignItems:"center",padding:"10px 0 8px",cursor:"pointer",gap:3},
    pill:{display:"inline-flex",padding:"7px 16px",borderRadius:20,fontSize:12,fontWeight:600,cursor:"pointer",border:`1px solid ${C.b}`,background:C.s2,color:C.d,whiteSpace:"nowrap",transition:"all .15s"},
    pillA:{background:C.ad,color:C.a,borderColor:C.a},
    card:{background:C.s,border:`1px solid ${C.b}`,borderRadius:14,margin:"0 16px 12px",overflow:"hidden",cursor:"pointer",transition:"border-color .2s"},
    cb:{padding:"14px 16px"},
    img:{width:"100%",height:160,background:`linear-gradient(135deg,${C.s2},${C.b})`,display:"flex",alignItems:"center",justifyContent:"center",color:C.d},
    fab:{position:"absolute",bottom:80,right:20,width:56,height:56,borderRadius:16,background:C.a,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:"0 4px 24px rgba(200,255,0,0.3)",color:C.bg,zIndex:10},
    btn:{width:"100%",padding:"14px",borderRadius:12,border:"none",fontSize:15,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8},
    inp:{width:"100%",padding:"12px 16px",borderRadius:10,border:`1px solid ${C.b}`,background:C.s2,color:C.t,fontSize:14,outline:"none",boxSizing:"border-box"},
    av:{width:40,height:40,borderRadius:"50%",background:`linear-gradient(135deg,#1a4bcc,${C.bl})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:C.w,flexShrink:0},
    tag:{display:"inline-flex",padding:"4px 10px",borderRadius:8,fontSize:11,fontWeight:600,background:C.ad,color:C.a,marginRight:6},
    bSheet:{position:"absolute",bottom:0,left:0,right:0,background:C.s,borderTop:`1px solid ${C.b}`,borderRadius:"20px 20px 0 0",padding:"24px 20px",zIndex:20},
    overlay:{position:"absolute",inset:0,background:"rgba(0,0,0,0.6)",zIndex:15},
    ic:{width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:C.d,borderRadius:10},
    sub:{fontSize:12,color:C.d,display:"flex",alignItems:"center",gap:5},
    mi:{display:"flex",alignItems:"center",gap:14,padding:"16px 20px",borderBottom:`1px solid ${C.b}`,cursor:"pointer",color:C.t,fontSize:14,fontWeight:500},
    badge:{background:C.r,color:C.w,fontSize:9,fontWeight:700,borderRadius:10,padding:"1px 5px",position:"absolute",top:-2,right:-2,minWidth:14,textAlign:"center"},
  };

  const TopBar = ({title, showBack, right}) => (
    <div style={sty.topB}>
      {showBack ? <div style={sty.ic} onClick={back}>{Ico.back}</div> :
        <div style={{fontSize:18,fontWeight:800,color:C.a,letterSpacing:-0.5}}>Spor APP</div>}
      <div style={{fontSize:16,fontWeight:700,color:C.t}}>{showBack ? title : ""}</div>
      <div style={{display:"flex",gap:4}}>
        {right || <>
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
      {[{id:"etkinlik",l:"Etkinlik",e:"🏆"},{id:"bireysel",l:"Bireysel",e:"⚽"},{id:"ders",l:"Ders",e:"🎓"},{id:"profil",l:"Profil",e:"👤"}].map(t=>(
        <div key={t.id} style={sty.tab} onClick={()=>{t.id==="profil"&&!logged?nav("login"):nav(t.id)}}>
          <span style={{fontSize:20,opacity:tab===t.id?1:.5}}>{t.e}</span>
          <span style={{fontSize:10,fontWeight:600,color:tab===t.id?C.r:C.d}}>{t.l}</span>
          {tab===t.id && <div style={{width:20,height:2,borderRadius:1,background:C.r,marginTop:1}}/>}
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

  // ========= PAGES =========

  const PageEtkinlik = () => (
    <><TopBar/><div style={sty.cnt}>
      <Pills items={cityF} val={cf} set={setCf}/>
      {events.filter(e=>cf==="Tüm Şehirler"||e.city===cf).map(e=>(
        <div key={e.id} style={sty.card} onClick={()=>nav("evt-det",e)}>
          <div style={{...sty.img,height:170}}><span style={{fontSize:52}}>{e.e}</span></div>
          <div style={sty.cb}>
            <div style={{fontSize:14,fontWeight:700,color:C.t,marginBottom:6}}>{e.title}</div>
            <div style={{...sty.sub,marginBottom:3}}>{Ico.cal}<span>{e.date}</span></div>
            <div style={sty.sub}>{Ico.pin}<span>{e.city}</span></div>
          </div>
        </div>
      ))}
      <div style={{height:16}}/>
    </div><TabBar/></>
  );

  const PageEvtDet = () => { const e=det; return (
    <><TopBar title="Etkinlik Detay" showBack/><div style={sty.cnt}>
      <div style={{...sty.img,height:210}}><span style={{fontSize:64}}>{e.e}</span></div>
      <div style={{padding:20}}>
        <div style={{fontSize:20,fontWeight:800,color:C.t,marginBottom:10}}>{e.title}</div>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
          <div style={sty.sub}>{Ico.cal}<span>{e.date}</span></div>
          <div style={sty.sub}>{Ico.pin}<span>{e.city}</span></div>
        </div>
        <p style={{fontSize:13,color:C.d,lineHeight:1.7,marginBottom:20}}>Bu etkinlik hakkında detaylı bilgi, katılım koşulları, parkur bilgisi ve kayıt detayları burada yer alacaktır. Etkinlik organizatörü tarafından eklenen açıklama metni.</p>
        <div style={{background:C.s2,borderRadius:12,height:100,display:"flex",alignItems:"center",justifyContent:"center",color:C.d,fontSize:12,marginBottom:20,border:`1px dashed ${C.b}`}}>📍 Konum Haritası</div>
        <div style={{display:"flex",gap:10}}>
          <button style={{...sty.btn,background:C.a,color:C.bg,flex:2}} onClick={()=>reqLog()}>Kayıt Ol</button>
          <button style={{...sty.btn,background:C.s2,color:C.t,border:`1px solid ${C.b}`,flex:1}}>Paylaş</button>
        </div>
      </div>
    </div></>
  );};

  const PageBireysel = () => (
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
              <span style={{fontSize:10,padding:"3px 8px",borderRadius:6,background:"rgba(45,107,255,0.15)",color:C.bl,fontWeight:600}}>Onay gerekli</span>
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
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <Av name={a.owner}/><div><div style={{fontSize:14,fontWeight:600,color:C.t}}>{a.owner}</div><div style={{fontSize:12,color:C.d}}>Organizatör</div></div>
          </div>
        </div>
        <div style={{marginBottom:20}}>
          <div style={{fontSize:14,fontWeight:700,color:C.t,marginBottom:10}}>Katılımcılar ({a.cur}/{a.max})</div>
          <div style={{display:"flex"}}>{Array.from({length:a.cur}).map((_,i)=><Av key={i} name={String.fromCharCode(65+i)+" "+String.fromCharCode(75+i)} size={34} bg={`hsl(${i*60+200},60%,50%)`}/>)}</div>
        </div>
        <button style={{...sty.btn,background:C.a,color:C.bg}} onClick={()=>reqLog(()=>setSheet("lv"))}>Katıl ({a.max-a.cur} kişilik yer var)</button>
      </div>
    </div>
    {sheet==="lv"&&<>
      <div style={sty.overlay} onClick={()=>setSheet(null)}/>
      <div style={sty.bSheet}>
        <div style={{fontSize:16,fontWeight:800,color:C.t,marginBottom:4}}>Deneyim Seviyeniz</div>
        <div style={{fontSize:12,color:C.d,marginBottom:16}}>Aktivite sahibinin sizi değerlendirebilmesi için seviyenizi seçin</div>
        {levels.map(l=><button key={l} onClick={()=>setSelLv(l)} style={{display:"block",width:"100%",padding:"14px 16px",borderRadius:12,border:`1px solid ${selLv===l?C.a:C.b}`,background:selLv===l?C.ad:C.s2,color:C.t,cursor:"pointer",textAlign:"left",fontSize:14,fontWeight:500,marginBottom:8,boxSizing:"border-box"}}>{l}</button>)}
        <button style={{...sty.btn,background:C.a,color:C.bg,marginTop:8}} onClick={()=>{setSheet(null);setSelLv(null);}}>
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
          <button style={{...sty.btn,background:C.a,color:C.bg}} onClick={()=>setCStep(2)}>Devam</button>
        </>}
        {cStep===2&&<>
          <div style={{fontSize:18,fontWeight:800,color:C.t,marginBottom:16}}>Tarih & Konum</div>
          <div style={{marginBottom:14}}><label style={{fontSize:12,color:C.d,marginBottom:6,display:"block"}}>Tarih</label><input style={sty.inp} type="date"/></div>
          <div style={{marginBottom:14}}><label style={{fontSize:12,color:C.d,marginBottom:6,display:"block"}}>Saat</label><input style={sty.inp} type="time"/></div>
          <div style={{marginBottom:20}}><label style={{fontSize:12,color:C.d,marginBottom:6,display:"block"}}>Konum</label><input style={sty.inp} placeholder="Adres veya mekan adı"/>
            <div style={{height:80,background:C.s2,borderRadius:8,marginTop:8,display:"flex",alignItems:"center",justifyContent:"center",color:C.d,fontSize:12,border:`1px dashed ${C.b}`}}>📍 Haritadan seç</div>
          </div>
          <button style={{...sty.btn,background:C.a,color:C.bg}} onClick={()=>setCStep(3)}>Devam</button>
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
          <button style={{...sty.btn,background:C.a,color:C.bg}} onClick={()=>{nav("bireysel");setCStep(0);}}>Yayınla 🚀</button>
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
          <Av name={l.fac} size={36} bg={`linear-gradient(135deg,${C.tl},${C.bl})`}/>
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
        <div style={{display:"flex",gap:10}}>
          <button style={{...sty.btn,background:C.a,color:C.bg,flex:2}} onClick={()=>reqLog()}>Rezervasyon Yap</button>
          <button style={{...sty.btn,background:C.s2,color:C.t,border:`1px solid ${C.b}`,flex:1}} onClick={()=>reqLog(()=>nav("sohbet",{name:l.fac,av:l.fac.substring(0,2)}))}>Mesaj</button>
        </div>
      </div>
    </div></>
  );};

  const PageProfil = () => (
    <><TopBar/><div style={sty.cnt}>
      <div style={{padding:20,textAlign:"center"}}>
        <Av name="Berk K" size={80} bg={`linear-gradient(135deg,${C.a},${C.tl})`}/>
        <div style={{fontSize:20,fontWeight:800,color:C.t,marginTop:12}}>Berk K.</div>
        <div style={{fontSize:13,color:C.d,marginBottom:12}}>İstanbul</div>
        <div style={{display:"flex",justifyContent:"center",gap:24,marginBottom:16}}>
          <div style={{textAlign:"center"}}><div style={{fontSize:22,fontWeight:800,color:C.a}}>12</div><div style={{fontSize:11,color:C.d}}>Etkinlik</div></div>
          <div style={{textAlign:"center"}}><div style={{fontSize:22,fontWeight:800,color:C.a}}>5</div><div style={{fontSize:11,color:C.d}}>Arkadaş</div></div>
        </div>
        <div style={{display:"flex",justifyContent:"center",gap:6,flexWrap:"wrap",marginBottom:16}}>
          {["Tenis","Futbol","Koşu"].map(s=><span key={s} style={sty.tag}>{s}</span>)}
        </div>
        <button style={{...sty.btn,background:C.s2,color:C.t,border:`1px solid ${C.b}`,maxWidth:200,margin:"0 auto"}} onClick={()=>nav("profil-edit")}>Profili Düzenle</button>
      </div>
      <div style={{display:"flex",borderBottom:`1px solid ${C.b}`}}>
        {["yaklaşan","geçmiş"].map(t=><div key={t} onClick={()=>setPtab(t)} style={{flex:1,textAlign:"center",padding:"12px 0",cursor:"pointer",borderBottom:`2px solid ${ptab===t?C.a:"transparent"}`,color:ptab===t?C.a:C.d,fontSize:14,fontWeight:600,textTransform:"capitalize"}}>{t==="yaklaşan"?"Yaklaşan":"Geçmiş"}</div>)}
      </div>
      <div style={{padding:16}}>
        {ptab==="yaklaşan"?<>
          {[{e:"⚽",t:"Halısaha Maçı",d:"21 Şub Cts 19:00"},{e:"🏃",t:"İstanbul Maratonu",d:"1 Kas 2026"}].map((a,i)=>
            <div key={i} style={{...sty.card,margin:"0 0 10px"}}><div style={sty.cb}>
              <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:18}}>{a.e}</span><span style={{fontSize:13,fontWeight:600,color:C.t}}>{a.t}</span></div>
              <div style={{...sty.sub,marginTop:6}}>{Ico.cal}<span>{a.d}</span></div>
            </div></div>
          )}
        </>:<div style={{textAlign:"center",padding:30,color:C.d,fontSize:13}}>Henüz geçmiş etkinliğiniz yok</div>}
      </div>
    </div><TabBar/></>
  );

  const PageLogin = () => (
    <><TopBar title="" showBack right={<div style={{width:36}}/>}/><div style={sty.cnt}>
      <div style={{padding:"40px 24px"}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <div style={{fontSize:32,fontWeight:800,color:C.a,marginBottom:4}}>Spor APP</div>
          <div style={{fontSize:14,color:C.d}}>Spor arkadaşını bul, harekete geç!</div>
        </div>
        <div style={{marginBottom:14}}><input style={sty.inp} placeholder="E-posta adresi"/></div>
        <div style={{marginBottom:20}}><input style={sty.inp} type="password" placeholder="Şifre"/></div>
        <button style={{...sty.btn,background:C.a,color:C.bg,marginBottom:12}} onClick={()=>{setLogged(true);back();}}>Giriş Yap</button>
        <div style={{textAlign:"center",marginBottom:20}}><span style={{fontSize:13,color:C.d,cursor:"pointer"}}>Şifremi Unuttum</span></div>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
          <div style={{flex:1,height:1,background:C.b}}/><span style={{fontSize:12,color:C.d}}>veya</span><div style={{flex:1,height:1,background:C.b}}/>
        </div>
        <button style={{...sty.btn,background:C.s2,color:C.t,border:`1px solid ${C.b}`,marginBottom:10}} onClick={()=>{setLogged(true);back();}}>Google ile giriş yap</button>
        <button style={{...sty.btn,background:C.s2,color:C.t,border:`1px solid ${C.b}`}} onClick={()=>{setLogged(true);back();}}>🍎 Apple ile giriş yap</button>
        <div style={{textAlign:"center",marginTop:20}}>
          <span style={{fontSize:13,color:C.d}}>Hesabın yok mu? </span>
          <span style={{fontSize:13,color:C.a,cursor:"pointer",fontWeight:600}} onClick={()=>nav("register")}>Kayıt Ol</span>
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
        <button style={{...sty.btn,background:C.a,color:C.bg}} onClick={()=>{setLogged(true);nav("onboard");}}>Kayıt Ol</button>
      </div>
    </div></>
  );

  const PageOnboard = () => {
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
    ];
    return (
    <><div style={sty.topB}><div/><div style={{fontSize:13,color:C.d}}>{obStep+1}/{steps.length}</div><div/></div><div style={sty.cnt}>
      <div style={{padding:"30px 24px"}}>
        <div style={{display:"flex",gap:4,marginBottom:30}}>{steps.map((_,i)=><div key={i} style={{flex:1,height:3,borderRadius:2,background:i<=obStep?C.a:C.b}}/>)}</div>
        <div style={{fontSize:22,fontWeight:800,color:C.t,marginBottom:24}}>{steps[obStep].t}</div>
        {steps[obStep].c}
        <button style={{...sty.btn,background:C.a,color:C.bg,marginTop:30}} onClick={()=>{
          if(obStep<steps.length-1)setObStep(obStep+1);else{setObStep(0);nav("etkinlik");}
        }}>{obStep<steps.length-1?"Devam":"Başla! 🚀"}</button>
      </div>
    </div></>
  );};

  const PageMesajlar = () => (
    <><TopBar title="Mesajlar" showBack/><div style={sty.cnt}>
      {msgs.map(m=>(
        <div key={m.id} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 20px",borderBottom:`1px solid ${C.b}`,cursor:"pointer"}} onClick={()=>nav("sohbet",m)}>
          <Av name={m.name}/><div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
              <span style={{fontSize:14,fontWeight:600,color:C.t}}>{m.name}</span>
              <span style={{fontSize:11,color:C.d}}>{m.time}</span>
            </div>
            <div style={{fontSize:13,color:C.d,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.last}</div>
          </div>
          {m.unread>0&&<div style={{width:20,height:20,borderRadius:"50%",background:C.a,color:C.bg,fontSize:11,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{m.unread}</div>}
        </div>
      ))}
    </div></>
  );

  const PageSohbet = () => {
    const tgt=det;
    const sm=[{f:"o",t:"Selam! Halısaha maçı için müsait misin?",h:"14:20"},{f:"m",t:"Evet, saat 7'de orada olurum",h:"14:25"},{f:"o",t:tgt?.last||"Görüşürüz!",h:"14:32"}];
    return (
    <><TopBar title={tgt?.name||"Sohbet"} showBack right={<div style={sty.ic}>⋮</div>}/>
      <div style={{...sty.cnt,display:"flex",flexDirection:"column"}}>
        <div style={{flex:1,padding:16,display:"flex",flexDirection:"column",gap:10,justifyContent:"flex-end"}}>
          {sm.map((m,i)=><div key={i} style={{display:"flex",justifyContent:m.f==="m"?"flex-end":"flex-start"}}>
            <div style={{maxWidth:"75%",padding:"10px 14px",borderRadius:m.f==="m"?"14px 14px 4px 14px":"14px 14px 14px 4px",background:m.f==="m"?C.a:C.s2,color:m.f==="m"?C.bg:C.t,fontSize:14}}>
              <div>{m.t}</div><div style={{fontSize:10,marginTop:4,opacity:.6,textAlign:"right"}}>{m.h}</div>
            </div>
          </div>)}
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
        <div key={n.id} style={{padding:"14px 20px",borderBottom:`1px solid ${C.b}`,display:"flex",gap:12,alignItems:"flex-start"}}>
          <div style={{width:36,height:36,borderRadius:10,background:n.t==="ok"?"rgba(34,197,94,0.15)":n.t==="inv"?"rgba(45,107,255,0.15)":"rgba(45,107,255,0.12)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:16}}>
            {n.t==="ok"?"✓":n.t==="inv"?"👤":"🔔"}
          </div>
          <div><div style={{fontSize:13,color:C.t,lineHeight:1.5}}>{n.txt}</div><div style={{fontSize:11,color:C.d,marginTop:4}}>{n.time}</div></div>
        </div>
      ))}
    </div></>
  );

  const PageAktivitelerim = () => (
    <><TopBar title="Aktivitelerim" showBack/><div style={sty.cnt}>
      <div style={{display:"flex",borderBottom:`1px solid ${C.b}`}}>
        {["Yaklaşan","Geçmiş"].map(t=><div key={t} onClick={()=>setPtab(t.toLowerCase())} style={{flex:1,textAlign:"center",padding:"12px 0",cursor:"pointer",borderBottom:`2px solid ${ptab===t.toLowerCase()?C.a:"transparent"}`,color:ptab===t.toLowerCase()?C.a:C.d,fontSize:14,fontWeight:600}}>{t}</div>)}
      </div>
      <div style={{padding:16}}>
        {[{e:"⚽",t:"Halısaha Maçı",d:"21 Şub Cts 19:00",st:"Onaylandı"},{e:"🏃",t:"İstanbul Maratonu",d:"1 Kas 2026",st:"Kayıtlı"},{e:"🎾",t:"Padel Dersi",d:"25 Şub Sal 12:00",st:"Onay bekliyor"}].map((a,i)=>
          <div key={i} style={{...sty.card,margin:"0 0 10px"}}><div style={sty.cb}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:18}}>{a.e}</span><div><div style={{fontSize:13,fontWeight:600,color:C.t}}>{a.t}</div><div style={{fontSize:11,color:C.d}}>{a.d}</div></div>
              </div>
              <span style={{fontSize:10,padding:"3px 8px",borderRadius:6,fontWeight:600,background:a.st.includes("Onay bek")?"rgba(255,140,66,0.15)":"rgba(34,197,94,0.15)",color:a.st.includes("Onay bek")?C.o:C.g}}>{a.st}</span>
            </div>
          </div></div>
        )}
      </div>
    </div></>
  );

  const PageDavet = () => (
    <><TopBar title="Arkadaşlarını Davet Et" showBack/><div style={sty.cnt}>
      <div style={{padding:20,textAlign:"center"}}>
        <div style={{fontSize:48,marginBottom:16}}>🎉</div>
        <div style={{fontSize:16,fontWeight:700,color:C.t,marginBottom:8}}>Arkadaşlarını davet et!</div>
        <div style={{fontSize:13,color:C.d,marginBottom:24,lineHeight:1.6}}>Birlikte spor yapmanın keyfini çıkarın.</div>
        <div style={{background:C.s2,border:`1px solid ${C.b}`,borderRadius:10,padding:14,marginBottom:16,fontSize:13,color:C.a,fontWeight:600}}>sporapp.co/davet/BERK2026</div>
        <button style={{...sty.btn,background:C.a,color:C.bg,marginBottom:10}}>Linki Kopyala</button>
        <button style={{...sty.btn,background:C.s2,color:C.t,border:`1px solid ${C.b}`}}>WhatsApp ile Paylaş</button>
      </div>
    </div></>
  );

  const PageProfilEdit = () => (
    <><TopBar title="Profili Düzenle" showBack/><div style={sty.cnt}>
      <div style={{padding:20}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <Av name="Berk K" size={80} bg={`linear-gradient(135deg,${C.a},${C.tl})`}/>
          <div style={{fontSize:13,color:C.a,cursor:"pointer",fontWeight:600,marginTop:8}}>Fotoğrafı Değiştir</div>
        </div>
        {[["İsim","Berk"],["Soyisim","K."],["Şehir","İstanbul"]].map(([l,v])=>
          <div key={l} style={{marginBottom:14}}><label style={{fontSize:12,color:C.d,marginBottom:6,display:"block"}}>{l}</label><input style={sty.inp} defaultValue={v}/></div>
        )}
        <div style={{marginBottom:20}}>
          <label style={{fontSize:12,color:C.d,marginBottom:8,display:"block"}}>Favori Sporlar</label>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {["Tenis","Futbol","Koşu","Basketbol","Yoga","Padel"].map(sp=>
              <div key={sp} style={{...sty.pill,...(["Tenis","Futbol","Koşu"].includes(sp)?sty.pillA:{})}}>{sp}</div>
            )}
          </div>
        </div>
        <button style={{...sty.btn,background:C.a,color:C.bg}}>Kaydet</button>
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
      case "bireysel": return <PageBireysel/>;
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
      case "arkadaslarim": return <PageMesajlar/>;
      case "davet": return <PageDavet/>;
      case "ayarlar": return <PageAyarlar/>;
      case "yardim": return <PageYardim/>;
      default: return <PageEtkinlik/>;
    }
  };

  // Menu drawer
  const MenuDrawer = () => menu ? <>
    <div style={sty.overlay} onClick={()=>setMenu(false)}/>
    <div style={{position:"absolute",top:0,right:0,bottom:0,width:280,background:C.s,zIndex:30,borderLeft:`1px solid ${C.b}`,display:"flex",flexDirection:"column"}}>
      <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.b}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:16,fontWeight:700,color:C.t}}>Menü</span>
        <div style={sty.ic} onClick={()=>setMenu(false)}>{Ico.x}</div>
      </div>
      <div style={{flex:1,overflowY:"auto"}}>
        {[{l:"Aktivitelerim",p:"aktivitelerim",e:"📅"},{l:"Arkadaşlarım",p:"arkadaslarim",e:"👥"},{l:"Arkadaşlarını Davet Et",p:"davet",e:"📨"},{l:"Bildirimler",p:"bildirimler",e:"🔔"},{l:"Ayarlar",p:"ayarlar",e:"⚙️"},{l:"Yardım & SSS",p:"yardim",e:"❓"}].map(i=>
          <div key={i.p} style={sty.mi} onClick={()=>{if(i.p==="yardim"||logged){setMenu(false);nav(i.p);}else reqLog();}}>
            <span style={{fontSize:18}}>{i.e}</span><span>{i.l}</span><span style={{marginLeft:"auto",color:C.d}}>{Ico.chr}</span>
          </div>
        )}
      </div>
      {logged&&<div style={{...sty.mi,color:C.r,borderTop:`1px solid ${C.b}`,borderBottom:"none"}} onClick={()=>{setLogged(false);setMenu(false);nav("etkinlik");}}>
        <span style={{fontSize:18}}>🚪</span><span>Çıkış Yap</span>
      </div>}
    </div>
  </> : null;

  return (
    <div style={{minHeight:"100vh",background:"#070A0E",display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"system-ui,-apple-system,sans-serif"}}>
      <div>
        <div style={{textAlign:"center",marginBottom:20}}>
          <h1 style={{fontSize:20,fontWeight:800,color:C.a,margin:0,letterSpacing:-0.5}}>Spor APP Wireframe</h1>
          <p style={{fontSize:12,color:C.d,margin:"6px 0 0"}}>Tıklayarak sayfalar arası gezin • {logged?"✅ Giriş yapıldı":"🔒 Giriş yapılmadı"} • Sayfa: {pg}</p>
        </div>
        <div style={sty.phone}>
          {render()}
          <MenuDrawer/>
        </div>
        <div style={{textAlign:"center",marginTop:16,display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
          {[["etkinlik","🏆 Etkinlik"],["bireysel","⚽ Bireysel"],["ders","🎓 Ders"],["login","🔐 Login"],["onboard","👋 Onboard"]].map(([p,l])=>
            <button key={p} onClick={()=>{if(p==="onboard"){setObStep(0);}if(p==="login"){setLogged(false);}nav(p);}} style={{padding:"6px 12px",borderRadius:8,border:`1px solid ${C.b}`,background:pg===p?C.ad:C.s,color:pg===p?C.a:C.d,fontSize:11,fontWeight:600,cursor:"pointer"}}>{l}</button>
          )}
        </div>
      </div>
    </div>
  );
}
