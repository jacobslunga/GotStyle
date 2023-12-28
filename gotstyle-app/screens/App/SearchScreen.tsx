import { FC, RefObject, useState, useRef, useEffect } from "react";
import {
  Pressable,
  SafeAreaView,
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Image,
  Animated,
  TextInput,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import useDarkTheme from "../../hooks/useDarkTheme";
import { StatusBar } from "expo-status-bar";
import { User } from "../../lib/types";
import { colors } from "../../lib/util/colors";
import { Ionicons } from "@expo/vector-icons";
import { debounce } from "lodash";
import { useQuery } from "react-query";
import { userService } from "../../api/users";
import { outfitService } from "../../api/outfits";
import { useAuth } from "../../context/AuthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

interface SearchScreenProps {
  navigation: any;
}

const Header = ({
  handleSearch,
  searchQuery,
  setSearchQuery,
  inputRef,
}: {
  handleSearch: any;
  searchQuery: string;
  setSearchQuery: any;
  inputRef: RefObject<TextInput>;
}) => {
  const darkTheme = useDarkTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        height: 30 + insets.top,
        width: Dimensions.get("screen").width,
        backgroundColor: darkTheme ? colors.black : colors.white,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
    >
      <View
        style={{
          width: "90%",
          borderRadius: 99,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LinearGradient
          colors={["#FFA1F5", "#FF9B82"]}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: -1,
            borderRadius: 15,
            width: "100%",
            height: "100%",
            bottom: 0,
            padding: 1,
          }}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: -1 }}
        >
          <View
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: darkTheme ? "#000" : colors.white,
              borderRadius: 15,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TextInput
              placeholder="Search"
              placeholderTextColor={
                darkTheme ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)"
              }
              style={{
                color: darkTheme ? colors.white : colors.black,
                borderRadius: 15,
                backgroundColor: darkTheme ? "#000" : colors.white,
                width: "90%",
                fontFamily: "bas-regular",
                height: "100%",
                padding: 10,
              }}
              ref={inputRef}
              autoFocus
              value={searchQuery}
              selectionColor={darkTheme ? colors.white : colors.black}
              onChangeText={(t) => {
                handleSearch(t);
              }}
            />

            <Pressable
              style={{
                position: "absolute",
                right: 5,
                zIndex: 100,
              }}
              onPress={() => {
                inputRef.current?.focus();
                setSearchQuery("");
              }}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={
                  darkTheme ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)"
                }
              />
            </Pressable>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
};

const SearchHeader = ({
  scrollViewRef,
  scrollX,
}: {
  scrollViewRef: RefObject<ScrollView>;
  scrollX: Animated.Value;
}) => {
  const darkTheme = useDarkTheme();
  const [profilesX, setProfilesX] = useState(0);
  const [outfitsX, setOutfitsX] = useState(0);
  const translateX = scrollX.interpolate({
    inputRange: [0, Dimensions.get("screen").width],
    outputRange: [profilesX, outfitsX],
    extrapolate: "clamp",
  });

  const profilesTextColor = scrollX.interpolate({
    inputRange: [0, Dimensions.get("screen").width],
    outputRange: darkTheme
      ? ["rgba(255,255,255,1)", "rgba(255,255,255,0.5)"]
      : ["rgba(0,0,0,1)", "rgba(0,0,0,0.5)"],
    extrapolate: "clamp",
  });

  const outfitsTextColor = scrollX.interpolate({
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
        padding: 10,
        marginTop: 20,
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
          setProfilesX(layout.x + layout.width / 2 - 25);
        }}
        onPress={() => {
          scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
        }}
      >
        <Animated.Text
          style={{
            fontFamily: "bas-medium",
            fontSize: 16,
            color: profilesTextColor,
          }}
        >
          Profiles
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
          setOutfitsX(layout.x + layout.width / 2 - 25);
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
            color: outfitsTextColor,
          }}
        >
          Outfits
        </Animated.Text>
      </Pressable>
    </View>
  );
};

