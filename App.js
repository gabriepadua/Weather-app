import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Image } from 'react-native';
import sun from './img/sun.png';

export default function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const apiKey = '2QOVyWSNAEqBA3pza57LB5DIY07VMuPQ';
  const baseUrl = 'http://dataservice.accuweather.com/';

  const getFormattedDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}`; //if i wanna
  };



  const getClima = () => {
    // Reset weatherData to avoid previous data sticking around during the fetch
    setWeatherData(null);
  
    let locationKey;
  
    // Fetch data from the first endpoint
    fetch(`${baseUrl}locations/v1/cities/search?q=${city}&apikey=${apiKey}&language=pt-br`)
      .then(response => response.json())
      .then(data => {
        locationKey = data[0].Key;
        console.log('First Endpoint Data:', data);
        // Return a Promise to chain the next fetch
        const { EnglishName } = data[0].EnglishName;

        return fetch(`${baseUrl}currentconditions/v1/${locationKey}?apikey=${apiKey}`);
      })
      .then(response => response.json())
      .then(data => {
        currentConditionsData = data; // Assign data to currentConditionsData
        console.log('Second Endpoint Data:', currentConditionsData);
        // Update weatherData with data from the first endpoint
        setWeatherData(currentConditionsData[0]);
        // Fetch data from the second endpoint
        return fetch(`${baseUrl}forecasts/v1/daily/1day/${locationKey}?apikey=${apiKey}&language=pt-br&details=true`);
      })
      .then(response => response.json())
      .then(forecastData => {
        console.log('Third Endpoint Data:', forecastData);
        // Merge data from the second endpoint into weatherData
        setWeatherData(prevData => ({ ...prevData, ...forecastData[0] }));
      })
      .catch(error => {
        console.error('Error fetching weather:', error);
      });
        };

  const isDayTime = weatherData?.IsDayTime || false;
  const dayAndMonth = weatherData ? getFormattedDate(weatherData.LocalObservationDateTime) : '';

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
      <View style={styles.hello}>
        {weatherData && (
          <>
            <Text style={styles.hi}>Hi, {weatherData.EnglishName}</Text>
            <Text style={styles.have}>{isDayTime ? 'Have a good day' : 'Have a good night'}</Text>
          </>
        )}
      </View>
      <View style={styles.weatherContainer}>
        {weatherData &&(
          <>
          <Image source={sun} style={styles.weatherIcons} />
          <Text style={styles.tempText}>{weatherData.Temperature.Metric.Value}C°</Text>
          <Text style={styles.weatherText}>{weatherData.WeatherText}</Text>
          </>
        )}
        {weatherData && <Text style={styles.weatherText}>Day {dayAndMonth}</Text>}
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
  hi: {
    fontSize: 17
  },
  have: {
    fontSize: 25
  },
  weatherContainer: {
    marginTop: 50,
    alignItems: 'center',
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
    backgroundColor: '#453264',
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontSize: 16,
    color: '#FBEAFF',
  },
  hello: {
    paddingTop: 20,
    paddingLeft: 30,
  },
  weatherIcons: {
    width: 275,
    height: 275
  },
});
