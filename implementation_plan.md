# Quizyen Web Uygulamasını PWA'ya Dönüştürme Planı

Bu döküman, mevcut Next.js 15 App Router destekli projenin modern bir Progressive Web App (PWA) yapısına yükseltilmesi için gereken teknik adımları içerir. Next.js 14+ PWA dönüşümleri için artık Workbox'ın modern halefi olan **Serwist** (`@serwist/next`) önerilmektedir.

## ⚠️ Kullanıcı Onayı Gereken Konular (User Review Required)

> [!IMPORTANT]
> **Serwist Bağımlılığı**: PWA çekirdek yapısı için Google'ın Workbox kütüphanesinin modern ve Next.js uyumlu hali olan `@serwist/next` paketini kuracağız. Onaylıyor musunuz?

> [!NOTE]
> **Uygulama İkonları**: PWA için özel boyutlarda (192x192, 512x512, maskable ve apple-touch-icon) ikonlara ihtiyacımız var. Plan dahilinde mevcut `public/appicon-cropped.png` dosyasından bu setleri otomatik üretecek bir betik çalıştırabilirim veya manuel olarak temin etmeyi tercih edebilirsiniz.

> [!TIP]
> **Renk Teması**: PWA için bir `theme_color` (tarayıcı araç çubuğu rengi) ve `background_color` (açılış ekranı rengi) belirlemeliyiz. Varsayılan olarak beyaz (`#ffffff`) ve Quizyen ana rengini kullanmayı öneriyorum.

## Kurulum ve Konfigürasyon Adımları (Proposed Changes)

Önerilen değişiklikler mantıksal bileşenlere göre aşağıda gruplanmıştır.

### 1. Bağımlılıkların Eklenmesi (Dependencies)

- `npm install @serwist/next` - PWA ve Service Worker yeteneklerini entegre eden araç.

### 2. Next.js Konfigürasyonu

#### [MODIFY] [next.config.ts](file:///d:/repo/quizflow-landing/next.config.ts)
- `serwist` eklentisini import edeceğiz.
- Serwist `withSerwist` sarmalayıcısını oluşturup `withNextIntl` ile birleştireceğiz.
- `swSrc` ve `swDest` gibi ayarları tanımlayacağız.

#### [MODIFY] `.gitignore`
- Oluşturulacak Service Worker dosyalarını (örneğin `public/sw.js` veya `public/sw.js.map`) git takibinden çıkaracağız.

---

### 3. Service Worker ve Manifest (PWA Core)

#### [NEW] `app/sw.ts`
- Uygulamanın offline çalışabilmesi ve kaynakları önbelleğe alabilmesi için gereken Serwist konfigürasyonlarını ve önbellek stratejilerini içeren ana Service Worker dosyası eklenecek.

#### [NEW] `app/manifest.ts`
- PWA olarak yüklendiğinde işletim sisteminin okuyacağı `manifest.json`'ı dinamik olarak Next.js içerisinden oluşturacağız.
- `name` (Quizyen), `short_name` (Quizyen), `description`, `start_url`, `display` ("standalone" - tarayıcı barları olmadan native uygulama gibi çalışması için) değerlerini ayarlayacağız.

---

### 4. İkonların Üretilmesi (Assets)

#### [NEW] `public/icons/` dizini
- `npx pwa-asset-generator` veya benzeri bir araç kullanarak mevcut ana uygulamanın logosundan PWA için zorunlu olan 192x192 ve 512x512, maskable ve iOS için apple-touch ikonlarını statik dosyalar olarak ekleyeceğiz.

---

### 5. Meta Etiketler (Meta Tags)

#### [MODIFY] [layout.tsx](file:///d:/repo/quizflow-landing/app/%5Blocale%5D/layout.tsx)
- `export const viewport` objesine `themeColor` özelliğini ekleyeceğiz.
- `export async function generateMetadata` içerisine PWA için gerekli `appleWebApp` ve `formatDetection` özelliklerini dahil edeceğiz. PWA'nın iOS'ta native gibi hissettirmesi için `capable: true` tanımlayacağız.

## Doğrulama Planı (Verification Plan)

### Otomatik/Teknik Doğrulama
1. **Lighthouse Testi:** Chrome DevTools içerisindeki Lighthouse aracı ile "PWA" sekmesinden tam puan alınıp alınmadığı test edilecek.
2. **Build Kontrolü:** `npm run build` komutu ile Serwist worker kısımlarının hatasız derlenip derlenmediği teyit edilecek.

### Manuel Doğrulama
1. **Kurulum Testi:** Masaüstü veya mobil Chrome'da uygulamanın adres çubuğunda "Yükle" (Install App) simgesinin çıkıp çıkmadığı kontrol edilecek.
2. **Offline Mod:** Tarayıcıda Network sekmesinden "Offline" seçilip, uygulamanın çökmeden daha önce ziyaret edilmiş sayfaları gösterebildiği test edilecek.
3. **Mobil Görünüm:** Ana ekrana eklenen uygulamanın tarayıcı UI bileşenleri olmadan native bir uygulama gibi açıldığı, doğru splash screen renkleri ve ikonları sunduğu görüntülenecek.
