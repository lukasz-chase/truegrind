import { View, Text, Pressable, Switch } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { KeyboardView, KeyboardViewEnum } from "@/types/customKeyboard";
import { useEffect, useMemo, useState } from "react";
import MemoizedScrollPicker from "../MemoizedScrollPicker";
import { partialsInfo } from "@/constants/infoModal";
import useThemeStore from "@/store/useThemeStore";
import KeyboardStyles from "./KeyboardStyles";

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
  const { theme } = useThemeStore((state) => state);

  const styles = useMemo(() => KeyboardStyles(theme), [theme]);
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
          <AntDesign name="question" size={24} color={theme.white} />
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
          trackColor={{ false: theme.charcoalGray, true: theme.blue }}
          thumbColor={theme.white}
          ios_backgroundColor={theme.graphiteGray}
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
          enabled={isEnabled}
          textColor={theme.white}
        />
      </View>
    </View>
  );
};

export default PartialsKeyboard;
