const ds = require("fs/promises");
const jwt = require("./moduli/jwt.js");
const totp = require("./moduli/totp.js");
const Autentifikacija = require("./autentifikacija.js");

class HtmlUpravitelj {
	constructor(tajniKljucJWT) {
		this.tajniKljucJWT = tajniKljucJWT;
		console.log(this.tajniKljucJWT);
		this.auth = new Autentifikacija();
	}

	pocetna = async function (zahtjev, odgovor) {
		let pocetna = await ucitajStranicu("pocetna");
		odgovor.send(pocetna);
	};

	dokumentacija = async function (zahtjev, odgovor) {
		let dokumentacija = await ucitajStranicu("dokumentacija");
		odgovor.send(dokumentacija);
	};

	detalji = async function (zahtjev, odgovor) {
		let detalji = await ucitajStranicu("detalji");
		odgovor.send(detalji);
	};
	profil = async function (zahtjev, odgovor) {
		let profil = await ucitajStranicu("profil");
		odgovor.send(profil);
	};

	registracija = async function (zahtjev, odgovor) {
		console.log(zahtjev.body);
		let greska = "";
		if (zahtjev.method == "POST") {
			let uspjeh = await this.auth.dodajKorisnika(zahtjev.body);
			if (uspjeh) {
				odgovor.redirect("/prijava");
				return;
			} else {
				greska = "Dodavanje nije uspjelo provjerite podatke!";
			}
		}

		let stranica = await ucitajStranicu("registracija", greska);
		odgovor.send(stranica);
	};

	odjava = async function (zahtjev, odgovor) {
		zahtjev.session.jwt = null;
		odgovor.redirect("/");
	};

	prijava = async function (zahtjev, odgovor) {
		let greska = "";
		if (zahtjev.method == "POST") {
			var korime = zahtjev.body.korime;
			var lozinka = zahtjev.body.lozinka;
			var korisnik = await this.auth.prijaviKorisnika(korime, lozinka);
			console.log(korisnik);
			console.log(korime + lozinka);
			if (korisnik) {
				// TODO: Provjeri da li je račun aktiviran
				// Ovdje možete dodati logiku provjere aktiviranja računa
	
				// Nema TOTP provjere
				zahtjev.session.jwt = jwt.kreirajToken(korisnik, this.tajniKljucJWT);
				korisnik = JSON.parse(korisnik);
				zahtjev.session.korisnik = korisnik.ime + " " + korisnik.prezime;
				zahtjev.session.korime = korime;
				console.log(zahtjev.session);
				odgovor.redirect("/");
				return;
			} else {
				greska = "Netočni podaci!";
			}
		}

		let stranica = await ucitajStranicu("prijava", greska);
		odgovor.send(stranica);
	};

		 odjava(zahtjev, odgovor) {
		// Ovdje implementirajte logiku odjave
		// Na primjer, možete obrisati JWT token iz sesije
		zahtjev.session.jwt = null;
		zahtjev.session.korisnik = null;
		zahtjev.session.korime = null;
	
		// Redirektajte korisnika na početnu stranicu nakon odjave
		odgovor.redirect("/");
	}

	filmoviPretrazivanje = async function (zahtjev, odgovor) {
		let stranica = await ucitajStranicu("filmovi_pretrazivanje");
		odgovor.send(stranica);
	};
}

module.exports = HtmlUpravitelj;

async function ucitajStranicu(nazivStranice, poruka = "") {
	let stranice = [ucitajHTML(nazivStranice), ucitajHTML("navigacija")];
	let [stranica, nav] = await Promise.all(stranice);
	stranica = stranica.replace("#navigacija#", nav);
	stranica = stranica.replace("#poruka#", poruka);
	return stranica;
}

function ucitajHTML(htmlStranica) {
    if (htmlStranica === "dokumentacija") {
        // Ako je stranica "dokumentacija", učitaj HTML datoteku iz drugog direktorija
        return ds.readFile(__dirname + "/../dokumentacija/" + htmlStranica + ".html", "UTF-8");
    } else {
        // Inače, učitaj standardnu HTML datoteku iz trenutnog direktorija
        return ds.readFile(__dirname + "/html/" + htmlStranica + ".html", "UTF-8");
    }
}

