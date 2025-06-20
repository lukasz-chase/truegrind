import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { Entypo, Feather, MaterialIcons, AntDesign } from "@expo/vector-icons";
import { KEYS } from "@/constants/keyboard";
import { KeyboardView, KeyboardViewEnum } from "@/types/customKeyboard";
import useThemeStore from "@/store/useThemeStore";
import { useMemo } from "react";
import KeyboardStyles from "./KeyboardStyles";

type Props = {
  onKeyPress: (key: string) => void;
  onDelete: () => void;
  addDot: () => void;
  addOne: () => void;
  removeOne: () => void;
  closeKeyboard: () => void;
  setKeyboardView: (view: KeyboardView) => void;
  fieldName: string;
  focusNextInput: () => void;
};

const DefaultKeyboard = ({
  onKeyPress,
  onDelete,
  addDot,
  addOne,
  removeOne,
  closeKeyboard,
  setKeyboardView,
  fieldName,
  focusNextInput,
}: Props) => {
  const { theme } = useThemeStore((state) => state);
  const styles = useMemo(() => KeyboardStyles(theme), [theme]);

  return (
    <View style={styles.keyboard}>
      <View style={styles.keys}>
        {KEYS.map((key) => (
          <TouchableOpacity
            key={key}
            style={styles.key}
            onPress={() => onKeyPress(key)}
          >
            <Text style={styles.keyText}>{key}</Text>
          </TouchableOpacity>
        ))}

        {fieldName === "reps" ? (
          <TouchableOpacity
            style={styles.key}
            onPress={() => setKeyboardView(KeyboardViewEnum.PARTIALS)}
          >
            <Text style={styles.buttonText}>Partials</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.key, { justifyContent: "flex-end" }]}
            onPress={addDot}
          >
            <Entypo name="dot-single" size={24} color={theme.white} />
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.key} onPress={onDelete}>
          <Feather name="delete" size={24} color={theme.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.buttons}>
        <Pressable onPress={closeKeyboard} style={styles.button}>
          <MaterialIcons name="keyboard-hide" size={24} color={theme.white} />
        </Pressable>

        {fieldName === "weight" ? (
          <Pressable
            style={styles.button}
            onPress={() => setKeyboardView(KeyboardViewEnum.BAR_TYPE)}
          >
            <Text style={styles.buttonText}>Bar Type</Text>
          </Pressable>
        ) : (
          <Pressable
            style={styles.button}
            onPress={() => setKeyboardView(KeyboardViewEnum.RPE)}
          >
            <Text style={styles.buttonText}>RPE</Text>
          </Pressable>
        )}

        <View style={{ flexDirection: "row", gap: 1 }}>
          <Pressable
            style={[styles.button, { width: "50%" }]}
            onPress={removeOne}
          >
            <AntDesign name="minus" size={24} color={theme.white} />
          </Pressable>
          <Pressable style={[styles.button, { width: "50%" }]} onPress={addOne}>
            <AntDesign name="plus" size={24} color={theme.white} />
          </Pressable>
        </View>

        <Pressable onPress={focusNextInput} style={styles.button}>
          <Text style={styles.buttonText}>Next</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default DefaultKeyboard;
