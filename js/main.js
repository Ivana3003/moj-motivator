"use strict";

// 1. PODACI
let trenutniJezik = "sr";
let poruke = [...I18n.translations.sr.defaultMessages];
let podrazumevanePoruke = [...poruke];
let korisnickePoruke = [];
let omiljenePoruke = [];
let prikaziSamoOmiljene = false;
let indeksPorukeZaIzmenu = null;
let poslednjaPoruka = null;

const MAX_DUZINA_PORUKE = 150;
const USER_MESSAGES_KEY = "moj-motivator-user-messages";
const USER_FAVORITES_KEY = "moj-motivator-user-message-favorites";
const FAVORITES_FILTER_KEY = "moj-motivator-favorites-filter";
const LAST_MESSAGE_KEY = "moj-motivator-last-message";
const LANGUAGE_KEY = "moj-motivator-language";

const t = (key, ...args) => {
  const value =
    I18n.translations[trenutniJezik]?.[key] ?? I18n.translations.sr[key];
  return typeof value === "function" ? value(...args) : value;
};

// 2. SELEKTORI
const prikazPoruke = document.getElementById("poruka");
const dugmeGenerisi = document.getElementById("generate-btn");
const unosNovePoruke = document.getElementById("nova-poruka");
const dugmeDodaj = document.getElementById("add-btn");
const dugmeTema = document.getElementById("theme-toggle");
const toast = document.getElementById("toast");
const listaKorisnickihPoruka = document.getElementById("user-messages-list");
const praznaListaPoruka = document.getElementById("user-messages-empty");
const filterOmiljenih = document.getElementById("favorites-only");
const dnevniFokusForma = document.getElementById("daily-focus-form");
const unosDnevnogFokusa = document.getElementById("daily-focus-input");
const statusDnevnogFokusa = document.getElementById("daily-focus-status");
const tekstDnevnogFokusa = document.getElementById("daily-focus-text");
const fokusZavrsen = document.getElementById("daily-focus-complete");
const dugmeObrisiDnevniFokus = document.getElementById("daily-focus-delete");
const dugmeSrpski = document.getElementById("language-sr");
const dugmeEngleski = document.getElementById("language-en");
const messageLogic = window.MojMotivatorLogic;

const DAILY_FOCUS_KEY = "moj-motivator-daily-focus";
const MAX_DUZINA_FOKUSA = 120;

const storageHelper = {
  getStorage(type) {
    return type === "session" ? sessionStorage : localStorage;
  },

  read(key, fallback, type = "local") {
    try {
      return this.getStorage(type).getItem(key) ?? fallback;
    } catch {
      return fallback;
    }
  },

  readJson(key, fallback, type = "local") {
    try {
      const value = this.getStorage(type).getItem(key);
      return value === null ? fallback : JSON.parse(value);
    } catch {
      return fallback;
    }
  },

  write(key, value, type = "local") {
    try {
      this.getStorage(type).setItem(key, value);
      return true;
    } catch {
      return false;
    }
  },

  writeJson(key, value, type = "local") {
    try {
      return this.write(key, JSON.stringify(value), type);
    } catch {
      return false;
    }
  },

  remove(key, type = "local") {
    try {
      this.getStorage(type).removeItem(key);
      return true;
    } catch {
      return false;
    }
  },
};

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

const primeniPrevod = () => {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
  });
};

const postaviJezik = (jezik) => {
  trenutniJezik = I18n.translations[jezik] ? jezik : "sr";
  document.documentElement.lang = trenutniJezik;
  storageHelper.write(LANGUAGE_KEY, trenutniJezik);
  dugmeSrpski.classList.toggle("active", trenutniJezik === "sr");
  dugmeEngleski.classList.toggle("active", trenutniJezik === "en");
  dugmeSrpski.setAttribute("aria-pressed", String(trenutniJezik === "sr"));
  dugmeEngleski.setAttribute("aria-pressed", String(trenutniJezik === "en"));
  podrazumevanePoruke = [...t("defaultMessages")];
  poruke = [...podrazumevanePoruke, ...korisnickePoruke];
  primeniPrevod();
  prikazPoruke.textContent = t("introMessage");
  prikaziKorisnickePoruke();
};

