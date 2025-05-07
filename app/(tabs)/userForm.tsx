import React, { useState } from "react";
import CustomHeader from "@/components/CustomHeader";
import CustomTextInput from "@/components/CustomTextInput";
import { bodyPartsToMeasure, corePartsToMeasure } from "@/constants/metrics";
import { updateUserProfile } from "@/lib/userService";
import userStore from "@/store/userStore";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import { AppColors } from "@/constants/colors";
import { CurrentGoal } from "@/types/user";
import { BodyPartLabel } from "@/types/measurements";

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
  const [loading, setLoading] = useState(false);

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
      await updateUserProfile(user.id, formData);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const measurements = [
    ...corePartsToMeasure.map((part) => ({
      label: part.displayName,
      value: part.label,
      unit: part.unit,
    })),
    ...bodyPartsToMeasure.map((part) => ({
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
          <View
            style={[
              styles.pickerContainer,
              Platform.OS === "android" && styles.androidPicker,
            ]}
          >
            <Picker
              selectedValue={formData.current_goal.name}
              onValueChange={(itemValue) => handleGoalChange("name", itemValue)}
              style={styles.picker}
              mode="dropdown"
              itemStyle={styles.pickerItem}
              numberOfLines={1}
            >
              <Picker.Item
                label="Select measurement..."
                value=""
                key="placeholder"
              />
              {measurements.map((measurement) => (
                <Picker.Item
                  label={measurement.label}
                  value={measurement.value}
                  key={measurement.value}
                />
              ))}
            </Picker>
          </View>

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

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { padding: 20, gap: 16 },
  field: { width: "100%" },
  label: { fontSize: 16, marginBottom: 8, color: AppColors.black },
  pickerContainer: {
    zIndex: 10,
    color: AppColors.black,
  },
  pickerItem: {
    height: 150,
    color: AppColors.black,
  },
  androidPicker: {
    elevation: 2,
  },
  picker: {
    width: "100%",
  },
  button: {
    marginTop: 24,
    backgroundColor: AppColors.blue,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: AppColors.white, fontSize: 16, fontWeight: "600" },
});
