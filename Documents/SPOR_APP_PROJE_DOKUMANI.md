# SPORWAVE — Proje Master Dokümanı

> Bu doküman, SPORWAVE projesinin tüm kararlarını, sayfa haritasını, wireframe detaylarını ve teknik gereksinimlerini içerir.
> VS Code'daki Claude bu dosyayı okuyarak projenin tam bağlamını anlayabilir.
> Son güncelleme: 22 Şubat 2026

---

## 1. PROJE ÖZETİ

**Uygulama Adı:** SPORWAVE
**Amaç:** İnsanların spor yapmak için hızlıca eşleşmesini sağlayan sosyal platform
**Hedef Pazar:** Türkiye (İstanbul'dan başlayarak), ileride global
**Platform:** Mobil (iOS + Android) + Web Admin Paneli
**Dil:** Türkçe (ileride İngilizce de eklenecek)

### Ana Modüller

**Çekirdek:** Kullanıcıların spor yapmak için eşleştiği sosyal katman

1. **Oyna (Bireysel):** Kullanıcıların oluşturduğu aktiviteler (halısaha, tenis partneri, basketbol takımı, satranç rakibi) — platformun kalbi, kullanıcı tarafından oluşturulur
2. **Etkinlik:** Büyük spor organizasyonları (maraton, HYROX, koşu etkinlikleri) — destekleyici modül, admin tarafından eklenir
3. **Dersler:** Spor eğitim ilanları (padel dersi, yoga, okçuluk, atçılık) — destekleyici modül, tesislerle anlaşma

### Neden Bu Uygulama?
- Türkiye'de 20,3 milyon aktif sporcu var
- Sporu bırakanların %42-47'si partner bulamadığı için bırakıyor
- Üç modülü birleştiren baskın global rakip yok
- SpорSepeti rakip bulma özelliğini sadece teniste sunuyor, etkinlik haberleri bölümü yok
- SWEATers (15K kullanıcı/6 hafta) kapandı, HeyBuddy durağan, Sporzy düşük bilinirlik — pazar boş

---

## 2. KESİNLEŞEN KARARLAR

| Karar | Seçim | Detay |
|-------|-------|-------|
| **Login yaklaşımı** | Gecikmeli login | Uygulama login olmadan gezilir, işlem yapmak isteyince (katıl, oluştur, mesaj gönder, profil) login'e yönlendirilir |
| **Kayıt yöntemleri** | E-posta/şifre + Google + Apple | Üç seçenek de sunulacak |
| **Onboarding** | Kayıt sonrası yada kayıt olmamış kullanıcı için google/apple login sonrası 4 adım | İsim, soyisim, doğum tarihi → Profil fotoğrafı → Favori sporlar → Şehir seçimi + Topluluk Kuralları kabul |
| **Eğitmen modeli** | Tesis bazlı, admin girer | Kullanıcılar eğitmen modu açamaz. Tesislerle anlaşılır, ilanlar admin panelinden girilir. İleride bireysel eğitmen başvurusu eklenebilir, eğitmen modunu admin açar |
| **İletişim** | Uygulama içi mesajlaşma | 1-1 metin mesajlaşma. WhatsApp yönlendirme yok ama kullanıcı isterse kendi paylaşır |
| **Coğrafi kapsam** | İstanbul öncelikli | Etkinlikler tüm Türkiye'den eklenebilir. Bireysel aktiviteler ve dersler İstanbul'dan başlar |
| **Admin paneli** | Web tabanlı ayrı panel | Etkinlik/ders ekleme, kullanıcı moderasyonu, raporlama. Başlangıçta sadece biz kullanırız, ileride tesislere panel açılır |
| **Profil detayı** | Orta seviye | İsim, soyisim, fotoğraf, doğum tarihi, şehir, favori sporlar, katılım istatistikleri, oyuncu puanı, yaklaşan/geçmiş etkinlikler |
| **Uygulama dili** | Türkçe başlasın | İleride İngilizce de eklenecek (i18n desteği planlansın) |

---

## 3. NAVİGASYON YAPISI

### Üst Navbar (her sayfada)
```
[ SPORWAVE (logo) ]        [🔔 Bildirimler]  [ 💬 Mesajlar ]  [ ☰ Menü ]
```

### Alt Footer Tab Bar (ana sayfalarda)
```
[ 🔍 Keşfet ]  [ ⚽ Oyna ]  [ 🏆 Etkinlik ]  [ 🎓 Dersler ]  [ 👤 Profil ]
```
- Aktif tab kırmızı renkte vurgulanır (Figma taslağındaki gibi)
- **Keşfet** varsayılan açılış sekmesi (growth engine — karma discovery feed)
- Oyna sekmesinde sağ altta yeşil "+" FAB butonu (yeni aktivite oluştur)

### Menü İçeriği (☰ Hamburger → Drawer/Tam sayfa)
- Aktivitelerim (Yaklaşan / Geçmiş tabları)
- Arkadaşlarım
- Arkadaşlarını Davet Et
- Ayarlar
- Yardım & SSS
- Çıkış Yap

---

## 4. SAYFA HARİTASI — MOBİL UYGULAMA (33 sayfa)

### 4.1 Kimlik Doğrulama & Onboarding (4 sayfa)

#### S01: Login Sayfası
- E-posta + şifre input alanları
- "Giriş Yap" butonu
- "Şifremi Unuttum" linki
- Ayraç: "veya"
- "Google ile giriş yap" butonu
- "Apple ile giriş yap" butonu
- "Hesabın yok mu? Kayıt Ol" linki
- Tetiklenme: Login gerektiren herhangi bir işlem yapılmak istendiğinde

#### S02: Register (Kayıt Ol) Sayfası
- E-posta input
- Şifre input
- Şifre tekrar input
- KVKK + kullanım şartları onay checkbox'ı
- "Kayıt Ol" butonu
- Google/Apple ile hızlı kayıt butonları
- Başarılı kayıt → Onboarding başlar

#### S03: Şifremi Unuttum
- E-posta input
- "Sıfırlama linki gönder" butonu
- Geri dönüş linki

#### S04: Onboarding (4 adımlı)
- **Adım 1:** İsim, soyisim, doğum tarihi
- **Adım 2:** Profil fotoğrafı yükleme (opsiyonel, "sonra ekle" seçeneği)
- **Adım 3:** Favori sporları seç (çoklu seçim grid: Futbol, Tenis, Basketbol, Voleybol, Koşu, Yoga, Yüzme, Satranç, Fitness vb.)
- **Adım 4:** Şehir seçimi + Topluluk Kuralları'nı görüntüle → "Kabul Et" butonu
- İlerleme çubuğu (progress bar) üstte
- Her adımda "Devam" butonu, son adımda "Başla! 🚀"

---

### 4.2 Keşfet — Footer Tab 1 (1 sayfa)

#### S00: Keşfet Feed (Ana Sayfa — Varsayılan Ekran)
- **Üstte:** Konum filtresi (yakındaki içerik odağı; şehir/ilçe bazlı)
- **İçerik:** Karma dikey feed (scroll), bölümlere ayrılmış:
  - **"Yakında Maç"** bölümü: Yakındaki Oyna aktiviteleri — spor ikonu, tarih/saat, katılımcı sayısı (mevcut/max), "Katıl" CTA
  - **"Bu Hafta Etkinlikler"** bölümü: Büyük organizasyonlar — banner, tarih, şehir
  - **"Popüler Eğitmenler"** bölümü: Yüksek puanlı dersler — eğitmen/tesis adı, rating yıldızı, spor dalı, fiyat
- Her bölüm başlığının yanında **"Tümünü Gör"** linki (ilgili modüle yönlendirir)
- Kart tasarımı mevcut modül kartlarıyla tutarlı (S07, S05, S12 stilleri)
- **Feed öncelik sırası:**
  - 1) Arkadaşların oluşturduğu aktiviteler
  - 2) Arkadaşların katıldığı aktiviteler
  - 3) Diğer yakındaki içerikler
