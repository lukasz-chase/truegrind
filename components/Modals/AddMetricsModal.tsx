import { useMemo, useState } from "react";
import {
  View,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
} from "react-native";
import { Pressable } from "react-native";
import CloseButton from "../CloseButton";
import CustomImage from "../CustomImage";
import CustomTextInput from "../CustomTextInput";
import useThemeStore from "@/store/useThemeStore";
import { ThemeColors } from "@/types/user";
const MeasurementsGuide = require("@/assets/images/measurementsGuide.png");

type Props = {
  isVisible: boolean;
  closeModal: () => void;
  onPress: (value: number) => void;
  label: string;
};

export default function AddMetricsModal({
  isVisible,
  closeModal,
  onPress,
  label,
}: Props) {
  const [inputValue, setInputValue] = useState("");
  const { theme } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme), [theme]);
  const handleChange = (text: string) => {
    setInputValue(text);
  };
  const closeModalHandler = () => {
    setInputValue("");
    closeModal();
  };
  const saveHandler = () => {
    if (inputValue !== "") {
      const replacedValue = inputValue.replace(",", ".");
      const numericValue = Number(replacedValue);
      onPress(Number(numericValue));
      closeModal();
      setInputValue("");
    }
  };
  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="fade"
      onRequestClose={closeModalHandler}
    >
      <TouchableWithoutFeedback onPress={closeModalHandler}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>

      <View style={styles.modalContent}>
        <View style={styles.header}>
          <CloseButton onPress={closeModalHandler} />
          <Text style={styles.title}>Add Measurement</Text>
          <Pressable onPress={saveHandler} disabled={inputValue === ""}>
            <Text
              style={[
                styles.saveButtonText,
                { color: inputValue === "" ? theme.gray : theme.blue },
              ]}
            >
              Save
            </Text>
          </Pressable>
        </View>
        <Text style={styles.label}>{label}</Text>
        <CustomTextInput
          onChangeText={handleChange}
          placeholder="Enter your measurement"
          value={inputValue}
          keyboardType="numeric"
        />
        <CustomImage imageUrl={MeasurementsGuide} height={350} width={300} />
      </View>
    </Modal>
  );
}

const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    modalOverlay: {
      backgroundColor: theme.semiTransparent,
      position: "absolute",
      width: "100%",
      height: "100%",
      top: 0,
      left: 0,
    },
    modalContent: {
      width: "90%",
      paddingVertical: 30,
      paddingHorizontal: 20,
      borderRadius: 10,
      alignItems: "center",
      backgroundColor: theme.background,
      gap: 20,
      margin: "auto",
    },
    title: {
      fontWeight: "bold",
      fontSize: 18,
      color: theme.textColor,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      marginBottom: 10,
    },
    saveButtonText: {
      color: theme.blue,
      fontWeight: "bold",
      fontSize: 16,
    },
    label: {
      fontWeight: "bold",
      fontSize: 18,
      color: theme.textColor,
    },
  });
