import { useState, useEffect, useCallback } from "react";

const apiKey = "";
const baseUrl = "http://dataservice.accuweather.com/";

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
      `http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${apiKey}&q=${query}`
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

    fetch(`${baseUrl}locations/v1/${locationKey}?apikey=${apiKey}`)
      .then((response) => response.json())
      .then((data) => {
        if (!data) {
          throw new Error("No location data found");
        }
        locationData = data;
        console.log("First Endpoint Data:", locationData);

        return fetch(
          `${baseUrl}currentconditions/v1/${locationKey}?apikey=${apiKey}&details=true`
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
          `${baseUrl}forecasts/v1/daily/1day/${locationKey}?apikey=${apiKey}&details=true`
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
