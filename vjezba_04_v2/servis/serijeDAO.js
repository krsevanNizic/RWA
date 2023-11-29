const Baza = require("./baza.js");

class SerijeDAO {
    // ...
  
    async spremiSeriju(odabraniFilm) {
      try {
        console.log("Primljeni podaci:", odabraniFilm);
        const insertSerijaQuery = `
          INSERT INTO serija (naziv, opis, broj_sezona, broj_epizoda, popularnost, putanja_slike, URL)
          VALUES (?, ?, ?, ?, ?, ?, ?);
        `;
        const serijaValues = [
          odabraniFilm.name,
          odabraniFilm.overview,
          odabraniFilm.number_of_seasons,
          odabraniFilm.number_of_episodes,
          odabraniFilm.popularity,
          odabraniFilm.poster_path,
          odabraniFilm.homepage
        ];
  
        await Baza.izvrsiUpitP(insertSerijaQuery, serijaValues);
  
        const seasons = odabraniFilm.seasons;
  
        await Promise.all(seasons.map(async (season) => {
          const insertSezonaQuery = `
            INSERT INTO sezona (naziv, opis, putanja_slike, broj_sezone, broj_epizoda, sezonacol, serija_idSerija)
            VALUES (?, ?, ?, ?, ?, ?, ?);
          `;
          const sezonaValues = [
            season.name,
            season.overview,
            season.poster_path,
            season.season_number,
            season.episode_count,
            season.vote_average,
            this.lastID // ID serije koja je upravo unesena
          ];
  
          // Koristi postojeću instancu Baza za izvršavanje upita
          await Baza.izvrsiUpitP(insertSezonaQuery, sezonaValues);
        }));
  
        console.log('Podaci o seriji i sezonama su uspješno spremljeni.');
      } catch (error) {
        console.error('Greška prilikom spremanja podataka:', error);
        throw error;
      }
    }
  }
  
  module.exports = SerijeDAO;