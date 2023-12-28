import { FC, useState, useRef, RefObject } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  Pressable,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
  Animated,
} from "react-native";
import useDarkTheme from "../../hooks/useDarkTheme";
import { colors } from "../../lib/util/colors";
import { useMutation, useQuery } from "react-query";
import { userService } from "../../api/users";
import { useAuth } from "../../context/AuthContext";
import { Feather, AntDesign } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

interface NotificationsScreenProps {
  navigation: any;
}

const Header = ({ navigation }: { navigation: any }) => {
  const insets = useSafeAreaInsets();
  const darkTheme = useDarkTheme();

  return (
    <View
      style={{
        width: Dimensions.get("screen").width,
        backgroundColor: darkTheme ? colors.black : colors.white,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: insets.top + 30,
        paddingHorizontal: 20,
      }}
    >
      <Pressable
        style={{
          position: "absolute",
          left: 20,
          padding: 10,
        }}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Feather
          name="chevron-down"
          size={27}
          color={darkTheme ? colors.white : colors.black}
        />
      </Pressable>

      <Text
        style={{
          color: darkTheme ? colors.white : colors.black,
          fontFamily: "bas-semibold",
          fontSize: 18,
        }}
      >
        Notifications
      </Text>
    </View>
  );
};

const NotificationHeader = ({
  scrollViewRef,
  scrollX,
}: {
  scrollViewRef: RefObject<ScrollView>;
  scrollX: Animated.Value;
}) => {
  const darkTheme = useDarkTheme();

  const [unreadX, setUnreadX] = useState(0);
  const [readX, setReadX] = useState(0);
  const translateX = scrollX.interpolate({
    inputRange: [0, Dimensions.get("screen").width],
    outputRange: [unreadX, readX],
    extrapolate: "clamp",
  });

  const unreadTextColor = scrollX.interpolate({
    inputRange: [0, Dimensions.get("screen").width],
    outputRange: darkTheme
      ? ["rgba(255,255,255,1)", "rgba(255,255,255,0.5)"]
      : ["rgba(0,0,0,1)", "rgba(0,0,0,0.5)"],
    extrapolate: "clamp",
  });

  const readTextColor = scrollX.interpolate({
    inputRange: [0, Dimensions.get("screen").width],
    outputRange: darkTheme
      ? ["rgba(255,255,255,0.5)", "rgba(255,255,255,1)"]
      : ["rgba(0,0,0,0.5)", "rgba(0,0,0,1)"],
    extrapolate: "clamp",
  });

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: darkTheme ? colors.black : colors.white,
        width: "100%",
        borderBottomColor: darkTheme
          ? "rgba(255,255,255,0.2)"
          : "rgba(0,0,0,0.2)",
        borderBottomWidth: 0.3,
      }}
    >
      <Pressable
        style={{
          width: "50%",
          justifyContent: "center",
          alignItems: "center",
          padding: 10,
        }}
        onLayout={(event) => {
          const layout = event.nativeEvent.layout;
          setUnreadX(layout.x + layout.width / 2 - 25);
        }}
        onPress={() => {
          scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
        }}
      >
        <Animated.Text
          style={{
            fontFamily: "bas-medium",
            fontSize: 16,
            color: unreadTextColor,
          }}
        >
          Unread
        </Animated.Text>
      </Pressable>

      <Animated.View
        style={{
          position: "absolute",
          bottom: 0,
          height: 5,
          width: 50,
          borderRadius: 99,
          backgroundColor: darkTheme ? colors.white : colors.black,
          transform: [{ translateX }],
        }}
      />

      <Pressable
        style={{
          width: "50%",
          justifyContent: "center",
          alignItems: "center",
          padding: 10,
        }}
        onLayout={(event) => {
          const layout = event.nativeEvent.layout;
          setReadX(layout.x + layout.width / 2 - 25);
        }}
        onPress={() => {
          scrollViewRef.current?.scrollTo({
            x: Dimensions.get("screen").width,
            y: 0,
            animated: true,
          });
        }}
      >
        <Animated.Text
          style={{
            fontFamily: "bas-medium",
            fontSize: 16,
            color: readTextColor,
          }}
        >
          Read
        </Animated.Text>
      </Pressable>
    </View>
  );
};

