document.addEventListener('DOMContentLoaded', async function () {
    let porukaElement = document.getElementById("poruka");
    let sadrzajElement = document.getElementById("sadrzaj");
    let globalPodaci;

    try {
        let odgovor = await fetch("http://localhost:12000/getJWT");

        if (!odgovor.ok) {
            console.error('Neuspješan odgovor sa statusom:', odgovor.status);
            if (porukaElement) {
                porukaElement.innerHTML = "Došlo je do problema prilikom dohvaćanja podataka. Pokušajte ponovno kasnije.";
            }
            return;
        }

        try {
            let tekst = await odgovor.text();
            console.log(tekst);
            let podatci = JSON.parse(tekst);
            globalPodaci = podatci;
            // Prikazivanje podataka unutar HTML-a
            if (sadrzajElement) {
                sadrzajElement.innerHTML = `
                    <p>ID: ${podatci.jwt.id}</p>
                    <p>Ime: ${podatci.jwt.ime}</p>
                    <p>Prezime: ${podatci.jwt.prezime}</p>
                    <p>Korisničko ime: ${podatci.jwt.korime}</p>
                    <p>Email: ${podatci.jwt.email}</p>
                    <p>Država: ${podatci.jwt.drzava || 'Nepoznato'}</p>
                    <p>Datum rođenja: ${podatci.jwt.dob || 'Nepoznato'}</p>
                    <!-- Dodajte ostale informacije koje želite prikazati -->
                `;

               
                document.getElementById("imeInput").value = podatci.jwt.ime;
                document.getElementById("prezimeInput").value = podatci.jwt.prezime;
                document.getElementById("drzavaInput").value = podatci.jwt.drzava;
                document.getElementById("datumRodjenjaInput").value = podatci.jwt.dob;

              

              
                document.getElementById("formaUredivanje").addEventListener("submit", function (event) {
                    event.preventDefault(); 
                
                    
                    azurirajPodatke();
                });

             
                azurirajPutanja = `/baza/korisnici/${podatci.jwt.korime}`;
            }

            if (porukaElement) {
                porukaElement.innerHTML = "";  
            }
        } catch (error) {
            console.error('Došlo je do pogreške prilikom dohvaćanja podataka:', error);
            if (porukaElement) {
                porukaElement.innerHTML = "Došlo je do problema prilikom dohvaćanja podataka. Pokušajte ponovno kasnije.";
            }
        }
    } catch (error) {
        console.error('Došlo je do pogreške prilikom dohvaćanja podataka:', error);
        if (porukaElement) {
            porukaElement.innerHTML = "Došlo je do problema prilikom dohvaćanja podataka. Pokušajte ponovno kasnije.";
        }
    }

    async function azurirajPodatke() {
        // Dohvati ažurirane podatke iz forme
        const novoIme = document.getElementById("imeInput").value;
        const novoPrezime = document.getElementById("prezimeInput").value;
        const novoDrzava = document.getElementById("drzavaInput").value;
        const novoDob = document.getElementById("datumRodjenjaInput").value;
        
        try {
            const odgovor = await fetch(azurirajPutanja, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ime: novoIme,
                    prezime: novoPrezime,
                    dob: novoDob,
                    drzava: novoDrzava,
                }),
            });

            if (odgovor.ok) {
                console.log("Podaci ažurirani uspješno.");
                if (sadrzajElement) {
                    sadrzajElement.innerHTML = `
                        <p>ID: ${globalPodaci.jwt.id}</p>
                        <p>Ime: ${novoIme}</p>
                        <p>Prezime: ${novoPrezime}</p>
                        <p>Korisničko ime: ${globalPodaci.jwt.korime}</p>
                        <p>Email: ${globalPodaci.jwt.email}</p>
                        <p>Država: ${novoDrzava || 'Nepoznato'}</p>
                        <p>Datum rođenja: ${novoDob || 'Nepoznato'}</p>
                        <!-- Dodajte ostale informacije koje želite prikazati -->
                    `;
                }
            } else {
                console.error("Neuspješan zahtjev za ažuriranje:", odgovor.status);
            
            }
        } catch (error) {
            console.error("Došlo je do pogreške prilikom ažuriranja podataka:", error);
        }
    }
});
