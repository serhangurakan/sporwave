import { useState, useEffect, useRef } from "react";

// ============================================================
// SPORWAVE MODULE 6 — Mesajlaşma & Bildirimler (S17, S18, S19, S35)
// S17: Mesajlar Listesi (Inbox)
// S18: Sohbet Sayfası (1-1)
// S35: Maç Sohbeti (Grup Chat)
// S19: Bildirimler
// ============================================================

const T={accent:"#B7F000",bg:"#FFFFFF",bgAlt:"#F5F5F5",card:"#FFFFFF",cardBorder:"#EBEBEB",text:"#0D0D0D",textDim:"#555F6D",textMuted:"#8A95A5",red:"#FF4757",green:"#2ED573",orange:"#FF8C42",gold:"#FFD700",purple:"#A78BFA"};
const FH="'Plus Jakarta Sans','SF Pro Display',-apple-system,sans-serif";
const FB="'SF Pro Display','SF Pro Text',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";

// Mock Users
const U=[
  {id:1,name:"Berk Başdemir",un:"berkbasdemir",av:"BB",att:94,phone:"+905551234567"},
  {id:2,name:"Ali Demir",un:"alidemir",av:"AD",att:88,phone:"+905559876543"},
  {id:3,name:"Mehmet Kaya",un:"mkaya",av:"MK",att:91,phone:""},
  {id:4,name:"Serhan Gürakan",un:"serhangurakan",av:"SG",att:96,phone:"+905553456789"},
  {id:5,name:"Can Yıldız",un:"canyildiz",av:"CY",att:85,phone:""},
  {id:6,name:"Oğuz Han",un:"oguzhan",av:"OH",att:92,phone:"+905557654321"},
  {id:7,name:"Kerem Aktaş",un:"keremm",av:"KA",att:78,phone:""},
  {id:8,name:"Burak Şen",un:"buraksen",av:"BŞ",att:90,phone:"+905558765432"},
];
const ME=U[0];
const uf=id=>U.find(u=>u.id===id);

// Mock Matches (for group chats)
const MATCHES=[
  {id:101,title:"Cumartesi Akşam Maçı",date:"1 Mar",time:"20:00",loc:"Kadıköy Spor",fmt:"6v6",players:[2,1,4,3,7,8,5],state:"open"},
  {id:102,title:"Pazar Sabah Maçı",date:"2 Mar",time:"10:00",loc:"Üsküdar Arena",fmt:"5v5",players:[1,3,5,6],state:"open"},
  {id:103,title:"Çarşamba Gece Maçı",date:"5 Mar",time:"21:00",loc:"Beşiktaş Halısaha",fmt:"7v7",players:[1,2,6,8,3,4,5,7],state:"open"},
];

// Mock Conversations (1-1 chats)
const CONVERSATIONS=[
  {id:"c1",type:"dm",userId:2,unread:2,lastMsg:"Cumartesi akşam maça geliyorsun değil mi?",lastTime:"14:30",ts:1},
  {id:"c2",type:"dm",userId:4,unread:0,lastMsg:"Tamamdır, sahada görüşürüz 💪",lastTime:"Dün",ts:2},
  {id:"c3",type:"dm",userId:6,unread:1,lastMsg:"Pazar sabah müsait misin?",lastTime:"Dün",ts:3},
  {id:"c4",type:"dm",userId:3,unread:0,lastMsg:"Güzel maçtı bugün",lastTime:"27 Şub",ts:5},
  {id:"c5",type:"dm",userId:8,unread:0,lastMsg:"Saha adresini atar mısın?",lastTime:"25 Şub",ts:7},
  // Group chats (match sohbetleri)
  {id:"g1",type:"group",matchId:101,unread:5,lastMsg:"Ben biraz geç kalabilirim",lastSender:4,lastTime:"15:20",ts:0},
  {id:"g2",type:"group",matchId:102,unread:0,lastMsg:"Sahaya erken gelelim ısınırız",lastSender:3,lastTime:"Dün",ts:4},
  {id:"g3",type:"group",matchId:103,unread:3,lastMsg:"Kaleci lazım, bilen var mı?",lastSender:6,lastTime:"26 Şub",ts:6},
];

// Mock Messages for 1-1 chats
const DM_MESSAGES={
  c1:[
    {id:1,from:2,text:"Selam Berk!",time:"14:00",read:true},
    {id:2,from:1,text:"Selam Ali, nasılsın?",time:"14:05",read:true},
    {id:3,from:2,text:"İyiyim sağol. Cumartesi akşam maça geliyorsun değil mi?",time:"14:10",read:true},
    {id:4,from:1,text:"Evet, orada olacağım. 20:00'de buluşuruz.",time:"14:15",read:true},
    {id:5,from:2,text:"Süper! Serhan da geliyor dedi.",time:"14:20",read:true},
    {id:6,from:2,text:"Cumartesi akşam maça geliyorsun değil mi?",time:"14:30",read:false},
    {id:7,type:"invite",from:1,matchId:101,matchTitle:"Cumartesi Akşam Maçı",time:"14:12"},
  ],
  c2:[
    {id:1,from:1,text:"Serhan, cumartesi maçı var haberdar mısın?",time:"10:00",read:true},
    {id:2,from:4,text:"Evet gördüm, katılıyorum!",time:"10:30",read:true},
    {id:3,from:1,text:"Harika, takım A'da mısın?",time:"10:35",read:true},
    {id:4,from:4,text:"Tamamdır, sahada görüşürüz 💪",time:"11:00",read:true},
  ],
  c3:[
    {id:1,from:6,text:"Selam, hafta sonu maç var mı?",time:"16:00",read:true},
    {id:2,from:1,text:"Cumartesi akşam var, katılır mısın?",time:"16:10",read:true},
    {id:3,from:6,text:"Pazar sabah müsait misin?",time:"16:30",read:false},
  ],
  c4:[
    {id:1,from:3,text:"Güzel maçtı bugün",time:"22:00",read:true},
    {id:2,from:1,text:"Harbi, 5-3 iyi skor oldu",time:"22:10",read:true},
  ],
  c5:[
    {id:1,from:8,text:"Saha adresini atar mısın?",time:"18:00",read:true},
    {id:2,from:1,text:"Kadıköy Spor Tesisleri, navigasyona Kadıköy Halısaha yaz çıkar",time:"18:15",read:true},
  ],
};

