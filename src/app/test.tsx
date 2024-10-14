"use client";
import React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";

// Import the images for responsiveness
import DesktopBackground from "../assets/Home - Desktop.png";
import PhoneBackground from "../assets/Home - Phone.png";
import TabletBackground from "../assets/Home - Tablet.png";

export default function Home() {
  const [windowWidth, setWindowWidth] = useState<number>(0);

  // Function to determine window size for responsive backgrounds
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize); // Update value on resize

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Set responsive background image based on screen size
  const getBackgroundImage = () => {
    if (windowWidth > 1024) {
      return DesktopBackground;
    } else if (windowWidth >= 768 && windowWidth <= 1024) {
      return TabletBackground;
    } else {
      return PhoneBackground;
    }
  };

  return (
    <div
      className="w-screen h-screen flex flex-col justify-center items-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${getBackgroundImage().src})` }}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40"></div>

      <div className="relative z-10 flex flex-col justify-center items-center text-center text-white">
        {/* Main Weather Section */}
        <div className="flex flex-col items-center space-y-4">
          <h1 className="text-7xl font-bold">16°</h1>
          <p className="text-2xl">London</p>
          <p className="text-sm">
            06:09 - Monday, 9 Sep '23
          </p>
          <div className="text-xl mt-4 flex items-center">
            <span className="material-icons">cloud</span>
          </div>
        </div>

        {/* Weather Details */}
        <div className="mt-8 space-y-2">
          <h2 className="text-2xl font-semibold">Weather Details...</h2>
          <p className="text-lg font-bold">THUNDERSTORM WITH LIGHT DRIZZLE</p>

          <div className="flex flex-col space-y-2">
            <div className="flex justify-between">
              <span>Temp max</span>
              <span>19°</span>
            </div>
            <div className="flex justify-between">
              <span>Temp min</span>
              <span>15°</span>
            </div>
            <div className="flex justify-between">
              <span>Humidity</span>
              <span>58%</span>
            </div>
            <div className="flex justify-between">
              <span>Cloudy</span>
              <span>86%</span>
            </div>
            <div className="flex justify-between">
              <span>Wind</span>
              <span>5 km/h</span>
            </div>
          </div>
        </div>

        {/* Today's Weather Forecast */}
        <div className="mt-10 text-left">
          <h2 className="text-lg font-semibold">Today's Weather Forecast...</h2>
          <div className="flex space-x-4">
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
  );
}
