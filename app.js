/* -------------------------------------------------------------------------- */
//!                                 WALLET APP                                 */
/* -------------------------------------------------------------------------- */

// localStorage için 4 tane method var. getItem, setItem,removeItem,clear

//? -------------------------- Ekle Formu işlemleri -------------------------- */
const gelirInput = document.querySelector("#gelirInput");
const ekle = document.querySelector("#ekle");
const ekleFormu = document.querySelector("#ekleFormu");
const gelirGoster = document.querySelector("#gelirGoster");
let gelirler = JSON.parse(localStorage.getItem("gelirim")) || 0;
//! localStorage içinde gelirim anahtarıyla saklanan veriyi alır ve JSON formatında çözümler. Eğer localStorage'da bir veri yoksa (null dönerse), gelirler değişkenini 0 olarak başlatır.
console.log(gelirler);

ekleFormu.addEventListener("submit", (e) => {
  //! ekleFormu değişkenine bir olay dinleyici ekler. Kullanıcı formu gönderdiğinde bu fonksiyon çalışır.
  e.preventDefault(); //! Formun varsayılan gönderme davranışını engeller. Bu, sayfanın yenilenmesini önler.
  gelirler = gelirler + Number(gelirInput.value); //! Kullanıcı tarafından girilen gelirInput değerini alır, Number ile sayıya çevirir ve mevcut gelirler değerine ekler.
  localStorage.setItem("gelirim", gelirler); //! Güncellenmiş gelirler değerini localStorage'a gelirim anahtarıyla kaydeder. Böylece veri, sayfa yenilense bile saklanır.
});

//? -------------------------- Harca Formu İşlemleri ------------------------- */
const tarih = document.querySelector("#tarih");
const miktar = document.querySelector("#miktar");
const harcamaAlani = document.querySelector("#harcamaAlani");
const harcamaFormu = document.querySelector("#harcama-formu");
const harcamaTablosu = document.querySelector("#harcamaTablosu");
/* -------------------------------------------------------------------------- */
// localstoragedan verilen parse edilerek çekilmesi. Bu işlem localstoragedan gelen veri string olduğu için yapılmaktadır
let harcamaListesi = JSON.parse(localStorage.getItem("harcamam")) || [];
//! localStorage'daki harcamam anahtarıyla saklanan veriyi alır ve JSON formatında çözümler. Eğer localStorage'da veri yoksa (örneğin ilk kullanımda), harcamaListesi boş bir dizi ([]) olarak başlatılır.
/* -------------------------------------------------------------------------- */
harcamaFormu.addEventListener("submit", (e) => {
  //! harcamaFormu için bir submit olay dinleyici ekler. Kullanıcı formu gönderdiğinde bu fonksiyon çalışır.
  e.preventDefault(); //! Formun varsayılan gönderme davranışını engeller. Bu, sayfanın yenilenmesini önler.
  const yeniHarcama = {
    //! Yeni bir harcama nesnesi oluşturur ve formdan alınan verilerle doldurur
    tarih: tarih.value,
    miktar: Number(miktar.value),
    aciklama: harcamaAlani.value,
    id: new Date().getTime(), //! id: Harcamayı benzersiz bir şekilde tanımlamak için new Date().getTime() ile bir zaman damgası oluşturulur.
  };
  harcamaListesi.push(yeniHarcama);
  localStorage.setItem("harcamam", JSON.stringify(harcamaListesi));
  //! Güncellenmiş harcamaListesi dizisini JSON formatına dönüştürerek localStorage'a kaydeder.
  harcamalariTablodaGoster(yeniHarcama); //! Yeni eklenen harcamayı tabloya göstermek için bir fonksiyon çağırır.
  //   hesaplaGoster()
});

harcamaListesi.forEach((harcama) => {
  //!harcamaListesi dizisindeki her bir harcamayı döngüyle işler
  harcamalariTablodaGoster(harcama); //! Döngü sırasında her bir harcamayı tabloya göstermek için harcamalariTablodaGoster fonksiyonunu çağırır.
});

//? --------------------- Tabloya verilerin Bastırılması --------------------- */

