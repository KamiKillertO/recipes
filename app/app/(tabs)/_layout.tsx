import { Stack } from 'expo-router';

export default function TabLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'My Recipes',
          headerLargeTitle: true,
        }}
      />
      <Stack.Screen
        name="grocery"
        options={{
          title: 'Grocery List',
          headerLargeTitle: true,
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerLargeTitle: true,
        }}
      />
    </Stack>
  );
}