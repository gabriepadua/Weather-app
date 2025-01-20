import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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