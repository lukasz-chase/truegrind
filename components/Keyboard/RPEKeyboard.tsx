import { View, Text, Pressable } from "react-native";
import { rpeValues } from "@/constants/keyboard";
import styles from "./KeyboardStyles";
import { AntDesign } from "@expo/vector-icons";
import { KeyboardView, KeyboardViewEnum } from "@/types/customKeyboard";
import { rpeInfo } from "@/constants/infoModal";
import { AppColors } from "@/constants/colors";

type Props = {
  selectedRPE: { label: string; value: number | null };
  selectRPE: (rpe: { label: string; value: number }) => void;
  setKeyboardView: (value: KeyboardView) => void;
  openInfoModal: (title: string, subtitle: string) => void;
};

const RPEKeyboard = ({
  selectedRPE,
  selectRPE,
  setKeyboardView,
  openInfoModal,
}: Props) => {
  return (
    <View style={styles.rpeView}>
      <View style={styles.header}>
        <Pressable
          style={styles.headerButton}
          onPress={() => openInfoModal(rpeInfo.title, rpeInfo.description)}
        >
          <AntDesign name="question" size={24} color="white" />
        </Pressable>
        <Pressable
          style={[styles.button, { width: 100 }]}
          onPress={() => setKeyboardView(KeyboardViewEnum.DEFAULT)}
        >
          <Text style={styles.buttonText}>RPE</Text>
        </Pressable>
      </View>
      <Text style={styles.buttonText}>{selectedRPE.label}</Text>
      <View style={styles.rpeButtons}>
        {rpeValues.map((rpe) => (
          <Pressable
            key={rpe.value}
            style={[
              styles.rpeButton,
              {
                backgroundColor:
                  selectedRPE.value === rpe.value ? "white" : AppColors.black,
              },
            ]}
            onPress={() => selectRPE(rpe)}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color:
                    selectedRPE.value === rpe.value ? AppColors.black : "white",
                },
              ]}
            >
              {rpe.value}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default RPEKeyboard;