// 4. FUNKCIJA ZA TEMU
const postaviTemu = (tema) => {
  document.documentElement.setAttribute("data-theme", tema);
  dugmeTema.setAttribute("aria-pressed", String(tema === "dark"));

  storageHelper.write("izabrana-tema", tema);

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
  poslednjaPoruka = messageLogic.pickNextMessage(poruke, poslednjaPoruka);
  if (!poslednjaPoruka) return;

  prikazPoruke.innerText = poslednjaPoruka;

  storageHelper.write(LAST_MESSAGE_KEY, poslednjaPoruka, "session");
};

const dodajNovuPoruku = () => {
  const rezultat = messageLogic.normalizeMessage(
    unosNovePoruke.value,
    MAX_DUZINA_PORUKE,
  );

  if (!rezultat.ok) {
    prikaziToast(rezultat.error);
    return;
  }

  const tekst = rezultat.value;

  if (messageLogic.isDuplicateMessage(tekst, poruke)) {
    prikaziToast(t("duplicateMessage"));
    return;
  }

  poruke.push(tekst);
  korisnickePoruke.push(tekst);
  sacuvajKorisnickePoruke();
  prikaziKorisnickePoruke();
  unosNovePoruke.value = "";
  prikazPoruke.innerText = tekst;
  prikaziToast(t("messageAdded"));
};

const sacuvajKorisnickePoruke = () => {
  if (!storageHelper.writeJson(USER_MESSAGES_KEY, korisnickePoruke)) {
    prikaziToast(t("messagesSaveError"));
    return false;
  }
  return true;
};

const ucitajKorisnickePoruke = () => {
  const sacuvanePoruke = storageHelper.readJson(USER_MESSAGES_KEY, []);
  if (Array.isArray(sacuvanePoruke)) {
    korisnickePoruke = sacuvanePoruke.filter(
      (poruka, index, svePoruke) =>
        typeof poruka === "string" &&
        poruka.trim() &&
        !podrazumevanePoruke.includes(poruka) &&
        svePoruke.indexOf(poruka) === index,
    );
    poruke = [...podrazumevanePoruke, ...korisnickePoruke];
  } else {
    korisnickePoruke = [];
    prikaziToast(t("messagesLoadError"));
  }

  ucitajOmiljenePoruke();

  prikaziKorisnickePoruke();
};

const sacuvajOmiljenePoruke = () => {
  if (!storageHelper.writeJson(USER_FAVORITES_KEY, omiljenePoruke)) {
    prikaziToast(t("favoritesSaveError"));
    return false;
  }
  return true;
};

const ucitajOmiljenePoruke = () => {
  const sacuvaneOmiljene = storageHelper.readJson(USER_FAVORITES_KEY, []);
  if (Array.isArray(sacuvaneOmiljene)) {
    omiljenePoruke = sacuvaneOmiljene.filter(
      (poruka, index, svePoruke) =>
        korisnickePoruke.includes(poruka) &&
        svePoruke.indexOf(poruka) === index,
    );
  } else {
    omiljenePoruke = [];
    prikaziToast(t("favoritesLoadError"));
  }
};

