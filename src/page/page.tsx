"use client";
import Image from "next/image";
import DesktopBackground from "../assets/thunderstorm-countryside.jpg";
import logo from "../assets/logo.svg";
import cloud from "../assets/Cloudy.png";
import { useState, useEffect } from "react";
import { Roboto } from "@next/font/google";

// Load Roboto font with weights
const roboto = Roboto({
  weight: ["400", "700"], // Regular and Bold
  subsets: ["latin"], // Ensures proper character set for Latin languages
});

export default function Home() {
  const [weatherData, setWeatherData] = useState<any>();
  const [cityName, setCityName] = useState<string>("");
  const [searchCity, setSearchCity] = useState<string>("");

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const apikey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;



  // Get user location (latitude and longitude)
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setError(null); // Clear any previous errors
        },
        () => {
          setError("Unable to retrieve your location");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
    }
  };

  // Search by location (latitude and longitude)
  const searchByLocation = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apikey}`
      );
      const data = await response.json();
      setCityName(data?.name);
      setWeatherData(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Search by city name
  const searchByCityName = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${apikey}`
      );
      const data = await response.json();
      setCityName(data?.name);
      setWeatherData(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch weather data when location changes
  useEffect(() => {
    if (latitude && longitude) {
      searchByLocation();
    }
  }, [latitude, longitude]);

  // Fetch location when component mounts
  useEffect(() => {
    getLocation();
  }, []);


  // current data and time 
  // Function to add leading zero to single digit numbers
const addLeadingZero = (num: number): string => (num < 10 ? `0${num}` : `${num}`);

const formatDate = (): string => {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const monthsOfYear = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const currentDate = new Date();

  let hours = currentDate.getHours();
  const minutes = addLeadingZero(currentDate.getMinutes());
  const dayName = daysOfWeek[currentDate.getDay()];
  const day = currentDate.getDate();
  const monthName = monthsOfYear[currentDate.getMonth()];
  const year = currentDate.getFullYear().toString().slice(-2); // Get last 2 digits of the year

  // Convert 24-hour time to 12-hour format and determine AM/PM
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // If hours is 0, set it to 12 (midnight or noon)
  const formattedHours = addLeadingZero(hours);

  return `${formattedHours}:${minutes} ${ampm} - ${dayName}, ${day} ${monthName} '${year}`;
};


  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    // Set the initial time when component mounts
    setCurrentTime(formatDate());

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(formatDate());
    }, 60000);

    // Cleanup the timer when the component is unmounted
    return () => clearInterval(timer);
  }, []);


  return (
    <div
      className={`relative w-screen h-screen bg-cover bg-center flex ${roboto.className}`}
      style={{
        backgroundImage: `url(${DesktopBackground.src})`,
      }}
    >
      {/* Transparent overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40"></div>

      {/* Main weather content */}
      <div className="relative z-10 flex w-full h-full p-10 text-white justify-between">
        {/* Left section: Logo, Temperature, and City Info */}
        <div className="flex flex-col justify-between h-full w-2/3">
          <Image
            className="w-[90px] h-[47px] rounded-full object-cover"
            src={logo}
            alt="Weather App Logo"
          />
          <div className="flex gap-[10px] items-center">
            <h1 className="text-[146px] font-[400]">{weatherData ? `${weatherData?.main?.temp}°` : "Loading..."}</h1>
            <div>
              <div className="text-[60px] font-[400]">{cityName || "Unknown City"}</div>
              <div className="text-[18px] font-[400]">
                {currentTime}
              </div>
            </div>
            <Image src={cloud} alt="cloud" />
          </div>
        </div>

        {/* Right section: Weather Details */}
        <div className="w-1/3 bg-white bg-opacity-20 backdrop-blur-md p-8 rounded-lg space-y-6">
          {/* Search Bar */}
          <div className="flex justify-between items-center border-b border-white pb-4">
            <input
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="bg-transparent w-full placeholder-white text-white focus:outline-none"
              placeholder="Search Location..."
            />
            <span
              onClick={searchByCityName}
              className="material-icons text-white ml-4 cursor-pointer"
            >
              search
            </span>
          </div>
          
          

          {/* Weather Details */}
          <div>
            <h2 className="text-[18px] font-[400]">Weather Details...</h2>
            <p className="text-[18px] font-[500] mt-2">
              {weatherData ? `${weatherData?.weather?.[0]?.description || "NA"}` : "Loading..."}
            </p>
            <div className="flex text-[18px] font-[400] flex-col space-y-3 mt-4">
              <div className="flex justify-between">
                <span>Temp max</span>
                <span>{weatherData ? `${weatherData?.main?.temp_max || 'NA'}°` : "Loading..."}</span>
              </div>
              <div className="flex justify-between">
                <span>Temp min</span>
                <span>{weatherData ? `${weatherData?.main?.temp_min || "NA"}°` : "Loading..."}</span>
              </div>
              <div className="flex justify-between">
                <span>Humidity</span>
                <span>{weatherData ? `${weatherData?.main?.humidity || "NA"}%` : "Loading..."}</span>
              </div>
              <div className="flex justify-between">
                <span>Cloudy</span>
                <span>{weatherData ? `${weatherData?.clouds?.all || "NA"}` : "Loading..."}</span>
              </div>
              <div className="flex justify-between">
                <span>Wind</span>
                <span>{weatherData ? `${weatherData?.wind?.speed || "NA"} Km/h` : "Loading..."}</span>
              </div>
            </div>
          </div>
          <div className="w-full h-[1px] bg-white"></div>

          {/* Today's Forecast */}
          <div className="mt-10">
            <h2 className="text-[18px] font-[400]">
              Today's Weather Forecast...
            </h2>
            <div className="flex space-x-4 mt-4">
              <div className="flex flex-col items-center">
                <span className="text-lg">09:00</span>
                <span className="text-lg">Snow</span>
                <span className="text-lg">19°</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-lg">09:00</span>
                <span className="text-lg">Rain</span>
                <span className="text-lg">15°</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
