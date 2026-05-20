import { Stack } from "expo-router";
import { SplashScreenController } from "../src/lib/splash";
import { AuthProvider, useAuth } from "../src/lib/AuthContext";

function RootLayout() {
  const { isAuthenticated } = useAuth();

  console.log({ isAuthenticated });

  return (
    <Stack>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="recipe/[id]"
          options={{ title: "Recipe Details" }}
        />
        <Stack.Screen name="recipe/new" options={{ title: "New Recipe" }} />
        <Stack.Screen
          name="recipe/edit/[id]"
          options={{ title: "Edit Recipe" }}
        />
        <Stack.Screen name="import" options={{ title: "Scan Recipe" }} />
      </Stack.Protected>

      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function Root() {
  // Set up the auth context and render your layout inside of it.
  return (
    <AuthProvider>
      <SplashScreenController />
      <RootLayout />
    </AuthProvider>
  );
}
