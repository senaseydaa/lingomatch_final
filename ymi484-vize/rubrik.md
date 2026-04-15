# YMI 484 Vize — Değerlendirme Rubriği

Bu dosya senin için. Oku, anla, not al. Ajan bu dosyayı okumaz — puanını sen belirlersin, promptlarınla.

---

## Puanlama Özeti

| Alan | Ağırlık |
|------|---------|
| Teknik Taban | 30 puan |
| Kategori Kriterleri | 40 puan |
| Tasarım ve Deneyim | 20 puan |
| Süreç (Prompt Log) | 10 puan |
| **Toplam** | **100 puan** |
| Bonus: Kendi Skill Dosyası | +10 puan |

---

## 1. Teknik Taban (30 puan)

Bu maddeler her projede aranır, kategoriden bağımsız.

| Madde | Puan |
|-------|------|
| `index.html`, `css/style.css`, `js/main.js` ayrı dosyalar olarak var | 4 |
| CSS ve JS HTML içine gömülmemiş, dosyalardan bağlanıyor | 3 |
| Sayfa mobil ekranda kullanılabilir halde (responsive) | 4 |
| Türkçe karakterler doğru görünüyor | 2 |
| Konsolda JavaScript hatası yok (F12 → Console) | 3 |
| Tüm butonlar ve linkler çalışıyor — her biri bir yere götürüyor | 4 |
| İçerikte "lorem ipsum" veya placeholder metin yok | 3 |
| Proje tek sayfalık değil — birden fazla ekran/görünüm var | 4 |
| Temel erişilebilirlik sağlanmış (alt metin, kontrast, klavye erişimi) | 3 |

---

## 2. Kategori Kriterleri (40 puan)

Projenin kategorisine göre ilgili kriterler değerlendirilir. Her kategoride 5 kriter var. Her kriter üç katmanda puanlanır:

| Katman | Puan | Anlam |
|--------|------|-------|
| Temel | 4 | Çalışıyor, var |
| Yetkin | 6 | Düzgün çalışıyor, detaylar düşünülmüş |
| Üstün | 8 | Tasarım kararı var, deneyim bütünlüklü |

5 kriter x 8 puan = 40 puan

Kriter kodlarını `skills/web-deneyimi.md` dosyasında bulabilirsin:
- **web-oyunu:** WO-1 ... WO-6 (6 kriter — en iyi 5 tanesi sayılır)
- **interaktif-arac:** IA-1 ... IA-5
- **veri-deneyimi:** VD-1 ... VD-5
- **saas-arayuzu:** SA-1 ... SA-5
- **sosyal-ag:** SOS-1 ... SOS-5
- **medya-vitrin:** MV-1 ... MV-5
- **haber-platformu:** HP-1 ... HP-5
- **portfolio:** PF-1 ... PF-5

Her kriterin temel, yetkin ve üstün katmanları orada tanımlı. Oku. Hedefini yüksek tut.

---

## 3. Tasarım ve Deneyim (20 puan)

| Madde | Puan |
|-------|------|
| Tipografi — font seçimi karakterli, hiyerarşi net (başlık ≠ gövde) | 5 |
| Renk — tutarlı palet, CSS değişkenleri ile tanımlı | 5 |
| Animasyon — sayfa yüklenişi, geçişler, hover durumları anlamlı | 5 |
| Bütünlük — sayfa profesyonel bir ürün gibi hissettiriyor | 5 |

---

## 4. Süreç — Prompt Log (10 puan)

`ymi484-vize/log.md` dosyası değerlendirilir.

| Madde | Puan |
|-------|------|
| Log eksiksiz tutulmuş — her adım kayıtlı | 3 |
| En az 3 `refine` türünde giriş var — öğrenci yönlendirmiş | 3 |
| Promptlar spesifik ve gerekçeli ("rengi değiştir" değil, "üç farklı mavi var, birini seç") | 4 |

**Neden önemli:** Ajana "yap" demek kolay. Ajana **neyi, neden, nasıl** yapacağını tarif etmek — asıl beceri bu. Promptlarının kalitesi notunu doğrudan etkiler.

---

## 5. Bonus: Kendi Skill Dosyası (+10 puan)

Eğer `ymi484-vize/skills/` klasörüne kendi yazdığın bir `.md` skill dosyası ekler ve projende kullanırsan bonus puan alabilirsin.

**Geçerli sayılması için:**
- Dosyanın başında `isim` ve `açıklama` alanları olmalı (frontmatter)
- Skill'in projende görünür bir etkisi olmalı — sadece dosya koymuş olmak yetmez
- Log dosyasında skill'i ne zaman ve nasıl kullandığın görünmeli

| Madde | Puan |
|-------|------|
| Skill dosyası formatı doğru, amacı açık | 3 |
| Skill projede kullanılmış ve etkisi görünüyor | 4 |
| Skill yaratıcı veya alışılmadık bir problemi çözüyor | 3 |

**Örnek fikirler:**
- Erişilebilirlik kontrol skill'i (kontrast, font boyutu, ARIA)
- Performans optimizasyon skill'i
- Mikro-animasyon kütüphanesi oluşturan skill
- Karanlık mod ekleyen skill

---

## Teslim Hatırlatması

```
[ ] ZIP: [isim]-[öğrencino].zip formatında
[ ] ZIP içinde ymi484-vize/log.md dosyası var
[ ] STIX'e yüklendi
```