// Mock Messages for group chats
const GROUP_MESSAGES={
  g1:[
    {id:1,from:2,text:"Herkese merhaba! Sahayı ayarladım.",time:"10:00",read:true},
    {id:2,from:1,text:"Süper Ali, saat kaçta buluşuyoruz?",time:"10:15",read:true},
    {id:3,from:2,text:"20:00'de sahada olalım, 19:45 gibi gelin ısınırız",time:"10:20",read:true},
    {id:4,from:3,text:"Ben kaleci oynayabilirim",time:"11:00",read:true},
    {id:5,from:7,text:"Forma getirmemiz gerekiyor mu?",time:"11:30",read:true},
    {id:6,from:2,text:"Sahada forma var, merak etmeyin",time:"11:35",read:true},
    {id:7,from:8,text:"Su getirin beyler",time:"12:00",read:true},
    {id:8,from:5,text:"Ben arkadaşımı da getirebilir miyim?",time:"13:00",read:true},
    {id:9,from:2,text:"Kontenjan varsa tabi, şu an 7 kişiyiz 12 kişi lazım",time:"13:10",read:true},
    {id:10,from:4,text:"Ben biraz geç kalabilirim",time:"15:20",read:false},
  ],
  g2:[
    {id:1,from:1,text:"Pazar maçı için hazır mısınız?",time:"18:00",read:true},
    {id:2,from:3,text:"Sahaya erken gelelim ısınırız",time:"18:30",read:true},
  ],
  g3:[
    {id:1,from:6,text:"Çarşamba maçı organize ediyorum",time:"14:00",read:true},
    {id:2,from:2,text:"Ben varım!",time:"14:15",read:true},
    {id:3,from:8,text:"Saat uygun benim için",time:"14:30",read:true},
    {id:4,from:6,text:"Kaleci lazım, bilen var mı?",time:"15:00",read:false},
  ],
};

// Mock Notifications
const NOTIFICATIONS=[
  {id:1,type:"like",icon:"👍",text:"Ali Demir postunu beğendi",time:"2dk",read:false,userId:2,target:"post"},
  {id:2,type:"comment",icon:"💬",text:"Serhan Gürakan postuna yorum yaptı: \"Süper organizasyondu 👏\"",time:"15dk",read:false,userId:4,target:"comments"},
  {id:3,type:"follow",icon:"👥",text:"Can Yıldız seni takip etmeye başladı",time:"1sa",read:false,userId:5,target:"profile"},
  {id:4,type:"match_approved",icon:"✅",text:"Maç başvurun onaylandı: Cumartesi Akşam Maçı",time:"2sa",read:true,target:"match"},
  {id:5,type:"match_new",icon:"📢",text:"Ali Demir yeni bir maç oluşturdu",time:"3sa",read:true,userId:2,target:"match"},
  {id:6,type:"badge",icon:"🏅",text:"50 Maç Kulübü'ne hoş geldin!",time:"5sa",read:true,target:"profile"},
  {id:7,type:"streak",icon:"🔥",text:"4 haftalık serin devam ediyor!",time:"1g",read:true,target:"profile"},
  {id:8,type:"message",icon:"💬",text:"Oğuz Han sana mesaj gönderdi",time:"1g",read:true,userId:6,target:"chat"},
  {id:9,type:"match_reminder",icon:"⚽",text:"Yarınki maçın yaklaşıyor: Cumartesi Akşam Maçı",time:"1g",read:true,target:"match"},
  {id:10,type:"invite",icon:"📩",text:"Ali Demir seni Cumartesi Akşam Maçı'na davet etti",time:"2g",read:true,userId:2,target:"match"},
  {id:11,type:"reschedule",icon:"📅",text:"Maç Pazar'a alındı: Pazar Sabah Maçı",time:"2g",read:true,target:"match"},
  {id:12,type:"cancelled",icon:"🚫",text:"Perşembe Akşam Maçı iptal edildi",time:"3g",read:true,target:"none"},
  {id:13,type:"rate",icon:"⭐",text:"Maçını değerlendir: Kadıköy Halısaha Maçı",time:"3g",read:true,target:"rating"},
  {id:14,type:"removed",icon:"❌",text:"Ali Demir seni Beşiktaş Derbi'sinden çıkardı",time:"4g",read:true,target:"none"},
  {id:15,type:"host_vote",icon:"👑",text:"Mehmet, Cumartesi Akşam Maçı'nda host olmak istiyor — Oyla!",time:"4g",read:true,userId:3,target:"match"},
  {id:16,type:"host_change",icon:"👑",text:"Mehmet artık Pazar Sabah Maçı'nın yeni host'u!",time:"5g",read:true,userId:3,target:"match"},
  {id:17,type:"vote_failed",icon:"👑",text:"Host devralma oylaması sonuçlandı — yeterli çoğunluk sağlanamadı",time:"5g",read:true,target:"match"},
  {id:18,type:"auto_deleted",icon:"🗑️",text:"Çarşamba Gece Maçı başlatılmadığı için silindi",time:"6g",read:true,target:"none"},
  {id:19,type:"match_rejected",icon:"❌",text:"Maç başvurun reddedildi: Beşiktaş Sahil Maçı",time:"6g",read:true,target:"match"},
  {id:20,type:"like",icon:"👍",text:"Burak Şen postunu beğendi",time:"1hf",read:true,userId:8,target:"post"},
];

