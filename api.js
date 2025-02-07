import { useState } from "react";

const baseUrl = "http://localhost:3000/api";
export const useDarkMode = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((prevState) => !prevState);
  return { isEnabled, toggleSwitch };
};

export const fetchAutocompleteSuggestions = async (query) => {
  if (query.length < 3) {
    return [];
  }

  try {
    const response = await fetch(
      `${baseUrl}/locations/autocomplete?q=${query}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const useWeather = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);

  const getFormattedDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}`;
  };

  const getClima = (locationKey) => {
    setWeatherData(null);
    let locationData;
    let currentConditionsData;

    fetch(`${baseUrl}/locations/${locationKey}`)
      .then((response) => response.json())
      .then((data) => {
        if (!data) {
          throw new Error("No location data found");
        }
        locationData = data;
        console.log("First Endpoint Data:", locationData);
        let lat = data.GeoPosition.Latitude;
        let long = data.GeoPosition.Longitude;
        console.log("a latitude é: ", lat);
        console.log("a longitude é: ", long);

        return fetch(
          `${baseUrl}/currentconditions/${locationKey}`
        );
      })
      .then((response) => response.json())
      .then((data) => {
        if (!data || data.length === 0) {
          throw new Error("No current conditions data found");
        }
        currentConditionsData = data;
        console.log("Second Endpoint Data:", currentConditionsData);

        return fetch(
          `${baseUrl}/forecasts/${locationKey}`
        );
      })
      .then((response) => response.json())
      .then((forecastData) => {
        if (
          !forecastData ||
          !forecastData.DailyForecasts ||
          forecastData.DailyForecasts.length === 0
        ) {
          throw new Error("No forecast data found");
        }
        console.log("Third Endpoint Data:", forecastData);

        setWeatherData({
          locationData,
          currentConditionsData: currentConditionsData[0],
          forecastData: forecastData.DailyForecasts[0],
        });
      })
      .catch((error) => {
        console.error("Error fetching weather:", error);
      });
  };

  const isDayTime = weatherData?.currentConditionsData?.IsDayTime || false;
  const dayAndMonth = weatherData
    ? getFormattedDate(
        weatherData.currentConditionsData.LocalObservationDateTime
      )
    : "";

  return { city, setCity, weatherData, getClima, isDayTime, dayAndMonth };
};