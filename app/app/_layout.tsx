import { Stack, Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { useAuthStore } from "../src/lib/authStore";

export default function RootLayout() {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    checkAuth().finally(() => setIsReady(true));
  }, []);

  if (!isReady) {
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
      <Stack.Screen name="login" options={{ headerShown: false }} />
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