// Icons
const I={
  arrowLeft:c=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.text} strokeWidth="2" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12,19 5,12 12,5"/></svg>,
  search:c=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  send:c=><svg width="20" height="20" viewBox="0 0 24 24" fill={c||T.accent} stroke="none"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>,
  attach:c=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.49"/></svg>,
  dots:c=><svg width="16" height="16" viewBox="0 0 24 24" fill={c||T.textDim}><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>,
  check:c=><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c||T.accent} strokeWidth="3" strokeLinecap="round"><polyline points="20,6 9,17 4,12"/></svg>,
  doubleCheck:c=><svg width="16" height="12" viewBox="0 0 28 24" fill="none" stroke={c||T.accent} strokeWidth="2.5" strokeLinecap="round"><polyline points="16,6 8,17 4,12"/><polyline points="24,6 14,17 12,14"/></svg>,
  football:c=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15 15 0 014 10 15 15 0 01-4 10 15 15 0 01-4-10 15 15 0 014-10z"/><path d="M2 12h20"/></svg>,
  bell:c=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  chat:c=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  home:c=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>,
  user:c=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 10-16 0"/></svg>,
  users:c=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||T.textMuted} strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  whatsapp:c=><svg width="16" height="16" viewBox="0 0 24 24" fill={c||T.green}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
  block:c=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||T.red} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>,
  flag:c=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||T.red} strokeWidth="2" strokeLinecap="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>,
  x:c=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  inbox:c=><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={c||T.textMuted} strokeWidth="1.2" strokeLinecap="round"><path d="M22 12h-6l-2 3H10l-2-3H2"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>,
  bellEmpty:c=><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={c||T.textMuted} strokeWidth="1.2" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
};

