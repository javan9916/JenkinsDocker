const express = require('express');
const app = express();

const config = require('./config');
const twitter = require('twitter-lite');
const client = new twitter(config);
const axios = require('axios');

const API_KEY = '37001cc4aa2c17341207775861260aa3';
const lat = '10.403840';
const lng = '-84.213760';


app.get('/', function(req, res) {
    callWeatherAPI();
    res.send("Script executed successfully! \n Check <a href='https://twitter.com/Kodaktree'>@Kodaktree</a> on Twitter...");
})

app.listen(8081, function() {
    console.log('app listening on port 8081!')
})


// Starts calling the Weather API
function callWeatherAPI() {
    getWeatherReport();

    // Call Weather API every 10 minutes
    setTimeout(callWeatherAPI, 60000)
}

// Posts a Tweet with all the Weather data
function postTweet(data) {
    let weather = data.weather[0].main;
    let description = data.weather[0].description;
    let location = data.name;

    let temp = Math.floor(data.main.temp - 273.15);
    let feels = Math.floor(data.main.feels_like - 273.15);
    let humidity = data.main.humidity;

    let msg = `The weather status is: ${weather} (${description}) in ${location}\n`+
    `The temperature is ${temp}°C but feels like ${feels}°C and humidity is ${humidity}%\n`+
    `Timestamp: ${Date.now()}\n#salvandoRedes2022IC`;

    client.post('statuses/update', { status: msg }).then(result => {
        console.log('You successfully tweeted this : "' + result.text + '"');
    }).catch(console.error);
}

// Gets a Weather Report from the API and calls function to post a tweet
function getWeatherReport() {
    axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}`)
    .then(response => response.data)
    .then(data => {
        if (data.cod === 200) {
            postTweet(data);
        } else {
            console.log(`There was some error requesting the data (${data.cod})`);
        }
    })
    .catch(err => {
        console.log(err)
    });
}