import { AppColors } from "@/constants/colors";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
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
    color: "white",
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
    backgroundColor: AppColors.black,
    padding: 10,
    width: "100%",
    height: 50,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
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
    backgroundColor: AppColors.black,
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
});
