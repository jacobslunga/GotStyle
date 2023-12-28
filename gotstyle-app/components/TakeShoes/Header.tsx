import { View, Text, Dimensions, Pressable } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../lib/util/colors";
import { Feather } from "@expo/vector-icons";

export default function Header({ navigation }: { navigation: any }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        width: Dimensions.get("screen").width,
        backgroundColor: "transparent",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: insets.top,
        zIndex: 100,
      }}
    >
      <Pressable
        onPress={() => navigation.goBack()}
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: 5,
          shadowColor: "rgba(0, 0, 0, 0.5)",
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 10,
          shadowRadius: 5,
          position: "absolute",
          left: "2%",
          backgroundColor: "transparent",
        }}
      >
        <Feather name="x" size={30} color={colors.white} />
      </Pressable>

      <Text
        style={{
          color: colors.white,
          fontFamily: "bas-bold",
          shadowColor: "rgba(0, 0, 0, 0.5)",
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 10,
          shadowRadius: 5,
          fontSize: 20,
        }}
      >
        Wearing some nice shoes?
      </Text>
    </View>
  );
}