// Shared Components
function Av({i,s=32,c=T.accent,onClick,st}){return <div onClick={onClick} style={{width:s,height:s,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:`${c}18`,border:`1.5px solid ${c}44`,color:c,fontSize:s*.34,fontWeight:700,cursor:onClick?"pointer":"default",flexShrink:0,...st}}>{i}</div>;}
function Btn({children,primary,danger,small,full,ghost,onClick,disabled,st}){const[h,setH]=useState(false);return <button disabled={disabled} onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{padding:small?"7px 14px":"12px 20px",borderRadius:10,border:primary||danger?"none":`1.5px solid ${ghost?"transparent":T.cardBorder}`,background:disabled?`${T.textDim}22`:danger?T.red:primary?T.accent:"transparent",color:disabled?T.textDim:danger?"#fff":primary?"#0D0D0D":T.text,fontSize:small?12:14,fontWeight:600,cursor:disabled?"not-allowed":"pointer",width:full?"100%":"auto",transition:"all .2s",transform:h&&!disabled?"translateY(-1px)":"none",display:"flex",alignItems:"center",justifyContent:"center",gap:6,...st}}>{children}</button>;}
function Badge({children,c=T.accent,st}){return <span style={{display:"inline-flex",alignItems:"center",gap:3,padding:"2px 8px",borderRadius:20,fontSize:11,fontWeight:600,color:c,background:`${c}15`,whiteSpace:"nowrap",...st}}>{children}</span>;}
function TabBar({active,onNav}){const tabs=[{id:"S05",ic:I.home,l:"Ana Sayfa"},{id:"S08",ic:I.football,l:"Maçlar"},{id:"S15",ic:I.user,l:"Profil"}];return <div style={{position:"fixed",bottom:0,left:0,right:0,height:56,background:T.bgAlt,borderTop:`1px solid ${T.cardBorder}`,display:"flex",justifyContent:"space-around",alignItems:"center",zIndex:100,maxWidth:430,margin:"0 auto"}}>{tabs.map(t=><div key={t.id} onClick={()=>onNav(t.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",padding:"6px 20px"}}><span style={{display:"flex"}}>{t.ic(active===t.id?T.accent:T.textMuted)}</span><span style={{fontSize:10,fontWeight:active===t.id?700:500,color:active===t.id?T.accent:T.textMuted}}>{t.l}</span></div>)}</div>;}

// ============================================================
// S17: Mesajlar Listesi (Inbox)
// ============================================================
function S17({onNav}){
  const[search,setSearch]=useState("");
  const[tab,setTab]=useState("dm"); // "dm" | "group"
  const sorted=[...CONVERSATIONS].sort((a,b)=>a.ts-b.ts);
  const filtered=sorted.filter(c=>{
    if(tab==="dm"&&c.type!=="dm")return false;
    if(tab==="group"&&c.type!=="group")return false;
    if(!search)return true;
    const q=search.toLowerCase();
    if(c.type==="dm"){
      const u=uf(c.userId);
      return u?.name.toLowerCase().includes(q)||u?.un.toLowerCase().includes(q);
    }
    const m=MATCHES.find(m=>m.id===c.matchId);
    return m?.title.toLowerCase().includes(q);
  });
  const dmUnread=CONVERSATIONS.filter(c=>c.type==="dm"&&c.unread>0).length;
  const groupUnread=CONVERSATIONS.filter(c=>c.type==="group"&&c.unread>0).length;

  return <div style={{minHeight:"100vh",background:T.bg,fontFamily:FB,paddingBottom:72}}>
    {/* Header */}
    <div style={{position:"sticky",top:0,zIndex:50,background:T.bg,borderBottom:`1px solid ${T.cardBorder}`,padding:"16px 16px 12px"}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
        <div onClick={()=>window.location.assign("/02_feed")} style={{cursor:"pointer",display:"flex",padding:4}}>{I.arrowLeft(T.text)}</div>
        <h1 style={{fontFamily:FH,fontSize:20,fontWeight:800,color:T.text,margin:0}}>Mesajlar</h1>
      </div>
      {/* Search */}
      <div style={{position:"relative"}}>
        <div style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",display:"flex"}}>{I.search(T.textMuted)}</div>
        <input
          value={search}
          onChange={e=>setSearch(e.target.value)}
          placeholder="Konuşma ara..."
          style={{width:"100%",padding:"10px 12px 10px 36px",borderRadius:10,border:`1.5px solid ${T.cardBorder}`,background:T.card,color:T.text,fontSize:14,fontFamily:FB,outline:"none",boxSizing:"border-box"}}
          onFocus={e=>e.target.style.borderColor=T.accent}
          onBlur={e=>e.target.style.borderColor=T.cardBorder}
        />
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:0,marginTop:12}}>
        {[{id:"dm",label:"Sohbetler",unread:dmUnread},{id:"group",label:"Maç Sohbetleri",unread:groupUnread}].map(t=><div key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,textAlign:"center",padding:"10px 0",cursor:"pointer",borderBottom:`2px solid ${tab===t.id?T.accent:"transparent"}`,transition:"all .15s",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
          <span style={{fontSize:13,fontWeight:tab===t.id?700:500,color:tab===t.id?T.text:T.textMuted}}>{t.label}</span>
          {t.unread>0&&<span style={{background:T.accent,color:"#0D0D0D",fontSize:10,fontWeight:700,borderRadius:10,padding:"1px 6px",minWidth:16,textAlign:"center"}}>{t.unread}</span>}
        </div>)}
      </div>
    </div>

    {/* Conversation List */}
    {filtered.length===0?(
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"80px 20px",gap:16}}>
        {I.inbox(T.textMuted)}
        <span style={{fontSize:15,color:T.textDim,fontWeight:500}}>Henüz mesajın yok</span>
        <span style={{fontSize:13,color:T.textMuted,textAlign:"center"}}>Maça katıl veya birini takip et, sohbet başlat!</span>
      </div>
    ):(
      <div>
        {filtered.map(conv=>{
          if(conv.type==="dm"){
            const u=uf(conv.userId);
            if(!u)return null;
            return <div key={conv.id} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",borderBottom:`1px solid ${T.cardBorder}11`,cursor:"pointer",transition:"background .15s"}}
              onClick={()=>onNav?.("S18",{convId:conv.id,userId:conv.userId})}
              onMouseEnter={e=>e.currentTarget.style.background=`${T.card}88`}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}
            >
              <Av i={u.av} s={48} onClick={e=>{e.stopPropagation();onNav?.("S16",u.id)}}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontWeight:conv.unread>0?700:500,fontSize:14,color:T.text}}>{u.name}</span>
                  <span style={{fontSize:11,color:conv.unread>0?T.accent:T.textMuted,fontWeight:conv.unread>0?600:400,flexShrink:0}}>{conv.lastTime}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:3}}>
                  <span style={{fontSize:13,color:conv.unread>0?T.textDim:T.textMuted,fontWeight:conv.unread>0?500:400,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:220}}>{conv.lastMsg}</span>
                  {conv.unread>0&&<span style={{background:T.accent,color:"#0D0D0D",fontSize:10,fontWeight:700,borderRadius:10,padding:"1px 6px",minWidth:18,textAlign:"center",flexShrink:0}}>{conv.unread}</span>}
                </div>
              </div>
            </div>;
          }else{
            // Group chat (match sohbeti)
            const m=MATCHES.find(m=>m.id===conv.matchId);
            if(!m)return null;
            const sender=conv.lastSender?uf(conv.lastSender):null;
            return <div key={conv.id} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",borderBottom:`1px solid ${T.cardBorder}11`,cursor:"pointer",transition:"background .15s"}}
              onClick={()=>onNav?.("S35",{convId:conv.id,matchId:conv.matchId})}
              onMouseEnter={e=>e.currentTarget.style.background=`${T.card}88`}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}
            >
              <div onClick={e=>{e.stopPropagation();onNav?.("S12",conv.matchId)}} style={{width:48,height:48,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:`${T.accent}18`,border:`1.5px solid ${T.accent}44`,cursor:"pointer",flexShrink:0}}>
                {I.football(T.accent)}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontWeight:conv.unread>0?700:500,fontSize:14,color:T.text}}>{m.title}</span>
                  <span style={{fontSize:11,color:conv.unread>0?T.accent:T.textMuted,fontWeight:conv.unread>0?600:400,flexShrink:0}}>{conv.lastTime}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:3}}>
                  <span style={{fontSize:13,color:conv.unread>0?T.textDim:T.textMuted,fontWeight:conv.unread>0?500:400,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:220}}>
                    {sender?`${sender.name.split(" ")[0]}: `:""}{conv.lastMsg}
                  </span>
                  {conv.unread>0&&<span style={{background:T.accent,color:"#0D0D0D",fontSize:10,fontWeight:700,borderRadius:10,padding:"1px 6px",minWidth:18,textAlign:"center",flexShrink:0}}>{conv.unread}</span>}
                </div>
              </div>
            </div>;
          }
        })}
      </div>
    )}
  </div>;
}

