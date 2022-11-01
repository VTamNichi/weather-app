const dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'long'}).format(new Date());
const today = new Intl.DateTimeFormat('en-US', {year: 'numeric', month: 'long', day: 'numeric'}).format(new Date());

day = document.querySelector(".day");
date = document.querySelector(".date");

day.innerText = dayOfWeek;
date.innerText = today;

weatherPart1 = document.querySelector(".weather-part1");
weatherPart1.style.display = "none";

infoTxt = document.querySelector(".weather-part2");
inputField = document.querySelector(".input-location");
locationBtn = document.querySelector(".get-your-location");
wIcon = document.querySelector(".weather-icon");
let api;

inputField.addEventListener("keyup", e =>{
    // if user pressed enter btn and input value is not empty
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", () =>{
    if(navigator.geolocation){ // if browser support geolocation api
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }else{
        alert("Your browser not support geolocation api");
    }
});

function requestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=5a5fabfc588312f2713300895eef862c`;
    fetchData();
}

function onSuccess(position){
    const {latitude, longitude} = position.coords; // getting lat and lon of the user device from coords obj
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=5a5fabfc588312f2713300895eef862c`;
    fetchData();
}

function onError(error){
    weatherPart1.style.display = "none";
    infoTxt.style.display = "block";
    // if any error occur while getting user location then we'll show it in infoText
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function fetchData(){
    weatherPart1.style.display = "none";
        infoTxt.style.display = "block";
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");
    // getting api response and returning it with parsing into js obj and in another 
    // then function calling weatherDetails function with passing api result as an argument
    fetch(api).then(res => res.json()).then(result => weatherDetails(result)).catch(() =>{
        infoTxt.innerText = "Something went wrong";
        infoTxt.classList.replace("pending", "error");
    });
}

function weatherDetails(info){
    if(info.cod == "404"){ // if user entered city name isn't valid
        weatherPart1.style.display = "none";
        infoTxt.style.display = "block";
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputField.value} isn't a valid city name`;
    }else{
        weatherPart1.style.display = "block";
        infoTxt.style.display = "none";
        //getting required properties value from the whole weather information
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {temp, feels_like, humidity} = info.main;

        // using custom weather icon according to the id which api gives to us
        if(id == 800){
            wIcon.src = "images/icons/icon-1.svg";
        }else if(id >= 200 && id <= 232){
            wIcon.src = "images/icons/icon-12.svg";  
        }else if(id >= 600 && id <= 622){
            wIcon.src = "images/icons/icon-14.svg";
        }else if(id >= 701 && id <= 781){
            wIcon.src = "images/icons/icon-7.svg";
        }else if(id >= 801 && id <= 804){
            wIcon.src = "images/icons/icon-5.svg";
        }else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)){
            wIcon.src = "images/icons/icon-13.svg";
        }
        
        //passing a particular weather info to a particular element
        document.querySelector(".num").innerHTML = (parseInt(Math.floor(temp)) - 273) + "<sup>o</sup>C";
        document.querySelector(".weather").innerText = description;
        document.querySelector(".location").innerHTML = "<span><img src='images/icon-marker.png' alt=''></span>" + `${city}, ${country}`;
        document.querySelector(".feel-like").innerHTML = "<i class='bx bxs-thermometer'></i>" + (parseInt(Math.floor(feels_like)) - 273) + "°C, Feels like";
        document.querySelector(".humidity").innerHTML = "<i class='bx bxs-droplet-half'></i>" + `${humidity}%` + ", Humidity";
        infoTxt.classList.remove("pending", "error");
        infoTxt.innerText = "";
        inputField.value = "";
    }
}