const prikaziKorisnickePoruke = () => {
  listaKorisnickihPoruka.innerHTML = "";
  const porukeZaPrikaz = prikaziSamoOmiljene
    ? korisnickePoruke.filter((poruka) => omiljenePoruke.includes(poruka))
    : korisnickePoruke;
  praznaListaPoruka.hidden = porukeZaPrikaz.length > 0;
  praznaListaPoruka.textContent = prikaziSamoOmiljene
    ? t("emptyFavorites")
    : t("emptyMessages");

  porukeZaPrikaz.forEach((poruka) => {
    const index = korisnickePoruke.indexOf(poruka);
    const item = document.createElement("li");
    item.className = "user-message-item";

    if (indeksPorukeZaIzmenu === index) {
      const editInput = document.createElement("input");
      editInput.type = "text";
      editInput.className = "message-edit-input";
      editInput.maxLength = MAX_DUZINA_PORUKE;
      editInput.value = poruka;
      editInput.setAttribute("aria-label", t("editMessage"));

      const editActions = document.createElement("div");
      editActions.className = "user-message-actions";

      const saveButton = document.createElement("button");
      saveButton.type = "button";
      saveButton.className = "message-edit-btn";
      saveButton.textContent = t("save");
      saveButton.addEventListener("click", () =>
        sacuvajIzmenjenuPoruku(index, editInput.value),
      );

      const cancelButton = document.createElement("button");
      cancelButton.type = "button";
      cancelButton.className = "message-delete-btn";
      cancelButton.textContent = t("cancel");
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

    const favoriteButton = document.createElement("button");
    const jesteOmiljena = omiljenePoruke.includes(poruka);
    favoriteButton.type = "button";
    favoriteButton.className = `favorite-btn${jesteOmiljena ? " is-favorite" : ""}`;
    favoriteButton.textContent = jesteOmiljena ? "★" : "☆";
    favoriteButton.setAttribute("aria-pressed", String(jesteOmiljena));
    favoriteButton.setAttribute(
      "aria-label",
      jesteOmiljena ? t("removeFavorite") : t("addFavorite"),
    );
    favoriteButton.addEventListener("click", () =>
      promeniOmiljenuPoruku(poruka),
    );

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "message-edit-btn";
    editButton.textContent = t("edit");
    editButton.addEventListener("click", () => {
      indeksPorukeZaIzmenu = index;
      prikaziKorisnickePoruke();
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "message-delete-btn";
    deleteButton.textContent = t("delete");
    deleteButton.addEventListener("click", () => obrisiKorisnickuPoruku(index));

    actions.append(favoriteButton, editButton, deleteButton);
    item.append(text, actions);
    listaKorisnickihPoruka.append(item);
  });
};

const promeniOmiljenuPoruku = (poruka) => {
  if (omiljenePoruke.includes(poruka)) {
    omiljenePoruke = omiljenePoruke.filter((omiljena) => omiljena !== poruka);
  } else {
    omiljenePoruke.push(poruka);
  }

  if (sacuvajOmiljenePoruke()) {
    prikaziKorisnickePoruke();
    prikaziToast(
      omiljenePoruke.includes(poruka)
        ? t("favoriteAdded")
        : t("favoriteRemoved"),
    );
  }
};

const sacuvajIzmenjenuPoruku = (index, novaPoruka) => {
  const rezultat = messageLogic.normalizeMessage(novaPoruka, MAX_DUZINA_PORUKE);

  if (!rezultat.ok) {
    prikaziToast(rezultat.error);
    return;
  }

  const formatiranaPoruka = rezultat.value;
  const postojiDuplikat = messageLogic.isDuplicateMessage(
    formatiranaPoruka,
    poruke,
    korisnickePoruke[index],
  );

  if (postojiDuplikat) {
    prikaziToast(t("duplicateMessage"));
    return;
  }

  const staraPoruka = korisnickePoruke[index];
  korisnickePoruke[index] = formatiranaPoruka;
  const bilaJeOmiljena = omiljenePoruke.includes(staraPoruka);
  omiljenePoruke = omiljenePoruke.filter(
    (omiljena) => omiljena !== staraPoruka,
  );
  if (bilaJeOmiljena) omiljenePoruke.push(formatiranaPoruka);
  const porukaIndex = poruke.indexOf(staraPoruka);
  if (porukaIndex !== -1) poruke[porukaIndex] = formatiranaPoruka;

  if (sacuvajKorisnickePoruke() && sacuvajOmiljenePoruke()) {
    indeksPorukeZaIzmenu = null;
    prikaziKorisnickePoruke();
    prikaziToast(t("messageUpdated"));
  }
};

const otkaziIzmenuPoruke = () => {
  indeksPorukeZaIzmenu = null;
  prikaziKorisnickePoruke();
};

const obrisiKorisnickuPoruku = (index) => {
  if (!window.confirm(t("deleteMessageConfirm"))) return;

  const [obrisanaPoruka] = korisnickePoruke.splice(index, 1);
  omiljenePoruke = omiljenePoruke.filter(
    (omiljena) => omiljena !== obrisanaPoruka,
  );
  const porukaIndex = poruke.indexOf(obrisanaPoruka);
  if (porukaIndex !== -1) poruke.splice(porukaIndex, 1);

  if (sacuvajKorisnickePoruke() && sacuvajOmiljenePoruke()) {
    prikaziKorisnickePoruke();
    prikaziToast(t("messageDeleted"));
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
  const sacuvanFokus = storageHelper.readJson(DAILY_FOCUS_KEY, null);

  if (sacuvanFokus?.date === danasnjiDatum()) {
    prikaziDnevniFokus(sacuvanFokus);
    return;
  }

  storageHelper.remove(DAILY_FOCUS_KEY);

  prikaziDnevniFokus(null);
};

const sacuvajDnevniFokus = (event) => {
  event.preventDefault();
  const tekst = unosDnevnogFokusa.value.trim();

  if (!tekst) {
    prikaziToast(t("enterFocus"));
    return;
  }

  if (tekst.length > MAX_DUZINA_FOKUSA) {
    prikaziToast(t("focusTooLong", MAX_DUZINA_FOKUSA));
    return;
  }

  const fokus = {
    text: tekst,
    date: danasnjiDatum(),
    done: fokusZavrsen.checked,
  };

  if (storageHelper.writeJson(DAILY_FOCUS_KEY, fokus)) {
    prikaziDnevniFokus(fokus);
    prikaziToast(t("focusSaved"));
  } else {
    prikaziToast(t("focusSaveError"));
  }
};

const azurirajStatusFokusa = () => {
  const fokus = storageHelper.readJson(DAILY_FOCUS_KEY, null);

  if (fokus?.date === danasnjiDatum()) {
    fokus.done = fokusZavrsen.checked;
    if (storageHelper.writeJson(DAILY_FOCUS_KEY, fokus)) {
      prikaziDnevniFokus(fokus);
    } else {
      prikaziToast(t("focusStatusError"));
    }
  } else {
    prikaziToast(t("focusStatusError"));
  }
};

const obrisiDnevniFokus = () => {
  if (storageHelper.remove(DAILY_FOCUS_KEY)) {
    prikaziDnevniFokus(null);
    prikaziToast(t("focusDeleted"));
  } else {
    prikaziToast(t("focusDeleteError"));
  }
};

const ucitajFilterOmiljenih = () => {
  prikaziSamoOmiljene =
    storageHelper.readJson(FAVORITES_FILTER_KEY, false) === true;
  filterOmiljenih.checked = prikaziSamoOmiljene;
};

// 6. EVENT LISTENERS
dugmeGenerisi.addEventListener("click", prikaziNasumicnuPoruku);
dugmeDodaj.addEventListener("click", dodajNovuPoruku);
dnevniFokusForma.addEventListener("submit", sacuvajDnevniFokus);
fokusZavrsen.addEventListener("change", azurirajStatusFokusa);
dugmeObrisiDnevniFokus.addEventListener("click", obrisiDnevniFokus);
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
    prikaziToast(t("focusTooLong", MAX_DUZINA_FOKUSA));
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
    prikaziToast(t("focusTooLong", MAX_DUZINA_FOKUSA));
  }
});

unosNovePoruke.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    dodajNovuPoruku();
  }
});

