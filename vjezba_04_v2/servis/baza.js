const SQLite = require("sqlite3").Database;

class Baza {
	constructor(putanjaSQLliteDatoteka) {
		this.vezaDB = new SQLite(putanjaSQLliteDatoteka);
		this.putanjaSQLliteDatoteka = putanjaSQLliteDatoteka;
		this.vezaDB.exec("PRAGMA foreign_keys = ON;");
	}

    spojiSeNaBazu(){
		this.vezaDB = new SQLite(this.putanjaSQLliteDatoteka);
		this.vezaDB.exec("PRAGMA foreign_keys = ON;");
    }
    
    izvrsiUpitP(sql, podaciZaSQL, povratnaFunkcija) {
		this.vezaDB.all(sql, podaciZaSQL, povratnaFunkcija);
	}


   
    izvrsiUpit(sql,podaciZaSQL){
        try {
            return new Promise((uspjeh,neuspjeh)=>{
                this.vezaDB.all(sql,podaciZaSQL,(greska,rezultat)=>{
                    if(greska)
                        console.log("greska");
                    else    
                        uspjeh(rezultat);
                });
            });
        } catch (error) {
            console.log(error);
        }
        
    }

    zatvoriVezu() {
		this.vezaDB.close();
	}
}

module.exports = Baza;
