import { FC } from "react";
import { SafeAreaView, View, Text } from "react-native";
import PhoneMockup from "../../components/Tutorial/PhoneMockup";
import { StatusBar } from "expo-status-bar";

interface TutorialScreenProps {
  navigation: any;
}

const TutorialScreen: FC<TutorialScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView
      style={{
        backgroundColor: "#000",
        flex: 1,
      }}
    >
      <View
        style={{
          backgroundColor: "#000",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <StatusBar style="light" animated />
        <Text
          style={{
            fontFamily: "bas-semibold",
            fontSize: 20,
            color: "rgba(255,255,255,1)",
            position: "absolute",
            top: "5%",
          }}
        >
          How To GotStyle
        </Text>
        <PhoneMockup navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default TutorialScreen;
