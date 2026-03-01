// ============================================================
// SPORWAVE — Merkezi Tema Dosyası
// Renk değişikliği yapmak için sadece bu dosyayı düzenle.
// ============================================================

// ─── Primitive Renkler ──────────────────────────────────────
// Bu değerleri değiştirmek tüm uygulamayı etkiler.

export const COLORS = {
  // Ana renkler
  primary:     "#599A77",   // Accent / CTA / vurgu rengi
  white:       "#FFFFFF",
  black:       "#0D0D0D",

  // Arka plan katmanları
  bgPage:      "#FFFFFF",   // Sayfa zemini
  bgSurface:   "#F5F5F5",   // Hafif farklı yüzey (tabbar, header)

  // Kart & border
  cardBg:      "#FFFFFF",   // Kart arka planı
  divider:     "#E0E0E0",   // Divider / border (görünür açık gri)

  // Metin hiyerarşisi
  textPrimary: "#0D0D0D",   // Ana metin
  textSecond:  "#555F6D",   // İkincil metin
  textMuted:   "#9AA3AE",   // Soluk metin / placeholder

  // Durum renkleri (sabit — tema değişiminden etkilenmez)
  red:         "#FF4757",
  green:       "#2ED573",
  orange:      "#FF8C42",
  gold:        "#FFD700",
  purple:      "#A78BFA",
};

// ─── T Token Objesi ─────────────────────────────────────────
// Tüm jsx dosyaları bu T objesini kullanır.
// Primitive COLORS'dan türetilir — doğrudan düzenleme.

export const T = {
  accent:      COLORS.primary,
  bg:          COLORS.bgPage,
  bgAlt:       COLORS.bgSurface,
  card:        COLORS.cardBg,
  cardBorder:  COLORS.divider,
  text:        COLORS.textPrimary,
  textDim:     COLORS.textSecond,
  textMuted:   COLORS.textMuted,
  red:         COLORS.red,
  green:       COLORS.green,
  orange:      COLORS.orange,
  gold:        COLORS.gold,
  purple:      COLORS.purple,
};

export default T;
