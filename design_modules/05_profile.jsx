import { useState, useEffect, useRef } from "react";
import T from "./theme.js";

// ============================================================
// SPORWAVE MODULE 5 — Profil (S15, S16, S22, S23)
// S15: Kendi Profilin (login gerekli)
// S16: Başka kullanıcının profili
// S22: Takipçiler & Takip Listesi
// S23: Profil Düzenle
// ============================================================
const FH="'Plus Jakarta Sans','SF Pro Display',-apple-system,sans-serif";
const FB="'SF Pro Display','SF Pro Text',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";

// Mock Users
const U=[
  {id:1,name:"Berk Yılmaz",un:"berk26",av:"BY",att:94,bio:"Halısaha tutkunu. Haftada 3 maç.",city:"Kadıköy",sports:["Futbol","Basketbol"],ig:"berk.ylmz",tw:"",gender:"Erkek",bday:"26.04.1998",followers:128,following:85,matches:47,goals:31,assists:18,wins:28,losses:12,draws:7,mvp:8,verified:true},
  {id:2,name:"Ali Demir",un:"alidemir",av:"AD",att:88,bio:"Defans oynarım.",city:"Beşiktaş",sports:["Futbol"],ig:"ali.dmr",tw:"",gender:"Erkek",bday:"12.09.1996",followers:64,following:42,matches:32,goals:5,assists:12,wins:18,losses:10,draws:4,mvp:2,verified:false},
  {id:3,name:"Mehmet Kaya",un:"mkaya",av:"MK",att:91,bio:"Kaleci. Pazar sabahları müsaitim.",city:"Üsküdar",sports:["Futbol","Voleybol"],ig:"",tw:"",gender:"Erkek",bday:"03.01.1995",followers:95,following:60,matches:28,goals:0,assists:3,wins:15,losses:8,draws:5,mvp:5,verified:true},
  {id:4,name:"Emre Çelik",un:"emrecelik",av:"EÇ",att:96,bio:"Forvet. Gol krallığı yarışında.",city:"Kadıköy",sports:["Futbol"],ig:"emre.celik",tw:"emrecelik_",gender:"Erkek",bday:"15.07.1997",followers:210,following:112,matches:41,goals:52,assists:24,wins:30,losses:7,draws:4,mvp:12,verified:true},
  {id:5,name:"Can Yıldız",un:"canyildiz",av:"CY",att:85,bio:"Yeni başladım ama bırakmam.",city:"Ataşehir",sports:["Futbol"],ig:"",tw:"",gender:"Erkek",bday:"22.11.2000",followers:18,following:35,matches:4,goals:2,assists:1,wins:2,losses:1,draws:1,mvp:0,verified:false},
  {id:6,name:"Oğuz Han",un:"oguzhan",av:"OH",att:92,bio:"Orta saha patronu.",city:"Beşiktaş",sports:["Futbol","Tenis"],ig:"oguz_han",tw:"",gender:"Erkek",bday:"08.03.1994",followers:145,following:78,matches:36,goals:14,assists:28,wins:22,losses:9,draws:5,mvp:6,verified:false},
  {id:7,name:"Kerem Aktaş",un:"keremm",av:"KA",att:78,bio:"",city:"Maltepe",sports:["Futbol"],ig:"",tw:"",gender:"Erkek",bday:"19.06.2001",followers:12,following:29,matches:14,goals:3,assists:2,wins:6,losses:5,draws:3,mvp:0,verified:false},
  {id:8,name:"Burak Şen",un:"buraksen",av:"BŞ",att:90,bio:"Hızlı kanat.",city:"Kadıköy",sports:["Futbol","Basketbol"],ig:"burak.sen",tw:"",gender:"Erkek",bday:"11.12.1999",followers:73,following:55,matches:22,goals:11,assists:15,wins:14,losses:5,draws:3,mvp:3,verified:false},
];
const ME=U[0]; // Berk = logged-in user
const uf=id=>U.find(u=>u.id===id);

// Mock: Follow relationships (who ME follows)
const FOLLOWING_IDS=new Set([2,4,6]);

// Match data (shared, immutable) — same as feed module
const M=[
  {id:1,title:"Kadıköy Halısaha Maçı",date:"25 Şub",time:"20:00",loc:"Kadıköy Spor",fmt:"6v6",sc:[5,3],dur:"1s 20dk",host:1,tA:[1,2,4],tB:[3,5,6],mvp:4},
  {id:3,title:"Beşiktaş Sahil Maçı",date:"28 Şub",time:"19:00",loc:"Beşiktaş Halısaha",fmt:"7v7",sc:[2,2],dur:"1s 10dk",host:6,tA:[6,3,7],tB:[1,5,8],mvp:6},
  {id:6,title:"Ataşehir Gece Maçı",date:"22 Şub",time:"21:30",loc:"Ataşehir Arena",fmt:"5v5",sc:[4,1],dur:"55dk",host:3,tA:[3,7,8],tB:[5,6],mvp:3},
  {id:7,title:"Bağdat Caddesi Derbi",date:"18 Şub",time:"20:00",loc:"Bağdat Caddesi Saha",fmt:"6v6",sc:[3,3],dur:"1s 15dk",host:1,tA:[1,4,8],tB:[2,6,3],mvp:4},
  {id:8,title:"Fenerbahçe Derbi",date:"20 Şub",time:"19:30",loc:"Fenerbahçe Sahası",fmt:"6v6",sc:[6,2],dur:"1s 25dk",host:4,tA:[4,1,8],tB:[2,5,7],mvp:4},
  {id:9,title:"Pazar Sabah Maçı",date:"16 Şub",time:"10:00",loc:"Kadıköy Spor",fmt:"5v5",sc:[2,1],dur:"50dk",host:4,tA:[4,6],tB:[3,5],mvp:4},
];
const mf=id=>M.find(m=>m.id===id);

// Mock: Match posts (two-layer: match data + personal post)
const POSTS=[
  {id:1,matchId:1,userId:1,caption:"Ev sahibi olarak güzel bir maçtı!",photos:2,likes:8,coms:3,likedByMe:false,status:"visible",
    likers:[4,2,3,5,6,7,8],
    comments:[{uid:4,text:"Süper organizasyondu 👏",t:"2sa"},{uid:2,text:"Tekrar yapalım!",t:"1sa"}]},
  {id:2,matchId:3,userId:1,caption:"Beraberlik de güzel",photos:0,likes:4,coms:1,likedByMe:false,status:"visible",
    likers:[2,6,5,8],
    comments:[{uid:6,text:"Hakem kötüydü ama olsun",t:"4sa"}]},
  {id:3,matchId:6,userId:1,caption:null,photos:1,likes:6,coms:2,likedByMe:false,status:"hidden",
    likers:[3,7,8,5,6,2],
    comments:[{uid:3,text:"Kalede sağlamdım",t:"1g"},{uid:8,text:"Güzel maçtı",t:"1g"}]},
  {id:4,matchId:7,userId:1,caption:"Çok zevkli maçtı!",photos:0,likes:11,coms:5,likedByMe:false,status:"visible",
    likers:[4,2,6,3,8,5,7],
    comments:[{uid:4,text:"Hat-trick yaptım!",t:"3g"},{uid:6,text:"Müthiş maçtı",t:"3g"}]},
  {id:5,matchId:1,userId:4,caption:"MVP seçilmek güzel hissettirdi",photos:0,likes:12,coms:4,likedByMe:false,status:"visible",
    likers:[1,2,3,5,6,7,8,4],
    comments:[{uid:1,text:"Hak ettin MVP'yi 👏",t:"2sa"},{uid:3,text:"Skor gerçekçi değil 😂",t:"45dk"}]},
  {id:6,matchId:8,userId:4,caption:"Hat-trick! Formun zirvesi.",photos:1,likes:18,coms:7,likedByMe:false,status:"visible",
    likers:[1,2,3,5,6,7,8],
    comments:[{uid:1,text:"Durdurulamıyorsun",t:"5sa"},{uid:8,text:"Asistler de güzeldi",t:"4sa"}]},
  {id:7,matchId:9,userId:4,caption:null,photos:0,likes:5,coms:2,likedByMe:false,status:"visible",
    likers:[6,3,5],
    comments:[{uid:6,text:"Pazar maçları harika",t:"1hf"}]},
  {id:8,matchId:1,userId:2,caption:null,photos:0,likes:4,coms:1,likedByMe:false,status:"visible",
    likers:[1,4,3,6],
    comments:[{uid:1,text:"Güzel oynadın",t:"2sa"}]},
  {id:9,matchId:3,userId:2,caption:"Defansta sağlam durduk",photos:0,likes:3,coms:0,likedByMe:false,status:"visible",
    likers:[1,6,8],comments:[]},
];

