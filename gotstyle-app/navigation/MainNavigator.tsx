import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { FC, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { colors } from "../lib/util/colors";
import { useAuth } from "../context/AuthContext";
import { mainConfig } from "./config/mainConfig";
import ProfileScreen from "../screens/App/Profiles/ProfileScreen";
import SingleProfilePageScreen from "../screens/App/Profiles/SingleProfilePageScreen";
import SingleProfileScreenModal from "../screens/App/Profiles/SingleProfilePageModal";
import { Feather } from "@expo/vector-icons";
import { Pressable } from "react-native";
import useDarkTheme from "../hooks/useDarkTheme";
import BottomTabNavigator from "./BottomTabNavigator";
import { useQuery } from "react-query";
import { outfitService } from "../api/outfits";

const Stack = createNativeStackNavigator();

const MainNavigator: FC = ({}) => {
  const { isFetching } = useAuth();
  const darkTheme = useDarkTheme();

  const { authState } = useAuth();

  const {
    refetch: refetchOutfits,
    data: outfits,
    isLoading: outfitsLoading,
  } = useQuery(
    "outfits",
    () => outfitService.getOutfits(authState?.access_token as string),
    {
      enabled: !isFetching,
    }
  );

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
    <Stack.Navigator initialRouteName="Home">
      {mainConfig.map(
        (config: { name: string; component: any; options: any }) => (
          <Stack.Screen
            key={config.name}
            name={config.name}
            component={config.component}
            options={config.options}
          />
        )
      )}

      <Stack.Screen
        name="SingleProfile"
        children={(props) => (
          <SingleProfilePageScreen {...props} refetchOutfits={refetchOutfits} />
        )}
        options={({ navigation }: { navigation: any }) => ({
          title: "Profile",
          headerTitleStyle: {
            fontFamily: "bas-semibold",
          },
          headerStyle: {
            backgroundColor: darkTheme ? colors.black : colors.white,
          },
          headerTintColor: darkTheme ? colors.white : colors.black,
          headerLeft: () => (
            <Pressable
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Feather
                name="chevron-left"
                size={30}
                color={darkTheme ? colors.white : colors.black}
              />
            </Pressable>
          ),
          headerShadowVisible: false,
        })}
      />

      <Stack.Screen
        name="SingleProfileModal"
        children={(props) => (
          <SingleProfileScreenModal
            {...props}
            refetchOutfits={refetchOutfits}
          />
        )}
        options={({ navigation }: { navigation: any }) => ({
          title: "Profile",
          headerTitleStyle: {
            fontFamily: "bas-semibold",
          },
          presentation: "fullScreenModal",
          headerStyle: {
            backgroundColor: darkTheme ? colors.black : colors.white,
          },
          headerTintColor: darkTheme ? colors.white : colors.black,
          headerLeft: () => (
            <Pressable
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Feather
                name="x"
                size={30}
                color={darkTheme ? colors.white : colors.black}
              />
            </Pressable>
          ),
          headerShadowVisible: false,
        })}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;
