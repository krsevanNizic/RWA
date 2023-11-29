const FilmoviPretrazivanje = require("./filmoviPretrazivanje.js");
const jwt = require("./moduli/jwt.js");
const JWT = require("jsonwebtoken");

const Autentifikacija = require("./autentifikacija.js");

class FetchUpravitelj {
	constructor(tajniKljucJWT) {
		this.auth = new Autentifikacija();
		this.fp = new FilmoviPretrazivanje();
		this.tajniKljucJWT = tajniKljucJWT;
	}

	aktvacijaRacuna = async function (zahtjev, odgovor) {
		console.log(zahtjev.query);
		let korime = zahtjev.query.korime;
		let kod = zahtjev.query.kod;

		let poruka = await this.auth.aktivirajKorisnickiRacun(korime, kod);
		console.log(poruka);

		if (poruka.status == 200) {
			odgovor.send(await poruka.text());
		} else {
			odgovor.send(await poruka.text());
		}
	};

	dajSveZanrove = async function (zahtjev, odgovor) {
		odgovor.json(await this.fp.dohvatiSveZanrove());
	};
	dajDvaFilma = async function (zahtjev, odgovor) {
		odgovor.json(await this.fp.dohvatiNasumceFilm(zahtjev.query.zanr));
	};
	 
	dohvatiFilm = async function (zahtjev, odgovor) {
		odgovor.json(await this.fp.dohvatiFilm(zahtjev.query.id));
	}

	getJWT = async function (zahtjev, odgovor) {
		odgovor.type("json");
		console.log(zahtjev.session);
		if (zahtjev.session.jwt != null) {
			//let k = { korime: zahtjev.session.korime };
			//let noviToken = jwt.kreirajToken(k, this.tajniKljucJWT);
			console.log("Ovo je getJWT"+ zahtjev.session.jwt);
			let letPodaci = JWT.verify(zahtjev.session.jwt,this.tajniKljucJWT);
			//odgovor.json({ jwt: zahtjev.session.jwt });
			odgovor.json({ jwt: letPodaci });


			//odgovor.send(zahtjev.session.jw);
			return;
		}
		odgovor.status(401);
		odgovor.send({ greska: "nemam token!" });
	};

	filmoviPretrazivanje = async function (zahtjev, odgovor) {
			let str = zahtjev.query.str;
			let filter = zahtjev.query.filter;
			console.log(zahtjev.query);
			odgovor.json(await this.fp.dohvatiFilmove(str, filter));
		
	};
	

	dodajFilm = async function (zahtjev, odgovor) {
		console.log(zahtjev.body);
		if (!jwt.provjeriToken(zahtjev, this.tajniKljucJWT)) {
			odgovor.status(401);
			odgovor.json({ greska: "neaoutorizirani pristup" });
		} else {
			//TODO obradi zahtjev
			odgovor.json({ ok: "OK" });
		}
	};
}
module.exports = FetchUpravitelj;