- **Amaç:** Uygulamanın growth engine'i — yeni kullanıcıyı içerikle hızla buluşturur, tüm modülleri tek ekranda tanıtır

---

### 4.3 Oyna — Footer Tab 2 (5 sayfa)

#### S07: Oyna Feed
- **Üstte:** Spor dalı filtre tab'ları: Hepsi (sayı), Futbol (sayı), Tenis (sayı), Basketbol (sayı)...
- **İçerik:** Aktivite kartları listesi
- **Her kart:**
  - Spor dalı ikonu + spor adı (sol)
  - Kişi sayısı: mevcut/max (sağ, örn: "4/10")
  - Aktivite başlığı (bold)
  - Açıklama metni
  - Konum (şehir, ilçe)
  - Tarih ve saat
  - Kabul modu badge'i (varsa: "Onay gerekli" etiketi)
- **FAB butonu:** Sağ altta yeşil "+" butonu → Aktivite Oluştur
- Tıklandığında → Aktivite Detay sayfasına git

#### S08: Aktivite Oluştur (Adımlı Form — Login gerekli)
- İlerleme çubuğu (4 adım)
- **Adım 1 — Spor Dalı Seç:**
  - 2 sütunlu grid: Futbol ⚽, Tenis 🎾, Basketbol 🏀, Voleybol 🏐, Satranç ♟️, Masa Tenisi 🏓, Padel 🎱, Diğer ➕
  - Tıklayınca Adım 2'ye geç
- **Adım 2 — Detaylar:**
  - Başlık input (örn: "Halısaha Maçı")
  - Açıklama textarea
  - "Devam" butonu
- **Adım 3 — Tarih & Konum:**
  - Tarih seçici (date picker)
  - Saat seçici (time picker)
  - Konum input + haritadan seç alanı
  - "Devam" butonu
- **Adım 4 — Ayarlar:**
  - Maksimum kişi sayısı (number input)
  - Deneyim seviyesi tercihi (pill seçim: Herkes / Başlangıç / Orta / İyi / Profesyonel)
  - Kabul modu seçimi:
    - "Herkesi Kabul Et" — başvuran herkes otomatik katılır
    - "Onay ile Kabul Et" — her başvuruyu kendiniz onaylarsınız
  - "Yayınla 🚀" butonu

#### S09: Aktivite Detay Sayfası
- Spor dalı emoji + başlık (büyük)
- Spor dalı + seviye bilgisi
- Açıklama metni
- Bilgi kartı:
  - Tarih/saat
  - Konum (şehir, ilçe)
  - Kişi sayısı (mevcut/max)
- Oluşturan kişi: avatar + isim + Sportmenlik puanı + Katılım % + "Organizatör" etiketi
- **Katılımcı Listesi** (gizlilik seviyesine göre değişir — host seçer):
  - **Public:** Her katılımcı satırı: avatar + isim + spor seviyesi + Sportmenlik puanı + Katılım % → profile tıklanabilir
  - **Sadece katılanlar:** Yalnızca onaylı katılımcılar görebilir (aynı bilgiler)
  - **Sadece sayı:** "X kişi katılıyor" metni (isimler gizli)
  - **Geçmiş aktiviteler:** Aynı gizlilik kuralları, katılımcı listesi salt okunur şekilde görünür
- **Butonlar** (yan yana):
  - "Katıl (X kişilik yer var)" (birincil) → Deneyim seviyesi seçimi (bottom sheet)
  - "Mesaj Gönder" (ikincil) → Organizatörle 1-1 mesajlaşma sayfasına git: **Sohbet (S19)** (login gerekli)
- ⋮ Menü: Raporla / Engelle (login gerekli)
- Back butonu

#### S10: Deneyim Seviyesi Seçimi (Bottom Sheet)
- Başlık: "Deneyim Seviyeniz"
- Alt açıklama: "Aktivite sahibinin sizi değerlendirebilmesi için seviyenizi seçin"
- 4 seçenek butonu (tam genişlik):
  - Başlangıç
  - Orta
  - İyi
  - Profesyonel
- "Başvuru Gönder" veya "Katıl" butonu (kabul moduna göre değişir)
- Eğer "Herkesi kabul et" → doğrudan katılım onayı
- Eğer "Onay ile kabul et" → "Başvurunuz gönderildi! Onay bekleniyor." mesajı

#### S11: Başvuru Yönetimi (Aktivite sahibi için — Login gerekli)
- Aktivite başlığı
- Gelen başvuru listesi:
  - Her başvuruda: avatar, isim, seçtiği deneyim seviyesi
  - "Onayla" butonu (yeşil)
  - "Reddet" butonu (kırmızı)
- Sadece "Onay ile kabul et" modundaki aktivitelerde görünür
- Aktivite detay sayfasından erişilir (organizatör için özel buton)

---

### 4.4 Etkinlik — Footer Tab 3 (2 sayfa)

#### S05: Etkinlik Feed
- **Üstte:** Şehir filtre pilleri (Tüm Şehirler, İstanbul, Ankara, İzmir, Antalya...)
- **İçerik:** Dikey kart listesi (scroll)
- **Her kart:**
  - Etkinlik banner görseli — sol kenarda **kategori renk şeridi** (spor dalı rengi)
  - **Kaynak rozeti** (sağ üst köşe): 📸 Instagram / 👥 Facebook / ✅ Resmi — kaynak her zaman gösterilir
  - Etkinlik başlığı (bold)
  - Tarih + Saat ve Konum (ilçe, şehir)
  - **Fiyat** (yeşil = ücretsiz, siyah = ücretli)
  - **Sosyal kanıt:** "X kişi ilgileniyor" (küçük, gri)
- Tıklandığında → Etkinlik Detay sayfasına git
- **Not:** İçerik admin panelinden veya sosyal medya kaynaklarından eklenir; kaynak her zaman atıflanır

#### S06: Etkinlik Detay Sayfası
- Büyük banner görseli — sol kenarda kategori renk şeridi
- Kaynak rozeti (sağ üst)
- Etkinlik başlığı (büyük, bold)
- **Kaynak satırı:** "📸 Instagram'dan · @kullanıcıadı"
- Bilgi satırları: 📅 Tarih/Saat · 📍 İlçe, Şehir · 🏷️ Spor dalı chip · 💰 Fiyat
- Detaylı açıklama (katılım koşulları, parkur bilgisi vb.)
- Konum haritası widget

**CTA Hiyerarşisi — 4 Seviye:**

1. **Birincil — Katılım niyeti toggle** (login gerektirir):
   - "İlgileniyorum"
   - seçilirse → kullanıcının profilinde **Yaklaşan Etkinlikler** listesine eklenir
   - Kaç kişi ilgileniyor sayısı her zaman gösterilir