dugmeTema.addEventListener("click", () => {
  const trenutnaTema = document.documentElement.getAttribute("data-theme");
  const novaTema = trenutnaTema === "dark" ? "light" : "dark";
  postaviTemu(novaTema);
});

dugmeSrpski.addEventListener("click", () => postaviJezik("sr"));
dugmeEngleski.addEventListener("click", () => postaviJezik("en"));

// 7. INICIJALIZACIJA (Pokretanje pri učitavanju)
document.addEventListener("DOMContentLoaded", () => {
  const sacuvanaTema = storageHelper.read("izabrana-tema", "light");
  postaviTemu(sacuvanaTema);
  ucitajFilterOmiljenih();
  ucitajDnevniFokus();
  ucitajKorisnickePoruke();

  const sacuvanaPoslednjaPoruka = storageHelper.read(
    LAST_MESSAGE_KEY,
    null,
    "session",
  );
  if (poruke.includes(sacuvanaPoslednjaPoruka)) {
    poslednjaPoruka = sacuvanaPoslednjaPoruka;
  }

  postaviJezik(storageHelper.read(LANGUAGE_KEY, "sr"));
});

filterOmiljenih.addEventListener("change", () => {
  prikaziSamoOmiljene = filterOmiljenih.checked;
  if (!storageHelper.writeJson(FAVORITES_FILTER_KEY, prikaziSamoOmiljene)) {
    prikaziToast(t("filterSaveError"));
  }
  prikaziKorisnickePoruke();
});
