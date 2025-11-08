 💄 BlushManager

A BlushManager egy modern, webes adminisztrációs felület, amely segítségével termékeket, projekteket és feladatokat lehet kezelni.  
A rendszer célja, hogy egy esztétikus, áttekinthető és interaktív dashboardon keresztül bemutassa a HTML5, CSS3, JavaScript, jQuery és LocalStorage gyakorlati alkalmazását.

 🧭 Tartalomjegyzék
 [Fő jellemzők](főjellemzők)
 [Használt technológiák](használttechnológiák)
 [Oldalak](oldalak)
 [Fő funkciók](főfunkciók)
 [Kötelező feladatelemek teljesítése](kötelezőfeladatelemekteljesítése)
 [Fájlstruktúra](fájlstruktúra)
 [Telepítés és futtatás](telepítésésfuttatás)
 [Fejlesztő](fejlesztő)



 🌸 Fő jellemzők

 Teljesen reszponzív, modern admin dashboard
 Termékek, projektek, feladatok kezelése (CRUD műveletek)
 Adatok LocalStorageban tárolva (tartósan mentve a böngészőben)
 Statisztikák és trendek megjelenítése a főoldalon
 Tevékenységnapló az utóbbi műveletekhez
 Havi statisztikai mentés automatikusan
 jQuery animációk, AJAX és JSON fájl használata
 HTML5 videó JavaScriptes vezérléssel
 Külön Kapcsolat oldal extra űrlap és médiaelemekkel



💻 Használt technológiák

| Technológia | Használat |
|--------------|------------|
| HTML5 | Oldalszerkezet, szemantikus elemek (`header`, `section`, `nav`, `footer`) |
| CSS3 | Reszponzív design, változók, árnyékok, grid layout |
| JavaScript (ES6) | Dinamikus tartalom, adatok kezelése, DOM manipuláció |
| LocalStorage API | Adatok mentése kliensoldalon (termékek, projektek, feladatok) |
| jQuery | Animációk, interaktív elemek vezérlése |
| AJAX (fetch API) | Külső JSON fájl beolvasása |
| Font Awesome | Ikonok a navigációhoz és gombokhoz |



 📄 Oldalak

| Fájlnév | Leírás |
|----------|--------|
| `index.html` | Főoldal (Dashboard) – statisztikák, trendek, legutóbbi aktivitások |
| `products.html` | Termékek kezelése (hozzáadás, szerkesztés, törlés) |
| `projects.html` | Projektek kezelése (kártyanézet) |
| `tasks.html` | Feladatok listája és státuszkezelése |
| `contact.html` | Kapcsolat oldal – űrlap, videó, jQuery, JSON és AJAX példákkal |




 ⚙️ Fő funkciók

 🧾 CRUD műveletek
 Termékek, projektek és feladatok hozzáadása, szerkesztése, törlése
 Minden módosítás automatikusan mentődik a LocalStorageban
 Az események megjelennek az aktivitásnaplóban

 📊 Dashboard
 Összesített statisztika (termékek, aktív projektek, rendelések)
 Trendek százalékos változással
 Legutóbbi termékek, projektek, feladatok listája

 📅 Havi statisztika
 A `monthlystats.js` automatikusan menti az előző hónap adatait
 Következő hónapban új statisztikai alapot hoz létre

 💌 Kapcsolat oldal (contact.html)
 Komplex űrlap HTML5 inputokkal:
   `text`, `email`, `textarea`, `color`, `datalist`, `radio`, `checkbox`
 Form validáció JavaScripttel és vizuális hibajelzés
 Videólejátszó gombokkal (`play`, `pause`, `mute`)
 jQuery alapú animáció: szekciók lenyitása / elrejtése
 AJAX + JSON betöltés: motivációs üzenetek listázása (`data/quotes.json`)



 🧩 Kötelező feladatelemek teljesítése

| Követelmény | Megvalósítva | Fájl |
|--------------|---------------|------|
| Legalább 5 HTML oldal | ✅ | index, products, projects, tasks, contact |
| HTML5 szemantikus elemek | ✅ | minden oldal |
| Form elemek (text, email, color, radio, checkbox, datalist) | ✅ | contact.html |
| Videó + JS vezérlés | ✅ | contact.html |
| AJAX + JSON fájl beolvasás | ✅ | contact.html |
| jQuery + animáció | ✅ | contact.html |
| LocalStorage + JavaScript CRUD | ✅ | storage.js, dashboard.js, products.js stb. |
| Reszponzív design | ✅ | main.css, grid layout |
| CSS változók, árnyék, radius, hover effektek | ✅ | main.css |
| Hibakezelés + űrlapvalidálás | ✅ | contact.html, products.js |



 📁 Fájlstruktúra
blushmanager/
│
├── index.html
├── products.html
├── projects.html
├── tasks.html
├── contact.html
│
├── styles/
│ ├── main.css
│ ├── dashboard.css
│ ├── products.css
│ ├── projects.css
│ ├── tasks.css
│ └── contact.css
│
├── js/
│ ├── dashboard.js
│ ├── products.js
│ ├── projects.js
│ ├── tasks.js
│ ├── storage.js
│ └── monthly-stats.js
│
├── data/
│ └── quotes.json
│
└── README.md


 🚀 Telepítés és futtatás

1. Töltsd le a projekt mappáját (`blushmanager/`)
2. Nyisd meg a `index.html` fájlt böngészőben
3. A böngésző LocalStoragejában maradnak az adatok, amíg nem törlöd őket
4. A `contact.html` oldalon próbáld ki a videót, űrlapot és AJAX betöltést

> 💡 Tipp: ha a JSON nem töltődik be, futtasd a projektet Live Serverrel vagy egy egyszerű localhost környezetben (pl. VS Code Live Server).


 👩‍💻 Fejlesztő

Készítette: Uri Alexandra  
Projekt neve: BlushManager  
Készült: 2025  
Cél: Webfejlesztés vizsgafeladat / beadandó demonstrációs rendszer



✨ A BlushManager célja, hogy egyszerre legyen esztétikus, funkcionális és technikailag teljes – bemutatva a frontend webfejlesztés alapvető ismereteit.