2. **İkincil — Kaydetme** (login gerektirir):
   - "Takvime Ekle" → kullanıcının telefon takvimine etkinliği saat + konum bilgisiyle ekler

3. **Bağlamsal — Kaynağa git** (her zaman görünür):
   - "📸 Instagram'da Gör" / "👥 Facebook'ta Gör" / "🔗 Resmi Kayıt Sayfası"
   - Kaynağa göre buton metni değişir; harici URL açılır

4. **Sosyal — Paylaş & Keşfet**:
   - "Paylaş" butonu → kaynağın linkini paylaşır
   - **"Kim İlgileniyor?"** bölümü: "İlgileniyorum" diyen kullanıcıların avatar listesi → profil tıklanabilir

**Güven katmanı:**
- "Son doğrulama: X gün önce" her zaman gösterilir
- Back butonu (üst navbar)

---

### 4.5 Dersler — Footer Tab 4 (2 sayfa)

#### S12: Dersler Feed
- **Üstte:** Spor dalı filtre tab'ları: Hepsi, Padel, Yoga, Okçuluk, Tenis, Fitness...
- **İçerik:** Ders kartları listesi
- **Her kart:**
  - Ders görseli (tesis/eğitim fotoğrafı)
  - Ders başlığı (bold)
  - Tesis adı
  - Rating (yıldız + puan)
  - Tag'ler: Ders türü (1-1 / Grup) + Spor dalı
  - Tarih aralığı + saat
  - Fiyat (büyük, accent renk)
- Tıklandığında → Ders Detay sayfasına git
- **Not:** İçerik admin panelinden eklenir, başlangıçta İstanbul

#### S13: Ders Detay Sayfası
- Büyük görsel
- Ders başlığı + rating (yıldız + puan)
- Tesis bilgisi: logo/avatar + tesis adı
- Ders açıklaması
- Bilgi kartı (tablo formatında):
  - Ders Türü: 1-1 / Grup
  - Spor Dalı
  - Tarih aralığı
  - Saat
  - Fiyat (büyük, accent renk)
- **"📱 WhatsApp ile İletişime Geç" butonu (birincil, yeşil)** → tıklanınca işletme/eğitmenin WhatsApp numarasına yönlendirir
  - Otomatik mesaj şablonu: "Merhaba, [Ders Adı] dersi hakkında bilgi almak istiyorum."
- Alt bilgi: "Ders ve rezervasyon detayları için doğrudan iletişime geçin"
- Back butonu
- **Not:** Uygulama içi rezervasyon sistemi yoktur; kullanıcı WhatsApp üzerinden doğrudan tesis/eğitmen ile iletişime geçer

---

### 4.6 Profil — Footer Tab 5 (3 sayfa)

#### S15: Profil Sayfası (Login gerekli — login olmadan bu tab'a basılınca login'e yönlendir)
- Profil fotoğrafı (büyük, ortalı)
- "Doğrulanmış ✓" rozeti (varsa) + İsim soyisim
- İstatistikler (yan yana): Toplam Maç sayısı + Arkadaş sayısı (button tıklayınca arkadaş listesi)
- Şehir
- **Skor Kartı** (min. 5 etkinlik sonrası görünür, altında "Yeni" etiketi gösterilir):
  - ⭐ **X.X Sportmenlik** (N değerlendirme) — her zaman gösterilir
  - 📍 **%XX Katılım Güveni** (N katılım) — her zaman gösterilir
  - 🎤 **X.X Organizasyon** (N etkinlik) — **yalnızca etkinlik düzenleyenlerde** gösterilir
  - Confidence label: `Düşük / Orta / Yüksek` (bkz. Bölüm 14)
