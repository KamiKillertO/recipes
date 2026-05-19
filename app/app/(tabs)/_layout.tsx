import { Stack } from "expo-router";

export default function TabLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#2E7D32",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "My Recipes",
          headerLargeTitle: true,
        }}
      />
      <Stack.Screen
        name="grocery"
        options={{
          title: "Grocery List",
          headerLargeTitle: true,
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: "Settings",
          headerLargeTitle: true,
        }}
      />
    </Stack>
  );
}