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
    rain: require("./img/weather/nublado comchuva.png"),
    storm: require("./img/weather/chuva com relâmpago.png"),
    snow: require("./img/weather/neve.png"),
    sc: require("./img/weather/sol entre nuvens.png"),
    cloud: require("./img/weather/nublado.png"),
    lightning: require("./img/weather/relâmpago.png"),
    scr: require("./img/weather/sol entre nuves com chuva.png"),
};

const getWeatherIcon = (weatherText) => {
    switch (weatherText) {
        case "Sunny":
            return imageMap.sun;
        case "Rain":
            return imageMap.rain;
        case "Storm":
            return imageMap.storm;
        case "Snow":
            return imageMap.snow;
        case "Mostly cloudy":
            return imageMap.sc;
        case "Cloudy":
            return imageMap.cloud;
        case "Lightning":
            return imageMap.lightning;
        case "Partly sunny w/ showers":
            return imageMap.scr;
        default:
            return imageMap.sun; // default case, in case of unknown weather text
    }
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
          `${baseUrl}currentconditions/v1/${locationKey}?apikey=${apiKey}&details=true`
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
          ? require("./img/bg/bg-escuro.png")
          : require("./img/bg/bg-claro.png")
      }
      style={styles.image}
    >
      <View style={styles.container}>
        <View style={styles.pesquisa}>
          <TextInput
            style={[styles.input, isEnabled ? styles.input : { borderColor: '#061D49', color: '#061D49' }]}
            onChangeText={(text) => setCity(text)}
            value={city}
            placeholder="Digite sua cidade"
            placeholderTextColor={isEnabled ? "#FFFFFF" : "#061D49"}
          />
          <Pressable style={[styles.button, isEnabled ? styles.button : { backgroundColor: '#6326AF', borderColor: '#061D49'}]} onPress={getClima}>
            <Text style={styles.text}>Search!</Text>
          </Pressable>
          <Switch id="switch"
          trackColor={{ false: "#6326AF", true: "#81b0ff" }}
          thumbColor={isEnabled ? "#6326AF" : "#61D0E1"}
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
        </View>
        <View style={styles.hello}>
           {weatherData && (
            <>
              <Text
                style={[ styles.day, isEnabled ? styles.day : {color: "#061D49"} ]}
              >
                Day {dayAndMonth}
              </Text>
              <Text style={[styles.have, isEnabled && { color: "#FFFFFF" }]}>
                {isDayTime ? "Have a good day" : "Have a good night"}
              </Text>
            </>
          )} 
          {weatherData && (
            <Text style={[styles.cidade, isEnabled && { color: "#FFFFFF" }]}>
              {weatherData.locationData?.LocalizedName}{" "}
            </Text>
          )}
          {weatherData && (
            <Text style={[styles.pais, isEnabled && { color: "#61D0E1" }]}>
              {weatherData.locationData?.Country.LocalizedName}
            </Text>
          )}
        </View>
        <View style={styles.weatherContainer}>
          {weatherData && (
            <>
              <Image source={getWeatherIcon(weatherData.currentConditionsData.WeatherText)} style={styles.weatherIcons} />
              <Text style={isEnabled ? styles.tempTextEnabled : styles.tempText }>
                {weatherData.currentConditionsData.Temperature.Metric.Value}C°
              </Text>
              <Text style={isEnabled ? styles.weatherTextEnabled : styles.weatherText}>
                {weatherData.currentConditionsData.WeatherText}
              </Text>
            </>
          )}
        </View>
        <View style={isEnabled ? styles.column0Enabled : styles.column0}>
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
                <Text
                  style={[styles.textos, isEnabled && { color: "#61D0E1" }]}
                >
                  Sunrise
                </Text>
                {weatherData && (
                  <Text
                    style={[styles.textos, isEnabled && { color: "#61D0E1" }]}
                  >
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
                <Text
                  style={[styles.textos, isEnabled && { color: "#61D0E1" }]}
                >
                  Air quality
                </Text>
                {weatherData && (
                  <Text
                    style={[styles.textos, isEnabled && { color: "#61D0E1" }]}
                  >
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
                <Text
                  style={[styles.textos, isEnabled && { color: "#61D0E1" }]}
                >
                  Wind speed
                </Text>

                {weatherData && (
                  <Text
                    style={[styles.textos, isEnabled && { color: "#61D0E1" }]}
                  >
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
                <Text
                  style={[styles.textos, isEnabled && { color: "#61D0E1" }]}
                >
                  Sunset
                </Text>
                {weatherData && (
                  <Text
                    style={[styles.textos, isEnabled && { color: "#61D0E1" }]}
                  >
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
                <Text
                  style={[styles.textos, isEnabled && { color: "#61D0E1" }]}
                >
                  Humidity
                </Text>
                {weatherData && (
                  <Text
                    style={[styles.textos, isEnabled && { color: "#61D0E1" }]}
                  >
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
                <Text
                  style={[styles.textos, isEnabled && { color: "#61D0E1" }]}
                >
                  Rain
                </Text>

                {weatherData && (
                  <Text
                    style={[styles.textos, isEnabled && { color: "#61D0E1" }]}
                  >
                    {weatherData.forecastData.Day.RainProbability}%
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>
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
    borderColor: "#61D0E1",
    borderRadius: 20,
    borderWidth: 1.5,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: '#FFFFFF'
  },
  hi: {
    fontSize: 17,
  },
  have: {
    fontSize: 18,
    color: "#6326AF"
  },
  day: {
    fontSize: 18,
    color: "#FFBE3E",
  },
  weatherContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  tempText: {
    marginTop: 15,
    fontSize: 28,
    color: "#061D49",
    fontWeight: 'bold'
  },
  tempTextEnabled: {
    marginTop: 15,
    fontSize: 28,
    fontWeight: 'bold',
    color: "#FFFFFF",
  },
  weatherText: {
    fontSize: 18,
    color: "#061D49",
  },
  weatherTextEnabled: {
    fontSize: 18,
    color: "#61D0E1"
  },
  button: {
    marginLeft: 10,
    width: 80,
    height: 40,
    backgroundColor: "#154D8A",
    alignItems: "center",
    justifyContent: "center",
    borderTopRightRadius: 40,
    borderBottomRightRadius: 40,
    borderColor: "#61D0E1",
    borderWidth: 1.5,
  },
  text: {
    fontSize: 16,
    color: "#FBEAFF",
  },
  hello: {
    paddingTop: 5,
    alignItems: "center",
  },
  weatherIcons: {
    width: 175,
    height: 175,
  },
  column0: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 40,
    backgroundColor: "rgba(0, 0, 0, 0.10)",
    borderRadius: 27,
    marginHorizontal: 30,
    alignItems: "center",
    paddingTop: 20,
  },
  column0Enabled: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 40,
    backgroundColor: "rgba(200, 251, 255, 0.15)",
    borderRadius: 27,
    marginHorizontal: 30,
    alignItems: "center",
    paddingTop: 20,
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
    width: 50
  },
  textos: {
    color: "#061D49",
  },
  cidade: {
    color: "#6326AF",
    fontSize: 40,
    fontWeight: "700",
    fontFamily: "",
    marginTop: 35,
  },
  pais: {
    color: "#061D49",
    fontSize: 25,
    marginTop: -7,
  }
});
