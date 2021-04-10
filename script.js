window.addEventListener('load', function () {
    var existingHistory;
    if (!JSON.parse(localStorage.getItem('history'))) {
      existingHistory = [];
    } else {
      existingHistory = JSON.parse(localStorage.getItem('history'));
    }

  var historyItems = [];

  function getForecast(searchValue) {
    if (!searchValue) {
      return;
    }
    var endpoint = `http://api.openweathermap.org/data/2.5/forecast?q=${searchValue}&appid=d91f911bcf2c0f925fb6535547a5ddc9&units=imperial`;
    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
       
    var forecastEl = document.querySelector('#forecast');
        forecastEl.innerHTML = '<h4 class="mt-3">5-Day Forecast:</h4>';

   forecastRowEl = document.createElement('div');
   forecastRowEl.className = '"row"';
    for (var i = 0; i < data.list.length; i++) {
    if (data.list[i].dt_txt.indexOf('15:00:00') !== -1) {
    var colEl = document.createElement('div');
    colEl.classList.add('col-md-2');
    var cardEl = document.createElement('div');
    cardEl.classList.add('card', 'bg-primary', 'text-white');
    var windEl = document.createElement('p');
    windEl.classList.add('card-text');
    windEl.textContent = `Wind Speed: ${data.list[i].wind.speed} MPH`;
    var humidityEl = document.createElement('p');
    humidityEl.classList.add('card-text');
    humidityEl.textContent = `Humidity : ${data.list[i].main.humidity} %`;
    var bodyEl = document.createElement('div');
    bodyEl.classList.add('card-body', 'p-2');
    var jotoQueLea = document.createElement('h5');
    jotoQueLea.classList.add('card-title');
    jotoQueLea.textContent = new Date(
    data.list[i].dt_txt
    ).toLocaleDateString();
    var imgEl = document.createElement('img');
    imgEl.setAttribute(
    'src',
    `http://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png`);
    var p1El = document.createElement('p');
    p1El.classList.add('card-text');
    p1El.textContent = `Temp: ${data.list[i].main.temp_max} °F`;
    var p2El = document.createElement('p');
    p2El.classList.add('card-text');
    p2El.textContent = `Humidity: ${data.list[i].main.humidity}%`;

    colEl.appendChild(cardEl);
     bodyEl.appendChild(jotoQueLea);
     bodyEl.appendChild(imgEl);
     bodyEl.appendChild(windEl);
     bodyEl.appendChild(humidityEl);
     bodyEl.appendChild(p1El);
     bodyEl.appendChild(p2El);
     cardEl.appendChild(bodyEl);
    forecastEl.appendChild(colEl);
    }
    }
    });
}
    
function getUVIndex(lat, lon) {
fetch(`http://api.openweathermap.org/data/2.5/uvi?appid=d91f911bcf2c0f925fb6535547a5ddc9&lat=${lat}&lon=${lon}`)
 .then((res) => res.json())
 .then((data) => {
 var bodyEl = document.querySelector('.card-body');
 var uvEl = document.createElement('p');
 uvEl.id = 'uv';
 uvEl.textContent = 'UV Index: ';
 var buttonEl = document.createElement('span');
 buttonEl.classList.add('btn', 'btn-sm');
 buttonEl.innerHTML = data.value;

 switch (data.value) {
    case data.value < 3:
    buttonEl.classList.add('btn-success');
    break;
    case data.value < 7:
    buttonEl.classList.add('btn-warning');
    break;
    default:
    buttonEl.classList.add('btn-danger');
    }
bodyEl.appendChild(uvEl);
uvEl.appendChild(buttonEl);
});
}

  const handleHistory = (term) => {
    if (existingHistory && existingHistory.length > 0) {
     var existingEntries = JSON.parse(localStorage.getItem('history'));
     var newHistory = [...existingEntries, term];
     localStorage.setItem('history', JSON.stringify(newHistory));
    } else {
      historyItems.push(term);
      localStorage.setItem('history', JSON.stringify(historyItems));
    }
};

function searchWeather(searchValue) {
 var endpoint = `http://api.openweathermap.org/data/2.5/weather?q=${searchValue}&appid=d91f911bcf2c0f925fb6535547a5ddc9&units=imperial`;
 fetch(endpoint)
 .then((res) => res.json())
 .then((data) => {
    if (!existingHistory.includes(searchValue)) {
          handleHistory(searchValue);
        }
    todayEl = document.querySelector('#today');
    todayEl.textContent = ' ';

var jotoQueLea = document.createElement('h3');
 jotoQueLea.classList.add('card-title');
 jotoQueLea.textContent = `${
 data.name
 } (${new Date().toLocaleDateString()})`;
 var cardEl = document.createElement('div');
 cardEl.classList.add('card');
 var windEl = document.createElement('p');
 windEl.classList.add('card-text');
 var humidEl = document.createElement('p');
 humidEl.classList.add('card-text');
 var tempEl = document.createElement('p');
 tempEl.classList.add('card-text');
 humidEl.textContent = `Humidity: ${data.main.humidity} %`;
 tempEl.textContent = `Temperature: ${data.main.temp} °F`;
 var cardBodyEl = document.createElement('div');
 cardBodyEl.classList.add('card-body');
 var imgEl = document.createElement('img');
 imgEl.setAttribute('src',`http://openweathermap.org/img/w/${data.weather[0].icon}.png`);

 jotoQueLea.appendChild(imgEl);
 cardBodyEl.appendChild(jotoQueLea);
 cardBodyEl.appendChild(tempEl);
 cardBodyEl.appendChild(humidEl);
 cardBodyEl.appendChild(windEl);
 cardEl.appendChild(cardBodyEl);
 todayEl.appendChild(cardEl);

 getForecast(searchValue);
 getUVIndex(data.coord.lat, data.coord.lon);
});
}

function makeRow(searchValue) {
 var liEl = document.createElement('li');
 liEl.classList.add('list-group-item', 'list-group-item-action');
 liEl.id = searchValue;
 var text = searchValue;
 liEl.textContent = text;

 liEl.addEventListener('click', (e) => {
  if (e.target.tagName === 'LI') {
  searchWeather(e.target.textContent);
}
});
document.getElementById('history').appendChild(liEl);
}

if (existingHistory && existingHistory.length > 0) {
    existingHistory.forEach((item) => makeRow(item));
  }

function getSearchVal() {
 var searchValue = document.querySelector('#search-value').value;
 if (searchValue) {
 searchWeather(searchValue);
 makeRow(searchValue);
 document.querySelector('#search-value').value = '';
}
}

document
.querySelector('#search-button')
.addEventListener('click', getSearchVal);
});