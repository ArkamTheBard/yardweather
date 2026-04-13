import { Component, OnDestroy, OnInit } from '@angular/core';

import { environment } from '../environments/environment';

import { WeatherLocation } from './weatherLocation';

interface ForecastEntry {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
}

interface ForecastResponse {
  list: ForecastEntry[];
}

interface ForecastDay {
  dayLabel: string;
  icon: string;
  summary: string;
  high: number;
  low: number;
}

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'yardweather';
  terminalText = '';

  constructor() { }

  userLocation: WeatherLocation;
  testClick: boolean = false;
  currentTemp: number;
  currentFeelsLike: number;
  currentTempMax: number;
  currentTempMin: number;
  forecastDays: ForecastDay[] = [];
  private readonly terminalFullText = 'Yard Weather';
  private terminalIntervalId: ReturnType<typeof setInterval> | null = null;

  apiKey = environment.openWeatherApiKey;

  ngOnInit(): void {
    this.startTerminalAnimation();
  }

  ngOnDestroy(): void {
    if (this.terminalIntervalId) {
      clearInterval(this.terminalIntervalId);
    }
  }


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
      this.getForecastAPI(zip, country);
    } catch (e) {
      console.error("Fetch was unsuccessful" + " " + e);
    }
  }

  getForecastAPI = async (zip, country) => {
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?zip=${zip},${country}&units=imperial&appid=${this.apiKey}`;

    try {
      const res = await fetch(forecastURL);
      const data: ForecastResponse = await res.json();

      this.forecastDays = this.buildForecastDays(data.list || []);
    } catch(e) {
      this.forecastDays = [];
      console.error("Forecast fetch was unsuccessful" + " " + e)
    }

  }

  private buildForecastDays(forecastList: ForecastEntry[]): ForecastDay[] {
    const groupedByDay = new Map<string, ForecastEntry[]>();

    forecastList.forEach((entry) => {
      const dayKey = entry.dt_txt.split(' ')[0];

      if (!groupedByDay.has(dayKey)) {
        groupedByDay.set(dayKey, []);
      }

      groupedByDay.get(dayKey)!.push(entry);
    });

    return Array.from(groupedByDay.entries())
      .slice(0, 5)
      .map(([dayKey, entries]) => {
        const middayEntry = entries.reduce((closestEntry, currentEntry) => {
          return this.getHourDistanceFromNoon(currentEntry.dt_txt) < this.getHourDistanceFromNoon(closestEntry.dt_txt)
            ? currentEntry
            : closestEntry;
        }, entries[0]);

        const high = Math.max(...entries.map((entry) => entry.main.temp_max));
        const low = Math.min(...entries.map((entry) => entry.main.temp_min));
        const dayLabel = new Date(`${dayKey}T12:00:00`).toLocaleDateString('en-US', {
          weekday: 'short'
        });

        return {
          dayLabel,
          icon: middayEntry.weather[0].icon,
          summary: middayEntry.weather[0].main,
          high: Math.round(high),
          low: Math.round(low)
        };
      });
  }

  private getHourDistanceFromNoon(dateTimeText: string): number {
    const hour = Number(dateTimeText.split(' ')[1].split(':')[0]);
    return Math.abs(12 - hour);
  }

  private startTerminalAnimation(): void {
    let currentIndex = 0;
    let isDeleting = false;
    let pauseTicks = 0;

    this.terminalIntervalId = setInterval(() => {
      if (pauseTicks > 0) {
        pauseTicks -= 1;
        return;
      }

      if (!isDeleting) {
        currentIndex += 1;
        this.terminalText = this.terminalFullText.slice(0, currentIndex);

        if (currentIndex === this.terminalFullText.length) {
          isDeleting = true;
          pauseTicks = 10;
        }

        return;
      }

      currentIndex -= 1;
      this.terminalText = this.terminalFullText.slice(0, currentIndex);

      if (currentIndex === 0) {
        isDeleting = false;
        pauseTicks = 4;
      }
    }, 120);
  }

}
