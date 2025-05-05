import { useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Pressable,
} from "react-native";
import userStore from "@/store/userStore";
import { SafeAreaView } from "react-native-safe-area-context";
import AnchoredModal from "@/components/Modals/AnchoredModal";
import ModalOptionButton from "@/components/Modals/ModalOptionButton";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Link, useRouter } from "expo-router";
import { AppColors } from "@/constants/colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as Progress from "react-native-progress";
import { profileButtons } from "@/constants/profile";
import CustomImage from "@/components/CustomImage";

export default function Profile() {
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const router = useRouter();
  const optionsButtonRef = useRef(null);

  const handleOptionsPress = () => {
    setIsOptionsVisible(true);
  };

  const handleOptionsClose = () => {
    setIsOptionsVisible(false);
  };

  const signOut = async () => {
    try {
      userStore.setState({ session: null, user: null });
      await supabase.auth.signOut();
    } catch (error) {
      console.log(error);
    }
  };
  const routeNavigateHandler = (routeName: any) => {
    setIsOptionsVisible(false);
    router.navigate(routeName);
  };
  const options = [
    {
      title: "Edit Profile",
      Icon: <FontAwesome5 name="user-edit" size={24} color={AppColors.gray} />,
      cb: () => routeNavigateHandler("/userForm"),
    },
    {
      title: "Sign Out",
      Icon: <AntDesign name="logout" size={24} color={AppColors.gray} />,
      cb: signOut,
    },
  ];
  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.title}>TRUE GRIND</Text>
      <FontAwesome
        name="user-circle"
        size={100}
        color={AppColors.charcoalGray}
      />
      <Text style={[styles.title, styles.name]}>Jacob Smith</Text>
      <View style={styles.infoContainer}>
        <Text>Age</Text>
        <Text>-</Text>
        <Text>Height</Text>
        <Text>-</Text>
        <Text>Weight</Text>
      </View>
      <View style={styles.boxesContainer}>
        <View style={styles.infoBox}>
          <Text style={styles.infoBoxTitle}>Weight Goal</Text>
          <Text style={styles.infoBoxValue}>70 kg</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoBoxTitle}>Workout Frequency</Text>
          <Text style={styles.infoBoxValue}>3 per week</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoBoxTitle}>Body Goal</Text>
          <Text style={styles.infoBoxValue}>Muscle weight</Text>
        </View>
      </View>
      <View style={styles.progressWrapper}>
        <Text style={styles.infoBoxValue}>Progress</Text>
        <View style={styles.progressInfo}>
          <Text>75 kg</Text>
          <Text>70 kg</Text>
        </View>
        <Progress.Bar
          progress={0.3}
          width={350}
          color={AppColors.blue}
          style={styles.progress}
        />
      </View>
      <View style={styles.buttonsWrapper}>
        {profileButtons.map((button, i) => (
          <Link href={button.href} key={button.label}>
            <View
              style={[
                styles.profileButton,
                i > 0 && styles.profileButtonSeparator,
              ]}
            >
              <Text>{button.label}</Text>
              <AntDesign
                name="right"
                size={24}
                color={AppColors.charcoalGray}
              />
            </View>
          </Link>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: AppColors.black,
    textAlign: "center",
  },
  name: {
    fontSize: 32,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: 10,
  },
  boxesContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  infoBox: {
    height: 100,
    width: "30%",
    borderColor: AppColors.charcoalGray,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    gap: 10,
  },
  infoBoxTitle: {
    textAlign: "center",
    fontWeight: "bold",
  },
  infoBoxValue: {},
  progressWrapper: {
    width: "100%",
    borderColor: AppColors.charcoalGray,
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    gap: 10,
  },
  progressInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progress: {
    width: "100%",
  },
  buttonsWrapper: {
    borderRadius: 10,
    borderColor: AppColors.charcoalGray,
    borderWidth: 2,
    width: "100%",
  },
  profileButton: {
    width: "100%",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  profileButtonSeparator: {
    borderTopWidth: 2,
    borderTopColor: AppColors.charcoalGray,
  },
});
