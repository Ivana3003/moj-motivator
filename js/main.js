// 1. PODACI
let poruke = [
  "Izgleda nemoguće, dokle god se ne završi.",
  "Ništa nije nemoguće za onoga ko ima volju pokušati.",
  "Tajna uspeha u životu nije da čovek radi ono što voli, već da voli ono što radi.",
  "Početna tačka svakog uspeha je želja.",
];

const podrazumevanePoruke = [...poruke];
let korisnickePoruke = [];
let indeksPorukeZaIzmenu = null;

const MAX_DUZINA_PORUKE = 150;
const USER_MESSAGES_KEY = "moj-motivator-user-messages";

// 2. SELEKTORI
const prikazPoruke = document.getElementById("poruka");
const dugmeGenerisi = document.getElementById("generate-btn");
const unosNovePoruke = document.getElementById("nova-poruka");
const dugmeDodaj = document.getElementById("add-btn");
const dugmeTema = document.getElementById("theme-toggle");
const toast = document.getElementById("toast");
const listaKorisnickihPoruka = document.getElementById("user-messages-list");
const praznaListaPoruka = document.getElementById("user-messages-empty");
const dnevniFokusForma = document.getElementById("daily-focus-form");
const unosDnevnogFokusa = document.getElementById("daily-focus-input");
const statusDnevnogFokusa = document.getElementById("daily-focus-status");
const tekstDnevnogFokusa = document.getElementById("daily-focus-text");
const fokusZavrsen = document.getElementById("daily-focus-complete");

const DAILY_FOCUS_KEY = "moj-motivator-daily-focus";
const MAX_DUZINA_FOKUSA = 120;

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
  korisnickePoruke.push(tekst);
  sacuvajKorisnickePoruke();
  prikaziKorisnickePoruke();
  unosNovePoruke.value = "";
  prikazPoruke.innerText = tekst;
  prikaziToast("Poruka uspešno dodata!");
};

const sacuvajKorisnickePoruke = () => {
  try {
    localStorage.setItem(USER_MESSAGES_KEY, JSON.stringify(korisnickePoruke));
    return true;
  } catch {
    prikaziToast("Poruke nisu mogle biti sačuvane.");
    return false;
  }
};

const ucitajKorisnickePoruke = () => {
  try {
    const sacuvanePoruke = JSON.parse(
      localStorage.getItem(USER_MESSAGES_KEY) || "[]",
    );

    if (Array.isArray(sacuvanePoruke)) {
      korisnickePoruke = sacuvanePoruke.filter(
        (poruka, index, svePoruke) =>
          typeof poruka === "string" &&
          poruka.trim() &&
          !podrazumevanePoruke.includes(poruka) &&
          svePoruke.indexOf(poruka) === index,
      );
      poruke = [...podrazumevanePoruke, ...korisnickePoruke];
    }
  } catch {
    korisnickePoruke = [];
    prikaziToast("Sačuvane poruke nisu mogle biti učitane.");
  }

  prikaziKorisnickePoruke();
};

