import {
  View,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Pressable,
  Text,
  FlatList,
} from "react-native";
import { AppColors } from "@/constants/colors";
import CloseButton from "../CloseButton";
import { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { equipmentFilters, muscleFilters } from "@/constants/exerciseFilters";
import CustomTextInput from "../CustomTextInput";
import { addExercise } from "@/lib/supabaseActions";
import { Image } from "expo-image";
import LoadingAnimation from "../LoadingAnimation";
import userStore from "@/store/userStore";
import { pickAndCompressImage } from "@/lib/images";
const PlaceholderImage = require("@/assets/images/ImagePlaceholder.png");

type Props = {
  closeModal: () => void;
  onDismiss: () => void;
  isVisible: boolean;
};

const MODAL_WIDTH = 350;

export default function NewExerciseModal({
  closeModal,
  isVisible,
  onDismiss,
}: Props) {
  const [exerciseName, setExerciseName] = useState("");
  const [instructions, setInstructions] = useState("");
  const [bodyPart, setBodyPart] = useState("");
  const [equipment, setEquipment] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<
    "main" | "equipment" | "body"
  >("main");

  const dataIsFilled = exerciseName && bodyPart && equipment;

  const translateXSharedValue = useSharedValue(0);

  const { user } = userStore();

  const pickImageAsync = async () => {
    const pickedImage = await pickAndCompressImage();
    if (!pickedImage) return;
    setSelectedImage(pickedImage);
  };

  const switchToScreen = (
    screenName: "body" | "equipment" | "main",
    value: number
  ) => {
    setCurrentScreen(screenName);
    translateXSharedValue.value = value;
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(translateXSharedValue.value, {
          duration: 300,
        }),
      },
    ],
  }));

  const createNewExercise = async () => {
    setLoading(true);
    try {
      if (dataIsFilled) {
        await addExercise({
          name: exerciseName,
          muscle: bodyPart,
          equipment,
          image: selectedImage,
          user_id: user?.id,
        });
        setEquipment("");
        setBodyPart("");
        setExerciseName("");
        setInstructions("");
        setSelectedImage(undefined);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="fade"
      onRequestClose={closeModal}
      onDismiss={onDismiss}
    >
      {loading && <LoadingAnimation />}
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.modalOverlay}></View>
      </TouchableWithoutFeedback>
      <View style={styles.modalContent}>
        <Animated.View
          style={[styles.container, animatedStyle, { width: MODAL_WIDTH }]}
        >
          <View style={styles.screen}>
            <View style={styles.header}>
              <CloseButton onPress={closeModal} />
              <Text style={styles.title}>Create New Exercise</Text>
              <Pressable
                disabled={!dataIsFilled || loading}
                onPress={createNewExercise}
              >
                <Text
                  style={[
                    styles.title,
                    { color: dataIsFilled ? AppColors.blue : AppColors.gray },
                  ]}
                >
                  Save
                </Text>
              </Pressable>
            </View>
            <CustomTextInput
              onChangeText={setExerciseName}
              value={exerciseName}
              placeholder="Add Name"
            />
            <CustomTextInput
              onChangeText={setInstructions}
              value={instructions}
              placeholder="Instructions"
              large
            />
            <Pressable onPress={pickImageAsync} style={styles.imageContainer}>
              <Image
                source={
                  selectedImage
                    ? {
                        uri: "data:image/jpeg;base64," + selectedImage,
                      }
                    : PlaceholderImage
                }
                style={styles.image}
              />
            </Pressable>
            <Pressable
              onPress={() => switchToScreen("body", -MODAL_WIDTH)}
              style={styles.link}
            >
              <Text style={[styles.linkText, { fontWeight: "bold" }]}>
                Body Part
              </Text>
              <View style={styles.linkRightSide}>
                <Text style={styles.linkText}>
                  {bodyPart ? bodyPart : "None"}
                </Text>
                <MaterialIcons
                  name="keyboard-arrow-right"
                  size={24}
                  color={AppColors.blue}
                />
              </View>
            </Pressable>
            <Pressable
              onPress={() => switchToScreen("equipment", -MODAL_WIDTH)}
              style={styles.link}
            >
              <Text style={[styles.linkText, { fontWeight: "bold" }]}>
                Equipment
              </Text>
              <View style={styles.linkRightSide}>
                <Text style={styles.linkText}>
                  {equipment ? equipment : "None"}
                </Text>
                <MaterialIcons
                  name="keyboard-arrow-right"
                  size={24}
                  color={AppColors.blue}
                />
              </View>
            </Pressable>
          </View>
          <View style={styles.screen}>
            <View style={styles.header}>
              <Pressable onPress={() => switchToScreen("main", 0)}>
                <MaterialIcons
                  name="keyboard-arrow-left"
                  size={24}
                  color={AppColors.blue}
                />
              </Pressable>
              <Text style={styles.title}>
                Select{" "}
                {currentScreen === "equipment" ? "Equipment" : "Body Part"}
              </Text>
              <View style={{ width: 30 }} />
            </View>

            <FlatList
              data={
                currentScreen === "equipment" ? equipmentFilters : muscleFilters
              }
              keyExtractor={(item) => item.value}
              style={styles.listWrapper}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.listItem}
                  onPress={() => {
                    if (currentScreen === "equipment") {
                      setEquipment(item.value);
                    } else {
                      setBodyPart(item.value);
                    }
                    switchToScreen("main", 0);
                  }}
                >
                  <Text
                    style={[
                      styles.listItemText,
                      {
                        color:
                          item.value === bodyPart || item.value === equipment
                            ? AppColors.blue
                            : AppColors.black,
                      },
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent background
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
  },
  modalContent: {
    width: MODAL_WIDTH,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "white",
    overflow: "hidden",
    margin: "auto",
  },
  header: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    marginBottom: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
  },
  container: {
    flexDirection: "row",
  },
  imageContainer: {
    marginHorizontal: "auto",
    marginVertical: 10,
  },
  image: {
    width: 200,
    aspectRatio: 1,
  },
  screen: {
    width: "100%",
    padding: 10,
  },
  link: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  linkRightSide: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  linkText: {
    fontSize: 18,
  },
  listWrapper: {
    height: 200,
  },
  listItem: {
    paddingVertical: 10,
  },
  listItemText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
