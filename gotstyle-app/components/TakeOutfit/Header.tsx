import React from "react";
import { View, Dimensions, Pressable, Text } from "react-native";
import { colors } from "../../lib/util/colors";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const Header = ({ navigation }: { navigation: any }) => {
  return (
    <View
      style={{
        width: Dimensions.get("screen").width,
        backgroundColor: "transparent",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: 0,
        zIndex: 100,
        height: "8%",
      }}
    >
      <LinearGradient
        colors={["rgba(0, 0, 0, 1)", "transparent"]}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          bottom: 0,
        }}
      />
      <Pressable
        onPress={() => navigation.goBack()}
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: 5,
          backgroundColor: "transparent",
          shadowColor: "rgba(0, 0, 0, 0.5)",
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 10,
          shadowRadius: 5,
          position: "absolute",
          left: "2%",
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
        Capture your outfit
      </Text>
    </View>
  );
};

export default Header;
