import { AppColors } from "@/constants/colors";
import useCustomKeyboard from "@/store/useCustomKeyboard";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Switch,
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
import { KEYBOARD_HEIGHT, keys, rpeValues } from "@/constants/keyboard";
import MemoizedScrollPicker from "./MemoizedScrollPicker";
import { useEffect, useState } from "react";
const CustomKeyboard = ({
  animatedIndex,
}: {
  animatedIndex: SharedValue<number>;
}) => {
  const {
    isVisible,
    closeKeyboard,
    onKeyPress,
    onDelete,
    addOne,
    removeOne,
    addDot,
    activeField,
    selectedRPE,
    selectRPE,
    keyboardView,
    setKeyboardView,
    partials,
    setPartials,
  } = useCustomKeyboard();
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
  const fieldName = activeField?.split("-")[activeField?.split("-").length - 1];
  const partialOptions = Array.from({ length: 10 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1}`,
  }));
  return (
    <Animated.View
      style={[
        styles.container,
        animatedStyle,
        { display: isVisible ? "flex" : "none" },
      ]}
    >
      {keyboardView === "default" && (
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
                style={[styles.key]}
                onPress={() => setKeyboardView("partials")}
              >
                <Text style={styles.buttonText}>Partials</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.key, { justifyContent: "flex-end" }]}
                onPress={addDot}
              >
                <Entypo name="dot-single" size={24} color="white" />
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.key} onPress={onDelete}>
              <Feather name="delete" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <View style={styles.buttons}>
            <Pressable onPress={closeKeyboard} style={styles.button}>
              <MaterialIcons name="keyboard-hide" size={24} color="white" />
            </Pressable>
            {fieldName === "weight" ? (
              <Pressable style={styles.button}></Pressable>
            ) : (
              <Pressable
                style={styles.button}
                onPress={() => setKeyboardView("RPE")}
              >
                <Text style={styles.buttonText}>RPE</Text>
              </Pressable>
            )}

            <View style={{ flexDirection: "row", gap: 1 }}>
              <Pressable
                style={[styles.button, { width: "50%" }]}
                onPress={removeOne}
              >
                <AntDesign name="minus" size={24} color="white" />
              </Pressable>
              <Pressable
                style={[styles.button, { width: "50%" }]}
                onPress={addOne}
              >
                <AntDesign name="plus" size={24} color="white" />
              </Pressable>
            </View>
            <Pressable onPress={closeKeyboard} style={styles.button}>
              <Text style={styles.buttonText}>Next</Text>
            </Pressable>
          </View>
        </View>
      )}

      {keyboardView === "RPE" && (
        <View style={styles.rpeView}>
          <View style={styles.header}>
            <Pressable style={styles.headerButton}>
              <AntDesign name="question" size={24} color="white" />
            </Pressable>
            <Pressable
              style={[styles.button, { width: 100 }]}
              onPress={() => setKeyboardView("default")}
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
                      selectedRPE.value === rpe.value ? "white" : "#2C2C2C",
                  },
                ]}
                onPress={() => selectRPE(rpe)}
              >
                <Text
                  style={[
                    styles.buttonText,
                    {
                      color:
                        selectedRPE.value === rpe.value ? "#2C2C2C" : "white",
                    },
                  ]}
                >
                  {rpe.value}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
      {keyboardView === "partials" && (
        <View style={styles.partialsContainer}>
          <View style={styles.header}>
            <Pressable style={styles.headerButton}>
              <AntDesign name="question" size={24} color="white" />
            </Pressable>
            <Pressable
              style={[styles.button, { width: 100 }]}
              onPress={() => setKeyboardView("default")}
            >
              <Text style={styles.buttonText}>Partials</Text>
            </Pressable>
          </View>
          <View style={styles.header}>
            <Text style={styles.buttonText}>Enabled</Text>
            <Switch
              trackColor={{ false: "#767577", true: AppColors.blue }}
              thumbColor={"#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
          <View style={styles.picker}>
            <MemoizedScrollPicker
              value={partials as number}
              setValue={setPartials}
              data={partialOptions}
              visibleItemCount={3}
              disabled={!isEnabled}
              backgroundColor="white"
            />
          </View>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#1C1C1C",
    paddingBottom: 20,
    height: KEYBOARD_HEIGHT,
  },
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
    backgroundColor: "#2C2C2C",
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

export default CustomKeyboard;
