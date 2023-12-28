import { FC, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { colors } from "../../lib/util/colors";
import * as Haptics from "expo-haptics";
import { Camera, CameraType } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { set } from "lodash";

interface PhoneMockupProps {
  navigation: any;
}

const cameraStatus = {
  BUTTON: "BUTTON",
  OUTFIT: "OUTFIT",
  SHOES: "SHOES",
  UPLOAD: "UPLOAD",
};

const PhoneMockup: FC<PhoneMockupProps> = ({ navigation }) => {
  const [status, setStatus] = useState<any>(cameraStatus.BUTTON);
  const scrollRef = useRef<ScrollView>(null);

  const [phoneWidth, setPhoneWidth] = useState(0);

  const [hasPermission, setHasPermission] = useState<boolean>(false);

  const askForCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === "granted");
  };

  useEffect(() => {
    askForCameraPermission();
  }, []);

  if (!hasPermission) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#000",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name="alert-circle-outline" size={40} color={colors.white} />
        <Text
          style={{
            color: colors.white,
            fontFamily: "bas-regular",
            fontSize: 14,
            textAlign: "center",
            maxWidth: "70%",
            marginTop: 20,
          }}
        >
          We need permission to access your camera to take pictures of your
          outfit.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <View
      style={{
        height: "80%",
        width: "70%",
        borderColor: "rgba(255,255,255,0.7)",
        borderWidth: 2,
        borderRadius: 35,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
      onLayout={(e) => {
        setPhoneWidth(e.nativeEvent.layout.width);
      }}
    >
      <View
        style={{
          position: "absolute",
          top: 20,
          borderRadius: 99,
          height: 30,
          width: "30%",
          borderWidth: 2,
          borderColor: "rgba(255,255,255,0.7)",
          zIndex: 100,
          backgroundColor: "#000",
        }}
      />

      <ScrollView
        contentContainerStyle={{
          width: phoneWidth * 4,
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
        }}
        showsHorizontalScrollIndicator={false}
        horizontal
        scrollEnabled={false}
        ref={scrollRef}
      >
        <View
          style={{
            height: "100%",
            width: phoneWidth,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "bas-bold",
              fontSize: 100,
              color: "rgba(255,255,255,0.8)",
              zIndex: 100,
              shadowColor: "rgba(0, 0, 0, 0.5)",
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: 10,
              shadowRadius: 5,
            }}
          >
            1.
          </Text>

          <Image
            source={{
              uri: "https://gotstyle-bucket.s3.eu-central-1.amazonaws.com/welcome.webp",
              cache: "force-cache",
            }}
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              borderRadius: 35,
              opacity: 0.6,
            }}
          />

          <TouchableOpacity
            style={{
              width: 100,
              height: 100,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 99,
              borderColor: colors.white,
              borderWidth: 3,
              position: "absolute",
              bottom: 20,
            }}
            onPress={() => {
              scrollRef.current?.scrollTo({
                x: phoneWidth,
                y: 0,
                animated: true,
              });
              setStatus(cameraStatus.OUTFIT);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            }}
          >
            <Text
              style={{
                color: colors.white,
                fontSize: 15,
                fontFamily: "logo",
              }}
            >
              Show It.{"\n"}
              Mean It.
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            height: "100%",
            width: phoneWidth,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            maxWidth: phoneWidth,
          }}
        >
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
              fontSize: 18,
              position: "absolute",
              top: "10%",
              zIndex: 100,
            }}
          >
            Take a picture of your outfit
          </Text>

          <Text
            style={{
              fontFamily: "bas-bold",
              fontSize: 100,
              color: "rgba(255,255,255,0.7)",
              zIndex: 100,
            }}
          >
            2.
          </Text>

          <View
            style={{
              width: phoneWidth,
              height: "100%",
              position: "absolute",
              borderRadius: 35,
              overflow: "hidden",
              maxWidth: phoneWidth,
            }}
          >
            {status === cameraStatus.OUTFIT && (
              <Camera
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 35,
                  overflow: "hidden",
                }}
                type={CameraType.back}
              />
            )}
          </View>

          <TouchableOpacity
            onPressOut={() => {
              scrollRef.current?.scrollTo({
                x: phoneWidth * 2,
                y: 0,
                animated: true,
              });
              setStatus(cameraStatus.SHOES);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            style={{
              borderWidth: 5,
              width: 90,
              height: 90,
              borderRadius: 99,
              borderColor: colors.white,
              backgroundColor: "transparent",
              shadowColor: "rgba(0, 0, 0, 0.5)",
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: 10,
              shadowRadius: 5,
              position: "absolute",
              bottom: 20,
            }}
          />
        </View>

        <View
          style={{
            height: "100%",
            width: phoneWidth,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            maxWidth: phoneWidth,
          }}
        >
          <View
            style={{
              maxWidth: "80%",
              position: "absolute",
              top: "10%",
              alignItems: "center",
              justifyContent: "center",
              width: phoneWidth,
              zIndex: 100,
            }}
          >
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
                fontSize: 14,
                zIndex: 100,
                textAlign: "center",
              }}
            >
              Take a picture of your shoes (optional)
            </Text>
          </View>

          <Text
            style={{
              fontFamily: "bas-bold",
              fontSize: 100,
              color: "rgba(255,255,255,0.7)",
              zIndex: 100,
            }}
          >
            3.
          </Text>

          <View
            style={{
              width: phoneWidth,
              height: "100%",
              position: "absolute",
              borderRadius: 35,
              overflow: "hidden",
              maxWidth: phoneWidth,
            }}
          >
            {status === cameraStatus.SHOES && (
              <Camera
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 35,
                  overflow: "hidden",
                }}
                type={CameraType.back}
              />
            )}
          </View>

          <TouchableOpacity
            onPressOut={() => {
              scrollRef.current?.scrollTo({
                x: phoneWidth * 3,
                y: 0,
                animated: true,
              });
              setStatus(cameraStatus.UPLOAD);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            style={{
              borderWidth: 5,
              width: 90,
              height: 90,
              borderRadius: 99,
              borderColor: colors.white,
              backgroundColor: "transparent",
              shadowColor: "rgba(0, 0, 0, 0.5)",
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: 10,
              shadowRadius: 5,
              position: "absolute",
              bottom: 20,
            }}
          />
        </View>

        <View
          style={{
            height: "100%",
            width: phoneWidth,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
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
              fontSize: 50,
            }}
          >
            Upload!
          </Text>
          <Text
            style={{
              color: "rgba(255,255,255,0.7)",
              fontFamily: "bas-bold",
              fontSize: 13,
            }}
          >
            ... and that's it!
          </Text>
          <Text
            style={{
              color: "rgba(255,255,255,0.7)",
              fontFamily: "bas-regular",
              fontSize: 12,
              textAlign: "center",
              maxWidth: "70%",
              marginTop: 20,
            }}
          >
            Don't worry, this outfit won't be posted 😉
          </Text>

          <TouchableOpacity
            style={{
              position: "absolute",
              bottom: 20,
              backgroundColor: "rgba(255,255,255,0.15)",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
              borderRadius: 15,
            }}
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [{ name: "Welcome" }],
              });
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Text
              style={{
                color: colors.white,
                fontFamily: "bas-semibold",
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
              Continue to App
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default PhoneMockup;