- **Rozetler:** Kazanılan rozetler icon+etiket halinde sıralanır (bkz. Bölüm 14.5)
- Favori sporlar (tag'ler halinde)
- "Profili Düzenle" butonu
- İki tab: **Yaklaşan** / **Geçmiş**
  - Her kart **tıklanabilir** → ilgili etkinlik, aktivite veya ders detay sayfasına gider
  - **Yaklaşan tab:** Tarihi bugün veya sonrası olan aktiviteler (gelecek)
  - **Geçmiş tab:** Tarihi geçmiş olan tamamlanmış aktiviteler; "Tamamlandı" gri badge ile gösterilir
  - Geçmiş tab'da: puanlanmamış aktivitelerde ek olarak "Puan ver" sarı badge'i görünür

#### S16: Profil Düzenle (Login gerekli)
- Profil fotoğrafı + "Fotoğrafı Değiştir" linki
- İsim input
- Soyisim input
- Doğum tarihi input
- Şehir input/seçici
- Favori sporlar (pill seçim, çoklu)
- "Kaydet" butonu
- Back butonu

#### S17: Başka Kullanıcının Profili
- Profil fotoğrafı (ortalı), isim + "Doğrulanmış ✓" rozeti (varsa), şehir · spor dalı
- **Skor Kartı** (S15 ile aynı yapı, salt okunur):
  - ⭐ **X.X Sportmenlik** + 📍 **%XX Katılım** + (varsa) 🎤 **X.X Organizasyon**
- **Rozetler** (kazanılanlar)
- Toplam aktivite sayısı
- **Yaklaşan / Geçmiş** aktivite sekmeleri (ikisi de görünür)

**Arkadaşlık buton sistemi — ilişkiye göre 4 durum:**
| Durum | Görünüm |
|-------|---------|
| `Arkadaş değil` | **"+ Arkadaş Ekle"** (birincil, yeşil) |
| `İstek gönderildi` | **"🕐 İstek Gönderildi — İptal Et"** (gri/disabled; tıklayınca iptal edilir) |
| `Karşı taraf istek göndermiş` | **"✓ Kabul Et"** (yeşil) + **"Reddet"** (kırmızı, yan yana) |
| `Zaten arkadaş` | **"✓ Arkadaşsın"** etiketi + **"💬 Mesaj Gönder"** (birincil, yeşil) |

- **"💬 Mesaj Gönder"** butonu: arkadaşken birincil (yeşil), değilken ikincil (gri) → **Sohbet (S19)**
- Kabul edilince: her iki kullanıcının arkadaş listesine (S22) eklenir; gönderene bildirim gider
- Feed etkisi: arkadaşların aktiviteleri Keşfet (S00) feed'inde öne çıkar

**⋮ Menü içeriği:**
- Raporla → S31
- Engelle
- Arkadaşlıktan Çıkar (yalnızca zaten arkadaşken görünür)

- "Profili Düzenle" butonu YOK (sadece kendi profilinde var)
- **Erişim noktaları — avatar/isim tıklanınca S17 açılır:**
  - Aktivite detayında (S09): organizatör avatarı + katılımcı listesindeki her avatar
  - Mesajlar listesinde (S18): her konuşma satırındaki avatar; sohbet ekranında üst barda avatar
  - Arkadaşlarım listesinde (S22): her satırdaki avatar / kart
  - Etkinlik detayında (S06): "Kim Gidiyor?" bölümündeki avatarlar

---

### 4.7 Mesajlaşma (2 sayfa)

#### S18: Mesajlar Listesi (Inbox — Login gerekli)
- Navbar'daki mesaj ikonundan erişilir
- Konuşma listesi:
  - Her satır: avatar, isim, son mesaj önizlemesi (truncated), tarih/saat
  - Okunmamış mesaj varsa: yeşil/accent badge (sayı)
  - **Avatar tıklanınca → S17 Kullanıcı Profili açılır** (satırın geri kalanına tıklayınca → Sohbet)
- Tıklandığında → Sohbet sayfasına git
- Back butonu

#### S19: Sohbet Sayfası (1-1 Mesajlaşma — Login gerekli)
- Üst bar: karşı tarafın ismi + avatar (tıklayınca profile git) + ⋮ menü (Engelle / Raporla)
- Mesaj balonları:
  - Gönderilen: sağ taraf, accent renk
  - Alınan: sol taraf, koyu renk
  - Her balonda: mesaj metni + saat
- Alt kısım: mesaj input + gönder butonu
- Back butonu

---

### 4.8 Menü Sayfaları (7 sayfa)

#### S20: Menü (Drawer)
- Sağdan açılan drawer veya tam sayfa
- Menü öğeleri listesi (ikon + metin + chevron):
  - Aktivitelerim
  - Arkadaşlarım
  - Arkadaşlarını Davet Et
  - Topluluk Kuralları
  - Ayarlar
  - Yardım & SSS
  - **Hesabını Doğrula** (login gerekli) — telefon doğrulama akışına (S29) yönlendirir
    - Doğrulanmamışsa: "📱 Hesabını Doğrula" (tıklanabilir)
    - Doğrulanmışsa: "✅ Hesabın Doğrulandı" (yeşil arka plan, tıklanamaz)
- **Not:** Bildirimler menüde yer almaz — üst navbar'da mesaj ikonunun solunda 🔔 ikonu olarak bulunur
- Alt kısımda: "Çıkış Yap" (kırmızı)
- Kapatma butonu (X)

#### S21: Aktivitelerim (Login gerekli)
- İki tab: **Yaklaşan** / **Geçmiş**
- Her kart **tıklanabilir** → ilgili etkinlik/aktivite/ders detayına gider
- **Yaklaşan tab:** Sadece tarihi gelecekte olan aktiviteler — durum badge'leri: Onaylandı (yeşil) / Onay bekliyor (turuncu) / Kayıtlı (yeşil)
- **Geçmiş tab:** Sadece tarihi geçmiş tamamlanan aktiviteler — hepsinde "Tamamlandı" gri badge
  - Puanlanmamış olanlar için ek olarak "Puan ver ⭐" sarı butonu gösterilir
- Yaklaşan ve Geçmiş tabları birbirinden bağımsız veri gösterir

#### S22: Arkadaşlarım (Login gerekli)
- Sekmeler: **Arkadaşlar** / **Gelen İstekler** / **Gönderilen İstekler**
- Arkadaş listesi: avatar + isim + favori spor
- Her satırda: mesaj gönder ikonu
- Arama çubuğu (üstte)
- Tıklayınca → Kullanıcı profiline git
- Gelen isteklerde aksiyon: **Kabul Et** / **Reddet**
- Kabul sonrası bildirim akışı:
  - Alıcıya: "Yeni arkadaş eklendi"
  - Gönderene: "XXX arkadaşlık isteğinizi kabul etti"

#### S23: Arkadaşlarını Davet Et (Login gerekli)
- Davet ikonu/illüstrasyonu
- Açıklama metni
- Kişiye özel referans kodu/linki (örn: sporwave.co/davet/BERK2026)
- "Linki Kopyala" butonu
- "WhatsApp ile Paylaş" butonu
- (İleride: SMS ile davet, kişi listesinden seçim)

#### S24: Bildirimler (Login gerekli)
- Bildirim listesi:
  - Her bildirimde: tür ikonu (başarı/bilgi/davet) + metin + tarih/saat + "Detaya git →" linki
  - **Her bildirim satırı tıklanabilirdir → ilgili detay sayfasına yönlendirir:**
    - Aktivite başvurusu onaylandı/reddedildi → Aktivite Detay (S09)
    - Yeni ders ilanı eklendi → Ders Detay (S13)
    - Yaklaşan etkinlik hatırlatıcısı → Etkinlik Detay (S06)
    - Arkadaşlık daveti → Arkadaşlarım (S22) / Profil (S17)
    - Maç bitti — puanla → Puanlama Akışı (S33)
    - Yeni mesaj → doğrudan Sohbet (S19) açılır
  - Bildirim türleri:
    - Aktivite başvurusu onaylandı/reddedildi
    - Yeni mesaj
    - Yaklaşan etkinlik hatırlatıcısı
    - Yeni ders ilanı eklendi
    - Yeni arkadaşlık isteği
    - Arkadaşlık isteğin kabul edildi
    - Arkadaşlık isteğin reddedildi
    - **Maç bitti — oyuncuları puanla** (aktivite bitiş saatinden 2 saat sonra)

#### S25: Ayarlar (Login gerekli)
- Ayar öğeleri listesi:
  - Bildirim Tercihleri (push on/off, türlere göre)
  - Şifre Değiştir
  - E-posta Değiştir
  - Dil Seçimi
  - **Topluluk Kuralları** (S32'ye link)
  - Gizlilik Politikası
  - Kullanım Şartları
  - KVKK Aydınlatma Metni
  - Hesabı Sil (kırmızı, en altta)

#### S26: Yardım & SSS (Herkese açık — login gerekmez)
- Accordion/genişletilebilir SSS listesi
- Sorular: "Nasıl aktivite oluşturabilirim?", "Ders rezervasyonu nasıl yapılır?", "Hesabımı nasıl silebilirim?" vb.
- İletişim: Destek e-posta adresi veya iletişim formu

---

### 4.9 Güvenlik & Moderasyon Sayfaları (4 sayfa)

#### S29: Kullanıcı Doğrulama Akışı
- **Erişim:** Menüden (S20) "📱 Hesabını Doğrula" öğesine tıklanarak açılır (login gerekli)
- **Doğrulama adımları:**
  - **Adım 1:** Telefon numarası girişi (+90 formatında)
  - **Adım 2:** SMS ile gelen 6 haneli OTP kodunu gir → "Doğrula" butonu
- **Doğrulama sonrası:**
  - Profil sayfasında ismin yanında "✓" (yeşil) ikonu görünür
  - Menüdeki "Hesabını Doğrula" öğesi "✅ Hesabın Doğrulandı" olarak değişir (yeşil arka plan, tıklanamaz)
  - Kullanıcı tekrar doğrulama yapamaz (tek seferlik işlem)
  - Aktivite kartlarında ve detay sayfalarında "Doğrulanmış ✓" rozeti görünür
- **Amaç:** Fake profil ve troll hesap oranını düşürür, topluluk güvenini artırır

#### S30: Eğitmen Doğrulama Akışı
- Ders ilanı sayfasında (admin paneli üzerinden başlatılır): eğitmene/tesise doğrulama daveti gönderilir
- Eğitmen/tesis: sertifika fotoğrafı yükler (PDF veya görsel)
- Talep admin paneline (A09) düşer; admin onaylar veya reddeder
- Onay sonrası: "Doğrulanmış Eğitmen ✓" rozeti ders ilanında görünür
- Reddedilirse: açıklama metniyle bildirim gönderilir

#### S31: Raporla & Engelle Sistemi
- **Raporla butonu:** Her kullanıcı profili (S17) ve her aktivite (S09) üzerinde ⋮ menüde mevcut
- Rapor kategorileri (seçim ekranı):
  - Fake profil
  - Uygunsuz içerik
  - Gelmiyor / No-show
  - Spam
  - Diğer (serbest metin)
- Rapor gönderilince: "Teşekkürler, ekibimiz inceleyecek" onay mesajı
- **Engelle butonu:** Kullanıcıyı tüm alanlarda gizler (feed, arama, mesajlar)
- Engelleme: Profil ⋮ menüsünden (S17) veya Sohbet ⋮ menüsünden (S19)

#### S32: Topluluk Kuralları Sayfası
- Uygulama içinden Ayarlar → Topluluk Kuralları ile erişilebilir
- Onboarding'in 4. adımında da gösterilir (kaydolmadan kabul edilemez)
- İçerik:
  - No-show yasağı ve yaptırımları
  - Saygılı iletişim zorunluluğu
  - Fake profil / sahte ilan yasağı
  - Uygunsuz içerik ve taciz yasağı
  - İhlal bildirme yöntemi

---

### 4.10 Puanlama Sistemi (1 sayfa)

#### S33: Etkinlik Sonrası Değerlendirme (Rating Flow)
- **Tetikleyici:** Aktivite bitiş saatinden 2 saat sonra otomatik push bildirimi: "Dünkü tenis maçını değerlendir 🌟"
- **Hedef:** 15 saniyede tamamlanabilir, minimal adım, yüksek completion rate
- **UX Akışı (3 adım):**

**Adım 1 — Katılım Onayı** *(host'a ayrı, katılımcıya ayrı)*
  - Soru: "Etkinliğe katıldın mı?"
  - [Evet, katıldım] → Adım 2
  - [Hayır, gidemedim] → İptal; katılımcı otomatik No-show olarak işaretlenir
  - *(Host için ayrıca: "Gelmeyenler var mıydı?" → no-show listesi işaretlenebilir)*

**Adım 2 — Sportmenlik Puanı** *(zorunlu)*
  - "Diğer oyuncuları nasıl değerlendiriyorsun?"
  - Katılımcı listesi (avatar + isim)
  - Her oyuncu için 1–5 yıldız (horizontal star picker)
  - Puanlar **anonimdir** — kimse kimin kaç yıldız verdiğini görmez
  - "Atla" opsiyonu YOK (zorunlu) — drop-off azaltmak için sadece 1-tap tap yıldız

**Adım 3 — Organizasyon Puanı** *(yalnızca host değerlendiriliyorsa)*
  - "Etkinliği organize eden kişiyi değerlendir"
  - Host: avatar + isim
  - 1–5 yıldız (aynı picker)
  - Opsiyonel kısa yorum (maks. 100 karakter, placeholder: "Harika organizasyon!")

- **"Gönder" butonu** → Tüm puanlar birlikte backend'e gider
- **Profil entegrasyonu:** Puanlar Bayesian average ile S15/S17 skor kartına yansır (bkz. Bölüm 14)
- **Moderasyon entegrasyonu:** Ortalama < 2 yıldız veya tekrarlı No-show → admin flag (bkz. A05)
- **Bildirim entegrasyonu (çift yönlü):**
  - S24'teki "Maç bitti — puanla" bildirimi kullanıcıyı S33'e açar
  - S33 tamamlandığında S24'e "Değerlendirme kaydedildi" bildirimi düşer (detay: S15/S17 skor kartı)

**State Diagram:**
```
Aktivite Oluşturuldu
  → [Onay Bekleniyor] ←→ [Reddedildi]
  → [Onaylandı]
    → [Katıldı] → [Puanlandı]
    → [No-show] → (Katılım skoru düşer, admin flag)
```

---

### 4.11 Ek Sayfalar (2 sayfa)

#### S27: Splash Screen
- Uygulama logosu (ortalı)
- Uygulama adı
- Kısa slogan
- Yükleniyor animasyonu
- 1-2 saniye sonra otomatik olarak **Keşfet Feed (S00)**'e geçiş

#### S28: Boş Durum Sayfaları (Reusable component)
- Etkinlik yokken: "Henüz etkinlik eklenmedi" + illüstrasyon
- Aktivite yokken: "İlk aktiviteyi sen oluştur!" + "+" butonu
- Mesaj yokken: "Henüz mesajınız yok" + illüstrasyon
- Bildirim yokken: "Bildiriminiz bulunmuyor"

---

## 5. SAYFA HARİTASI — WEB ADMİN PANELİ (9 sayfa)

### A01: Dashboard
- Toplam kullanıcı, aktif etkinlik, aktif ders, günlük başvuru sayısı (kartlar)
- Kullanıcı büyüme grafiği (çizgi grafik)
- Son aktiviteler listesi
- Hızlı aksiyon butonları (etkinlik ekle, ders ekle)

### A02: Etkinlik Yönetimi
- Etkinlik tablosu: başlık, şehir, tarih, spor dalı, durum (yayında/taslak/süresi dolmuş)
- Filtreleme: şehir, spor dalı, tarih aralığı, durum
- Ekle/düzenle/sil aksiyonları
- Etkinlik ekleme formu: başlık, açıklama, görsel yükleme, tarih/saat, şehir, konum, spor dalı, fiyat, kayıt linki (harici URL veya uygulama içi)

### A03: Ders İlanı Yönetimi
- Ders ilanları tablosu: başlık, tesis, spor dalı, ders türü, fiyat, durum
- Ekle/düzenle/sil aksiyonları
- İlan ekleme formu: başlık, açıklama, görsel yükleme, tesis bilgisi, eğitmen bilgisi, spor dalı, ders türü (1-1/grup), fiyat, tarih aralığı, saat, konum

### A04: Kullanıcı Yönetimi
- Kullanıcı tablosu: isim, e-posta, kayıt tarihi, son aktif, şehir, toplam etkinlik, oyuncu puanı
- Arama/filtreleme
- Profil detay görüntüleme
- Hesap askıya alma / silme
- Şikayet geçmişi görüntüleme

### A05: Aktivite Moderasyonu
- Kullanıcıların oluşturduğu Oyna aktivitelerinin listesi
- Raporlanan/şikayet edilen aktiviteleri filtreleme
- İnceleme ve aksiyon alma (uyarı / silme / kullanıcı askıya alma)
- **Otomatik flag sistemi:** Ortalama puan < 2 yıldız olan kullanıcılar moderasyon kuyruğuna düşer
- **No-show kuyruğu:** Tekrarlı "Gelmedi" raporu alan hesaplar için askıya alma önerisi

### A06: Raporlar & Şikayetler
- Kullanıcı raporları listesi (raporlayan, raporlanan, sebep, tarih)
- Mesaj şikayetleri
- Sahte profil bildirimleri
- Durum takibi: Açık / İnceleniyor / Çözüldü

### A07: Bildirim Gönderimi
- Toplu push bildirim oluşturma
- Hedef kitle filtresi: şehir, spor dalı, son aktif tarih, tüm kullanıcılar
- Bildirim içeriği: başlık + mesaj
- Zamanlama: Hemen gönder / İleri tarih planlama
- Geçmiş bildirimler listesi

### A08: Analitik & Raporlama
- Kullanıcı büyüme grafiği (günlük/haftalık/aylık)
- En popüler spor dalları grafiği
- Etkinlik katılım oranları
- Ders rezervasyon istatistikleri
- Şehir bazlı kullanıcı dağılımı
- Aktif/pasif kullanıcı oranı

### A09: Eğitmen & Kullanıcı Doğrulama Paneli (Yeni)
- Bekleyen doğrulama talepleri listesi (kullanıcı doğrulama + eğitmen/tesis doğrulama)
- **Kullanıcı doğrulama:** Telefon OTP onay log'u (otomatik işlenir, sorunlu durumlar manuel incelemeye düşer)
- **Eğitmen/tesis doğrulama:** Yüklenen sertifika ve belge görüntüleme → Onayla / Reddet aksiyonu
- Reddedilme sebebi metin alanı (eğitmene bildirim olarak gider)
- Doğrulanmış eğitmen/tesis sayısı istatistiği

---

## 6. KULLANICI AKIŞLARI

### Akış 1: İlk Kez Gelen Kullanıcı
```
Uygulama açılır → Splash Screen (1-2sn) → Keşfet Feed (login gerekmez)
→ Yakındaki maçlara/etkinliklere/derslere göz atar
→ Bir işlem yapmak ister (katıl/oluştur/mesaj) → Login/Register'a yönlenir
→ Kayıt olur → Onboarding (isim, foto, sporlar, Topluluk Kuralları kabul) → Kaldığı yere döner, işlemini tamamlar
```

### Akış 2: Bireysel Aktivite Oluşturma
```
Oyna tab → "+" FAB butonuna bas (login gerekli)
→ Spor dalı seç → Başlık/açıklama yaz → Tarih/saat/konum belirle
→ Max kişi + kabul modu seç → "Yayınla" → Feed'de görünür
```

### Akış 3: Aktiviteye Katılma (Onay Modeli)
```
Keşfet veya Oyna Feed'de aktiviteye tıkla → Detay sayfası → "Katıl" (login gerekli)
→ Deneyim seviyesi seç (bottom sheet: Başlangıç/Orta/İyi/Profesyonel)
→ Eğer "Herkesi kabul et": Doğrudan katılım onayı
→ Eğer "Onay ile kabul et": "Başvurunuz gönderildi! Onay bekleniyor."
   → Aktivite sahibine bildirim gider
   → Sahip onaylar/reddeder → Sonuç bildirimi gelir
```

### Akış 4: Etkinliğe Katılma
```
Keşfet veya Etkinlik tab → Etkinliğe tıkla → Detay sayfası
→ "Kayıt Ol" (login gerekli) → Harici kayıt sitesine yönlendir
→ Uygulama içi kayıt -> Etkinlik "Aktivitelerim → Yaklaşan" listesine eklenir
```

### Akış 5: Ders İletişimi
```
Keşfet veya Dersler tab → Derse tıkla → Detay sayfası
→ "📱 WhatsApp ile İletişime Geç" butonuna tıkla
→ WhatsApp açılır, otomatik mesaj şablonu ile tesis/eğitmenin numarasına yönlendirilir
→ Kullanıcı WhatsApp üzerinden rezervasyon detaylarını konuşur
```

### Akış 6: Maç Sonrası Puanlama
```
Aktivite bitiş saati + 2 saat → Push bildirim: "Nasıldı? Oyuncuları puanla 🌟"
→ S33 açılır: Katılımcı listesi
→ Her oyuncu için 1-5 yıldız + opsiyonel yorum
→ "Gönder" → Puanlar karşı tarafların profillerine yansır
```

---

## 7. DESIGN SYSTEM

### 7.1 Renk Paleti

| Token | Hex | Kullanım |
|-------|-----|---------|
| `C.bg` | `#F7F9FC` | Sayfa arka planı |
| `C.s` | `#FFFFFF` | Kart, TopBar, TabBar yüzeyi |
| `C.s2` | `#F1F4F8` | İkincil yüzey, input bg, pill bg |
| `C.b` | `#E6EAF0` | Border, ayraç çizgisi |
| `C.t` | `#0F172A` | Birincil metin |
| `C.d` | `#475569` | İkincil metin, meta |
| `C.d2` | `#94A3B8` | Placeholder, devre dışı metin |
| `C.dis` | `#CBD5E1` | Disabled durum |
| `C.a` | `#B7F000` | Accent — buton bg, aktif indikatör, FAB |
| `C.ap` | `#A3DB00` | Accent pressed |
| `C.ad` | `rgba(183,240,0,0.12)` | Accent ghost (pill aktif bg, tag bg) |
| `C.at` | `#5A7A00` | Accent metin (beyaz bg üzerinde okunabilir accent) |
| `C.r` | `#EF4444` | Hata, silme |
| `C.bl` | `#3B82F6` | Bilgi, onay gerekli badge |
| `C.o` | `#F59E0B` | Uyarı, "onay bekliyor" |
| `C.g` | `#22C55E` | Başarı, "onaylandı", doğrulanmış tesis |
| `C.bk` | `#0B0F14` | Accent buton metin rengi |

### 7.2 Tipografi

#### Fontlar

| Bağlam | Font |
|--------|------|
| Logo & marka yazısı (navbar "SporWave") | **Plus Jakarta Sans** 800 |
| Outer wrapper başlığı | **Plus Jakarta Sans** 700–800 |
| Telefon içi tüm UI | **SF Pro Display** → `-apple-system, BlinkMacSystemFont, Helvetica Neue` |

#### Tip Ölçeği (Telefon içi)

| Rol | Size | Weight |
|-----|------|--------|
| Sayfa başlığı (det sayfaları) | 20px | 800 |
| Section başlığı | 18px | 800 |
| Card title | 15–16px | 600 |
| Gövde metni | 13–14px | 400 |
| Meta / sub | 12–13px | 400–500 |
| Badge / caption | 9–11px | 600–700 |

### 7.3 Gölge & Yüzey

| Eleman | Değer |
|--------|-------|
| Phone shell | `0 8px 48px rgba(0,0,0,0.12)` |
| Kart | `0 1px 4px rgba(0,0,0,0.06)` |
| FAB | `0 4px 20px rgba(183,240,0,0.35)` |
| Bottom Sheet | `0 -4px 24px rgba(0,0,0,0.08)` |
| Overlay | `rgba(15,23,42,0.4)` |

### 7.4 Bileşen Notları
- **Kartlar:** Rounded corners 14px, ince border (`C.b`), `boxShadow` ile yükseltilmiş, tıklanabilir
- **Filtre pill'leri:** Yatay scroll, rounded 20px, aktif olan accent renkli (`C.ad` bg, `C.a` metin)
- **FAB butonu:** 56×56px, rounded 16px, `C.a` bg, `C.bk` metin (okunabilirlik), accent gölge
- **Bottom sheet:** Alttan yukarı açılır, üstte rounded 20px, `C.bk` overlay backdrop
- **Avatar'lar:** Yuvarlak, gradient arka plan, harflerle initials, beyaz metin
- **Tag'ler:** Küçük rounded chip'ler (8px), `C.ad` bg, `C.a` metin
- **Accent buton metin:** `C.bk` (#0B0F14) — açık zemin üzerinde `C.a` ile kontrast sağlar

---

## 8. DENEYİM SEVİYESİ SİSTEMİ

Kullanıcı bir Oyna aktivitesine katılmak istediğinde deneyim seviyesini seçer:

| Seviye | Açıklama |
|--------|----------|
| **Başlangıç** | Spora yeni başlayan, temel kuralları öğreniyor |
| **Orta** | Düzenli yapıyor, orta seviye beceri |
| **İyi** | Deneyimli, ileri seviye teknik |
| **Profesyonel** | Yarışma/turnuva seviyesi |

- Seviye seçimi **zorunlu** (bottom sheet'te seçmeden devam edilemez)
- Aktivite sahibi etkinlik oluştururken seviye tercihi belirleyebilir (opsiyonel):
  - "Herkes" — tüm seviyeler katılabilir
  - Belirli seviye — sadece o seviye ve üstü katılabilir
- "Onay ile kabul et" modunda, aktivite sahibi başvuranın seviyesini görerek karar verir

---

## 9. KABUL MODU SİSTEMİ

Aktivite oluşturulurken iki kabul modu seçilebilir:

### Herkesi Kabul Et
- Başvuran herkes otomatik olarak katılımcı olur
- Kontenjan (max kişi) dolunca otomatik kapanır
- Hızlı ve kolay — halısaha gibi acil oyuncu lazım durumlar için ideal

### Onay ile Kabul Et
- Her başvuru aktivite sahibine bildirim olarak gelir
- Sahip başvuranın profilini, oyuncu puanını ve deneyim seviyesini görür
- Onayla / Reddet aksiyonu alır
- Sonuç başvurana bildirim olarak gider
- Tenis gibi seviye eşleşmesi önemli sporlar için ideal

---

## 10. MONETİZASYON PLANI (3 Fazlı)

### Faz 1 — Tamamen Ücretsiz (0–10K kullanıcı)
- Tüm özellikler ücretsiz, hiçbir kısıtlama yok
- Kullanıcı tabanı ve güven oluşturma odağı
- **Veri toplama:** Hangi sporlar, hangi bölgeler, hangi saatler popüler — ilerideki kararlar için

### Faz 2 — Hafif Monetizasyon (10K–50K kullanıcı)
- **Eğitmen/tesis komisyonu:** Uygulama üzerinden gerçekleşen rezervasyonlardan %10–15 kesim
- **Öne çıkarılan ilanlar:** Oyna aktiviteleri ve Etkinlikler için "Öne Çıkar" özelliği (günlük/haftalık ücret)
- **Premium profil rozeti:** Ücretli rozet, feed'de görünürlüğü artırır

### Faz 3 — Pro Üyelik (50K+ kullanıcı)
- **Sınırsız ilan oluşturma** (ücretsiz katmanda günlük limit)
- **Gelişmiş filtre ve arama önceliği:** Keşfet ve Oyna feed'inde üstte çıkma
- **Verified badge:** Güven sinyali olarak profil ve ilanlarda gösterilir
- **Reklamsız deneyim**

---

## 11. TEKNİK NOTLAR (İleride Detaylandırılacak)

### Mobil Teknoloji Seçenekleri
- React Native veya Flutter (cross-platform, iOS + Android tek codebase)
- Alternatif: Native (Swift + Kotlin) — performans avantajı ama çift geliştirme maliyeti

### Backend
- Node.js/Express veya Python/Django REST API
- PostgreSQL veritabanı
- Firebase veya OneSignal push bildirimler
- AWS S3 veya Cloudinary görsel depolama
- WebSocket (mesajlaşma için gerçek zamanlı)

### Admin Panel
- React veya Next.js web uygulaması
- Aynı backend API'yi kullanır

### Ödeme (İleride)
- iyzico (pazaryeri ödeme bölüştürme)
- Apple Pay / Google Pay
- Uygulama içi satın alma (abonelikler için)

### KVKK Uyum
- Türkçe gizlilik politikası
- Aktif opt-in rıza mekanizması
- Konum izleme için ayrı rıza
- VERBİS kaydı
- Şifreli veri depolama
- İhlal müdahale planı

---

## 12. LANSMAN YOL HARİTASI

### Ay 1-3: MVP
- İstanbul 2 ilçe (Kadıköy + Beşiktaş)
- 3 spor dalı (futbol, tenis, basketbol)
- 50 eğitmen/tesis ilanı ücretsiz platforma al
- 10 spor mekanıyla ortaklık
- Kendi etkinliklerini düzenle

### Ay 4-6: İstanbul Genişleme
- İstanbul geneli
- 10+ spor dalı
- Faz 2 monetizasyonu aktif (komisyon + öne çıkarılan ilanlar)
- Etkinlik organizatörleriyle anlaşmalar
- Hedef: 10.000 kullanıcı

### Ay 7-12: Büyük Şehirler
- Ankara ve İzmir
- Pro Üyelik modeli başlat
- Kurumsal wellness pilot
- Hedef: 50.000 kullanıcı

---

## 14. GÜVEN & SKOR SİSTEMİ

> Bu bölüm teknik ekip ve tasarım ekibinin birlikte referans alabileceği şekilde yapılandırılmıştır.

---

### 14.1 Skor Tanımları (3 Zorunlu Skor)

| Skor | Format | Kimin İçin | Nasıl Hesaplanır |
|------|--------|-----------|-----------------|
| **Sportmenlik Puanı** | ⭐ 1.0–5.0 yıldız | Tüm kullanıcılar | Maç sonrası diğer katılımcılar tarafından anonim puanlama |
| **Katılım Güveni** | 📍 %0–100 | Tüm kullanıcılar | Onaylı katılım / toplam katılım taahhüdü |
| **Organizasyon Puanı** | 🎤 1.0–5.0 yıldız | Yalnızca etkinlik düzenleyenler | Maç sonrası katılımcılar tarafından host puanlaması |

**Profil Örneği:**
```
⭐ 4.7  Sportmenlik       (23 değerlendirme)
📍 %93  Katılım Güveni   (18 / 19 maç)
🎤 4.5  Organizasyon     (8 etkinlik — yalnızca host ise)
```

---

### 14.2 Katılım Güveni Hesaplama

**Temel formül:**
```
Katılım Güveni = onaylı_katılım / (onaylı_katılım + no_show) × 100
```

**Ağırlıklı hesaplama (zaman bazlı decay):**
- Son 3 ay içindeki no-show'lar tam ağırlık alır
- 3–6 ay arası: ağırlık 0.7×
- 6 ay üzeri: ağırlık 0.3× (eski hatalar zamanla unutulur)

**No-show işaretleme:**
- **Host işaretler:** Rating akışında (S33 Adım 1) gelmeyenleri işaretleyebilir
- **Katılımcı self-report:** "Gidemedim" seçeneğiyle kendisi de işaretleyebilir
- **İtiraz mekanizması:** Yanlış işaretlenen kullanıcı 48 saat içinde itiraz edebilir → admin inceleme
- **MVP için:** Çift taraflı onay gerekmiyor; tek taraf (host veya self-report) yeterli

**Eşikler:**
- < 5 etkinlik → skor gösterilmez, "Yeni" etiketi gösterilir
- 5–14 etkinlik → Confidence: Düşük
- 15–29 etkinlik → Confidence: Orta
- 30+ etkinlik → Confidence: Yüksek

---

### 14.3 Sportmenlik Puanı Hesaplama

**Bayesian Average** (kötüye kullanıma karşı dayanıklı):
```
Bayesian_Avg = (C × m + Σ ratings) / (C + n)
```
- `n` = kullanıcının aldığı değerlendirme sayısı
- `m` = platform geneli ortalama (örn: 4.2)
- `C` = prior weight / damping factor (örn: 10)
- Yeni kullanıcılar platform ortalamasına çekilir, 1 kişinin manipülasyonu etkisizleşir

**Aykırı değer yumuşatma:**
- Bir kullanıcıdan aynı kişiye 30 gün içinde yalnızca 1 puanlama kabul edilir
- En düşük %10 ve en yüksek %10 puanlamalar hesaplamada 0.5× ağırlık alır (outlier trimming)

**Anonimlik:**
- Puanlar tamamen anonimdir — kimse kimin kaç yıldız verdiğini göremez
- Kullanıcıya yalnızca güncellenmiş ortalaması bildirilir

---

### 14.4 Kötüye Kullanım Önleme Sistemi

| Risk Senaryosu | Önlem |
|---------------|-------|
| **Arkadaşlar birbirine sürekli 5 yıldız** | Aynı çift arasında 30 günde max. 1 puanlama kabul edilir |
| **İntikam 1 yıldız** | Bayesian average + outlier trimming: tek kötü puan ortalamayı ciddi düşüremez |
| **Sahte hesap rating** | Telefon doğrulaması zorunlu; yeni hesapların puanları 30 gün boyunca 0.3× ağırlık taşır |
| **No-show yanlış işaretleme** | 48 saatlik itiraz penceresi; aynı host'tan 3+ itiraz gelirse host admin incelemeye alınır |
| **Rating spam** | Her kullanıcı bir etkinlik için yalnızca 1 kez puanlama yapabilir |
| **Yeni hesap manipülasyonu** | < 5 etkinlik: skor gösterilmez; < 30 gün: puanlar 0.3× ağırlık |

---

### 14.5 Rozet Sistemi (Gamification)

| Rozet | Koşul | Görünüm |
|-------|-------|---------|
| 🏅 **50 Maç Kulübü** | 50+ onaylı katılım | Profilde kalıcı |
| ✅ **%100 Katılım** | Son 10 maçın tamamı katılım onaylı | Profilde kalıcı, düşerse kaybolur |
| 🤝 **Fair Play** | Sportmenlik ort. 4.5+ ve min. 20 değerlendirme | Profilde kalıcı |
| 🎙️ **Süper Organizatör** | Organizasyon ort. 4.5+ ve min. 5 etkinlik | Profilde kalıcı |
| 🆕 **Yeni Üye** | < 5 etkinlik | Geçici, 5. etkinlikten sonra kalkar |

**Kötüye kullanım önlemi:** Rozetler hesaplanmış skorlara (Bayesian) dayandığı için manipüle edilmeleri zordur. Şüpheli rozet kazanımları admin panelinde log'lanır.

**Retention etkisi:** Rozetler profilde görünür konumdadır; kullanıcı motivasyonu için hedef verirler. Bildirim: "50 Maç Kulübü'ne hoş geldin! 🏅"

---

### 14.6 UI Gösterim Kuralları

**Skor ne zaman görünür:**
- Skor kartı: Profilde isim + fotoğrafın hemen altı
- Aktivite detayında (S09): Katılımcı satırında compact özet — `⭐4.7 📍%93`
- Keşfet feed'inde (S00): Organizatör satırında compact özet
- Kartlarda (Oyna feed S07): Organizatör için compact özet opsiyonel

**Confidence label renk kodu:**
- 🔴 Düşük (< 15 etkinlik)
- 🟡 Orta (15–29 etkinlik)
- 🟢 Yüksek (30+ etkinlik)

**"Yeni" etiketi:**
- < 5 etkinlik → skor yerine `Yeni 🆕` badge
- 5. etkinlikten sonra otomatik kalkar, skor kartı belirir

---

### 14.7 Teknik Veri Modeli

**Participant (Katılımcı):**
```json
{
  "userId": "uuid",
  "activityId": "uuid",
  "status": "requested | approved | attended | no_show | rejected",
  "experienceLevel": "beginner | intermediate | advanced | pro",
  "joinedAt": "ISO8601",
  "attendanceConfirmedBy": "self | host | both",
  "ratedAt": "ISO8601 | null"
}
```

**Rating (Puanlama):**
```json
{
  "ratingId": "uuid",
  "activityId": "uuid",
  "raterId": "uuid",
  "ratedUserId": "uuid",
  "ratingType": "sportsmanship | organization",
  "stars": 4,
  "comment": "string | null",
  "isAnonymous": true,
  "createdAt": "ISO8601",
  "weight": 1.0
}
```

**UserScoreAggregate (Kullanıcı Skoru Özeti):**
```json
{
  "userId": "uuid",
  "sportsmanshipScore": 4.7,
  "sportsmanshipCount": 23,
  "attendanceRate": 0.93,
  "totalAttended": 18,
  "totalCommitted": 19,
  "organizationScore": 4.5,
  "organizationCount": 8,
  "confidenceLevel": "high | medium | low | new",
  "badges": ["fair_play", "50_match_club"],
  "lastUpdated": "ISO8601"
}
```

**Badge:**
```json
{
  "badgeId": "string",
  "userId": "uuid",
  "earnedAt": "ISO8601",
  "isActive": true
}
```

---

### 14.8 MVP vs Phase 2

| Özellik | MVP | Phase 2 |
|---------|-----|---------|
| Sportmenlik puanı (1-5 yıldız) | ✅ | ✅ gelişmiş |
| Katılım Güveni (%) | ✅ basit formül | ✅ decay sistemi |
| Organizasyon puanı | ✅ yalnızca host | ✅ aynı |
| Bayesian average | ✅ basit versiyon | ✅ C ve m optimize edilir |
| Anonimlik | ✅ | ✅ |
| Outlier trimming | ❌ | ✅ |
| Rating ring tespiti | ❌ | ✅ |
| Zaman bazlı decay | ❌ | ✅ |
| Confidence label | ✅ basit (sayı eşiği) | ✅ gelişmiş |
| Rozet sistemi | ✅ 3 temel rozet | ✅ tüm rozetler |
| Admin moderasyon paneli | ✅ manuel | ✅ otomatik flag |
| No-show itiraz mekanizması | ✅ | ✅ |
| ELO / skill bazlı eşleşme | ❌ | ✅ |

---

## 15. YAPILACAKLAR (TODO)

- [ ] Wireframe'lerin tamamlanması (React interaktif prototip)
- [ ] S00 Keşfet sayfası wireframe tasarımı (karma feed layout)
- [ ] S29-S33 güvenlik ve puanlama sayfaları wireframe tasarımı
- [ ] S33 rating akışı için UX prototip (15 sn completion hedefi)
- [ ] Her sayfa için detaylı UI spesifikasyonu
- [ ] Skor sistemi için veritabanı şeması tasarımı (Bölüm 14.7 JSON yapılarını temel al)
- [ ] Rating API endpoint planlaması
- [ ] Skor hesaplama servisi (Bayesian average — Bölüm 14.3)
- [ ] No-show itiraz mekanizması backend akışı
- [ ] Teknoloji stack kararı (React Native vs Flutter)
- [ ] Figma'da yüksek sadakatli tasarımlar
- [ ] MVP sprint planlaması
- [ ] Tesis/eğitmen iletişim stratejisi
- [ ] App Store / Play Store hazırlığı (açıklama, screenshot, anahtar kelimeler)

---

> **Not:** Bu doküman projenin "tek gerçek kaynağı" (single source of truth) olarak güncel tutulmalıdır.
> Her yeni karar alındığında ilgili bölüm güncellenir.