const NotificationsScreen: FC<NotificationsScreenProps> = ({ navigation }) => {
  const darkTheme = useDarkTheme();
  const { authState }: any = useAuth();
  const [refreshingUnread, setRefreshingUnread] = useState<boolean>(false);
  const [refreshingRead, setRefreshingRead] = useState<boolean>(false);
  const scrollX = useRef(new Animated.Value(0)).current;

  const { data: me, isLoading: isMeLoading } = useQuery(
    "me",
    () => userService.getMe(authState?.access_token),
    {
      enabled: !!authState?.access_token,
    }
  );

  const {
    data: unreadNotifications,
    isLoading: isUnreadNotificationsLoading,
    refetch: refetchUnreadNotifications,
  } = useQuery(
    "unreadNotifications",
    () =>
      userService.getUnreadNotifications(
        authState?.access_token ? authState.access_token : ""
      ),
    {
      enabled: !!authState?.access_token,
    }
  );

  const {
    data: readNotifications,
    isLoading: isReadNotificationsLoading,
    refetch: refetchReadNotifications,
  } = useQuery(
    "readNotifications",
    () =>
      userService.getReadNotifications(
        authState?.access_token ? authState.access_token : ""
      ),
    {
      enabled: !!authState?.access_token,
    }
  );

  const refreshUnreadNotifications = async () => {
    setRefreshingUnread(true);

    await refetchUnreadNotifications();

    setRefreshingUnread(false);
  };

  const refreshReadNotifications = async () => {
    setRefreshingRead(true);

    await refetchReadNotifications();

    setRefreshingRead(false);
  };

  const readNotificationMutation = useMutation(
    (notification_id: string) =>
      userService.readNotification(
        authState?.access_token ? authState.access_token : "",
        notification_id
      ),
    {
      onSuccess: () => {
        refetchUnreadNotifications();
        refetchReadNotifications();
      },
    }
  );

  const readNotificationsMutation = useMutation(
    () =>
      userService.readNotifications(
        authState?.access_token ? authState.access_token : ""
      ),
    {
      onSuccess: () => {
        refetchUnreadNotifications();
        refetchReadNotifications();
        scrollViewRef.current?.scrollTo({
          x: Dimensions.get("screen").width,
          y: 0,
          animated: true,
        });
        scrollViewRef.current?.scrollTo({
          x: 0,
          y: 0,
          animated: true,
        });
      },
    }
  );

  const scrollViewRef = useRef<ScrollView>(null);

  if (!me || isUnreadNotificationsLoading || isReadNotificationsLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
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
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: darkTheme ? colors.black : colors.white,
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: darkTheme ? colors.black : colors.white,
        }}
      >
        <StatusBar animated style={darkTheme ? "light" : "dark"} />
        <Header navigation={navigation} />
        <NotificationHeader scrollViewRef={scrollViewRef} scrollX={scrollX} />
        <ScrollView
          horizontal
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: darkTheme ? colors.black : colors.white,
            width: Dimensions.get("screen").width * 2,
          }}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          ref={scrollViewRef}
          scrollEventThrottle={16}
          bounces={false}
          onScroll={(e) => {
            const offsetX = e.nativeEvent.contentOffset.x;
            scrollX.setValue(offsetX);
          }}
        >
          <ScrollView
            contentContainerStyle={{
              justifyContent:
                unreadNotifications.length > 0 ? "flex-start" : "center",
              alignItems:
                unreadNotifications.length > 0 ? "flex-start" : "center",
              backgroundColor: darkTheme ? colors.black : colors.white,
              width: Dimensions.get("screen").width,
              flexGrow: 1,
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshingUnread}
                onRefresh={refreshUnreadNotifications}
              />
            }
            showsVerticalScrollIndicator={false}
          >
            {unreadNotifications.length > 0 ? (
              <>
                <Pressable
                  style={{
                    borderRadius: 99,
                    marginBottom: 20,
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 20,
                    marginLeft: 20,
                    flexDirection: "row",
                    backgroundColor: darkTheme
                      ? "rgba(255,255,255,0.2)"
                      : "rgba(0,0,0,0.1)",
                    paddingVertical: 5,
                    paddingHorizontal: 20,
                  }}
                  disabled={
                    unreadNotifications.length === 0 ||
                    readNotificationsMutation.isLoading
                  }
                  onPress={() => {
                    readNotificationsMutation.mutate();
                  }}
                >
                  {readNotificationsMutation.isLoading ? (
                    <ActivityIndicator
                      size="small"
                      color={darkTheme ? colors.white : colors.black}
                    />
                  ) : (
                    <Text
                      style={{
                        fontFamily: "bas-medium",
                        fontSize: 13,
                        color:
                          unreadNotifications.length > 0
                            ? darkTheme
                              ? colors.white
                              : colors.black
                            : darkTheme
                            ? "rgba(255,255,255,0.5)"
                            : "rgba(0,0,0,0.5)",
                      }}
                    >
                      Mark all as read
                    </Text>
                  )}
                </Pressable>
                {unreadNotifications?.map((notification: any, idx: number) => (
                  <Pressable
                    key={notification.id}
                    style={{
                      width: "100%",
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                      paddingHorizontal: 20,
                      flexDirection: "row",
                      padding: 20,
                      marginBottom:
                        idx === unreadNotifications.length - 1 ? 50 : 0,
                    }}
                    disabled={readNotificationMutation.isLoading}
                    onPress={() => {
                      readNotificationMutation.mutate(notification.id);
                    }}
                  >
                    <Pressable
                      onPress={() => {
                        navigation.navigate("SingleProfile", {
                          userId: notification.sender.id,
                        });
                      }}
                    >
                      {notification.sender.image_url ? (
                        <Image
                          source={{
                            uri: `${
                              notification.sender.image_url
                            }?${new Date().getTime()}`,
                            cache: "reload",
                          }}
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 25,
                            padding: 5,
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
                            padding: 5,
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
                        justifyContent: "center",
                        alignItems: "flex-start",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "flex-start",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "bas-regular",
                            fontSize: 14,
                            color: darkTheme
                              ? "rgba(255,255,255,0.5)"
                              : "rgba(0,0,0,0.5)",
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: "bas-semibold",
                              fontSize: 14,
                              color: darkTheme ? colors.white : colors.black,
                            }}
                          >
                            {notification.sender.username}
                          </Text>{" "}
                          {notification.action_type === "like" &&
                            "liked your outfit!"}
                          {notification.action_type === "comment" &&
                            "commented on your outfit:"}
                          {notification.action_type === "save" &&
                            "saved your outfit!"}
                          {notification.action_type === "Follow_Request" &&
                            "wants to follow you!"}
                          {notification.action_type === "Follow" &&
                            "is now following you!"}
                          {notification.action_type === "Follow_Accepted" &&
                            "accepted your follow request!"}
                          {notification.action_type === "reply" &&
                            notification.entity_type === "comment_answer" &&
                            "replied to your comment:"}{" "}
                        </Text>
                        <View
                          style={{
                            backgroundColor: colors.red,
                            width: 10,
                            height: 10,
                            borderRadius: 99,
                            marginLeft: 5,
                          }}
                        />
                      </View>

                      {notification.action_type === "reply" && (
                        <Text
                          style={{
                            fontFamily: "bas-regular",
                            fontSize: 14,
                            color: darkTheme ? colors.white : colors.black,
                            maxWidth: "90%",
                            marginTop: 5,
                          }}
                        >
                          {notification.entity.text}
                        </Text>
                      )}

                      {notification.entity_type === "outfit" && (
                        <Pressable
                          onPress={() => {
                            navigation.navigate("SingleOutfit", {
                              outfitId: notification.entity.id,
                            });
                          }}
                        >
                          <Image
                            source={{ uri: notification.entity.photo_url }}
                            style={{
                              width: 50,
                              height: 50,
                              borderRadius: 10,
                              marginTop: 10,
                            }}
                          />
                        </Pressable>
                      )}

                      {notification.action_type === "Follow_Request" &&
                        !me.followers.find(
                          (f: any) => f.id === notification.sender.id
                        ) && (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "flex-start",
                              marginTop: 10,
                            }}
                          >
                            <Pressable
                              style={{
                                backgroundColor: colors.primary,
                                borderRadius: 5,
                                marginRight: 10,
                                paddingVertical: 5,
                                paddingHorizontal: 20,
                              }}
                              onPress={() => {
                                userService.acceptFollowRequest(
                                  authState?.access_token
                                    ? authState.access_token
                                    : "",
                                  {
                                    follower_id: notification.sender.id,
                                  }
                                );
                                refetchUnreadNotifications();
                                refetchReadNotifications();
                              }}
                            >
                              <Text
                                style={{
                                  fontFamily: "bas-medium",
                                  fontSize: 14,
                                  color: darkTheme
                                    ? colors.black
                                    : colors.white,
                                }}
                              >
                                Accept
                              </Text>
                            </Pressable>
                            <Pressable
                              style={{
                                paddingVertical: 5,
                                paddingHorizontal: 20,
                                borderRadius: 5,
                                backgroundColor: darkTheme
                                  ? "rgba(255,255,255,0.1)"
                                  : "rgba(0,0,0,0.1)",
                              }}
                              onPress={() => {
                                userService.rejectFollowRequest(
                                  authState?.access_token
                                    ? authState.access_token
                                    : "",
                                  {
                                    user_id: notification.sender.id,
                                  }
                                );
                                refetchUnreadNotifications();
                                refetchReadNotifications();
                              }}
                            >
                              <Text
                                style={{
                                  fontFamily: "bas-regular",
                                  fontSize: 14,
                                  color: darkTheme
                                    ? "rgba(255,255,255,0.7)"
                                    : "rgba(0,0,0,0.7)",
                                }}
                              >
                                Deny
                              </Text>
                            </Pressable>
                          </View>
                        )}

                      {notification.action_type === "comment" && (
                        <>
                          <Text
                            style={{
                              fontFamily: "bas-regular",
                              fontSize: 14,
                              color: darkTheme ? colors.white : colors.black,
                              maxWidth: "90%",
                              marginTop: 5,
                            }}
                          >
                            {notification.entity.text}
                          </Text>
                          <Pressable
                            style={{
                              marginTop: 10,
                            }}
                            onPress={() => {
                              navigation.navigate("SingleOutfit", {
                                outfitId: notification.entity.outfit_id,
                              });
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: "bas-semibold",
                                fontSize: 12,
                                color: darkTheme
                                  ? "rgba(255,255,255,0.5)"
                                  : "rgba(0,0,0,0.5)",
                              }}
                            >
                              CHECK IT OUT
                            </Text>
                          </Pressable>
                        </>
                      )}
                    </View>
                  </Pressable>
                ))}
              </>
            ) : (
              <>
                <Feather
                  name="bell-off"
                  size={50}
                  color={
                    darkTheme ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)"
                  }
                />

                <Text
                  style={{
                    fontFamily: "bas-regular",
                    fontSize: 16,
                    color: darkTheme
                      ? "rgba(255,255,255,0.5)"
                      : "rgba(0,0,0,0.5)",
                    marginTop: 10,
                  }}
                >
                  No unread notifications
                </Text>
              </>
            )}
          </ScrollView>

          <ScrollView
            contentContainerStyle={{
              justifyContent:
                readNotifications.length > 0 ? "flex-start" : "center",
              alignItems:
                readNotifications.length > 0 ? "flex-start" : "center",
              backgroundColor: darkTheme ? colors.black : colors.white,
              width: Dimensions.get("screen").width,
              flexGrow: 1,
            }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshingRead}
                onRefresh={refreshReadNotifications}
              />
            }
          >
            {readNotifications.length > 0 ? (
              <>
                {readNotifications?.map((notification: any, idx: number) => (
                  <View
                    key={notification.id}
                    style={{
                      width: "100%",
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                      paddingHorizontal: 20,
                      flexDirection: "row",
                      marginBottom:
                        idx === unreadNotifications.length - 1 ? 50 : 0,
                      padding: 20,
                    }}
                  >
                    <Pressable
                      onPress={() => {
                        navigation.navigate("SingleProfile", {
                          userId: notification.sender.id,
                        });
                      }}
                    >
                      {notification.sender.image_url ? (
                        <Image
                          source={{
                            uri: `${
                              notification.sender.image_url
                            }?${new Date().getTime()}`,
                            cache: "reload",
                          }}
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 25,
                            padding: 5,
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
                            padding: 5,
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
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "flex-start",
                          justifyContent: "flex-start",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "bas-regular",
                            fontSize: 14,
                            color: darkTheme
                              ? "rgba(255,255,255,0.5)"
                              : "rgba(0,0,0,0.5)",
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: "bas-semibold",
                              fontSize: 14,
                              color: darkTheme ? colors.white : colors.black,
                            }}
                          >
                            {notification.sender.username}
                          </Text>{" "}
                          {notification.action_type === "like" &&
                            "liked your outfit"}
                          {notification.action_type === "comment" &&
                            "commented on your outfit:"}
                          {notification.action_type === "save" &&
                            "saved your outfit"}
                          {notification.action_type === "Follow_Request" &&
                            "wants to follow you!"}
                          {notification.action_type === "Follow_Accepted" &&
                            "accepted your follow request"}
                          {notification.action_type === "Follow" &&
                            "is now following you"}{" "}
                          {notification.action_type === "reply" &&
                            notification.entity_type === "comment_answer" &&
                            "replied to your comment:"}
                        </Text>

                        {notification.entity_type === "outfit" && (
                          <Pressable
                            onPress={() => {
                              navigation.navigate("SingleOutfit", {
                                outfitId: notification.entity.id,
                              });
                            }}
                          >
                            <Image
                              source={{ uri: notification.entity.photo_url }}
                              style={{
                                width: 50,
                                height: 50,
                                borderRadius: 10,
                                marginLeft: 10,
                              }}
                            />
                          </Pressable>
                        )}
                      </View>

                      {notification.action_type === "Follow_Request" &&
                        !me.followers.find(
                          (f: any) => f.id === notification.sender.id
                        ) && (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "flex-start",
                              marginTop: 10,
                            }}
                          >
                            <Pressable
                              style={{
                                backgroundColor: colors.primary,
                                borderRadius: 5,
                                marginRight: 10,
                                paddingVertical: 5,
                                paddingHorizontal: 20,
                              }}
                              onPress={() => {
                                userService.acceptFollowRequest(
                                  authState?.access_token
                                    ? authState.access_token
                                    : "",
                                  {
                                    follower_id: notification.sender.id,
                                  }
                                );
                                refetchUnreadNotifications();
                                refetchReadNotifications();
                              }}
                            >
                              <Text
                                style={{
                                  fontFamily: "bas-medium",
                                  fontSize: 14,
                                  color: darkTheme
                                    ? colors.black
                                    : colors.white,
                                }}
                              >
                                Accept
                              </Text>
                            </Pressable>
                            <Pressable
                              style={{
                                paddingVertical: 5,
                                paddingHorizontal: 20,
                                borderRadius: 5,
                                backgroundColor: darkTheme
                                  ? "rgba(255,255,255,0.1)"
                                  : "rgba(0,0,0,0.1)",
                              }}
                              onPress={() => {
                                userService.rejectFollowRequest(
                                  authState?.access_token
                                    ? authState.access_token
                                    : "",
                                  {
                                    user_id: notification.sender.id,
                                  }
                                );
                                refetchUnreadNotifications();
                                refetchReadNotifications();
                              }}
                            >
                              <Text
                                style={{
                                  fontFamily: "bas-regular",
                                  fontSize: 14,
                                  color: darkTheme
                                    ? "rgba(255,255,255,0.7)"
                                    : "rgba(0,0,0,0.7)",
                                }}
                              >
                                Deny
                              </Text>
                            </Pressable>
                          </View>
                        )}

                      {(notification.action_type === "reply" ||
                        notification.entity_type === "comment_anwer") && (
                        <Text
                          style={{
                            fontFamily: "bas-regular",
                            fontSize: 14,
                            color: darkTheme ? colors.white : colors.black,
                            maxWidth: "90%",
                            marginTop: 5,
                          }}
                        >
                          {notification.entity.text}
                        </Text>
                      )}
                    </View>
                  </View>
                ))}
              </>
            ) : (
              <>
                <Feather
                  name="bell-off"
                  size={50}
                  color={
                    darkTheme ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)"
                  }
                />

                <Text
                  style={{
                    fontFamily: "bas-regular",
                    fontSize: 16,
                    color: darkTheme
                      ? "rgba(255,255,255,0.5)"
                      : "rgba(0,0,0,0.5)",
                    marginTop: 10,
                  }}
                >
                  No read notifications
                </Text>
              </>
            )}
          </ScrollView>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default NotificationsScreen;
