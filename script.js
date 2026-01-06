// Arama yapınca gelen verileri burada saklıyorum ki sonra sıralama/filtreleme yapabileyim
var tumVeriler = [];
// Favoriye eklediğimiz ülkeleri tarayıcı hafızasında (localStorage) tutuyoruz
var favoriler = JSON.parse(localStorage.getItem("benimFavorilerim")) || [];
// Sayfada ilk başta kaç tane kart görüneceğini belirliyorum
var gosterilenAdet = 3; 

// Bu araç, API'den gelen 'TR' gibi kısaltmaları 'Türkiye' gibi tam isme çeviriyor
var ulkeCevirici = new Intl.DisplayNames(['tr'], { type: 'region' });

// Sayfa ilk açıldığında çalışacak ayarlar
window.onload = function() {
    // Eğer daha önce karanlık modu seçtiysek onu tekrar aktif yap
    if (localStorage.getItem("tema") === "dark") {
        document.body.classList.add("karanlik-tema");
    }
    sayaclariGuncelle();
};

// 1. Fonksiyon: API'den bilgileri getiren kısım
async function verileriCek() {
    var isim = document.getElementById("isimGiris").value.trim();
    
    // Kutu boşsa uyarı verip duruyoruz
    if (isim === "") {
        alert("Lütfen bir isim giriniz!");
        return;
    }

    // Bilgiler gelirken ekranda yükleme animasyonu ve mesajları gösteriyoruz
    document.getElementById("yukleniyorMetni").style.display = "block";
    document.getElementById("skeletonlar").style.display = "block";
    document.getElementById("listeKapsayici").innerHTML = "";

    try {
        // Nationalize sitesine bağlanıp ismi sorguluyoruz
        var cevap = await fetch("https://api.nationalize.io/?name=" + isim);
        var veri = await cevap.json();
        
        // Veri gelince yükleme mesajlarını kapatıyoruz
        document.getElementById("yukleniyorMetni").style.display = "none";
        document.getElementById("skeletonlar").style.display = "none";

        // Eğer sonuç varsa listeyi güncelleyen fonksiyonu çağırıyoruz
        if (veri.country && veri.country.length > 0) {
            tumVeriler = veri.country;
            gosterilenAdet = 3; // Yeni aramada sayı başa dönsün
            listeGuncellemeMerkezi();
        } else {
            document.getElementById("listeKapsayici").innerHTML = "Maalesef sonuç bulunamadı.";
        }
    } catch (hata) {
        // İnternet kopması gibi bir sorun olursa burası çalışacak
        document.getElementById("hataMesaj").style.display = "block";
    }
}

// Filtreleme ve sıralama ayarlarını kontrol eden merkez fonksiyon
function listeGuncellemeMerkezi() {
    var kopya = [...tumVeriler];

    // Olasılığı %10'dan büyük olanları süzüyoruz
    var filtre = document.getElementById("filtreleme").value;
    if (filtre === "yuksek") {
        kopya = kopya.filter(function(x) { return x.probability > 0.10; });
    }

    // Ülke isimlerine göre A'dan Z'ye ya da tersine sıralama yapıyoruz
    var sira = document.getElementById("siralama").value;
    if (sira === "az") {
        kopya.sort((a, b) => getUlkeAdi(a.country_id).localeCompare(getUlkeAdi(b.country_id)));
    } else if (sira === "za") {
        kopya.sort((a, b) => getUlkeAdi(b.country_id).localeCompare(getUlkeAdi(a.country_id)));
    }

    // Sayfalamayı (slice) burada yapıp kartları ekrana basıyoruz
    var parca = kopya.slice(0, gosterilenAdet);
    kartlariEkranaBas(parca);

    // Daha fazla veri varsa 'Daha Fazla Yükle' butonunu gösteriyoruz
    document.getElementById("dahaFazlaBtn").style.display = kopya.length > gosterilenAdet ? "inline-block" : "none";
    
    // Sayaçları (toplam, gösterilen vs.) güncelliyoruz
    document.getElementById("sayacToplam").innerText = tumVeriler.length;
    document.getElementById("sayacGosterilen").innerText = parca.length;
    document.getElementById("istatistikAlani").style.display = "block";
}

// 2. Fonksiyon: Kartları HTML içine tekli yerleştiren kısım
function kartlariEkranaBas(veriler) {
    var liste = document.getElementById("listeKapsayici");
    liste.innerHTML = "";

    veriler.forEach(function(oge) {
        var oran = (oge.probability * 100).toFixed(1);
        // Eğer bu ülke favorilerimizdeyse yıldızı dolu gösterir
        var yildiz = favoriler.includes(oge.country_id) ? "★" : "☆";
        var tamIsim = getUlkeAdi(oge.country_id);

        var div = document.createElement("div");
        div.className = "kart";
        div.innerHTML = "<h3>" + tamIsim + "</h3>" +
                        "<p>Tahmin: %" + oran + "</p>" +
                        "<button onclick='favYap(\"" + oge.country_id + "\")'>" + yildiz + " Favori</button> " +
                        "<button onclick='detayAc(\"" + oge.country_id + "\", " + oran + ")'>Detay</button>";
        liste.appendChild(div);
    });
}

// Favoriye eklemek ve çıkartma işlemleri
function favYap(id) {
    if (favoriler.includes(id)) {
        favoriler = favoriler.filter(f => f !== id);
    } else {
        favoriler.push(id);
    }
    localStorage.setItem("benimFavorilerim", JSON.stringify(favoriler));
    sayaclariGuncelle();
    listeGuncellemeMerkezi();
}

function sayaclariGuncelle() {
    document.getElementById("sayacFavori").innerText = favoriler.length;
}

// 3. Fonksiyon: Bir karta tıklayınca detay panelini açan kısım
function detayAc(kod, yuzde) {
    var tamIsim = getUlkeAdi(kod);
    document.getElementById("detayPanel").style.display = "block";
    document.getElementById("detayBaslik").innerText = "ANALİZ: " + tamIsim;
    document.getElementById("bilgi1").innerText = "Ülke Tam Adı: " + tamIsim;
    document.getElementById("bilgi2").innerText = "Sistem bu ismin %" + yuzde + " ihtimalle bu ülkeden olduğunu düşünüyor.";
}

// Butonlara tıklanınca ne olacağını yazıyoruz
document.getElementById("araButon").addEventListener("click", verileriCek);

document.getElementById("dahaFazlaBtn").addEventListener("click", function() {
    gosterilenAdet += 3; // Her basışta 3 kart daha ekle
    listeGuncellemeMerkezi();
});

// Tema değiştirme butonu
document.getElementById("temaDegistir").addEventListener("click", function() {
    document.body.classList.toggle("karanlik-tema");
    var suankiTema = document.body.classList.contains("karanlik-tema") ? "dark" : "light";
    localStorage.setItem("tema", suankiTema);
});

// Detay panelini kapatma butonu
document.getElementById("kapatBtn").addEventListener("click", function() {
    document.getElementById("detayPanel").style.display = "none";
});

// Seçenekler değişince listeyi otomatik yeniler
document.getElementById("filtreleme").addEventListener("change", listeGuncellemeMerkezi);
document.getElementById("siralama").addEventListener("change", listeGuncellemeMerkezi);

// Ülke kodunu isme çeviren yardımcı fonksiyon
function getUlkeAdi(kod) {
    try { return ulkeCevirici.of(kod); } catch (e) { return kod; }
}