var historyListEl = $('#history-list');
var cityInput = $('#city-name');
var searchBtnEl = $('#search');
var longitude = 0;
var latitude = 0;

searchBtnEl.on('click', function(event) {
    event.preventDefault();
    addToHistory();
    getWeather();
})

function addToHistory() {
    var liEl = $('<li></li>');
    liEl.html(cityInput.val());
    historyListEl.append(liEl);
}

String.prototype.replaceAt = function(index, replacement) {
        return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

function getWeather() {
    var inputCityName = cityInput.val();
    
    for(var i = 0; i < inputCityName.length; i++){
        if(inputCityName.charAt(i) == ' '){
            inputCityName = inputCityName.replaceAt(i+1,  inputCityName.charAt(i+1).toLowerCase());
            inputCityName = inputCityName.replaceAt(i, '-');
        }
    }

    fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + inputCityName + ',US&limit=5&appid=be494bca977f23d851a98891f453fb89')
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            longitude = data[0].lon;
            latitude = data[0].lat;
        })
}

