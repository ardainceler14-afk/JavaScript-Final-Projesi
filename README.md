# JavaScript Final Projesi

Bu proje, isimden ülke analizi yapmak için geliştirilmiş basit bir web uygulamasıdır. JavaScript kullanılarak API’den veri çekilmekte ve kullanıcıya gösterilmektedir.

## Proje Açıklaması
Bu uygulama, modern JavaScript tekniklerini kullanarak bir API üzerinden veri çekmek, bu veriyi işlemek ve kullanıcı dostu bir arayüzle sunmak amacıyla geliştirilmiştir.

## Kullanılan API Bilgileri
* **API Adı:** Nationalize
* **API Endpoint Örneği:** `https://api.nationalize.io/?name=arda`

## Uygulama Nasıl Çalışıyor?
1. Kullanıcıdan gerekli bilgi (isim) alınır.
2. Girilen bilgi API endpoint’ine gönderilir.
3. API’den gelen JSON verisi işlenir.
4. Sonuçlar ekranda kullanıcıya gösterilir.

---

## Kullanılan JavaScript Konuları

### API Kullanımı (Fetch)
* **Nationalize API’den veri çekme:** `fetch` fonksiyonu kullanılarak uzak sunucudan veri alma işlemi gerçekleştirilmiştir.

### Asenkron Programlama
* **Hata Yönetimi:** `async / await` yapısı ile kodun sıralı çalışması sağlanmış ve `try / catch` blokları ile olası ağ hataları yönetilmiştir.

### DOM Manipülasyonu
* **Sayfa Güncelleme:** `getElementById`, `createElement`, `innerHTML` ve `style` özellikleri kullanılarak HTML içeriği dinamik olarak değiştirilmiştir.

### Event Handling (Olay Yönetimi)
* **Etkileşim:** Kullanıcı tıklamaları ve sayfa yüklenmesi gibi durumlar için `addEventListener` (`click`, `change`, `load`) kullanılmıştır.

### Array Metotları
* **Veri İşleme:** API'den gelen listeleri yönetmek için `map`, `filter`, `sort`, `slice` ve `forEach` metotlarından yararlanılmıştır.

### LocalStorage Kullanımı
* **Kalıcı Veri:** Favori ülkeleri ve tema (gece/gündüz modu) bilgisini tarayıcı hafızasında saklayarak sayfa yenilense bile verilerin korunması sağlanmıştır.

### Koşul Yapıları
* **Kontrol Mekanizmaları:** Uygulama içindeki mantıksal kararlar `if / else` yapıları ile kurulmuştur.

### Fonksiyonlar
* **Modüler Yapı:** Kodun tekrar kullanılabilirliğini artırmak için fonksiyonel bir yapı tercih edilmiştir.

### Template String / String Birleştirme
* **Dinamik İçerik:** HTML şablonları oluşturulurken modern backtick (`` ` ``) kullanımı ile değişkenler içeriğe dahil edilmiştir.

---