// ============================================================
// S18: Sohbet Sayfası (1-1 Chat)
// ============================================================
function S18({userId,convId,onNav,onBack}){
  const other=uf(userId);
  const[messages,setMessages]=useState(()=>[...(DM_MESSAGES[convId]||[])]);
  const[input,setInput]=useState("");
  const[menuOpen,setMenuOpen]=useState(false);
  const chatEnd=useRef(null);
  const inputRef=useRef(null);

  useEffect(()=>{chatEnd.current?.scrollIntoView({behavior:"smooth"});},[messages]);

  const sendMsg=()=>{
    if(!input.trim())return;
    setMessages(prev=>[...prev,{id:Date.now(),from:ME.id,text:input.trim(),time:new Date().toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"}),read:false}]);
    setInput("");
    inputRef.current?.focus();
  };

  const handleKey=e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMsg();}};

  if(!other)return null;

  return <div style={{minHeight:"100vh",background:T.bg,fontFamily:FB,display:"flex",flexDirection:"column",maxHeight:"100vh"}}>
    {/* Header */}
    <div style={{position:"sticky",top:0,zIndex:50,background:T.bg,borderBottom:`1px solid ${T.cardBorder}`,padding:"12px 16px",display:"flex",alignItems:"center",gap:12}}>
      <div onClick={onBack} style={{cursor:"pointer",display:"flex",padding:4}}>{I.arrowLeft(T.text)}</div>
      <Av i={other.av} s={36} onClick={()=>onNav?.("S16",other.id)}/>
      <div style={{flex:1,cursor:"pointer"}} onClick={()=>onNav?.("S16",other.id)}>
        <div style={{fontWeight:700,fontSize:14,color:T.text}}>{other.name}</div>
        <div style={{fontSize:11,color:T.textMuted}}>@{other.un}</div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        {other.phone&&<div onClick={()=>alert(`WhatsApp: ${other.phone}`)} style={{cursor:"pointer",display:"flex",padding:4}} title="WhatsApp'a Geç">{I.whatsapp()}</div>}
        <div onClick={()=>setMenuOpen(!menuOpen)} style={{cursor:"pointer",display:"flex",padding:4,position:"relative"}}>
          {I.dots(T.textDim)}
          {menuOpen&&<div style={{position:"absolute",top:28,right:0,background:T.card,border:`1px solid ${T.cardBorder}`,borderRadius:12,padding:4,minWidth:180,boxShadow:"0 4px 16px rgba(0,0,0,.1)",zIndex:60}}>
            {other.phone&&<div onClick={()=>{alert(`WhatsApp: ${other.phone}`);setMenuOpen(false);}} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:8,cursor:"pointer",fontSize:13,color:T.text}} onMouseEnter={e=>e.currentTarget.style.background=`${T.cardBorder}66`} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              {I.whatsapp()}<span>WhatsApp'a Geç</span>
            </div>}
            <div onClick={()=>{alert("Kullanıcı engellendi");setMenuOpen(false);}} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:8,cursor:"pointer",fontSize:13,color:T.red}} onMouseEnter={e=>e.currentTarget.style.background=`${T.cardBorder}66`} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              {I.block()}<span>Engelle</span>
            </div>
            <div onClick={()=>{alert("Raporlandı");setMenuOpen(false);}} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:8,cursor:"pointer",fontSize:13,color:T.red}} onMouseEnter={e=>e.currentTarget.style.background=`${T.cardBorder}66`} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              {I.flag()}<span>Raporla</span>
            </div>
          </div>}
        </div>
      </div>
    </div>

    {/* Messages */}
    <div style={{flex:1,overflowY:"auto",padding:"16px 16px 8px",display:"flex",flexDirection:"column",gap:4}} onClick={()=>menuOpen&&setMenuOpen(false)}>
      {messages.map(msg=>{
        const isMe=msg.from===ME.id;

        // Invite card
        if(msg.type==="invite"){
          return <div key={msg.id} style={{alignSelf:isMe?"flex-end":"flex-start",maxWidth:"85%",margin:"8px 0"}}>
            <div style={{background:T.card,border:`1px solid ${T.cardBorder}`,borderRadius:16,padding:16,display:"flex",flexDirection:"column",gap:10}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:16}}>📩</span>
                <span style={{fontSize:13,color:T.text,fontWeight:500}}>{isMe?"Sen":"Ali"} {isMe?`${other.name}'i`:""} <strong>{msg.matchTitle}</strong>'na davet etti{isMe?"n":""}.</span>
              </div>
              <div onClick={()=>onNav?.("S12",msg.matchId)} style={{padding:"8px 16px",borderRadius:8,background:`${T.accent}18`,border:`1px solid ${T.accent}44`,textAlign:"center",cursor:"pointer",fontSize:13,fontWeight:600,color:T.accent}}>
                Detayları Gör
              </div>
            </div>
            <div style={{fontSize:10,color:T.textMuted,marginTop:3,textAlign:isMe?"right":"left"}}>{msg.time}</div>
          </div>;
        }

        // Regular message
        return <div key={msg.id} style={{alignSelf:isMe?"flex-end":"flex-start",maxWidth:"75%",marginBottom:2}}>
          <div style={{background:isMe?T.accent:`${T.card}`,border:isMe?"none":`1px solid ${T.cardBorder}`,borderRadius:isMe?"16px 16px 4px 16px":"16px 16px 16px 4px",padding:"10px 14px"}}>
            <div style={{fontSize:14,color:isMe?"#0D0D0D":T.text,lineHeight:1.4,wordBreak:"break-word"}}>{msg.text}</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:4,marginTop:2,justifyContent:isMe?"flex-end":"flex-start"}}>
            <span style={{fontSize:10,color:T.textMuted}}>{msg.time}</span>
            {isMe&&<span style={{display:"flex"}}>{msg.read?I.doubleCheck(T.accent):I.check(T.textMuted)}</span>}
          </div>
        </div>;
      })}
      <div ref={chatEnd}/>
    </div>

    {/* Input Bar */}
    <div style={{position:"sticky",bottom:0,background:T.bg,borderTop:`1px solid ${T.cardBorder}`,padding:"10px 12px",display:"flex",alignItems:"center",gap:8}}>
      <div style={{cursor:"pointer",display:"flex",padding:4}} onClick={()=>alert("Fotoğraf ekleme (demo)")}>{I.attach(T.textDim)}</div>
      <input
        ref={inputRef}
        value={input}
        onChange={e=>setInput(e.target.value)}
        onKeyDown={handleKey}
        placeholder="Mesaj yaz..."
        style={{flex:1,padding:"10px 14px",borderRadius:20,border:`1.5px solid ${T.cardBorder}`,background:T.card,color:T.text,fontSize:14,fontFamily:FB,outline:"none"}}
        onFocus={e=>e.target.style.borderColor=T.accent}
        onBlur={e=>e.target.style.borderColor=T.cardBorder}
      />
      <div onClick={sendMsg} style={{cursor:input.trim()?"pointer":"default",display:"flex",padding:4,opacity:input.trim()?1:.4,transition:"opacity .15s"}}>{I.send(input.trim()?T.accent:T.textMuted)}</div>
    </div>
  </div>;
}

