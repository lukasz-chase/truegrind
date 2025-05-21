import CustomHeader from "@/components/CustomHeader";
import CustomSelect from "@/components/Modals/CustomSelect";
import useThemeStore from "@/store/useThemeStore";
import { AppThemeEnum, ThemeColors } from "@/types/user";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Theme() {
  const { theme, changeTheme, mode } = useThemeStore((state) => state);
  const [newTheme, setNewTheme] = useState(mode);
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const updateTheme = () => {
    changeTheme(newTheme);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.verticallySpaced}>
        <CustomHeader name="App Theme" href="/profile" />
        <Text style={styles.label}>Theme</Text>
        <CustomSelect
          data={[
            { value: AppThemeEnum.LIGHT, label: "Light" },
            { value: AppThemeEnum.DARK, label: "Dark" },
          ]}
          selectedValue={newTheme}
          setSelectedValue={setNewTheme}
          buttonLabel="Select theme"
          anchor="LEFT"
          size="lg"
        />

        <Pressable
          onPress={updateTheme}
          style={[
            styles.button,
            {
              backgroundColor:
                mode === AppThemeEnum.DARK ? theme.black : theme.graphiteGray,
            },
          ]}
        >
          <Text style={styles.buttonText}>Update</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      width: "100%",
      height: "100%",
      alignItems: "center",
      padding: 20,
      gap: 10,
      backgroundColor: theme.background,
    },
    verticallySpaced: {
      width: "100%",
    },
    label: {
      color: theme.textColor,
      fontWeight: "bold",
      paddingVertical: 10,
    },
    button: {
      marginTop: 24,
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: "center",
    },
    buttonDisabled: { opacity: 0.6 },
    buttonText: { color: theme.white, fontSize: 16, fontWeight: "600" },
  });
