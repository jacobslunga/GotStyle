import { FC } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ActivityIndicator } from "react-native";

import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";
import { useAuth } from "../context/AuthContext";
import { colors } from "../lib/util/colors";

const Stack = createNativeStackNavigator();

const AppNavigator: FC = () => {
  const { authState, isFetching, isValid } = useAuth();

  if (isFetching) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.black,
        }}
      >
        <ActivityIndicator size="small" color={colors.white} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={authState?.access_token && isValid ? "Main" : "Auth"}
      >
        {/* Auth */}
        <Stack.Screen
          name="Auth"
          component={AuthNavigator}
          options={{ headerShown: false }}
        />

        {/* App */}
        <Stack.Screen
          name="Main"
          component={MainNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
