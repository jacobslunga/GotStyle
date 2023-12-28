import React, { memo, useState } from "react";
import { View, Pressable, Image, Text } from "react-native";
import { colors } from "../../../lib/util/colors";
import { Comment, User } from "../../../lib/types";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import moment from "moment";
import { useMutation } from "react-query";
import { outfitService } from "../../../api/outfits";
import { useAuth } from "../../../context/AuthContext";
import * as Haptics from "expo-haptics";
import { formatLargeNumber } from "../../../lib/util/formatLargeNumber";

interface CommentProps {
  comment: Comment;
  navigation: any;
  idx: number;
  darkTheme: boolean;
  me: User;
  outfitId: string;
  refetchOutfit: () => void;
  isLastComment: boolean;
}

const CommentComponent = memo(
  ({
    comment,
    navigation,
    idx,
    darkTheme,
    me,
    outfitId,
    refetchOutfit,
    isLastComment,
  }: CommentProps) => {
    const { authState } = useAuth();

    const [hasLiked, setHasLiked] = useState(
      comment.likes.some((like) => like.id === me.id)
    );
    const [likeCount, setLikeCount] = useState(comment.likes.length);
    const [showReplies, setShowReplies] = useState(false);

    const likeMutation = useMutation(
      () =>
        outfitService.likeComment(
          authState?.access_token as string,
          outfitId,
          comment.id
        ),
      {
        onSuccess: () => {
          refetchOutfit();
        },
        onError: (err) => {
          console.log(err);
        },
      }
    );

    const unlikeMutation = useMutation(
      () =>
        outfitService.unlikeComment(
          authState?.access_token as string,
          outfitId,
          comment.id
        ),
      {
        onSuccess: () => {
          refetchOutfit();
        },
        onError: (err) => {
          console.log(err);
        },
      }
    );

    const handleLikeComment = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (hasLiked) {
        setHasLiked(false);
        setLikeCount(likeCount - 1);
        unlikeMutation.mutate();
      } else {
        setHasLiked(true);
        setLikeCount(likeCount + 1);
        likeMutation.mutate();
      }
    };

    return (
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          padding: 20,
          alignItems: "flex-start",
          justifyContent: "flex-start",
          marginBottom: isLastComment ? 100 : 0,
        }}
        key={comment.id + idx}
      >
        <Pressable
          onPress={() => {
            navigation.navigate("SingleProfileModal", {
              userId: comment.user.id,
            });
          }}
        >
          {comment.user.image_url ? (
            <Image
              source={{
                uri: `${comment.user.image_url}?${new Date().getTime()}`,
                cache: "reload",
              }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 99,
                marginRight: 10,
              }}
            />
          ) : (
            <View
              style={{
                borderRadius: 99,
                marginRight: 10,
                backgroundColor: darkTheme
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.1)",
                alignItems: "center",
                justifyContent: "center",
                padding: 10,
              }}
            >
              <AntDesign
                name="user"
                size={20}
                color={darkTheme ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)"}
              />
            </View>
          )}
        </Pressable>

        <View
          style={{
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            width: "100%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
              width: "85%",
            }}
          >
            <View
              style={{
                alignItems: "flex-start",
                justifyContent: "flex-start",
                flexDirection: "row",
              }}
            >
              <Pressable
                onPress={() => {
                  navigation.navigate("SingleProfileModal", {
                    userId: comment.user.id,
                  });
                }}
              >
                <Text
                  style={{
                    color: darkTheme ? colors.white : colors.black,
                    fontFamily: "bas-medium",
                  }}
                >
                  {comment.user.username}
                </Text>
              </Pressable>
              <Text
                style={{
                  color: darkTheme
                    ? "rgba(255,255,255,0.4)"
                    : "rgba(0,0,0,0.4)",
                  fontFamily: "bas-regular",
                  fontSize: 12,
                  marginLeft: 5,
                }}
              >
                {moment(comment.created_at).fromNow()}
              </Text>
            </View>

            <Pressable
              style={{
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
              onPress={handleLikeComment}
              disabled={likeMutation.isLoading || unlikeMutation.isLoading}
            >
              <Ionicons
                name={hasLiked ? "heart" : "heart-outline"}
                size={20}
                color={
                  hasLiked
                    ? "#F31559"
                    : darkTheme
                    ? "rgba(255,255,255,0.5)"
                    : "rgba(0,0,0,0.5)"
                }
              />
              <Text
                style={{
                  color: darkTheme
                    ? "rgba(255,255,255,0.5)"
                    : "rgba(0,0,0,0.5)",
                  fontFamily: "bas-regular",
                  fontSize: 10,
                }}
              >
                {formatLargeNumber(likeCount)}
              </Text>
            </Pressable>
          </View>
          <Text
            style={{
              maxWidth: "80%",
              color: darkTheme ? colors.white : colors.black,
              fontFamily: "bas-regular",
            }}
          >
            {comment.text}
          </Text>

          {showReplies && (
            <View
              style={{
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                width: "100%",
              }}
            >
              {comment.answers.map((answer: any, aIdx) => (
                <View
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    padding: 20,
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                  }}
                  key={answer.id + idx}
                >
                  <Pressable
                    onPress={() => {
                      navigation.navigate("SingleProfileModal", {
                        userId: answer.user.id,
                      });
                    }}
                  >
                    {answer.user.image_url ? (
                      <Image
                        source={{
                          uri: `${
                            answer.user.image_url
                          }?${new Date().getTime()}`,
                          cache: "reload",
                        }}
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 99,
                          marginRight: 10,
                        }}
                      />
                    ) : (
                      <View
                        style={{
                          borderRadius: 99,
                          marginRight: 10,
                          backgroundColor: darkTheme
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(0,0,0,0.1)",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 10,
                        }}
                      >
                        <AntDesign
                          name="user"
                          size={15}
                          color={
                            darkTheme
                              ? "rgba(255,255,255,0.5)"
                              : "rgba(0,0,0,0.5)"
                          }
                        />
                      </View>
                    )}
                  </Pressable>

                  <View
                    style={{
                      flexDirection: "column",
                      alignItems: "flex-start",
                      justifyContent: "flex-start",
                      width: "100%",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        width: "85%",
                      }}
                    >
                      <View
                        style={{
                          alignItems: "flex-start",
                          justifyContent: "flex-start",
                          flexDirection: "row",
                        }}
                      >
                        <Pressable
                          onPress={() => {
                            navigation.navigate("SingleProfileModal", {
                              userId: answer.user.id,
                            });
                          }}
                        >
                          <Text
                            style={{
                              color: darkTheme ? colors.white : colors.black,
                              fontFamily: "bas-medium",
                            }}
                          >
                            {answer.user.username}
                          </Text>
                        </Pressable>
                        <Text
                          style={{
                            color: darkTheme
                              ? "rgba(255,255,255,0.4)"
                              : "rgba(0,0,0,0.4)",
                            fontFamily: "bas-regular",
                            fontSize: 12,
                            marginLeft: 5,
                          }}
                        >
                          {moment(answer.created_at).fromNow()}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 5,
                      }}
                    >
                      <Pressable
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: 5,
                        }}
                        onPress={() => {
                          navigation.navigate("SingleProfileModal", {
                            userId: answer.reply_to_user.id,
                          });
                        }}
                      >
                        <Text
                          style={{
                            color: colors.primary,
                            fontFamily: "bas-semibold",
                            fontSize: 12,
                          }}
                        >
                          @{answer.reply_to_username}
                        </Text>
                      </Pressable>
                      <Text
                        style={{
                          maxWidth: "80%",
                          color: darkTheme ? colors.white : colors.black,
                          fontFamily: "bas-regular",
                          fontSize: 12,
                        }}
                      >
                        {answer.text}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              width: "100%",
              marginTop: 10,
            }}
          >
            <Pressable
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => {
                navigation.navigate("ReplyToComment", {
                  commentId: comment.id,
                  outfitId,
                });
              }}
            >
              <Text
                style={{
                  color: darkTheme
                    ? "rgba(255,255,255,0.5)"
                    : "rgba(0,0,0,0.5)",
                  fontFamily: "bas-medium",
                  fontSize: 12,
                }}
              >
                Reply
              </Text>
            </Pressable>

            {comment.answers.length > 0 && (
              <Pressable
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: 10,
                  flexDirection: "row",
                }}
                onPress={() => {
                  setShowReplies(!showReplies);
                }}
              >
                <Text
                  style={{
                    color: darkTheme
                      ? "rgba(255,255,255,0.5)"
                      : "rgba(0,0,0,0.5)",
                    fontFamily: "bas-regular",
                    fontSize: 12,
                    marginRight: 5,
                  }}
                >
                  {showReplies ? "Hide" : "Show"} {comment.answers.length}{" "}
                  replies
                </Text>
                <Ionicons
                  name={showReplies ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={darkTheme ? colors.white : colors.black}
                />
              </Pressable>
            )}
          </View>
        </View>
      </View>
    );
  }
);

export default CommentComponent;
