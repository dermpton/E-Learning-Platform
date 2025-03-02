// Fetch Home

document.getElementById('home').addEventListener('click', async(e)=>{
  e.preventDefault();

  try {
    const response = await fetch('http://localhost:3000/student/home');
    if (!response.ok) {
      alert(`Error: ${response.status}`);
      return;
    }

    const data = await response.json();
    const dynamicContent = document.getElementById('content');
    dynamicContent.innerHTML = '';
    console.log(data);
    dynamicContent.innerHTML = data;

  } catch(err) {
    console.error(`Error: ${err.message}`);   
  }
});

// Fetch Home

// Fetch Calendar

document.querySelector('.calendar').addEventListener('click', async(e)=>{
  e.preventDefault();

  try {
    const response = await fetch('http://localhost:3000/student/calendar');
    if (!response.ok) {
      alert(`Error: ${response.status}`);
      return;
    } 

    const data = await response.json();
    const dynamicContent = document.getElementById('content');
    dynamicContent.innerHTML = '';
    dynamicContent.innerHTML = data;

    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
    });
    calendar.render();

  } catch(err) {
    console.error(`Error: ${err.message}`);
  }
});

// Fetch Calendar

