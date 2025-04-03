import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { Entypo, Feather, MaterialIcons, AntDesign } from "@expo/vector-icons";
import { keys } from "@/constants/keyboard";
import styles from "./KeyboardStyles";
import { KeyboardView, KeyboardViewEnum } from "@/types/customKeyboard";
import { AppColors } from "@/constants/colors";

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
}: Props) => (
  <View style={styles.keyboard}>
    <View style={styles.keys}>
      {keys.map((key) => (
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
          <Entypo name="dot-single" size={24} color={AppColors.white} />
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.key} onPress={onDelete}>
        <Feather name="delete" size={24} color={AppColors.white} />
      </TouchableOpacity>
    </View>

    <View style={styles.buttons}>
      <Pressable onPress={closeKeyboard} style={styles.button}>
        <MaterialIcons name="keyboard-hide" size={24} color={AppColors.white} />
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
          <AntDesign name="minus" size={24} color={AppColors.white} />
        </Pressable>
        <Pressable style={[styles.button, { width: "50%" }]} onPress={addOne}>
          <AntDesign name="plus" size={24} color={AppColors.white} />
        </Pressable>
      </View>

      <Pressable onPress={focusNextInput} style={styles.button}>
        <Text style={styles.buttonText}>Next</Text>
      </Pressable>
    </View>
  </View>
);

export default DefaultKeyboard;
