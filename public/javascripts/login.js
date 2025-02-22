document.querySelector('form').addEventListener('submit', login);

async function login(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, password})
        });

        if (!response.ok) throw new Error(`Error Message: ${response.status}`);
        const json = await response.json();
        console.log('Success', json);
        alert("Login: Success");

    } catch(err){
        console.log(`Error: ${err.message}`);
        alert("Login: Failed");
    }
}