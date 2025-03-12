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
const handleFormSubmit = async(formId, url) =>{
   const form = document.getElementById(formId);
   form.addEventListener('submit', async(e)=> {
      e.preventDefault();

      const formData = new FormData(form);
      const clientData = {};

      for (let [key, value] of formData.entries()){
         clientData[key] = value;
      }

      console.log('Submitting form data: ', clientData);

      try {
         const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(clientData), 
            credentials: 'include',
         });

         const data = await response.json();
         if(!response.ok) throw new Error(data.message || `Error: ${response.status}`);

         console.log('Success', data);
         if(data.redirectTo) window.location.href = data.redirectTo;

      } catch(err) {
         console.error(`Request failed: ${err.message}`);
         alert(`Operation failed: ${err.message}`);
      }
   });
};

document.addEventListener('DOMContentLoaded', ()=> {
   handleFormSubmit('login-form', 'http://localhost:3000/admin/login');
   handleFormSubmit('register-form', 'http://localhost:3000/admin/signup');
})