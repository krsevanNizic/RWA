async function odjava() {
    try {
        const odjavaResponse = await fetch('/odjava', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        
        });

        if (odjavaResponse.ok) {
            window.location.href = '/';
        } else {
            console.error('Pogreška prilikom odjave');
        }
    } catch (error) {
        console.error('Neuspješna odjava:', error);
    }
}