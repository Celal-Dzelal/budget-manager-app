/* -------------------------------------------------------------------------- */
//!                                 WALLET APP                                 */
/* -------------------------------------------------------------------------- */

// localStorage için 4 tane method var. getItem, setItem,removeItem,clear

//! -------------------------- Ekle Formu işlemleri -------------------------- */
const gelirInput = document.querySelector("#gelirInput");
const ekle = document.querySelector("#ekle");
const ekleFormu = document.querySelector("#ekleFormu");
const gelirGoster = document.querySelector("#gelirGoster");
let gelirler = JSON.parse(localStorage.getItem("gelirim")) || 0;
console.log(gelirler);

ekleFormu.addEventListener("submit", (e) => {
  e.preventDefault();
  gelirler = gelirler + Number(gelirInput.value);
 
  localStorage.setItem("gelirim", gelirler);
});

//! -------------------------- Harca Formu İşlemleri ------------------------- */
const tarih = document.querySelector("#tarih");
const miktar = document.querySelector("#miktar");
const harcamaAlani = document.querySelector("#harcamaAlani");
const harcamaFormu = document.querySelector("#harcama-formu");
const harcamaTablosu = document.querySelector("#harcamaTablosu");
/* -------------------------------------------------------------------------- */
// localstoragedan verilen parse edilerek çekilmesi. Bu işlem localstoragedan gelen veri string olduğu için yapılmaktadır
let harcamaListesi = JSON.parse(localStorage.getItem("harcamam")) || [];
/* -------------------------------------------------------------------------- */
harcamaFormu.addEventListener("submit", (e) => {
  e.preventDefault();
  const yeniHarcama = {
    tarih: tarih.value,
    miktar: Number(miktar.value),
    aciklama: harcamaAlani.value,
    id: new Date().getTime(),
  };
  harcamaListesi.push(yeniHarcama);
  localStorage.setItem("harcamam", JSON.stringify(harcamaListesi));
  harcamalariTablodaGoster(yeniHarcama)
//   hesaplaGoster()
});

harcamaListesi.forEach((harcama) => {
    harcamalariTablodaGoster(harcama)
    
});

//! --------------------- Tabloya verilerin Bastırılması --------------------- */

function harcamalariTablodaGoster({id,miktar,tarih,aciklama}) {

  harcamaTablosu.innerHTML += `
            <tr>
              <th scope="row">${aciklama}</th>
              <td>${miktar}</td>
              <td>${tarih}</td>
              <td> <i  class="fa-solid fa-trash-can text-danger ms-4 " style="cursor:pointer" id=${id} > </td>
            </tr>
    `;

    /!* ------------------------------ Silme işlemi ------------------------------ */
    document.querySelectorAll(".fa-trash-can").forEach((item)=>{
        item.onclick=()=>{
            console.log(item.id)
            item.parentElement.parentElement.remove()
            harcamaListesi=harcamaListesi.filter((eleman)=>eleman.id != item.id)
            localStorage.setItem("harcamam", JSON.stringify(harcamaListesi));
        }
    })
    // hesaplaGoster()
}

// //! ------------------- Hesaplama Tablosunun Oluşturulması ------------------- */
const harcamaGoster=document.querySelector("#harcamaGoster")
const kalanGoster=document.querySelector("#kalanGoster")
const ctx = document.getElementById('myChart');
let grafik;


function hesaplaGoster(){
    const harcamaToplami=harcamaListesi.reduce((toplam,item)=>toplam + item.miktar,0)
   const gelir=JSON.parse(localStorage.getItem("gelirim"))
   gelirGoster.textContent = gelir
   harcamaGoster.textContent=harcamaToplami
   kalanGoster.textContent=gelir-harcamaToplami

   if (grafik){
    grafik.destroy()
   }

   grafik=new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Income', 'Expense', 'Your Money'],
      datasets: [{
        data: [gelir,harcamaToplami,gelir-harcamaToplami],
        borderWidth: 1
      }]
    },
  });
}

hesaplaGoster()

//! --------------------------------- TEMİZLE -------------------------------- */
const temizle=document.querySelector("#temizle")

temizle.addEventListener("click",()=>{
    gelirInput.value=""
    harcamaListesi=[]
    gelirim=0
    harcamaTablosu.innerHTML=""
    hesaplaGoster()
    localStorage.removeItem("harcamam")
    localStorage.removeItem("gelirim")
})