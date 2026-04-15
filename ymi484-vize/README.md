# YMI 484 — Vize Teslimi

Bu klasör, vize projesini teslim etmek için ihtiyacın olan her şeyi içeriyor.

Her adım, ne yapman gerektiğini tam olarak anlatıyor.

---

## Bu Klasörde Ne Var?

```
ymi484-vize/
├── README.md                  ← şu an okuduğun dosya
├── rubrik.md                  ← puanlama kriterleri — mutlaka oku
├── skills/
│   └── web-deneyimi.md        ← yapay zeka ajanının okuyacağı talimatlar
└── log.md          ← ajan buraya otomatik yazacak
```

---

## Başlamadan Önce: Kurulum

### Adım 1 — Masaüstünde bir klasör oluştur

Masaüstünde yeni bir klasör oluştur. Klasörün adını şu formatta yaz:

```
isim-öğrencino
```

Örnek: `semih-20484001`

> Küçük harf, Türkçe karakter yok, boşluk yerine tire.

> **Mac:** Masaüstüne sağ tıkla → "Yeni Klasör" → adını yaz → Enter.
>
> **Windows:** Masaüstüne sağ tıkla → "Yeni" → "Klasör" → adını yaz → Enter.

---

### Adım 2 — ZIP dosyasını o klasörün içine çıkar

İndirdiğin `ymi484-vize.zip` dosyasını az önce oluşturduğun klasörün içine taşı, sonra çıkar.

> **Mac:** ZIP dosyasına çift tıkla. Otomatik olarak aynı konuma çıkar.
>
> **Windows:** ZIP dosyasına sağ tıkla → "Tümünü Çıkar" → "Çıkar".

Bitince klasörün içi şöyle görünmeli:

```
semih-20484001/
└── ymi484-vize/
    ├── README.md
    ├── rubrik.md
    ├── skills/
    └── log.md
```

---

### Adım 3 — Rubriği oku

Projeye başlamadan önce `ymi484-vize/rubrik.md` dosyasını aç ve oku. Puanlamanın nasıl yapıldığını, neyin kaç puan ettiğini, promptlarının neden önemli olduğunu orada bulacaksın.

---

### Adım 4 — Antigravity'de klasörü aç

Antigravity'yi aç. Üst menüden **File → Open Folder** seçeneğine tıkla. `ymi484-vize` klasörünü değil, onun bir üstündeki kendi klasörünü seç (örn. `semih-20484001`).

Sol panelde `ymi484-vize/` klasörünü görüyorsan doğru yere geldin.

---

## Projeye Başlama

### Adım 5 — Ajana başlamasını söyle

Antigravity'de sohbet alanına şunu yaz:

```
ymi484-vize/skills/web-deneyimi.md dosyasını oku ve başla.
```

Ajan dosyayı okuyacak, sana birkaç soru soracak. Türkçe cevap ver.

Sorularını cevapladıkça ajan dosyaları üretmeye başlayacak. Sol panelde yeni dosyaların oluştuğunu göreceksin:

```
semih-20484001/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
└── ymi484-vize/
    ├── rubrik.md
    ├── skills/
    └── log.md   ← ajan her adımda bunu güncelliyor
```

---

### Adım 6 — Çıktını tarayıcıda aç

Sol panelde `index.html` dosyasına sağ tıkla → "Finder'da Göster" (Mac) veya "Dosya Gezgini'nde Göster" (Windows). Açılan pencerede `index.html` dosyasına çift tıkla. Tarayıcıda açılacak.

---

### Adım 7 — Refine et

Bir şeyleri değiştirmek istiyorsan ajana söyle. Ne istediğini olabildiğince net ve gerekçeli tarif et. Örnekler:

> `Renk paleti tutarsız görünüyor — şu an üç farklı mavi tonu var, birini seç ve diğerlerini ona göre ayarla.`

> `Kullanıcı bir sonraki adıma geçmek istediğinde ne yapacağını anlamıyor, yönlendirmeyi netleştir.`

> `Animasyon mantıklı ama zamanlama bozuk — ilk eleman kaybolmadan ikincisi başlıyor.`

> `Tipografi hiyerarşisi yok, başlık ile gövde metni aynı ağırlıkta görünüyor.`

**Dikkat:** Promptlarının kalitesi puanını etkiler. "Güzel yap" yerine "neyi neden değiştirmek istediğini" yaz. Detaylar için `rubrik.md` dosyasına bak.

---

### Adım 8 — Bonus: Kendi skill dosyanı ekle (opsiyonel, +10 puan)

`ymi484-vize/skills/` klasörüne kendi yazdığın bir `.md` skill dosyası ekleyebilirsin. Ajan bu dosyayı okuduğunda projene ekstra bir yetenek kazandırmalı.

Detaylar ve örnek fikirler `rubrik.md` dosyasında.

Skill'i yazdıktan sonra ajana şunu söyle:

```
ymi484-vize/skills/[dosya-adın].md dosyasını oku ve uygula.
```

---

## Teslim

### Adım 9 — ZIP oluştur

Klasörünün tamamını sıkıştır.

> **Mac:** Klasörüne sağ tıkla → `"[klasör-adı]" dosyasını sıkıştır`.
>
> **Windows:** Klasörüne sağ tıkla → "ZIP dosyasına sıkıştır".

ZIP dosyasının adı klasörünle aynı olmalı:

```
semih-20484001.zip
```

---

### Adım 10 — STIX'e yükle

STIX'e giriş yap. İlgili ödeve gir. ZIP dosyasını yükle.

---

## Teslim Kontrol Listesi

```
[ ] Klasör adı doğru formatta: isim-öğrencino
[ ] ZIP adı klasörle aynı: isim-öğrencino.zip
[ ] ZIP içinde ymi484-vize/log.md dosyası var
[ ] STIX'e ZIP yüklendi
```

---

## Takılırsan

1. Hata mesajını oku — çoğu zaman sebebi orada yazıyor
2. Hata mesajını kopyalayıp ajana yapıştır: `Bu hatayı aldım, ne yapmalıyım?`
3. Hâlâ çözülmediyse derste sor

---

*YMI 484 — Üretken Yapay Zeka ve Arayüz Tasarımı*
