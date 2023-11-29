const ds = require("fs/promises");

class Konfiguracija {
	constructor() {
		this.konf = {};
	}
	dajKonf() {
		return this.konf;
	}

	async ucitajKonfiguraciju() {
		console.log(this.konf);
		let podaci = await ds.readFile(process.argv[2], "UTF-8");
		this.konf = pretvoriJSONkonfig(podaci);
		provjeriIspravnostKonfiguracije(this.konf);
		console.log(this.konf);
	}
}

function provjeriIspravnostKonfiguracije(konfiguracija) {
	

	if (!konfiguracija.jwtValjanost || !(konfiguracija.jwtValjanost >= 15 && konfiguracija.jwtValjanost <= 3600)) {
        throw new Error("Neispravan ili nedostaje jwtValjanost. Mora biti broj između 15 i 3600.");
    }

    // Check for missing or invalid jwtTajniKljuc
    /*if (!konfiguracija.jwtTajniKljuc || !/^[a-zA-Z0-9]{50,100}$/.test(konfiguracija.jwtTajniKljuc)) {
        throw new Error("Neispravan ili nedostaje jwtTajniKljuc. Mora biti veličine 50-100 znakova, dozvoljava velika i mala slova te brojke.");
    }

    // Check for missing or invalid tajniKljucSesija
    if (!konfiguracija.tajniKljucSesija || !/^[a-zA-Z0-9]{50,100}$/.test(konfiguracija.tajniKljucSesija)) {
        throw new Error("Neispravan ili nedostaje tajniKljucSesija. Mora biti veličine 50-100 znakova, dozvoljava velika i mala slova te brojke.");
    }*/

    // Check for missing or invalid appStranicenje
    if (!konfiguracija.appStranicenje || !(konfiguracija.appStranicenje >= 5 && konfiguracija.appStranicenje <= 100)) {
        throw new Error("Neispravno ili nedostaje appStranicenje. Mora biti broj između 5 i 100.");
    }
}


function pretvoriJSONkonfig(podaci) {
	console.log(podaci);
	let konf = {};
	var nizPodataka = podaci.split("\n");
	for (let podatak of nizPodataka) {
		var podatakNiz = podatak.split("=");
		var naziv = podatakNiz[0];
		var vrijednost = podatakNiz[1];
		konf[naziv] = vrijednost;
	}
	return konf;
}

module.exports = Konfiguracija;
