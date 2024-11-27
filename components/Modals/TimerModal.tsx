import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import AnchoredModal from "./AnchoredModal";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import * as Notifications from "expo-notifications";
import { AppColors } from "@/constants/colors";
import useTimerStore from "@/store/useTimer";
import { useState } from "react";
import MemoizedScrollPicker from "../MemoizedScrollPicker";
import { formatTime } from "@/lib/helpers";
import userStore from "@/store/userStore";
import { updateUserProfile } from "@/lib/supabaseActions";
import * as Haptics from "expo-haptics";

type Props = {
  isVisible: boolean;
  closeModal: () => void;
  buttonRef: React.MutableRefObject<null>;
};

export default function TimerModal({
  closeModal,
  isVisible,
  buttonRef,
}: Props) {
  const [customTimerView, setCustomTimerView] = useState(false);
  const [customDuration, setCustomDuration] = useState(60);
  const { user } = userStore();
  const {
    timeRemaining,
    isRunning,
    startTimer,
    addToTimer,
    reduceFromTimer,
    endTimer,
    timerDuration,
  } = useTimerStore();

  const sendNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Time's Up!",
        body: "Your timer is complete.",
      },
      trigger: null,
    });
  };

  const handleTimerComplete = () => {
    sendNotification();
    endTimer();
    closeModal();
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
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
      await updateUserProfile(customTimers, user!.id);
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
    >
      <View style={styles.container}>
        <View style={styles.modalHeader}>
          <Pressable
            style={styles.headerButton}
            onPress={() => {
              closeModal();
              setCustomTimerView(false);
            }}
          >
            <EvilIcons name="close" size={24} color="black" />
          </Pressable>
          <Text style={styles.title}>Rest Timer</Text>
          <Pressable style={styles.headerButton}>
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
                  customDuration={customDuration}
                  setCustomDuration={setCustomDuration}
                  visibleItemCount={9}
                  textColor="black"
                  backgroundColor="gray"
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
              onPress={() => {
                endTimer();
                closeModal();
              }}
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