// Mock: Weekly activity (last 12 weeks)
const WEEKLY_ACTIVITY=[2,3,1,4,2,3,3,2,4,1,3,2];
const WEEKLY_GOALS=[1,2,0,3,1,2,2,1,3,0,2,1];
const WEEKLY_DURATION=[90,150,60,200,100,140,160,80,210,55,130,95];

// Badges
const BADGES=[
  {id:1,icon:"trophy",label:"50 Maç Kulübü",earned:false},
  {id:2,icon:"check",label:"%100 Katılım",earned:true},
  {id:3,icon:"mic",label:"Süper Organizatör",earned:true},
  {id:4,icon:"star",label:"MVP x5",earned:true},
  {id:5,icon:"fire",label:"4 Hafta Seri",earned:true},
  {id:6,icon:"new",label:"Yeni Üye",earned:true},
];

// Icons
const I={
  arrowLeft:c=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.text} strokeWidth="2" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12,19 5,12 12,5"/></svg>,
  edit:c=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  share:c=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16,6 12,2 8,6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>,
  settings:c=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  chat:c=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  check:c=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||T.accent} strokeWidth="3" strokeLinecap="round"><polyline points="20,6 9,17 4,12"/></svg>,
  dots:c=><svg width="16" height="16" viewBox="0 0 24 24" fill={c||T.textDim}><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>,
  search:c=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  user:c=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 10-16 0"/></svg>,
  users:c=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||T.textMuted} strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  heart:c=><svg width="14" height="14" viewBox="0 0 24 24" fill={c||"none"} stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  comment:c=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>,
  lock:c=><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c||T.textMuted} strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  whatsapp:c=><svg width="16" height="16" viewBox="0 0 24 24" fill={c||T.green}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
  flag:c=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||T.red} strokeWidth="2" strokeLinecap="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>,
  block:c=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||T.red} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>,
  chart:c=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.accent} strokeWidth="2" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  trophy:c=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.gold} strokeWidth="2" strokeLinecap="round"><path d="M6 9H4a2 2 0 01-2-2V5a2 2 0 012-2h2"/><path d="M18 9h2a2 2 0 002-2V5a2 2 0 00-2-2h-2"/><path d="M4 22h16"/><path d="M10 22V2h4v20"/><rect x="6" y="2" width="12" height="10" rx="2"/></svg>,
  calendar:c=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.purple} strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  camera:c=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  x:c=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  home:c=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>,
  football:c=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15 15 0 014 10 15 15 0 01-4 10 15 15 0 01-4-10 15 15 0 014-10z"/><path d="M2 12h20"/></svg>,
  instagram:c=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||T.purple} strokeWidth="2" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill={c||T.purple} stroke="none"/></svg>,
  twitter:c=><svg width="14" height="14" viewBox="0 0 24 24" fill={c||"#1DA1F2"}><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>,
  chevDown:c=><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2.5" strokeLinecap="round"><polyline points="6,9 12,15 18,9"/></svg>,
  fire:c=><svg width="16" height="16" viewBox="0 0 24 24" fill={c||T.orange} stroke={c||T.orange} strokeWidth="1"><path d="M12 23c-4.97 0-9-2.69-9-6s2.69-6 6-6c0-4 3-8 3-8s3 4 3 8c3.31 0 6 2.69 6 6s-4.03 6-9 6z"/></svg>,
  star:c=><svg width="16" height="16" viewBox="0 0 24 24" fill={c||T.gold} stroke={c||T.gold} strokeWidth="1"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>,
  heartFill:c=><svg width="14" height="14" viewBox="0 0 24 24" fill={c||T.red} stroke={c||T.red} strokeWidth="1"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  more:c=><svg width="16" height="16" viewBox="0 0 24 24" fill={c||T.textDim}><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>,
  clock:c=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||T.textMuted} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>,
  mapPin:c=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||T.textMuted} strokeWidth="2" strokeLinecap="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>,
  eyeOff:c=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||T.textDim} strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  trash:c=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||T.red} strokeWidth="2" strokeLinecap="round"><polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>,
};

