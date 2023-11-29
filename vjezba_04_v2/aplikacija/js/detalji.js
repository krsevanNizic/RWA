document.addEventListener('DOMContentLoaded', async function () {
    // Dohvati odabrani film iz sessionStorage
    let odgovor = await fetch("http://localhost:12000/getJWT");

    if (odgovor.status === 401) {
        let podaci = await fetch("/baza/tmdb/film?id=" + sessionStorage.odabraniFilm);
        let odabraniFilm = await JSON.parse(await podaci.text());
        console.log(odabraniFilm);

        // Postavi podatke o filmu na stranicu
        document.getElementById("detalji-naslov").innerText = odabraniFilm.name;
        document.getElementById("detalji-opis").innerText = odabraniFilm.overview;
        document.getElementById("detalji-poster").src = 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/' + odabraniFilm.poster_path;
        document.getElementById("detalji-jezik").innerText = 'Jezik: ' + odabraniFilm.original_language;
        document.getElementById("detalji-original-naslov").innerText = 'Originalni naslov: ' + odabraniFilm.name;
        document.getElementById("detalji-datum2").innerText = 'Prva epizoda: ' + odabraniFilm.first_air_date;
        document.getElementById("detalji-broj-sezona").innerText = 'Broj sezona: ' + odabraniFilm.number_of_seasons;
        document.getElementById("detalji-broj-epizoda").innerText = 'Broj epizoda: ' + odabraniFilm.number_of_episodes;

    }else {
        let podaci = await fetch("/baza/tmdb/film?id=" + sessionStorage.odabraniFilm);
        let odabraniFilm = await JSON.parse(await podaci.text());
        document.getElementById("detalji-naslov").innerText = odabraniFilm.name;
        document.getElementById("detalji-opis").innerText = odabraniFilm.overview;
        document.getElementById("detalji-poster").src = 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/' + odabraniFilm.poster_path;
        document.getElementById("detalji-jezik").innerText = 'Jezik: ' + odabraniFilm.original_language;
        document.getElementById("detalji-original-naslov").innerText = 'Originalni naslov: ' + odabraniFilm.name;
        document.getElementById("detalji-datum2").innerText = 'Prva epizoda: ' + odabraniFilm.first_air_date;
        document.getElementById("detalji-broj-sezona").innerText = 'Broj sezona: ' + odabraniFilm.number_of_seasons;
        document.getElementById("detalji-broj-epizoda").innerText = 'Broj epizoda: ' + odabraniFilm.number_of_episodes;

        const seasons = odabraniFilm.seasons;

        
        seasons.forEach((season) => {
            const seasonElement = document.createElement("div");
        
            // Dodaj HTML za prikaz informacija o sezoni
            seasonElement.innerHTML = `
                <h2>Sezona ${season.season_number}</h2>
                <p>Datum premijere: ${season.air_date}</p>
                <p>Broj epizoda: ${season.episode_count}</p>
                <p>Opis: ${season.overview}</p>
                <img src='https://image.tmdb.org/t/p/w600_and_h900_bestv2/${season.poster_path}' alt='Poster sezona ${season.season_number}'>
        
                <!-- Dodajte ovaj dio ako želite prikazati ocjenu sezona -->
                <p>Ocjena: ${season.vote_average}</p>
            `;
        
            document.getElementById("detalji-container").appendChild(seasonElement);
    });
        }
    });