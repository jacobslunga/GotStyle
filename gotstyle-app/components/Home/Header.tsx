import { FC, useContext, useRef } from "react";
import {
  Text,
  Dimensions,
  Pressable,
  Animated,
  View,
  Image,
} from "react-native";
import { colors } from "../../lib/util/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { HashtagContext } from "../../context/HashtagContext";
import { ShowFollowingContext } from "../../context/ShowFollowing";

interface HeaderProps {
  navigation: any;
  fadeAnim: any;
  me: any;
}

const Header: FC<HeaderProps> = ({ navigation, fadeAnim, me }) => {
  const insets = useSafeAreaInsets();
  const { hashtag } = useContext(HashtagContext);
  const { setShowFollowing, showFollowing } = useContext(ShowFollowingContext);

  const hashtagFadeAnim = useRef(new Animated.Value(1)).current;
  const followingFadeAnim = useRef(new Animated.Value(0.5)).current;
  const hashtagBarOpacity = useRef(new Animated.Value(1)).current;
  const followingBarOpacity = useRef(new Animated.Value(0)).current;

  const animateHashtagPress = () => {
    Animated.parallel([
      Animated.timing(hashtagFadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(followingFadeAnim, {
        toValue: 0.5,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const animateFollowingPress = () => {
    Animated.parallel([
      Animated.timing(hashtagFadeAnim, {
        toValue: 0.5,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(followingFadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const animateHashtagBar = () => {
    Animated.parallel([
      Animated.timing(hashtagBarOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(followingBarOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const animateFollowingBar = () => {
    Animated.parallel([
      Animated.timing(hashtagBarOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(followingBarOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  return (
    <Animated.View
      style={{
        backgroundColor: "transparent",
        justifyContent: "space-between",
        alignItems: "center",
        width: Dimensions.get("screen").width,
        flexDirection: "row",
        position: "absolute",
        top: insets.top,
        zIndex: 1000,
        opacity: fadeAnim,
      }}
    >
      <Pressable
        onPress={() => {
          navigation.navigate("Profile", {
            userId: me.id,
          });
        }}
        style={{
          padding: 10,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        {me.image_url ? (
          <Image
            source={{ uri: me.image_url, cache: "force-cache" }}
            style={{
              width: 35,
              height: 35,
              borderRadius: 25,
              shadowColor: colors.black,
              shadowOffset: {
                width: 1,
                height: 1,
              },
              shadowOpacity: 0.3,
              shadowRadius: 10,
            }}
          />
        ) : (
          <Feather
            name="user"
            size={25}
            color="white"
            style={{
              shadowColor: colors.black,
              shadowOffset: {
                width: 1,
                height: 1,
              },
              shadowOpacity: 0.3,
              shadowRadius: 10,
            }}
          />
        )}
      </Pressable>

      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        <Pressable
          onPress={() => {
            if (showFollowing) {
              setShowFollowing(false);
              animateHashtagPress();
              animateHashtagBar();
            } else {
              navigation.navigate("HashtagModal");
            }
          }}
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            marginRight: 15,
            shadowColor: "rgba(0,0,0,0.6)",
            shadowOffset: {
              width: 1,
              height: 1,
            },
            shadowOpacity: 0.7,
            shadowRadius: 10,
          }}
        >
          <Animated.Text
            style={{
              color: hashtagFadeAnim.interpolate({
                inputRange: [0.5, 1],
                outputRange: ["rgba(255,255,255,0.5)", colors.white],
              }),
              fontSize: 18,
              fontFamily: "bas-semibold",
              letterSpacing: -1,
            }}
          >
            {hashtag}
          </Animated.Text>
          <Animated.View
            style={{
              height: 3,
              backgroundColor: colors.white,
              opacity: hashtagBarOpacity,
              width: "50%",
              marginTop: 5,
            }}
          />
        </Pressable>

        <Pressable
          onPress={() => {
            setShowFollowing(true);
            animateFollowingPress();
            animateFollowingBar();
          }}
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            marginLeft: 15,
            shadowColor: "rgba(0,0,0,0.6)",
            shadowOffset: {
              width: 1,
              height: 1,
            },
            shadowOpacity: 0.7,
            shadowRadius: 10,
          }}
        >
          <Animated.Text
            style={{
              color: followingFadeAnim.interpolate({
                inputRange: [0.5, 1],
                outputRange: ["rgba(255,255,255,0.5)", colors.white],
              }),
              fontSize: 18,
              fontFamily: "bas-semibold",
              letterSpacing: -1,
            }}
          >
            @ Following
          </Animated.Text>
          <Animated.View
            style={{
              height: 3,
              backgroundColor: colors.white,
              opacity: followingBarOpacity,
              width: "50%",
              marginTop: 5,
            }}
          />
        </Pressable>
      </View>

      <Pressable
        style={{
          padding: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Feather
          name="search"
          size={25}
          color="white"
          style={{
            shadowColor: colors.black,
            shadowOffset: {
              width: 1,
              height: 1,
            },
            shadowOpacity: 0.3,
            shadowRadius: 10,
          }}
        />
      </Pressable>
    </Animated.View>
  );
};

export default Header;
