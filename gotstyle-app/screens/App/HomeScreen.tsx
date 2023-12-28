import {
  FC,
  useState,
  useCallback,
  useRef,
  useContext,
  useEffect,
} from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
  Animated,
  Text,
  Keyboard,
} from "react-native";
import { colors } from "../../lib/util/colors";
import BottomBar from "../../components/Home/BottomBar";
import { Outfit } from "../../lib/types";
import OutfitComponent from "../../components/Outfit/OutfitComponent";
import { StatusBar } from "expo-status-bar";
import Countdown from "../../components/Home/CountDown";
import { useAuth } from "../../context/AuthContext";
import { useQuery } from "react-query";
import { userService } from "../../api/users";
import { outfitService } from "../../api/outfits";
import Header from "../../components/Home/Header";
import { HashtagContext } from "../../context/HashtagContext";
import { ShowFollowingContext } from "../../context/ShowFollowing";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HomeProps {
  navigation: any;
  outfits: Outfit[];
  outfitsLoading: boolean;
  refetchOutfits: () => void;
}

const HomeScreen: FC<HomeProps> = ({ navigation }) => {
  const { authState, isFetching }: any = useAuth();
  const scrollRef = useRef<ScrollView>(null);
  const { hashtag } = useContext(HashtagContext);
  const [filteredOutfits, setFilteredOutfits] = useState<Outfit[]>([]);
  const [showForYou, setShowForYou] = useState<boolean>(true);
  const { showFollowing } = useContext(ShowFollowingContext);
  const insets = useSafeAreaInsets();

  const {
    data: me,
    refetch: refetchMe,
    isLoading: meLoading,
  } = useQuery("me", () => userService.getMe(authState.access_token), {
    enabled: !isFetching,
    refetchOnWindowFocus: false,
  });

  const {
    data: outfits,
    refetch: refetchOutfits,
    isLoading: outfitsLoading,
  } = useQuery(
    "outfits",
    () => outfitService.getOutfits(authState.access_token),
    {
      enabled: !isFetching,
      refetchOnWindowFocus: false,
    }
  );

  const {
    data: followingOufits,
    refetch: refetchFollowingOutfits,
    isLoading: followingOutfitsLoading,
  } = useQuery(
    "followingOutfits",
    () => userService.getFollowingOutfits(authState.access_token, me.id),
    {
      enabled: !isFetching && showFollowing,
      refetchOnWindowFocus: false,
    }
  );

  const fadeAnim = new Animated.Value(1);

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
      delay: 100,
    }).start();
  };

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (showFollowing) {
      refetchFollowingOutfits();
    } else {
      refetchOutfits();
    }
    refetchMe();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    if (hashtag === "# For You") {
      setShowForYou(true);
      setFilteredOutfits(outfits);
    } else {
      setShowForYou(false);
      const filtered = outfits?.filter((outfit: Outfit) => {
        return outfit.hashtags?.includes(hashtag);
      });
      setFilteredOutfits(filtered);
    }
  }, [hashtag, outfits]);

  useEffect(() => {
    Keyboard.dismiss();
  }, []);

  if (meLoading || outfitsLoading || isFetching) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.black,
        }}
      >
        <ActivityIndicator size="small" color={colors.white} />
      </View>
    );
  }

  return (
    <View
      style={[
        {
          ...styles.container,
          backgroundColor: colors.black,
        },
      ]}
    >
      <View
        style={[
          {
            ...styles.container,
            backgroundColor: "#000",
            position: "absolute",
            bottom: insets.bottom,
          },
        ]}
      >
        <Header navigation={navigation} fadeAnim={fadeAnim} me={me} />

        <StatusBar style="light" animated hideTransitionAnimation="fade" />
        <ScrollView
          contentContainerStyle={styles.scrollview}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          ref={scrollRef}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.white}
            />
          }
        >
          {!showFollowing && showForYou && hashtag === "# For You" && (
            <>
              {outfits.map((outfit: Outfit, index: number) => (
                <OutfitComponent
                  key={index}
                  outfit={outfit}
                  me={me}
                  navigation={navigation}
                  refetchOutfits={refetchOutfits}
                  fadeAnim={fadeAnim}
                  fadeOut={fadeOut}
                  fadeIn={fadeIn}
                  scrollRef={scrollRef}
                />
              ))}
            </>
          )}

          {!showForYou && hashtag !== "# For You" && (
            <>
              {filteredOutfits.length > 0 ? (
                <>
                  {filteredOutfits.map((outfit: Outfit, index: number) => (
                    <OutfitComponent
                      key={index}
                      outfit={outfit}
                      me={me}
                      navigation={navigation}
                      refetchOutfits={refetchOutfits}
                      fadeAnim={fadeAnim}
                      fadeOut={fadeOut}
                      fadeIn={fadeIn}
                      scrollRef={scrollRef}
                    />
                  ))}
                </>
              ) : (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: colors.white,
                      fontFamily: "bas-bold",
                      fontSize: 20,
                    }}
                  >
                    No outfits found
                  </Text>
                </View>
              )}
            </>
          )}

          {showFollowing && showForYou && hashtag === "# For You" && (
            <>
              {followingOufits.map((outfit: Outfit, index: number) => (
                <OutfitComponent
                  key={index}
                  outfit={outfit}
                  me={me}
                  navigation={navigation}
                  refetchOutfits={refetchOutfits}
                  fadeAnim={fadeAnim}
                  fadeOut={fadeOut}
                  fadeIn={fadeIn}
                  scrollRef={scrollRef}
                />
              ))}
            </>
          )}
        </ScrollView>

        <BottomBar me={me} navigation={navigation} fadeAnim={fadeAnim} />

        {me.has_posted_today && <Countdown fadeAnim={fadeAnim} />}
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height,
  },
  scrollview: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    width: Dimensions.get("screen").width,
    zIndex: 1000,
  },
});
