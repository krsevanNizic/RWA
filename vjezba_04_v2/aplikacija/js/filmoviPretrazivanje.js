let url = "http://localhost:12000/api";
let poruka = document.getElementById("poruka");


window.addEventListener("load", async () => {
	poruka = document.getElementById("poruka");
	dajFilmove(1);
	document.getElementById("filter").addEventListener("keyup", (event) => {
		dajFilmove(1);
	});
});

async function dajFilmove(str) {
		let parametri = { method: "POST" };
		//parametri = await dodajToken(parametri);
		let odgovor = await fetch(
			"/filmoviPretrazivanje?str=" + str + "&filter=" + dajFilter(),
			parametri
		);
		console.log(odgovor.status);
		if (odgovor.status == 200) { 
			let podaci = await odgovor.text();
			podaci = JSON.parse(podaci);
	
			prikaziFilmove(podaci.results);
			prikaziStranicenje(podaci.page, podaci.total_pages, "dajFilmove");
		}
	};


    

async function dajFilm(id) {
	let parametri = { method: "POST" };
	parametri = await dodajToken(parametri);
	let odgovor = await fetch(
		"/dohvatiFilm?id="+id,
		parametri
	);
	
	if (odgovor.status == 200) { 

		let odg = await JSON.parse(await odgovor.text())
	console.log(odg+"OVO JE LOG")
	return odg
	}
	else {
		poruka.innerHTML = "Greška u dohvatu filma!";
	}
}



function prikaziFilmove(filmovi) {
    let glavna = document.getElementById("sadrzaj");
    let tablica = "<table border=1>";
    tablica += "<tr><th>Naslov</th><th>Opis</th><th>Detalji</th></tr>";
    
    for (let f of filmovi) {
        tablica += "<tr>";
        tablica += "<td>" + f.name + "</td>";
        tablica += "<td>" + f.overview + "</td>";
        tablica += `<td><button onClick='otvoriDetalje(${f.id})'>Detalji</button></td>`;
        tablica += "</tr>";
    }
    
    tablica += "</table>";
    glavna.innerHTML = tablica;

    sessionStorage.dohvaceniFilmovi = JSON.stringify(filmovi);
}

		
async function  otvoriDetalje(film) {
    // Spremi odabrani film u sessionStorage
	console.log(film);

    sessionStorage.odabraniFilm = JSON.parse(film);
	if (sessionStorage.odabraniFilm) {
		console.log(`Ovo je id:${sessionStorage.odabraniFilm.id}`);
	} else {
		console.log("sessionStorage.odabraniFilm nije definiran.");
	}

	console.log(dajFilm("ovo je film" + sessionStorage.odabraniFilm.id));
	sessionStorage.odabraniFilm = film;
	
	console.log(sessionStorage.odabraniFilm);
     //Otvori stranicu "detalji.html" u istom prozoru
    window.location.href = "/detalji";
}


async function dodajUbazu(idFilma) {
	let filmovi = JSON.parse(sessionStorage.dohvaceniFilmovi);
	for (let film of filmovi) {
		if (idFilma == film.id) {
			let parametri = { method: "POST", body: JSON.stringify(film) };
			parametri = await dodajToken(parametri);
			let odgovor = await fetch("/dodajFilm", parametri);
			if (odgovor.status == 200) {
				let podaci = await odgovor.text();
				console.log(podaci);
				poruka.innerHTML = "Film dodan u bazu!";
			} else if (odgovor.status == 401) {
				poruka.innerHTML = "Neautorizirani pristup! Prijavite se!";
			} else {
				poruka.innerHTML = "Greška u dodavanju filmva!";
			}
			break;
		}
	}
}

function dajFilter() {
	let filter = document.getElementById("filter").value
	if (filter.length >= 3){
		return filter;
	}else {
		return filter="";
	}
	
}