// ============================================================
// S35: Maç Sohbeti (Grup Chat)
// ============================================================
function S35({matchId,convId,onNav,onBack}){
  const match=MATCHES.find(m=>m.id===matchId);
  const[messages,setMessages]=useState(()=>[...(GROUP_MESSAGES[convId]||[])]);
  const[input,setInput]=useState("");
  const[menuOpen,setMenuOpen]=useState(false);
  const chatEnd=useRef(null);
  const inputRef=useRef(null);

  useEffect(()=>{chatEnd.current?.scrollIntoView({behavior:"smooth"});},[messages]);

  const sendMsg=()=>{
    if(!input.trim())return;
    setMessages(prev=>[...prev,{id:Date.now(),from:ME.id,text:input.trim(),time:new Date().toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"}),read:false}]);
    setInput("");
    inputRef.current?.focus();
  };

  const handleKey=e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMsg();}};

  if(!match)return null;

  return <div style={{minHeight:"100vh",background:T.bg,fontFamily:FB,display:"flex",flexDirection:"column",maxHeight:"100vh"}}>
    {/* Header */}
    <div style={{position:"sticky",top:0,zIndex:50,background:T.bg,borderBottom:`1px solid ${T.cardBorder}`,padding:"12px 16px",display:"flex",alignItems:"center",gap:12}}>
      <div onClick={onBack} style={{cursor:"pointer",display:"flex",padding:4}}>{I.arrowLeft(T.text)}</div>
      <div onClick={()=>onNav?.("S12",matchId)} style={{width:36,height:36,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:`${T.accent}18`,border:`1.5px solid ${T.accent}44`,cursor:"pointer",flexShrink:0}}>
        {I.football(T.accent)}
      </div>
      <div style={{flex:1,cursor:"pointer"}} onClick={()=>onNav?.("S12",matchId)}>
        <div style={{fontWeight:700,fontSize:14,color:T.text}}>{match.title}</div>
        <div style={{display:"flex",alignItems:"center",gap:4}}>
          {I.users(T.textMuted)}
          <span style={{fontSize:11,color:T.textMuted}}>{match.players.length} katılımcı</span>
        </div>
      </div>
      <div onClick={()=>setMenuOpen(!menuOpen)} style={{cursor:"pointer",display:"flex",padding:4,position:"relative"}}>
        {I.dots(T.textDim)}
        {menuOpen&&<div style={{position:"absolute",top:28,right:0,background:T.card,border:`1px solid ${T.cardBorder}`,borderRadius:12,padding:4,minWidth:200,boxShadow:"0 4px 16px rgba(0,0,0,.1)",zIndex:60}}>
          <div onClick={()=>{onNav?.("S12",matchId);setMenuOpen(false);}} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:8,cursor:"pointer",fontSize:13,color:T.text}} onMouseEnter={e=>e.currentTarget.style.background=`${T.cardBorder}66`} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            {I.football(T.textDim)}<span>Maç Detayı</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:8,cursor:"pointer",fontSize:13,color:T.textDim}} onMouseEnter={e=>e.currentTarget.style.background=`${T.cardBorder}66`} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            {I.users(T.textDim)}<span>Katılımcılar ({match.players.length})</span>
          </div>
        </div>}
      </div>
    </div>

    {/* Match Info Bar */}
    <div style={{background:`${T.card}88`,padding:"8px 16px",display:"flex",alignItems:"center",gap:8,borderBottom:`1px solid ${T.cardBorder}11`}}>
      <span style={{fontSize:12,color:T.textMuted}}>{match.date} · {match.time}</span>
      <span style={{fontSize:12,color:T.textMuted}}>·</span>
      <span style={{fontSize:12,color:T.textMuted}}>{match.loc}</span>
      <Badge c={T.accent} st={{marginLeft:"auto"}}>{match.fmt}</Badge>
    </div>

    {/* Messages */}
    <div style={{flex:1,overflowY:"auto",padding:"16px 16px 8px",display:"flex",flexDirection:"column",gap:4}} onClick={()=>menuOpen&&setMenuOpen(false)}>
      {messages.map((msg,idx)=>{
        const isMe=msg.from===ME.id;
        const sender=uf(msg.from);
        const prevMsg=messages[idx-1];
        const showName=!isMe&&(!prevMsg||prevMsg.from!==msg.from);

        return <div key={msg.id} style={{alignSelf:isMe?"flex-end":"flex-start",maxWidth:"75%",marginBottom:2,marginTop:showName?8:0}}>
          <div style={{display:"flex",gap:8,alignItems:showName?"flex-start":"center"}}>
            {!isMe&&<div style={{width:28,flexShrink:0}}>
              {showName&&sender&&<Av i={sender.av} s={28} onClick={()=>onNav?.("S16",sender.id)}/>}
            </div>}
            <div style={{flex:1}}>
              {showName&&sender&&<div style={{fontSize:11,fontWeight:600,color:T.accent,marginBottom:3}}>{sender.name.split(" ")[0]}</div>}
              <div style={{background:isMe?T.accent:`${T.card}`,border:isMe?"none":`1px solid ${T.cardBorder}`,borderRadius:isMe?"16px 16px 4px 16px":"16px 16px 16px 4px",padding:"10px 14px"}}>
                <div style={{fontSize:14,color:isMe?"#0D0D0D":T.text,lineHeight:1.4,wordBreak:"break-word"}}>{msg.text}</div>
              </div>
              <div style={{fontSize:10,color:T.textMuted,marginTop:2,textAlign:isMe?"right":"left"}}>{msg.time}</div>
            </div>
          </div>
        </div>;
      })}
      <div ref={chatEnd}/>
    </div>

    {/* Input Bar */}
    <div style={{position:"sticky",bottom:0,background:T.bg,borderTop:`1px solid ${T.cardBorder}`,padding:"10px 12px",display:"flex",alignItems:"center",gap:8}}>
      <div style={{cursor:"pointer",display:"flex",padding:4}} onClick={()=>alert("Fotoğraf ekleme (demo)")}>{I.attach(T.textDim)}</div>
      <input
        ref={inputRef}
        value={input}
        onChange={e=>setInput(e.target.value)}
        onKeyDown={handleKey}
        placeholder="Mesaj yaz..."
        style={{flex:1,padding:"10px 14px",borderRadius:20,border:`1.5px solid ${T.cardBorder}`,background:T.card,color:T.text,fontSize:14,fontFamily:FB,outline:"none"}}
        onFocus={e=>e.target.style.borderColor=T.accent}
        onBlur={e=>e.target.style.borderColor=T.cardBorder}
      />
      <div onClick={sendMsg} style={{cursor:input.trim()?"pointer":"default",display:"flex",padding:4,opacity:input.trim()?1:.4,transition:"opacity .15s"}}>{I.send(input.trim()?T.accent:T.textMuted)}</div>
    </div>
  </div>;
}

