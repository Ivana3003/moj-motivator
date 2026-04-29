# 🌟 Moj Motivator

Aplikacija koja vam pruža dnevnu dozu inspiracije uz mogućnost dodavanja sopstvenih poruka.

---

## 📸 Preview (Izgled aplikacije)

|             Light Mode              |             Dark Mode             |
| :---------------------------------: | :-------------------------------: |
| ![Light Mode](light-screenshot.png) | ![Dark Mode](dark-screenshot.png) |

---

## 🌙 Dark Mode Toggle

Implementiran je jednostavan i moderan sistem za promenu svetle i tamne teme. Ovaj projekat demonstrira veštinu manipulacije DOM elementima i integraciju eksternih biblioteka ikona.

## 🚀 Glavne Funkcije

- **Dinamička promena teme:** Trenutni prelazak između svetlog i tamnog režima bez kašnjenja.
- **Pametne ikone:** Korišćenje _Lucide Icons_ biblioteke uz rešavanje problema ponovnog iscrtavanja (re-rendering) SVG elemenata.
- **Unos poruka:** Dodavanje sopstvenih motivacionih poruka uz validaciju unosa.
- **Toast obaveštenja:** Korisničke poruke o uspehu i greškama bez prekidanja rada (bez alert prozora).
- **Validacija unosa:** Sprečeno dodavanje praznih poruka, duplikata i unosa dužih od 150 karaktera.
- **LocalStorage:** Trajno pamćenje izbora korisnika (teme) čak i nakon osvežavanja stranice uz sigurniji pristup kroz `try/catch`.

## 🛠️ Tehnologije

- **HTML5 / CSS3** (Korišćenje Custom Variables za teme)
- **JavaScript** (ES6+ sintaksa i Arrow Functions)
- **Lucide Icons** (Biblioteka za vektorske ikonice)

## 🔒 Validacija i sigurnost

- **Kontrola unosa:** Ograničenje dužine poruke na 150 karaktera (`maxlength` + JS provera).
- **Zaštita od lošeg unosa:** Blokiranje praznih poruka i duplikata.
- **Sigurniji rad sa storage-om:** Obrada potencijalnih grešaka pri čitanju i upisu u LocalStorage.
- **UX povratna informacija:** Toast sistem za jasne i nenametljive poruke korisniku.

## 💡 Šta sam naučila?

Najveći izazov je bio rad sa **Lucide** bibliotekom. Pošto ona menja HTML elemente u SVG-ove, naučila sam kako da:

1.  Pravilno selektujem nove elemente nakon njihove promene u DOM-u.
2.  Koristim `lucide.createIcons()` za ažuriranje prikaza bez osvežavanja cele stranice.
3.  Pišem modularniji i čistiji kod koristeći napredne JS funkcije.
4.  Implementiram _toast_ sistem za korisničke poruke bez blokiranja interfejsa.
5.  Uvodim validaciju unosa koja poboljšava kvalitet podataka i UX.
6.  Pišem otporniji kod kroz `try/catch` zaštitu pri radu sa LocalStorage.

## 🖥️ Kako pokrenuti projekat?

1.  Klonirajte repozitorijum na svoj računar.
2.  Otvorite `index.html` u vašem omiljenom pretraživaču.

---

### 👩‍🔬 Autor

**[Ivana Tatić]**
_Master organske hemije i ambiciozni veb programer_

Budite slobodni da me kontaktirate i pogledate moje ostale projekte!
