import React, { useMemo, useState } from "react";
import CustomHeader from "@/components/CustomHeader";
import CustomTextInput from "@/components/CustomTextInput";
import {
  BODY_PARTS_TO_MEASURE,
  CORE_PARTS_TO_MEASURE,
} from "@/constants/metrics";
import { updateUserProfile } from "@/lib/userService";
import userStore from "@/store/userStore";
import { Pressable, StyleSheet, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CurrentGoal, ThemeColors } from "@/types/user";
import { BodyPartLabel } from "@/types/measurements";
import MemoizedScrollPicker from "@/components/MemoizedScrollPicker";
import { pickAndCompressImage } from "@/utils/images";
import CustomImage from "@/components/CustomImage";
import useThemeStore from "@/store/useThemeStore";

const PlaceholderImage = require("@/assets/images/ImagePlaceholder.png");

interface ProfileFormData {
  username: string;
  age: number;
  height: number;
  current_goal: CurrentGoal;
}

export default function UserForm() {
  const { user } = userStore((state) => state);

  const [formData, setFormData] = useState<ProfileFormData>({
    username: user?.username || "",
    age: user?.age || 0,
    height: user?.height || 0,
    current_goal: user?.current_goal || {
      name: BodyPartLabel.CHEST,
      value: 0,
      unit: "cm",
    },
  });
  const [profilePicture, setProfilePicture] = useState({
    url: user?.profile_picture || PlaceholderImage,
    extension: "png",
    imageWasChanged: false,
  });
  const [loading, setLoading] = useState(false);
  const { theme } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme), [theme]);
  const handleChange = <K extends keyof Omit<ProfileFormData, "goal">>(
    field: K,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value } as any));
  };

  const handleGoalChange = (field: keyof CurrentGoal, value: string) => {
    setFormData((prev) => ({
      ...prev,
      current_goal: {
        ...prev.current_goal,
        [field]: value,
      },
    }));
  };

  const pickImageAsync = async () => {
    const pickedImage = await pickAndCompressImage();
    if (!pickedImage) return;
    setProfilePicture({
      url: pickedImage.url,
      extension: pickedImage.extension,
      imageWasChanged: true,
    });
  };

  const updateProfile = async () => {
    setLoading(true);
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      if (formData.current_goal.name) {
        const goalUnit = measurements.find(
          (m) => m.value === formData.current_goal.name
        );
        handleGoalChange("unit", goalUnit ? goalUnit.unit : "cm");
      }
      await updateUserProfile(user.id, formData, profilePicture);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const measurements = [
    ...CORE_PARTS_TO_MEASURE.map((part) => ({
      label: part.displayName,
      value: part.label,
      unit: part.unit,
    })),
    ...BODY_PARTS_TO_MEASURE.map((part) => ({
      label: part.displayName,
      value: part.label,
      unit: part.unit,
    })),
  ];
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <CustomHeader name="Edit Profile" href="/profile" />

        <View style={styles.field}>
          <Text style={styles.label}>Profile Picture</Text>
          <Pressable onPress={pickImageAsync}>
            <CustomImage
              imageUrl={
                profilePicture.imageWasChanged
                  ? `data:image/${profilePicture.extension};base64,${profilePicture.url}`
                  : profilePicture.url
              }
              height={200}
              width={200}
            />
          </Pressable>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Username</Text>
          <CustomTextInput
            placeholder="Username"
            value={formData.username}
            onChangeText={(text) => handleChange("username", text)}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Age</Text>
          <CustomTextInput
            placeholder="Age"
            value={`${formData.age}`}
            onChangeText={(text) => handleChange("age", Number(text))}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Height (cm)</Text>
          <CustomTextInput
            placeholder="Height (cm)"
            value={`${formData.height}`}
            onChangeText={(text) => handleChange("height", Number(text))}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Measurement to Track</Text>
          <MemoizedScrollPicker
            data={measurements as any}
            value={formData.current_goal.name}
            setValue={(itemValue: string) =>
              handleGoalChange("name", itemValue)
            }
            visibleItemCount={3}
          />

          <Text style={styles.label}>Goal Value</Text>
          <CustomTextInput
            placeholder="Enter goal value"
            value={`${formData.current_goal.value}`}
            onChangeText={(text) => handleGoalChange("value", text)}
            keyboardType="numeric"
          />
        </View>

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={updateProfile}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Updating..." : "Update Profile"}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.background },
    container: { padding: 20, gap: 16 },
    field: { width: "100%" },
    label: { fontSize: 16, marginBottom: 8, color: theme.textColor },
    button: {
      marginTop: 24,
      backgroundColor: theme.blue,
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: "center",
    },
    buttonDisabled: { opacity: 0.6 },
    buttonText: { color: theme.white, fontSize: 16, fontWeight: "600" },
  });