// ============================================================
// S19: Bildirimler
// ============================================================
function S19({onNav,onBack}){
  const[notifs,setNotifs]=useState(()=>NOTIFICATIONS.map(n=>({...n})));
  const unreadCount=notifs.filter(n=>!n.read).length;

  const markAllRead=()=>setNotifs(prev=>prev.map(n=>({...n,read:true})));

  const handleNotifClick=(n)=>{
    setNotifs(prev=>prev.map(x=>x.id===n.id?{...x,read:true}:x));
    // Navigation based on type
    if(n.target==="profile"&&n.userId) onNav?.("S16",n.userId);
    else if(n.target==="profile") onNav?.("S15");
    else if(n.target==="match") onNav?.("S12",101);
    else if(n.target==="chat"&&n.userId) onNav?.("S18",{convId:"c3",userId:n.userId});
    else if(n.target==="post") onNav?.("S05");
    else if(n.target==="comments") onNav?.("S42");
    else if(n.target==="rating") onNav?.("S40");
    // "none" — bildirim sayfasında kalır
  };

  return <div style={{minHeight:"100vh",background:T.bg,fontFamily:FB,paddingBottom:72}}>
    {/* Header */}
    <div style={{position:"sticky",top:0,zIndex:50,background:T.bg,borderBottom:`1px solid ${T.cardBorder}`,padding:"12px 16px",display:"flex",alignItems:"center",gap:12}}>
      <div onClick={onBack} style={{cursor:"pointer",display:"flex",padding:4}}>{I.arrowLeft(T.text)}</div>
      <h1 style={{fontFamily:FH,fontSize:20,fontWeight:800,color:T.text,margin:0,flex:1}}>Bildirimler</h1>
      {unreadCount>0&&<div onClick={markAllRead} style={{cursor:"pointer",padding:"6px 12px",borderRadius:8,fontSize:12,fontWeight:600,color:T.accent,background:`${T.accent}15`}}>
        Tümünü Okundu İşaretle
      </div>}
    </div>

    {/* Notification List */}
    {notifs.length===0?(
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"80px 20px",gap:16}}>
        {I.bellEmpty(T.textMuted)}
        <span style={{fontSize:15,color:T.textDim,fontWeight:500}}>Bildirim yok</span>
        <span style={{fontSize:13,color:T.textMuted,textAlign:"center"}}>Yeni bildirimler burada görünecek</span>
      </div>
    ):(
      <div>
        {/* Unread section */}
        {unreadCount>0&&<>
          <div style={{padding:"12px 16px 8px",fontSize:12,fontWeight:700,color:T.accent,textTransform:"uppercase",letterSpacing:.5}}>Yeni ({unreadCount})</div>
          {notifs.filter(n=>!n.read).map(n=><NotifRow key={n.id} n={n} onClick={()=>handleNotifClick(n)}/>)}
          <div style={{height:1,background:T.cardBorder,margin:"4px 16px"}}/>
        </>}

        {/* Read section */}
        {notifs.some(n=>n.read)&&<>
          <div style={{padding:"12px 16px 8px",fontSize:12,fontWeight:600,color:T.textMuted,textTransform:"uppercase",letterSpacing:.5}}>Önceki</div>
          {notifs.filter(n=>n.read).map(n=><NotifRow key={n.id} n={n} onClick={()=>handleNotifClick(n)}/>)}
        </>}
      </div>
    )}
  </div>;
}

