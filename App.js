import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Image,
  ImageBackground,
  Switch,
} from "react-native";

import { ensolarado } from "./img/weather/ensolarado.png";

export default function App() {
  // função de modo dark
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
  };
  // config para a api
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const apiKey = "2QOVyWSNAEqBA3pza57LB5DIY07VMuPQ";
  const baseUrl = "http://dataservice.accuweather.com/";

  const getFormattedDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}`;
  };

  const imageMap = {
    sun: require("./img/weather/ensolarado.png"),
    sol: require("./img/weather/ensolarado.png"),
    sol: require("./img/weather/ensolarado.png"),
    sol: require("./img/weather/ensolarado.png"),
    sol: require("./img/weather/ensolarado.png"),
    sol: require("./img/weather/ensolarado.png"),
    sol: require("./img/weather/ensolarado.png"),
    sol: require("./img/weather/ensolarado.png"),
  };

  const getClima = () => {
    // Reset weatherData to avoid previous data sticking around during the fetch
    setWeatherData(null);

    let locationKey;
    let locationData;
    let currentConditionsData;

    // Fetch data from the first endpoint
    fetch(`${baseUrl}locations/v1/cities/search?q=${city}&apikey=${apiKey}`)
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
          `${baseUrl}forecasts/v1/daily/1day/${locationKey}?apikey=${apiKey}&details=true`
        );
      })
      .then((response) => response.json())
      .then((forecastData) => {
        console.log("Third Endpoint Data:", forecastData);

        // Merge data from the third endpoint into weatherData
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

  const isDayTime = weatherData?.IsDayTime || false;
  const dayAndMonth = weatherData
    ? getFormattedDate(
        weatherData.currentConditionsData.LocalObservationDateTime
      )
    : "";

  return (
    <ImageBackground
      source={
        isEnabled
          ? require("./img/bg/bg-dark.png")
          : require("./img/bg/bg-light.png")
      }
      style={styles.image}
    >
      <View style={styles.container}>
        <View style={styles.pesquisa}>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setCity(text)}
            value={city}
            placeholder="Digite sua cidade"
          />
          <Pressable style={styles.button} onPress={getClima}>
            <Text style={styles.text}>Procurar!</Text>
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
                {isDayTime ? "Bom dia" : "Boa noite"}
              </Text>
            </>
          )}
        </View>
        <View style={styles.weatherContainer}>
          {weatherData && (
            <>
              <Image source={ensolarado} style={styles.weatherIcons} />
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
        <View style={styles.column0}>
          <View style={styles.column1}>
            <View style={styles.infoContainer}>
              <Image
                source={
                  isEnabled
                    ? require("./img/icons/iconsdark/icon-nascer-dark.png")
                    : require("./img/icons/iconslight/icon-nascer-light.png")
                }
                style={styles.littleIcon}
              />
              <View>
                <Text>Nascer do Sol</Text>
                {weatherData && (
                  <Text>
                    {weatherData.forecastData.Sun.Rise.substring(11, 16)}
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.infoContainer}>
              <Image
                source={
                  isEnabled
                    ? require("./img/icons/iconsdark/icon-vento-dark.png")
                    : require("./img/icons/iconslight/icon-vento-light.png")
                }
                style={styles.littleIcon}
              />
              <View>
                <Text>Qualidade do ar</Text>
                {weatherData && (
                  <Text>
                    {weatherData.forecastData.AirAndPollen[0].Category}
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.infoContainer}>
              <Image
                source={
                  isEnabled
                    ? require("./img/icons/iconsdark/icon-vel-dark.png")
                    : require("./img/icons/iconslight/icon-vel-light.png")
                }
                style={styles.littleIcon}
              />
              <View>
                <Text>Velocidade do vento</Text>

                {weatherData && (
                  <Text>
                    {(
                      weatherData.forecastData.Day.Wind.Speed.Value * 1.60934
                    ).toFixed(2)}{" "}
                    km/h
                  </Text>
                )}
              </View>
            </View>
          </View>

          <View style={styles.column2}>
            <View style={styles.infoContainer}>
              <Image
                source={
                  isEnabled
                    ? require("./img/icons/iconsdark/icon-por-dark.png")
                    : require("./img/icons/iconslight/icon-por-light.png")
                }
                style={styles.littleIcon}
              />
              <View>
                <Text>Pôr do Sol</Text>
                {weatherData && (
                  <Text>
                    {weatherData.forecastData.Sun.Set.substring(11, 16)}
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.infoContainer}>
              <Image
                source={
                  isEnabled
                    ? require("./img/icons/iconsdark/icon-gota-dark.png")
                    : require("./img/icons/iconslight/icon-gota-light.png")
                }
                style={styles.littleIcon}
              />
              <View>
                <Text>Umidade</Text>
                {weatherData && (
                  <Text>
                    {weatherData.forecastData.Day.RelativeHumidity.Average}%
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.infoContainer}>
              <Image
                source={
                  isEnabled
                    ? require("./img/icons/iconsdark/icon-chuva-dark.png")
                    : require("./img/icons/iconslight/icon-chuva-light.png")
                }
                style={styles.littleIcon}
              />
              <View>
                <Text>Chuva</Text>

                {weatherData && (
                  <Text>{weatherData.forecastData.Day.RainProbability}%</Text>
                )}
              </View>
            </View>
          </View>
        </View>
        <Switch
          trackColor={{ false: "#6326AF", true: "#81b0ff" }}
          thumbColor={isEnabled ? "#6326AF" : "#61D0E1"}
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
        <Text style={styles.footer}>Developer: Gabriel Pádua</Text>
      </View>
    </ImageBackground>
  );
}

// {isDayTime ? `weatherData.forecastData.Sun.Set` : `weatherData.forecastData.Moon.Set`}
const styles = StyleSheet.create({
  container: {
    height: 1000,
  },

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
    marginTop: 40,
    alignItems: "center",
  },
  tempText: {
    marginTop: 15,
    fontSize: 45,
  },
  weatherText: {
    fontSize: 20,
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
    width: 250,
    height: 250,
  },
  column0: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 40,
  },
  infoContainer: {
    marginBottom: 30,
    flexDirection: "row",
    alignItems: "center",
  },
  footer: {
    alignContent: "center",
    justifyContent: "center",
    textAlign: "center",
    bottom: 0,
  },
  littleIcon: {
    height: 50,
    width: 50,
  },
});
