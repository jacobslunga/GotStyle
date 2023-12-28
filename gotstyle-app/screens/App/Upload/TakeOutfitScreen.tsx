import { FC, useState, useRef } from "react";
import { View, StyleSheet, SafeAreaView, Animated } from "react-native";
import Header from "../../../components/TakeOutfit/Header";
import CameraView from "../../../components/TakeOutfit/CameraView";
import GalleryView from "../../../components/TakeOutfit/GalleryView";

interface TakeOutfitProps {
  navigation: any;
  route: any;
}

const TakeOutfitScreen: FC<TakeOutfitProps> = ({ navigation, route }) => {
  const [showCamera, setShowCamera] = useState<boolean>(true);
  const { index } = route.params;

  const galleryViewOpacity = useRef(new Animated.Value(0)).current;
  const cameraViewOpacity = useRef(new Animated.Value(1)).current;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#000",
      }}
    >
      <View style={styles.container}>
        <Header navigation={navigation} />

        <GalleryView
          cameraViewOpacity={cameraViewOpacity}
          galleryViewOpacity={galleryViewOpacity}
          showCamera={showCamera}
          setShowCamera={setShowCamera}
          navigation={navigation}
          index={index}
        />

        <CameraView
          cameraViewOpacity={cameraViewOpacity}
          galleryViewOpacity={galleryViewOpacity}
          showCamera={showCamera}
          setShowCamera={setShowCamera}
          navigation={navigation}
          index={index}
        />
      </View>
    </SafeAreaView>
  );
};

export default TakeOutfitScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
