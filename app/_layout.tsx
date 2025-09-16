import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
  return (
    <PaperProvider>
      <Stack>
        <Stack.Screen
          name="todo"
          options={{ presentation: "modal", headerShown: false }}
        />
      </Stack>
    </PaperProvider>
  );
}
