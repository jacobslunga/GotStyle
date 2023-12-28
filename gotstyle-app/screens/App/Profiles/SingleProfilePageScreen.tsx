import { FC, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  Dimensions,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import useDarkTheme from "../../../hooks/useDarkTheme";
import { useAuth } from "../../../context/AuthContext";
import { userService } from "../../../api/users";
import { useMutation, useQuery } from "react-query";
import { StatusBar } from "expo-status-bar";
import { colors } from "../../../lib/util/colors";
import { AntDesign } from "@expo/vector-icons";
import { formatDate } from "../../../lib/util/formatDate";
import StickyHeader from "../../../components/SingleProfile/StickyHeader";

interface SingleProfileProps {
  navigation: any;
  route: any;
  refetchOutfits: () => void;
}

const SingleProfileScreen: FC<SingleProfileProps> = ({
  navigation,
  route,
  refetchOutfits,
}) => {
  const darkTheme = useDarkTheme();
  const { authState } = useAuth();
  const { userId } = route.params;

  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [showFullUsername, setShowFullUsername] = useState<boolean>(false);

  const {
    data: me,
    isLoading,
    refetch: refetchMe,
  } = useQuery(
    "me",
    () =>
      userService.getMe(authState?.access_token ? authState.access_token : ""),
    {
      enabled: authState?.access_token ? true : false,
      retry: false,
    }
  );

  const {
    data: user,
    isLoading: isLoadingUser,
    refetch: refetchUserById,
  } = useQuery(
    ["user", userId],
    () =>
      userService.getUserById(
        authState?.access_token ? authState.access_token : "",
        userId
      ),
    {
      enabled: authState?.access_token ? true : false,
      retry: false,
    }
  );

  const onRefresh = () => {
    setRefreshing(true);
    refetchMe();
    refetchUserById();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const followMutation = useMutation(
    () =>
      userService.followUser(
        authState?.access_token ? authState.access_token : "",
        {
          user_id: user.id,
        }
      ),
    {
      onSuccess: () => {
        refetchMe();
        refetchUserById();
        refetchOutfits();
      },
    }
  );

  const unfollowMutation = useMutation(
    () =>
      userService.unfollowUser(
        authState?.access_token ? authState.access_token : "",
        {
          user_id: user.id,
        }
      ),
    {
      onSuccess: () => {
        refetchMe();
        refetchUserById();
        refetchOutfits();
      },
    }
  );

  if (isLoading || isLoadingUser) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: darkTheme ? "#000" : "#fff",
          },
        ]}
      >
        <StatusBar style="light" />
        <ActivityIndicator size="small" color={darkTheme ? "#fff" : "#000"} />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: darkTheme ? colors.black : "#fff",
      }}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: darkTheme ? colors.black : "#fff",
          },
        ]}
      >
        <StatusBar style={darkTheme ? "light" : "dark"} />

        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: "center",
            justifyContent: "flex-start",
            flexDirection: "column",
            maxWidth: Dimensions.get("screen").width,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          stickyHeaderIndices={[1]}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              width: "100%",
              maxWidth: Dimensions.get("screen").width,
            }}
          >
            <View
              style={{
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                width: Dimensions.get("screen").width - 200,
              }}
            >
              <Pressable
                onPress={() => {
                  if (user.username.length > 15) {
                    setShowFullUsername(!showFullUsername);
                  }
                }}
                style={{
                  width: "100%",
                }}
              >
                <Text
                  style={{
                    fontFamily: "bas-semibold",
                    fontSize: 25,
                    color: darkTheme ? colors.white : colors.black,
                    maxWidth: "90%",
                  }}
                >
                  @
                  {user.username.length > 15
                    ? showFullUsername
                      ? `${user.username}`
                      : `${user.username.slice(0, 15)}...`
                    : user.username}
                </Text>
              </Pressable>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  marginTop: 10,
                  marginBottom: user.id === me.id ? 20 : 0,
                }}
              >
                <Pressable
                  style={{
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => {
                    navigation.navigate("UserFollows", {
                      userId: user.id,
                      initialShowFollowers: false,
                    });
                  }}
                >
                  <Text
                    style={{
                      color: darkTheme ? colors.white : colors.black,
                      fontSize: 16,
                      fontFamily: "bas-semibold",
                    }}
                  >
                    {user.followers.length > 0 ? user.followers.length : 0}
                  </Text>
                  <Text
                    style={{
                      color: darkTheme
                        ? "rgba(255, 255, 255, 0.5)"
                        : "rgba(0, 0, 0, 0.5)",
                      fontSize: 12,
                      fontFamily: "bas-regular",
                    }}
                  >
                    {user.followers.length === 1 ? "Follower" : "Followers"}
                  </Text>
                </Pressable>

                <Pressable
                  style={{
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: 10,
                  }}
                  onPress={() => {
                    navigation.navigate("UserFollows", {
                      userId: user.id,
                      initialShowFollowers: false,
                    });
                  }}
                >
                  <Text
                    style={{
                      color: darkTheme ? colors.white : colors.black,
                      fontSize: 16,
                      fontFamily: "bas-semibold",
                    }}
                  >
                    {user.following.length > 0 ? user.following.length : 0}
                  </Text>
                  <Text
                    style={{
                      color: darkTheme
                        ? "rgba(255, 255, 255, 0.5)"
                        : "rgba(0, 0, 0, 0.5)",
                      fontSize: 12,
                      fontFamily: "bas-regular",
                    }}
                  >
                    {user.following.length === 1 ? "Following" : "Following"}
                  </Text>
                </Pressable>

                <View
                  style={{
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: 10,
                  }}
                >
                  <Text
                    style={{
                      color: darkTheme ? colors.white : colors.black,
                      fontSize: 16,
                      fontFamily: "bas-semibold",
                    }}
                  >
                    {user.outfits.length > 0 ? user.outfits.length : 0}
                  </Text>
                  <Text
                    style={{
                      color: darkTheme
                        ? "rgba(255, 255, 255, 0.5)"
                        : "rgba(0, 0, 0, 0.5)",
                      fontSize: 12,
                      fontFamily: "bas-regular",
                    }}
                  >
                    Outfits
                  </Text>
                </View>
              </View>

              {user.name && (
                <Text
                  style={{
                    fontFamily: "bas-medium",
                    fontSize: 17,
                    color: darkTheme ? colors.white : colors.black,
                    marginTop: 10,
                    maxWidth: "90%",
                  }}
                >
                  {user.name}
                </Text>
              )}

              <Text
                style={{
                  color: me.bio
                    ? darkTheme
                      ? colors.white
                      : colors.black
                    : darkTheme
                    ? "rgba(255, 255, 255, 0.5)"
                    : "rgba(0, 0, 0, 0.5)",
                  fontSize: 14,
                  marginTop: 10,
                  fontFamily: "bas-regular",
                  maxWidth: "90%",
                }}
              >
                {user.bio || "No bio yet"}
              </Text>

              {user.id !== me.id && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 20,
                    marginBottom: 20,
                  }}
                >
                  {user.followers.find((f: any) => f.id === me.id) && (
                    <Pressable
                      style={{
                        backgroundColor: darkTheme
                          ? "rgba(255, 255, 255, 0.1)"
                          : "rgba(0, 0, 0, 0.1)",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 10,
                        width: "90%",
                        padding: 10,
                      }}
                      disabled={unfollowMutation.isLoading}
                      onPress={() => {
                        unfollowMutation.mutate(user.id);
                      }}
                    >
                      {unfollowMutation.isLoading ? (
                        <ActivityIndicator
                          size="small"
                          color={darkTheme ? "#fff" : "#000"}
                        />
                      ) : (
                        <Text
                          style={{
                            color: darkTheme ? colors.white : colors.black,
                            fontSize: 14,
                            fontFamily: "bas-semibold",
                          }}
                        >
                          Following
                        </Text>
                      )}
                    </Pressable>
                  )}

                  {user.pending_follows.find((f: any) => f.id === me.id) && (
                    <Pressable
                      style={{
                        backgroundColor: darkTheme
                          ? "rgba(255, 255, 255, 0.1)"
                          : "rgba(0, 0, 0, 0.1)",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 10,
                        width: "90%",
                      }}
                    >
                      <Text
                        style={{
                          color: darkTheme ? colors.white : colors.black,
                          fontSize: 14,
                          fontFamily: "bas-semibold",
                        }}
                      >
                        Request sent
                      </Text>
                    </Pressable>
                  )}

                  {!user.followers.find((f: any) => f.id === me.id) &&
                    !user.pending_follows.find((f: any) => f.id === me.id) && (
                      <Pressable
                        style={{
                          backgroundColor: colors.red2_grad,
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 10,
                          width: "90%",
                          padding: 10,
                        }}
                        disabled={followMutation.isLoading}
                        onPress={() => {
                          followMutation.mutate(user.id);
                        }}
                      >
                        {followMutation.isLoading ? (
                          <ActivityIndicator size="small" color="#fff" />
                        ) : (
                          <Text
                            style={{
                              color: colors.white,
                              fontSize: 14,
                              fontFamily: "bas-semibold",
                            }}
                          >
                            Follow
                          </Text>
                        )}
                      </Pressable>
                    )}
                </View>
              )}
            </View>

            {user.image_url ? (
              <Image
                source={{
                  uri: `${user.image_url}?${new Date().getTime()}`,
                  cache: "reload",
                }}
                style={{
                  width: 140,
                  height: 140,
                  borderRadius: 40,
                }}
              />
            ) : (
              <View
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 40,
                  backgroundColor: darkTheme
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.1)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AntDesign
                  name="user"
                  size={50}
                  color={
                    darkTheme
                      ? "rgba(255, 255, 255, 0.5)"
                      : "rgba(0, 0, 0, 0.5)"
                  }
                />
              </View>
            )}
          </View>

          <StickyHeader />

          <View
            style={{
              flexWrap: user.outfits.length > 0 ? "wrap" : "nowrap",
              width: Dimensions.get("screen").width,
              flexDirection: "row",
              alignItems:
                user.outfits.length > 0 && !user.is_private
                  ? "flex-start"
                  : "center",
              justifyContent:
                user.outfits.length > 0 && !user.is_private
                  ? "flex-start"
                  : "center",
            }}
          >
            {user.outfits.length > 0 ? (
              <>
                {user.outfits.map((outfit: any) => (
                  <Pressable
                    style={{
                      width: Dimensions.get("screen").width / 3,
                      height: Dimensions.get("screen").width / 3,
                    }}
                    key={outfit.id}
                    onPress={() => {
                      navigation.navigate("SingleOutfit", {
                        outfitId: outfit.id,
                      });
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "rgba(0,0,0,0.4)",
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 10,
                      }}
                    >
                      <Text
                        style={{
                          color: colors.white,
                          fontSize: 12,
                          fontFamily: "bas-semibold",
                        }}
                      >
                        {formatDate(outfit.created_at)}
                      </Text>
                    </View>
                    <Image
                      source={{ uri: outfit.photo_url }}
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </Pressable>
                ))}
              </>
            ) : (
              <>
                <Text
                  style={{
                    color: darkTheme ? colors.white : colors.black,
                    fontSize: 16,
                    fontFamily: "bas-semibold",
                    marginTop: 20,
                  }}
                >
                  No outfits yet
                </Text>
              </>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SingleProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "column",
  },
});