const prikaziKorisnickePoruke = () => {
  listaKorisnickihPoruka.innerHTML = "";
  praznaListaPoruka.hidden = korisnickePoruke.length > 0;

  korisnickePoruke.forEach((poruka, index) => {
    const item = document.createElement("li");
    item.className = "user-message-item";

    if (indeksPorukeZaIzmenu === index) {
      const editInput = document.createElement("input");
      editInput.type = "text";
      editInput.className = "message-edit-input";
      editInput.maxLength = MAX_DUZINA_PORUKE;
      editInput.value = poruka;
      editInput.setAttribute("aria-label", "Izmeni poruku");

      const editActions = document.createElement("div");
      editActions.className = "user-message-actions";

      const saveButton = document.createElement("button");
      saveButton.type = "button";
      saveButton.className = "message-edit-btn";
      saveButton.textContent = "Sačuvaj";
      saveButton.addEventListener("click", () =>
        sacuvajIzmenjenuPoruku(index, editInput.value),
      );

      const cancelButton = document.createElement("button");
      cancelButton.type = "button";
      cancelButton.className = "message-delete-btn";
      cancelButton.textContent = "Otkaži";
      cancelButton.addEventListener("click", otkaziIzmenuPoruke);

      editActions.append(saveButton, cancelButton);
      item.append(editInput, editActions);
      listaKorisnickihPoruka.append(item);
      editInput.focus();
      return;
    }

    const text = document.createElement("span");
    text.className = "user-message-text";
    text.textContent = poruka;

    const actions = document.createElement("div");
    actions.className = "user-message-actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "message-edit-btn";
    editButton.textContent = "Izmeni";
    editButton.addEventListener("click", () => {
      indeksPorukeZaIzmenu = index;
      prikaziKorisnickePoruke();
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "message-delete-btn";
    deleteButton.textContent = "Obriši";
    deleteButton.addEventListener("click", () => obrisiKorisnickuPoruku(index));

    actions.append(editButton, deleteButton);
    item.append(text, actions);
    listaKorisnickihPoruka.append(item);
  });
};

const sacuvajIzmenjenuPoruku = (index, novaPoruka) => {
  const tekst = novaPoruka.trim();
  if (!tekst) {
    prikaziToast("Poruka ne sme biti prazna!");
    return;
  }

  if (tekst.length > MAX_DUZINA_PORUKE) {
    prikaziToast(`Poruka ne sme biti duža od ${MAX_DUZINA_PORUKE} karaktera.`);
    return;
  }

  const formatiranaPoruka = tekst.charAt(0).toUpperCase() + tekst.slice(1);
  const postojiDuplikat = poruke.some(
    (poruka, porukaIndex) =>
      poruka === formatiranaPoruka && poruka !== korisnickePoruke[index],
  );

  if (postojiDuplikat) {
    prikaziToast("Ova poruka već postoji!");
    return;
  }

  const staraPoruka = korisnickePoruke[index];
  korisnickePoruke[index] = formatiranaPoruka;
  const porukaIndex = poruke.indexOf(staraPoruka);
  if (porukaIndex !== -1) poruke[porukaIndex] = formatiranaPoruka;

  if (sacuvajKorisnickePoruke()) {
    indeksPorukeZaIzmenu = null;
    prikaziKorisnickePoruke();
    prikaziToast("Poruka je izmenjena!");
  }
};

const otkaziIzmenuPoruke = () => {
  indeksPorukeZaIzmenu = null;
  prikaziKorisnickePoruke();
};

const obrisiKorisnickuPoruku = (index) => {
  if (!window.confirm("Da li želiš da obrišeš ovu poruku?")) return;

  const [obrisanaPoruka] = korisnickePoruke.splice(index, 1);
  const porukaIndex = poruke.indexOf(obrisanaPoruka);
  if (porukaIndex !== -1) poruke.splice(porukaIndex, 1);

  if (sacuvajKorisnickePoruke()) {
    prikaziKorisnickePoruke();
    prikaziToast("Poruka je obrisana.");
  }
};

const danasnjiDatum = () => new Date().toISOString().slice(0, 10);

const prikaziDnevniFokus = (fokus) => {
  const postojiFokus = Boolean(fokus?.text);

  statusDnevnogFokusa.hidden = !postojiFokus;
  tekstDnevnogFokusa.textContent = postojiFokus ? fokus.text : "";
  fokusZavrsen.checked = Boolean(fokus?.done);
  unosDnevnogFokusa.value = postojiFokus ? fokus.text : "";
};

const ucitajDnevniFokus = () => {
  try {
    const sacuvanFokus = JSON.parse(localStorage.getItem(DAILY_FOCUS_KEY));

    if (sacuvanFokus?.date === danasnjiDatum()) {
      prikaziDnevniFokus(sacuvanFokus);
      return;
    }

    localStorage.removeItem(DAILY_FOCUS_KEY);
  } catch {
    prikaziToast("Dnevni fokus nije mogao biti učitan.");
  }

  prikaziDnevniFokus(null);
};

const sacuvajDnevniFokus = (event) => {
  event.preventDefault();
  const tekst = unosDnevnogFokusa.value.trim();

  if (!tekst) {
    prikaziToast("Unesi fokus za danas.");
    return;
  }

  if (tekst.length > MAX_DUZINA_FOKUSA) {
    prikaziToast(`Fokus ne sme biti duži od ${MAX_DUZINA_FOKUSA} karaktera.`);
    return;
  }

  const fokus = {
    text: tekst,
    date: danasnjiDatum(),
    done: fokusZavrsen.checked,
  };

  try {
    localStorage.setItem(DAILY_FOCUS_KEY, JSON.stringify(fokus));
    prikaziDnevniFokus(fokus);
    prikaziToast("Dnevni fokus je sačuvan!");
  } catch {
    prikaziToast("Dnevni fokus nije mogao biti sačuvan.");
  }
};

const azurirajStatusFokusa = () => {
  try {
    const fokus = JSON.parse(localStorage.getItem(DAILY_FOCUS_KEY));

    if (fokus?.date === danasnjiDatum()) {
      fokus.done = fokusZavrsen.checked;
      localStorage.setItem(DAILY_FOCUS_KEY, JSON.stringify(fokus));
      prikaziDnevniFokus(fokus);
    }
  } catch {
    prikaziToast("Status fokusa nije mogao biti sačuvan.");
  }
};

// 6. EVENT LISTENERS
dugmeGenerisi.addEventListener("click", prikaziNasumicnuPoruku);
dugmeDodaj.addEventListener("click", dodajNovuPoruku);
dnevniFokusForma.addEventListener("submit", sacuvajDnevniFokus);
fokusZavrsen.addEventListener("change", azurirajStatusFokusa);
unosDnevnogFokusa.addEventListener("beforeinput", (event) => {
  if (event.inputType !== "insertFromPaste" || typeof event.data !== "string") {
    return;
  }

  const selectionStart = unosDnevnogFokusa.selectionStart ?? 0;
  const selectionEnd = unosDnevnogFokusa.selectionEnd ?? 0;
  const nextValue =
    unosDnevnogFokusa.value.slice(0, selectionStart) +
    event.data +
    unosDnevnogFokusa.value.slice(selectionEnd);

  if (nextValue.length > MAX_DUZINA_FOKUSA) {
    event.preventDefault();
    prikaziToast(`Fokus ne sme biti duži od ${MAX_DUZINA_FOKUSA} karaktera.`);
  }
});

unosDnevnogFokusa.addEventListener("paste", (event) => {
  const pastedText = event.clipboardData?.getData("text") || "";
  const selectionStart = unosDnevnogFokusa.selectionStart ?? 0;
  const selectionEnd = unosDnevnogFokusa.selectionEnd ?? 0;
  const nextValue =
    unosDnevnogFokusa.value.slice(0, selectionStart) +
    pastedText +
    unosDnevnogFokusa.value.slice(selectionEnd);

  if (nextValue.length > MAX_DUZINA_FOKUSA) {
    event.preventDefault();
    prikaziToast(`Fokus ne sme biti duži od ${MAX_DUZINA_FOKUSA} karaktera.`);
  }
});

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
  ucitajDnevniFokus();
  ucitajKorisnickePoruke();
});
