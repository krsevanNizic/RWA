const portRest = 12000;
const url = "http://localhost:" + portRest + "/baza";
const kodovi = require("./moduli/kodovi.js");
class FilmoviZanroviPretrazivanje {
	async dohvatiFilmove(stranica, kljucnaRijec = "") {
		let putanja =
			url + "/tmdb/filmovi?stranica=" + stranica + "&trazi=" + kljucnaRijec;
		console.log(putanja);
		let odgovor = await fetch(putanja);
		let podaci = await odgovor.text();
		let filmovi = JSON.parse(podaci);
		console.log(filmovi);
		return filmovi;
	}

	async dohvatiFilm(id)
	{
		let putanja = url + "/tmdb/film?id=" +id; 
		console.log(putanja);
		let odgovor = await fetch(putanja);
		let podaci = await odgovor.text();
		let film = JSON.parse(podaci);
		console.log(film);
		return film;
	}


	async dohvatiSveZanrove() {
		//TODO čitaj iz ispravnog servisa
		let odgovor = await fetch(url + "/tmdb/zanr");
		let podaci = await odgovor.text();
		console.log(podaci);
		let zanrovi = JSON.parse(podaci).genres;
		return zanrovi;
	}

	async dohvatiNasumceFilm(zanr) {
		//TODO čitaj iz ispravnog servisa
		let odgovor = await fetch(url + "/tmdb/filmovi?stranica=1&trazi=love");
		let podaci = await odgovor.text();
		let filmovi = JSON.parse(podaci);
		let rez = [
			filmovi.results[kodovi.dajNasumceBroj(0, 20)],
			filmovi.results[kodovi.dajNasumceBroj(0, 20)],
		];
		return rez;
	}
}

module.exports = FilmoviZanroviPretrazivanje;
