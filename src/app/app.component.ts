import { Component } from '@angular/core';

import { WeatherLocation } from './weatherLocation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'yardweather';

  constructor() {}

  userLocation : WeatherLocation;
   testClick : boolean = false;
   currentTemp : number;
   currentFeelsLike : number;
   currentTempMax : number;
   currentTempMin : number;

   apiKey = "2853c97f8ae56953f7edfa8ca7ae4a1a";


  getWeatherAPI = async (zip, country) => {
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?zip=${zip},${country}&units=imperial&appid=${this.apiKey}`;

    try {
      const res = await fetch(weatherURL);
      const data = await res.json();

      const fetchedWeather = data.weather;
      const fetchedMain = data.main;
      const fetchedVisibility = data.visibility;
      const fetchedWind = data.wind;
      const fetchedCloud = data.clouds;
      const fetchedDt = data.dt;
      const fetchedSys = data.sys;
      const fetchedTimeZone = data.timezone;
      const fetchedID = data.id;
      const fetchedName = data.name;

      let tempWeather = new WeatherLocation(fetchedWeather[0], fetchedMain, fetchedVisibility, fetchedWind, fetchedCloud, fetchedDt, fetchedSys, fetchedTimeZone, fetchedID, fetchedName);

      this.userLocation = tempWeather;
      this.currentTemp = Math.round(fetchedMain.temp);
      this.currentFeelsLike = Math.round(fetchedMain.feels_like);
      this.currentTempMax = Math.round(fetchedMain.temp_max);
      this.currentTempMin = Math.round(fetchedMain.temp_min);
      this.testClick = true;
    } catch (e) {
      console.error("Fetch was unsuccessful" + " " + e);
    }
  }     


}
