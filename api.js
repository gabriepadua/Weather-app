import { useState } from "react";

const apiKey = "2QOVyWSNAEqBA3pza57LB5DIY07VMuPQ";
const baseUrl = "http://dataservice.accuweather.com/";

export const useDarkMode = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((prevState) => !prevState);
  return { isEnabled, toggleSwitch };
};

export const useWeather = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);

  const getFormattedDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}`;
  };

  const getClima = () => {
    setWeatherData(null);

    let locationKey;
    let locationData;
    let currentConditionsData;

    fetch(`${baseUrl}locations/v1/cities/search?q=${city}&apikey=${apiKey}`)
      .then((response) => response.json())
      .then((data) => {
        locationData = data[0];
        locationKey = locationData.Key;
        console.log("First Endpoint Data:", locationData);

        return fetch(
          `${baseUrl}currentconditions/v1/${locationKey}?apikey=${apiKey}&details=true`
        );
      })
      .then((response) => response.json())
      .then((data) => {
        currentConditionsData = data;
        console.log("Second Endpoint Data:", currentConditionsData);

        return fetch(
          `${baseUrl}forecasts/v1/daily/1day/${locationKey}?apikey=${apiKey}&details=true`
        );
      })
      .then((response) => response.json())
      .then((forecastData) => {
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