import { memo, useContext, useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../lib/util/colors";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Pressable,
  Text,
  Dimensions,
  Image,
  FlatList,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import { SelectedOutfitsContext } from "../../context/SelectedOutfits";
import { StatusBar } from "expo-status-bar";

const GalleryView = memo(
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
    const insets = useSafeAreaInsets();
    const [convertingLoading, setConvertingLoading] = useState<boolean>(false);
    const { selectedOutfits, setSelectedOutfits } = useContext(
      SelectedOutfitsContext
    );

    const handleSwitchToCamera = () => {
      Animated.parallel([
        Animated.timing(cameraViewOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(galleryViewOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      setShowCamera(true);
    };

    const [photos, setPhotos] = useState([] as any[]);

    useEffect(() => {
      const getPhotos = async () => {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status === "granted") {
          const photos = await MediaLibrary.getAssetsAsync({
            mediaType: MediaLibrary.MediaType.photo,
            first: 100,
          });

          setPhotos(photos.assets);
        }
      };

      getPhotos();
    }, []);

    const renderPhoto = ({ item }: { item: any }) => {
      return (
        <Pressable
          onPress={async () => {
            setConvertingLoading(true);
            if (selectedOutfits.some((photo) => photo.uri === item.uri)) {
              setSelectedOutfits(
                selectedOutfits.filter((photo) => photo.uri !== item.uri)
              );
            } else {
              const asset = await MediaLibrary.getAssetInfoAsync(item.id);
              const fileUri = asset.localUri;

              if (fileUri) {
                const base64 = await FileSystem.readAsStringAsync(fileUri, {
                  encoding: FileSystem.EncodingType.Base64,
                });
                setSelectedOutfits((prev) => {
                  const newArr = [...prev];
                  newArr[index] = {
                    uri: fileUri,
                    base64,
                  };
                  return newArr;
                });
              }
            }

            setConvertingLoading(false);
            navigation.goBack();
          }}
        >
          <View
            style={{
              position: "absolute",
              opacity: selectedOutfits.some((photo) => photo.uri === item.uri)
                ? 1
                : 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              width: "100%",
              height: "100%",
              zIndex: 999,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name="checkmark-done-circle"
              size={40}
              color={colors.white}
            />
            <Text
              style={{
                fontFamily: "bas-medium",
                fontSize: 14,
                color: colors.white,
              }}
            >
              Selected
            </Text>
          </View>
          <Image
            style={{
              width: Dimensions.get("screen").width / 4,
              height: Dimensions.get("screen").width / 4,
            }}
            source={{ uri: item.uri }}
          />
        </Pressable>
      );
    };

    return (
      <Animated.View
        style={{
          opacity: galleryViewOpacity,
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          zIndex: showCamera ? -1 : 10,
        }}
      >
        {convertingLoading && (
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
            <ActivityIndicator size="large" color={colors.white} />
          </View>
        )}

        <StatusBar style="light" animated />

        <Text
          style={{
            shadowColor: "rgba(0, 0, 0, 0.5)",
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 10,
            shadowRadius: 5,
            fontFamily: "bas-semibold",
            fontSize: 16,
            position: "absolute",
            top: insets.top + 40,
            zIndex: 1000,
            color: colors.white,
          }}
        >
          {selectedOutfits.length} / 5 selected
        </Text>

        <FlatList
          data={photos}
          numColumns={4}
          keyExtractor={(item) => item.id}
          renderItem={renderPhoto}
          contentContainerStyle={{
            paddingTop: insets.top + Dimensions.get("screen").height * 0.1,
            paddingBottom: 200,
          }}
          initialNumToRender={10}
          maxToRenderPerBatch={20}
          windowSize={4}
          indicatorStyle="white"
          keyboardShouldPersistTaps="always"
        />

        <TouchableOpacity
          style={{
            backgroundColor: "transparent",
            position: "absolute",
            bottom: "5%",
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "center",
            padding: 10,
          }}
          onPress={() => handleSwitchToCamera()}
        >
          <LinearGradient
            colors={["rgb(55,65,81)", "rgb(156,163,175)"]}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: -1,
              borderRadius: 99,
            }}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: -1 }}
          />
          <Ionicons name="camera" size={60} color={colors.white} />
        </TouchableOpacity>
      </Animated.View>
    );
  }
);

export default GalleryView;