function NotifRow({n,onClick}){
  const u=n.userId?uf(n.userId):null;
  return <div onClick={onClick} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"12px 16px",cursor:n.target!=="none"?"pointer":"default",transition:"background .15s",background:n.read?"transparent":`${T.accent}08`}}
    onMouseEnter={e=>{if(n.target!=="none")e.currentTarget.style.background=`${T.card}88`;}}
    onMouseLeave={e=>e.currentTarget.style.background=n.read?"transparent":`${T.accent}08`}
  >
    {/* Icon + Avatar */}
    <div style={{position:"relative",flexShrink:0}}>
      {u?<Av i={u.av} s={40}/>:<div style={{width:40,height:40,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:`${T.card}`,border:`1.5px solid ${T.cardBorder}`,fontSize:18}}>{n.icon}</div>}
      {u&&<div style={{position:"absolute",bottom:-2,right:-2,width:20,height:20,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:T.bg,border:`1.5px solid ${T.cardBorder}`,fontSize:10}}>{n.icon}</div>}
    </div>

    {/* Content */}
    <div style={{flex:1,minWidth:0}}>
      <div style={{fontSize:13,color:n.read?T.textDim:T.text,fontWeight:n.read?400:500,lineHeight:1.4}}>{n.text}</div>
      <div style={{fontSize:11,color:T.textMuted,marginTop:3}}>{n.time}</div>
    </div>

    {/* Unread dot */}
    {!n.read&&<div style={{width:8,height:8,borderRadius:"50%",background:T.accent,flexShrink:0,marginTop:6}}/>}
  </div>;
}

// ============================================================
// Dev Ribbon (page navigator)
// ============================================================
function DevRibbon({page,setPage}){
  const pages=["S17","S18","S35","S19"];
  const labels={S17:"Mesajlar",S18:"Sohbet (1-1)",S35:"Maç Sohbeti",S19:"Bildirimler"};
  return <div style={{position:"fixed",top:0,left:0,right:0,zIndex:999,background:"rgba(11,15,20,.92)",backdropFilter:"blur(8px)",borderBottom:`1px solid ${T.cardBorder}`,display:"flex",alignItems:"center",gap:0,padding:"0 4px",maxWidth:430,margin:"0 auto",height:36}}>
    {pages.map(p=><div key={p} onClick={()=>setPage(p)} style={{padding:"8px 10px",fontSize:11,fontWeight:page===p?700:500,color:page===p?T.accent:T.textDim,cursor:"pointer",borderBottom:page===p?`2px solid ${T.accent}`:"2px solid transparent",transition:"all .15s",whiteSpace:"nowrap"}}>{p} {labels[p]}</div>)}
  </div>;
}

// ============================================================
// Main App
// ============================================================
export default function MessagingModule(){
  const[page,setPage]=useState(()=>{const v=new URLSearchParams(window.location.search).get("view");return v==="S19"?"S19":"S17";});
  const[chatData,setChatData]=useState(null); // {convId, userId} for S18, {convId, matchId} for S35

  const nav=(target,data)=>{
    if(target==="S17"){setPage("S17");setChatData(null);}
    else if(target==="S18"){setPage("S18");setChatData(data);}
    else if(target==="S35"){setPage("S35");setChatData(data);}
    else if(target==="S19"){setPage("S19");setChatData(null);}
    // Cross-module navigation (demo alerts)
    else if(target==="S16")alert(`→ Profil: ${uf(data)?.name||data}`);
    else if(target==="S12")alert(`→ Maç Detay: #${data}`);
    else if(target==="S15")alert("→ Kendi Profilin");
    else if(target==="S05")alert("→ Ana Sayfa / Feed");
    else if(target==="S42")alert("→ Yorumlar");
    else if(target==="S40")alert("→ Puanlama");
    else alert(`→ ${target}: ${JSON.stringify(data)}`);
  };

  const goBack=()=>{
    if(page==="S18"||page==="S35"||page==="S19"){setPage("S17");setChatData(null);}
  };

  return <div style={{maxWidth:430,margin:"0 auto",position:"relative",background:T.bg,minHeight:"100vh"}}>
    <DevRibbon page={page} setPage={p=>{setPage(p);setChatData(p==="S18"?{convId:"c1",userId:2}:p==="S35"?{convId:"g1",matchId:101}:null);}}/>
    <div style={{paddingTop:36}}>
      {page==="S17"&&<S17 onNav={nav}/>}
      {page==="S18"&&<S18 userId={chatData?.userId||2} convId={chatData?.convId||"c1"} onNav={nav} onBack={goBack}/>}
      {page==="S35"&&<S35 matchId={chatData?.matchId||101} convId={chatData?.convId||"g1"} onNav={nav} onBack={goBack}/>}
      {page==="S19"&&<S19 onNav={nav} onBack={goBack}/>}
    </div>
  </div>;
}