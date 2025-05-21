import { ThemeColors } from "@/types/user";
import { StyleSheet } from "react-native";

export default (theme: ThemeColors) =>
  StyleSheet.create({
    keyboard: {
      flexDirection: "row",
    },
    keys: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignContent: "center",
      justifyContent: "center",
      paddingVertical: 20,
      gap: 5,
      flex: 1,
    },
    key: {
      width: "30%",
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      padding: 5,
      borderRadius: 8,
    },
    keyText: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.white,
    },
    buttons: {
      flexDirection: "column",
      justifyContent: "space-evenly",
      alignItems: "center",
      width: 130,
      padding: 10,
    },
    button: {
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 8,
      backgroundColor: theme.black,
      padding: 10,
      width: "100%",
      height: 50,
    },
    buttonText: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.white,
      textAlign: "center",
    },
    rpeView: {
      flexDirection: "column",
      justifyContent: "space-between",
      height: "100%",
      padding: 10,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    headerButton: {
      padding: 5,
      backgroundColor: theme.black,
      borderRadius: 8,
    },
    rpeButtons: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    rpeButton: {
      width: 40,
      height: 60,
      justifyContent: "center",
    },
    partialsContainer: {
      flexDirection: "column",
      height: "100%",
      padding: 10,
      gap: 10,
    },
    picker: {
      alignItems: "center",
      justifyContent: "center",
    },
    barButtonsWrapper: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      flexWrap: "wrap",
      gap: 10,
    },
    barButton: {
      width: 100,
      height: 80,
      padding: 5,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.darkGray,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 1,
    },
    selectedBarButton: {
      backgroundColor: theme.lightBlue,
    },
    barImage: {
      width: "100%",
      height: 35,
    },
    barName: {
      fontSize: 10,
      color: theme.white,
      textAlign: "center",
    },
    selectedBarName: {
      color: theme.black,
    },
  });
