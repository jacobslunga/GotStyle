import { FC } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { colors } from "../../lib/util/colors";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

interface LandingScreenProps {
  navigation: any;
}

const LandingScreen: FC<LandingScreenProps> = ({ navigation }) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "space-evenly",
        alignItems: "center",
        backgroundColor: "#000",
        flexDirection: "column",
      }}
    >
      <StatusBar style="dark" />
      <Image
        source={require("../../assets/images/mesh-gradient.png")}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
        }}
      />
      <Text
        style={{
          fontFamily: "logo",
          fontSize: 35,
          color: colors.black,
          letterSpacing: -1,
          height: 100,
        }}
      >
        GotStyle
      </Text>

      <View
        style={{
          width: "100%",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontFamily: "bas-bold",
            fontSize: 40,
            color: colors.black,
            textAlign: "center",
            maxWidth: "80%",
          }}
        >
          Welcome to GotStyle
        </Text>

        <Text
          style={{
            fontFamily: "bas-regular",
            fontSize: 16,
            color: colors.black,
            marginTop: 20,
          }}
        >
          The app where style is of the essence
        </Text>
      </View>

      <TouchableOpacity
        style={{
          width: "80%",
          height: 50,
          borderRadius: 15,
          marginTop: 30,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.black,
          flexDirection: "row",
        }}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          navigation.reset({
            index: 0,
            routes: [{ name: "Tutorial" }],
          });
        }}
      >
        <Text
          style={{
            fontFamily: "bas-semibold",
            fontSize: 16,
            color: colors.white,
            marginRight: 10,
          }}
        >
          Let's Get Started
        </Text>
        <AntDesign name="arrowright" size={24} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
};

export default LandingScreen;
