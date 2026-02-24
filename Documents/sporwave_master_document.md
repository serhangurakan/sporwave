# SPORWAVE v2 — Sayfa Haritası & Bilgi Mimarisi

> Bu doküman, SporWave'in yeni vizyonu (Hevy/Strava kalitesinde spor sosyal platformu + partner matching) için
> tüm sayfa yapısını, navigasyonu, her sayfanın detaylı içeriğini ve sayfa arası geçişleri tanımlar.
> MVP odağı: Halısaha/futbol. Mimari spor-agnostik olacak şekilde tasarlanmıştır.
> Uygulama dili: Türkçe. Tema: Koyu (default) / Açık (toggle ile değiştirilebilir).
> Son güncelleme: 24 Şubat 2026

---

## KESİNLEŞEN KARARLAR

| Karar | Seçim |
|-------|-------|
| **MVP spor dalı** | Halısaha/Futbol (mimari spor-agnostik) |
| **Tema** | Koyu (default) + Açık tema toggle (Ayarlar'dan) |
| **Login yaklaşımı** | Gecikmeli login — uygulama login olmadan gezilir |
| **Kayıt yöntemleri** | E-posta/şifre + Google + Apple |
| **Mesajlaşma** | Uygulama içi 1-1 mesajlaşma + WhatsApp butonu |
| **Saha rezervasyonu** | MVP'de yok — sonra eklenecek |
| **Coğrafi kapsam** | İstanbul öncelikli |
| **Uygulama dili** | Türkçe (i18n altyapısı hazır olacak) |
| **Derecelendirme** | MVP'de yok — deneyim seviyesi self-select olarak kalacak |
| **Diğer spor dalları** | UI'da gösterilmiyor, sadece onboarding'de tercih soruluyor (data toplama amaçlı) |
| **Tab yapısı** | 3 tab: Ana Sayfa (sosyal) + Maçlar (aksiyon) + Profil (kişisel) |

---

## NAVİGASYON YAPISI

### Üst Navbar (her sayfada)
```
[ SW logo ]                        [ 🔍 ]  [ 🔔 ]  [ 💬 ]
```
- **SW logo**: Tıklanınca Ana Sayfa'ya döner
- **🔍**: Kullanıcı arama (S07)
- **🔔**: Bildirimler (S19)
- **💬**: Mesajlar Listesi (S17)
- Okunmamış varsa kırmızı badge (sayı)

### Alt Tab Bar (3 sekme + FAB)
```
[ 🏠 Ana Sayfa ]        [ ⚽ Maçlar ]        [ 👤 Profil ]
```
- **🏠 Ana Sayfa**: Sosyal feed — dropdown ile Ana Sayfa (takip edilenler) / Keşfet (herkes)
- **⚽ Maçlar**: Katılabileceğin açık maçlar + katıldığın maçlar + sağ altta FAB "+" (oluştur/başlat)
- **👤 Profil**: Hevy tarzı — grafik + pano + istatistikler + maç feed'i + ayarlar
- Aktif tab accent renkle vurgulanır

---

## SAYFA HARİTASI — TOPLAM 35 SAYFA

---

### BÖLÜM 1: KİMLİK DOĞRULAMA & ONBOARDING (4 sayfa)

#### S01: Login Sayfası
- Uygulama logosu (ortalı, büyük)
- E-posta input
- Şifre input
- "Giriş Yap" butonu (birincil, accent renk)
- "Şifremi Unuttum" linki
- Ayraç: "veya"
- "Google ile devam et" butonu (Google ikonu)
- "Apple ile devam et" butonu (Apple ikonu)
- "Hesabın yok mu? **Kayıt Ol**" linki
- **Tetiklenme:** Login gerektiren herhangi bir işlem yapılmak istendiğinde (katıl, oluştur, mesaj, profil vb.)

#### S02: Kayıt Ol Sayfası
- Uygulama logosu (küçük, üstte)
- E-posta input
- Şifre input (güç göstergesi ile)
- Şifre tekrar input
- KVKK + Kullanım Şartları onay checkbox'ı (linkli)
- "Kayıt Ol" butonu (birincil)
- "Google ile kayıt ol" butonu
- "Apple ile kayıt ol" butonu
- "Zaten hesabın var mı? **Giriş Yap**" linki
- Başarılı kayıt → Onboarding başlar

#### S03: Şifremi Unuttum
- E-posta input
- "Sıfırlama Linki Gönder" butonu
- Başarılı gönderim mesajı (inline)
- "Giriş Yap'a Dön" linki

#### S04: Onboarding (4 adımlı — kayıt sonrası veya sosyal login sonrası)
- İlerleme çubuğu (üstte, 4 adım)

**Adım 1 — Temel Bilgiler:**
- İsim input
- Soyisim input
- Doğum tarihi picker
- Cinsiyet seçimi (Erkek / Kadın / Belirtmek istemiyorum)
- "Devam" butonu

**Adım 2 — Profil Fotoğrafı:**
- Büyük yuvarlak fotoğraf alanı + kamera ikonu
- "Fotoğraf Yükle" butonu (galeri veya kamera)
- "Sonra Ekle" linki (atlanabilir)
- "Devam" butonu

**Adım 3 — Spor Tercihleri (data toplama amaçlı):**
- Başlık: "Hangi sporları yapıyorsun?"
- Grid seçim: Futbol ⚽, Basketbol 🏀, Tenis 🎾, Padel 🏓, Koşu 🏃, Bisiklet 🚴, Voleybol 🏐, Yüzme 🏊, Fitness 💪, Diğer ➕
- Çoklu seçim — seçilenler accent border ile vurgulanır
- **Not:** Bu adım yalnızca gelecekteki spor dalı genişleme kararları için data toplar. Uygulamada başka hiçbir yerde diğer spor dalları gösterilmez veya "yakında" etiketiyle listelenmez.
- "Devam" butonu

**Adım 4 — Konum & Kurallar:**
- Şehir seçici (dropdown: İstanbul, Ankara, İzmir...)
- İlçe seçici (şehire göre dinamik)
- Topluluk Kuralları özet metni + "Detayları Gör" linki
- "Kabul Ediyorum" checkbox'ı
- "Başla! 🚀" butonu → Ana Sayfa'ya yönlendir

---

### BÖLÜM 2: ANA SAYFA — Tab 1 (2 sayfa)

#### S05: Ana Sayfa / Keşfet (Sosyal Feed)
- **Yapı:** Hevy'nin Ana Sayfa/Keşfet dropdown yapısıyla birebir
- **Üstte sol:** Dropdown ile sayfa adı "Ana Sayfa ▾" → iki seçenek:
  - **🏠 Ana Sayfa (Takip edilenler)** — default: takip ettiğin kullanıcıların geçmiş maç kartları
  - **🌐 Keşfet** — tüm kullanıcıların yüksek etkileşimli geçmiş maç kartları
- **Üstte sağ:** 🔍 Arama + 🔔 Bildirimler

**Keşfet modundayken — Önerilen Kullanıcılar bölümü:**
- Feed'in en üstünde yatay scroll önerilen kullanıcı kartları
- Her kart: Avatar + isim + "Takip Et" butonu
- **Öneri algoritması (öncelik sırası):**
  1. Daha önce birlikte maç yaptığın ama takip etmediğin kullanıcılar
  2. Arkadaşlarının arkadaşları (takip ettiklerinin takip ettikleri)
  3. Aynı şehirden random profiller (hiç arkadaş/maç yoksa)

**İçerik:** Geçmiş maç kartları dikey listesi (feed)

**Her maç kartı yapısı:**
- **Üst satır:** Avatar + kullanıcı adı + tarih/saat + ⋮ menü (Raporla/Engelle)
- **Maç başlığı** (bold): örn. "Kadıköy Halısaha Maçı"
- **Özet bilgi satırı:** Süre: 1s 20dk · Skor: 5-3 · Oyuncular: 10
- **Katılımcı listesi** (compact): Takım 1 avatarları vs Takım 2 avatarları
- **Fotoğraf galerisi** (varsa): Yatay scroll, max 4 fotoğraf, tıklayınca büyüt
- **Etkileşim satırı:**
  - 👍 Beğeni (sayı) + 💬 Yorum (sayı) + ↗ Paylaş
- **Beğenenler satırı** (beğeni varsa):
  - Avatarlar + "Beğenenler: ali ve diğerleri" — **isimler tıklanabilir → S16 Profil**
- **Maçın Yıldızı satırı** (mvp varsa):
  - ⭐ + isim — **isim tıklanabilir → S16 Profil**
- **Son yorum** (yorum varsa):
  - Avatar + kullanıcıadı + zaman + yorum metni — **kullanıcı adı tıklanabilir → S16 Profil**
- **Yorum ekle:** "Bir yorum ekle..." input alanı (tıklayınca genişler)
- **Tüm kart tıklanabilir** → Maç Detay (S10)

**Boş durum (Ana Sayfa — kimseyi takip etmiyorsan):**
- İllüstrasyon + "Henüz kimseyi takip etmiyorsun"
- "Keşfet'e Git" butonu

#### S07: Kullanıcı Arama Sonuçları
- Üst navbar'daki 🔍 ikonundan erişilir
- Arama çubuğu (üstte, aktif, otofokus)
- Sonuç listesi:
  - Her satır: Avatar + isim + @kullanıcıadı + maç sayısı
  - "Takip Et" / "Takip Ediliyor" butonu (sağda)
- Tıklanınca → Kullanıcı Profili (S16)
- Sonuç yoksa: "Kullanıcı bulunamadı" mesajı
- Back butonu

---

### BÖLÜM 3: MAÇLAR — Tab 2 (7 sayfa)

#### S08: Maçlar Sayfası (Açık Maçlar + Katıldıklarım)
- **Amaç:** Katılabileceğin maçları bul + katıldığın maçları gör + maç oluştur/başlat

**Sayfa yapısı (tek akış, tab yok):**

**Üstte sağ:** Filtre ikonu 🔽 (tıklayınca filtre popup açılır)

**Filtre Popup (bottom sheet):**
- **Konum:** İlçe seçici (çoklu seçim)
- **Tarih:** Bugün / Bu hafta / Bu ay / Tarih aralığı seç
- **Görünüm:** Tüm Maçlar / Sadece Katıldıklarım / Sadece Açık Maçlar
- "Uygula" butonu + "Sıfırla" linki

**Katıldığım yaklaşan maçlar (en üstte, vurgulu bölüm):**
- Farklı arka plan rengi veya sol kenarda accent renk border ile ayrışır
- Her kart üzerinde "Katılıyorsun ✓" badge'i
- Tarih sırasına göre (en yakın olan en üstte)
- **Her kart:**
  - Spor ikonu + Maç başlığı (bold)
  - Tarih/saat + Konum
  - Organizatör: avatar + isim
  - Kontenjan: "7/10 oyuncu" (progress bar)
  - "Katılıyorsun ✓" badge (accent renk)
  - Tıklanınca → S12 Planlanan Maç Detay

**Açık maçlar (altında, standart liste):**
- **Arkadaşlarının katıldığı maçlar önce** — her kartta "🤝 [isim] katılıyor" etiketi
- Ardından diğer açık maçlar (tarihe göre sıralı)
- **Her kart:**
  - Spor ikonu + Maç başlığı (bold)
  - Tarih/saat + Konum
  - Organizatör: avatar + isim
  - Kontenjan: "7/10 oyuncu" (progress bar)
  - Deneyim seviyesi tercihi badge'i (varsa: "Herkes" / "Orta+")
  - Kabul modu badge'i (varsa: "Onay gerekli")
  - Arkadaş katılıyorsa: "🤝 Ali katılıyor" etiketi
  - Tıklanınca → S12 Planlanan Maç Detay

**Not:** Bu sayfada geçmiş maçlar gösterilmez. Geçmiş maçlar Ana Sayfa feed'inde (S05) ve Profil'de (S15) görünür.

**Boş durum:** "Şu an açık maç yok — ilk maçı sen oluştur!" + FAB'a yönlendirme

**Sağ altta FAB "+" butonu** → tıklayınca S09 Bottom Sheet açılır

#### S09: Maç Seçenekleri (Bottom Sheet — FAB'a basınca)
- **Başlık:** "Ne yapmak istiyorsun?"
- İki büyük seçenek kartı:
  1. **"🎮 Maç Başlat"** — "Hemen oynayacağın bir maçı başlat ve skor tut"
  2. **"📢 Maç Oluştur"** — "İleri tarihli maç planla ve oyuncu bul"
- Kart tıklanınca ilgili akışa geçiş

#### S10: Maç Başlat (Canlı Skor Takibi — Login gerekli)
- **Amaç:** Maçı o an oynuyorken başlat, canlı skor tut, bitince kaydet

**Adım 1 — Maç Kurulumu:**
- Maç formatı: 5v5 / 6v6 / 7v7 / Özel
- Konum: Otomatik GPS + manuel düzenleme
- "Başlat" butonu

**Adım 2 — Takım Kurulumu (OPSİYONEL — atlanabilir):**
- Takım 1 vs Takım 2
- Her takıma oyuncu ekle:
  - **Uygulama kullanıcısı:** İsim/@kullanıcıadı ile ara, seç
  - **Misafir Oyuncu:** "Misafir Ekle" butonu → sadece isim girişi (otomatik doldurma yok)
- Takım rengi seçimi (opsiyonel)
- **"Atla — Sonra eklerim"** linki (takım kurmadan skor takibine geç)
- "Devam" butonu

**Adım 3 — Canlı Skor Ekranı:**
- **Büyük skor gösterimi:** Takım 1 **[X]** — **[Y]** Takım 2
- **Süre sayacı:** Kronometer (başlat/duraklat) — sadece aktif süre sayılır
- Her takım için **"+ Gol"** butonu (büyük, kolay tıklanabilir, takım rengiyle)
- **Gol eklenince:**
  - "Kim attı?" popup → oyuncu listesinden seç / "Belirtme" seçeneği
  - "Asist?" popup → oyuncu listesinden seç / "Yok" / "Atla"
  - **5 saniyelik "Geri Al" toast:** "⚽ Gol eklendi — Geri Al" (tıklanırsa gol iptal)
- **Gol geçmişi listesi** (kronolojik): "12' ⚽ Berk (Asist: Ali)" formatında
  - Her gol satırında **sola kaydır (swipe) → "Sil"** aksiyonu
- **Otomatik kaydetme:** Her gol ekleme/silme anında state local storage + backend'e kaydedilir
- **"Maçı Bitir"** butonu (alt kısımda, onay dialog'u ile: "Maçı bitirmek istediğine emin misin?")

**App kapanması / crash koruması:**
- Uygulama tekrar açıldığında: "Devam eden maçın var — Devam Et?" banner'ı
- Kronometer duraklatılmış olarak bekler, kullanıcı devam ettiğinde kaldığı yerden devam
- 24 saatten fazla geçtiyse: "Bu maçı tamamlamak ister misin?" → Evet: maç özeti ekranına git / Hayır: maçı sil

**Adım 4 — Maç Özeti & Kaydet (düzenleme ekranı):**
- Skor özeti: Takım 1 [X] — [Y] Takım 2
- Maç süresi
- **Gol listesi (düzenlenebilir):**
  - Her gol satırı tıklanabilir → "Gol atan: [değiştir]" + "Asist: [değiştir]"
  - Gol silme butonu (çarpı ikonu)
  - "Gol Ekle" butonu (maç sırasında kaçırdıysan buradan da ekleyebilirsin)
- **Takım kadrosu düzenleme:** Oyuncu ekle/çıkar (maç sırasında atladıysan buradan tamamla)
- **Fotoğraf Ekle** butonu (galeri veya kamera, çoklu seçim, max 4)
- **Maç Başlığı** input (opsiyonel, placeholder: "Kadıköy Halısaha Maçı")
- **Not/Açıklama** textarea (opsiyonel)
- **MVP Oylaması:** "Maçın yıldızını seç" → katılımcı listesi, tek bir kişi seçilir
- **"Kaydet & Paylaş"** butonu → profilde ve feed'de görünür → S30 Shareable kart gösterilir
- **"Kaydet (Gizli)"** butonu → sadece profilde görünür, feed'e düşmez

#### S11: Maç Detay Sayfası (Geçmiş — oynanmış maç)
- **Üst bölüm:** Spor ikonu + Maç başlığı (büyük, bold)
- **Skor kartı:** Takım 1 **[X]** — **[Y]** Takım 2 (büyük, merkezi)
- **Meta bilgiler:** Tarih/saat · Süre · Konum · Maç formatı (5v5 vb.)
- **Takım kadroları (yan yana iki kolon):**
  - Takım 1 listesi: avatar + isim + gol/asist sayısı + MVP yıldızı (varsa) — **her oyuncu tıklanabilir → S16 Profil**
  - Takım 2 listesi: aynı format
  - Misafir oyuncular gri tonunda, profil linki yok
- **Gol zaman çizelgesi:** Kronolojik gol listesi — **gol atan ve asist yapan isimler tıklanabilir → S16 Profil**
- **Maçın Yıldızı:** MVP seçilen oyuncu vurgulu gösterim (altın çerçeve)
- **Fotoğraf galerisi** (varsa): Grid veya yatay scroll
- **Açıklama/not** (varsa)
- **Etkileşim:**
  - 👍 Beğeni (sayı) + 💬 Yorum (sayı) + ↗ Paylaş
  - Beğenenler satırı: avatarlar + "ali ve diğerleri"
  - Yorumlar listesi (genişletilebilir) + "Bir yorum ekle..."
- Back butonu

#### S12: Planlanan Maç Detay (Henüz oynanmamış)
- Üst bölüm: Spor ikonu + Maç başlığı
- Organizatör: avatar + isim (tıklanınca profil)
- **Bilgi kartı:** Tarih/saat · Konum · Format · Seviye tercihi
- **Kontenjan gösterimi:** "7/10 oyuncu" (progress bar ile)
- **Katılımcı listesi:**
  - Her satır: avatar + isim + deneyim seviyesi → profil tıklanabilir
- **CTA Butonları (organizatör değilsen):**
  - "Katıl (X yer kaldı)" birincil → S14 Deneyim Seviyesi Seçimi
  - "💬 Mesaj Gönder" ikincil → S18 Sohbet
  - "📱 WhatsApp ile Mesaj" ikincil → WhatsApp'a yönlendir
- **CTA Butonları (organizatörsen):**
  - "Başvuruları Gör" → S13
  - "Maçı Düzenle"
  - "🎮 Maçı Başlat" (maç saati gelince aktif olur) → S10 Adım 3'e geçiş (maç bilgileri otomatik doldurulur)
- **Paylaş butonu:** Deep link / WhatsApp / Instagram Stories share
- ⋮ Menü: Raporla / Engelle
- Back butonu

#### S13: Başvuru Yönetimi (Organizatör için — Login gerekli)
- Maç başlığı (üstte)
- Gelen başvuru listesi:
  - Her başvuru: avatar + isim + deneyim seviyesi
  - "Onayla" butonu (yeşil) + "Reddet" butonu (kırmızı)
- Onaylı katılımcılar listesi (altta)
- Sadece "Onay ile kabul et" modundaki maçlarda görünür
- Back butonu

#### S14: Deneyim Seviyesi Seçimi (Bottom Sheet)
- Başlık: "Deneyim Seviyeni Seç"
- Alt açıklama: "Maç sahibi seviyeni görerek karar verecek"
- 4 seçenek (tam genişlik butonlar):
  - 🌱 Başlangıç — "Spora yeni başlıyorum"
  - ⚡ Orta — "Düzenli oynuyorum"
  - 🔥 İyi — "Deneyimliyim"
  - 🏆 Profesyonel — "Yarışma seviyesi"
- "Başvur" / "Katıl" butonu (kabul moduna göre)

---

### BÖLÜM 4: MAÇ OLUŞTUR (1 sayfa)

#### S31: Maç Oluştur (İleri Tarihli — Login gerekli)
- **Amaç:** Gelecek tarihli maç planla, oyuncu topla
- **Erişim:** S09 Bottom Sheet → "Maç Oluştur"
- İlerleme çubuğu (3 adım)

**Adım 1 — Maç Detayları:**
- Maç başlığı input (placeholder: "Cumartesi Halısaha Maçı")
- Açıklama textarea (opsiyonel)
- Maç formatı: 5v5 / 6v6 / 7v7 / Özel
- "Devam" butonu

**Adım 2 — Tarih & Konum:**
- Tarih picker
- Saat picker
- Konum input + harita üzerinde seç
- Saha adı input (opsiyonel: "Fenerbahçe Halısaha")
- "Devam" butonu

**Adım 3 — Katılım Ayarları:**
- Maksimum oyuncu sayısı (number input)
- Deneyim seviyesi tercihi (pill: Herkes / Başlangıç / Orta / İyi / Profesyonel)
- Kabul modu:
  - "Herkesi Kabul Et" — ilk gelen alır
  - "Onay ile Kabul Et" — başvuruları sen onaylarsın
- Gizlilik ayarı:
  - "Herkese açık" — Maçlar sekmesinde görünür
  - "Sadece takipçilere" — sadece takipçilerin görebilir
  - "Sadece davet ile" — link paylaşarak katılım
- **"Yayınla 📢"** butonu

---

### BÖLÜM 5: PROFİL — Tab 3 (3 sayfa)

#### S15: Kendi Profilin (Login gerekli)
- **Yapı:** Hevy profil sayfasının SporWave adaptasyonu

**Üst bölüm:**
- Profil fotoğrafı (büyük, yuvarlak)
- İsim soyisim + @kullanıcıadı
- "Doğrulanmış ✓" rozeti (varsa)
- İstatistik satırı: **Maç** (sayı) · **Takipçi** (sayı) · **Takip** (sayı)
  - Takipçi/takip sayılarına tıklanınca liste açılır (S22)

**Sağ üst ikonlar:** ✏️ Profil düzenle + ↗ Paylaş + ⚙️ Ayarlar

**Haftalık özet:** "X maç bu hafta" (bold rakam + açıklama)

**Zaman filtresi:** Son 3 ay ▾ (dropdown: Son 1 ay / Son 3 ay / Son 6 ay / Tüm zamanlar)

**Haftalık aktivite grafiği** (bar chart — Hevy tarzı):
- Son 12 hafta, her bar = o haftaki maç sayısı
- Alt seçim pilleri: "Maç" / "Gol" / "Süre"

**Pano (3 kart yan yana — Hevy tarzı):**
- 📊 **İstatistikler** → İstatistik detay sayfasına git (inline genişleme veya modal):
  - Toplam maç / Galibiyet / Mağlubiyet / Beraberlik / Kazanma oranı (%)
  - Toplam gol / Toplam asist / MVP seçilme sayısı
- 🏆 **Başarılar** → Kazanılan rozetler ve ilerleme
- 📅 **Takvim** → Takvim görünümünde maç günleri (accent renk noktalar)

**Seri Gösterimi** (varsa, vurgulu):
- "🔥 X haftalık serin!" (aktif seri)
- "En uzun seri: X hafta"

**Rozetler** (kazanılanlar yatay scroll):
- 🏅 50 Maç Kulübü / ✅ %100 Katılım / 🎙️ Süper Organizatör / 🆕 Yeni Üye vb.

**Maç feed'i:**
- Profil sayfasının alt yarısı = kullanıcının maç kartları (S05 formatında)
- **Her maç kartı tıklanabilir → S11 Maç Detay sayfasına gider**
- Herkese açık maçlar normal görünür
- Gizli maçlar sadece sana görünür (kilit ikonu ile)

#### S16: Başka Kullanıcının Profili
- **Yapı:** S15 ile benzer layout, düzenleme/ayar butonları yok
- **Pano bölümü gösterilmez** — sadece kendi profilinde görünür

**Üst bölüm:** Fotoğraf + isim + @kullanıcıadı + doğrulanmış rozeti + istatistik satırı

**Grafik + Rozetler + Seri:** S15 ile aynı (salt okunur, Pano hariç)

**Maç feed'i:** Kullanıcının herkese açık maç kartları (tıklanınca Maç Detay S11'e gider)

**Takip butonu:**
| Durum | Görünüm |
|-------|---------|
| Takip etmiyorsun | **"+ Takip Et"** (birincil, accent) |
| Takip ediyorsun | **"✓ Takip Ediliyor"** (gri, tıklayınca takipten çık onayı) |
| Karşılıklı takip | **"🤝 Arkadaş"** etiketi |

**İletişim butonları:**
- "💬 Mesaj Gönder" → S18 Sohbet
- "📱 WhatsApp" → WhatsApp'a yönlendir (numara paylaşıldıysa)

**⋮ Menü:** Raporla / Engelle / Takipten Çık

**Erişim noktaları (avatar/isim tıklanınca S16 açılır):**
- Maç kartlarında (feed): organizatör ve katılımcı avatarları
- Maç detayında (S11): takım kadrosu avatarları
- Mesaj listesinde (S17): avatar
- Takipçi/takip listesinde (S22): avatar
- Arama sonuçlarında (S07): satır

#### S23: Profil Düzenle (Login gerekli)
- Profil fotoğrafı + "Değiştir" linki
- @kullanıcıadı input (benzersiz)
- İsim input
- Soyisim input
- Biyografi textarea (maks 150 karakter)
- Doğum tarihi picker
- Cinsiyet seçimi
- Şehir / İlçe seçici
- Favori sporlar (pill çoklu seçim)
- Sosyal medya linkleri (opsiyonel): Instagram, Twitter
- "Kaydet" butonu
- Back butonu

---

### BÖLÜM 6: MESAJLAŞMA (2 sayfa)

#### S17: Mesajlar Listesi (Inbox — Login gerekli)
- Üst navbar'daki 💬 ikonundan erişilir
- Arama çubuğu (konuşma ara)
- Konuşma listesi:
  - Her satır: avatar + isim + son mesaj önizleme + tarih/saat
  - Okunmamış: accent badge (sayı)
  - Avatar tıklanınca → S16 Profil
  - Satır tıklanınca → S18 Sohbet
- Boş durum: "Henüz mesajın yok" + illüstrasyon

#### S18: Sohbet Sayfası (1-1 — Login gerekli)
- Üst bar: Avatar + isim (tıklanınca profil) + ⋮ menü
- Mesaj balonları (klasik chat UI):
  - Gönderilen: sağ, accent renk
  - Alınan: sol, koyu gri
  - Her balonda: metin + saat + okundu tiki
- Alt kısım: Mesaj input + 📎 ek (fotoğraf) + Gönder butonu
- **WhatsApp butonu:** Üst bar'da veya ⋮ menüde "📱 WhatsApp'a Geç" → karşı tarafın numarasına yönlendir (numara paylaşıldıysa)
- ⋮ Menü: WhatsApp'a Geç / Engelle / Raporla

---

### BÖLÜM 7: BİLDİRİMLER (1 sayfa)

#### S19: Bildirimler (Login gerekli)
- Üst navbar'daki 🔔 ikonundan erişilir
- Bildirim listesi (kronolojik):
  - Her bildirim: tür ikonu + avatar + metin + zaman + okunmamış göstergesi
  - **Tıklanınca ilgili sayfaya yönlendir**

**Bildirim türleri:**
- 👍 "Ali maçını beğendi" → S11 Maç Detay
- 💬 "Ali maçına yorum yaptı" → S11 Maç Detay
- 👥 "Ali seni takip etmeye başladı" → S16 Profil
- ✅ "Maç başvurun onaylandı" → S12 Planlanan Maç
- ❌ "Maç başvurun reddedildi" → S12 Planlanan Maç
- 📢 "Ali yeni bir maç oluşturdu" (takip ettiklerin) → S12
- 🏅 "50 Maç Kulübü'ne hoş geldin!" → S15 Profil
- 🔥 "4 haftalık serin devam ediyor!" → S15 Profil
- 💬 "Ali sana mesaj gönderdi" → S18 Sohbet
- ⚽ "Yarınki maçın yaklaşıyor!" → S12 Planlanan Maç (hatırlatıcı)

---

### BÖLÜM 8: MENÜ & AYARLAR (6 sayfa)

#### S20: Menü (Profil'den ⚙️ ile erişilir veya drawer)
- Profil mini kartı (avatar + isim + @kullanıcıadı)
- Menü öğeleri:
  - 👥 Takipçiler & Takip → S22
  - 🔗 Arkadaşlarını Davet Et → S24
  - 📜 Topluluk Kuralları → S25
  - ⚙️ Ayarlar → S21
  - ❓ Yardım & SSS → S26
  - 📱 Hesabını Doğrula → S27 (doğrulanmamışsa)
- Alt kısım: "Çıkış Yap" (kırmızı)

#### S21: Ayarlar (Login gerekli)
- **Görünüm:**
  - Tema: Koyu / Açık (toggle switch)
- **Hesap:**
  - Şifre Değiştir
  - E-posta Değiştir
  - Telefon Numarası
- **Bildirimler:**
  - Push bildirim on/off
  - Bildirim türleri (her biri ayrı toggle): Beğeniler, Yorumlar, Yeni takipçi, Maç hatırlatıcı
- **Gizlilik:**
  - Profil gizliliği: Herkese açık / Sadece takipçilere
  - Maç geçmişi gizliliği: Herkese açık / Sadece takipçilere / Gizli
  - Konum paylaşımı on/off
- **Hakkında:**
  - Topluluk Kuralları → S25
  - Gizlilik Politikası
  - Kullanım Şartları
  - KVKK Aydınlatma Metni
  - Uygulama Versiyonu
- **Hesabı Sil** (kırmızı, en altta, onay dialog'u ile)

#### S22: Takipçiler & Takip Listesi (Login gerekli)
- **İki sekme:** Takipçiler / Takip Edilenler
- Her satır: avatar + isim + @kullanıcıadı
- "Takip Et" / "Takip Ediliyor" buton (sağda)
- Arama çubuğu
- Tıklanınca → S16 Profil

#### S24: Arkadaşlarını Davet Et (Login gerekli)
- Davet illüstrasyonu
- Kişiye özel referans linki (örn: sporwave.app/davet/berk2026)
- "Linki Kopyala" butonu
- "WhatsApp ile Paylaş" butonu
- "Instagram ile Paylaş" butonu

#### S25: Topluluk Kuralları
- No-show yasağı ve yaptırımları
- Saygılı iletişim zorunluluğu
- Fake profil / sahte ilan yasağı
- Uygunsuz içerik ve taciz yasağı
- İhlal bildirme yöntemi
- Back butonu

#### S26: Yardım & SSS
- Accordion SSS listesi
- Sorular: "Nasıl maç oluşturabilirim?", "Skor takibi nasıl çalışır?", "Hesabımı nasıl silebilirim?" vb.
- İletişim: Destek e-posta + uygulama içi form

---

### BÖLÜM 9: GÜVENLİK & MODERASYON (4 sayfa)

#### S27: Kullanıcı Doğrulama Akışı (Login gerekli)
- **Adım 1:** Telefon numarası girişi (+90)
- **Adım 2:** SMS OTP (6 haneli kod) → "Doğrula" butonu
- **Sonrası:** Profilde "✓ Doğrulanmış" rozeti, menüde "✅ Doğrulandı" etiketi

#### S28: Raporla (Bottom Sheet)
- Rapor kategorileri:
  - Fake profil
  - Uygunsuz içerik
  - Spam
  - No-show / Gelmiyor
  - Taciz / Kötü davranış
  - Diğer (serbest metin)
- "Gönder" butonu → "Teşekkürler, ekibimiz inceleyecek" mesajı

#### S29: Engelle (Onay Dialog)
- "Bu kullanıcıyı engellemek istiyor musun?"
- Açıklama: "Engellenmiş kullanıcı seni göremez, sana mesaj atamaz, maçlarında görünmez."
- "Engelle" (kırmızı) + "İptal" butonları

#### S30: Maç Sonrası Shareable Kartı (Otomatik Oluşturulur)
- **Tetikleyici:** Maç kaydedildikten sonra otomatik gösterilir
- **İçerik:** Instagram Stories / WhatsApp formatında paylaşılabilir görsel kart
  - Skor bilgisi
  - MVP oyuncusu
  - Kişisel istatistikler (gol, asist)
  - SporWave branding + QR kod
- "Instagram'da Paylaş" + "WhatsApp'ta Paylaş" + "Kaydet" butonları
- "Atla" linki

---

### BÖLÜM 10: EK SAYFALAR (3 sayfa)

#### S32: Splash Screen
- Uygulama logosu (ortalı, animasyonlu)
- Uygulama adı: "SporWave"
- Kısa slogan
- 1-2 saniye → Ana Sayfa'ya (S05) geçiş

#### S33: Boş Durum Bileşenleri (Reusable)
- Feed boşken: "Takip ettiğin kişilerin maçları burada görünecek" + "Keşfet'e Git"
- Maçlar boşken: "Şu an açık maç yok — ilk maçı sen oluştur!" + FAB'a yönlendir
- Mesaj boşken: "Henüz mesajın yok" + illüstrasyon
- Bildirim boşken: "Bildirim yok" + illüstrasyon
- Profil maç feed'i boşken: "Henüz maçın yok — ilk maçını başlat!"

#### S34: Hata Sayfası (Reusable)
- "Bir şeyler ters gitti" + illüstrasyon
- "Tekrar Dene" butonu
- "Ana Sayfaya Dön" linki

---

## SAYFA SAYISI ÖZETİ

| Bölüm | Sayfa Sayısı | Sayfalar |
|-------|-------------|----------|
| Kimlik Doğrulama & Onboarding | 4 | S01-S04 |
| Ana Sayfa (Sosyal Feed) | 2 | S05, S07 |
| Maçlar (Aksiyon) | 7 | S08-S14 |
| Maç Oluştur | 1 | S31 |
| Profil | 3 | S15, S16, S23 |
| Mesajlaşma | 2 | S17, S18 |
| Bildirimler | 1 | S19 |
| Menü & Ayarlar | 6 | S20-S22, S24-S26 |
| Güvenlik & Moderasyon | 4 | S27-S30 |
| Ek Sayfalar | 3 | S32-S34 |
| **TOPLAM** | **33** |

---

## KULLANICI AKIŞLARI

### Akış 1: İlk Kez Gelen Kullanıcı
```
Splash → Ana Sayfa/Keşfet (login gerekmez) → Maç kartlarına göz at
→ "Katıl" veya "Maç Başlat" → Login'e yönlendirilir → Kayıt
→ Onboarding (4 adım) → Kaldığı yere döner
```

### Akış 2: Maç Başlat (Canlı Skor Takibi)
```
Maçlar tab → FAB "+" → "Maç Başlat" → Format seç + konum
→ Takım kur (opsiyonel) → Canlı skor ekranı → Gol ekle (geri alınabilir)
→ Maçı bitir → Özet düzenle + fotoğraf + MVP oyla
→ Kaydet & Paylaş → Shareable kart → Feed'de görünür
```

### Akış 3: Maç Oluştur (Planlama)
```
Maçlar tab → FAB "+" → "Maç Oluştur" → Detaylar gir
→ Tarih/konum seç → Katılım ayarları → Yayınla
→ Maçlar sekmesinde görünür → Başvurular gelir
→ Maç saati → "Maçı Başlat" → Canlı skor akışına geç
```

### Akış 4: Maça Katılma
```
Maçlar tab'da açık maçı gör → Detaya git → "Katıl"
→ Seviye seç → Onay bekle veya doğrudan katıl
→ Maç gününe kadar hatırlatıcı bildirimler
→ Maç günü → katıldığın maç vurgulu bölümde en üstte
```

### Akış 5: Sosyal Etkileşim
```
Ana Sayfa feed'de maç kartı gör → Beğen / Yorum yap
→ Kullanıcı profiline git → Takip et
→ Karşılıklı takip = "Arkadaş" → Mesaj gönder / WhatsApp'a geç
```

### Akış 6: Viral Paylaşım Döngüsü
```
Maç kaydedilir → Shareable kart otomatik oluşur
→ Instagram Stories'e paylaş (SporWave branding + QR)
→ Arkadaşlar QR'ı tarar / linke tıklar → Uygulamayı indirir
→ Kendi maçlarını başlatır → Döngü tekrarlanır
```

### Akış 7: App Crash Kurtarma
```
Maç sırasında app kapanır → State otomatik kaydedilmiş
→ App tekrar açılır → "Devam eden maçın var" banner
→ "Devam Et" → Kaldığı yerden devam (kronometer duraklatılmış)
```

---

## ÖNCEKİ SPORWAVE'DEN ÇIKARILAN MODÜLLER

| Modül | Durum | Not |
|-------|-------|-----|
| Etkinlik (maraton, HYROX vb.) | MVP'de yok | v2.0'da eklenebilir |
| Dersler (eğitmen ilanları) | MVP'de yok | v2.0'da eklenebilir |
| Saha Rezervasyonu | MVP'de yok | v1.5 veya v2.0'da eklenebilir |
| Akıllı Saat entegrasyonu | MVP'de yok | v1.5'te companion app |
| Derecelendirme sistemi | MVP'de yok | Kullanıcı davranış datası toplandıktan sonra eklenir |
| Diğer spor dalları (tenis, basketbol vb.) | MVP'de yok | Halısahada pazar liderliği sonrası aşamalı ekleme |

---

## DESIGN SİSTEM NOTLARI

**Tema:** Koyu (default) + Açık (toggle)
- Koyu temada: Hevy benzeri koyu arka plan (#0B0F14), beyaz metin, accent vurgular
- Açık temada: Beyaz/açık gri arka plan, koyu metin, aynı accent renkler
- CSS değişkenleri ile tema yönetimi

**Accent renk:** `#B7F000` (yeşil-sarı, enerji hissi)

**Tipografi:** Sistem fontları + marka fontu başlıklarda

**Kart tasarımı:** Hevy antrenman kartlarından ilham — koyu arka plan, rounded corners, hafif border, büyük skor gösterimi, beğeni/yorum yapısı

**Navigasyon:** 3 tab bar, ortada tab yok (FAB Maçlar tab'ı içinde sağ altta), üst navbar'da arama + bildirim + mesaj

**Navigasyon davranışı (history stack):**
- Geri butonu her zaman bir önceki görüntülenen sayfaya döner (stack-based navigation)
- Örnek: Ana Sayfa → Maç Detay → Oyuncu Profili → Geri = Maç Detay → Geri = Ana Sayfa
- Tab'a basınca stack sıfırlanır ve o tab'ın ana sayfasına gidilir
- Sayfa içindeki tüm isim/avatar tıklamaları stack'e yeni sayfa ekler

---

> **Bu doküman onaylanınca Faz 2'ye — tıklanabilir React wireframe'e — geçilecektir.**
