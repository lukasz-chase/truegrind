import {
  View,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Pressable,
  Text,
} from "react-native";
import { useEffect, useState } from "react";
import LoadingAnimation from "../../LoadingAnimation";
import userStore from "@/store/userStore";
import {
  exerciseFormData,
  exerciseFormScreensEnum,
  exerciseFormScreenType,
} from "@/types/exerciseForm";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import FormScreen from "./FormScreen";
import OptionScreen from "./OptionScreen";
import CloseButton from "@/components/CloseButton";
import { AppColors } from "@/constants/colors";
import { Exercise } from "@/types/exercises";
import ActionModal from "../ActionModal";
import { deleteExercise, upsertExercise } from "@/lib/exercisesService";

type Props = {
  closeModal: () => void;
  onDismiss?: (exercise: Exercise | undefined) => void;
  isVisible: boolean;
  title: string;
  exercise?: Exercise;
};

const MODAL_WIDTH = 350;

export default function ExerciseFormModal({
  closeModal,
  isVisible,
  onDismiss,
  title,
  exercise,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [exerciseData, setExerciseData] = useState<exerciseFormData>({
    name: exercise?.name ?? "",
    instructions: exercise?.instructions ?? "",
    muscle: exercise?.muscle ?? "",
    equipment: exercise?.equipment ?? "",
    image: exercise?.image ?? undefined,
    imageExtension: undefined,
    imageWasChanged: false,
  });
  const [currentScreen, setCurrentScreen] = useState<exerciseFormScreenType>(
    exerciseFormScreensEnum.Main
  );
  const [createdExercise, setCreatedExercise] = useState<
    Exercise | undefined
  >();
  const [isActionModalVisible, setIsActionModalVisible] = useState(false);
  const [openActionModal, setOpenActionModal] = useState(false);

  const { user } = userStore();

  useEffect(() => {
    setExerciseData({
      name: exercise?.name ?? "",
      instructions: exercise?.instructions ?? "",
      muscle: exercise?.muscle ?? "",
      equipment: exercise?.equipment ?? "",
      image: exercise?.image ?? undefined,
      imageWasChanged: false,
      imageExtension: undefined,
    });
  }, [exercise]);

  const dataIsFilled =
    exerciseData.name && exerciseData.muscle && exerciseData.equipment;

  const translateXSharedValue = useSharedValue(0);

  const switchToScreen = (
    screenName: exerciseFormScreenType,
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

  const upsertExerciseHandler = async () => {
    setIsLoading(true);
    try {
      if (dataIsFilled) {
        const { imageWasChanged, imageExtension, ...rest } = exerciseData;
        const data = await upsertExercise({
          exercise: {
            ...exercise,
            ...rest,
            user_id: user?.id,
          },
          imageWasChanged,
          imageExtension,
        });
        if (data) {
          setCreatedExercise(data);
        }
      }
      setExerciseData({
        name: "",
        instructions: "",
        muscle: "",
        equipment: "",
        image: undefined,
        imageWasChanged: false,
        imageExtension: undefined,
      });
      closeModal();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const deleteExerciseHandler = async () => {
    if (!exercise) return;
    setIsLoading(true);
    await deleteExercise(exercise.id, exercise.image);
    setIsLoading(false);
    setIsActionModalVisible(false);
  };

  const openActionModalHandler = () => {
    setOpenActionModal(true);
    closeModal();
  };

  const closeModalHandler = () => {
    closeModal();
    setExerciseData({
      name: "",
      instructions: "",
      muscle: "",
      equipment: "",
      image: undefined,
      imageWasChanged: false,
      imageExtension: undefined,
    });
  };

  return (
    <>
      <Modal
        transparent={true}
        visible={isVisible}
        animationType="fade"
        onRequestClose={closeModalHandler}
        onDismiss={() => {
          if (openActionModal) {
            setOpenActionModal(false);
            setIsActionModalVisible(true);
          } else {
            if (onDismiss) onDismiss(createdExercise);
          }
        }}
      >
        {isLoading && <LoadingAnimation />}
        <TouchableWithoutFeedback onPress={closeModalHandler}>
          <View style={styles.modalOverlay}></View>
        </TouchableWithoutFeedback>
        <View style={styles.modalContent}>
          <Animated.View
            style={[styles.container, animatedStyle, { width: MODAL_WIDTH }]}
          >
            <View style={styles.screen}>
              <View style={styles.header}>
                <CloseButton onPress={closeModalHandler} />
                <Text style={styles.title}>{title}</Text>

                <Pressable
                  disabled={!dataIsFilled || isLoading}
                  onPress={upsertExerciseHandler}
                >
                  <Text
                    style={[
                      styles.title,
                      {
                        color: dataIsFilled ? AppColors.blue : AppColors.gray,
                      },
                    ]}
                  >
                    Save
                  </Text>
                </Pressable>
              </View>
              <FormScreen
                MODAL_WIDTH={MODAL_WIDTH}
                setExerciseData={setExerciseData}
                exerciseData={exerciseData}
                switchToScreen={switchToScreen}
              />
            </View>

            <OptionScreen
              muscle={exerciseData.muscle}
              equipment={exerciseData.equipment}
              currentScreen={currentScreen}
              setExerciseData={setExerciseData}
              switchToScreen={switchToScreen}
            />
          </Animated.View>
          {exercise && (
            <Pressable disabled={!exercise} onPress={openActionModalHandler}>
              <Text style={[styles.title, { color: AppColors.red }]}>
                Delete
              </Text>
            </Pressable>
          )}
        </View>
      </Modal>
      <ActionModal
        closeModal={() => setIsActionModalVisible(false)}
        isVisible={isActionModalVisible}
        title="Delete exercise"
        subtitle={`Are you sure you want to delete ${exercise?.name}?`}
        onCancel={() => setIsActionModalVisible(false)}
        onProceed={deleteExerciseHandler}
      />
    </>
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
  screen: {
    width: "100%",
    padding: 10,
  },
});
