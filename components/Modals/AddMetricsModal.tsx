import { AppColors } from "@/constants/colors";
import { useState } from "react";
import {
  View,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
  TextInput,
} from "react-native";
import { Pressable } from "react-native";
import CloseButton from "../CloseButton";
import CustomImage from "../CustomImage";
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

  const handleChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setInputValue(numericValue);
  };
  const saveHandler = () => {
    if (inputValue !== "") {
      onPress(Number(inputValue));
      closeModal();
      setInputValue("");
    }
  };
  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="fade"
      onRequestClose={closeModal}
    >
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>

      <View style={styles.modalContent}>
        <View style={styles.header}>
          <CloseButton onPress={closeModal} />
          <Text style={styles.title}>Add Measurement</Text>
          <Pressable onPress={saveHandler} disabled={inputValue === ""}>
            <Text
              style={[
                styles.saveButtonText,
                { color: inputValue === "" ? AppColors.gray : AppColors.blue },
              ]}
            >
              Save
            </Text>
          </Pressable>
        </View>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          style={styles.input}
          onChangeText={handleChange}
          value={inputValue}
          keyboardType="numeric"
          placeholder="Enter your measurement"
          placeholderTextColor="#999"
        />
        <CustomImage imageUrl={MeasurementsGuide} height={350} width={300} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
    backgroundColor: "white",
    gap: 20,
    margin: "auto",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: AppColors.darkGray,
    borderRadius: 5,
    padding: 10,
    width: "100%",
    fontSize: 16,
  },
  saveButtonText: {
    color: AppColors.blue,
    fontWeight: "bold",
    fontSize: 16,
  },
  label: {
    fontWeight: "bold",
    fontSize: 18,
  },
});
