import { LinearGradient } from "expo-linear-gradient";
import React, { memo } from "react";
import {
  View,
  Pressable,
  TouchableOpacity,
  Animated,
  Image,
  Text,
} from "react-native";
import { colors } from "../../lib/util/colors";
import { formatLargeNumber } from "../../lib/util/formatLargeNumber";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { Outfit, User } from "../../lib/types";
import * as Haptics from "expo-haptics";

const OutfitInfo = memo(
  ({
    navigation,
    outfit,
    me,
    scrollRef,
    setHashTag,
    showDescription,
    setShowDescription,
    likeScaleValue,
    saveScaleValue,
    handleLike,
    handleSave,
    handleFollow,
    followMutation,
    unfollowMutation,
    likeMutation,
    unlikeMutation,
    saveMutation,
    unsaveMutation,
    hasLiked,
    hasSaved,
    likeCount,
    saveCount,
    scaleDownLike,
    scaleUpLike,
    scaleDownSave,
    scaleUpSave,
    hasFollowed,
    commentCount,
  }: {
    navigation: any;
    outfit: Outfit;
    me: User;
    scrollRef: any;
    setHashTag: any;
    showDescription: any;
    setShowDescription: any;
    likeScaleValue: any;
    saveScaleValue: any;
    handleLike: any;
    handleSave: any;
    handleFollow: any;
    followMutation: any;
    unfollowMutation: any;
    likeMutation: any;
    unlikeMutation: any;
    saveMutation: any;
    unsaveMutation: any;
    hasLiked: any;
    hasSaved: any;
    likeCount: any;
    saveCount: any;
    scaleDownLike: any;
    scaleUpLike: any;
    scaleDownSave: any;
    scaleUpSave: any;
    hasFollowed: any;
    commentCount: any;
  }) => {
    return (
      <>
        <View
          style={{
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            bottom: 0,
            position: "absolute",
            width: "100%",
          }}
        >
          <LinearGradient
            colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.5)"]}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: "100%",
              width: "100%",
              bottom: 0,
            }}
          />
          <View
            style={{
              zIndex: 5,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: 20,
            }}
          >
            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => {
                navigation.navigate("SingleProfile", {
                  userId: outfit.user.id,
                });
              }}
            >
              {outfit.user.image_url ? (
                <Image
                  source={{
                    uri: `${outfit.user.image_url}?${new Date().getTime()}`,
                    cache: "reload",
                  }}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 20,
                    marginRight: 10,
                    borderWidth: 1,
                    borderColor: "#000",
                  }}
                />
              ) : (
                <View
                  style={{
                    padding: 10,
                    borderRadius: 20,
                    backgroundColor: "rgba(0,0,0,0.6)",
                    marginRight: 10,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AntDesign
                    name="user"
                    size={20}
                    color={"rgba(255, 255, 255, 0.5)"}
                  />
                </View>
              )}
              <Text
                style={{
                  color: colors.white,
                  fontFamily: "bas-semibold",
                  fontSize: 14,
                  shadowColor: "rgba(0, 0, 0, 0.5)",
                  shadowOffset: {
                    width: 0,
                    height: 0,
                  },
                  shadowOpacity: 10,
                  shadowRadius: 5,
                }}
              >
                {outfit.user.username.length > 15
                  ? `${outfit.user.username.substring(0, 15)}...`
                  : `${outfit.user.username}`}{" "}
                {outfit.user.id === me.id && "(You)"}
              </Text>
            </Pressable>

            {outfit.user.id !== me.id && (
              <>
                {hasFollowed && (
                  <Pressable
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.0)",
                      alignItems: "center",
                      justifyContent: "center",
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                      borderRadius: 10,
                      marginLeft: 10,
                      borderWidth: 1,
                      borderColor: "rgba(255,255,255,0.5)",
                    }}
                    disabled={
                      unfollowMutation.isLoading || followMutation.isLoading
                    }
                    onPress={() => {
                      handleFollow();
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    <Text
                      style={{
                        color: colors.white,
                        fontSize: 12,
                        fontFamily: "bas-semibold",
                      }}
                    >
                      Following
                    </Text>
                  </Pressable>
                )}

                {!hasFollowed && (
                  <Pressable
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 1)",
                      alignItems: "center",
                      justifyContent: "center",
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                      borderRadius: 10,
                      marginLeft: 5,
                    }}
                    disabled={
                      followMutation.isLoading || unfollowMutation.isLoading
                    }
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      handleFollow();
                    }}
                  >
                    <Text
                      style={{
                        color: colors.black,
                        fontSize: 12,
                        fontFamily: "bas-semibold",
                      }}
                    >
                      Follow
                    </Text>
                  </Pressable>
                )}
              </>
            )}
          </View>

          <View
            style={{
              flexDirection: "column",
              alignItems: "flex-start",
              maxWidth: "100%",
              marginLeft: 20,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 10,
              }}
            >
              <Text
                style={{
                  color: colors.white,
                  fontFamily: "bas-regular",
                  fontSize: 14,
                  marginRight: 10,
                }}
              >
                {outfit.description
                  ? showDescription
                    ? outfit.description
                    : `${outfit.description.substring(0, 40)} ${
                        outfit.description.length > 40 ? "..." : ""
                      }`
                  : "No description"}
              </Text>
            </View>

            {outfit.description && outfit.description.length > 40 && (
              <Pressable
                onPress={() => {
                  setShowDescription((p: any) => !p);
                }}
                style={{
                  marginTop: 5,
                }}
              >
                <Text
                  style={{
                    color: "rgba(255,255,255,0.8)",
                    fontFamily: "bas-semibold",
                    fontSize: 12,
                    shadowColor: "rgba(0, 0, 0, 0.7)",
                    shadowOffset: {
                      width: 0,
                      height: 0,
                    },
                    shadowOpacity: 10,
                    shadowRadius: 5,
                  }}
                >
                  {showDescription ? "Show less" : "Show more"}
                </Text>
              </Pressable>
            )}
          </View>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              maxWidth: "70%",
              marginTop: 10,
              marginLeft: 20,
              marginBottom: 20,
            }}
          >
            {outfit.hashtags.slice(0, 7).map((hashtag, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 99,
                  shadowColor: "black",
                  shadowOffset: {
                    width: 0,
                    height: 0,
                  },
                  shadowOpacity: 1,
                  shadowRadius: 10,
                  marginLeft: index !== 0 ? 5 : 0,
                }}
                onPress={() => {
                  scrollRef.current?.scrollTo({
                    x: 0,
                    y: 0,
                    animated: true,
                  });
                  setHashTag(hashtag);
                }}
              >
                <Text
                  style={{
                    color: colors.white,
                    fontFamily: "bas-medium",
                    fontSize: 12,
                    shadowColor: "rgba(0, 0, 0, 0.5)",
                    shadowOffset: {
                      width: 0,
                      height: 0,
                    },
                    shadowOpacity: 10,
                    shadowRadius: 5,
                  }}
                >
                  {hashtag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            bottom: 20,
            right: 20,
          }}
        >
          <Animated.View style={{ transform: [{ scale: likeScaleValue }] }}>
            <Pressable
              style={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 5,
                shadowColor: "#000",
                shadowOffset: {
                  width: 1,
                  height: 4,
                },
                shadowOpacity: 0.6,
                shadowRadius: 2,
                elevation: 9,
              }}
              onPress={handleLike}
              onPressIn={scaleDownLike}
              onPressOut={scaleUpLike}
              disabled={likeMutation.isLoading || unlikeMutation.isLoading}
            >
              <Ionicons
                name={"heart"}
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

          <Pressable
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 5,
              marginTop: 10,
              shadowOffset: {
                width: 1,
                height: 4,
              },
              shadowOpacity: 0.6,
              shadowRadius: 2,
              elevation: 9,
            }}
            onPress={() => {
              navigation.navigate("Comment", {
                outfitId: outfit.id,
              });
            }}
          >
            <Ionicons name="chatbox-ellipses" size={30} color={colors.white} />
            <Text
              style={{
                color: colors.white,
                fontFamily: "bas-medium",
                fontSize: 10,
                marginTop: 5,
              }}
            >
              {formatLargeNumber(commentCount)}
            </Text>
          </Pressable>

          <Animated.View style={{ transform: [{ scale: saveScaleValue }] }}>
            <Pressable
              style={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 5,
                marginTop: 10,
                shadowOffset: {
                  width: 1,
                  height: 4,
                },
                shadowOpacity: 0.6,
                shadowRadius: 2,
                elevation: 9,
              }}
              disabled={saveMutation.isLoading || unsaveMutation.isLoading}
              onPress={handleSave}
              onPressIn={scaleDownSave}
              onPressOut={scaleUpSave}
            >
              <Ionicons
                name={"bookmark"}
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
      </>
    );
  }
);

export default OutfitInfo;
