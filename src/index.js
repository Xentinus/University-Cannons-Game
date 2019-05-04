const read = require('readline-sync');
console.clear();

// -----------------------------------------MAP

// Pályával kapcsolatos cuccok
const palya = {};

// Lehetne tesztelni akár hogy nagyobb e legalább 3-nál vagy akár randomoltatni is a pálya méretét
// ( annál kisebben nem nagyon van értelme a játéknak)
palya.szelesseg = read.questionInt('Milyen széles legyen a pálya? ');
palya.magassag = read.questionInt('Milyen magas legyen a pálya? ');

// pálya elkészítése
palya.terkep = palyaKeszites(palya.szelesseg, palya.magassag) // pálya készítése a megadottak alapján

// Én a kettő szélére raktam az ágyúkat, de randomoltatni is lehetne akár
palya.terkep[palya.magassag - 1][0] = 1; // Első játékos bal oldalt
palya.terkep[palya.magassag - 1][palya.szelesseg - 1] = 1; // Második játékos jobb oldalt


// -----------------------------------------GAME

let jatekVege = false; // ha a palyaEllenorzes true -t add vissza akkor vége a játéknak
let korokSzama = 0; // Ez csak azért van hogy megjelenjen hogy melyik játékos következik

while (!jatekVege) {
  korokSzama += 1;

  // Megjelenítés
  console.clear(); // Kitisztítja a console-t
  
  // Maradéknélküli osztással megnézi hogy az első vagy a második játékos jön
  console.log(`${korokSzama % 2 ? 'Az első' : 'A második'} játékos következik!`);
  
  // Megjeleníti a térképet
  palyaMegjelenites(palya.terkep);

  let jatekos = {};
  
  // Megnézi hogy melyik játék következik, aszerint helyezi balszélre vagy jobb szélre
  jatekos.oszlop = korokSzama % 2 ? 0 : palya.szelesseg - 1;
  jatekos.sor = palya.magassag - 1;

  // Célpont és tűzelés
  console.log('Válassz egy üres célpontot! ');
  console.log();

  let tuzelheto = false; // Ellenörzés hogy nem e foglalt e, vagy lehet e egyáltalán oda lőni
  let celpont = {}; // Célpont adatainak mentésére szolgál

  while (!tuzelheto) {
    celpont.oszlop = read.questionInt('Oszlop: ');
    celpont.sor = read.questionInt('Sor: ');
    
    // Nem e foglalt és nem a legalja (ágyúsor nem számít bele a játékosmezőbe)
    if ((palya.terkep[celpont.sor][celpont.oszlop] < 2) && celpont.sor < palya.magassag) {
      tuzelheto = true;
    } else {
      console.log('Ide nem tűzelhetsz, válassz másik helyet! ');
    }
  }

  palya.terkep[celpont.sor][celpont.oszlop] = teglaGeneralas(); // Randomgenerál egy téglát a célpont helyén
  tisztitas(palya, celpont); // Kitísztít ha van hasonló tégla körülőtte
  jatekVege = palyaEllenorzes(palya.terkep); // Megnézi hogy a játékos mező teljesen űres vagy tele e van
}

// ----------------------------------------- FUNC

function tisztitas(palya, celpont) {
  // Lövés végeredményének elmentése hasonlításokhoz
  const lovedek = palya.terkep[celpont.sor][celpont.oszlop];

  // Balra ellenörzés
  if (celpont.oszlop > 0) {
    if ((palya.terkep[celpont.sor][celpont.oszlop - 1]) === lovedek) {
      palya.terkep[celpont.sor][celpont.oszlop] = 0;
      palya.terkep[celpont.sor][celpont.oszlop - 1] = 0;
    }
  }

  // Jobbra ellenörzés
  if (celpont.oszlop < palya.szelesseg) {
    if ((palya.terkep[celpont.sor][celpont.oszlop + 1]) === lovedek) {
      palya.terkep[celpont.sor][celpont.oszlop] = 0;
      palya.terkep[celpont.sor][celpont.oszlop + 1] = 0;
    }
  }

  // Felfele ellenörzés
  if (celpont.sor > 0) {
    if ((palya.terkep[celpont.sor - 1][celpont.oszlop]) === lovedek) {
      palya.terkep[celpont.sor][celpont.oszlop] = 0;
      palya.terkep[celpont.sor - 1][celpont.oszlop] = 0;
    }
  }

  // Lefele ellenörzés
  if (celpont.sor < palya.magassag) {
    if ((palya.terkep[celpont.sor + 1][celpont.oszlop]) === lovedek) {
      palya.terkep[celpont.sor][celpont.oszlop] = 0;
      palya.terkep[celpont.sor + 1][celpont.oszlop] = 0;
    }
  }
}

function palyaKeszites(palyaSzelesseg, palyaMagassag) {
  let palya = [];
  let sor = [];

  for (let i = 0; i < (palyaMagassag); i++) {
    for (let j = 0; j < palyaSzelesseg; j++) {
      if (i === 0) {
        sor.push(teglaGeneralas()); // Az első sor kezdésnek random téglák
      } else {
        sor.push(0); // Minden más üres
      }
    }
    palya.push(sor);
    sor = [];
  }
  return palya;
}

function palyaMegjelenites(terkep) {
  console.log();

  // Oszlopszám megjelenítése a tetején
  let sor = '     ';
  for (let j = 0; j < terkep[0].length; j++) {
    sor += ` ${j} `;
  }
  console.log(sor);

  // Felső sor elválasztó
  sor = '-----';
  for (let j = 0; j < terkep[0].length; j++) {
    sor += `---`;
  }
  console.log(sor);

  // Maga a térkép
  for (let i = 0; i < terkep.length; i++) {
    sor = `${i} |  `; // Sorszám megjelenítése
    for (let j = 0; j < terkep[i].length; j++) {
      sor += ` ${terkep[i][j]} `;
    }
    console.log(sor);
    sor = '';
  }

  console.log();
}

function palyaEllenorzes(terkep) {

  let uresHelyek = 0;
  let teglasHelyek = 0;

  // A tömbben minden elemet végignéz, ha több mint 1 azaz tégla típus akkor azt hozzászámolja a teglasHelyek-hez
  // Úgyan ez fordítva is van

  // Ha valamelyik 0 akkor vége a játéknak

  for (let i = 0; i < (terkep.length - 1); i++) {
    for (let j = 0; j < terkep[i].length; j++) {
      if (terkep[i][j] > 1) {
        teglasHelyek += 1;
      } else if (terkep[i][j] === 0) {
        uresHelyek += 1;
      }
    }
  }

  if (uresHelyek === 0) { // Ha minden teli van építő nyer
    console.clear;
    console.log('Az építő játékos nyert!');
    palyaMegjelenites(terkep);
    return true;
  } else if (teglasHelyek === 0) { // Ha minden üres romboló nyer
    console.clear;
    console.log('A romboló játékos nyert!');
    palyaMegjelenites(terkep)
    return true;
  }

  // Megy tovább a game ha nincs teli és nem is űres
  return false;
}

function teglaGeneralas() {
  return Math.floor((Math.random() * 3) + 2); // Vörös = 2 | Sárga = 3 | Zöld = 4;
}