// Shared Components
function Av({i,s=32,c=T.accent,onClick,st}){return <div onClick={onClick} style={{width:s,height:s,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:`${c}18`,border:`1.5px solid ${c}44`,color:c,fontSize:s*.34,fontWeight:700,cursor:onClick?"pointer":"default",flexShrink:0,...st}}>{i}</div>;}
function Btn({children,primary,danger,small,full,ghost,onClick,disabled,st}){const[h,setH]=useState(false);return <button disabled={disabled} onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{padding:small?"7px 14px":"12px 20px",borderRadius:10,border:primary||danger?"none":`1.5px solid ${ghost?"transparent":T.cardBorder}`,background:disabled?`${T.textDim}22`:danger?T.red:primary?T.accent:"transparent",color:disabled?T.textDim:danger?"#fff":primary?"#0D0D0D":T.text,fontSize:small?12:14,fontWeight:600,cursor:disabled?"not-allowed":"pointer",width:full?"100%":"auto",transition:"all .2s",transform:h&&!disabled?"translateY(-1px)":"none",display:"flex",alignItems:"center",justifyContent:"center",gap:6,...st}}>{children}</button>;}
function Badge({children,c=T.accent,st}){return <span style={{display:"inline-flex",alignItems:"center",gap:3,padding:"2px 8px",borderRadius:20,fontSize:11,fontWeight:600,color:c,background:`${c}15`,whiteSpace:"nowrap",...st}}>{children}</span>;}
function TabBar({active,onNav}){const tabs=[{id:"S05",ic:I.home,l:"Ana Sayfa"},{id:"S08",ic:I.football,l:"Maçlar"},{id:"S15",ic:I.user,l:"Profil"}];return <div style={{position:"fixed",bottom:0,left:0,right:0,height:56,background:T.bgAlt,borderTop:`1px solid ${T.cardBorder}`,display:"flex",justifyContent:"space-around",alignItems:"center",zIndex:100,maxWidth:430,margin:"0 auto"}}>{tabs.map(t=><div key={t.id} onClick={()=>onNav(t.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",padding:"6px 20px"}}><span style={{display:"flex"}}>{t.ic(active===t.id?T.accent:T.textMuted)}</span><span style={{fontSize:10,fontWeight:active===t.id?700:500,color:active===t.id?T.accent:T.textMuted}}>{t.l}</span></div>)}</div>;}
function StackAv({ids,max=3,s=24}){const vis=ids.slice(0,max);return <div style={{display:"flex"}}>{vis.map((uid,i)=>{const u=uf(uid);return u&&<div key={uid} style={{marginLeft:i>0?-8:0,zIndex:max-i,position:"relative"}}><Av i={u.av} s={s}/></div>;})}{ids.length>max&&<span style={{fontSize:10,color:T.textDim,marginLeft:4,fontWeight:600}}>+{ids.length-max}</span>}</div>;}

// Media Slider (photo carousel + scoreboard as last slide)
function MediaSlider({photoCount,scoreContent,onMatchNav}){
  const total=photoCount+1;
  const[cur,setCur]=useState(0);
  const prev=()=>setCur(c=>Math.max(0,c-1));
  const next=()=>setCur(c=>Math.min(total-1,c+1));
  const isScore=cur===total-1;
  return <div style={{position:"relative",overflow:"hidden",height:430}}>
    <div style={{display:"flex",height:"100%",transform:`translateX(-${cur*100}%)`,transition:"transform .28s ease"}}>
      {Array.from({length:photoCount},(_,i)=><div key={i} style={{minWidth:"100%",height:430,background:T.bgAlt,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:40,color:T.textMuted}}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>
      </div>)}
      <div onClick={onMatchNav} style={{minWidth:"100%",height:430,borderTop:`2px solid ${T.card}`,borderBottom:`2px solid ${T.card}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,cursor:"pointer"}}>{scoreContent}</div>
    </div>
    {cur>0&&<div onClick={prev} style={{position:"absolute",left:0,top:0,bottom:32,width:"35%",cursor:"pointer"}}/>}
    {cur<total-1&&<div onClick={next} style={{position:"absolute",right:0,top:0,bottom:32,width:"35%",cursor:"pointer"}}/>}
    <div style={{position:"absolute",top:10,right:10,background:"rgba(0,0,0,.6)",borderRadius:20,padding:"3px 9px",fontSize:11,color:"#fff",fontWeight:600}}>{isScore?<span style={{display:"flex"}}>{I.chart(T.accent)}</span>:`${cur+1}/${photoCount}`}</div>
    <div style={{position:"absolute",bottom:10,left:0,right:0,display:"flex",justifyContent:"center",gap:5}}>
      {Array.from({length:total},(_,i)=><div key={i} onClick={()=>setCur(i)} style={{width:i===cur?16:6,height:6,borderRadius:3,background:i===cur?T.accent:i===total-1?`${T.accent}55`:`${T.text}33`,transition:"all .2s",cursor:"pointer"}}/>)}
    </div>
  </div>;
}

// Post Card — feed-identical design (two-layer: match data + personal post)
function PostCard({p,isOwn,onMenuAction,onNav}){
  const[liked,setLiked]=useState(p.likedByMe||false);
  const[lc,setLc]=useState(p.likes);
  const[menuOpen,setMenuOpen]=useState(false);
  const owner=uf(p.userId);
  const m=mf(p.matchId);
  const all=m?[...(m.tA||[]),...(m.tB||[])]:[];
  const others=all.filter(uid=>uid!==p.userId);
  const mvp=m?uf(m.mvp):null;
  const firstLiker=p.likers?.[0]?uf(p.likers[0]):null;
  const visComments=(p.comments||[]).slice(0,2);
  const isHidden=p.status==="hidden";

  const toggleLike=e=>{e.stopPropagation();setLiked(!liked);setLc(c=>liked?c-1:c+1);};

  const scoreOnly=m?.sc?<div style={{textAlign:"center"}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
      <span style={{fontSize:11,color:T.textDim,marginRight:12}}>Takım A</span>
      <span style={{fontSize:38,fontWeight:900,letterSpacing:"-2px",fontFamily:FH}}>
        <span style={{color:m.sc[0]>m.sc[1]?T.accent:T.text}}>{m.sc[0]}</span>
        <span style={{color:T.textMuted,margin:"0 8px",fontSize:20}}>–</span>
        <span style={{color:m.sc[1]>m.sc[0]?T.accent:T.text}}>{m.sc[1]}</span>
      </span>
      <span style={{fontSize:11,color:T.textDim,marginLeft:12}}>Takım B</span>
    </div>
    {mvp&&<div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:4,marginTop:8}}>
      {I.star()} <span style={{fontSize:12,color:T.gold,fontWeight:600}}>{mvp.name}</span>
    </div>}
  </div>:null;

  return <div style={{background:"none",borderRadius:0,overflow:"hidden",position:"relative",opacity:isHidden?.7:1}}>
    {/* Hidden label */}
    {isHidden&&isOwn&&<div style={{display:"flex",alignItems:"center",gap:4,padding:"8px 16px 0"}}>{I.lock(T.textMuted)}<span style={{fontSize:11,color:T.textMuted,fontWeight:600}}>Gizli</span></div>}

    {/* Header — post owner */}
    <div style={{padding:"16px 16px 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div style={{display:"flex",alignItems:"center",gap:12,flex:1}}>
        <Av i={owner.av} s={36} onClick={()=>onNav?.("S16",owner.id)}/>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span onClick={()=>onNav?.("S16",owner.id)} style={{fontWeight:700,fontSize:14,color:T.text,cursor:"pointer"}}>{owner.name}</span>
            {isOwn&&<Badge c={T.accent}>Sen</Badge>}
          </div>
          <div style={{fontSize:12,color:T.textMuted,marginTop:2}}>@{owner.un} · {m?.date||""}</div>
        </div>
      </div>
      <div style={{position:"relative"}}>
        <span onClick={()=>setMenuOpen(!menuOpen)} style={{cursor:"pointer",display:"flex",padding:4}}>{I.more()}</span>
        {menuOpen&&<div style={{position:"absolute",top:28,right:0,background:T.card,border:`1px solid ${T.cardBorder}`,borderRadius:12,padding:8,zIndex:60,boxShadow:"0 4px 16px rgba(0,0,0,.1)",minWidth:160}}>
          {isOwn?<>
            <div onClick={()=>{setMenuOpen(false);onMenuAction?.("edit",p.id);}} style={{padding:"12px 16px",borderRadius:8,cursor:"pointer",display:"flex",alignItems:"center",gap:12}}><span style={{display:"flex"}}>{I.edit()}</span><span style={{fontSize:13,color:T.text}}>Düzenle</span></div>
            <div onClick={()=>{setMenuOpen(false);onMenuAction?.(isHidden?"unhide":"hide",p.id);}} style={{padding:"12px 16px",borderRadius:8,cursor:"pointer",display:"flex",alignItems:"center",gap:12}}><span style={{display:"flex"}}>{I.eyeOff()}</span><span style={{fontSize:13,color:T.text}}>{isHidden?"Gizliliği Kaldır":"Gizle"}</span></div>
            <div onClick={()=>{setMenuOpen(false);onMenuAction?.("delete",p.id);}} style={{padding:"12px 16px",borderRadius:8,cursor:"pointer",display:"flex",alignItems:"center",gap:12}}><span style={{display:"flex"}}>{I.trash()}</span><span style={{fontSize:13,color:T.red}}>Sil</span></div>
          </>:<>
            <div onClick={()=>setMenuOpen(false)} style={{padding:"12px 16px",borderRadius:8,cursor:"pointer",display:"flex",alignItems:"center",gap:12}}><span style={{display:"flex"}}>{I.flag()}</span><span style={{fontSize:13,color:T.text}}>Raporla</span></div>
            <div onClick={()=>setMenuOpen(false)} style={{padding:"12px 16px",borderRadius:8,cursor:"pointer",display:"flex",alignItems:"center",gap:12}}><span style={{display:"flex"}}>{I.eyeOff()}</span><span style={{fontSize:13,color:T.text}}>Engelle</span></div>
          </>}
        </div>}
      </div>
    </div>

    {/* Title */}
    {m&&<div style={{padding:"12px 16px 0",fontWeight:700,fontSize:16,color:T.text,fontFamily:FH}}>{m.title}</div>}

    {/* Caption */}
    {p.caption&&<div style={{padding:"6px 16px 0",fontSize:14,color:T.textDim,lineHeight:1.5}}>{p.caption}</div>}

    {/* Meta */}
    {m&&<div style={{padding:"8px 16px 0",display:"flex",gap:12,fontSize:12,color:T.textDim,alignItems:"center",flexWrap:"wrap"}}>
      <span style={{display:"flex",alignItems:"center",gap:4}}>{I.clock()} {m.dur}</span>
      <span style={{display:"flex",alignItems:"center",gap:4}}>{I.mapPin()} {m.loc?.split(" ")[0]}</span>
      <Badge c={T.textDim}>{m.fmt}</Badge>
      <span style={{display:"flex",alignItems:"center",gap:4}}>{I.users()} {all.length}</span>
    </div>}

    {/* Scoreboard / Photo area */}
    <div style={{marginTop:12}}>
      {p.photos>0
        ?<MediaSlider photoCount={p.photos} scoreContent={scoreOnly} onMatchNav={()=>onNav?.("S11",m?.id)}/>
        :<div onClick={()=>onNav?.("S11",m?.id)} style={{cursor:"pointer",borderTop:`2px solid ${T.card}`,borderBottom:`2px solid ${T.card}`,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px 16px"}}>
          {scoreOnly}
        </div>
      }
    </div>

    {/* Likers */}
    {lc>0&&<div style={{padding:"8px 16px 0",fontSize:12,color:T.textDim,display:"flex",alignItems:"center",gap:8,marginTop:8}}>
      <StackAv ids={(p.likers||[]).slice(0,3)} s={20}/>
      <span>
        <b onClick={()=>onNav?.("S16",firstLiker?.id)} style={{color:T.text,cursor:"pointer"}}>{liked?"Sen":firstLiker?.name?.split(" ")[0]}</b>
        {lc>1&&<span> ve <b style={{color:T.text}}>{lc-1} diğer kişiler beğendi</b></span>}
      </span>
    </div>}

    {/* Interaction row */}
    <div style={{padding:"12px 16px 0",display:"flex",gap:20,alignItems:"center"}}>
      <div onClick={toggleLike} style={{display:"flex",alignItems:"center",gap:4,cursor:"pointer",fontSize:13,color:liked?T.red:T.textDim,fontWeight:liked?600:400}}>
        {liked?I.heartFill():I.heart()} {lc}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:4,cursor:"pointer",fontSize:13,color:T.textDim}}>
        {I.comment()} {p.coms}
      </div>
      <div style={{display:"flex",alignItems:"center",cursor:"pointer"}}>
        {I.share()}
      </div>
    </div>

    {/* Comments — max 2 */}
    {visComments.length>0&&<div style={{padding:"8px 16px 0"}}>
      {visComments.map((c,i)=>{const cu=uf(c.uid);return cu&&<div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:8}}>
        <Av i={cu.av} s={24} onClick={()=>onNav?.("S16",cu.id)}/>
        <div style={{fontSize:14}}>
          <span onClick={()=>onNav?.("S16",cu.id)} style={{fontWeight:600,color:T.text,cursor:"pointer"}}>{cu.un}</span>
          <span style={{color:T.textMuted,marginLeft:8}}>{c.t}</span>
          <div style={{color:T.textDim,marginTop:2,lineHeight:1.5}}>{c.text}</div>
        </div>
      </div>;})}
    </div>}

    {/* Add comment */}
    <div style={{padding:"12px 16px 16px",display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
      <Av i={ME.av} s={24}/>
      <span style={{fontSize:13,color:T.textMuted}}>Bir yorum ekle...</span>
    </div>
  </div>;
}

// ============================================================
// S15: Kendi Profilin
// ============================================================
function S15({onNav}){
  const u=ME;
  const [timeFilter,setTimeFilter]=useState("3m");
  const [graphMetric,setGraphMetric]=useState("match");
  const [panelOpen,setPanelOpen]=useState(null); // "stats"|"badges"|"calendar"|null
  const [deleteConfirm,setDeleteConfirm]=useState(null);
  const [posts,setPosts]=useState(POSTS.filter(p=>p.userId===u.id));

  const timeLbl={["1m"]:"Son 1 ay",["3m"]:"Son 3 ay",["6m"]:"Son 6 ay",all:"Tüm zamanlar"};
  const [tfOpen,setTfOpen]=useState(false);

  const winRate=u.matches>0?Math.round(u.wins/u.matches*100):0;
  const weeklyData=graphMetric==="match"?WEEKLY_ACTIVITY:graphMetric==="goal"?WEEKLY_GOALS:WEEKLY_DURATION;
  const maxBar=Math.max(...weeklyData,1);

  // Match days for calendar mock
  const calDays=[3,7,10,14,17,18,21,22,25,28];

  const handlePostMenu=(action,postId)=>{
    if(action==="hide"){setPosts(ps=>ps.map(p=>p.id===postId?{...p,status:"hidden"}:p));}
    if(action==="unhide"){setPosts(ps=>ps.map(p=>p.id===postId?{...p,status:"visible"}:p));}
    if(action==="delete"){setDeleteConfirm(postId);}
  };

  return <div style={{paddingBottom:72}}>
    {/* Header actions */}
    <div style={{display:"flex",justifyContent:"flex-end",gap:12,padding:"16px 16px 0"}}>
      <div onClick={()=>onNav("S23")} style={{cursor:"pointer"}}>{I.edit(T.text)}</div>
      <div style={{cursor:"pointer"}}>{I.share(T.text)}</div>
      <div onClick={()=>onNav("S20")} style={{cursor:"pointer"}}>{I.settings(T.text)}</div>
    </div>

    {/* Profile top */}
    <div style={{padding:"8px 16px 0",display:"flex",flexDirection:"column",alignItems:"center"}}>
      <Av i={u.av} s={80} c={T.accent}/>
      <div style={{marginTop:12,display:"flex",alignItems:"center",gap:6}}>
        <span style={{fontSize:20,fontWeight:800,fontFamily:FH,color:T.text}}>{u.name}</span>
        {u.verified&&<span style={{display:"flex"}}>{I.check(T.accent)}</span>}
      </div>
      <div style={{fontSize:13,color:T.textDim,marginTop:2}}>@{u.un}</div>

      {/* Stats row */}
      <div style={{display:"flex",gap:28,marginTop:16}}>
        <div style={{textAlign:"center",cursor:"pointer"}}><div style={{fontSize:18,fontWeight:800,fontFamily:FH,color:T.text}}>{u.matches}</div><div style={{fontSize:11,color:T.textDim,fontWeight:600}}>Mac</div></div>
        <div onClick={()=>onNav("S22",{tab:"followers"})} style={{textAlign:"center",cursor:"pointer"}}><div style={{fontSize:18,fontWeight:800,fontFamily:FH,color:T.text}}>{u.followers}</div><div style={{fontSize:11,color:T.textDim,fontWeight:600}}>Takipci</div></div>
        <div onClick={()=>onNav("S22",{tab:"following"})} style={{textAlign:"center",cursor:"pointer"}}><div style={{fontSize:18,fontWeight:800,fontFamily:FH,color:T.text}}>{u.following}</div><div style={{fontSize:11,color:T.textDim,fontWeight:600}}>Takip</div></div>
      </div>

      {/* Attendance badge */}
      {u.matches>=5&&<Badge c={T.accent} st={{marginTop:12}}>%{u.att} Katilim</Badge>}
    </div>

    {/* Bio */}
    {u.bio&&<div style={{padding:"12px 16px 0",fontSize:13,color:T.textDim,lineHeight:1.4}}>{u.bio}</div>}

    {/* Weekly summary */}
    <div style={{padding:"16px 16px 0"}}>
      <div style={{fontSize:14,color:T.text,fontWeight:600}}><span style={{fontSize:20,fontWeight:900,fontFamily:FH,color:T.accent}}>3</span> mac bu hafta</div>
    </div>

    {/* Time filter */}
    <div style={{padding:"12px 16px 0",position:"relative"}}>
      <div onClick={()=>setTfOpen(!tfOpen)} style={{display:"inline-flex",alignItems:"center",gap:4,padding:"6px 12px",borderRadius:8,background:T.card,border:`1px solid ${T.cardBorder}`,cursor:"pointer",fontSize:12,color:T.textDim,fontWeight:600}}>
        {timeLbl[timeFilter]} {I.chevDown(T.textDim)}
      </div>
      {tfOpen&&<div style={{position:"absolute",top:44,left:16,background:T.bgAlt,border:`1px solid ${T.cardBorder}`,borderRadius:10,padding:4,zIndex:10}}>
        {Object.entries(timeLbl).map(([k,v])=><div key={k} onClick={()=>{setTimeFilter(k);setTfOpen(false);}} style={{padding:"8px 16px",fontSize:12,color:timeFilter===k?T.accent:T.text,fontWeight:600,cursor:"pointer",borderRadius:6}}>{v}</div>)}
      </div>}
    </div>

    {/* Activity graph */}
    <div style={{padding:"16px 16px 0"}}>
      <div style={{display:"flex",alignItems:"flex-end",gap:4,height:80,marginBottom:8}}>
        {weeklyData.map((v,i)=><div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
          <div style={{width:"100%",height:Math.max(4,v/maxBar*64),borderRadius:4,background:i===weeklyData.length-1?T.accent:`${T.accent}44`,transition:"height .3s"}}/>
        </div>)}
      </div>
      {/* Metric pills */}
      <div style={{display:"flex",gap:8}}>
        {[{k:"match",l:"Mac"},{k:"goal",l:"Gol"},{k:"duration",l:"Sure"}].map(m=><div key={m.k} onClick={()=>setGraphMetric(m.k)} style={{padding:"4px 12px",borderRadius:20,fontSize:11,fontWeight:600,background:graphMetric===m.k?T.accent:`${T.textDim}22`,color:graphMetric===m.k?"#0D0D0D":T.textDim,cursor:"pointer"}}>{m.l}</div>)}
      </div>
    </div>

    {/* Pano (3 cards) */}
    <div style={{padding:"20px 16px 0",display:"flex",gap:8}}>
      <div onClick={()=>setPanelOpen(panelOpen==="stats"?null:"stats")} style={{flex:1,background:T.card,borderRadius:12,border:`1px solid ${panelOpen==="stats"?T.accent:T.cardBorder}`,padding:12,textAlign:"center",cursor:"pointer"}}>
        {I.chart(T.accent)}
        <div style={{fontSize:12,fontWeight:700,color:T.text,marginTop:4}}>Istatistikler</div>
      </div>
      <div onClick={()=>setPanelOpen(panelOpen==="badges"?null:"badges")} style={{flex:1,background:T.card,borderRadius:12,border:`1px solid ${panelOpen==="badges"?T.gold:T.cardBorder}`,padding:12,textAlign:"center",cursor:"pointer"}}>
        {I.trophy(T.gold)}
        <div style={{fontSize:12,fontWeight:700,color:T.text,marginTop:4}}>Basarilar</div>
      </div>
      <div onClick={()=>setPanelOpen(panelOpen==="calendar"?null:"calendar")} style={{flex:1,background:T.card,borderRadius:12,border:`1px solid ${panelOpen==="calendar"?T.purple:T.cardBorder}`,padding:12,textAlign:"center",cursor:"pointer"}}>
        {I.calendar(T.purple)}
        <div style={{fontSize:12,fontWeight:700,color:T.text,marginTop:4}}>Takvim</div>
      </div>
    </div>

    {/* Panel expand */}
    {panelOpen==="stats"&&<div style={{margin:"8px 16px 0",background:T.card,borderRadius:12,border:`1px solid ${T.accent}33`,padding:16}}>
      <div style={{fontSize:14,fontWeight:700,color:T.text,fontFamily:FH,marginBottom:12}}>Istatistikler</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
        {[
          {l:"Toplam Mac",v:u.matches},{l:"Galibiyet",v:u.wins},{l:"Maglubiyet",v:u.losses},
          {l:"Beraberlik",v:u.draws},{l:"Kazanma %",v:`%${winRate}`},{l:"Toplam Gol",v:u.goals},
          {l:"Toplam Asist",v:u.assists},{l:"MVP",v:u.mvp},
        ].map((s,i)=><div key={i} style={{textAlign:"center"}}>
          <div style={{fontSize:18,fontWeight:900,fontFamily:FH,color:T.accent}}>{s.v}</div>
          <div style={{fontSize:10,color:T.textDim,fontWeight:600,marginTop:2}}>{s.l}</div>
        </div>)}
      </div>
    </div>}

    {panelOpen==="badges"&&<div style={{margin:"8px 16px 0",background:T.card,borderRadius:12,border:`1px solid ${T.gold}33`,padding:16}}>
      <div style={{fontSize:14,fontWeight:700,color:T.text,fontFamily:FH,marginBottom:12}}>Basarilar</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
        {BADGES.map(b=><div key={b.id} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 12px",borderRadius:20,background:b.earned?`${T.gold}15`:`${T.textDim}10`,border:`1px solid ${b.earned?`${T.gold}33`:`${T.textDim}22`}`}}>
          <span style={{fontSize:13}}>{b.icon==="trophy"?I.trophy(b.earned?T.gold:T.textMuted):b.icon==="check"?I.check(b.earned?T.green:T.textMuted):b.icon==="star"?<svg width="14" height="14" viewBox="0 0 24 24" fill={b.earned?T.gold:T.textMuted}><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>:b.icon==="fire"?I.fire(b.earned?T.orange:T.textMuted):b.icon==="mic"?<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={b.earned?T.accent:T.textMuted} strokeWidth="2" strokeLinecap="round"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>:b.icon==="new"?<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={b.earned?T.accent:T.textMuted} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>:null}</span>
          <span style={{fontSize:11,fontWeight:600,color:b.earned?T.text:T.textMuted}}>{b.label}</span>
        </div>)}
      </div>
    </div>}

    {panelOpen==="calendar"&&<div style={{margin:"8px 16px 0",background:T.card,borderRadius:12,border:`1px solid ${T.purple}33`,padding:16}}>
      <div style={{fontSize:14,fontWeight:700,color:T.text,fontFamily:FH,marginBottom:12}}>Subat 2026</div>
      {/* Days header */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:4}}>
        {["Pt","Sa","Ca","Pe","Cu","Ct","Pz"].map(d=><div key={d} style={{fontSize:10,color:T.textMuted,fontWeight:600,textAlign:"center"}}>{d}</div>)}
      </div>
      {/* Calendar grid (Feb 2026 starts on Sunday=7th col, 28 days) */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4}}>
        {/* 6 empty cells for offset (Feb 1, 2026 = Sunday) */}
        {[...Array(6)].map((_,i)=><div key={`e${i}`}/>)}
        {[...Array(28)].map((_,i)=>{
          const day=i+1;
          const hasMatch=calDays.includes(day);
          return <div key={day} style={{textAlign:"center",padding:4,borderRadius:6,cursor:hasMatch?"pointer":"default",background:hasMatch?`${T.accent}15`:"transparent"}}>
            <div style={{fontSize:12,fontWeight:hasMatch?700:500,color:hasMatch?T.accent:T.textDim}}>{day}</div>
            {hasMatch&&<div style={{width:4,height:4,borderRadius:2,background:T.accent,margin:"2px auto 0"}}/>}
          </div>;
        })}
      </div>
    </div>}

    {/* Streak */}
    <div style={{padding:"16px 16px 0",display:"flex",alignItems:"center",gap:8}}>
      {I.fire(T.orange)}
      <span style={{fontSize:14,fontWeight:700,color:T.text}}>4 haftalik serin!</span>
    </div>
    <div style={{padding:"4px 16px 0",fontSize:12,color:T.textDim}}>En uzun seri: 6 hafta</div>

    {/* Badges (horizontal scroll) */}
    <div style={{padding:"16px 16px 0"}}>
      <div style={{fontSize:14,fontWeight:700,color:T.text,fontFamily:FH,marginBottom:8}}>Rozetler</div>
      <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4}}>
        {BADGES.filter(b=>b.earned).map(b=><Badge key={b.id} c={T.gold} st={{whiteSpace:"nowrap",flexShrink:0}}>{b.label}</Badge>)}
      </div>
    </div>

    {/* Match post feed */}
    <div style={{padding:"20px 16px 0"}}>
      <div style={{fontSize:14,fontWeight:700,color:T.text,fontFamily:FH,marginBottom:12}}>Mac Postlari</div>
      {posts.map(p=><PostCard key={p.id} p={p} isOwn={true} onMenuAction={handlePostMenu} onNav={onNav}/>)}
      {posts.length===0&&<div style={{textAlign:"center",padding:40,color:T.textMuted,fontSize:13}}>Henuz post yok</div>}
    </div>

    {/* Delete confirm popup */}
    {deleteConfirm!==null&&<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,.35)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300,padding:20}}>
      <div style={{background:T.card,borderRadius:16,padding:24,maxWidth:320,width:"100%",textAlign:"center"}}>
        <div style={{fontSize:16,fontWeight:700,color:T.text,fontFamily:FH,marginBottom:8}}>Postu Sil</div>
        <div style={{fontSize:13,color:T.textDim,marginBottom:20,lineHeight:1.4}}>Bu post kalici olarak silinecek. Bu islem geri alinamaz.</div>
        <Btn full danger onClick={()=>{setPosts(ps=>ps.filter(p=>p.id!==deleteConfirm));setDeleteConfirm(null);}} st={{marginBottom:8}}>Evet, Sil</Btn>
        <Btn full onClick={()=>setDeleteConfirm(null)}>Vazgec</Btn>
      </div>
    </div>}

    <TabBar active="S15" onNav={onNav}/>
  </div>;
}

// ============================================================
// S16: Baska Kullanicinin Profili
// ============================================================
function S16({onNav,userId}){
  const u=uf(userId||4); // Default: Emre Celik
  const [followState,setFollowState]=useState(FOLLOWING_IDS.has(u.id)?"following":"not_following"); // "not_following"|"following"|"mutual"
  const [unfollowConfirm,setUnfollowConfirm]=useState(false);
  const [menuOpen,setMenuOpen]=useState(false);
  const [graphMetric,setGraphMetric]=useState("match");
  const [timeFilter,setTimeFilter]=useState("3m");
  const [tfOpen,setTfOpen]=useState(false);
  const timeLbl={["1m"]:"Son 1 ay",["3m"]:"Son 3 ay",["6m"]:"Son 6 ay",all:"Tum zamanlar"};

  // Check if mutual
  const isMutual=followState==="following"&&u.id===4; // Mock: Emre is mutual

  const weeklyData=graphMetric==="match"?WEEKLY_ACTIVITY:graphMetric==="goal"?WEEKLY_GOALS:WEEKLY_DURATION;
  const maxBar=Math.max(...weeklyData,1);

  const userPosts=POSTS.filter(p=>p.userId===u.id&&p.status==="visible");

  return <div style={{paddingBottom:72}}>
    {/* Header */}
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 16px 0"}}>
      <div onClick={()=>onNav("S15")} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>{I.arrowLeft(T.text)}</div>
      <div onClick={()=>setMenuOpen(!menuOpen)} style={{cursor:"pointer",padding:4,position:"relative"}}>
        {I.dots(T.text)}
        {menuOpen&&<div style={{position:"absolute",top:28,right:0,background:T.bgAlt,border:`1px solid ${T.cardBorder}`,borderRadius:10,padding:4,zIndex:10,minWidth:160}}>
          <div onClick={()=>setMenuOpen(false)} style={{padding:"8px 12px",fontSize:13,color:T.red,cursor:"pointer",borderRadius:6,display:"flex",alignItems:"center",gap:6}}>{I.flag(T.red)} Raporla</div>
          <div onClick={()=>setMenuOpen(false)} style={{padding:"8px 12px",fontSize:13,color:T.red,cursor:"pointer",borderRadius:6,display:"flex",alignItems:"center",gap:6}}>{I.block(T.red)} Engelle</div>
          {followState==="following"&&<div onClick={()=>{setMenuOpen(false);setUnfollowConfirm(true);}} style={{padding:"8px 12px",fontSize:13,color:T.textDim,cursor:"pointer",borderRadius:6}}>Takipten Cik</div>}
        </div>}
      </div>
    </div>

    {/* Profile top */}
    <div style={{padding:"8px 16px 0",display:"flex",flexDirection:"column",alignItems:"center"}}>
      <Av i={u.av} s={80} c={T.accent}/>
      <div style={{marginTop:12,display:"flex",alignItems:"center",gap:6}}>
        <span style={{fontSize:20,fontWeight:800,fontFamily:FH,color:T.text}}>{u.name}</span>
        {u.verified&&<span style={{display:"flex"}}>{I.check(T.accent)}</span>}
      </div>
      <div style={{fontSize:13,color:T.textDim,marginTop:2}}>@{u.un}</div>

      {/* Stats row */}
      <div style={{display:"flex",gap:28,marginTop:16}}>
        <div style={{textAlign:"center"}}><div style={{fontSize:18,fontWeight:800,fontFamily:FH,color:T.text}}>{u.matches}</div><div style={{fontSize:11,color:T.textDim,fontWeight:600}}>Mac</div></div>
        <div onClick={()=>onNav("S22",{tab:"followers",uid:u.id})} style={{textAlign:"center",cursor:"pointer"}}><div style={{fontSize:18,fontWeight:800,fontFamily:FH,color:T.text}}>{u.followers}</div><div style={{fontSize:11,color:T.textDim,fontWeight:600}}>Takipci</div></div>
        <div onClick={()=>onNav("S22",{tab:"following",uid:u.id})} style={{textAlign:"center",cursor:"pointer"}}><div style={{fontSize:18,fontWeight:800,fontFamily:FH,color:T.text}}>{u.following}</div><div style={{fontSize:11,color:T.textDim,fontWeight:600}}>Takip</div></div>
      </div>

      {/* Attendance badge */}
      {u.matches>=5&&<Badge c={T.accent} st={{marginTop:12}}>%{u.att} Katilim</Badge>}

      {/* Mutual label */}
      {isMutual&&followState==="following"&&<Badge c={T.green} st={{marginTop:8}}>Arkadas</Badge>}
    </div>

    {/* Bio */}
    {u.bio&&<div style={{padding:"12px 16px 0",fontSize:13,color:T.textDim,lineHeight:1.4}}>{u.bio}</div>}

    {/* Follow + action buttons */}
    <div style={{padding:"16px 16px 0",display:"flex",gap:8}}>
      {followState==="not_following"?
        <Btn full primary onClick={()=>setFollowState("following")}>{I.users(T.bg)} Takip Et</Btn>:
        <Btn full onClick={()=>setUnfollowConfirm(true)} st={{flex:1}}>{I.check(T.accent)} Takip Ediliyor</Btn>
      }
      <Btn onClick={()=>onNav("S18")} st={{flex:1}}>{I.chat(T.text)} Mesaj Gonder</Btn>
    </div>

    {/* Time filter */}
    <div style={{padding:"16px 16px 0",position:"relative"}}>
      <div onClick={()=>setTfOpen(!tfOpen)} style={{display:"inline-flex",alignItems:"center",gap:4,padding:"6px 12px",borderRadius:8,background:T.card,border:`1px solid ${T.cardBorder}`,cursor:"pointer",fontSize:12,color:T.textDim,fontWeight:600}}>
        {timeLbl[timeFilter]} {I.chevDown(T.textDim)}
      </div>
      {tfOpen&&<div style={{position:"absolute",top:52,left:16,background:T.bgAlt,border:`1px solid ${T.cardBorder}`,borderRadius:10,padding:4,zIndex:10}}>
        {Object.entries(timeLbl).map(([k,v])=><div key={k} onClick={()=>{setTimeFilter(k);setTfOpen(false);}} style={{padding:"8px 16px",fontSize:12,color:timeFilter===k?T.accent:T.text,fontWeight:600,cursor:"pointer",borderRadius:6}}>{v}</div>)}
      </div>}
    </div>

    {/* Activity graph */}
    <div style={{padding:"16px 16px 0"}}>
      <div style={{display:"flex",alignItems:"flex-end",gap:4,height:80,marginBottom:8}}>
        {weeklyData.map((v,i)=><div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
          <div style={{width:"100%",height:Math.max(4,v/maxBar*64),borderRadius:4,background:i===weeklyData.length-1?T.accent:`${T.accent}44`,transition:"height .3s"}}/>
        </div>)}
      </div>
      <div style={{display:"flex",gap:8}}>
        {[{k:"match",l:"Mac"},{k:"goal",l:"Gol"},{k:"duration",l:"Sure"}].map(m=><div key={m.k} onClick={()=>setGraphMetric(m.k)} style={{padding:"4px 12px",borderRadius:20,fontSize:11,fontWeight:600,background:graphMetric===m.k?T.accent:`${T.textDim}22`,color:graphMetric===m.k?"#0D0D0D":T.textDim,cursor:"pointer"}}>{m.l}</div>)}
      </div>
    </div>

    {/* Streak */}
    <div style={{padding:"16px 16px 0",display:"flex",alignItems:"center",gap:8}}>
      {I.fire(T.orange)}
      <span style={{fontSize:14,fontWeight:700,color:T.text}}>6 haftalik seri!</span>
    </div>
    <div style={{padding:"4px 16px 0",fontSize:12,color:T.textDim}}>En uzun seri: 8 hafta</div>

    {/* Badges */}
    <div style={{padding:"16px 16px 0"}}>
      <div style={{fontSize:14,fontWeight:700,color:T.text,fontFamily:FH,marginBottom:8}}>Rozetler</div>
      <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4}}>
        {BADGES.filter(b=>b.earned).map(b=><Badge key={b.id} c={T.gold} st={{whiteSpace:"nowrap",flexShrink:0}}>{b.label}</Badge>)}
      </div>
    </div>

    {/* Match post feed */}
    <div style={{padding:"20px 16px 0"}}>
      <div style={{fontSize:14,fontWeight:700,color:T.text,fontFamily:FH,marginBottom:12}}>Mac Postlari</div>
      {userPosts.map(p=><PostCard key={p.id} p={p} isOwn={false} onNav={onNav}/>)}
      {userPosts.length===0&&<div style={{textAlign:"center",padding:40,color:T.textMuted,fontSize:13}}>Henuz post yok</div>}
    </div>

    {/* Unfollow confirm */}
    {unfollowConfirm&&<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,.35)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300,padding:20}}>
      <div style={{background:T.card,borderRadius:16,padding:24,maxWidth:320,width:"100%",textAlign:"center"}}>
        <Av i={u.av} s={56} c={T.accent} st={{margin:"0 auto 12"}}/>
        <div style={{fontSize:16,fontWeight:700,color:T.text,fontFamily:FH,marginBottom:4}}>Takipten Cik</div>
        <div style={{fontSize:13,color:T.textDim,marginBottom:20}}>{u.name} adli kisinin takibini birakmak istiyor musun?</div>
        <Btn full danger onClick={()=>{setFollowState("not_following");setUnfollowConfirm(false);}} st={{marginBottom:8}}>Takipten Cik</Btn>
        <Btn full onClick={()=>setUnfollowConfirm(false)}>Vazgec</Btn>
      </div>
    </div>}

    <TabBar active="S15" onNav={onNav}/>
  </div>;
}

// ============================================================
// S22: Takipciler & Takip Listesi
// ============================================================
function S22({onNav,data}){
  const [tab,setTab]=useState(data?.tab==="following"?"following":"followers");
  const [search,setSearch]=useState("");
  const [follows,setFollows]=useState(new Set(FOLLOWING_IDS));

  // Mock: followers/following lists
  const followersList=[2,3,4,6,7,8];
  const followingList=[2,4,6];
  const list=(tab==="followers"?followersList:followingList).map(id=>uf(id)).filter(Boolean);
  const filtered=search?list.filter(u=>u.name.toLowerCase().includes(search.toLowerCase())||u.un.toLowerCase().includes(search.toLowerCase())):list;

  return <div style={{paddingBottom:20}}>
    {/* Header */}
    <div style={{display:"flex",alignItems:"center",gap:12,padding:"16px 16px 12px"}}>
      <div onClick={()=>onNav("S15")} style={{cursor:"pointer"}}>{I.arrowLeft(T.text)}</div>
      <div style={{fontSize:16,fontWeight:700,fontFamily:FH,color:T.text}}>@{ME.un}</div>
    </div>

    {/* Tabs */}
    <div style={{display:"flex",borderBottom:`1px solid ${T.cardBorder}`}}>
      <div onClick={()=>setTab("followers")} style={{flex:1,textAlign:"center",padding:"10px 0",fontSize:13,fontWeight:600,color:tab==="followers"?T.accent:T.textDim,borderBottom:tab==="followers"?`2px solid ${T.accent}`:"2px solid transparent",cursor:"pointer"}}>Takipciler ({followersList.length})</div>
      <div onClick={()=>setTab("following")} style={{flex:1,textAlign:"center",padding:"10px 0",fontSize:13,fontWeight:600,color:tab==="following"?T.accent:T.textDim,borderBottom:tab==="following"?`2px solid ${T.accent}`:"2px solid transparent",cursor:"pointer"}}>Takip ({followingList.length})</div>
    </div>

    {/* Search */}
    <div style={{padding:"12px 16px"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,background:T.card,border:`1px solid ${T.cardBorder}`,borderRadius:10,padding:"10px 12px"}}>
        {I.search(T.textMuted)}
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Ara..." style={{background:"none",border:"none",outline:"none",color:T.text,fontSize:14,fontFamily:FB,width:"100%"}}/>
      </div>
    </div>

    {/* List */}
    <div style={{padding:"0 16px"}}>
      {filtered.map(u=><div key={u.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:`1px solid ${T.cardBorder}`}}>
        <Av i={u.av} s={40} c={T.accent} onClick={()=>onNav("S16",u.id)}/>
        <div onClick={()=>onNav("S16",u.id)} style={{flex:1,cursor:"pointer"}}>
          <div style={{fontSize:14,fontWeight:600,color:T.text}}>{u.name}</div>
          <div style={{fontSize:12,color:T.textDim}}>@{u.un}</div>
        </div>
        {u.id!==ME.id&&(follows.has(u.id)?
          <Btn small onClick={()=>setFollows(prev=>{const n=new Set(prev);n.delete(u.id);return n;})}>Takip Ediliyor</Btn>:
          <Btn small primary onClick={()=>setFollows(prev=>new Set(prev).add(u.id))}>Takip Et</Btn>
        )}
      </div>)}
      {filtered.length===0&&<div style={{textAlign:"center",padding:40,color:T.textMuted,fontSize:13}}>Sonuc bulunamadi</div>}
    </div>
  </div>;
}

// ============================================================
// S23: Profil Duzenle
// ============================================================
function S23({onNav}){
  const u=ME;
  const [form,setForm]=useState({
    un:u.un,
    name:u.name.split(" ")[0],
    surname:u.name.split(" ").slice(1).join(" "),
    bio:u.bio||"",
    bday:u.bday||"",
    gender:u.gender||"",
    city:u.city||"",
    sports:u.sports||[],
    ig:u.ig||"",
    tw:u.tw||"",
  });
  const [saved,setSaved]=useState(false);
  const [photoSheet,setPhotoSheet]=useState(false);

  const sportOptions=["Futbol","Basketbol","Voleybol","Tenis","Yuzme","Badminton"];
  const genderOptions=["Erkek","Kadin","Belirtmek istemiyorum"];

  const upd=(k,v)=>setForm(f=>({...f,[k]:v}));
  const toggleSport=s=>{
    setForm(f=>({...f,sports:f.sports.includes(s)?f.sports.filter(x=>x!==s):[...f.sports,s]}));
  };

  const handleSave=()=>{setSaved(true);setTimeout(()=>setSaved(false),2000);};

  const inputStyle={background:T.card,border:`1px solid ${T.cardBorder}`,borderRadius:10,padding:"12px 14px",color:T.text,fontSize:14,fontFamily:FB,width:"100%",outline:"none",boxSizing:"border-box"};
  const labelStyle={fontSize:12,fontWeight:600,color:T.textDim,marginBottom:4,display:"block"};

  return <div style={{paddingBottom:20}}>
    {/* Header */}
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 16px 0"}}>
      <div onClick={()=>onNav("S15")} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>{I.arrowLeft(T.text)}<span style={{fontSize:14,fontWeight:600,color:T.text}}>Geri</span></div>
      <div style={{fontSize:16,fontWeight:700,fontFamily:FH,color:T.text}}>Profili Duzenle</div>
      <div style={{width:52}}/>
    </div>

    {/* Photo */}
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"20px 16px 0"}}>
      <div style={{position:"relative"}}>
        <Av i={ME.av} s={80} c={T.accent}/>
        <div onClick={()=>setPhotoSheet(true)} style={{position:"absolute",bottom:-2,right:-2,width:28,height:28,borderRadius:"50%",background:T.accent,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",border:`2px solid ${T.bg}`}}>{I.camera(T.bg)}</div>
      </div>
      <div onClick={()=>setPhotoSheet(true)} style={{fontSize:13,color:T.accent,fontWeight:600,marginTop:8,cursor:"pointer"}}>Degistir</div>
    </div>

    {/* Form */}
    <div style={{padding:"20px 16px 0",display:"flex",flexDirection:"column",gap:16}}>
      {/* Username */}
      <div>
        <label style={labelStyle}>Kullanici Adi</label>
        <div style={{display:"flex",alignItems:"center",gap:0}}>
          <span style={{...inputStyle,width:"auto",borderTopRightRadius:0,borderBottomRightRadius:0,borderRight:"none",color:T.textMuted,padding:"12px 8px 12px 14px"}}>@</span>
          <input value={form.un} onChange={e=>upd("un",e.target.value)} style={{...inputStyle,borderTopLeftRadius:0,borderBottomLeftRadius:0}} placeholder="kullaniciadi"/>
        </div>
      </div>

      {/* Name + Surname */}
      <div style={{display:"flex",gap:8}}>
        <div style={{flex:1}}>
          <label style={labelStyle}>Isim</label>
          <input value={form.name} onChange={e=>upd("name",e.target.value)} style={inputStyle}/>
        </div>
        <div style={{flex:1}}>
          <label style={labelStyle}>Soyisim</label>
          <input value={form.surname} onChange={e=>upd("surname",e.target.value)} style={inputStyle}/>
        </div>
      </div>

      {/* Bio */}
      <div>
        <label style={labelStyle}>Biyografi ({form.bio.length}/150)</label>
        <textarea value={form.bio} onChange={e=>e.target.value.length<=150&&upd("bio",e.target.value)} rows={3} style={{...inputStyle,resize:"none",lineHeight:1.4}} placeholder="Kendinden bahset..."/>
      </div>

      {/* Birthday */}
      <div>
        <label style={labelStyle}>Dogum Tarihi</label>
        <input value={form.bday} onChange={e=>upd("bday",e.target.value)} style={inputStyle} placeholder="GG.AA.YYYY"/>
      </div>

      {/* Gender */}
      <div>
        <label style={labelStyle}>Cinsiyet</label>
        <div style={{display:"flex",gap:8}}>
          {genderOptions.map(g=><div key={g} onClick={()=>upd("gender",g)} style={{padding:"8px 14px",borderRadius:20,fontSize:12,fontWeight:600,background:form.gender===g?T.accent:`${T.textDim}22`,color:form.gender===g?"#0D0D0D":T.textDim,cursor:"pointer"}}>{g}</div>)}
        </div>
      </div>

      {/* City */}
      <div>
        <label style={labelStyle}>Sehir</label>
        <input value={form.city} onChange={e=>upd("city",e.target.value)} style={inputStyle} placeholder="Istanbul, Kadikoy"/>
      </div>

      {/* Favorite sports */}
      <div>
        <label style={labelStyle}>Favori Sporlar</label>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {sportOptions.map(s=><div key={s} onClick={()=>toggleSport(s)} style={{padding:"8px 14px",borderRadius:20,fontSize:12,fontWeight:600,background:form.sports.includes(s)?T.accent:`${T.textDim}22`,color:form.sports.includes(s)?"#0D0D0D":T.textDim,cursor:"pointer"}}>{s}</div>)}
        </div>
      </div>

      {/* Social media */}
      <div>
        <label style={labelStyle}>Sosyal Medya</label>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {I.instagram(T.purple)}
            <input value={form.ig} onChange={e=>upd("ig",e.target.value)} style={{...inputStyle,flex:1}} placeholder="Instagram kullanici adi"/>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {I.twitter("#1DA1F2")}
            <input value={form.tw} onChange={e=>upd("tw",e.target.value)} style={{...inputStyle,flex:1}} placeholder="Twitter kullanici adi"/>
          </div>
        </div>
      </div>

      {/* Save */}
      <Btn full primary onClick={handleSave} st={{marginTop:8}}>
        {saved?<>{I.check(T.bg)} Kaydedildi</>:"Kaydet"}
      </Btn>
    </div>

    {/* Photo bottom sheet */}
    {photoSheet&&<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,.35)",zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={()=>setPhotoSheet(false)}>
      <div onClick={e=>e.stopPropagation()} style={{background:T.card,borderTopLeftRadius:20,borderTopRightRadius:20,padding:"20px 16px 32px",width:"100%",maxWidth:430}}>
        <div style={{width:40,height:4,borderRadius:2,background:T.textMuted,margin:"0 auto 16"}}/>
        <div style={{fontSize:16,fontWeight:700,fontFamily:FH,color:T.text,marginBottom:16}}>Profil Fotografi</div>
        <div onClick={()=>setPhotoSheet(false)} style={{padding:"14px 0",borderBottom:`1px solid ${T.cardBorder}`,fontSize:14,color:T.text,cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>{I.camera(T.text)} Fotograf Cek</div>
        <div onClick={()=>setPhotoSheet(false)} style={{padding:"14px 0",borderBottom:`1px solid ${T.cardBorder}`,fontSize:14,color:T.text,cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.text} strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>
          Galeriden Sec
        </div>
        {/* Remove option */}
        <div onClick={()=>setPhotoSheet(false)} style={{padding:"14px 0",fontSize:14,color:T.red,cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>{I.x(T.red)} Fotografii Kaldir</div>
      </div>
    </div>}
  </div>;
}

// ============================================================
// MAIN
// ============================================================
export default function SporWaveProfile(){
  const [cur,setCur]=useState("S15");
  const [curData,setCurData]=useState(null);
  const [fade,setFade]=useState(true);

  useEffect(()=>{if(!document.querySelector('link[href*="Plus+Jakarta+Sans"]')){const l=document.createElement("link");l.href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap";l.rel="stylesheet";document.head.appendChild(l);}},[]);

  const nav=(p,data)=>{setFade(false);setTimeout(()=>{setCur(p);setCurData(data||null);setFade(true);},120);};

  const pg=()=>{
    switch(cur){
      case "S15":return <S15 onNav={nav}/>;
      case "S16":return <S16 onNav={nav} userId={curData}/>;
      case "S22":return <S22 onNav={nav} data={curData}/>;
      case "S23":return <S23 onNav={nav}/>;
      default:return <S15 onNav={nav}/>;
    }
  };

  return <div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",background:T.bg,color:T.text,fontFamily:FB,position:"relative",boxShadow:"0 0 40px rgba(0,0,0,.08)"}}>
    {/* Dev ribbon */}
    <div style={{position:"sticky",top:0,zIndex:200,background:T.bgAlt,borderBottom:`1px solid ${T.cardBorder}`,padding:"6px 8px",display:"flex",gap:4,flexWrap:"wrap"}}>
      {[{p:"S15",l:"Kendi Profil"},{p:"S16",l:"Baskasinin Profili"},{p:"S22",l:"Takipciler"},{p:"S23",l:"Profil Duzenle"}].map(n=><span key={n.p} onClick={()=>nav(n.p)} style={{padding:"4px 10px",borderRadius:6,fontSize:11,fontWeight:600,background:cur===n.p?T.accent:`${T.textDim}22`,color:cur===n.p?"#0D0D0D":T.textDim,cursor:"pointer"}}>{n.l}</span>)}
    </div>
    <div style={{opacity:fade?1:0,transform:fade?"none":"translateY(6px)",transition:"all .12s ease"}}>{pg()}</div>
  </div>;
}
