import { FC } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
  Dimensions,
} from "react-native";
import { User } from "../../lib/types";
import * as Haptics from "expo-haptics";
import { colors } from "../../lib/util/colors";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface BottomBarProps {
  me: User;
  navigation: any;
  fadeAnim: any;
}

const BottomBar: FC<BottomBarProps> = ({ me, navigation, fadeAnim }) => {
  const insets = useSafeAreaInsets();

  return (
    <Animated.View
      style={[
        {
          ...styles.container,
          opacity: fadeAnim,
          display: me.has_posted_today ? "none" : "flex",
          bottom: insets.bottom,
          width: Dimensions.get("screen").width,
        },
      ]}
    >
      <LinearGradient
        colors={["transparent", "#000"]}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "100%",
          width: "100%",
        }}
      />
      <TouchableOpacity
        style={[
          {
            ...styles.uploadBtn,
            borderColor: colors.white,
            borderWidth: 3,
          },
        ]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          navigation.navigate("Upload");
        }}
      >
        <Text
          style={{
            color: colors.white,
            fontSize: 18,
            fontFamily: "logo",
            letterSpacing: -1,
          }}
        >
          Show It.{"\n"}
          Mean It.
        </Text>
      </TouchableOpacity>
      <Text
        style={{
          color: colors.white,
          fontSize: 18,
          fontFamily: "logo",
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        OOTD Time 🤳
      </Text>
    </Animated.View>
  );
};

export default BottomBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
  },
  uploadBtn: {
    width: 110,
    height: 110,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 99,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
});
