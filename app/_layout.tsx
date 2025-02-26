import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useContext } from "react";
import { Appearance } from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemeProvider } from "@/context/ThemeContext";
import { ThemeContext } from "@/context/ThemeContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // const colorScheme = Appearance.getColorScheme();
  const { theme, colorScheme, setColorScheme } = useContext(ThemeContext);
  // const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colorScheme === "dark" ? "#000000" : "#F2F2F7",
          },
          headerTintColor: theme.text,
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="index"
          options={{ headerShown: false, title: "Home" }}
        />
        <Stack.Screen
          name="contact"
          options={{
            headerShown: true,
            title: "Contact",
            headerTitle: "Contact Us",
          }}
        />
        <Stack.Screen
          name="menu"
          options={{
            headerShown: true,
            title: "Menu",
            headerTitle: "Coffee Shop Menu",
          }}
        />
        <Stack.Screen
          name="todo"
          options={{
            headerShown: true,
            title: "Todo List",
            headerTitle: "Todo List",
            headerStyle: {
              backgroundColor: colorScheme === "dark" ? "black" : "white",
            },
            headerTintColor: colorScheme === "dark" ? "white" : "black",
          }}
        />
        <Stack.Screen name="todos/[id]" />

        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
