import { PROFILE_TABS } from "@/constants/tabs";
import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      {PROFILE_TABS.map((tab) => (
        <Stack.Screen
          key={tab.name}
          name={tab.name}
          options={{
            animation: tab.animation as any,
          }}
        />
      ))}
    </Stack>
  );
}
