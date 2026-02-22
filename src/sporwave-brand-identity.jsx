import { useState } from "react";

const C = {
  bg:"#06060b",s:"#111118",s2:"#1a1a28",b:"#252538",
  t:"#f0f0f5",d:"#7a7a95",a:"#c8ff00",ad:"rgba(200,255,0,0.1)",
  r:"#ff4757",bl:"#4a9eff",p:"#a855f7",tl:"#2dd4bf",o:"#ff8c42",g:"#22c55e",
  w:"#fff",bk:"#000"
};

export default function App() {
  const [tab, setTab] = useState("logo");
  const [selectedLogo, setSelectedLogo] = useState(0);
  const [selectedSlogan, setSelectedSlogan] = useState(0);

  const tabs = [
    { id: "logo", label: "🎨 Logo Konseptleri" },
    { id: "slogan", label: "💬 Slogan" },
    { id: "appstore", label: "📱 App Store" },
    { id: "colors", label: "🎨 Renk & Tipografi" },
  ];

  // ============ LOGO CONCEPTS ============
  const LogoWave1 = ({ size = 120, dark = true }) => {
    const bg = dark ? C.bk : C.w;
    const txt = dark ? C.w : C.bk;
    return (
      <svg width={size} height={size} viewBox="0 0 200 200">
        <rect width="200" height="200" rx="40" fill={bg}/>
        <path d="M30 120 Q55 85 80 105 Q105 125 130 95 Q155 65 180 90" 
          stroke={C.a} strokeWidth="8" fill="none" strokeLinecap="round"/>
        <path d="M30 140 Q55 105 80 125 Q105 145 130 115 Q155 85 180 110" 
          stroke={C.a} strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.4"/>
        <text x="100" y="78" textAnchor="middle" fill={txt} fontSize="36" fontWeight="800" fontFamily="system-ui" letterSpacing="-1">
          <tspan fill={C.a}>S</tspan>W
        </text>
      </svg>
    );
  };

  const LogoWave2 = ({ size = 120 }) => (
    <svg width={size} height={size} viewBox="0 0 200 200">
      <rect width="200" height="200" rx="40" fill={C.a}/>
      <path d="M25 115 Q50 80 75 100 Q100 120 125 90 Q150 60 175 85" 
        stroke={C.bk} strokeWidth="9" fill="none" strokeLinecap="round"/>
      <path d="M25 138 Q50 103 75 123 Q100 143 125 113 Q150 83 175 108" 
        stroke={C.bk} strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.3"/>
      <text x="100" y="75" textAnchor="middle" fill={C.bk} fontSize="38" fontWeight="900" fontFamily="system-ui" letterSpacing="-1">
        SW
      </text>
    </svg>
  );

  const LogoWave3 = ({ size = 120 }) => (
    <svg width={size} height={size} viewBox="0 0 200 200">
      <rect width="200" height="200" rx="40" fill="#0d1117"/>
      <circle cx="100" cy="90" r="55" fill="none" stroke={C.a} strokeWidth="3" opacity="0.2"/>
      <path d="M45 105 Q65 78 85 95 Q105 112 125 88 Q145 64 165 85" 
        stroke={C.a} strokeWidth="7" fill="none" strokeLinecap="round"/>
      <circle cx="55" cy="95" r="8" fill={C.a}/>
      <text x="100" y="155" textAnchor="middle" fill={C.w} fontSize="22" fontWeight="700" fontFamily="system-ui" letterSpacing="3">
        SPORWAVE
      </text>
    </svg>
  );

  const LogoWave4 = ({ size = 120 }) => (
    <svg width={size} height={size} viewBox="0 0 200 200">
      <defs>
        <linearGradient id="grd" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={C.a}/>
          <stop offset="100%" stopColor={C.tl}/>
        </linearGradient>
      </defs>
      <rect width="200" height="200" rx="40" fill="#0a0a12"/>
      <path d="M30 110 C55 70 75 130 100 95 C125 60 145 120 175 85" 
        stroke="url(#grd)" strokeWidth="10" fill="none" strokeLinecap="round"/>
      <path d="M40 135 C60 105 80 145 100 120 C120 95 140 130 165 108" 
        stroke="url(#grd)" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.3"/>
      <text x="100" y="75" textAnchor="middle" fill={C.w} fontSize="32" fontWeight="800" fontFamily="system-ui" letterSpacing="-1">
        Spor<tspan fill={C.a}>Wave</tspan>
      </text>
    </svg>
  );

  const LogoWave5 = ({ size = 120 }) => (
    <svg width={size} height={size} viewBox="0 0 200 200">
      <rect width="200" height="200" rx="40" fill={C.w}/>
      <path d="M30 115 Q55 80 80 100 Q105 120 130 90 Q155 60 180 85" 
        stroke="#111" strokeWidth="8" fill="none" strokeLinecap="round"/>
      <path d="M30 135 Q55 100 80 120 Q105 140 130 110 Q155 80 180 105" 
        stroke={C.a} strokeWidth="6" fill="none" strokeLinecap="round"/>
      <text x="100" y="75" textAnchor="middle" fill="#111" fontSize="30" fontWeight="800" fontFamily="system-ui" letterSpacing="-0.5">
        Spor<tspan fill={C.a}>Wave</tspan>
      </text>
    </svg>
  );

  const LogoWave6 = ({ size = 120 }) => (
    <svg width={size} height={size} viewBox="0 0 200 200">
      <rect width="200" height="200" rx="40" fill="#111118"/>
      <path d="M35 100 L65 75 L95 105 L125 70 L155 100 L175 80" 
        stroke={C.a} strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M35 125 L65 100 L95 130 L125 95 L155 125 L175 105" 
        stroke={C.a} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.3"/>
      <text x="100" y="170" textAnchor="middle" fill={C.w} fontSize="20" fontWeight="800" fontFamily="system-ui" letterSpacing="4">
        SPORWAVE
      </text>
    </svg>
  );

  const logos = [
    { comp: <LogoWave1 size={140}/>, name: "Konsept A — Minimal Dark", desc: "Koyu arka plan, SW monogram + dalga çizgisi. Şık ve modern. App ikonu için ideal.", tags: ["Minimal","Koyu","Monogram"] },
    { comp: <LogoWave2 size={140}/>, name: "Konsept B — Bold Accent", desc: "Accent yeşil arka plan, siyah SW + dalga. Enerjik ve dikkat çekici. App Store'da öne çıkar.", tags: ["Enerjik","Yeşil","Cesur"] },
    { comp: <LogoWave3 size={140}/>, name: "Konsept C — Sporcu Dinamiği", desc: "Dalga üzerinde top/sporcu silüeti. Dalga + daire kombinasyonu, altında SPORWAVE yazısı.", tags: ["Sportif","Dinamik","İkonik"] },
    { comp: <LogoWave4 size={140}/>, name: "Konsept D — Gradient Wave", desc: "Yeşil→Turkuaz gradient dalga, tam isim yazılı. Premium ve teknolojik his.", tags: ["Gradient","Premium","Teknolojik"] },
    { comp: <LogoWave5 size={140}/>, name: "Konsept E — Light Clean", desc: "Beyaz arka plan, çift dalga (siyah+yeşil). Temiz, profesyonel. Açık tema için.", tags: ["Açık","Temiz","Profesyonel"] },
    { comp: <LogoWave6 size={140}/>, name: "Konsept F — Angular Energy", desc: "Keskin açılı dalga (zigzag). Enerji ve hareket vurgusu. Spor enerjisi yansıtır.", tags: ["Keskin","Enerjik","Farklı"] },
  ];

  const slogans = [
    { tr: "Harekete Geç!", en: "Get Moving!", note: "Kısa, aksiyona çağrı. App Store subtitle için ideal." },
    { tr: "Spor Arkadaşını Bul", en: "Find Your Sports Buddy", note: "Uygulamanın ana değer önerisini doğrudan söylüyor." },
    { tr: "Birlikte Daha Güçlü", en: "Stronger Together", note: "Topluluk ve birliktelik vurgusu. Duygusal bağ yaratır." },
    { tr: "Sporu Birlikte Keşfet", en: "Explore Sports Together", note: "Keşif + birliktelik. Üç modülü de kapsıyor." },
    { tr: "Sahaya Çık!", en: "Hit the Field!", note: "Enerjik, aksiyona yönlendirici. Genç hedef kitleye uygun." },
    { tr: "Dalga Geçir, Spor Yap!", en: "Ride the Wave, Play Sports!", note: "SporWave ismiyle kelime oyunu. Eğlenceli, akılda kalıcı." },
  ];

  // ============ RENDER ============
  return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.t,fontFamily:"system-ui,-apple-system,sans-serif"}}>
      <div style={{maxWidth:900,margin:"0 auto",padding:"30px 20px"}}>
        
        {/* Header */}
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{fontSize:13,color:C.a,fontWeight:700,letterSpacing:3,marginBottom:8,textTransform:"uppercase"}}>Marka Kimliği Paketi</div>
          <h1 style={{fontSize:36,fontWeight:800,margin:0,letterSpacing:-1}}>
            Spor<span style={{color:C.a}}>Wave</span>
          </h1>
          <p style={{color:C.d,fontSize:14,marginTop:6}}>Logo konseptleri • Slogan • App Store optimizasyonu • Renk paleti</p>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:6,marginBottom:32,overflowX:"auto",padding:"0 0 8px"}}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding:"10px 18px",borderRadius:12,border:`1px solid ${tab===t.id?C.a:C.b}`,
              background:tab===t.id?C.ad:C.s,color:tab===t.id?C.a:C.d,
              fontSize:13,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"
            }}>{t.label}</button>
          ))}
        </div>

        {/* ============ TAB: LOGO ============ */}
        {tab === "logo" && (
          <div>
            <p style={{color:C.d,fontSize:13,marginBottom:24,lineHeight:1.6}}>
              Altı farklı logo konsepti. Hepsi "dalga" temasını farklı şekillerde yorumluyor. 
              Birini seçtikten sonra profesyonel tasarımcıya brief olarak verilecek.
            </p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:16}}>
              {logos.map((l, i) => (
                <div key={i} onClick={() => setSelectedLogo(i)} style={{
                  background:C.s,border:`2px solid ${selectedLogo===i?C.a:C.b}`,
                  borderRadius:20,padding:20,cursor:"pointer",transition:"all .2s",
                  transform:selectedLogo===i?"scale(1.02)":"scale(1)"
                }}>
                  <div style={{display:"flex",justifyContent:"center",marginBottom:16}}>
                    {l.comp}
                  </div>
                  <div style={{fontSize:14,fontWeight:700,color:C.t,marginBottom:6}}>{l.name}</div>
                  <div style={{fontSize:12,color:C.d,lineHeight:1.5,marginBottom:10}}>{l.desc}</div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {l.tags.map(t => (
                      <span key={t} style={{fontSize:10,padding:"3px 8px",borderRadius:6,background:C.ad,color:C.a,fontWeight:600}}>{t}</span>
                    ))}
                  </div>
                  {selectedLogo===i && <div style={{marginTop:10,fontSize:11,color:C.a,fontWeight:600}}>✓ Seçili</div>}
                </div>
              ))}
            </div>

            <div style={{marginTop:32,background:C.s,border:`1px solid ${C.b}`,borderRadius:16,padding:24}}>
              <div style={{fontSize:16,fontWeight:700,marginBottom:12}}>📐 Logo Kullanım Alanları</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12}}>
                {[
                  {area:"App İkonu",size:"1024×1024px → iOS/Android otomatik küçültür",note:"Konsept A veya B ideal (basit, uzaktan okunur)"},
                  {area:"Splash Screen",size:"Tam ekran, ortalı logo + isim",note:"Konsept D ideal (gradient + tam isim)"},
                  {area:"Navbar",size:"Yatay, küçük (yükseklik ~24px)",note:"Sadece yazı: SporWave (Wave accent renkte)"},
                  {area:"Sosyal Medya",size:"Profil: 400×400, Kapak: 1500×500",note:"Profilde ikon, kapakta tam logo + slogan"},
                ].map((u,i) => (
                  <div key={i} style={{background:C.s2,borderRadius:12,padding:14}}>
                    <div style={{fontSize:13,fontWeight:700,color:C.t,marginBottom:4}}>{u.area}</div>
                    <div style={{fontSize:11,color:C.a,marginBottom:4}}>{u.size}</div>
                    <div style={{fontSize:11,color:C.d}}>{u.note}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============ TAB: SLOGAN ============ */}
        {tab === "slogan" && (
          <div>
            <p style={{color:C.d,fontSize:13,marginBottom:24,lineHeight:1.6}}>
              Her slogan farklı bir duyguyu hedefliyor. Birini ana slogan, birini App Store subtitle olarak kullanabiliriz.
            </p>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {slogans.map((sl, i) => (
                <div key={i} onClick={() => setSelectedSlogan(i)} style={{
                  background:C.s,border:`2px solid ${selectedSlogan===i?C.a:C.b}`,
                  borderRadius:16,padding:20,cursor:"pointer",transition:"all .2s",
                  display:"flex",gap:20,alignItems:"center"
                }}>
                  <div style={{width:50,height:50,borderRadius:14,background:selectedSlogan===i?C.ad:C.s2,
                    display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:800,
                    color:selectedSlogan===i?C.a:C.d,flexShrink:0,border:`1px solid ${selectedSlogan===i?C.a:C.b}`
                  }}>{i+1}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:18,fontWeight:800,color:C.t,marginBottom:2}}>{sl.tr}</div>
                    <div style={{fontSize:14,color:C.a,fontWeight:600,marginBottom:6}}>{sl.en}</div>
                    <div style={{fontSize:12,color:C.d}}>{sl.note}</div>
                  </div>
                  {selectedSlogan===i && <span style={{color:C.a,fontSize:18}}>✓</span>}
                </div>
              ))}
            </div>

            <div style={{marginTop:24,background:C.s,border:`1px solid ${C.b}`,borderRadius:16,padding:24}}>
              <div style={{fontSize:16,fontWeight:700,marginBottom:16}}>💡 Önerim: İkili Kullanım</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                <div style={{background:C.s2,borderRadius:12,padding:16}}>
                  <div style={{fontSize:11,color:C.a,fontWeight:700,letterSpacing:1,marginBottom:6}}>ANA SLOGAN (Marka)</div>
                  <div style={{fontSize:20,fontWeight:800,color:C.t}}>"Sporu Birlikte Keşfet"</div>
                  <div style={{fontSize:12,color:C.d,marginTop:6}}>Splash screen, web sitesi, sosyal medya biyografisi, tanıtım materyalleri</div>
                </div>
                <div style={{background:C.s2,borderRadius:12,padding:16}}>
                  <div style={{fontSize:11,color:C.a,fontWeight:700,letterSpacing:1,marginBottom:6}}>APP STORE SUBTITLE</div>
                  <div style={{fontSize:20,fontWeight:800,color:C.t}}>"Spor Arkadaşını Bul"</div>
                  <div style={{fontSize:12,color:C.d,marginTop:6}}>App Store/Play Store subtitle, ASO için anahtar kelime ağırlıklı</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============ TAB: APP STORE ============ */}
        {tab === "appstore" && (
          <div>
            <p style={{color:C.d,fontSize:13,marginBottom:24,lineHeight:1.6}}>
              App Store Optimization (ASO) — doğru isim, subtitle ve anahtar kelimeler indirme sayısını doğrudan etkiler.
              Türkiye'de App Store indirmelerinin %69'u organik aramadan geliyor.
            </p>

            {/* App Store Preview */}
            <div style={{background:C.s,border:`1px solid ${C.b}`,borderRadius:20,padding:24,marginBottom:24}}>
              <div style={{fontSize:11,color:C.a,fontWeight:700,letterSpacing:2,marginBottom:16}}>APP STORE ÖNİZLEME</div>
              <div style={{display:"flex",gap:16,alignItems:"center",marginBottom:20}}>
                <div style={{width:64,height:64,borderRadius:16,overflow:"hidden",flexShrink:0}}>
                  <LogoWave1 size={64}/>
                </div>
                <div>
                  <div style={{fontSize:18,fontWeight:700,color:C.t}}>SporWave: Spor Arkadaşını Bul</div>
                  <div style={{fontSize:13,color:C.d}}>Etkinlik, Partner & Eğitim</div>
                  <div style={{display:"flex",gap:8,marginTop:6,alignItems:"center"}}>
                    <span style={{fontSize:12,color:C.o}}>★★★★★</span>
                    <span style={{fontSize:11,color:C.d}}>4.8 (2.4B)</span>
                    <span style={{fontSize:11,color:C.d}}>•</span>
                    <span style={{fontSize:11,color:C.d}}>Ücretsiz</span>
                  </div>
                </div>
              </div>
              <button style={{width:"100%",padding:10,borderRadius:10,border:"none",background:C.bl,color:C.w,fontSize:14,fontWeight:700,cursor:"pointer"}}>YÜKLE</button>
            </div>

            {/* ASO Details */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:24}}>
              {/* iOS */}
              <div style={{background:C.s,border:`1px solid ${C.b}`,borderRadius:16,padding:20}}>
                <div style={{fontSize:14,fontWeight:700,marginBottom:16,display:"flex",alignItems:"center",gap:8}}>🍎 iOS App Store</div>
                
                <div style={{marginBottom:16}}>
                  <div style={{fontSize:11,color:C.a,fontWeight:600,marginBottom:4}}>İSİM (30 karakter max)</div>
                  <div style={{background:C.s2,borderRadius:8,padding:10,fontSize:14,fontWeight:600,color:C.t,border:`1px solid ${C.b}`}}>
                    SporWave: Spor Arkadaşını Bul
                  </div>
                  <div style={{fontSize:10,color:C.d,marginTop:4}}>29 karakter ✓</div>
                </div>

                <div style={{marginBottom:16}}>
                  <div style={{fontSize:11,color:C.a,fontWeight:600,marginBottom:4}}>SUBTITLE (30 karakter max)</div>
                  <div style={{background:C.s2,borderRadius:8,padding:10,fontSize:14,fontWeight:600,color:C.t,border:`1px solid ${C.b}`}}>
                    Etkinlik, Partner & Eğitim
                  </div>
                  <div style={{fontSize:10,color:C.d,marginTop:4}}>26 karakter ✓</div>
                </div>

                <div>
                  <div style={{fontSize:11,color:C.a,fontWeight:600,marginBottom:4}}>ANAHTAR KELİMELER (100 karakter max)</div>
                  <div style={{background:C.s2,borderRadius:8,padding:10,fontSize:12,color:C.t,border:`1px solid ${C.b}`,lineHeight:1.6}}>
                    spor,arkadaş,bul,partner,tenis,futbol,halısaha,maç,etkinlik,maraton,koşu,eğitim,ders,antrenör,yoga
                  </div>
                  <div style={{fontSize:10,color:C.d,marginTop:4}}>98 karakter ✓</div>
                </div>
              </div>

              {/* Android */}
              <div style={{background:C.s,border:`1px solid ${C.b}`,borderRadius:16,padding:20}}>
                <div style={{fontSize:14,fontWeight:700,marginBottom:16,display:"flex",alignItems:"center",gap:8}}>🤖 Google Play Store</div>
                
                <div style={{marginBottom:16}}>
                  <div style={{fontSize:11,color:C.a,fontWeight:600,marginBottom:4}}>UYGULAMA ADI (30 karakter max)</div>
                  <div style={{background:C.s2,borderRadius:8,padding:10,fontSize:14,fontWeight:600,color:C.t,border:`1px solid ${C.b}`}}>
                    SporWave: Spor Arkadaşını Bul
                  </div>
                </div>

                <div style={{marginBottom:16}}>
                  <div style={{fontSize:11,color:C.a,fontWeight:600,marginBottom:4}}>KISA AÇIKLAMA (80 karakter max)</div>
                  <div style={{background:C.s2,borderRadius:8,padding:10,fontSize:13,color:C.t,border:`1px solid ${C.b}`,lineHeight:1.5}}>
                    Spor arkadaşı bul, etkinliklere katıl, eğitmen ile ders al. Harekete geç!
                  </div>
                  <div style={{fontSize:10,color:C.d,marginTop:4}}>72 karakter ✓</div>
                </div>

                <div>
                  <div style={{fontSize:11,color:C.a,fontWeight:600,marginBottom:4}}>UZUN AÇIKLAMA (ilk 2-3 satır kritik)</div>
                  <div style={{background:C.s2,borderRadius:8,padding:10,fontSize:12,color:C.d,border:`1px solid ${C.b}`,lineHeight:1.6}}>
                    Spor yapmak istiyorsun ama partner bulamıyor musun? SporWave ile tenis, futbol, basketbol ve daha birçok spor dalında sana uygun arkadaşlar bul! Maratona mı katılmak istiyorsun? Etkinlikleri keşfet. Eğitim mi almak istiyorsun? En iyi eğitmenleri bul...
                  </div>
                </div>
              </div>
            </div>

            {/* ASO Tips */}
            <div style={{background:C.s,border:`1px solid ${C.b}`,borderRadius:16,padding:24}}>
              <div style={{fontSize:16,fontWeight:700,marginBottom:16}}>🎯 ASO Stratejisi</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12}}>
                {[
                  {title:"Ana Anahtar Kelimeler",items:["spor arkadaş bul","spor partner","halısaha","tenis partner","spor etkinlik"]},
                  {title:"Uzun Kuyruk",items:["istanbul maraton kayıt","padel dersi istanbul","basketbol takım bul","yoga dersi yakınımda"]},
                  {title:"Rakip Kelimeleri",items:["sporsepeti","playo","spond","sportbuddy","superprof spor"]},
                  {title:"Kategori",items:["iOS: Sağlık ve Fitness","Android: Spor","İkincil: Sosyal Ağ"]},
                ].map((g,i) => (
                  <div key={i} style={{background:C.s2,borderRadius:12,padding:14}}>
                    <div style={{fontSize:12,fontWeight:700,color:C.a,marginBottom:8}}>{g.title}</div>
                    {g.items.map((item,j) => (
                      <div key={j} style={{fontSize:12,color:C.t,padding:"4px 0",borderBottom:j<g.items.length-1?`1px solid ${C.b}`:"none"}}>
                        {item}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Play Store Description Template */}
            <div style={{marginTop:24,background:C.s,border:`1px solid ${C.b}`,borderRadius:16,padding:24}}>
              <div style={{fontSize:16,fontWeight:700,marginBottom:16}}>📝 Play Store Tam Açıklama Taslağı</div>
              <div style={{background:C.s2,borderRadius:12,padding:16,fontSize:13,color:C.d,lineHeight:1.8}}>
                <p style={{color:C.t,fontWeight:600,marginBottom:8}}>Spor yapmak istiyorsun ama partner bulamıyor musun? 🏃‍♂️</p>
                <p style={{marginBottom:12}}>SporWave, spor arkadaşı bulmaktan etkinliklere katılmaya, profesyonel eğitim almaya kadar tüm spor ihtiyaçlarını tek uygulamada birleştiriyor.</p>
                
                <p style={{color:C.a,fontWeight:700,marginBottom:4}}>⚽ SPOR ARKADAŞI BUL</p>
                <p style={{marginBottom:12}}>Tenis, futbol, basketbol, voleybol, satranç, masa tenisi ve daha birçok spor dalında sana yakın, seviyene uygun spor arkadaşları bul. Halısaha maçı kur, tenis partneri ara, 3v3 basketbol takımı oluştur.</p>
                
                <p style={{color:C.a,fontWeight:700,marginBottom:4}}>🏆 ETKİNLİKLERİ KEŞFET</p>
                <p style={{marginBottom:12}}>İstanbul Maratonu, HYROX, trail koşuları ve daha birçok spor etkinliğini keşfet. Şehir bazlı filtrele, detayları incele, kayıt ol.</p>
                
                <p style={{color:C.a,fontWeight:700,marginBottom:4}}>🎓 EĞİTİM AL</p>
                <p style={{marginBottom:12}}>Padel, yoga, okçuluk, yüzme ve daha fazlası — alanında uzman eğitmenlerden birebir veya grup dersleri al. Fiyatları karşılaştır, kolayca rezervasyon yap.</p>
                
                <p style={{color:C.a,fontWeight:700,marginBottom:4}}>✨ NEDEN SPORWAVE?</p>
                <p>• Seviyene uygun partner eşleştirme{'\n'}• Uygulama içi mesajlaşma{'\n'}• Spor etkinlik takvimi{'\n'}• Doğrulanmış eğitmenler ve tesisler{'\n'}• Ücretsiz kullanım</p>
              </div>
            </div>
          </div>
        )}

        {/* ============ TAB: COLORS ============ */}
        {tab === "colors" && (
          <div>
            <p style={{color:C.d,fontSize:13,marginBottom:24,lineHeight:1.6}}>
              Marka renk paleti ve tipografi kararları. Figma taslağından devam eden koyu tema temel alındı.
            </p>

            {/* Primary Colors */}
            <div style={{background:C.s,border:`1px solid ${C.b}`,borderRadius:16,padding:24,marginBottom:20}}>
              <div style={{fontSize:16,fontWeight:700,marginBottom:16}}>🎨 Ana Renkler</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:12}}>
                {[
                  {name:"Accent (Wave Green)",hex:"#C8FF00",use:"CTA butonlar, aktif durumlar, FAB, vurgular",text:C.bk},
                  {name:"Primary Dark",hex:"#0A0A0F",use:"Uygulama arka plan",text:C.w},
                  {name:"Surface",hex:"#141420",use:"Kartlar, paneller",text:C.w},
                  {name:"Error / Active Tab",hex:"#FF4757",use:"Hata, aktif footer tab",text:C.w},
                  {name:"Success",hex:"#22C55E",use:"Onay, başarılı durumlar",text:C.w},
                  {name:"Warning",hex:"#FF8C42",use:"Bekleyen, uyarı",text:C.bk},
                  {name:"Info Blue",hex:"#4A9EFF",use:"Bilgi, linkler",text:C.w},
                  {name:"Text Primary",hex:"#E8E8F0",use:"Ana metin rengi",text:C.bk},
                  {name:"Text Secondary",hex:"#7A7A95",use:"Alt metin, açıklama",text:C.w},
                  {name:"Border",hex:"#2A2A40",use:"Kart ve bölüm kenarları",text:C.w},
                ].map((c,i) => (
                  <div key={i} style={{borderRadius:12,overflow:"hidden",border:`1px solid ${C.b}`}}>
                    <div style={{height:60,background:c.hex,display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <span style={{fontSize:11,fontWeight:700,color:c.text}}>{c.hex}</span>
                    </div>
                    <div style={{padding:10,background:C.s2}}>
                      <div style={{fontSize:12,fontWeight:700,color:C.t,marginBottom:2}}>{c.name}</div>
                      <div style={{fontSize:10,color:C.d}}>{c.use}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Typography */}
            <div style={{background:C.s,border:`1px solid ${C.b}`,borderRadius:16,padding:24,marginBottom:20}}>
              <div style={{fontSize:16,fontWeight:700,marginBottom:16}}>📝 Tipografi Önerisi</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                <div style={{background:C.s2,borderRadius:12,padding:16}}>
                  <div style={{fontSize:11,color:C.a,fontWeight:700,letterSpacing:1,marginBottom:12}}>MOBİL UYGULAMA</div>
                  <div style={{marginBottom:12}}>
                    <div style={{fontSize:28,fontWeight:800,letterSpacing:-1}}>SF Pro Display</div>
                    <div style={{fontSize:12,color:C.d,marginTop:4}}>iOS sistem fontu — native his verir</div>
                  </div>
                  <div>
                    <div style={{fontSize:28,fontWeight:800,letterSpacing:-1,fontFamily:"Roboto,sans-serif"}}>Roboto</div>
                    <div style={{fontSize:12,color:C.d,marginTop:4}}>Android sistem fontu — Material Design uyumlu</div>
                  </div>
                </div>
                <div style={{background:C.s2,borderRadius:12,padding:16}}>
                  <div style={{fontSize:11,color:C.a,fontWeight:700,letterSpacing:1,marginBottom:12}}>MARKA / LOGO</div>
                  <div style={{marginBottom:12}}>
                    <div style={{fontSize:28,fontWeight:800,letterSpacing:-1}}>Plus Jakarta Sans</div>
                    <div style={{fontSize:12,color:C.d,marginTop:4}}>Modern, geometrik — logo ve başlıklar için</div>
                  </div>
                  <div>
                    <div style={{fontSize:28,fontWeight:800,letterSpacing:-1}}>Inter Tight</div>
                    <div style={{fontSize:12,color:C.d,marginTop:4}}>Alternatif — sıkı, sportif his</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Brand Do's and Don'ts */}
            <div style={{background:C.s,border:`1px solid ${C.b}`,borderRadius:16,padding:24}}>
              <div style={{fontSize:16,fontWeight:700,marginBottom:16}}>✅ Marka Kuralları</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:C.g,marginBottom:10}}>✅ Yapılması Gerekenler</div>
                  {[
                    '"SporWave" şeklinde yazılır (S ve W büyük)',
                    "Logo etrafında minimum boşluk bırakılır",
                    "Koyu arka planda accent yeşil kullanılır",
                    "Açık arka planda siyah logo kullanılır",
                    "Dalga elementi marka ile özdeşleştirilir",
                  ].map((r,i) => (
                    <div key={i} style={{fontSize:12,color:C.d,padding:"6px 0",borderBottom:`1px solid ${C.b}`}}>{r}</div>
                  ))}
                </div>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:C.r,marginBottom:10}}>❌ Yapılmaması Gerekenler</div>
                  {[
                    '"Sporwave", "sporwave", "SPORWAVE" yazılmaz',
                    "Logo renkleri değiştirilmez",
                    "Logo döndürülmez veya eğilmez",
                    "Karmaşık arka plan üzerinde kullanılmaz",
                    "Dalga elementi deforme edilmez",
                  ].map((r,i) => (
                    <div key={i} style={{fontSize:12,color:C.d,padding:"6px 0",borderBottom:`1px solid ${C.b}`}}>{r}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
