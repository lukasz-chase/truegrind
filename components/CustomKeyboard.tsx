import { AppColors } from "@/constants/colors";
import useCustomKeyboard from "@/store/useCustomKeyboard";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
const CustomKeyboard = ({
  animatedIndex,
}: {
  animatedIndex: SharedValue<number>;
}) => {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
  const {
    isVisible,
    closeKeyboard,
    onKeyPress,
    onDelete,
    addOne,
    removeOne,
    addDot,
  } = useCustomKeyboard();
  const animatedStyle = useAnimatedStyle(() => {
    const interpolatedY = interpolate(animatedIndex.value, [0, 1], [250, 0]);

    return {
      transform: [
        {
          translateY: interpolatedY,
        },
      ],
    };
  });
  // styles
  return (
    <Animated.View
      style={[
        styles.container,
        animatedStyle,
        { display: isVisible ? "flex" : "none" },
      ]}
    >
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
        <TouchableOpacity
          style={[styles.key, { justifyContent: "flex-end" }]}
          onPress={addDot}
        >
          <Entypo name="dot-single" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.key} onPress={onDelete}>
          <Feather name="delete" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.buttons}>
        <Pressable onPress={closeKeyboard} style={styles.button}>
          <MaterialIcons name="keyboard-hide" size={24} color="white" />
        </Pressable>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>RPE</Text>
        </Pressable>
        <View style={{ flexDirection: "row", gap: 1 }}>
          <Pressable
            style={[styles.button, { width: "50%" }]}
            onPress={removeOne}
          >
            <AntDesign name="minus" size={24} color="white" />
          </Pressable>
          <Pressable style={[styles.button, { width: "50%" }]} onPress={addOne}>
            <AntDesign name="plus" size={24} color="white" />
          </Pressable>
        </View>
        <Pressable onPress={closeKeyboard} style={styles.button}>
          <Text style={styles.buttonText}>Next</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#1C1C1C",
    flexDirection: "row",
    paddingBottom: 20,
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
    backgroundColor: "#2C2C2C",
    padding: 10,
    width: "100%",
    height: 50,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});

export default CustomKeyboard;
