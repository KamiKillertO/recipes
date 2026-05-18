import { Stack, Redirect } from "expo-router";
import { useAuthStore } from "../src/lib/authStore";

export default function RootLayout() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

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
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="recipe/[id]" options={{ title: "Recipe Details" }} />
      <Stack.Screen name="recipe/new" options={{ title: "New Recipe" }} />
      <Stack.Screen
        name="recipe/edit/[id]"
        options={{ title: "Edit Recipe" }}
      />
      <Stack.Screen name="import" options={{ title: "Scan Recipe" }} />
    </Stack>
  );
}
