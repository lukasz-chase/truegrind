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
import { useRouter } from "expo-router";
import { AppColors } from "@/constants/colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
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
    <>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.profileContainer}>
          <Text style={styles.profileText}>User Profile</Text>
          <TouchableOpacity
            ref={optionsButtonRef}
            style={styles.optionsButton}
            onPress={handleOptionsPress}
          >
            <FontAwesome name="cog" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.buttonsWrapper}>
          <Pressable
            style={styles.button}
            onPress={() => routeNavigateHandler("/metrics")}
          >
            <Text style={styles.buttonText}>Metrics</Text>
            <AntDesign name="right" size={24} color={AppColors.gray} />
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => routeNavigateHandler("/progressPhotos")}
          >
            <Text style={styles.buttonText}>Progress Photos</Text>
            <AntDesign name="right" size={24} color={AppColors.gray} />
          </Pressable>
        </View>
      </SafeAreaView>
      <AnchoredModal
        isVisible={isOptionsVisible}
        closeModal={handleOptionsClose}
        anchorRef={optionsButtonRef}
        anchorCorner="RIGHT"
        modalWidth={300}
        backgroundColor={AppColors.darkBlue}
      >
        <View style={styles.wrapper}>
          {options.map((option) => (
            <ModalOptionButton key={option.title} {...option} />
          ))}
        </View>
      </AnchoredModal>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: 10,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: 16,
  },
  profileText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  optionsButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  optionsText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  wrapper: {
    width: "100%",
  },
  buttonsWrapper: {},
  button: {
    width: "100%",
    height: 50,
    backgroundColor: AppColors.blue,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    gap: 10,
  },

  buttonText: {
    color: "white",
  },
});
