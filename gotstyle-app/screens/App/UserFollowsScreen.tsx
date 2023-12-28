import { FC, RefObject, useState, useRef } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  Pressable,
  Text,
  Dimensions,
  Image,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "react-query";
import { userService } from "../../api/users";
import { useAuth } from "../../context/AuthContext";
import useDarkTheme from "../../hooks/useDarkTheme";
import { colors } from "../../lib/util/colors";
import { AntDesign } from "@expo/vector-icons";
import { Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

interface UserFollowsProps {
  route: any;
  navigation: any;
}

const Header = ({ navigation }: { navigation: any }) => {
  const insets = useSafeAreaInsets();
  const darkTheme = useDarkTheme();

  return (
    <View
      style={{
        height: 30 + insets.top,
        width: Dimensions.get("screen").width,
        backgroundColor: darkTheme ? colors.black : colors.white,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Pressable
        onPress={() => navigation.goBack()}
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: 5,
          position: "absolute",
          left: "2%",
        }}
      >
        <Feather
          name="x"
          size={30}
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
        Follows
      </Text>
    </View>
  );
};

const UserFollowsHeader = ({
  scrollViewRef,
  scrollX,
}: {
  scrollViewRef: RefObject<ScrollView>;
  scrollX: Animated.Value;
}) => {
  const darkTheme = useDarkTheme();

  const [followersX, setFollowersX] = useState(0);
  const [followingX, setFollowingX] = useState(0);
  const translateX = scrollX.interpolate({
    inputRange: [0, Dimensions.get("screen").width],
    outputRange: [followersX, followingX],
    extrapolate: "clamp",
  });

  const followersTextColor = scrollX.interpolate({
    inputRange: [0, Dimensions.get("screen").width],
    outputRange: darkTheme
      ? ["rgba(255,255,255,1)", "rgba(255,255,255,0.5)"]
      : ["rgba(0,0,0,1)", "rgba(0,0,0,0.5)"],
    extrapolate: "clamp",
  });

  const followingTextColor = scrollX.interpolate({
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
        onLayout={(e) => {
          const layout = e.nativeEvent.layout;
          setFollowersX(layout.x + layout.width / 2 - 25);
        }}
        onPress={() => {
          scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
        }}
      >
        <Animated.Text
          style={{
            fontFamily: "bas-medium",
            fontSize: 16,
            color: followersTextColor,
          }}
        >
          Followers
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
        onLayout={(e) => {
          const layout = e.nativeEvent.layout;
          setFollowingX(layout.x + layout.width / 2 - 25);
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
            color: followingTextColor,
          }}
        >
          Following
        </Animated.Text>
      </Pressable>
    </View>
  );
};

const UserFollowsScreen: FC<UserFollowsProps> = ({ route, navigation }) => {
  const { userId } = route.params;
  const { authState } = useAuth();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const scrollX = useRef(new Animated.Value(0)).current;

  const darkTheme = useDarkTheme();

  const scrollViewRef = useRef<ScrollView>(null);

  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery(["user", userId], () =>
    userService.getUserById(
      authState?.access_token ? authState.access_token : "",
      userId
    )
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (!user || isLoading) {
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
        backgroundColor: darkTheme ? colors.black : colors.white,
        flex: 1,
      }}
    >
      <View
        style={{
          backgroundColor: darkTheme ? colors.black : colors.white,
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Header navigation={navigation} />
        <UserFollowsHeader scrollViewRef={scrollViewRef} scrollX={scrollX} />

        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          bounces={false}
          onScroll={(e) => {
            const offsetX = e.nativeEvent.contentOffset.x;
            scrollX.setValue(offsetX);
          }}
          contentContainerStyle={{
            width: Dimensions.get("screen").width * 2,
            backgroundColor: darkTheme ? colors.black : colors.white,
          }}
        >
          <ScrollView
            contentContainerStyle={{
              width: Dimensions.get("screen").width,
              backgroundColor: darkTheme ? colors.black : colors.white,
              alignItems: user.followers.length > 0 ? "flex-start" : "center",
              justifyContent:
                user.followers.length > 0 ? "flex-start" : "center",
            }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {user.followers.length > 0 ? (
              <>
                {user.followers.map((follower: any) => (
                  <Pressable
                    key={follower.id}
                    style={{
                      width: "100%",
                      padding: 10,
                      paddingHorizontal: 20,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                    onPress={() => {
                      navigation.navigate("SingleProfileModal", {
                        userId: follower.id,
                      });
                    }}
                  >
                    {follower.image_url ? (
                      <Image
                        source={{
                          uri: `${follower.image_url}?${new Date().getTime()}`,
                          cache: "reload",
                        }}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 25,
                          marginRight: 10,
                        }}
                      />
                    ) : (
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 25,
                          backgroundColor: darkTheme
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(0,0,0,0.1)",
                          marginRight: 10,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <AntDesign
                          name="user"
                          size={27}
                          color={
                            darkTheme
                              ? "rgba(255,255,255,0.5)"
                              : "rgba(0,0,0,0.5)"
                          }
                        />
                      </View>
                    )}

                    <Text
                      style={{
                        fontFamily: "bas-medium",
                        fontSize: 14,
                        color: darkTheme ? colors.white : colors.black,
                      }}
                    >
                      {follower.username}
                    </Text>
                  </Pressable>
                ))}
              </>
            ) : (
              <>
                <Text
                  style={{
                    fontFamily: "bas-medium",
                    fontSize: 16,
                    color: darkTheme ? colors.white : colors.black,
                    marginTop: 30,
                  }}
                >
                  No followers
                </Text>
              </>
            )}
          </ScrollView>

          <ScrollView
            contentContainerStyle={{
              width: Dimensions.get("screen").width,
              backgroundColor: darkTheme ? colors.black : colors.white,
              alignItems: user.following.length > 0 ? "flex-start" : "center",
              justifyContent:
                user.following.length > 0 ? "flex-start" : "center",
            }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {user.following.length > 0 ? (
              <>
                {user.following.map((following: any) => (
                  <Pressable
                    key={following.id}
                    style={{
                      width: "100%",
                      padding: 10,
                      paddingHorizontal: 20,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                    onPress={() => {
                      navigation.navigate("SingleProfileModal", {
                        userId: following.id,
                      });
                    }}
                  >
                    {following.image_url ? (
                      <Image
                        source={{
                          uri: `${following.image_url}?${new Date().getTime()}`,
                          cache: "reload",
                        }}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 25,
                          marginRight: 10,
                        }}
                      />
                    ) : (
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 25,
                          backgroundColor: darkTheme
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(0,0,0,0.1)",
                          marginRight: 10,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <AntDesign
                          name="user"
                          size={27}
                          color={
                            darkTheme
                              ? "rgba(255,255,255,0.5)"
                              : "rgba(0,0,0,0.5)"
                          }
                        />
                      </View>
                    )}
                    <Text
                      style={{
                        fontFamily: "bas-medium",
                        fontSize: 14,
                        color: darkTheme ? colors.white : colors.black,
                      }}
                    >
                      {following.username}
                    </Text>
                  </Pressable>
                ))}
              </>
            ) : (
              <>
                <Text
                  style={{
                    fontFamily: "bas-medium",
                    fontSize: 16,
                    color: darkTheme ? colors.white : colors.black,
                    marginTop: 30,
                  }}
                >
                  Not following anyone
                </Text>
              </>
            )}
          </ScrollView>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default UserFollowsScreen;
