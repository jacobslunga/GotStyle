import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FC } from "react";
import WelcomeScreen from "../screens/Auth/WelcomeScreen";
import BasicSettingsScreen from "../screens/Auth/BasicSettingsScreen";
import LandingScreen from "../screens/Auth/LandingScreen";
import TutorialScreen from "../screens/Auth/TutorialScreen";
import SignupScreen from "../screens/Auth/SignupScreen";
import LoginScreen from "../screens/Auth/LoginScreen";

const Stack = createNativeStackNavigator();

interface AuthNavigatorProps {}

const AuthNavigator: FC<AuthNavigatorProps> = ({}) => {
  return (
    <Stack.Navigator initialRouteName="Landing">
      {/* Auth */}
      <Stack.Screen
        name="Landing"
        component={LandingScreen}
        options={{ headerShown: false, presentation: "fullScreenModal" }}
      />

      <Stack.Screen
        name="Tutorial"
        component={TutorialScreen}
        options={{
          headerShown: false,
          presentation: "card",
          animation: "simple_push",
        }}
      />

      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false, presentation: "fullScreenModal" }}
      />

      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{
          headerShown: false,
          presentation: "formSheet",
          animation: "fade_from_bottom",
        }}
      />

      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
          presentation: "formSheet",
          animation: "fade_from_bottom",
        }}
      />

      <Stack.Screen
        name="BasicSettings"
        component={BasicSettingsScreen}
        options={{ headerShown: false, presentation: "modal" }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
