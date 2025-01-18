import {
  View,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Pressable,
  Text,
  Dimensions,
} from "react-native";
import { useEffect, useState } from "react";
import useExerciseDetailsModal from "@/store/useExerciseDetailsModal";
import CloseButton from "@/components/CloseButton";
import userStore from "@/store/userStore";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import AboutScreen from "./AboutScreen";
import ChartsScreen from "./ChartsScreen";
import HistoryScreen from "./HistoryScreen";
import RecordsScreen from "./RecordsScreen";
import {
  exerciseDetailScreensEnum,
  exerciseDetailsScreenType,
} from "@/types/exerciseDetails";
import ExerciseFormModal from "../ExerciseForm/ExerciseFormModal";
import { calculateMetrics, getExerciseData } from "@/lib/exercisesService";
import { MetricsData } from "@/types/workoutMetrics";

const BUTTON_WIDTH = 80;
const screenWidth = Dimensions.get("window").width;

const screenButtons = [
  {
    name: exerciseDetailScreensEnum.About,
    label: "About",
  },
  {
    name: exerciseDetailScreensEnum.Charts,
    label: "Charts",
  },
  {
    name: exerciseDetailScreensEnum.Records,
    label: "Records",
  },
  {
    name: exerciseDetailScreensEnum.History,
    label: "History",
  },
];

export default function ExerciseDetailsModal() {
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState<MetricsData>({
    history: [],
    oneRMRecord: null,
    weightRecord: null,
    volumeRecord: null,
  });

  const [isEditExerciseModalVisible, setIsEditExerciseModalVisible] =
    useState(false);
  const [openEditExerciseModal, setOpenEditExerciseModal] = useState(false);

  const { isVisible, closeModal, exercise, screen, setScreen } =
    useExerciseDetailsModal();
  const { user } = userStore();

  const buttonBackgroundLeftPosition = useSharedValue(0);

  useEffect(() => {
    fetchExerciseData();
    if (exercise.instructions || exercise.image) {
      setScreen(exerciseDetailScreensEnum.About);
    } else {
      setScreen(exerciseDetailScreensEnum.Charts);
    }
  }, [exercise]);

  const fetchExerciseData = async () => {
    setLoading(true);

    const data = await getExerciseData(exercise.id, user!.id);

    if (data) {
      const calculatedMetrics = calculateMetrics(data);
      setData(calculatedMetrics);
    }

    setLoading(false);
  };

  const screenHandler = (
    position: number,
    screenName: exerciseDetailsScreenType
  ) => {
    setScreen(screenName);
    buttonBackgroundLeftPosition.value = withTiming(position, {
      duration: 200,
    });
  };

  const buttonsHeaderAnimatedStyles = useAnimatedStyle(() => ({
    left: buttonBackgroundLeftPosition.value,
  }));

  const renderScreen = () => {
    switch (screen) {
      case exerciseDetailScreensEnum.About:
        return (
          <AboutScreen
            instructions={exercise.instructions}
            image={exercise.image}
          />
        );
      case exerciseDetailScreensEnum.Charts:
        return <ChartsScreen data={data.history} loading={loading} />;
      case exerciseDetailScreensEnum.History:
        return <HistoryScreen loading={loading} history={data.history} />;
      case exerciseDetailScreensEnum.Records:
        return (
          <RecordsScreen
            loading={loading}
            oneRMRecord={data.oneRMRecord}
            volumeRecord={data.volumeRecord}
            weightRecord={data.weightRecord}
          />
        );
    }
  };

  const filteredScreenButtons =
    exercise.instructions || exercise.image
      ? screenButtons
      : screenButtons.filter(
          (btn) => btn.name !== exerciseDetailScreensEnum.About
        );

  const closeHandler = () => {
    closeModal();
    setScreen(exerciseDetailScreensEnum.About);
    buttonBackgroundLeftPosition.value = 0;
  };
  const editExerciseHandler = () => {
    setOpenEditExerciseModal(true);
    closeHandler();
  };
  return (
    <>
      <Modal
        transparent={true}
        visible={isVisible}
        animationType="fade"
        onRequestClose={closeHandler}
        onDismiss={() => {
          if (openEditExerciseModal) setIsEditExerciseModalVisible(true);
        }}
      >
        <TouchableWithoutFeedback onPress={closeHandler}>
          <View style={styles.modalOverlay}></View>
        </TouchableWithoutFeedback>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <CloseButton onPress={closeHandler} />
            <Text style={styles.title}>{exercise.name}</Text>
            <Pressable onPress={editExerciseHandler}>
              <Text style={styles.title}>Edit</Text>
            </Pressable>
            {/* {exercise.user_id === user?.id ? (
            <Pressable>
              <Text>Edit</Text>
            </Pressable>
          ) : (
            <View style={{ width: 30 }} />
          )} */}
          </View>
          <View style={styles.buttonsWrapper}>
            <Animated.View
              style={[styles.buttonsBackground, buttonsHeaderAnimatedStyles]}
            />
            {filteredScreenButtons.map((screenButton, index) => (
              <Pressable
                key={index}
                style={styles.headerButton}
                onPress={() =>
                  screenHandler(index * BUTTON_WIDTH, screenButton.name)
                }
              >
                <Text style={styles.headerButtonText}>
                  {screenButton.label}
                </Text>
              </Pressable>
            ))}
          </View>
          {renderScreen()}
        </View>
      </Modal>
      <ExerciseFormModal
        closeModal={() => {
          setIsEditExerciseModalVisible(false);
          setOpenEditExerciseModal(false);
        }}
        isVisible={isEditExerciseModalVisible}
        title="Update Exercise"
        exercise={exercise}
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
    width: screenWidth - 40,
    height: "60%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "white",
    overflow: "hidden",
    margin: "auto",
    gap: 10,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
  },
  buttonsWrapper: {
    justifyContent: "space-evenly",
    height: 30,
    flexDirection: "row",
    backgroundColor: "#3D3D42",
    borderRadius: 10,
  },
  buttonsBackground: {
    backgroundColor: "#525257",
    position: "absolute",
    height: 30,
    width: BUTTON_WIDTH,
    left: 0,
    borderRadius: 10,
  },
  headerButton: {
    height: 30,
    width: BUTTON_WIDTH,
    alignItems: "center",
    justifyContent: "center",
  },
  headerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
