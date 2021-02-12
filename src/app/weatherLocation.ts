export class WeatherLocation{
    constructor(
        weather : any,
        main : any,
        visibility : any,
        wind : any,
        clouds : any,
        dt : number,
        sys : any,
        timezone : number,
        id : number,
        name : string)
    {
        this.weather = weather;
        this.main = main;
        this.visibility = visibility;
        this.wind = wind;
        this.clouds = clouds;
        this.dt = dt;
        this.sys = sys;
        this.timezone = timezone;
        this.id = id;
        this.name = name;
    }

    weather : any;
    main : any;
    visibility : any;
    wind : any;
    clouds : any;
    dt : number;
    sys : any;
    timezone : number;
    id : number;
    name : string;
}