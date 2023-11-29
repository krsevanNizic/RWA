import express from "express";
import sesija from "express-session";
import kolacici from "cookie-parser";
import Konfiguracija from "./konfiguracija.js";
//import portovi from "/var/www/RWA/2023/portovi.js";
import RestTMDB from "./servis/restTMDB.js";
import restKorisnik from "./servis/restKorisnik.js";
import HtmlUpravitelj from "./aplikacija/htmlUpravitelj.js";
import FetchUpravitelj from "./aplikacija/fetchUpravitelj.js";
import SerijaDAO  from "./servis/serijeDAO.js";




//const port = portovi.matnovak;
const port = 12000;
const server = express();

let konf = new Konfiguracija();
konf
	.ucitajKonfiguraciju()
	.then(pokreniServer)
	.catch((greska) => {
		console.log(greska);
		if (process.argv.length == 2) {
			console.error("Niste naveli naziv konfiguracijske datoteke!");
		} else {
			console.error("Datoteka ne postoji: " + greska.path);
		}
	});

function pokreniServer() {
	server.use(express.urlencoded({ extended: true }));
	server.use(express.json());

	server.use(kolacici());
	server.use(
		sesija({
			secret: konf.dajKonf().tajniKljucSesija,
			saveUninitialized: true,
			cookie: { maxAge: 1000 * 60 * 60 * 3 },
			resave: false,
		})
	);

	server.use("/js", express.static("./aplikacija/js"));

	server.use(express.static("./dokumentacija"));

	pripremiPutanjeKorisnik();
	pripremiPutanjeTMDB();
	pripremiPutanjePocetna();
	pripremiPutanjeDokumentacija();
	pripremiPutanjeDetalji();
	pripremiPutanjeProfil();
	pripremiPutanjePretrazivanjeFilmova();
	pripremiPutanjeAutentifikacija();

	



	const serijeDAO = new SerijaDAO();
server.post('/baza/spremiSeriju', async (req, res) => {
	u
	try {
		let odabraniFilm = req.body;
		console.log("Primljeni podaci:", odabraniFilm);
		await serijeDAO.spremiSeriju(odabraniFilm);

	  await serijeDAO.spremiSeriju(odabrani);
	  res.status(200).json({ message: 'Podaci su uspješno spremljeni.' });
	} catch (error) {
	  console.error('Greška prilikom spremanja podataka:', error);
	  res.status(500).json({ error: 'Internal Server Error', message: error.message });
	}
  });
  
	server.use((zahtjev, odgovor) => {
		odgovor.status(404);
		odgovor.json({ opis: "nema resursa" });
	});


	server.listen(port, () => {
		console.log(`Server pokrenut na portu: ${port}`);
	});


}







function pripremiPutanjeKorisnik() {
	server.get("/baza/korisnici", restKorisnik.getKorisnici);
	server.post("/baza/korisnici", restKorisnik.postKorisnici);
	server.delete("/baza/korisnici", restKorisnik.deleteKorisnici);
	server.put("/baza/korisnici", restKorisnik.putKorisnici);

	server.get("/baza/korisnici/:korime", restKorisnik.getKorisnik);
	server.post("/baza/korisnici/:korime", restKorisnik.postKorisnik);
	server.delete("/baza/korisnici/:korime", restKorisnik.deleteKorisnik);
	server.put("/baza/korisnici/:korime", restKorisnik.putKorisnik);

	server.post(
		"/baza/korisnici/:korime/prijava",
		restKorisnik.getKorisnikPrijava
	);
}

function pripremiPutanjeTMDB() {
	let restTMDB = new RestTMDB(konf.dajKonf()["tmdb.apikey.v3"]);
	server.get("/baza/tmdb/zanr", restTMDB.getZanr.bind(restTMDB));
	server.get("/baza/tmdb/filmovi", restTMDB.getFilmovi.bind(restTMDB));
	server.get("/baza/tmdb/film", restTMDB.getFilm.bind(restTMDB));
	
}
function pripremiPutanjeDokumentacija(){
	let htmlUpravitelj = new HtmlUpravitelj(konf.dajKonf().jwtTajniKljuc);
	let fetchUpravitelj = new FetchUpravitelj(konf.dajKonf().jwtTajniKljuc);
	server.get("/dokumentacija", htmlUpravitelj.dokumentacija.bind(htmlUpravitelj));
}
function pripremiPutanjeProfil(){
	let htmlUpravitelj = new HtmlUpravitelj(konf.dajKonf().jwtTajniKljuc);
	let fetchUpravitelj = new FetchUpravitelj(konf.dajKonf().jwtTajniKljuc);
	server.get("/profil", htmlUpravitelj.profil.bind(htmlUpravitelj));
};

function pripremiPutanjeDetalji(){
	let htmlUpravitelj = new HtmlUpravitelj(konf.dajKonf().jwtTajniKljuc);
	let fetchUpravitelj = new FetchUpravitelj(konf.dajKonf().jwtTajniKljuc);
	server.get("/detalji", htmlUpravitelj.detalji.bind(htmlUpravitelj));
}


function pripremiPutanjePocetna() {
	let htmlUpravitelj = new HtmlUpravitelj(konf.dajKonf().jwtTajniKljuc);
	let fetchUpravitelj = new FetchUpravitelj(konf.dajKonf().jwtTajniKljuc);
	server.get("/", htmlUpravitelj.pocetna.bind(htmlUpravitelj));
	server.get(
		"/dajSveZanrove",
		fetchUpravitelj.dajSveZanrove.bind(fetchUpravitelj)
	);
	server.get("/dajDvaFilma", fetchUpravitelj.dajDvaFilma.bind(fetchUpravitelj));
}

function pripremiPutanjePretrazivanjeFilmova() {
	let htmlUpravitelj = new HtmlUpravitelj(konf.dajKonf().jwtTajniKljuc);
	let fetchUpravitelj = new FetchUpravitelj(konf.dajKonf().jwtTajniKljuc);
	server.get(
		"/filmoviPretrazivanje",
		htmlUpravitelj.filmoviPretrazivanje.bind(htmlUpravitelj)
	);
	server.post(
		"/filmoviPretrazivanje",
		fetchUpravitelj.filmoviPretrazivanje.bind(fetchUpravitelj)
	);
	server.post("/dohvatiFilm",fetchUpravitelj.dohvatiFilm.bind(fetchUpravitelj));
	server.post("/dodajFilm", fetchUpravitelj.dodajFilm.bind(fetchUpravitelj));
}

function pripremiPutanjeAutentifikacija() {
	let htmlUpravitelj = new HtmlUpravitelj(konf.dajKonf().jwtTajniKljuc);
	let fetchUpravitelj = new FetchUpravitelj(konf.dajKonf().jwtTajniKljuc);
	server.get("/registracija", htmlUpravitelj.registracija.bind(htmlUpravitelj));
	server.post(
		"/registracija",
		htmlUpravitelj.registracija.bind(htmlUpravitelj)
	);
	server.post("/odjava", htmlUpravitelj.odjava.bind(htmlUpravitelj));
	server.get("/prijava", htmlUpravitelj.prijava.bind(htmlUpravitelj));
	server.post("/prijava", htmlUpravitelj.prijava.bind(htmlUpravitelj));
	server.get("/getJWT", fetchUpravitelj.getJWT.bind(fetchUpravitelj));
	server.get(
		"/aktivacijaRacuna",
		fetchUpravitelj.aktvacijaRacuna.bind(fetchUpravitelj)
	);
}
