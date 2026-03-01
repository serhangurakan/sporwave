# SPORWAVE v2 — Sayfa Haritası & Bilgi Mimarisi

> Bu doküman, SporWave'in yeni vizyonu (Hevy/Strava kalitesinde spor sosyal platformu + partner matching) için
> tüm sayfa yapısını, navigasyonu, her sayfanın detaylı içeriğini ve sayfa arası geçişleri tanımlar.
> MVP odağı: Halısaha/futbol. Mimari spor-agnostik olacak şekilde tasarlanmıştır.
> Uygulama dili: Türkçe. Tema: Koyu (default) / Açık (toggle ile değiştirilebilir).
> Son güncelleme: 1 Mart 2026 (oturum 4)

---

## KESİNLEŞEN KARARLAR

| Karar | Seçim |
|-------|-------|
| **MVP spor dalı** | Halısaha/Futbol (mimari spor-agnostik) |
| **Tema** | Koyu (default) + Açık tema toggle (Ayarlar'dan) |
| **Login yaklaşımı** | Gecikmeli login — uygulama login olmadan gezilir |
| **Kayıt yöntemleri** | E-posta/şifre + Google + Apple |
| **Mesajlaşma** | Uygulama içi 1-1 mesajlaşma + grup chat (maç sohbeti) + WhatsApp butonu |
| **Saha rezervasyonu** | MVP'de yok — sonra eklenecek |
| **Coğrafi kapsam** | İstanbul öncelikli |
| **Uygulama dili** | Türkçe (i18n altyapısı hazır olacak) |
| **Derecelendirme** | MVP'de yok — deneyim seviyesi self-select olarak kalacak |
| **Diğer spor dalları** | UI'da gösterilmiyor, sadece onboarding'de tercih soruluyor (data toplama amaçlı) |
| **Tab yapısı** | 3 tab: Ana Sayfa (sosyal) + Maçlar (aksiyon) + Profil (kişisel) |
| **Attendance sistemi** | MVP'de var — %60 çoğunluk kuralı ile katılım bildirimi |
| **Keşfet algoritması** | Etkileşim skoru: Like×1 + Comment×2 + Share×3, son 7 gün göreli sıralama |
| **Maç sohbeti** | MVP'de var — her planlanan maçın otomatik grup chat'i |
| **Maç editlenebilirlik** | Feed'e düştükten sonra edit yok, sadece 24 saat puanlama |
| **Host devralma** | MVP'de var — katılımcılar oylama ile host değişikliği talep edebilir (%60 çoğunluk) |
| **Maç başlatma koşulu** | Her iki takımda en az 1 oyuncu olmalı |
| **Başlamamış maç süresi** | Maç saatinden 24 saat sonra başlamamışsa otomatik silinir |
| **Maç görünürlük (geçmiş tarih)** | Tarihi geçmiş başlamamış maçlar sadece katılımcılara ve davet linkiyle görünür, S08'de herkese açık listelenmez |
| **Maç state machine** | 7 state: draft → open → full → started → ended → rating → archived |
| **Co-MVP** | Eşit oy durumunda birden fazla MVP gösterilir (Co-MVP) |
| **Maç sohbeti arşiv** | Maç arşivlenince mesajlar silinir (salt okunur arşiv yok), sadece metadata korunur |
| **Attendance hesaplama** | Son 10 maç bazlı (ilk 5 maçta gösterilmez) |
| **Skor güncelleme** | Last write wins (MVP basitliği), goal rate limit: aynı kullanıcı saniyede max 1 gol |
| **Feed modeli** | Duplicated feed — her katılımcının kendi maç postu var, feed'de ayrı ayrı görünür |
| **Maç verisi vs Post** | Maç verisi (skor, takımlar, MVP) paylaşımlı ve immutable. Her katılımcının kişisel postu (başlık, not, fotoğraf) ayrı |
| **Etkileşim (like/yorum)** | Post bazlı — beğeni ve yorumlar maça değil, kişinin postuna yapılır |
| **Post gizle/sil** | İkisi de var: "Gizle" geri alınabilir, "Sil" kalıcı. İkisi de sadece kendi postunu etkiler, maç verisi ve diğer oyuncuların postları etkilenmez |
| **Maç fotoğrafları** | Maç verisinde (Katman 1) fotoğraf yok — fotoğraflar kişisel post katmanında (Katman 2) |

---

## MAÇ STATE MACHINE

Bir maç şu state'lerden geçer:

```
draft → open → full → started → ended → rating → archived
```

| State | Açıklama | Görünürlük |
|-------|----------|------------|
| **draft** | Oluşturuldu ama yayınlanmadı | Sadece host |
| **open** | Yayında, katılıma açık | Herkese (gizlilik ayarına göre) |
| **full** | Kontenjan doldu | Sadece katılımcılara (dışarıdan görünmez) |
| **started** | Maç başladı, skor takibi aktif | Sadece katılımcılara |
| **ended** | Maç bitti, skor kilitlendi | Sadece katılımcılara (feed'e düşene kadar) |
| **rating** | 24 saatlik MVP oylama + attendance penceresi | Katılımcılara |
| **archived** | Profil ve feed'de geçmiş maç olarak görünür | Herkese (gizlilik ayarına göre) |

**Geçiş kuralları:**
- `draft → open`: Host "Yayınla" butonuna basar
- `open → full`: Kontenjan dolduğunda otomatik
- `full → open`: Bir katılımcı ayrıldığında otomatik (kontenjan açılır)
- `open/full → started`: Host "Maçı Başlat" butonuna basar. Koşul: her iki takımda en az 1 oyuncu
- `started → ended`: Herhangi bir katılımcı "Maçı Bitir" butonuna basar (onay dialog'u ile)
- `ended → rating`: Maç kaydedildikten sonra otomatik (24 saat pencere başlar)
- `rating → archived`: 24 saat dolunca otomatik

**Kısıtlamalar:**
- Skor SADECE `started` state'inde değiştirilebilir
- `ended` sonrası skor kilitlenir
- `archived` maçlar hiçbir şekilde düzenlenemez
- Takım değişikliği SADECE `started` öncesi mümkün
- `full` state'indeki maçlar katılımcı olmayan kullanıcılara görünmez
- Dolu maçtan ayrılan eski katılımcılar da maçı göremez
- Arkadaş olmak `full` kısıtlamasını bypass etmez

---

## NAVİGASYON YAPISI

### Üst Navbar (sadece Ana Sayfa tab'ında, sticky)
```
Ana Sayfa tab'ında:
[ Ana Sayfa ▾ / Keşfet ▾ ]         [ 🔍 ]  [ 🔔 ]  [ 💬 ]
```
- **Ana Sayfa ▾ / Keşfet ▾**: Sol üstte dropdown, tab adını gösterir (Hevy tarzı). Logo yok — dropdown onun yerini alır.
  - **Tipografi:** 20px / weight 800 / Plus Jakarta Sans (post başlıklarından büyük — 16px/700 — hiyerarşi sağlar)
  - **İkon:** Home/compass ikonu yalnızca dropdown içinde gösterilir; header'da başlık metni + sağında ▾ chevron ikonu (açıkken 180° döner)
  - **Hizalama:** Başlık metni 16px sol kenardan başlar — kart başlıklarıyla aynı dikey hizaya oturur
- **🔍 / 🔔 / 💬**: Arama, bildirimler, mesajlar ikonları sağda.
- **Sadece Ana Sayfa tab'ında görünür.** Maçlar, Profil ve diğer alt sayfalarda (S07, S42, S43 vb.) üst navbar gösterilmez.
- **Sticky**: Scroll'da üstte sabit kalır (backdrop blur efekti)
- Okunmamış varsa kırmızı badge (sayı)

### Alt Tab Bar (3 sekme)
```
[ 🏠 Ana Sayfa ]    [ ⚽ Maçlar ]    [ 👤 Profil ]
```
- **🏠 Ana Sayfa**: Sosyal feed — dropdown ile Ana Sayfa (takip edilenler) / Keşfet (herkes)
- **⚽ Maçlar**: Katılabileceğin açık maçlar + katıldığın maçlar + sağ altta FAB "+" (oluştur/başlat)
- **👤 Profil**: Hevy tarzı — grafik + pano + istatistikler + maç feed'i + ayarlar
- Aktif tab accent renkle vurgulanır

---

## SAYFA HARİTASI — TOPLAM 38 SAYFA

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
- ← Geri butonu (sol üst, BackLink bileşeni — S01'e döner)
- Başlık ve açıklama metinleri sola hizalı
- E-posta input
- "Sıfırlama Linki Gönder" butonu
- **Başarılı gönderim durumu (inline):**
  - Yeşil kutu: başarı ikonu + "Link gönderildi!" + spam uyarısı
  - 60sn countdown timer: "Xsn sonra tekrar gönderebilirsin" → süre dolunca "Tekrar Gönder" linki aktif olur
  - "← Giriş Yap'a Dön" linki (sadece başarı ekranında görünür)

#### S04: Onboarding (4 adımlı — kayıt sonrası veya sosyal login sonrası)
- İlerleme çubuğu (en üstte, 4 adım)
- ← Geri butonu (ilerleme çubuğunun altında, adım 2-4'te görünür — BackLink bileşeni)

**Adım 1 — Temel Bilgiler:**
- İsim input
- Soyisim input
- Doğum tarihi picker
- Cinsiyet seçimi (Erkek / Kadın / Belirtmek istemiyorum)
- "Devam" butonu

**Adım 2 — Profil Fotoğrafı:**
- Büyük yuvarlak fotoğraf alanı + kamera ikonu (tıklanabilir)
- Fotoğraf alanına tıklayınca alttan bottom sheet açılır:
  - "Fotoğraf Çek" seçeneği (kamera ikonu)
  - "Galeriden Seç" seçeneği (galeri ikonu)
  - "Vazgeç" linki (sheet'i kapatır)
- Seçim yapılınca dummy fotoğraf yüklenir, border accent renge döner
- Yüklenen fotoğrafın sağ üstünde X butonu (accent renkli, tıklayınca fotoğrafı kaldırır)
- "Fotoğraf Yükle" butonu (fotoğraf yüklenince "Devam" olarak değişir)
- "Sonra Ekle" linki (atlanabilir — fotoğraf yüklenince gizlenir)

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
  - **🌐 Keşfet** — yüksek etkileşimli geçmiş maç kartları (etkileşim skoru eşiğini geçenler)
- **Üstte sağ:** 🔍 Arama + 🔔 Bildirimler

**Keşfet modundayken — Önerilen Kullanıcılar bölümü:**
- Feed'in **ilk postundan sonra** yatay scroll önerilen kullanıcı kartları (feed'in en üstünde değil — ilk post görünür, ardından öneri kartları gelir)
- Her kart: Avatar (52px) + isim (ilk isim) + @kullanıcıadı + "Takip Et" butonu (accent renk, plus ikonu ile)
- Kart tasarımı: T.card arka plan + border + 16px border-radius, yatay scroll, gizli scrollbar (swipe/drag ile gezilir)
- **Öneri algoritması (öncelik sırası):**
  1. Daha önce birlikte maç yaptığın ama takip etmediğin kullanıcılar
  2. Arkadaşlarının arkadaşları (takip ettiklerinin takip ettikleri)
  3. Aynı şehirden random profiller (hiç arkadaş/maç yoksa)

**İçerik:** Maç postları dikey listesi (feed) — **Duplicated feed modeli (post bazlı)**

**Duplicated Feed & Post Modeli:**
- Bir maç tamamlandığında her katılımcı için otomatik olarak bir **kişisel post** oluşturulur.
- **1 katılımcı = 1 post.** Aynı maçtan birden fazla post feed'de ayrı ayrı görünebilir.
- Her post, post sahibinin kişisel versiyonudur: kendi başlığı, notu, fotoğrafları olabilir.
- Beğeni ve yorumlar **posta yapılır, maça değil.** Her postun kendi etkileşimi vardır.
- Feed sıralaması: **Postun oluşturulma/düzenlenme tarihine göre** azalan sıra (kronolojik).

**İki Katmanlı Veri Modeli:**
- **Katman 1 — Maç Verisi (paylaşımlı, immutable):** Skor, takımlar, süre, konum, tarih, MVP, gol timeline. Maç arşivlendikten sonra değiştirilemez. Tüm katılımcıların postlarında aynı maç verisi görünür.
- **Katman 2 — Kişisel Post (per player):** Her katılımcı kendi postunu düzenleyebilir:
  - **Maç başlığı:** Varsayılan olarak maç başlığını alır, kişi değiştirebilir
  - **Kişisel not:** Opsiyonel açıklama (örn: "2 gol attım 🔥")
  - **Kişisel fotoğraflar:** Kendi çektiği fotoğraflar (max 4)
  - **Görünürlük:** visible (varsayılan) / hidden (gizli, geri alınabilir) / deleted (kalıcı silme)

**Ana Sayfa (Takip Edilenler) — Görünürlük kuralı:**
- Takip ettiğin kişilerin **postları** görünür.
- 3 arkadaşın aynı maçtaysa → 3 ayrı post (her biri kendi kişisel versiyonuyla).
- Post sahibi postunu gizlemiş/silmişse → o post feed'de görünmez, diğerlerininki etkilenmez.

**Ana Sayfa post kartı üst satırı:**
- Post sahibinin avatarı + ismi + tarih/saat + ⋮ menü
- **İsim tıklanabilir → S16 Profil**

**Keşfet — Görünürlük ve sıralama kuralı:**
- Belli bir etkileşim eşiğinin üzerindeki kullanıcıların **postları** görünür, takip durumundan bağımsız.
- **Etkileşim Skoru (post bazlı):** Like × 1 + Comment × 2 + Share × 3
- **Sıralama:** Son 7 günün en yüksek etkileşim puanlı **postları**, üstten alta sıralı.
- **Minimum eşik:** En az 1 etkileşim (0 etkileşimli post keşfette görünmez).
- Aynı maçtan birden fazla post keşfette görünebilir — hangisi daha çok etkileşim aldıysa o üstte.
- **Not:** İlk aşamada sabit eşik yerine göreli sıralama kullanılır — uygulama büyüdükçe A/B test ile katsayılar ayarlanabilir.

**Aynı maç bağlantısı:**
- Aynı maça ait postlarda "👥 Ali ve Emre de bu maçta oynadı" bağlantı satırı gösterilir (tıklanınca o kişilerin postlarına gidilebilir).
- Bu satır sadece takip ettiğin kişilerden birinin aynı maçta olması durumunda görünür.

**Her post kartı yapısı:**
- **Üst satır:**
  - Post sahibi avatarı + isim
  - Tarih/saat + ⋮ menü (Raporla / Engelle — kendi postunsa: Düzenle / Gizle / Sil)
  - **İsim tıklanabilir → S16 Profil**
- **Maç başlığı** (bold): post sahibinin kişisel başlığı (varsayılan: maç başlığı)
- **Kişisel not** (varsa): post sahibinin açıklaması
- **Özet bilgi satırı:** Süre · Konum · Format badge · Oyuncular
- **Medya / Skor alanı (MediaSlider):**
  - **Fotoğraf yoksa:** Skor board sabit yükseklik kullanmaz, içerik kadar (hug content) yükseklik alır; Takım A **[X]** — **[Y]** Takım B (büyük, merkezi) + MVP. Tıklanınca → S11.
  - **Fotoğraf varsa:** Tam genişlikte slide gösterimi — her fotoğraf ayrı slide (max 4), son slide = skor board. Sol/sağ dokunma ile geçiş; alt-orta dot indikatörü (skor slide'ı accent renk ile vurgulanır); sağ üstte sayfa sayacı ("1/2" veya 📊).
  - **Skor:** Kazanan takımın skoru accent renk (`#B7F000`) ile, kaybeden takımın skoru beyaz ile gösterilir. Berabere ise ikisi de beyaz.
  - **Maçın Yıldızı** (mvp varsa — skorun hemen altında, ortalı):
    - ⭐ + isim — **isim tıklanabilir → S16 Profil**
    - Eşit oy durumunda Co-MVP: birden fazla isim gösterilir (⭐ isim1, ⭐ isim2)
- **Aynı maç bağlantısı** (varsa): "👥 Ali ve Emre de bu maçta oynadı"
- **Etkileşim satırı:**
  - 👍 Beğeni (sayı) + 💬 Yorum (sayı, tıklayınca → S42 Yorumlar sayfası) + ↗ Paylaş ikonu (yazısız, sadece ikon)
- **Beğenenler satırı** (beğeni varsa):
  - Avatarlar + "**İlk beğenen isim** ve X diğerleri" — **ilk isim tıklanabilir → S16 Profil**, "X diğerleri" tıklanınca → S43 Beğeniler sayfası
- **Yorumlar** (max 2 yorum görünür):
  - Her yorum: Avatar + kullanıcıadı + zaman + yorum metni — **kullanıcı adı tıklanabilir → S16 Profil**
  - 2'den fazla yorum varsa sadece ilk 2 gösterilir. Tüm yorumlara erişim etkileşim satırındaki yorum ikonundan sağlanır (→ S42)
- **Yorum ekle:** "Bir yorum ekle..." input alanı (tıklayınca → S42 Yorumlar sayfası)
- **Tüm kart tıklanabilir** → Maç Detay (S11)

**Post yönetimi (⋮ menüsünden — kendi postun için):**
- **Düzenle** → başlık, not, fotoğraf düzenleme ekranı
- **Profilimden Gizle** → post feed ve profilden kaybolur, geri getirilebilir
- **Postu Sil** → onay dialog'u: "Bu maçın senin profilindeki postu kalıcı olarak silinir. Maç verisi ve diğer oyuncuların postları etkilenmez." Silinen postun beğeni ve yorumları da silinir.

**Post durumları:**
| Durum | Profilde | Feed'de | Geri alınabilir |
|-------|---------|---------|----------------|
| **visible** (varsayılan) | Görünür | Görünür | — |
| **hidden** (gizli) | Görünmez | Görünmez | Evet |
| **deleted** (silinmiş) | Görünmez | Görünmez | Hayır |

**Maç verisi editlenebilirlik kuralı:** Maç verisi (Katman 1) arşivlendikten sonra editlenemez. Kişisel post (Katman 2) her zaman düzenlenebilir (başlık, not, fotoğraf). Son maç verisi düzenleme noktası S10 Adım 4'tür. Sonrasında sadece 24 saat boyunca MVP oylama ve attendance bildirimi yapılabilir.

**Boş durum (Ana Sayfa — kimseyi takip etmiyorsan):**
- İllüstrasyon + "Henüz kimseyi takip etmiyorsun"
- "Keşfet'e Git" butonu

#### S07: Kullanıcı Arama Sonuçları
- Üst navbar'daki 🔍 ikonundan erişilir
- Arama çubuğu (üstte, aktif, otofokus)
- **Önerilen Kullanıcılar (arama boşken):** Keşfet'teki öneri algoritmasıyla aynı kullanıcılar dikey liste halinde gösterilir.
  - Her satır: Avatar + isim + @kullanıcıadı + maç sayısı + "Takip Et" butonu (sağda)
  - Tıklanınca → Kullanıcı Profili (S16)
- **Arama sonuçları (yazı yazılınca):**
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

**Puanlanmamış maçlar (en üstte, turuncu border):**
- Kullanıcının henüz MVP oylaması ve/veya attendance bildirimi yapmadığı biten maçlar
- Turuncu border ile vurgulu kart + "⭐ Bu maçı değerlendir" badge'i
- Tıklanınca → S40 Puanlama & Attendance sayfası
- Puanlama yapıldıktan sonra kart buradan kalkar

**Devam eden maç widget'ı (varsa — footer üstünde):**
- Footer'ın hemen üstüne sabitlenmiş kompakt widget
- İçerik: ↑ yukarı ok (sol) | "Aktif Maç" | güncel süre | 🗑️ kırmızı çöp kutusu (sağ)
- Yukarı oka tıklanırsa → S10 Canlı Skor sayfasına geri dönülür
- Çöp kutusuna tıklanırsa → "Bu maçı silmek istediğinize emin misiniz?" popup (Maçı Sil / İptal)
- Bu widget Ana Sayfa (S05), Maçlar (S08) ve Profil (S15) sayfalarında görünür
- Maç detay, ayarlar vb. sayfalarda görünmez

**Katıldığım yaklaşan maçlar (collapse/expand bölümü):**
- Başlık tıklanabilir toggle: "Katıldığım Maçlar" + sağında maç sayısı "(X)" + chevron ikonu (▼/▲)
- Tıklanınca maç kartları gizlenip gösterilebilir (varsayılan: açık)
- Farklı arka plan rengi veya sol kenarda accent renk border ile ayrışır
- Tarih sırasına göre (en yakın olan en üstte)
- **Her kart (katılım bilgisi EN ÜSTTE):**
  - "Katılıyorsun ✓" badge (accent renk, kartın en üstünde)
  - Spor ikonu + Maç başlığı (bold)
  - Tarih/saat + Konum
  - Organizatör: avatar + isim
  - Kontenjan: "7/10 oyuncu" (progress bar)
  - Görünürlük badge'i: 👁️ veya 🔒 (küçük, sağ üstte)
  - Tarihi geçmiş başlamamış maçlarda: "⏰ Maç saati geçti" etiketi (turuncu-sarı)
  - Tıklanınca → S12 Planlanan Maç Detay

**Açık maçlar (altında, standart liste):**
- **Arkadaşlarının katıldığı maçlar önce**
- Ardından diğer açık maçlar (tarihe göre sıralı)
- **Tarihi geçmiş başlamamış maçlar bu listede gösterilmez** — sadece katılımcılara görünür
- **Her kart (katılım bilgisi EN ÜSTTE):**
  - Arkadaş katılıyorsa: "🤝 Ali katılıyor" etiketi (kartın en üstünde)
  - Spor ikonu + Maç başlığı (bold)
  - Tarih/saat + Konum
  - Organizatör: avatar + isim
  - Kontenjan: "7/10 oyuncu" (progress bar)
  - Deneyim seviyesi tercihi badge'i (varsa: "Herkes" / "Orta+")
  - Kabul modu badge'i (varsa: "Onay gerekli")
  - Görünürlük badge'i: 👁️ (küçük, sağ üstte)
  - Saha belirlenmemişse: "📍 [İlçe] — Saha belirlenecek"
  - Tıklanınca → S12 Planlanan Maç Detay

**Görünürlük badge'i:**
- Her maç kartında küçük bir görünürlük badge'i gösterilir:
  - 👁️ "Herkese Görünür" (yeşil) — maç S08'de açık maçlar listesinde herkese görünüyor
  - 🔒 "Sadece Katılımcılara" (gri) — maç sadece katılımcılara ve davet linkiyle görünüyor
- Bu badge, maçın Maç Bul sayfasında (S08) görünür olup olmadığını gösterir
- Host bu bilgiyi görerek maçın keşfedilebilirlik durumunu anlayabilir

**Tarihi geçmiş başlamamış maçlar:**
- Maç saati geçtiği halde henüz başlamamış maçlar **S08'deki açık maçlar listesinde diğer kullanıcılara gösterilmez**
- Bu maçlar yalnızca **maçın katılımcılarına** "Katıldığım yaklaşan maçlar" bölümünde görünür (turuncu-sarı uyarı border ile "⏰ Maç saati geçti — Başlatılmayı bekliyor" etiketi)
- **Davet linki** ile maç görüntülenebilir — link sahibi maçı görebilir ama S08 listesinde görmez
- Host maçın tarihini gelecek bir tarihe güncellerse → maç tekrar S08'de herkese görünür olur ve görünürlük badge'i "👁️ Herkese Görünür" olarak güncellenir
- **Otomatik silme:** Maç saatinden **24 saat** geçtikten sonra hala başlamamışsa maç otomatik silinir, tüm katılımcılara bildirim gider

**Not:** Bu sayfada tamamlanmış geçmiş maçlar gösterilmez. Geçmiş maçlar Ana Sayfa feed'inde (S05) ve Profil'de (S15) görünür.

**Boş durum:** "Şu an açık maç yok — ilk maçı sen oluştur!" + FAB'a yönlendirme

**Sağ altta FAB "+" butonu** → tıklayınca S09 Bottom Sheet açılır

#### S09: Maç Seçenekleri (Bottom Sheet — FAB'a basınca)
- **Başlık:** "Ne yapmak istiyorsun?"
- İki büyük seçenek kartı (background transparent, sadece border):
  1. **"▶ Maç Başlat"** — "Hemen oynayacağın bir maçı başlat ve skor tut" (accent border + play ikonu)
  2. **"📢 Maç Oluştur"** — "İleri tarihli maç planla ve oyuncu bul" (purple border + megaphone ikonu)
- Kart padding: `14px 16px`, başlık `fontSize:16, fontWeight:700, FH`, açıklama `fontSize:12, FB`
- Kart tıklanınca ilgili akışa geçiş

#### S10: Maç Başlat (Canlı Skor Takibi — Login gerekli)
- **Amaç:** Maçı o an oynuyorken başlat, canlı skor tut, bitince kaydet

**Maç başlatma koşulu:** Her iki takımda en az 1 oyuncu (uygulama kullanıcısı veya misafir) kayıtlı olmalı. Planlanan maçlarda (S31) maç saatinden sonra da başlatılabilir — 24 saat boyunca başlatma imkanı devam eder.

**Sayfa yapısı (2 adım + Canlı Skor — progress bar + geri butonu VAR):**

**Maç Başlat — Adım 1/2 (S10_SETUP):**
- Progress bar (2 adım, üstte)
- ← Geri butonu (S08 Maçlar'a döner)
- Adım etiketi: "ADIM 1/2"
- Maç formatı: 5v5 / 6v6 / 7v7 / Özel
- Konum: Otomatik GPS + manuel düzenleme
- "Devam" butonu → Takım Oluştur sayfasına geçiş

**Takım Oluştur — Adım 2/2 (S10_TEAMS):**
- Progress bar (2 adım, 2. adım aktif)
- ← Geri butonu (S10_SETUP'a döner), "Atla" seçeneği yok
- Takım 1 vs Takım 2
- Her takıma oyuncu ekle:
  - **Uygulama kullanıcısı:** İsim/@kullanıcıadı ile ara, seç
  - **Misafir Oyuncu:** "Misafir Ekle" butonu → sadece isim girişi (otomatik doldurma yok)
- Takım rengi seçimi (opsiyonel)
- **Drag & drop ile takım değişikliği:** Oyuncular iki takım arasında sürükle-bırak ile taşınabilir. Mobilde uzun basma (long press) ile drag başlar. İki kolon (Takım 1 | Takım 2) formatında.
- "Başla" butonu → Canlı Skor sayfasına geçiş

**Canlı Skor Sayfası (ayrı sayfa):**
- **Sol üstte ← geri ok (SVG):** Tıklanırsa canlı skor minimize edilir → "Maç Oynanıyor" widget'ına dönüşür (footer üstünde)
- **Takımlar & Maç Ayarları butonları:** Üstte 2 buton — "Takımlar" (takım kurulumuna döner) ve "Maç Ayarları" (maç kurulumuna döner)
- **Büyük skor gösterimi:** Takım 1 **[X]** — **[Y]** Takım 2
- **Süre sayacı:** Kronometer (başlat/duraklat) — sadece aktif süre sayılır, **offline çalışmaz** (uygulama kapanırsa kronometre durur)
- Her takım için **"+ Gol"** butonu (büyük, kolay tıklanabilir, takım rengiyle)
- **Gol eklenince — Bottom Drawer akışı:**
  - Drawer açılır → golü atan takımın oyuncu listesi gösterilir
  - Başlık: "Golü kim attı?" + altta "Atla" seçeneği
  - Oyuncu seçilirse → ikinci drawer: "Asisti kim yaptı?" + aynı format + "Atla" seçeneği
  - "Golü kim attı?" atlanırsa → asist sorulmaz
  - Golcü/asist bilgisi girilirse → gol geçmişinde takım ismi yerine oyuncu isimleri gösterilir
  - **5 saniyelik "Geri Al" toast:** "Gol eklendi — Geri Al" (tıklanırsa gol iptal)
- **Gol geçmişi listesi** (kronolojik): "12' Berk (Asist: Ali)" formatında
  - Her gol satırında **sola kaydır (swipe) → "Sil"** aksiyonu
- **Otomatik kaydetme:** Her gol ekleme/silme anında state local storage + backend'e kaydedilir
- **Çoklu kullanıcı skor güncelleme:** Maçtaki **tüm katılımcılar** gol ekleyebilir/silebilir — sadece host değil. Skor real-time sync olur (backend üzerinden).
- **Skor kuralları:**
  - **Last write wins** — çakışma durumunda son yazılan geçerli (MVP basitliği)
  - **Goal rate limit:** Aynı kullanıcı saniyede 1'den fazla gol eventi oluşturamaz (≥1 saniye aralık zorunlu)
  - Her gol bir event log entry olarak kaydedilir — event log final skoru belirler
- **"Maçı Bitir"** butonu — **tüm katılımcılarda aktif** (onay dialog'u ile: "Maçı bitirmek istediğine emin misin?")

**Aşağı ok (minimize) davranışı:**
- Canlı skor sayfasında sol üstte ↓ aşağı ok ikonuna basınca → maç minimize edilir
- "Devam eden maçın var" widget'ı footer'ın üstüne sabitlenir
- Widget: ↑ yukarı ok (sol) | "Aktif Maç" | güncel süre | kırmızı çöp kutusu (sağ)
- Yukarı ok → canlı skor sayfasına geri dön
- Çöp kutusu → "Bu maçı silmek istediğinize emin misiniz?" popup (Maçı Sil / İptal)
- Widget Ana Sayfa (S05), Maçlar (S08) ve Profil (S15) sayfalarında görünür

**App kapanması / crash koruması:**
- Uygulama tekrar açıldığında: "Devam eden maçın var" widget'ı görünür
- Kronometer duraklatılmış olarak bekler, kullanıcı devam ettiğinde kaldığı yerden devam (gerçek zamanlı saymaz arkaplanda)
- 24 saatten fazla geçtiyse: "Bu maçı tamamlamak ister misin?" → Evet: maç sonu sayfasına git / Hayır: maçı sil

**Maç Sonu — Kaydet & Paylaş (SON MAÇ VERİSİ EDİT NOKTASI):**
- Skor özeti: Takım 1 [X] — [Y] Takım 2
- Maç süresi
- **Gol zaman çizelgesi (düzenlenebilir):**
  - Her gol satırında: dakika, golcü ismi (tıkla → değiştir), asist ismi (tıkla → değiştir), sil butonu
  - "Gol Ekle" butonu (maç sırasında kaçırdıysan buradan da ekleyebilirsin)
- **Kadro düzenleme (ZORUNLU):** "Kaydet" butonuna basmadan önce en az 2 oyuncu (her takımdan 1) eklenmiş olmalı. Takım kurulumunda atlandıysa burada tamamlanmalı.
- **Drag & drop ile takım değişikliği:** Takım kurulumu sayfası ile aynı.
- **Maç Başlığı** input (opsiyonel, placeholder: "Kadıköy Halısaha Maçı") — maç verisinin başlığı, tüm postların varsayılan başlığı olur
- **"Kaydet & Paylaş"** butonu → maç arşivlenir (Katman 1 kilitlenir) → aktif maç widget'ı kapanır (toggle off) → tüm katılımcılar için otomatik post oluşturulur (Katman 2, visible) → S30 Shareable kart gösterilir
- **"Maçı Sil"** butonu (Kaydet & Paylaş altında, kırmızı text) → popup: "Bu maçı silmek istediğinize emin misiniz?" + "Maçı Sil" (kırmızı) + "İptal" butonları
- **Not:** Fotoğraf ve kişisel not bu ekranda eklenmez — bunlar kişisel post katmanındadır. Her katılımcı kendi postunu profilinden düzenleyerek not, fotoğraf ve başlık ekleyebilir.
- **Not:** MVP oylama ve attendance bildirimi bu sayfada yapılmaz — maç kaydedildikten sonra S40'ta 24 saat boyunca yapılır.

#### S11: Maç Detay Sayfası (Geçmiş — oynanmış maç)
- **Üst bölüm:** Spor ikonu + Maç başlığı (büyük, bold)
- **Skor kartı:** Takım 1 **[X]** — **[Y]** Takım 2 (büyük, merkezi)
- **Meta bilgiler:** Tarih/saat · Süre · Konum · Maç formatı (5v5 vb.)
- **Takım kadroları (yan yana iki kolon):**
  - Takım 1 listesi: avatar + isim + gol/asist sayısı + MVP yıldızı (varsa) — **her oyuncu tıklanabilir → S16 Profil**
  - Takım 2 listesi: aynı format
  - Misafir oyuncular gri tonunda, profil linki yok
  - Katılmadı olarak işaretlenen oyuncular: "❌ Katılmadı" etiketi
- **Gol zaman çizelgesi:** Kronolojik gol listesi — **gol atan ve asist yapan isimler tıklanabilir → S16 Profil**
- **Maçın Yıldızı:** MVP seçilen oyuncu vurgulu gösterim (altın çerçeve). Eşit oy durumunda Co-MVP olarak birden fazla oyuncu gösterilir.
- **Not:** S11 maç verisini (Katman 1) gösterir — fotoğraf ve kişisel notlar burada yoktur, bunlar post kartlarında görünür.
- **Etkileşim:** S11'de beğeni/yorum yapılmaz — etkileşim post bazlıdır. S11 salt okunur maç detayıdır.
- **Katılımcıların postlarına erişim:** "Bu maçın postları" bölümü (altta): katılımcıların post kartları listesi (tıklanınca ilgili postun feed görünümüne gider).
- **Not:** Geçmiş maç verisi (Katman 1) editlenemez. Kişisel postlar (Katman 2) her zaman düzenlenebilir.
- Back butonu

#### S12: Planlanan Maç Detay (Henüz oynanmamış)
- **Header:** ← Maçlar (geri + yazı birlikte, S08'e döner) · ⋮ menü sağda (başlık yok)
- **⋮ Dropdown Menü:**
  - **Host ise:** "Maçı İptal Et" (kırmızı) + "Maçtan Çık"
  - **Katılımcı ise:** "Maçtan Ayrıl"
  - **Misafir ise:** görüntülemez (menü açılmaz)
- Üst bölüm: Maç başlığı (ikon yok)
- Organizatör: avatar + isim (tıklanınca profil)
- **Bilgi kartı:** Tarih/saat · Konum · Format · Seviye tercihi
  - **Host için:** bilgi kartının sağ üstünde "✏️ Düzenle" butonu → bottom drawer (Tarih, Saat, Konum, Format, Seviye, Görünürlük alanları)
- Saha belirlenmemişse: "📍 [İlçe] — Saha belirlenecek"
- **Görünürlük badge'i:** 👁️ "Herkese Görünür" (yeşil) veya 🔒 "Sadece Katılımcılara" (gri)
- **Kontenjan gösterimi:** "7/10 oyuncu" (progress bar ile)
- **Tarihi geçmiş uyarısı** (maç saati geçmişse ve başlamamışsa): "⏰ Maç saati geçti — Başlatılmayı bekliyor" banner'ı (turuncu-sarı) + otomatik silinmeye kalan süre
- **Takım görünümü:**
  - Takım A (accent) | Takım B (orange) — her iki kolon 3'er grid, satır satır hizalı
  - Her hücre: host badge üstte (sabit yükseklik alanı) + avatar + isim
  - Boş slotlar kesik daire + "Boş" placeholder olarak gösterilir (fmt'e göre — 6v6 ise 6 slot her takımda)
  - **Host için:** oyuncuları sürükle-bırak veya tıkla→slot seç ile takımlara ata; hücre üzerinde gri ✕ butonu → oyuncuyu maçtan çıkar
  - **Katılımcılar** (takım seçmemiş oyuncular): takım grid'inin altında section label + liste görünümü (avatar + isim + seviye + katılım %)
  - **Host için:** her katılımcının yanında "⋮" menüsü → "Maçtan Çıkar"
- **CTA Butonları (katılımcıysan) — sırayla:**
  1. Paylaş
  2. Maç Sohbeti
  3. 👑 Host Devral
  4. ▶ Maçı Başlat (primary, en altta)
- **CTA Butonları (katılmamışsan / misafir) — sırayla:**
  1. Paylaş
  2. Maça Katıl (X yer kaldı) (primary, en altta)
- **CTA Butonları (organizatör / host) — sırayla:**
  1. Paylaş
  2. Başvuruları Gör (onay modundaysa)
  3. Oyuncu Davet Et (tıklanınca bottom drawer açılır — arkadaş listesinden davet)
  4. ▶ Maçı Başlat (primary, en altta)

**Host Devralma Mekanizması:**
- Maçın katılımcıları (host hariç) "👑 Host Devral" butonuna basarak host olmak için oylama başlatabilir
- Oylama başlatılınca **tüm katılımcılara** (talep eden dahil, mevcut host dahil) bildirim gider
- Oylama süresi: **24 saat** (veya maç başlayana kadar — hangisi önce gelirse)
- **%60 çoğunluk kuralı:** Oy veren katılımcıların %60'ı veya fazlası "Evet" derse → host değişir
- **Minimum oy:** En az 3 kişi oy vermiş olmalı (3'ün altında oy varsa oylama geçersiz sayılır)
- Oylama sonucunda host değişirse: eski host'a ve tüm katılımcılara bildirim gider, yeni host tüm host yetkilerini alır
- Aynı anda sadece 1 aktif host devralma oylaması olabilir
- Host devralma oylaması S12'de inline banner olarak gösterilir: "👑 [İsim] host olmak istiyor — Oyla!" + "Evet" / "Hayır" butonları + kalan süre

**Host Maçtan Çıkış Kuralı:**
- Host ⋮ menüden "Maçtan Çık" seçerse: maça katılan katılımcılar arasından **en önce katılana** otomatik olarak host yetkisi devredilir
- Devir anında hem eski host'a hem yeni host'a bildirim gönderilir
- Eğer başka katılımcı yoksa: maç otomatik iptal edilir

**Maç başlatma koşulları:**
- **Her iki takımda en az 1 kayıtlı oyuncu** olmalı (misafir oyuncular da sayılır)
- Maç saati gelince "🎮 Maçı Başlat" butonu aktif olur
- **Maç saatinden sonra da başlatılabilir** — maç geçmiş tarihe düşse bile 24 saat boyunca başlatma imkanı devam eder
- Maç saatinden **24 saat** geçtikten sonra başlamamışsa → maç otomatik olarak silinir ve tüm katılımcılara bildirim gider

#### S13: Başvuru Yönetimi (Organizatör için — Login gerekli)
- Maç başlığı (üstte)
- Gelen başvuru listesi:
  - Her başvuru: avatar + isim + deneyim seviyesi + katılım oranı (%)
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
- İlerleme çubuğu (4 adım)

**Adım 1 — Maç Detayları:**
- Maç başlığı input (placeholder: "Cumartesi Halısaha Maçı")
- Açıklama textarea (opsiyonel)
- Maç formatı: 5v5 / 6v6 / 7v7 / Özel
- "Devam" butonu

**Adım 2 — Tarih & Konum:**
- Tarih picker
- Saat picker
- **Konum seçimi (opsiyonel):** Map picker açılır, pin atılır
  - **Seçenek 1 — "Saha Biliyorum":** Pin atar + saha adı girer
  - **Seçenek 2 — "Saha Önerisine Açığım":** Sadece semt/ilçe düzeyinde pin atar, saha adı boş bırakılır. Maç kartında "📍 Kadıköy — Saha belirlenecek" şeklinde görünür. Katılımcılar maç sohbetinde (S35) sahayı birlikte belirler. Host daha sonra maçı düzenleyerek kesin sahayı ekler.
  - **Seçenek 3 — "Konumsuz Devam Et":** Konum belirtmeden maç oluştur. Maç kartında konum gösterilmez, sohbette belirlenir.
- **Buton sırası:** "Devam" birincil butonu önce, altında "Konumu sonra belirle →" ikincil link — konum seçilmemişken görünür, seçilince gizlenir

**Adım 3 — Katılım Ayarları:**
- Maksimum oyuncu sayısı (number input)
- Deneyim seviyesi tercihi (pill: Herkes / Başlangıç / Orta / İyi / Profesyonel) — **varsayılan: "Herkes" seçili**
- Kabul modu:
  - "Herkesi Kabul Et" — ilk gelen alır
  - "Onay ile Kabul Et" — başvuruları sen onaylarsın
- Gizlilik ayarı (saha bilgisinden bağımsız, her durumda seçilebilir):
  - "Herkese açık" — Maçlar sekmesinde görünür
  - "Sadece takipçilere" — sadece takipçilerin görebilir
  - "Sadece davet ile" — link paylaşarak katılım
- Seviye tercihi, Kabul Modu ve Gizlilik seçim elementleri aynı stil: `borderRadius:12, padding:"10px 16px"`, seçilince accent border + accent renkli metin
- "Devam" butonu

**Adım 4 — Davet (opsiyonel):**
- "Arkadaşlarını Davet Et" — arkadaş listesi (takip edilenler), her profil yanında "Davet Et" butonu
- Davet gönderilince buton: yeşil tik ikonu + **"Davet Edildi"** (accent renk border + accent renk metin)
- **Kullanıcı bazlı 15 sn cooldown:** Aynı kişiye 15 sn içinde tekrar davet gönderilemez, diğer kişilere cooldown'sız davet atılabilir
- **"Yayınla 📢"** butonu (Atla linki yok — adım atlanmak isteniyorsa direkt Yayınla'ya basılır)

**Yayınla sonrası:**
- Maç sohbeti (S35) otomatik oluşturulur
- Deep link üretilir (sporwave.app/mac/XXXX) — WhatsApp, Instagram, SMS ile paylaşılabilir
- Davet edilen kişilere bildirim + 1-1 sohbette davet kartı gider

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
- **Katılım Oranı:** "%94 Katılım" badge'i (ilk 5 maçta gösterilmez — yeni kullanıcı koruması)

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
  - **Win/loss hesaplama:** Sadece "ended" state'inde olan VE final skoru kaydedilen maçlarda, kullanıcının maç bitişinde Takım A veya Takım B'de olmasına göre hesaplanır
- 🏆 **Başarılar** → Kazanılan rozetler ve ilerleme
- 📅 **Takvim** → Detaylı takvim görünümü:
  - Maç günleri accent renk noktalar ile gösterilir
  - **Bir güne tıklayınca** o günün maçları listelenir: maç başlığı, saat, konum, durum
  - Buradan maç detayına gidilebilir (S11 veya S12)
  - "Düzenle" / "Reschedule" aksiyonu alınabilir (planlanan maçlar için)

**Seri Gösterimi** (varsa, vurgulu):
- "🔥 X haftalık serin!" (aktif seri)
- "En uzun seri: X hafta"

**Rozetler** (kazanılanlar yatay scroll):
- 🏅 50 Maç Kulübü / ✅ %100 Katılım / 🎙️ Süper Organizatör / 🆕 Yeni Üye vb.

**Maç post feed'i:**
- Profil sayfasının alt yarısı = kullanıcının **kişisel maç postları** (S05 post kartı formatında)
- Her post kartı tıklanabilir → S11 Maç Detay sayfasına gider
- Post sahibinin kişisel başlığı, notu ve fotoğrafları görünür
- **Post yönetimi (her karttaki ⋮ menüsünden):**
  - **Düzenle** → başlık, not, fotoğraf düzenleme
  - **Profilimden Gizle** → geri alınabilir
  - **Postu Sil** → kalıcı silme (onay dialog'u ile)
- **Gizli postlar:** Sadece sana görünür (kilit ikonu + "Gizli" etiketi), başkaları göremez
- **Silinen postlar:** Listeden tamamen kalkar, geri alınamaz

#### S16: Başka Kullanıcının Profili
- **Yapı:** S15 ile benzer layout, düzenleme/ayar butonları yok
- **Pano bölümü gösterilmez** — sadece kendi profilinde görünür

**Üst bölüm:** Fotoğraf + isim + @kullanıcıadı + doğrulanmış rozeti + istatistik satırı
- **Katılım Oranı:** "%94 Katılım" badge'i (ilk 5 maçta gösterilmez)

**Grafik + Rozetler + Seri:** S15 ile aynı (salt okunur, Pano hariç)

**Maç post feed'i:** Kullanıcının herkese açık **kişisel maç postları** — kendi başlıkları, notları ve fotoğraflarıyla (tıklanınca Maç Detay S11'e gider). Gizli/silinmiş postlar başkalarına görünmez.

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

### BÖLÜM 6: MESAJLAŞMA (3 sayfa)

#### S17: Mesajlar Listesi (Inbox — Login gerekli)
- Üst navbar'daki 💬 ikonundan erişilir
- Arama çubuğu (konuşma ara)
- Konuşma listesi (1-1 ve grup sohbetleri karışık, son mesaj tarihine göre sıralı):
  - **1-1 sohbet:** avatar + isim + son mesaj önizleme + tarih/saat
  - **Maç sohbeti:** ⚽ maç ikonu + maç başlığı + son mesaj önizleme + tarih/saat
  - Okunmamış: accent badge (sayı)
  - Avatar/ikon tıklanınca → S16 Profil (1-1) veya S12 Maç Detay (maç sohbeti)
  - Satır tıklanınca → S18 Sohbet (1-1) veya S35 Maç Sohbeti (grup)
- Boş durum: "Henüz mesajın yok" + illüstrasyon

#### S18: Sohbet Sayfası (1-1 — Login gerekli)
- Üst bar: Avatar + isim (tıklanınca profil) + ⋮ menü
- Mesaj balonları (klasik chat UI):
  - Gönderilen: sağ, accent renk
  - Alınan: sol, koyu gri
  - Her balonda: metin + saat + okundu tiki
- **Maç davet kartları:** Davet gönderildiğinde otomatik olarak sohbette görünen özel kart:
  - "📩 Berk seni **Cumartesi Halısaha Maçı**'na davet etti"
  - "Detayları Gör" butonu → S12 Planlanan Maç Detay
- Alt kısım: Mesaj input + 📎 ek (fotoğraf) + Gönder butonu
- **WhatsApp butonu:** Üst bar'da veya ⋮ menüde "📱 WhatsApp'a Geç" → karşı tarafın numarasına yönlendir (numara paylaşıldıysa)
- ⋮ Menü: WhatsApp'a Geç / Engelle / Raporla

#### S35: Maç Sohbeti (Grup Chat — Login gerekli)
- **Amaç:** Planlanan maçın katılımcıları arasında koordinasyon sağlamak
- **Oluşturulma:** Maç oluşturulduğunda (S31) otomatik oluşur
- **Erişim:** S12'deki "💬 Maç Sohbeti" butonu veya S17'deki mesaj listesinden

**Üst bar:** ⚽ + Maç başlığı + katılımcı sayısı + ⋮ menü
- Maç başlığına tıklayınca → S12 Planlanan Maç Detay

**Chat UI:** S18 ile aynı balonlu yapı ama çoklu kullanıcı:
- Her mesaj balonunda: avatar (küçük) + kullanıcı adı + metin + saat
- Gönderilen mesajlar sağda (avatar yok), alınan mesajlar solda (avatar var)
- Alt kısım: Mesaj input + 📎 ek + Gönder butonu

**Yaşam döngüsü:**
- Maç oluşturulunca → sohbet aktif
- Maça katılan herkes sohbete otomatik eklenir
- Maçtan çıkarılan/ayrılan kişi sohbetten de çıkar
- **Maç arşivlendiğinde:** Sohbet mesajları silinir (salt okunur arşiv yok). Sadece hafif metadata korunur: thread_id, match_id, message_count, last_message_at

---

### BÖLÜM 7: BİLDİRİMLER (1 sayfa)

#### S19: Bildirimler (Login gerekli)
- Üst navbar'daki 🔔 ikonundan erişilir
- Bildirim listesi (kronolojik):
  - Her bildirim: tür ikonu + avatar + metin + zaman + okunmamış göstergesi
  - **Tıklanınca ilgili sayfaya yönlendir**

**Bildirim türleri:**
- 👍 "Ali postunu beğendi" → ilgili post kartına git
- 💬 "Ali postuna yorum yaptı" → S42 Yorumlar (ilgili postun yorumları)
- 👥 "Ali seni takip etmeye başladı" → S16 Profil
- ✅ "Maç başvurun onaylandı" → S12 Planlanan Maç
- ❌ "Maç başvurun reddedildi" → S12 Planlanan Maç
- 📢 "Ali yeni bir maç oluşturdu" (takip ettiklerin) → S12
- 🏅 "50 Maç Kulübü'ne hoş geldin!" → S15 Profil
- 🔥 "4 haftalık serin devam ediyor!" → S15 Profil
- 💬 "Ali sana mesaj gönderdi" → S18 Sohbet
- ⚽ "Yarınki maçın yaklaşıyor!" → S12 Planlanan Maç (hatırlatıcı)
- 📩 "Berk seni Cumartesi Halısaha Maçı'na davet etti" → S12 Planlanan Maç
- 📅 "Maç Pazar'a alındı" → S12 (reschedule bildirimi)
- 🚫 "Cumartesi Halısaha Maçı iptal edildi" → bildirim sayfasında kalır
- ⭐ "Maçını değerlendir!" → S40 Puanlama (24 saat hatırlatıcı)
- ❌ "Ali seni Cumartesi Halısaha Maçı'ndan çıkardı" → bildirim sayfasında kalır
- 👑 "Berk, Cumartesi Halısaha Maçı'nda host olmak istiyor — Oyla!" → S12 Planlanan Maç
- 👑 "Berk artık Cumartesi Halısaha Maçı'nın yeni host'u!" → S12 Planlanan Maç
- 👑 "Host devralma oylaması sonuçlandı — yeterli çoğunluk sağlanamadı" → S12 Planlanan Maç
- 🗑️ "Cumartesi Halısaha Maçı başlatılmadığı için silindi" → bildirim sayfasında kalır

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
  - Bildirim türleri (her biri ayrı toggle): Beğeniler, Yorumlar, Yeni takipçi, Maç hatırlatıcı, Maç daveti, Host devralma oylamaları
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
- Sorular: "Nasıl maç oluşturabilirim?", "Skor takibi nasıl çalışır?", "Hesabımı nasıl silebilirim?", "Maça nasıl katılabilirim?" vb.
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
- **Tetikleyici:** Maç kaydedildikten sonra host'a otomatik gösterilir. Diğer katılımcılar kendi postlarının ⋮ menüsünden "Paylaş" ile erişebilir.
- **İçerik:** Instagram Stories / WhatsApp formatında paylaşılabilir görsel kart
  - Skor bilgisi (maç verisinden)
  - MVP oyuncusu
  - Kişisel istatistikler (gol, asist — o kullanıcıya özel)
  - SporWave branding + QR kod
- "Instagram'da Paylaş" + "WhatsApp'ta Paylaş" + "Kaydet" butonları
- "Atla" linki

---

### BÖLÜM 10: PUANLAMA & ATTENDANCE (1 sayfa)

#### S40: Puanlama & Attendance (Maç Sonrası — Login gerekli)
- **Amaç:** Maç sonrası MVP oylama ve katılım bildirimi
- **Erişim:** S08'deki puanlanmamış maç kartı (turuncu border) veya bildirim
- **Erişim süresi:** Maç kaydedildikten sonra **24 saat boyunca** tüm katılımcılar erişebilir

**Üst bölüm:** Maç başlığı + skor + tarih (salt okunur özet)

**Bölüm 1 — MVP Oylaması:**
- "Maçın yıldızını seç" başlığı
- Katılımcı listesi — her biri tıklanabilir, tek bir kişi seçilir
- Her kullanıcı 1 oy verir, en çok oy alan MVP olur
- **Co-MVP:** Eşit oy durumunda (beraberlik) birden fazla oyuncu MVP olarak gösterilir
- Oy vermeyenler hakkını kaybeder (ceza yok)
- MVP oylaması 24 saat sonra otomatik kapanır

**Bölüm 2 — Attendance (Katılım Bildirimi):**
- "Katılım durumunu bildir" başlığı
- Katılımcı listesi — her kişinin yanında "✅ Geldi" ve "❌ Gelmedi" butonları
- Her kullanıcı diğer tüm katılımcılar için oy verir
- **%60 çoğunluk kuralı:**
  - Oy verenlerin %60'ı veya fazlası "Gelmedi" derse → kişi **katılmadı** olarak işaretlenir
  - %60'ın altındaysa → katıldı sayılır (şüpheden sanık yararlanır)
  - **Minimum oy sayısı:** Karar için en az 3 kişi oy vermiş olmalı. 3'ün altında oy varsa karar verilmez.
- "Gelmedi" oyu 24 saat içinde geri alınabilir
- Örnek: 10 kişilik maçta 8 kişi oy verdi. Ali için 5 kişi "gelmedi" dedi (5/8 = %62.5) → Ali katılmadı. Mehmet için 3 kişi "gelmedi" dedi (3/8 = %37.5) → Mehmet katıldı.

**"Gönder" butonu** → puanlama tamamlandı, S08'deki turuncu kart kalkar

**Profilde Katılım Puanı:**
- Hesaplama: **Son 10 maç** bazlı — (Son 10 maçta katıldığı maç sayısı / Son 10 maçta katılacağını söylediği maç sayısı) × 100
- Sadece "geliyorum" deyip gelmediği maçlar düşürür. Hiç cevap vermediği maçlar hesaba katılmaz.
- **İlk 5 maçta katılım puanı gösterilmez** (yeni kullanıcı koruması)
- 10'dan az maçı olan kullanıcılarda mevcut tüm maçlar kullanılır
- Bu puan S12'de katılımcı listesinde ve S13'te başvuru listesinde de küçük gösterge olarak görünür
- Katılım puanı profilde herkese açık gösterilir

---

### BÖLÜM 11: OYUNCU DAVET (1 sayfa)

#### S41: Oyuncu Davet (Bottom Sheet — Login gerekli)
- **Erişim:** S12'deki "Oyuncu Davet Et" butonu veya S31 Adım 4
- Arkadaş listesi (takip edilenler + karşılıklı takipler):
  - Her satır: Avatar + isim + @kullanıcıadı + katılım oranı (%)
  - "Davet Et" butonu (sağda)
- "Davet Et"e basınca buton "Gönderildi ✓" olur
- **Kullanıcı bazlı 15 sn cooldown:** Aynı kişiye 15 sn içinde tekrar davet gönderilemez. Diğer kişilere cooldown'sız davet atılabilir.
- Davet gönderilince:
  - Davet edilen kişiye **bildirim** gider
  - Davet eden ve davet edilen kişinin **1-1 sohbetine** (S18) otomatik davet kartı düşer: "📩 Berk seni **Cumartesi Halısaha Maçı**'na davet etti — [Detayları Gör]"
  - Davet edilen kişi S12'den normal şekilde "Katıl" butonuyla katılır
- **Not:** S12'de veya katılımcı listesinde "Davetli" statüsü gösterilmez — ya katılmıştır ya katılmamıştır.
- Arama çubuğu (isim/@kullanıcıadı ile filtrele)
- Back butonu

---

### BÖLÜM 12: EK SAYFALAR (3 sayfa)

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

#### S42: Yorumlar Sayfası (Reusable — Post Yorum Detayı)
- **Erişim:** Post kartı her nerede görünürse (S05 Feed, S15 Profil, S16 Başka Profil) yorum ikonuna veya "Bir yorum ekle..." alanına tıklayınca açılır
- **Üst bar:** ← geri + "Yorumlar" başlığı
- **Post özet kartı (üstte, compact):**
  - Post sahibi avatar + kullanıcıadı + tarih
  - Post başlığı + skor
  - Beğeni ikonu + avatarlar + "X beğeni" (tıklanınca → S43 Beğeniler) + "X yorum" (sağda)
- **Yorum listesi:**
  - Her yorum: Avatar + kullanıcıadı + zaman + yorum metni
  - **Kullanıcı adı tıklanabilir → S16 Profil**
  - MVP'de yorum beğenme ve yoruma yanıt verme özelliği yok
- **Alt bar (fixed):**
  - Avatar + "Bir yorum ekle..." input alanı + send ikonu (kağıt uçak SVG)

#### S43: Beğeniler Sayfası (Reusable — Post Beğeni Listesi)
- **Erişim:** Post kartı her nerede görünürse beğenenler satırında "X diğerleri"ne veya S42 Yorumlar sayfasında "X beğeni"ye tıklayınca açılır
- **Üst bar:** ← geri + "Beğeniler" başlığı
- **Arama çubuğu:** "Kullanıcı adı ara" (filtre)
- **Beğeni listesi:**
  - Her satır: Avatar + kullanıcıadı + isim + "Takip Et" / "Takip Ediliyor" butonu (sağda)
  - Tıklanınca → S16 Profil

---

## SAYFA SAYISI ÖZETİ

| Bölüm | Sayfa Sayısı | Sayfalar |
|-------|-------------|----------|
| Kimlik Doğrulama & Onboarding | 4 | S01-S04 |
| Ana Sayfa (Sosyal Feed) | 2 | S05, S07 |
| Maçlar (Aksiyon) | 7 | S08-S14 |
| Maç Oluştur | 1 | S31 |
| Profil | 3 | S15, S16, S23 |
| Mesajlaşma | 3 | S17, S18, S35 |
| Bildirimler | 1 | S19 |
| Menü & Ayarlar | 6 | S20-S22, S24-S26 |
| Güvenlik & Moderasyon | 4 | S27-S30 |
| Puanlama & Attendance | 1 | S40 |
| Oyuncu Davet | 1 | S41 |
| Ek Sayfalar | 5 | S32-S34, S42, S43 |
| **TOPLAM** | **38** |

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
→ Takım kur (opsiyonel, drag & drop) → Canlı skor ekranı → Gol ekle (geri alınabilir)
→ Herhangi bir katılımcı skor güncelleyebilir (çoklu cihaz sync)
→ Maçı bitir (herkes bitirebilir) → Kadro düzenle (zorunlu, min 2 oyuncu)
→ Kaydet & Paylaş → Maç verisi kilitlenir + tüm katılımcılar için post oluşur
→ Shareable kart → Her katılımcının kendi postu feed'de ve profilinde görünür
→ Her katılımcı kendi postunu profilinden düzenleyebilir (başlık, not, fotoğraf)
→ 24 saat içinde S40'ta MVP oyla + attendance bildir
```

### Akış 3: Maç Oluştur (Planlama)
```
Maçlar tab → FAB "+" → "Maç Oluştur" → Detaylar gir
→ Konum seç (opsiyonel — saha bilmiyorsan "önerisine açığım" veya konumsuz devam et)
→ Katılım ayarları → Arkadaşları davet et (opsiyonel)
→ Yayınla → Deep link üretilir + Maç sohbeti otomatik oluşur
→ Maçlar sekmesinde görünür (👁️ badge) → Başvurular/katılımlar gelir
→ Maç saati → "Maçı Başlat" → Canlı skor akışına geç
→ Maç saati geçtiyse: Maç hala başlatılabilir (24 saat boyunca)
→ S08'de diğer kullanıcılara görünmez olur (🔒 badge), sadece katılımcılara görünür
→ Host tarihi güncellerse → tekrar herkese görünür (👁️ badge)
→ 24 saat geçerse başlamamışsa → otomatik silinir, bildirim gider
```

### Akış 4: Maça Katılma
```
Maçlar tab'da açık maçı gör → Detaya git → "Katıl"
→ Seviye seç → Onay bekle veya doğrudan katıl
→ Maç sohbetine (S35) otomatik eklenir
→ Maç gününe kadar hatırlatıcı bildirimler
→ Maç günü → katıldığın maç vurgulu bölümde en üstte
```

### Akış 5: Sosyal Etkileşim
```
Ana Sayfa feed'de post kartı gör → Beğen / Yorum yap (post bazlı)
→ Post sahibinin profiline git → Takip et
→ Karşılıklı takip = "Arkadaş" → Mesaj gönder / WhatsApp'a geç
→ Aynı maçtan başka arkadaşının postu da feed'de → farklı perspektif, ayrı etkileşim
```

### Akış 6: Viral Paylaşım Döngüsü
```
Maç kaydedilir → Her katılımcı için post oluşur → Shareable kart otomatik oluşur
→ Instagram Stories'e paylaş (SporWave branding + QR)
→ Arkadaşlar QR'ı tarar / linke tıklar → Uygulamayı indirir
→ Kendi maçlarını başlatır → Döngü tekrarlanır
```

### Akış 7: Maç Duraklat / Kurtarma
```
Maç sırasında geri tuşu → "Duraklat / İptal / Geri Dön" dialog
→ Duraklat → S08'de banner → Devam Et → Kaldığı yerden devam
VEYA
Maç sırasında app kapanır → State otomatik kaydedilmiş
→ App tekrar açılır → S08'de "Devam eden maçın var" banner
→ "Devam Et" → Kaldığı yerden devam (kronometer duraklatılmış)
→ 24 saatten fazla geçtiyse: "Tamamla mı iptal mi?"
```

### Akış 8: Maç Sonrası Puanlama
```
Maç biter → Kaydet → S08'de turuncu border'lı kart çıkar
→ Tıkla → S40 Puanlama sayfası
→ MVP oylaması + Attendance bildirimi (%60 çoğunluk)
→ Gönder → Kart S08'den kalkar
→ 24 saat geçerse puanlama kapanır
```

### Akış 9: Uygulama İçi Maç Daveti
```
S12 veya S31 → "Oyuncu Davet Et" → S41
→ Arkadaş listesinden "Davet Et" butonuna bas
→ 1-1 sohbette davet kartı düşer + bildirim gider
→ Davet edilen "Detayları Gör" → S12 → "Katıl"
→ Aynı kişiye 15 sn cooldown, diğerlerine serbest
```

### Akış 10: Host Devralma
```
S12'de katılımcı → "👑 Host Devral" butonuna bas
→ Oylama başlatılır → Tüm katılımcılara bildirim gider
→ Katılımcılar S12'deki inline banner'dan "Evet" / "Hayır" oy verir
→ 24 saat veya maç başlayana kadar oylama açık
→ %60 çoğunluk sağlanırsa (min 3 oy) → Host değişir, bildirim gider
→ Sağlanamazsa → Oylama geçersiz, bildirim gider
→ Yeni host tüm host yetkilerini alır (düzenle, başlat, çıkar vb.)
```

### Akış 11: Geçmiş Tarihli Başlamamış Maç
```
Maç saati geçer → Maç hala başlamamış
→ S08'de diğer kullanıcılara görünmez olur (🔒 badge)
→ Katılımcılar hala S12'den maçı görebilir + başlatabilir
→ Davet linki ile de erişilebilir
→ Host tarihi gelecek bir tarihe güncellerse → tekrar herkese görünür (👁️ badge)
→ 24 saat geçerse başlamamışsa → maç otomatik silinir
→ Tüm katılımcılara "🗑️ Maç başlatılmadığı için silindi" bildirimi
```
---

## DESIGN SİSTEM NOTLARI

**Tema:** Koyu (default) + Açık (toggle)
- Koyu temada: Hevy benzeri koyu arka plan (#0B0F14), beyaz metin, accent vurgular
- Açık temada: Beyaz/açık gri arka plan, koyu metin, aynı accent renkler
- CSS değişkenleri ile tema yönetimi

**Accent renk:** `#B7F000` (yeşil-sarı, enerji hissi)

**Tipografi:** Sistem fontları + marka fontu başlıklarda

**Kart tasarımı:** Hevy antrenman kartlarından ilham — tam genişlikte düz kart (borderRadius:0, border yok, background transparent), büyük skor gösterimi, beğeni/yorum yapısı. Postlar arasında `#141A22` (card rengi) 8px divider kullanılır. Her kart bir **post**tur (maç değil) — post sahibinin kişisel versiyonunu gösterir.

**Navigasyon:** 3 tab bar, FAB Maçlar tab'ı içinde sağ altta, üst navbar'da arama + bildirim + mesaj

**Navigasyon davranışı (history stack):**
- Geri butonu her zaman bir önceki görüntülenen sayfaya döner (stack-based navigation)
- Örnek: Ana Sayfa → Maç Detay → Oyuncu Profili → Geri = Maç Detay → Geri = Ana Sayfa
- Tab'a basınca stack sıfırlanır ve o tab'ın ana sayfasına gidilir
- Sayfa içindeki tüm isim/avatar tıklamaları stack'e yeni sayfa ekler
- **İstisna:** Canlı skor ekranında (S10 Adım 3) geri tuşu → duraklat/iptal dialog'u

**Özel renk kuralları:**
- Puanlanmamış maç kartı: turuncu border
- Devam eden maç banner'ı: accent renk arka plan
- Katılım oranı düşükse (<%70): kırmızı renk uyarı

**Çok adımlı form UI standartları (S04 Onboarding baz alınarak — S10, S31 dahil tüm çok adımlı akışlar):**
- **Sayfa padding:** `24px 20px` (PageShell)
- **ProgressBar:** Sayfa en üstünde, `marginTop:16` wrapper içinde, `marginBottom:24`; çubuk yüksekliği 4px, `borderRadius:4`, aralarında `gap:6`
- **BackLink (← Geri):** ProgressBar'ın hemen altında, `fontSize:14, color:T.textDim, marginTop:20, marginBottom:8`; adım > 0 ise bir önceki adıma döner, adım === 0 ise akışın başladığı sayfaya döner (örn. S09)
- **Adım etiketi:** `fontSize:12, fontWeight:600, color:T.textMuted, textTransform:"uppercase", letterSpacing:"1px"`
- **Büyük başlık:** `fontSize:24, fontWeight:800, color:T.text, marginBottom:24, letterSpacing:"-0.5px"`, Plus Jakarta Sans font
- **Birincil buton:** `fontSize:15, fontWeight:700, padding:"14px 24px", borderRadius:12`, tam genişlik
- **İkincil link (Atla vb.):** `marginTop:16, fontSize:14, fontWeight:500, color:T.textDim`, metin ortalamalı; birincil butonun **altında** yer alır
- **Seçim elementleri (pill/kart):** `borderRadius:12, padding:"10px 16px"`, seçilince `border: 1.5px solid T.accent`, `background: T.accent + "12"`, `color: T.accent`; seçilmeyince `border: 1.5px solid T.cardBorder`, `background: T.card`

---

## HOST DEVRALMA & MAÇ YAŞAM DÖNGÜSÜ DETAYLARI

### Host Devralma Sistemi

**Amaç:** Maç organizatörü (host) müsait olmadığında veya sorumluluk almadığında, katılımcıların demokratik oylama ile host'u değiştirmesini sağlamak.

**Kimler oylama başlatabilir:**
- Maçın **mevcut katılımcıları** (host hariç — host kendi pozisyonu için oylama başlatamaz)
- Login gerekli

**Oylama süreci:**
1. Katılımcı S12'de "👑 Host Devral" butonuna basar
2. Onay dialog'u: "Host olmak için oylama başlatmak istiyor musun? Diğer katılımcılar oy verecek."
3. "Evet, Oylama Başlat" → oylama aktif olur
4. Tüm katılımcılara (talep eden dahil, mevcut host dahil) bildirim gider
5. S12'de inline banner gösterilir: "👑 [İsim] host olmak istiyor — Oyla!" + "Evet ✓" / "Hayır ✗" butonları + kalan süre göstergesi
6. Maç sohbetinde (S35) otomatik sistem mesajı: "👑 [İsim] host olmak için oylama başlattı"

**Oylama kuralları:**
- Süre: **24 saat** veya maç başlayana kadar (hangisi önce gelirse)
- **%60 çoğunluk:** Oy veren katılımcıların %60'ı veya fazlası "Evet" derse host değişir
- **Minimum oy:** En az 3 kişi oy vermiş olmalı — 3'ün altında oy varsa oylama geçersiz
- Talep eden kişi kendi oylamasında otomatik "Evet" oyu verir (oyunu değiştiremez)
- Mevcut host da oy verebilir (kabul ederse geçiş sorunsuz olur)
- Aynı anda sadece **1 aktif oylama** olabilir — mevcut oylama bitene kadar yeni başlatılamaz
- Oy geri alınabilir ve değiştirilebilir (süre dolana kadar)

**Oylama sonuçları:**
- **Başarılı (host değişir):**
  - Yeni host tüm host yetkilerini alır: maçı düzenle, başlat, oyuncu çıkar, başvuru yönet
  - Eski host normal katılımcı olur (maçtan çıkarılmaz)
  - Tüm katılımcılara bildirim: "👑 [Yeni Host] artık maçın yeni host'u!"
  - Maç sohbetinde sistem mesajı
- **Başarısız (host değişmez):**
  - Mevcut host devam eder
  - Tüm katılımcılara bildirim: "Host devralma oylaması sonuçlandı — yeterli çoğunluk sağlanamadı"
  - Aynı kişi aynı maçta **24 saat boyunca** tekrar oylama başlatamaz (spam koruması)

### Başlamamış Maçların Yaşam Döngüsü

**Maç saati geçmeden önce (normal durum):**
- Maç S08'de "Açık maçlar" bölümünde herkese görünür (gizlilik ayarına göre)
- Görünürlük badge'i: 👁️ "Herkese Görünür" (veya gizlilik ayarına göre ilgili badge)
- Host ve katılımcılar maçı düzenleyebilir, başlatabilir

**Maç saati geçtikten sonra (başlamamış maç):**
- Maç S08'deki açık maçlar listesinden **otomatik olarak kaldırılır** — diğer kullanıcılara gösterilmez
- Görünürlük badge'i 🔒 "Sadece Katılımcılara" olarak güncellenir
- Maç **sadece şu yollarla erişilebilir:**
  1. Maçın katılımcıları → S08'de "Katıldığım maçlar" bölümünde turuncu-sarı uyarı border ile görünür
  2. Davet linki (deep link) ile — link sahibi maçı görüntüleyebilir
- S12'de "⏰ Maç saati geçti — Başlatılmayı bekliyor" banner'ı gösterilir
- Otomatik silinmeye kalan süre gösterilir: "Kalan süre: Xsa Xdk"
- **Maç hala başlatılabilir** — "🎮 Maçı Başlat" butonu aktif kalır (her iki takımda min 1 oyuncu koşuluyla)

**Host tarihi güncellerse:**
- Host "Maçı Düzenle" ile tarihi **gelecek bir tarihe** güncellerse:
  - Maç tekrar S08'de herkese görünür olur
  - Görünürlük badge'i 👁️ "Herkese Görünür" olarak güncellenir
  - "⏰ Maç saati geçti" banner'ı kalkar
  - Tüm katılımcılara reschedule bildirimi gider (mevcut davranış)

**Otomatik silme (24 saat kuralı):**
- Maç saatinden **tam 24 saat** geçtikten sonra hala başlamamışsa:
  - Maç otomatik olarak **kalıcı silinir**
  - Tüm katılımcılara bildirim gider: "🗑️ [Maç adı] başlatılmadığı için silindi"
  - Maç sohbeti (S35) de kapatılır (salt okunur olarak arşivlenir)
  - Silinen maç geri alınamaz

---

## POST YÖNETİMİ & İKİ KATMANLI VERİ MODELİ

### Genel Bakış

SporWave'de bir maç tamamlandığında iki katmanlı veri yapısı oluşur:

**Katman 1 — Maç Verisi (Shared, Immutable):**
- Skor, takımlar, süre, konum, tarih, MVP, gol timeline
- Host ve katılımcıların ortaklaşa ürettiği veri
- Maç arşivlendikten sonra (state: archived) değiştirilemez
- Tüm katılımcıların postlarında aynı maç verisi referans edilir

**Katman 2 — Kişisel Post (Per Player):**
- Maç arşivlendiğinde her katılımcı için otomatik oluşturulur
- Her katılımcı sadece kendi postunu kontrol eder:
  - **Başlık:** Varsayılan olarak maç başlığı, kişi değiştirebilir
  - **Not:** Opsiyonel açıklama
  - **Fotoğraflar:** Kişisel fotoğraflar (max 4)
  - **Görünürlük:** visible / hidden / deleted

### Post Durumları

| Durum | Feed | Profil | Beğeni/Yorum | Geri Alınabilir |
|-------|------|--------|-------------|----------------|
| **visible** | Görünür | Görünür | Aktif | — |
| **hidden** | Görünmez | Sadece sana görünür (🔒) | Korunur | Evet |
| **deleted** | Görünmez | Görünmez | Silinir | Hayır |

### Post Silme vs Gizleme

**Gizle (hidden):**
- Post feed ve profilden kaybolur (başkalarına)
- Kişisel veriler (not, fotoğraf) korunur
- "Gizli Postlar" bölümünden geri getirilebilir
- Maç verisinde katılımcı olarak kalırsın
- Diğer oyuncuların postlarında "Ali de bu maçta oynadı" satırında görünmeye devam edersin

**Sil (deleted):**
- Post kalıcı olarak silinir
- Kişisel veriler (not, fotoğraf, başlık) silinir
- O posta yapılan beğeni ve yorumlar da silinir
- Geri alınamaz
- Maç verisinde katılımcı olarak kalırsın (Katman 1 etkilenmez)
- Diğer oyuncuların postlarında ismin hâlâ görünür (maç kadrosunda)
- **Kullanım senaryosu:** Deneme/test maçları, dummy veriler

### Etkileşim Modeli

**Beğeni ve yorumlar POST bazlıdır:**
- Berk'in postunu beğeniyorsun → Berk'e bildirim gider
- Ali'nin aynı maçtaki postunu ayrıca beğenebilirsin → Ali'ye bildirim gider
- İki post aynı maç verisini paylaşır ama etkileşimleri tamamen bağımsızdır
- Post silinirse o postun beğeni ve yorumları da silinir — diğer postlar etkilenmez

### Teknik Veri Yapısı

```
matches (Katman 1 — paylaşımlı, immutable)
├── id, score_a, score_b, teams, duration, location, date
├── host_id, state, format, created_at
└── goals[] (timeline)

match_posts (Katman 2 — kişisel, düzenlenebilir)
├── id, match_id, user_id
├── title (default: match.title)
├── caption (nullable)
├── photos[] (nullable, max 4)
├── status: visible | hidden | deleted
└── created_at, updated_at

post_likes
├── post_id, user_id, created_at

post_comments
├── post_id, user_id, text, created_at
```

---

> **Bu doküman, SporWave MVP'sinin tüm sayfa yapısını, akışlarını ve iş kurallarını tanımlar. Güncellemeler bu dokümanda yapılır, ardından React wireframe buna göre güncellenir.**
