import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import * as Location from "expo-location";
import { LinearGradient } from "expo-linear-gradient";

export default function Weather() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchWeather = async (latitude, longitude) => {
    const apiKey = "62e31edefe8360d37e2387302a807ad7";

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
      );
      const data = await response.json();

      if (data.cod === 200) {
        setWeatherData(data);
      } else {
        console.error("API Error:", data.message);
        setErrorMessage(data.message || "Failed to fetch weather data.");
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setErrorMessage("Failed to fetch weather data.");
    } finally {
      setLoading(false);
    }
  };

  const getLocationAndFetchWeather = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMessage("Location permission is required to fetch weather.");
        Alert.alert("Permission Denied", "Location permission is required.");
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      fetchWeather(latitude, longitude);
    } catch (error) {
      console.error("Error getting location:", error);
      setErrorMessage("Failed to get location.");
      setLoading(false);
    }
  };

  useEffect(() => {
    getLocationAndFetchWeather();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (errorMessage) {
    return <Text style={styles.errorText}>{errorMessage}</Text>;
  }

  if (!weatherData) {
    return <Text style={styles.errorText}>Failed to load weather data.</Text>;
  }

  return (
    <LinearGradient
      colors={["rgba(20, 55, 101, 0.89)", "rgba(36, 172, 95, 0.89)"]} 
      style={styles.gradientContainer}
    >
      <View style={styles.container}>
        {/* <Text style={styles.title}>Weather</Text> */}
        <Text style={styles.info}>
          {weatherData.name || "Unknown Location"} 
          {/* {weatherData.sys?.country || "Unknown Country"} */}
        </Text>
        <Text style={styles.temp}>
          {weatherData.main?.temp?.toFixed(1) ?? "N/A"}°C
        </Text>
        <Text style={styles.info}>
          {weatherData.weather?.[0]?.description ?? "No description available"}
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 40,
    height: 120,
    width: "40%",
  },
  container: {
    height: "95%",
    width: "95%",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  temp: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#fff",
  },
  info: {
    fontSize: 15,
    marginBottom: 5,
    color: "#fff", 
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
});
