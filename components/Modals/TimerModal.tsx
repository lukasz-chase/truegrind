import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import AnchoredModal from "./AnchoredModal";
import AntDesign from "@expo/vector-icons/AntDesign";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { AppColors } from "@/constants/colors";
import useTimerStore from "@/store/useTimer";
import { useState } from "react";
import MemoizedScrollPicker from "../MemoizedScrollPicker";
import { formatTime } from "@/lib/helpers";
import userStore from "@/store/userStore";
import CloseButton from "../CloseButton";
import useWorkoutTimerModal from "@/store/useWorkoutTimerModal";
import { updateUserProfile } from "@/lib/userService";
import useInfoModal from "@/store/useInfoModall";
import { timerInfo } from "@/constants/infoModal";

const screenWidth = Dimensions.get("window").width;

export default function TimerModal() {
  const [customTimerView, setCustomTimerView] = useState(false);
  const [customDuration, setCustomDuration] = useState(60);
  const [shouldOpenInfoModal, setShouldOpenInfoModal] = useState(false);

  const { user } = userStore();
  const timeOptions = Array.from({ length: 121 }, (_, i) => ({
    value: i * 5,
    label: formatTime(i * 5),
  }));
  const {
    timeRemaining,
    isRunning,
    startTimer,
    addToTimer,
    reduceFromTimer,
    endTimer,
    timerDuration,
  } = useTimerStore();
  const { closeModal, isVisible, buttonRef } = useWorkoutTimerModal();
  const { openModal: openInfoModal } = useInfoModal();
  const handleTimerComplete = () => {
    endTimer();
    closeModal();
  };

  const customTimerHandler = async () => {
    if (!customTimerView) {
      setCustomTimerView(true);
    } else {
      startTimer(customDuration);
      setCustomTimerView(false);
      const customTimers = user?.custom_timers || [];
      customTimers.unshift(customDuration);
      customTimers.pop();
      await updateUserProfile(user!.id, { custom_timers: customTimers });
    }
  };
  return (
    <AnchoredModal
      isVisible={isVisible}
      closeModal={() => {
        closeModal();
        setCustomTimerView(false);
      }}
      anchorRef={buttonRef}
      anchorCorner="LEFT"
      modalWidth={screenWidth * 0.9}
      onDismiss={() => {
        if (shouldOpenInfoModal) {
          openInfoModal(timerInfo.title, timerInfo.description);
          setShouldOpenInfoModal(false);
        }
      }}
    >
      <View style={styles.container}>
        <View style={styles.modalHeader}>
          <CloseButton
            onPress={() => {
              closeModal();
              setCustomTimerView(false);
            }}
          />
          <Text style={styles.title}>Rest Timer</Text>
          <Pressable
            style={styles.headerButton}
            onPress={() => {
              setShouldOpenInfoModal(true);
              closeModal();
            }}
          >
            <AntDesign name="question" size={24} color="black" />
          </Pressable>
        </View>

        <View style={styles.textInfoWrapper}>
          <Text style={styles.textInfo}>
            Choose a duration below or set your own.
          </Text>
          <Text style={styles.textInfo}>
            Custom durations are saved for next time.
          </Text>
        </View>
        <AnimatedCircularProgress
          size={300}
          width={5}
          fill={
            Math.floor((timeRemaining / timerDuration) * 100)
              ? Math.floor((timeRemaining / timerDuration) * 100)
              : 0
          }
          duration={timerDuration}
          rotation={0}
          backgroundWidth={5}
          tintColor={AppColors.blue}
          backgroundColor={AppColors.gray}
          onAnimationComplete={() => {
            if (timeRemaining === 0 && isRunning) {
              handleTimerComplete();
            }
          }}
        >
          {() => {
            if (isRunning) {
              return (
                <View style={styles.timeOptionsContainer}>
                  <Text style={styles.timerText}>
                    {formatTime(timeRemaining)}
                  </Text>
                  <Text style={styles.timerDuration}>
                    {formatTime(timerDuration)}
                  </Text>
                </View>
              );
            }
            if (customTimerView) {
              return (
                <MemoizedScrollPicker
                  value={customDuration}
                  setValue={setCustomDuration}
                  visibleItemCount={9}
                  textColor="black"
                  backgroundColor="gray"
                  data={timeOptions}
                />
              );
            }

            return (
              <View style={styles.timeOptionsContainer}>
                {user?.custom_timers.map((timer, index) => (
                  <Pressable
                    key={timer + index}
                    onPress={() => startTimer(timer)}
                  >
                    <Text style={styles.timeOption}>{formatTime(timer)}</Text>
                  </Pressable>
                ))}
              </View>
            );
          }}
        </AnimatedCircularProgress>
        {isRunning ? (
          <View style={styles.timerButtonManagementContainer}>
            <Pressable
              style={styles.timerButtonManagement}
              onPress={() => reduceFromTimer(10)}
            >
              <Text style={styles.timerButtonManagementText}>-10</Text>
            </Pressable>
            <Pressable
              style={styles.timerButtonManagement}
              onPress={() => addToTimer(10)}
            >
              <Text style={styles.timerButtonManagementText}>+10</Text>
            </Pressable>
            <Pressable
              style={styles.timerButtonManagement}
              onPress={handleTimerComplete}
            >
              <Text style={styles.timerButtonManagementText}>Skip</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            style={styles.customTimerButton}
            onPress={customTimerHandler}
          >
            <Text style={styles.customTimerButtonText}>
              {customTimerView ? "Start Custom Timer" : "Create Custom Timer"}
            </Text>
          </Pressable>
        )}
      </View>
    </AnchoredModal>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
    alignItems: "center",
    width: "100%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  headerButton: {
    backgroundColor: AppColors.gray,
    paddingHorizontal: 5,
    borderRadius: 10,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  textInfoWrapper: {
    width: "100%",
  },
  textInfo: {
    textAlign: "center",
    fontSize: 18,
  },
  timeOptionsContainer: {
    gap: 20,
    alignItems: "center",
  },
  timeOption: {
    fontSize: 24,
    fontWeight: "bold",
  },
  timerText: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
  },
  timerDuration: {
    fontSize: 24,
    textAlign: "center",
  },
  timerButtonManagementContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    gap: 20,
  },
  timerButtonManagement: {
    flex: 1,
    backgroundColor: AppColors.gray,
    paddingVertical: 5,
    borderRadius: 5,
  },
  timerButtonManagementText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  customTimerButton: {
    backgroundColor: AppColors.gray,
    paddingVertical: 5,
    width: "100%",
    marginBottom: 20,
    borderRadius: 5,
  },
  customTimerButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
