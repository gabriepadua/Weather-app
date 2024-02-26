import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';


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
      <View>
        <TextInput
          style={styles.input}
          onChangeText={text => setCity(text)}
          value={city}
          placeholder="Enter city name"
        />
        
        <Button title="Enviar!" onPress={getClima} />
      </View>
      <View style={styles.weatherContainer}>
        {weatherData && (
          <Text>Clima: {weatherData.WeatherText}, Temperatura: {weatherData.Temperature.Metric.Value}°C</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10
  },
  weatherContainer: {
    marginTop: 20
  }
});
