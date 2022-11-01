const today = new Intl.DateTimeFormat('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}).format(new Date());

spanToday = document.querySelector(".today");

spanToday.innerText = today;
