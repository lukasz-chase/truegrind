import React, { useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
  GestureResponderEvent,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import useThemeStore from "@/store/useThemeStore";
import { AppTheme, AppThemeEnum, ThemeColors } from "@/types/user";

type ItemType = {
  label: string;
  displayName: string;
  unit: string;
};
interface MeasurementListProps {
  title: string;
  items: {
    label: string;
    displayName: string;
    unit: string;
  }[];
  measurements: {
    [key: string]: { value: number; unit: string };
  };
  onPressPlus: (item: ItemType) => void;
}

export default function MeasurementList({
  title,
  items,
  measurements,
  onPressPlus,
}: MeasurementListProps) {
  const { theme, mode } = useThemeStore((state) => state);

  const styles = useMemo(() => makeStyles(theme, mode), [theme, mode]);
  const router = useRouter();
  const handleRouteChange = (label: string) => {
    router.push(`/metrics/${label}`, {});
  };
  const pressHandler = (e: GestureResponderEvent, item: ItemType) => {
    e.stopPropagation();
    onPressPlus(item);
    if (Platform.OS !== "web") {
      Haptics.selectionAsync();
    }
  };

  return (
    <>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.list}>
        {items.map((item) => (
          <Pressable
            onPress={() => handleRouteChange(item.label)}
            style={styles.row}
            key={item.label}
          >
            <Text style={styles.partLabel}>{item.displayName}</Text>
            <View style={styles.row}>
              <Text style={styles.valueText}>
                {measurements[item.label]
                  ? measurements[item.label].value +
                    measurements[item.label].unit
                  : "-"}
              </Text>

              <Pressable
                style={styles.addButton}
                onPress={(e) => pressHandler(e, item)}
              >
                <AntDesign name="plus" size={24} color={theme.blue} />
              </Pressable>
            </View>
          </Pressable>
        ))}
      </View>
    </>
  );
}
const makeStyles = (theme: ThemeColors, mode: AppTheme) =>
  StyleSheet.create({
    sectionTitle: {
      fontSize: 18,
      marginVertical: 10,
      color: mode === AppThemeEnum.DARK ? theme.lightBlue : theme.darkGray,
    },
    list: {
      gap: 5,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      justifyContent: "space-between",
    },
    partLabel: {
      fontWeight: "bold",
      fontSize: 18,
      color: theme.textColor,
    },
    valueText: {
      color: theme.textColor,
    },
    addButton: {
      backgroundColor: theme.lightBlue,
      width: 40,
      height: 40,
      borderRadius: 50,
      justifyContent: "center",
      alignItems: "center",
    },
  });
