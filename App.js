import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Image,
} from "react-native";
import sun from "./img/sun.png";

export default function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const apiKey = "2QOVyWSNAEqBA3pza57LB5DIY07VMuPQ";
  const baseUrl = "http://dataservice.accuweather.com/";

  const getFormattedDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}`; //if i wanna
  };

  const getClima = () => {
    // Reset weatherData to avoid previous data sticking around during the fetch
    setWeatherData(null);

    let locationKey;
    let locationData;
    let currentConditionsData;

    // Fetch data from the first endpoint
    fetch(
      `${baseUrl}locations/v1/cities/search?q=${city}&apikey=${apiKey}&language=pt-br`
    )
      .then((response) => response.json())
      .then((data) => {
        locationData = data[0];
        locationKey = locationData.Key;
        console.log("First Endpoint Data:", locationData);

        // Fetch data from the second endpoint
        return fetch(
          `${baseUrl}currentconditions/v1/${locationKey}?apikey=${apiKey}`
        );
      })
      .then((response) => response.json())
      .then((data) => {
        currentConditionsData = data; // Assign data to currentConditionsData
        console.log("Second Endpoint Data:", currentConditionsData);

        // Fetch data from the third endpoint
        return fetch(
          `${baseUrl}forecasts/v1/daily/1day/${locationKey}?apikey=${apiKey}&language=pt-br&details=true`
        );
      })
      .then((response) => response.json())
      .then((forecastData) => {
        console.log("Third Endpoint Data:", forecastData);

        // Merge data from the third endpoint into weatherData
        setWeatherData({
          locationData,
          currentConditionsData: currentConditionsData[0],
          forecastData: forecastData[0],
        });
      })
      .catch((error) => {
        console.error("Error fetching weather:", error);
      });
  };

  const isDayTime = weatherData?.IsDayTime || false;
  const dayAndMonth = weatherData
    ? getFormattedDate(
        weatherData.currentConditionsData.LocalObservationDateTime
      )
    : "";

  return (
    <View style={styles.container}>
      <View style={styles.pesquisa}>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setCity(text)}
          value={city}
          placeholder="Enter city name"
        />
        <Pressable style={styles.button} onPress={getClima}>
          <Text style={styles.text}>Search!</Text>
        </Pressable>
      </View>
      <View style={styles.hello}>
        {weatherData && (
          <>
            <Text style={styles.hi}>
              Hi, {weatherData.locationData.EnglishName},{" "}
              {weatherData.locationData.Country.LocalizedName}
            </Text>
            <Text style={styles.have}>
              {isDayTime ? "Have a good day" : "Have a good night"}
            </Text>
          </>
        )}
      </View>
      <View style={styles.weatherContainer}>
        {weatherData && (
          <>
            <Image source={sun} style={styles.weatherIcons} />
            <Text style={styles.tempText}>
              {weatherData.currentConditionsData.Temperature.Metric.Value}C°
            </Text>
            <Text style={styles.weatherText}>
              {weatherData.currentConditionsData.WeatherText}
            </Text>
          </>
        )}
        {weatherData && (
          <Text style={styles.weatherText}>Day {dayAndMonth}</Text>
        )}
      </View>
      <View style={styles.infos}>
        <View>{weatherData && <Text>Sunrise {weatherData.Sun}</Text>}</View>
        <View>{weatherData && <Text>Sunset{weatherData.Sun}</Text>}</View>
      </View>
      <View style={styles.infos}>
        <View>
          {weatherData && <Text>Air Quality{weatherData.Category}</Text>}
        </View>
        <View>{weatherData && <Text>Humidity{weatherData.Sun}</Text>}</View>
      </View>
      <View style={styles.infos}>
        <View>{weatherData && <Text>Preciptation{weatherData.Sun}</Text>}</View>
        <View>{weatherData && <Text>CLIMA %{weatherData.Sun}</Text>}</View>
      </View>
    </View>
  );
}

// {isDayTime ? `weatherData.forecastData.Sun.Set` : `weatherData.forecastData.Moon.Set`}
const styles = StyleSheet.create({
  container: {},

  pesquisa: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingTop: 50,
    paddingLeft: 30,
  },
  input: {
    height: 40,
    width: 220,
    borderColor: "gray",
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  hi: {
    fontSize: 17,
  },
  have: {
    fontSize: 25,
  },
  weatherContainer: {
    marginTop: 50,
    alignItems: "center",
  },
  tempText: {
    marginTop: 15,
    fontSize: 50,
  },
  weatherText: {
    fontSize: 25,
  },
  button: {
    marginLeft: 10,
    width: 80,
    height: 40,
    backgroundColor: "#453264",
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    color: "#FBEAFF",
  },
  hello: {
    paddingTop: 20,
    paddingLeft: 30,
  },
  weatherIcons: {
    width: 275,
    height: 275,
  },
  infos: {
    marginTop: 30,
    justifyContent: "space-around",
    flexDirection: "row",
  },
});
