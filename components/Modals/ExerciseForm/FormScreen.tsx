import CustomTextInput from "@/components/CustomTextInput";
import CustomImage from "@/components/CustomImage";
import { pickAndCompressImage } from "@/utils/images";
import {
  exerciseFormData,
  exerciseFormScreensEnum,
  exerciseFormScreenType,
} from "@/types/exerciseForm";
import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import useThemeStore from "@/store/useThemeStore";
import { useMemo } from "react";
import { ThemeColors } from "@/types/user";
const PlaceholderImage = require("@/assets/images/ImagePlaceholder.png");

type Props = {
  switchToScreen: (screen: exerciseFormScreenType, index: number) => void;
  setExerciseData: React.Dispatch<React.SetStateAction<exerciseFormData>>;
  exerciseData: exerciseFormData;
  MODAL_WIDTH: number;
};

const FormScreen = ({
  switchToScreen,
  setExerciseData,
  exerciseData,
  MODAL_WIDTH,
}: Props) => {
  const { theme } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme), [theme]);
  const setExerciseProperty = (
    propertyName: keyof exerciseFormData,
    value: string
  ) => {
    setExerciseData((prev) => ({ ...prev, [propertyName]: value }));
  };
  const pickImageAsync = async () => {
    const pickedImage = await pickAndCompressImage();
    if (!pickedImage) return;
    setExerciseData((prev) => ({
      ...prev,
      image: pickedImage.url,
      imageWasChanged: true,
      imageExtension: pickedImage.extension,
    }));
  };
  return (
    <>
      <CustomTextInput
        onChangeText={(text) => setExerciseProperty("name", text)}
        value={exerciseData.name}
        placeholder="Add Name"
      />
      <CustomTextInput
        onChangeText={(text) => setExerciseProperty("instructions", text)}
        value={exerciseData.instructions}
        placeholder="Instructions"
        size="lg"
      />
      <Pressable onPress={pickImageAsync} style={styles.imageContainer}>
        <CustomImage
          imageUrl={
            exerciseData?.image
              ? `data:image/${exerciseData.imageExtension};base64,${exerciseData.image}`
              : PlaceholderImage
          }
          height={200}
          width={200}
        />
      </Pressable>
      <Pressable
        onPress={() =>
          switchToScreen(exerciseFormScreensEnum.Muscle, -MODAL_WIDTH)
        }
        style={styles.link}
      >
        <Text style={[styles.linkText, { fontWeight: "bold" }]}>Muscle</Text>
        <View style={styles.linkRightSide}>
          <Text style={styles.linkText}>
            {exerciseData.muscle ? exerciseData.muscle : "None"}
          </Text>
          <MaterialIcons
            name="keyboard-arrow-right"
            size={24}
            color={theme.blue}
          />
        </View>
      </Pressable>
      <Pressable
        onPress={() =>
          switchToScreen(exerciseFormScreensEnum.Equipment, -MODAL_WIDTH)
        }
        style={styles.link}
      >
        <Text style={[styles.linkText, { fontWeight: "bold" }]}>Equipment</Text>
        <View style={styles.linkRightSide}>
          <Text style={styles.linkText}>
            {exerciseData.equipment ? exerciseData.equipment : "None"}
          </Text>
          <MaterialIcons
            name="keyboard-arrow-right"
            size={24}
            color={theme.blue}
          />
        </View>
      </Pressable>
    </>
  );
};

const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
    },
    imageContainer: {
      marginHorizontal: "auto",
      marginVertical: 10,
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
      color: theme.textColor,
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

export default FormScreen;
