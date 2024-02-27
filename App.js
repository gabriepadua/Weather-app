import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Pressable } from 'react-native';


export default function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const apiKey = '2QOVyWSNAEqBA3pza57LB5DIY07VMuPQ';
  const baseUrl = 'http://dataservice.accuweather.com/';

  const getClima = () => {
    fetch(`${baseUrl}locations/v1/cities/search?q=${city}&apikey=${apiKey}&language=pt-br`)
      .then(response => response.json())
      .then(data => {
        const locationKey = data[0].Key;
        return fetch(`${baseUrl}currentconditions/v1/${locationKey}?apikey=${apiKey}`);
      })
      .then(response => response.json())
      .then(weatherData => {
        setWeatherData(weatherData[0]);
      })
      .catch(error => {
        console.error('Error fetching weather:', error);
      });
  };
  return (
    
    <View style={styles.container}>
      <View style={styles.pesquisa}>
        <TextInput
          style={styles.input}
          onChangeText={text => setCity(text)}
          value={city}
          placeholder="Enter city name"
        />
        <Pressable style={styles.button} onPress={getClima}>
        <Text style={styles.text}>Search!</Text>
        </Pressable>
      </View>
      <View style={styles.weatherContainer}>
        {weatherData && (
          <Text>Weather in {city}: {weatherData.WeatherText}, Temperature: {weatherData.Temperature.Metric.Value}°C</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {

  },

  pesquisa: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingTop: 50,
    paddingLeft: 30,
  },
  input: {
    height: 40,
    width: 220,
    borderColor: 'gray',
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10
  },
  weatherContainer: {
    marginTop: 20
  },
  button: {
    marginLeft: 10,
    width: 80,
    height: 40,
    backgroundColor: '#453264',
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontSize: 16,
    color: '#FBEAFF',
  }

});
