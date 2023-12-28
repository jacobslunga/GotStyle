import { FC, useState } from "react";
import {
  View,
  Dimensions,
  Pressable,
  Text,
  ActivityIndicator,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useDarkTheme from "../../../hooks/useDarkTheme";
import { colors } from "../../../lib/util/colors";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "react-query";
import { outfitService } from "../../../api/outfits";
import { useAuth } from "../../../context/AuthContext";
import { AntDesign } from "@expo/vector-icons";
import moment from "moment";

interface ReplyToCommentScreenProps {
  navigation: any;
  route: any;
}

const Header = ({ navigation }: { navigation: any }) => {
  const insets = useSafeAreaInsets();
  const darkTheme = useDarkTheme();

  return (
    <View
      style={{
        position: "absolute",
        top: insets.top,
        height: "8%",
        width: Dimensions.get("window").width,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: darkTheme ? colors.black : colors.white,
      }}
    >
      <Pressable
        onPress={() => {
          navigation.goBack();
        }}
        style={{
          position: "absolute",
          left: "5%",
        }}
      >
        <Ionicons
          name="close"
          size={25}
          color={darkTheme ? colors.white : colors.black}
        />
      </Pressable>
      <Text
        style={{
          fontSize: 18,
          fontFamily: "bas-semibold",
          color: darkTheme ? colors.white : colors.black,
        }}
      >
        Replies
      </Text>
    </View>
  );
};

const ReplyToCommentScreen: FC<ReplyToCommentScreenProps> = ({
  navigation,
  route,
}) => {
  const darkTheme = useDarkTheme();
  const insets = useSafeAreaInsets();

  const { commentId, outfitId } = route.params;
  const { authState } = useAuth();

  const [text, setText] = useState("");

  const {
    data: comment,
    isLoading: commentLoading,
    refetch: refetchComment,
  } = useQuery(["comment", commentId, outfitId], () =>
    outfitService.getComment(
      authState?.access_token as string,
      outfitId,
      commentId
    )
  );

  const replyMutation = useMutation(
    () =>
      outfitService.replyComment(
        authState?.access_token as string,
        outfitId,
        commentId,
        text
      ),
    {
      onSuccess: () => {
        setText("");
        refetchComment();
      },
      onError: (err) => {
        console.log(err);
      },
    }
  );

  const handleReply = () => {
    if (text.length > 0) {
      replyMutation.mutate();
    }
  };

  if (commentLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: darkTheme ? colors.black : colors.white,
        }}
      >
        <ActivityIndicator
          size="small"
          color={darkTheme ? colors.white : colors.black}
        />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: darkTheme ? colors.black : colors.white,
      }}
    >
      <Header navigation={navigation} />

      <View
        style={{
          position: "absolute",
          top: Dimensions.get("screen").height * 0.08 + insets.top,
          height: Dimensions.get("screen").height * 0.92 - insets.top,
          width: "100%",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            backgroundColor: darkTheme ? colors.black : colors.white,
            flexGrow: comment.answers.length > 10 ? 1 : 0,
            minHeight: 100,
            borderBottomWidth: 0.5,
            borderBottomColor: darkTheme
              ? "rgba(255,255,255,0.1)"
              : "rgba(0,0,0,0.1)",
            zIndex: 1000,
          }}
        >
          <View
            style={{
              width: "100%",
              backgroundColor: darkTheme ? colors.black : colors.white,
              borderRadius: 10,
              flexDirection: "row",
              alignItems: "flex-end",
              justifyContent: "space-between",
              padding: 10,
            }}
          >
            <TextInput
              style={{
                color: darkTheme ? colors.white : colors.black,
                width: "90%",
                padding: 10,
                fontFamily: "bas-regular",
              }}
              multiline={true}
              placeholder="Write a reply"
              placeholderTextColor={darkTheme ? colors.white : colors.black}
              value={text}
              onChangeText={(text) => setText(text)}
              selectionColor={darkTheme ? colors.white : colors.black}
              autoFocus
            />
            <TouchableOpacity
              style={{ zIndex: 1000 }}
              onPress={() => {
                handleReply();
              }}
            >
              {replyMutation.isLoading ? (
                <ActivityIndicator
                  size="small"
                  color={darkTheme ? colors.white : colors.black}
                />
              ) : (
                <Ionicons
                  name={text.length > 0 ? "send" : "send-outline"}
                  size={25}
                  color={
                    text.length > 0
                      ? darkTheme
                        ? colors.white
                        : colors.black
                      : darkTheme
                      ? "rgba(255,255,255,0.5)"
                      : "rgba(0,0,0,0.5)"
                  }
                />
              )}
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              alignItems: "center",
              justifyContent: "flex-start",
              width: Dimensions.get("screen").width,
              flexDirection: "column",
            }}
            scrollEventThrottle={16}
          >
            <Text
              style={{
                color: darkTheme ? colors.white : "#000",
                fontSize: 25,
                fontFamily: "bas-semibold",
                maxWidth: "90%",
                marginTop: 20,
                width: "90%",
              }}
            >
              {comment.text}
            </Text>
            {comment.answers.length > 0 ? (
              <>
                {comment.answers.map((answer: any, idx: number) => (
                  <View
                    style={{
                      flexDirection: "row",
                      width: "100%",
                      padding: 20,
                      alignItems: "flex-start",
                      justifyContent: "flex-start",
                      marginBottom:
                        idx === comment.answers.length - 1 ? 100 : 0,
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
                        <Text
                          style={{
                            color: colors.primary,
                            fontFamily: "bas-semibold",
                            marginRight: 5,
                          }}
                        >
                          @{answer.reply_to_username}
                        </Text>
                        <Text
                          style={{
                            maxWidth: "80%",
                            color: darkTheme ? colors.white : colors.black,
                            fontFamily: "bas-regular",
                          }}
                        >
                          {answer.text}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </>
            ) : (
              <Text
                style={{
                  color: darkTheme
                    ? "rgba(255,255,255,0.5)"
                    : "rgba(0,0,0,0.5)",
                  fontSize: 12,
                  fontFamily: "bas-regular",
                  maxWidth: "90%",
                  marginTop: 20,
                  width: "90%",
                }}
              >
                No replies yet. Be the first one to reply!
              </Text>
            )}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default ReplyToCommentScreen;
