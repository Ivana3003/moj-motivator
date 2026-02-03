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
- **LocalStorage:** Trajno pamćenje izbora korisnika (teme) čak i nakon osvežavanja stranice.

## 🛠️ Tehnologije

- **HTML5 / CSS3** (Korišćenje Custom Variables za teme)
- **JavaScript** (ES6+ sintaksa i Arrow Functions)
- **Lucide Icons** (Biblioteka za vektorske ikonice)

## 💡 Šta sam naučila?

Najveći izazov je bio rad sa **Lucide** bibliotekom. Pošto ona menja HTML elemente u SVG-ove, naučila sam kako da:

1.  Pravilno selektujem nove elemente nakon njihove promene u DOM-u.
2.  Koristim `lucide.createIcons()` za ažuriranje prikaza bez osvežavanja cele stranice.
3.  Pišem modularniji i čistiji kod koristeći napredne JS funkcije.

## 🖥️ Kako pokrenuti projekat?

1.  Klonirajte repozitorijum na svoj računar.
2.  Otvorite `index.html` u vašem omiljenom pretraživaču.

---

### 👩‍🔬 Autor

**[Ivana Tatić]**
_Master organske hemije i ambiciozni veb programer_

Budite slobodni da me kontaktirate i pogledate moje ostale projekte!
