import { View, Text, Pressable, Switch } from "react-native";
import { AppColors } from "@/constants/colors";
import styles from "./KeyboardStyles";
import { AntDesign } from "@expo/vector-icons";
import { KeyboardView, KeyboardViewEnum } from "@/types/customKeyboard";
import { useEffect, useState } from "react";
import MemoizedScrollPicker from "../MemoizedScrollPicker";
import { partialsInfo } from "@/constants/infoModal";

type Props = {
  partials: number | null;
  setPartials: (value: number | null) => void;
  setKeyboardView: (value: KeyboardView) => void;
  openInfoModal: (title: string, subtitle: string) => void;
};

const PartialsKeyboard = ({
  partials,
  setPartials,
  setKeyboardView,
  openInfoModal,
}: Props) => {
  const [isEnabled, setIsEnabled] = useState(!!partials);
  useEffect(() => {
    setIsEnabled(!!partials);
  }, [partials]);

  const toggleSwitch = (value: any) => {
    if (!value) {
      setPartials(null);
    } else {
      if (!partials) {
        setPartials(1);
      }
    }

    setIsEnabled((previousState) => !previousState);
  };
  return (
    <View style={styles.partialsContainer}>
      <View style={styles.header}>
        <Pressable
          style={styles.headerButton}
          onPress={() =>
            openInfoModal(partialsInfo.title, partialsInfo.description)
          }
        >
          <AntDesign name="question" size={24} color={AppColors.white} />
        </Pressable>
        <Pressable
          style={[styles.button, { width: 100 }]}
          onPress={() => setKeyboardView(KeyboardViewEnum.DEFAULT)}
        >
          <Text style={styles.buttonText}>Partials</Text>
        </Pressable>
      </View>

      <View style={styles.header}>
        <Text style={styles.buttonText}>Enabled</Text>
        <Switch
          trackColor={{ false: AppColors.charcoalGray, true: AppColors.blue }}
          thumbColor={AppColors.white}
          ios_backgroundColor={AppColors.graphiteGray}
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>

      <View style={styles.picker}>
        <MemoizedScrollPicker
          value={partials!}
          setValue={setPartials}
          data={Array.from({ length: 10 }, (_, i) => ({
            value: i + 1,
            label: `${i + 1}`,
          }))}
          visibleItemCount={3}
          disabled={!isEnabled}
          backgroundColor={AppColors.white}
        />
      </View>
    </View>
  );
};

export default PartialsKeyboard;