function harcamalariTablodaGoster({ id, miktar, tarih, aciklama }) {
  //! Bir harcama nesnesi alır ve bu nesnenin özelliklerini destructuring yöntemiyle ayrıştırır:
  harcamaTablosu.innerHTML += ` //! harcamaTablosu (önceki kodda tanımlanmış bir tablo elemanı) değişkenine yeni bir satır eklemek için innerHTML kullanılır. operatörü mevcut tablo içeriğine ekleme yapar, önceki veriler silinmez.
            <tr> //! Yeni bir tablo satırı oluşturur.
              <th scope="row">${aciklama}</th> //! Harcamanın açıklamasını (aciklama) tablo satırının ilk hücresine ekler. scope="row", bu hücrenin tablo satırını temsil ettiğini belirtir.
              <td>${miktar}</td> //!  Harcamanın miktarını (miktar) ikinci hücreye ekler.
              <td>${tarih}</td> //! Harcamanın tarihini (tarih) üçüncü hücreye ekler.
              <td> <i  class="fa-solid fa-trash-can text-danger ms-4 " style="cursor:pointer" id=${id} > </td>
            </tr>
    `;

  //? ------------------------------ Silme işlemi ------------------------- */;

  document.querySelectorAll(".fa-trash-can").forEach((item) => {
    //! HTML'deki class değeri .fa-trash-can olan tüm öğeleri seçer (çöp kutusu ikonları). Seçilen her bir çöp kutusu simgesi için bir işlem gerçekleştirir. item her bir simgeyi temsil eder.
    item.onclick = () => {
      //! Her çöp kutusu simgesine bir onclick olay dinleyicisi atanır. Simgeye tıklandığında, tanımlanan işlem gerçekleştirilir.
      console.log(item.id);
      //! Tıklanan simgenin id değerini konsola yazdırır. Bu, hangi harcamanın silineceğini anlamak için kullanılır.
      item.parentElement.parentElement.remove();
      //! Tıklanan çöp kutusu simgesinin bulunduğu hücreye (<td> öğesi) erişir. Bir üst düzeye çıkarak, çöp kutusunun bulunduğu satıra (<tr> öğesi) erişir.
      harcamaListesi = harcamaListesi.filter((eleman) => eleman.id != item.id); //! harcamaListesi dizisini filtreler ve yalnızca id değeri tıklanan simgenin id değerine eşit olmayan öğeleri içeren yeni bir dizi oluşturur. Tıklanan harcamanın id değeriyle eşleşen eleman diziden çıkarılır.
      localStorage.setItem("harcamam", JSON.stringify(harcamaListesi));
      //! Güncellenmiş harcamaListesi dizisi JSON formatına dönüştürülür ve localStorage'a harcamam anahtarıyla kaydedilir. Böylece sayfa yenilense bile değişiklikler korunur.
    };
  });
  // hesaplaGoster()
}

//? ------------------- Hesaplama Tablosunun Oluşturulması ------------------ */

const harcamaGoster = document.querySelector("#harcamaGoster");
const kalanGoster = document.querySelector("#kalanGoster");
const ctx = document.getElementById("myChart");
let grafik;

function hesaplaGoster() {
  const harcamaToplami = harcamaListesi.reduce(
    //!Harcamalar listesindeki her bir öğenin miktar değerlerini toplar. 0: Başlangıç değeri.
    (toplam, item) => toplam + item.miktar,
    0
  );
  const gelir = JSON.parse(localStorage.getItem("gelirim")); //! localStorage'dan gelirim anahtarıyla saklanan gelir bilgisi alınır ve JSON formatında çözülür.
  gelirGoster.textContent = gelir; //!  öğesinin metin içeriğini toplam gelirle günceller.
  harcamaGoster.textContent = harcamaToplami; //! harcamaGoster öğesinin metin içeriğini toplam harcama ile günceller.
  kalanGoster.textContent = gelir - harcamaToplami; //! kalanGoster öğesinin metin içeriğini kalan tutar ile günceller.

  if (grafik) {
    grafik.destroy();
  }

  grafik = new Chart(ctx, {
    //! Yeni bir Chart nesnesi oluşturur
    type: "doughnut",
    data: {
      labels: ["Income", "Expense", "Your Money"], //! labels: Dilimlerin açıklamalarını tanımlar (gelir, harcama, kalan tutar).
      datasets: [
        {
          data: [gelir, harcamaToplami, gelir - harcamaToplami],
          borderWidth: 1, //! datasets: data: Grafikte gösterilecek veriler. Gelir, harcama ve kalan tutarı sırasıyla içerir. borderWidth: 1: Pasta dilimlerinin kenar kalınlığını tanımlar.
        },
      ],
    },
  });
}

hesaplaGoster(); //! Sayfa yüklendiğinde hesaplaGoster fonksiyonunu çalıştırır ve gelir/harcama bilgilerini ekranda gösterir.

//? --------------------------------- TEMİZLE ------------------------------- */

const temizle = document.querySelector("#temizle");

temizle.addEventListener("click", () => {
  //! "Temizle" butonuna tıklandığında çalışacak bir olay dinleyicisi tanımlanır.
  gelirInput.value = ""; //! Gelir giriş alanındaki (#gelirInput) değeri boş bir stringle sıfırlar. Kullanıcı formda yeni bir gelir girebilir.
  harcamaListesi = []; //! harcamaListesi değişkenini boş bir diziye atayarak, tüm harcamaları sıfırlar.
  gelirim = 0; //! Geliri temsil eden değişkeni sıfırlar.
  harcamaTablosu.innerHTML = ""; //! Harcamaların gösterildiği tabloyu tamamen temizler.
  hesaplaGoster(); //! Tüm gelir ve harcama değerleri sıfır olduğu için ekranda her şey sıfırlanır.
  localStorage.removeItem("harcamam"); //! localStorage'dan "harcamam" anahtarıyla saklanan harcama verilerini siler.
  localStorage.removeItem("gelirim"); //! localStorage'dan "gelirim" anahtarıyla saklanan gelir verilerini siler.,
});
