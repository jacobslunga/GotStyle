import { FC, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Animated,
  ActivityIndicator,
} from "react-native";
import { Comment, User, UserMinimal } from "../../lib/types";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../lib/util/colors";
import { outfitService } from "../../api/outfits";
import { useQuery, useMutation } from "react-query";
import { useAuth } from "../../context/AuthContext";
import * as Haptics from "expo-haptics";
import { userService } from "../../api/users";
import { formatLargeNumber } from "../../lib/util/formatLargeNumber";

interface SingleOutfitProps {
  navigation: any;
  route: any;
}

const Header = ({ navigation, user }: { navigation: any; user: User }) => {
  return (
    <View
      style={{
        height: "10%",
        width: Dimensions.get("screen").width,
        backgroundColor: "transparent",
        position: "absolute",
        top: 0,
        zIndex: 1000,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <LinearGradient
        colors={["rgba(0, 0, 0, 1)", "transparent"]}
        style={{
          height: "100%",
          width: "100%",
          position: "absolute",
        }}
      />

      <Pressable
        onPress={() => {
          navigation.goBack();
        }}
        style={{
          marginLeft: 20,
        }}
      >
        <Ionicons name="close" size={30} color="white" />
      </Pressable>

      <Pressable
        onPress={() => {
          navigation.navigate("SingleProfileModal", {
            userId: user.id,
          });
        }}
        style={{
          marginRight: 20,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 14,
            fontFamily: "bas-medium",
            marginRight: 5,
          }}
        >
          {user.username}
        </Text>
        {user.image_url ? (
          <Image
            source={{ uri: user.image_url, cache: "force-cache" }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 99,
              borderWidth: 1,
              borderColor: "white",
            }}
          />
        ) : (
          <Ionicons name="person" size={25} color="white" />
        )}
      </Pressable>
    </View>
  );
};

const SingleOutfitScreen: FC<SingleOutfitProps> = ({ navigation, route }) => {
  const { outfitId } = route.params;
  const { authState } = useAuth();
  const scrollY = useRef(new Animated.Value(0)).current;

  const { data: outfit, isLoading } = useQuery(
    ["outfit", outfitId],
    () =>
      outfitService.getOutfit(
        outfitId,
        authState?.access_token ? authState.access_token : ""
      ),
    {
      enabled: !!authState?.access_token,
    }
  );

  const { data: me } = useQuery(
    ["me"],
    () =>
      userService.getMe(authState?.access_token ? authState.access_token : ""),
    {
      enabled: !!authState?.access_token,
    }
  );

  const likeScaleValue = useRef(new Animated.Value(1)).current;
  const saveScaleValue = useRef(new Animated.Value(1)).current;

  const [hasLiked, setHasLiked] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [saveCount, setSaveCount] = useState(0);

  useEffect(() => {
    if (outfit) {
      setHasLiked(outfit.likes.users.some((u: UserMinimal) => u.id === me?.id));
      setHasSaved(outfit.saves.users.some((u: UserMinimal) => u.id === me?.id));
      setLikeCount(outfit.likes.count);
      setSaveCount(outfit.saves.count);
    }
  }, [outfit, me]);

  const likeMutation = useMutation(() =>
    outfitService.likeOutfit(
      authState?.access_token ? authState.access_token : "",
      outfit.id
    )
  );

  const unlikeMutation = useMutation(() =>
    outfitService.unlikeOutfit(
      authState?.access_token ? authState.access_token : "",
      outfit.id
    )
  );

  const saveMutation = useMutation(() =>
    outfitService.saveOutfit(
      authState?.access_token ? authState.access_token : "",
      outfit.id
    )
  );

  const unsaveMutation = useMutation(() =>
    outfitService.unsaveOutfit(
      authState?.access_token ? authState.access_token : "",
      outfit.id
    )
  );

  const handleLike = () => {
    if (hasLiked) {
      setHasLiked(false);
      setLikeCount((p: any) => p - 1);
      unlikeMutation.mutate();
    } else {
      setHasLiked(true);
      setLikeCount((p: any) => p + 1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      likeMutation.mutate();
    }
  };

  const lastTap = useRef<number | null>(null);

  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (lastTap.current && now - lastTap.current < DOUBLE_PRESS_DELAY) {
      if (!hasLiked) {
        handleLike();
      }
    }
    lastTap.current = now;
  };

  const handleSave = () => {
    if (hasSaved) {
      setHasSaved(false);
      setSaveCount((p: any) => p - 1);
      unsaveMutation.mutate();
    } else {
      setHasSaved(true);
      setSaveCount((p: any) => p + 1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      saveMutation.mutate();
    }
  };

  const scaleDownLike = () => {
    Animated.timing(likeScaleValue, {
      toValue: 0.9,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const scaleUpLike = () => {
    Animated.timing(likeScaleValue, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const scaleDownSave = () => {
    Animated.timing(saveScaleValue, {
      toValue: 0.9,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const scaleUpSave = () => {
    Animated.timing(saveScaleValue, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const [showOutfitImage, setShowOutfitImage] = useState(true);

  const imageScale = scrollY.interpolate({
    inputRange: [-1000, 0, 1000],
    outputRange: [1.5, 1, 0],
    extrapolate: "clamp",
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, 500],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  if (!outfit || isLoading || !authState?.access_token) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.black,
          width: Dimensions.get("screen").width,
          height: Dimensions.get("screen").height,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="small" color="white" />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "black",
      }}
    >
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "black",
        }}
      >
        <StatusBar style="light" />
        <Header navigation={navigation} user={outfit.user} />

        <View
          style={{
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
            position: "absolute",
            backgroundColor: colors.black,
            bottom: 0,
          }}
        >
          <BlurView
            intensity={95}
            tint="dark"
            style={{
              width: Dimensions.get("screen").width,
              height: Dimensions.get("screen").height,
              position: "absolute",
              zIndex: 10,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          />

          <Image
            source={{ uri: outfit.photo_url, cache: "force-cache" }}
            style={{
              width: Dimensions.get("screen").width,
              height: Dimensions.get("screen").height,
              position: "absolute",
              zIndex: 1,
            }}
          />
        </View>

        <ScrollView
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "flex-start",
            width: Dimensions.get("screen").width,
            flexGrow: 1,
          }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              width: Dimensions.get("screen").width,
              height: Dimensions.get("screen").height * 0.7,
              borderRadius: 20,
              marginTop: Dimensions.get("screen").height * 0.1,
              alignItems: "center",
              justifyContent: "flex-start",
              borderWidth: 0,
            }}
          >
            <Animated.View
              style={{
                transform: [{ scale: imageScale }],
                opacity: imageOpacity,
                width: "100%",
                height: "100%",
                borderWidth: 0,
              }}
            >
              <Pressable
                onPress={() => {
                  if (!showOutfitImage) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                    setShowOutfitImage(!showOutfitImage);
                  } else {
                    handleDoubleTap();
                  }
                }}
                style={{
                  width: showOutfitImage ? "100%" : 100,
                  height: showOutfitImage ? "100%" : 100,
                  borderRadius: 20,
                  position: showOutfitImage ? "relative" : "absolute",
                  bottom: showOutfitImage ? 0 : "10%",
                  right: showOutfitImage ? 0 : 50,
                  zIndex: showOutfitImage ? 10 : 100,
                  borderWidth: 0,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={{ uri: outfit.photo_url, cache: "force-cache" }}
                  style={{
                    width: showOutfitImage ? "90%" : "97%",
                    height: showOutfitImage ? "90%" : "97%",
                    borderRadius: showOutfitImage ? 20 : 10,
                    borderWidth: 0,
                  }}
                />
                {!showOutfitImage && (
                  <LinearGradient
                    colors={["#FFA1F5", "#FF9B82"]}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "100%",
                      zIndex: -1,
                      borderRadius: 10,
                    }}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: -1 }}
                  />
                )}
              </Pressable>

              {outfit.shoes_url && (
                <Pressable
                  onPress={() => {
                    if (showOutfitImage) {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                      setShowOutfitImage(!showOutfitImage);
                    } else {
                      handleDoubleTap();
                    }
                  }}
                  style={{
                    width: showOutfitImage ? 100 : "100%",
                    height: showOutfitImage ? 100 : "100%",
                    position: showOutfitImage ? "absolute" : "relative",
                    bottom: showOutfitImage ? "10%" : 0,
                    right: showOutfitImage ? 50 : 0,
                    zIndex: showOutfitImage ? 100 : 10,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    source={{ uri: outfit.shoes_url, cache: "force-cache" }}
                    style={{
                      width: !showOutfitImage ? "90%" : "97%",
                      height: !showOutfitImage ? "90%" : "97%",
                      borderRadius: showOutfitImage ? 10 : 20,
                    }}
                  />
                  {showOutfitImage && (
                    <LinearGradient
                      colors={["#FFA1F5", "#FF9B82"]}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "100%",
                        zIndex: -1,
                        borderRadius: 10,
                      }}
                      start={{ x: 0, y: 1 }}
                      end={{ x: 1, y: -1 }}
                    />
                  )}
                </Pressable>
              )}
            </Animated.View>
          </View>

          <View
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 20,
            }}
          >
            <Animated.View style={{ transform: [{ scale: likeScaleValue }] }}>
              <Pressable
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 5,
                }}
                onPress={handleLike}
                onPressIn={scaleDownLike}
                onPressOut={scaleUpLike}
                disabled={likeMutation.isLoading || unlikeMutation.isLoading}
              >
                <Ionicons
                  name={hasLiked ? "heart" : "heart-outline"}
                  size={30}
                  color={hasLiked ? "#F31559" : colors.white}
                />
                <Text
                  style={{
                    color: colors.white,
                    fontFamily: "bas-medium",
                    fontSize: 10,
                    marginTop: 5,
                  }}
                >
                  {formatLargeNumber(likeCount)}
                </Text>
              </Pressable>
            </Animated.View>

            <Animated.View style={{ transform: [{ scale: saveScaleValue }] }}>
              <Pressable
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: 20,
                  padding: 5,
                }}
                disabled={saveMutation.isLoading || unsaveMutation.isLoading}
                onPress={handleSave}
                onPressIn={scaleDownSave}
                onPressOut={scaleUpSave}
              >
                <Ionicons
                  name={hasSaved ? "bookmark" : "bookmark-outline"}
                  size={30}
                  color={hasSaved ? colors.yellow : colors.white}
                />
                <Text
                  style={{
                    color: colors.white,
                    fontFamily: "bas-medium",
                    fontSize: 10,
                    marginTop: 5,
                  }}
                >
                  {formatLargeNumber(saveCount)}
                </Text>
              </Pressable>
            </Animated.View>
          </View>

          <View
            style={{
              width: Dimensions.get("screen").width * 0.9,
              marginBottom: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 20,
                fontFamily: "bas-bold",
              }}
            >
              Comments
            </Text>
            <Pressable
              onPress={() => {
                navigation.navigate("Comment", {
                  outfitId: outfit.id,
                });
              }}
            >
              <Ionicons
                name="add-circle"
                size={30}
                color={colors.white}
                style={{ marginLeft: 10 }}
              />
            </Pressable>
          </View>
          {outfit.comments.length === 0 && (
            <Text
              style={{
                color: "white",
                fontSize: 14,
                width: Dimensions.get("screen").width * 0.9,
                marginBottom: 50,
                fontFamily: "bas-medium",
              }}
            >
              No comments yet
            </Text>
          )}
          {outfit.comments.length > 0 &&
            outfit.comments.map((comment: Comment, index: number) => (
              <View
                key={index}
                style={{
                  width: Dimensions.get("screen").width * 0.9,
                  marginBottom: index === outfit.comments.length - 1 ? 50 : 20,
                  flexDirection: "row",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                }}
              >
                <Pressable
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                  onPress={() => {
                    navigation.navigate("SingleProfileModal", {
                      userId: comment.user.id,
                    });
                  }}
                >
                  {comment.user.image_url ? (
                    <Image
                      source={{
                        uri: `${
                          comment.user.image_url
                        }?${new Date().getTime()}`,
                        cache: "reload",
                      }}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 99,
                        marginBottom: 5,
                      }}
                    />
                  ) : (
                    <View
                      style={{
                        borderRadius: 99,
                        backgroundColor: "rgba(255,255,255,0.1)",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 10,
                      }}
                    >
                      <Ionicons
                        name="person"
                        size={20}
                        color={"rgba(255,255,255,0.5)"}
                      />
                    </View>
                  )}
                </Pressable>
                <View
                  style={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    marginLeft: 10,
                    width: "100%",
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 12,
                      fontFamily: "bas-medium",
                    }}
                  >
                    {comment.user.username}
                  </Text>
                  <Text
                    style={{
                      color: "white",
                      fontSize: 14,
                      maxWidth: "80%",
                      fontFamily: "bas-regular",
                      marginTop: 5,
                    }}
                  >
                    {comment.text}
                  </Text>
                </View>
              </View>
            ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SingleOutfitScreen;