const SearchScreen: FC<SearchScreenProps> = ({ navigation }) => {
  const darkTheme = useDarkTheme();
  const scrollX = useRef(new Animated.Value(0)).current;
  const { authState }: any = useAuth();
  const inputRef = useRef<TextInput>(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const bottomPosition = useRef(
    new Animated.Value(Dimensions.get("screen").height * 0.1)
  ).current;

  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearch = debounce((searchQuery) => {
    userService.searchUsers(
      authState?.access_token ? authState.access_token : "",
      searchQuery
    );
    outfitService.searchOutfits(
      authState?.access_token ? authState.access_token : "",
      searchQuery
    );
  }, 1000);

  const { isLoading: isUsersLoading, data: usersData } = useQuery(
    ["usersData", searchQuery],
    () =>
      userService.searchUsers(
        authState?.access_token ? authState.access_token : "",
        searchQuery
      ),
    {
      enabled: !!searchQuery,
    }
  );

  const { isLoading: isOutfitsLoading, data: outfitsData } = useQuery(
    ["outfitsData", searchQuery],
    () =>
      outfitService.searchOutfits(
        authState?.access_token ? authState.access_token : "",
        searchQuery
      ),
    {
      enabled: !!searchQuery,
    }
  );

  const handleSearch = (t: string) => {
    setSearchQuery(t);
    debouncedSearch(t);
  };

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardWillShow",
      (e) => {
        setKeyboardVisible(true);
        Animated.timing(bottomPosition, {
          toValue: e.endCoordinates.height,
          duration: 300,
          useNativeDriver: false,
        }).start();
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardWillHide",
      () => {
        setKeyboardVisible(false);
        Animated.timing(bottomPosition, {
          toValue: Dimensions.get("screen").height * 0.1,
          duration: 300,
          useNativeDriver: false,
        }).start();
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <SafeAreaView
      style={{
        backgroundColor: darkTheme ? colors.black : colors.white,
        flex: 1,
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          backgroundColor: darkTheme ? colors.black : "#fff",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <StatusBar style={darkTheme ? "light" : "dark"} />

        <Header
          handleSearch={handleSearch}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          inputRef={inputRef}
        />

        {searchQuery.length > 0 && outfitsData && usersData && (
          <SearchHeader scrollViewRef={scrollViewRef} scrollX={scrollX} />
        )}

        {isUsersLoading || isOutfitsLoading ? (
          <ActivityIndicator size="small" color={darkTheme ? "#fff" : "#000"} />
        ) : (
          <>
            {/* No searchQuery */}
            {searchQuery.length === 0 && (
              <View
                style={{
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "absolute",
                  zIndex: 10,
                }}
              >
                <Text
                  style={{
                    color: darkTheme ? "#fff" : "#000",
                    fontFamily: "bas-medium",
                    marginTop: 50,
                  }}
                >
                  Search for outfits or profiles
                </Text>
              </View>
            )}

            {/* No results */}
            {searchQuery.length > 0 && !outfitsData && !usersData && (
              <View
                style={{
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "absolute",
                }}
              >
                <Text
                  style={{
                    color: darkTheme ? "#fff" : "#000",
                    fontFamily: "bas-regular",
                  }}
                >
                  No results
                </Text>
              </View>
            )}
          </>
        )}

        <Animated.View
          style={{
            position: "absolute",
            bottom: bottomPosition,
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            right: 20,
            borderRadius: 6,
            height: 35,
            width: 35,
          }}
        >
          <Pressable
            onPress={() => {
              if (inputRef.current) {
                keyboardVisible
                  ? inputRef.current.blur()
                  : inputRef.current.focus();
              }
            }}
            style={{
              width: "100%",
              height: "100%",
              overflow: "hidden",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LinearGradient
              colors={["#FFA1F5", "#FF9B82"]}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                zIndex: -1,
                borderRadius: 6,
                height: 35,
              }}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: -1 }}
            />
            <Ionicons
              name={keyboardVisible ? "arrow-down" : "search"}
              color={colors.white}
              size={30}
            />
          </Pressable>
        </Animated.View>

        <ScrollView
          contentContainerStyle={{
            width: Dimensions.get("screen").width * 2,
            height: "100%",
          }}
          horizontal
          keyboardDismissMode="on-drag"
          bounces={false}
          showsHorizontalScrollIndicator={false}
          ref={scrollViewRef}
          scrollEventThrottle={16}
          onScroll={(e) => {
            const offsetX = e.nativeEvent.contentOffset.x;
            scrollX.setValue(offsetX);
          }}
          pagingEnabled
        >
          {/* Users */}
          <ScrollView
            contentContainerStyle={{
              justifyContent: "flex-start",
              alignItems: "flex-start",
              backgroundColor: darkTheme ? colors.black : colors.white,
              width: Dimensions.get("screen").width,
              flexGrow: 1,
            }}
            showsVerticalScrollIndicator={false}
          >
            {usersData &&
              usersData.map((user: User) => (
                <Pressable
                  key={user.id}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: 20,
                  }}
                  onPress={() => {
                    navigation.navigate("SingleProfile", {
                      userId: user.id,
                    });
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    {user.image_url ? (
                      <Image
                        source={{
                          uri: `${user.image_url}?${new Date().getTime()}`,
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
                        <Ionicons
                          name="person"
                          size={20}
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
                        color: darkTheme ? "#fff" : "#000",
                        fontFamily: "bas-medium",
                      }}
                    >
                      {user.username}
                    </Text>
                  </View>

                  <Ionicons
                    name="chevron-forward-outline"
                    size={20}
                    color={
                      darkTheme ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)"
                    }
                  />
                </Pressable>
              ))}
          </ScrollView>

          {/* Outfits */}
          {outfitsData && (
            <FlatList
              horizontal={false}
              contentContainerStyle={{
                maxWidth: Dimensions.get("screen").width,
              }}
              data={outfitsData}
              renderItem={({ item, index }) => (
                <Pressable
                  onPress={() => {
                    navigation.navigate("SingleOutfit", {
                      outfitId: item.id,
                    });
                  }}
                  key={item.id}
                  style={{
                    marginBottom: index === outfitsData.length - 1 ? 50 : 0,
                  }}
                >
                  <Image
                    source={{ uri: item.photo_url, cache: "force-cache" }}
                    style={{
                      width: Dimensions.get("screen").width / 2 - 1,
                      height: Dimensions.get("screen").width / 2 - 1,
                      borderColor: darkTheme ? colors.black : colors.white,
                      borderRightWidth: index % 2 === 0 ? 1 : 0,
                      borderLeftWidth: index % 2 === 0 ? 0 : 1,
                    }}
                  />
                </Pressable>
              )}
              keyExtractor={(item, index) => index.toString()}
              numColumns={2}
              columnWrapperStyle={{ flex: 1 }}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SearchScreen;
