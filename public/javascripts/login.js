// Frontend

const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

registerBtn.addEventListener('click', () => {
    container.classList.add('active');
});

loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
});


// Backend 

const fetchAndEnter = async(formButton, route) => {
   document.getElementById(formButton).addEventListener('click', async(e) =>{
      e.preventDefault();

      const email = document.getElementById('email')?.value || '';
      const usernameField = document.getElementById('username');
      const username = usernameField ? usernameField.value : null;
      const password = document.getElementById('password')?.value || null;

      const clientData = { email,password };
      if (username) clientData.username = username;

      try {
         const response = await fetch(`http://localhost:3000/${route}`, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(clientData),
         });

         if (!response.ok) throw new Error(`Error Message: ${response.status}`);

         const data = await response.json();
         alert(`Login Successful, Welcome ${clientData.username}`);
         console.log('Success', data);

      } catch (err) {
         console.error(`Error: ${err.message}`);
         alert(`Login Failed`);
      }

   });
};

document.addEventListener('DOMContentLoaded', ()=>{
   fetchAndEnter('register-form-btn','signup');
   fetchAndEnter('login-form-btn','login');
});
