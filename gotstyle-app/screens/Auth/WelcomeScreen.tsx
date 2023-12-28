import { StatusBar } from "expo-status-bar";
import { FC } from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  Pressable,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { colors } from "../../lib/util/colors";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";

interface WelcomeScreenProps {
  navigation: any;
}

const WelcomeScreen: FC<WelcomeScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const safeHeight =
    Dimensions.get("screen").height - insets.top - insets.bottom;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.black,
      }}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <StatusBar style="light" />
        <View style={[{ ...styles.welcomeContainer, height: safeHeight }]}>
          <Image
            source={{
              uri: "https://gotstyle-bucket.s3.eu-central-1.amazonaws.com/welcome.webp",
              cache: "force-cache",
            }}
            style={styles.bgImage}
          />

          <Pressable style={styles.policies}>
            <AntDesign name="question" size={24} color="white" />
          </Pressable>

          <View style={styles.logoContainer}>
            <Text style={styles.logo}>GotStyle</Text>
          </View>

          <BlurView style={styles.btnContainer} tint="default" intensity={30}>
            <LinearGradient
              colors={["rgba(0,0,0,0)", colors.black]}
              style={{
                width: "100%",
                height: "100%",
                position: "absolute",
              }}
            />

            <View
              style={{
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                marginBottom: 100,
              }}
            >
              <Text
                style={{
                  color: colors.white,
                  fontFamily: "bas-bold",
                  fontSize: 40,
                  textAlign: "center",
                  marginLeft: 20,
                }}
              >
                Show It.
              </Text>
              <Text
                style={{
                  color: colors.white,
                  fontFamily: "bas-bold",
                  fontSize: 40,
                  textAlign: "center",
                  marginLeft: 20,
                }}
              >
                Mean It.
              </Text>
            </View>

            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: Dimensions.get("screen").width,
                position: "absolute",
                bottom: "5%",
              }}
            >
              <TouchableOpacity
                style={styles.signupBtn}
                onPress={() => {
                  navigation.navigate("Signup");
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.white,
                    fontFamily: "bas-semibold",
                  }}
                >
                  Sign Up
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.loginBtn}
                onPress={() => {
                  navigation.navigate("Login");
                }}
              >
                <Text
                  style={{
                    color: colors.white,
                    fontFamily: "bas-medium",
                    fontSize: 16,
                  }}
                >
                  Login
                </Text>
              </TouchableOpacity>

              <Text
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.5)",
                  marginTop: 20,
                  maxWidth: "80%",
                  textAlign: "center",
                  fontFamily: "bas-regular",
                }}
              >
                By signing up, you agree to our Terms & Conditions and Privacy
              </Text>
            </View>
          </BlurView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  bgImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    borderRadius: 10,
  },
  scrollView: {
    width: Dimensions.get("screen").width,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  welcomeContainer: {
    width: Dimensions.get("screen").width,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  policies: {
    position: "absolute",
    top: "5%",
    right: "5%",
    padding: 7,
    borderRadius: 99,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderWidth: 1,
    borderColor: colors.black,
    zIndex: 10,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: "10%",
    zIndex: 100,
  },
  logo: {
    fontFamily: "logo",
    fontSize: 35,
    color: colors.white,
    letterSpacing: -1,
    zIndex: 100,
  },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 5,
    borderColor: colors.white,
    backgroundColor: "rgba(0,0,0,0.4)",
    shadowColor: "rgba(0,0,0,0.4)",
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  tagline: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 22,
  },
  btnContainer: {
    width: "100%",
    height: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    borderRadius: 10,
    overflow: "hidden",
  },
  signupBtn: {
    borderRadius: 15,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    height: 45,
    backgroundColor: colors.primary,
  },
  loginBtn: {
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
});
