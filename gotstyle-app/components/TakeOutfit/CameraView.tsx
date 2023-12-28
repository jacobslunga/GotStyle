import { memo, useState, useRef, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Animated,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Camera, CameraType, FlashMode } from "expo-camera";
import { colors } from "../../lib/util/colors";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { manipulateAsync, SaveFormat, FlipType } from "expo-image-manipulator";
import { SelectedOutfitsContext } from "../../context/SelectedOutfits";

const CameraView = memo(
  ({
    cameraViewOpacity,
    galleryViewOpacity,
    showCamera,
    setShowCamera,
    navigation,
    index,
  }: {
    cameraViewOpacity: Animated.Value;
    galleryViewOpacity: Animated.Value;
    showCamera: boolean;
    setShowCamera: React.Dispatch<React.SetStateAction<boolean>>;
    navigation: any;
    index: number;
  }) => {
    const [type, setType] = useState(CameraType.back);
    const [flash, setFlash] = useState(FlashMode.off);
    const [isTakingPhoto, setIsTakingPhoto] = useState<boolean>(false);

    const { selectedOutfits, setSelectedOutfits } = useContext(
      SelectedOutfitsContext
    );

    const cameraRef = useRef<Camera>(null);

    const toggleFlash = () => {
      if (flash === FlashMode.off) {
        setFlash(FlashMode.on);
      } else {
        setFlash(FlashMode.off);
      }
    };

    const handleSwitchToGallery = () => {
      Animated.parallel([
        Animated.timing(cameraViewOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(galleryViewOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      setShowCamera(false);
    };

    const scaleValue = useRef(new Animated.Value(1)).current;

    const scaleDown = () => {
      Animated.timing(scaleValue, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }).start();
    };

    const scaleUp = () => {
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    };

    const snap = async () => {
      if (cameraRef.current) {
        setIsTakingPhoto(true);

        const photo = await cameraRef.current.takePictureAsync();
        const resizedPhoto = await manipulateAsync(
          photo.uri,
          [{ resize: { width: 1080 } }],
          { format: SaveFormat.JPEG, base64: true, compress: 0.85 }
        );

        let finalPhotoUri = resizedPhoto.uri;

        if (type === CameraType.front) {
          const flippedPhoto = await manipulateAsync(
            resizedPhoto.uri,
            [{ flip: FlipType.Horizontal }],
            { format: SaveFormat.JPEG }
          );
          finalPhotoUri = flippedPhoto.uri;
        }

        if (selectedOutfits.length < 5 && resizedPhoto.base64) {
          setSelectedOutfits((prev) => {
            const newArr = [...prev];
            newArr[index] = {
              uri: finalPhotoUri,
              base64: resizedPhoto.base64 as string,
            };
            return newArr;
          });
        }

        setIsTakingPhoto(false);
        setShowCamera(false);
        navigation.goBack();
      }
    };

    const [hasPermission, setHasPermission] = useState<boolean>(false);

    const askForCameraPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    useEffect(() => {
      askForCameraPermission();
    }, []);

    if (hasPermission === null) {
      return <View />;
    }

    if (hasPermission === false) {
      return (
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: colors.black,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons
            name="alert-circle-outline"
            size={40}
            color={colors.white}
          />
        </SafeAreaView>
      );
    }

    return (
      <Animated.View
        style={{
          opacity: cameraViewOpacity,
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          zIndex: showCamera ? 10 : -1,
        }}
      >
        {isTakingPhoto && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 999,
            }}
          >
            <ActivityIndicator
              size="large"
              color={colors.white}
              style={{ zIndex: 1000 }}
            />
          </View>
        )}

        <Camera
          style={styles.camera}
          type={type}
          ref={cameraRef}
          flashMode={flash}
        />

        <View style={styles.btnContainer}>
          <Pressable
            onPress={toggleFlash}
            style={{
              shadowColor: "rgba(0, 0, 0, 0.5)",
              backgroundColor: "transparent",
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: 10,
              shadowRadius: 5,
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 80,
            }}
          >
            <Ionicons
              name={flash === FlashMode.off ? "flash-off-outline" : "flash"}
              size={40}
              color={colors.white}
            />
          </Pressable>

          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              style={{
                alignItems: "center",
                justifyContent: "center",
                padding: 10,
                borderRadius: 99,
                backgroundColor: colors.white,
                marginBottom: 20,
              }}
              onPress={() => {
                handleSwitchToGallery();
              }}
            >
              <Ionicons name="image-outline" color={colors.black} size={40} />
            </TouchableOpacity>
            <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
              <Pressable
                onPressIn={scaleDown}
                onPressOut={() => {
                  scaleUp();
                  snap();
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
                }}
              />
            </Animated.View>
          </View>

          <Pressable
            onPress={() => {
              setType(
                type === CameraType.back ? CameraType.front : CameraType.back
              );
            }}
            style={{
              shadowColor: "rgba(0, 0, 0, 0.5)",
              shadowOffset: {
                width: 0,
                height: 0,
              },
              backgroundColor: "transparent",
              shadowOpacity: 10,
              shadowRadius: 5,
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 80,
            }}
          >
            <Ionicons
              name="camera-reverse-outline"
              size={40}
              color={colors.white}
            />
          </Pressable>
        </View>
      </Animated.View>
    );
  }
);

export default CameraView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
    position: "absolute",
    height: "100%",
  },
  btnContainer: {
    backgroundColor: "transparent",
    flexDirection: "row",
    margin: 20,
    position: "absolute",
    bottom: "5%",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: "5%",
  },
});
