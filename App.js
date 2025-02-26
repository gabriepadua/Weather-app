import React, { useState, useEffect } from "react";
import {
  View,
  ImageBackground,
  TextInput,
  Pressable,
  Text,
  Image,
  Switch,
  FlatList,
} from "react-native";
import { useDarkMode, useWeather, fetchAutocompleteSuggestions } from "./api";
import { styles } from "./styles";
import { getWeatherIcon } from "./pics";

export default function App() {
  const { isEnabled, toggleSwitch } = useDarkMode();
  const { city, setCity, weatherData, getClima, isDayTime, dayAndMonth } =
    useWeather();
  const [suggestions, setSuggestions] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!isTyping) return;

    console.log("useEffect triggered with city:", city);
    const delayDebounceFn = setTimeout(async () => {
      if (city.length >= 3) {
        console.log("Fetching autocomplete suggestions for city:", city);
        const data = await fetchAutocompleteSuggestions(city);
        console.log("Autocomplete suggestions data:", data);
        setSuggestions(data);
      } else {
        console.log("City length is less than 3, clearing suggestions");
        setSuggestions([]);
      }
      setIsTyping(false);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [city, isTyping]);

  const handleCitySelect = (selectedCity) => {
    console.log("City selected from suggestions:", selectedCity);
    const locationKey = selectedCity.Key;
    getClima(locationKey);
    setSuggestions([]);
  };

  const handleSuggestionPress = (suggestion) => {
    console.log("Suggestion pressed:", suggestion);
    setCity(suggestion.LocalizedName);
    getClima(suggestion.Key);
    setSuggestions([]);
  };

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
            style={[
              styles.input,
              isEnabled
                ? styles.input
                : { borderColor: "#061D49", color: "#061D49" },
            ]}
            onChangeText={(text) => {
              console.log("City input changed:", text);
              setCity(text);
              setIsTyping(true);
            }}
            value={city}
            placeholder="Digite sua cidade"
            placeholderTextColor={isEnabled ? "#FFFFFF" : "#061D49"}
          />
          <Pressable
            style={[
              styles.button,
              isEnabled
                ? styles.button
                : { backgroundColor: "#6326AF", borderColor: "#061D49" },
            ]}
            onPress={handleCitySelect}
          >
            <Text style={styles.text}>Procurar!</Text>
          </Pressable>
          <Switch
            id="switch"
            trackColor={{ false: "#6326AF", true: "#81b0ff" }}
            thumbColor={isEnabled ? "#6326AF" : "#61D0E1"}
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
        {city.length >= 3 && suggestions.length > 0 && (
          <View style={styles.autoCompleteContainer}>
            <FlatList
              data={suggestions}
              keyExtractor={(item) => item.Key}
              renderItem={({ item }) => (
                <Pressable onPress={() => handleSuggestionPress(item)}>
                  <Text style={styles.autoCompleteText}>
                    {item.LocalizedName},{" "}
                    {item.AdministrativeArea.LocalizedName},{" "}
                    {item.Country.LocalizedName}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        )}
        <View style={styles.hello}>
          {weatherData && (
            <>
              <Text
                style={[
                  styles.day,
                  isEnabled ? styles.day : { color: "#061D49" },
                ]}
              >
                Dia {dayAndMonth}
              </Text>
              <Text style={[styles.have, isEnabled && { color: "#FFFFFF" }]}>
                {isDayTime ? "Bom dia" : "Boa noite"}
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
              {weatherData.locationData?.AdministrativeArea.LocalizedName},{" "}
              {weatherData.locationData?.Country.LocalizedName}
            </Text>
          )}
        </View>
        <View style={styles.weatherContainer}>
          {weatherData && (
            <>
              <Image
                source={getWeatherIcon(
                  weatherData.currentConditionsData.WeatherText
                )}
                style={styles.weatherIcons}
              />
              <Text
                style={isEnabled ? styles.tempTextEnabled : styles.tempText}
              >
                {weatherData.currentConditionsData.Temperature.Metric.Value}C°
              </Text>
              <Text
                style={
                  isEnabled ? styles.weatherTextEnabled : styles.weatherText
                }
              >
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
                  Nascer do Sol
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
                  Qualidade do ar
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
                  Velocidade do vento
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
                  Por do Sol
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
                  Umidade
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
                  Chuva
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
