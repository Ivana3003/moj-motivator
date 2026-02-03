// 1. PODACI
let poruke = [
  "Izgleda nemoguće, dokle god se ne završi.",
  "Ništa nije nemoguće za onoga ko ima volju pokušati.",
  "Tajna uspeha u životu nije da čovek radi ono što voli, već da voli ono što radi.",
  "Početna tačka svakog uspeha je želja.",
];

// 2. SELEKTORI
const prikazPoruke = document.getElementById("poruka");
const dugmeGenerisi = document.getElementById("generate-btn");
const unosNovePoruke = document.getElementById("nova-poruka");
const dugmeDodaj = document.getElementById("add-btn");
const dugmeTema = document.getElementById("theme-toggle");

// 3. FUNKCIJA ZA TEMU
const postaviTemu = (tema) => {
  document.documentElement.setAttribute("data-theme", tema);
  if (tema === "dark") {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }

  // Pamćenje u memoriji
  localStorage.setItem("izabrana-tema", tema);

  // REŠENJE ZA IKONU: Ubacujemo potpuno novi HTML unutar dugmeta
  // Na ovaj način Lucide uvek vidi novi "i" tag i ispravno ga crta
  const novaIkona = tema === "dark" ? "sun" : "moon";
  dugmeTema.innerHTML = `<i data-lucide="${novaIkona}"></i>`;

  // Osvežavanje ikona
  if (window.lucide) {
    lucide.createIcons();
  }
};

// 4. LOGIKA ZA PORUKE
const prikaziNasumicnuPoruku = () => {
  const index = Math.floor(Math.random() * poruke.length);
  prikazPoruke.innerText = poruke[index];
};

const dodajNovuPoruku = () => {
  let tekst = unosNovePoruke.value.trim();
  if (tekst !== "") {
    tekst = tekst.charAt(0).toUpperCase() + tekst.slice(1);
    poruke.push(tekst);
    unosNovePoruke.value = "";
    prikazPoruke.innerText = tekst;
    alert("Poruka uspešno dodata!");
  } else {
    alert("Polje ne sme biti prazno!");
  }
};

// 5. EVENT LISTENERS
dugmeGenerisi.addEventListener("click", prikaziNasumicnuPoruku);
dugmeDodaj.addEventListener("click", dodajNovuPoruku);

unosNovePoruke.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    dodajNovuPoruku();
  }
});

dugmeTema.addEventListener("click", () => {
  const trenutnaTema = document.documentElement.getAttribute("data-theme");
  const novaTema = trenutnaTema === "dark" ? "light" : "dark";
  postaviTemu(novaTema);
});

// 6. INICIJALIZACIJA (Pokretanje pri učitavanju)
document.addEventListener("DOMContentLoaded", () => {
  const sacuvanaTema = localStorage.getItem("izabrana-tema") || "light";
  postaviTemu(sacuvanaTema);
});
