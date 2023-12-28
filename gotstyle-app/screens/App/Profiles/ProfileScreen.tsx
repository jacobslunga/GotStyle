import { FC, useEffect, useState, useRef } from "react";
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
import { useQuery } from "react-query";
import { StatusBar } from "expo-status-bar";
import { colors } from "../../../lib/util/colors";
import { Ionicons, AntDesign, Feather } from "@expo/vector-icons";
import StickyHeader from "../../../components/Profile/StickyHeader";
import { formatDate } from "../../../lib/util/formatDate";
import * as Haptics from "expo-haptics";
import { Outfit } from "../../../lib/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useMutation } from "react-query";

interface ProfileProps {
  navigation: any;
  route: any;
}

const Header = ({
  navigation,
  username,
}: {
  navigation: any;
  username: string;
}) => {
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
        onPress={() => {
          navigation.goBack();
        }}
        style={{
          position: "absolute",
          left: 20,
          zIndex: 1000,
        }}
      >
        <Feather
          name="chevron-left"
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
        {username}
      </Text>
    </View>
  );
};

const ProfileScreen: FC<ProfileProps> = ({ navigation, route }) => {
  const darkTheme = useDarkTheme();
  const { authState }: any = useAuth();
  const { userId } = route.params;

  const {
    data: me,
    refetch: refetchMe,
    isLoading,
  } = useQuery("me", () => userService.getMe(authState.access_token), {
    enabled: !!authState?.access_token,
    refetchOnWindowFocus: false,
  });

  const {
    data: user,
    refetch: refetchUser,
    isLoading: isUserLoading,
  } = useQuery(
    "user",
    () => userService.getUserById(authState.access_token, userId),
    {
      enabled: !!authState?.access_token,
      refetchOnWindowFocus: false,
    }
  );

  const [showOutfits, setShowOutfits] = useState<boolean>(true);
  const [showSavedOutfits, setShowSavedOutfits] = useState<boolean>(false);
  const [showLikedOutfits, setShowLikedOutfits] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [showFullUsername, setShowFullUsername] = useState<boolean>(false);

  useEffect(() => {
    refetchUser();
  }, [refetchUser]);

  const { data: unreadNotifications, isLoading: isLoadingNotifications } =
    useQuery(
      "unreadNotifications",
      () =>
        userService.getUnreadNotifications(
          authState?.access_token ? authState.access_token : ""
        ),
      {
        enabled: authState?.access_token ? true : false,
        retry: false,
      }
    );

  const onRefresh = () => {
    setRefreshing(true);
    refetchUser();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const [prevScrollX, setPrevScrollX] = useState(0);

  const scrollRef = useRef(null);

  const [photo_base64, setPhotoBase64] = useState<string>("");

  const updateMeMutation = useMutation(
    () =>
      userService.updateMe(
        authState?.access_token ? authState.access_token : "",
        {
          bio: user.bio,
          email: user.email,
          name: user.name,
          photo_base64,
          is_private: user.is_private,
          sex: null,
          username: user.username,
        }
      ),
    {
      onSuccess: () => {
        refetchUser();
        refetchMe();
      },
      onError: () => {
        throw new Error("Something went wrong with the mutation: ");
      },
    }
  );

  const handleUpdateUser = async () => {
    try {
      await updateMeMutation.mutateAsync();
    } catch (error) {
      console.log(error);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setPhotoBase64(result.assets[0].base64 as string);

      handleUpdateUser();
      setTimeout(() => {
        refetchUser();
      }, 2000);
    }
  };

  if (isLoading || isLoadingNotifications || isUserLoading) {
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
        backgroundColor: darkTheme ? colors.black : colors.white,
      }}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: darkTheme ? colors.black : colors.white,
          },
        ]}
      >
        <StatusBar style={darkTheme ? "light" : "dark"} animated />
        <Header navigation={navigation} username={user.username} />

        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: "center",
            justifyContent: "flex-start",
            flexDirection: "column",
            maxWidth: Dimensions.get("screen").width,
          }}
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[1]}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 20,
              width: "100%",
              marginTop: 10,
              maxWidth: Dimensions.get("screen").width,
            }}
          >
            <View
              style={{
                width: 120,
                height: 120,
                borderRadius: 99,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: darkTheme ? "rgba(255,255,255,0.1)" : "#eee",
              }}
            >
              <Pressable
                style={{
                  padding: 7,
                  borderRadius: 99,
                  backgroundColor: darkTheme ? colors.white : colors.black,
                  position: "absolute",
                  bottom: -5,
                  right: -5,
                  zIndex: 10,
                  borderColor: darkTheme ? colors.black : colors.white,
                  borderWidth: 5,
                  overflow: "hidden",
                }}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  pickImage();
                }}
              >
                <Ionicons
                  name="add"
                  size={15}
                  color={darkTheme ? colors.black : colors.white}
                />
              </Pressable>

              <Pressable>
                {user.image_url ? (
                  <Image
                    source={{
                      uri: `${user.image_url}?${new Date().getTime()}`,
                      cache: "reload",
                    }}
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: 99,
                    }}
                  />
                ) : (
                  <View
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: 99,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <AntDesign
                      name="user"
                      size={50}
                      color={darkTheme ? colors.white : colors.black}
                    />
                  </View>
                )}
              </Pressable>
            </View>

            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: Dimensions.get("screen").width,
                marginTop: 20,
              }}
            >
              <Pressable
                onPress={() => {
                  if (user.username.length > 15) {
                    setShowFullUsername(!showFullUsername);
                  }
                }}
              >
                <Text
                  style={{
                    fontFamily: "bas-semibold",
                    fontSize: user.username.length > 15 ? 20 : 25,
                    color: darkTheme ? colors.white : colors.black,
                    maxWidth: "90%",
                  }}
                >
                  @
                  {user.username.length > 25
                    ? showFullUsername
                      ? `${user.username}`
                      : `${user.username.slice(0, 25)}...`
                    : user.username}
                </Text>
              </Pressable>

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
                  color: user.bio
                    ? darkTheme
                      ? colors.white
                      : colors.black
                    : darkTheme
                    ? "rgba(255, 255, 255, 0.5)"
                    : "rgba(0, 0, 0, 0.5)",
                  fontSize: 14,
                  marginTop: 10,
                  fontFamily: "bas-regular",
                  maxWidth: "70%",
                }}
              >
                {user.bio || "No bio yet"}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  marginTop: 10,
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
                      initialShowFollowers: true,
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
                      fontFamily: "bas-medium",
                    }}
                  >
                    {user.followers.length === 1 ? "Follower" : "Followers"}
                  </Text>
                </Pressable>

                <View
                  style={{
                    width: 1,
                    height: 20,
                    backgroundColor: darkTheme
                      ? "rgba(255,255,255,0.5)"
                      : "rgba(0,0,0,0.5)",
                    marginHorizontal: 10,
                  }}
                />

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
                      fontFamily: "bas-medium",
                    }}
                  >
                    {user.following.length === 1 ? "Following" : "Following"}
                  </Text>
                </Pressable>

                <View
                  style={{
                    width: 1,
                    height: 20,
                    backgroundColor: darkTheme
                      ? "rgba(255,255,255,0.5)"
                      : "rgba(0,0,0,0.5)",
                    marginHorizontal: 10,
                  }}
                />

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
                      fontFamily: "bas-medium",
                    }}
                  >
                    Outfits
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 20,
                  marginBottom: 20,
                }}
              >
                <Pressable
                  style={{
                    backgroundColor: darkTheme
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(0, 0, 0, 0.1)",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: 15,
                    paddingHorizontal: 20,
                    borderRadius: 10,
                  }}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    navigation.navigate("EditProfile");
                  }}
                >
                  <Text
                    style={{
                      color: darkTheme ? colors.white : colors.black,
                      fontSize: 16,
                      fontFamily: "bas-medium",
                    }}
                  >
                    Edit Profile
                  </Text>
                </Pressable>
                <Pressable
                  style={{
                    backgroundColor: darkTheme
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.1)",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 15,
                    borderRadius: 10,
                    marginLeft: 10,
                  }}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    navigation.navigate("Notifications");
                  }}
                >
                  <Feather
                    name="bell"
                    size={25}
                    color={darkTheme ? colors.white : colors.black}
                  />
                  {unreadNotifications.length > 0 && (
                    <View
                      style={{
                        position: "absolute",
                        top: -5,
                        right: -5,
                        width: 20,
                        height: 20,
                        borderRadius: 99,
                        backgroundColor: colors.red,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: colors.white,
                          fontSize: 10,
                          fontFamily: "bas-medium",
                        }}
                      >
                        {unreadNotifications.length}
                      </Text>
                    </View>
                  )}
                </Pressable>
              </View>
            </View>
          </View>

          <StickyHeader
            showOutfits={showOutfits}
            setShowOutfits={setShowOutfits}
            showSavedOutfits={showSavedOutfits}
            setShowSavedOutfits={setShowSavedOutfits}
            showLikedOutfits={showLikedOutfits}
            setShowLikedOutfits={setShowLikedOutfits}
            scrollRef={scrollRef}
          />

          <ScrollView
            contentContainerStyle={{
              width: Dimensions.get("screen").width * 3,
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              height: Dimensions.get("screen").height,
            }}
            bounces={false}
            ref={scrollRef}
            scrollEventThrottle={16}
            onScroll={(e) => {
              const scrollX = e.nativeEvent.contentOffset.x;
              const screenWidth = Dimensions.get("screen").width;
              const halfScreenWidth = screenWidth / 2;

              if (scrollX < halfScreenWidth && prevScrollX >= halfScreenWidth) {
                setShowOutfits(true);
                setShowSavedOutfits(false);
                setShowLikedOutfits(false);
              } else if (
                scrollX >= halfScreenWidth &&
                scrollX < screenWidth + halfScreenWidth &&
                (prevScrollX < halfScreenWidth ||
                  prevScrollX >= screenWidth + halfScreenWidth)
              ) {
                setShowOutfits(false);
                setShowSavedOutfits(true);
                setShowLikedOutfits(false);
              } else if (
                scrollX >= screenWidth + halfScreenWidth &&
                prevScrollX < screenWidth + halfScreenWidth
              ) {
                setShowOutfits(false);
                setShowSavedOutfits(false);
                setShowLikedOutfits(true);
              }

              setPrevScrollX(scrollX);
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
          >
            <View
              style={{
                flexWrap: user.outfits.length > 0 ? "wrap" : "nowrap",
                width: Dimensions.get("screen").width,
                flexDirection: "row",
                alignItems: user.outfits.length > 0 ? "flex-start" : "center",
                justifyContent:
                  user.outfits.length > 0 ? "flex-start" : "center",
              }}
            >
              {user.outfits.length > 0 ? (
                <>
                  {user.outfits.map((outfit: Outfit) => (
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
                            fontWeight: "bold",
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
                      fontFamily: "bas-medium",
                      marginTop: 20,
                    }}
                  >
                    No outfits yet
                  </Text>
                </>
              )}
            </View>

            <View
              style={{
                flexWrap: user.outfits.length > 0 ? "wrap" : "nowrap",
                width: Dimensions.get("screen").width,
                flexDirection: "row",
                alignItems:
                  user.saved_outfits.length > 0 ? "flex-start" : "center",
                justifyContent:
                  user.saved_outfits.length > 0 ? "flex-start" : "center",
              }}
            >
              {user.saved_outfits.length > 0 ? (
                <>
                  {user.saved_outfits.map((outfit: any) => (
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
                            fontWeight: "bold",
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
                      marginTop: 20,
                      fontFamily: "bas-medium",
                    }}
                  >
                    No saved outfits yet
                  </Text>
                </>
              )}
            </View>

            <View
              style={{
                flexWrap: user.liked_outfits.length > 0 ? "wrap" : "nowrap",
                width: Dimensions.get("screen").width,
                flexDirection: "row",
                alignItems:
                  user.liked_outfits.length > 0 ? "flex-start" : "center",
                justifyContent:
                  user.liked_outfits.length > 0 ? "flex-start" : "center",
              }}
            >
              {user.liked_outfits.length > 0 ? (
                <>
                  {user.liked_outfits.map((outfit: any) => (
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
                            fontWeight: "bold",
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
                      marginTop: 20,
                      fontFamily: "bas-medium",
                    }}
                  >
                    No liked outfits yet
                  </Text>
                </>
              )}
            </View>
          </ScrollView>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "column",
  },
});
