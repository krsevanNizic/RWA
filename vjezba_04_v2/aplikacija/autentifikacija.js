//const mail = require("./moduli/mail.js");
const kodovi = require("./moduli/kodovi.js");
const portRest = 12000;

class Autentifikacija {
	
	async dodajKorisnika(korisnik) {
		let tijelo = {
			ime: korisnik.ime,
			prezime: korisnik.prezime,
			lozinka: kodovi.kreirajSHA256(korisnik.lozinka, "moja sol"),
			email: korisnik.email,
			korime: korisnik.korime,
			
		};
	
		let aktivacijskiKod = kodovi.dajNasumceBroj(10000, 99999);
		tijelo["aktivacijskiKod"] = aktivacijskiKod;
	
		let zaglavlje = new Headers();
		zaglavlje.set("Content-Type", "application/json");
	
		let parametri = {
			method: "POST",
			body: JSON.stringify(tijelo),
			headers: zaglavlje,
		};
	
		try {
			let odgovor = await fetch(
				"http://localhost:" + portRest + "/baza/korisnici",
				parametri
			);
	
			if (odgovor.status == 201) {
				console.log("Korisnik ubačen na servisu");
				// Izostavljanje dijela koda koji šalje e-mail
				return true;
			} else {
				console.log(odgovor.status);
				console.log(await odgovor.text());
				return false;
			}
		} catch (error) {
			console.error("Greška prilikom izvršavanja dodavanja korisnika:", error);
			return false;
		}
	}
	



	async aktivirajKorisnickiRacun(korime, kod) {
		let zaglavlje = new Headers();
		zaglavlje.set("Content-Type", "application/json");
		let parametri = {
			method: "PUT",
			body: JSON.stringify({ aktivacijskiKod: kod }),
			headers: zaglavlje,
		};

		return await fetch(
			"http://localhost:" +
				portRest +
				"/baza/korisnici/" +
				korime +
				"/aktivacija",
			parametri
		);
	}

	async prijaviKorisnika(korime, lozinka) {
		lozinka = kodovi.kreirajSHA256(lozinka, "moja sol");
		let tijelo = {
			lozinka: lozinka,
		};
		console.log(lozinka);
		let zaglavlje = new Headers();
		zaglavlje.set("Content-Type", "application/json");

		let parametri = {
			method: "POST",
			body: JSON.stringify(tijelo),
			headers: zaglavlje,
		};
		let odgovor = await fetch(
			"http://localhost:" + portRest + "/baza/korisnici/" + korime + "/prijava",
			parametri
		);

		if (odgovor.status == 200) {
			return await odgovor.text();
		} else {
			return false;
		}
	}
}

module.exports = Autentifikacija;
