// Fetch Student asynchronously

    document.getElementById('students').addEventListener('click', async(e)=>{
            e.preventDefault();

            try {
                const response = await fetch('http://localhost:3000/admin/students');
                if (!response.ok) {
                    alert(`Failed to attain view: ${response.status}`);
                    return;
                }
                const data = await response.json();
                
                const dynamicContent = document.getElementById('content');
                dynamicContent.innerHTML = '';
                dynamicContent.innerHTML = data;
                // console.log(data);
            } catch(err) {
                console.error(err.message);
            }
});

// Fetch Student asynchronously


// Fetch Teacher asynchronously 
    document.getElementById('teacher').addEventListener('click', async(e)=>{
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:3000/admin/teacher");
            if (!response.ok){
                alert(`Error: ${response.status}`);
                return;
            }
            const data = await response.json();
            const dynamicContent = document.getElementById('content');
            dynamicContent.innerHTML = '';
            dynamicContent.innerHTML = data;
        } catch(err) {
            console.error(`Error: ${err.message}`);
        }
    });

// Fetch Teacher asynchronously


// Fetch Calendar asynchronously

document.querySelector('.calendar').addEventListener('click', async(e)=>{
    e.preventDefault();

    try {
        const response = await fetch("http://localhost:3000/admin/calendar");
        if (!response.ok){
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
        editable: true,
        });
        calendar.render();

    } catch(err) {
            console.error(`Error: ${err.message}`);
    }
});

// Fetch Calendar asynchronously


// Fetch Settings asynchronously

document.getElementById('settings').addEventListener('click', async(e)=>{
    e.preventDefault();

    try {
        const response = await fetch("http://localhost:3000/admin/settings");
        if (!response.ok) {
            alert(`Error: ${response.status}`);
            return;
        }

        const data = await response.json();
        const dynamicContent = document.getElementById('content');
        dynamicContent.innerHTML = '';
        dynamicContent.innerHTML = data;
    } catch (err) {
        console.error(`Error: ${err.message}`);
    }
});

// Fetch Settings asynchronously


// Fetch Logout asynchronously 

document.getElementById('logout').addEventListener('click', async(e)=> {
    e.preventDefault();

    try {
        const response = await fetch("http://localhost:3000/admin/logout");
        if (!response.ok) {
            alert(`Error: ${response.status}`);
            return;
        }

        const data = await response.json();
        const dynamicContent = document.getElementById('content');
        dynamicContent.innerHTML = '';
        dynamicContent.innerHTML = data;
    } catch(err) {
        console.error(`Error: ${err.message}`);
    }
});

// Fetch Logout asynchronously


// Fetch Add asynchronously

document.getElementById('add').addEventListener('click', async(e)=>{
    e.preventDefault();

    try {
        const response = await fetch("http://localhost:3000/admin/add");
        if (!response.ok){
            alert(`Error: ${response.status}`);
            return;
        } 

        const data = await response.json();
        const dynamicContent = document.getElementById('content');
        dynamicContent.innerHTML = '';
        dynamicContent.innerHTML = data;
    } catch (err) {
        console.error(`Error: ${err.message}`);
    }
});

// Fetch Add asynchronously