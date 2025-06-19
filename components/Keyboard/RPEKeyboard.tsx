import { View, Text, Pressable } from "react-native";
import { RPE_VALUES } from "@/constants/keyboard";
import { AntDesign } from "@expo/vector-icons";
import { KeyboardView, KeyboardViewEnum } from "@/types/customKeyboard";
import { RPE_INFO } from "@/constants/infoModal";
import useThemeStore from "@/store/useThemeStore";
import { useMemo } from "react";
import KeyboardStyles from "./KeyboardStyles";

type Props = {
  selectedRPE: { label: string; value: number | null };
  setRPE: (rpe: { label: string; value: number }) => void;
  setKeyboardView: (value: KeyboardView) => void;
  openInfoModal: (title: string, subtitle: string) => void;
};

const RPEKeyboard = ({
  selectedRPE,
  setRPE,
  setKeyboardView,
  openInfoModal,
}: Props) => {
  const { theme } = useThemeStore((state) => state);

  const styles = useMemo(() => KeyboardStyles(theme), [theme]);
  return (
    <View style={styles.rpeView}>
      <View style={styles.header}>
        <Pressable
          style={styles.headerButton}
          onPress={() => openInfoModal(RPE_INFO.title, RPE_INFO.description)}
        >
          <AntDesign name="question" size={24} color={theme.white} />
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
        {RPE_VALUES.map((rpe) => (
          <Pressable
            key={rpe.value}
            style={[
              styles.rpeButton,
              {
                backgroundColor:
                  selectedRPE.value === rpe.value ? theme.white : theme.black,
              },
            ]}
            onPress={() => setRPE(rpe)}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color:
                    selectedRPE.value === rpe.value ? theme.black : theme.white,
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
