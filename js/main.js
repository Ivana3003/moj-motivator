// 1. PODACI
let poruke = [
  "Izgleda nemoguće, dokle god se ne završi.",
  "Ništa nije nemoguće za onoga ko ima volju pokušati.",
  "Tajna uspeha u životu nije da čovek radi ono što voli, već da voli ono što radi.",
  "Početna tačka svakog uspeha je želja.",
];

const MAX_DUZINA_PORUKE = 150;

// 2. SELEKTORI
const prikazPoruke = document.getElementById("poruka");
const dugmeGenerisi = document.getElementById("generate-btn");
const unosNovePoruke = document.getElementById("nova-poruka");
const dugmeDodaj = document.getElementById("add-btn");
const dugmeTema = document.getElementById("theme-toggle");
const toast = document.getElementById("toast");

// 3. TOAST NOTIFIKACIJA
let toastTimeout;
const prikaziToast = (poruka) => {
  toast.textContent = poruka;
  toast.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
};

// 4. FUNKCIJA ZA TEMU
const postaviTemu = (tema) => {
  document.documentElement.setAttribute("data-theme", tema);

  // Pamćenje u memoriji
  try {
    localStorage.setItem("izabrana-tema", tema);
  } catch {
    // localStorage nije dostupan (privatni mod)
  }

  // REŠENJE ZA IKONU: Ubacujemo potpuno novi HTML unutar dugmeta
  // Na ovaj način Lucide uvek vidi novi "i" tag i ispravno ga crta
  const novaIkona = tema === "dark" ? "sun" : "moon";
  dugmeTema.innerHTML = `<i data-lucide="${novaIkona}"></i>`;

  // Osvežavanje ikona
  if (window.lucide) {
    lucide.createIcons();
  }
};

// 5. LOGIKA ZA PORUKE
const prikaziNasumicnuPoruku = () => {
  const index = Math.floor(Math.random() * poruke.length);
  prikazPoruke.innerText = poruke[index];
};

const dodajNovuPoruku = () => {
  let tekst = unosNovePoruke.value.trim();

  if (tekst === "") {
    prikaziToast("Polje ne sme biti prazno!");
    return;
  }

  if (tekst.length > MAX_DUZINA_PORUKE) {
    prikaziToast(`Poruka ne sme biti duža od ${MAX_DUZINA_PORUKE} karaktera.`);
    return;
  }

  tekst = tekst.charAt(0).toUpperCase() + tekst.slice(1);

  if (poruke.includes(tekst)) {
    prikaziToast("Ova poruka već postoji!");
    return;
  }

  poruke.push(tekst);
  unosNovePoruke.value = "";
  prikazPoruke.innerText = tekst;
  prikaziToast("Poruka uspešno dodata!");
};

// 6. EVENT LISTENERS
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

// 7. INICIJALIZACIJA (Pokretanje pri učitavanju)
document.addEventListener("DOMContentLoaded", () => {
  let sacuvanaTema = "light";
  try {
    sacuvanaTema = localStorage.getItem("izabrana-tema") || "light";
  } catch {
    // localStorage nije dostupan
  }
  postaviTemu(sacuvanaTema);
});
