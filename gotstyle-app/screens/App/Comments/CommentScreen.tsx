import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import React, { FC, useRef, useState, useCallback } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  Image,
  Animated,
  RefreshControl,
  Pressable,
} from "react-native";
import CommentHeader from "../../../components/Outfit/Comments/CommentHeader";
import { colors } from "../../../lib/util/colors";
import useDarkTheme from "../../../hooks/useDarkTheme";
import { useAuth } from "../../../context/AuthContext";
import { useMutation } from "react-query";
import { outfitService } from "../../../api/outfits";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "react-query";
import { Comment } from "../../../lib/types";
import Modal from "react-native-modal";
import CommentComponent from "../../../components/Outfit/Comments/CommentComponent";
import { userService } from "../../../api/users";

interface CommentScreenProps {
  route: any;
  navigation: any;
}

const ImageModal = ({
  source,
  isVisible,
  setIsVisible,
}: {
  source: string;
  isVisible: boolean;
  setIsVisible: any;
}) => {
  return (
    <Modal
      style={{ margin: 0 }}
      animationIn="fadeIn"
      animationOut="fadeOut"
      isVisible={isVisible}
      onBackdropPress={() => setIsVisible(false)}
      onBackButtonPress={() => setIsVisible(false)}
      onSwipeComplete={() => setIsVisible(false)}
      swipeDirection={["down", "left", "up", "right"]}
      swipeThreshold={20}
    >
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Image
          source={{ uri: source }}
          style={{ width: "90%", height: "70%", borderRadius: 10 }}
        />
      </View>
    </Modal>
  );
};

const CommentScreen: FC<CommentScreenProps> = ({ route, navigation }) => {
  const outfitId = route.params.outfitId;
  const darkTheme = useDarkTheme();
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [imageModalVisible, setImageModalVisible] = useState(false);

  const imageScale = scrollY.interpolate({
    inputRange: [-150, 0, 150],
    outputRange: [1.5, 1, 0],
    extrapolate: "clamp",
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const commentScrollRef = useRef<ScrollView>(null);

  const { authState } = useAuth();

  const [text, setText] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);

  const { refetch: refetchOutfits } = useQuery("outfits", () =>
    outfitService.getOutfits(authState?.access_token as string)
  );

  const { data: me, isLoading: meLoading } = useQuery(["me"], () =>
    userService.getMe(authState?.access_token as string)
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetchOutfits();
    refetchOutfit().then(() => setRefreshing(false));
  }, []);

  const fastComments = [
    "Fire 🔥",
    "Slay! 👸",
    "Stunning 💕",
    "Goals! 👌",
    "Fashionable 👏",
    "Flawless 😍",
    "Adorable! 😍",
    "Iconic! 💯",
    "Chic! 👌",
    "Gorgeous! 😍",
    "Vibrant! 🌈",
    "Runway! 🏃‍♀️",
    "Obsessed! 😍",
    "Trendy! 💁‍♀️",
    "On-point! 👌",
    "Confident! 💃",
    "Influencer! 👗",
    "Bravo! 👏",
    "Inspirational! 🌟",
    "Stylish! 😄",
    "Fabulous! 💕",
  ];

  const {
    data: outfit,
    refetch: refetchOutfit,
    status,
  } = useQuery(
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

  const commentMutation = useMutation(
    (data: { access_token: string; outfit_id: string; comment: string }) =>
      outfitService.commentOutfit(
        data.access_token,
        data.outfit_id,
        data.comment
      ),
    {
      onSuccess: () => {
        setText("");
        refetchOutfit();
      },
    }
  );

  if (status === "loading" || meLoading) {
    return (
      <View
        style={{
          backgroundColor: darkTheme ? colors.black : colors.white,
          width: Dimensions.get("window").width,
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
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
        backgroundColor: darkTheme ? colors.black : colors.white,
        width: Dimensions.get("window").width,
        flex: 1,
      }}
    >
      <StatusBar style="auto" />
      <CommentHeader navigation={navigation} />

      <ImageModal
        source={outfit.photo_url}
        isVisible={imageModalVisible}
        setIsVisible={setImageModalVisible}
      />

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
            flexGrow: text.length > 0 && outfit.comments.length > 10 ? 1 : 0,
            minHeight: 100,
            zIndex: 1000,
          }}
        >
          <MaskedView
            style={{ flexDirection: "row" }}
            maskElement={
              <LinearGradient
                style={{
                  flex: 1,
                  flexDirection: "row",
                  height: "100%",
                }}
                colors={["transparent", "white", "white", "transparent"]}
                locations={[0, 0.1, 0.9, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            }
          >
            <ScrollView
              contentContainerStyle={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 10,
              }}
              showsHorizontalScrollIndicator={false}
              horizontal
            >
              {fastComments.map((item, i) => (
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 99,
                    marginRight: 10,
                    marginLeft: i === 0 ? 20 : 10,
                    marginBottom: 5,
                  }}
                  key={item}
                  onPress={() => setText(item)}
                >
                  <Text
                    style={{
                      color: darkTheme ? colors.white : colors.black,
                      fontFamily: "bas-regular",
                      fontSize: 12,
                    }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </MaskedView>
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
              placeholder="Add a comment..."
              placeholderTextColor={darkTheme ? colors.white : colors.black}
              value={text}
              onChangeText={(text) => setText(text)}
              selectionColor={darkTheme ? colors.white : colors.black}
              onFocus={() => {
                setTimeout(() => {
                  commentScrollRef.current?.scrollToEnd();
                }, 100);
              }}
              returnKeyType="send"
              onSubmitEditing={() => {
                if (commentMutation.isLoading) return;

                commentMutation.mutate({
                  access_token: authState?.access_token
                    ? authState.access_token
                    : "",
                  outfit_id: outfit.id,
                  comment: text,
                });
              }}
            />
            <TouchableOpacity
              onPress={() => {
                if (commentMutation.isLoading) return;

                commentMutation.mutate({
                  access_token: authState?.access_token
                    ? authState.access_token
                    : "",
                  outfit_id: outfit.id,
                  comment: text,
                });
              }}
              style={{ zIndex: 1000 }}
            >
              {commentMutation.isLoading ? (
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
        </View>

        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: "center",
            justifyContent: "flex-start",
            width: Dimensions.get("screen").width,
            flexDirection: "column",
          }}
          ref={commentScrollRef}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[darkTheme ? colors.white : colors.black]}
            />
          }
        >
          <Pressable onPress={() => setImageModalVisible(true)}>
            <Animated.Image
              source={{ uri: outfit.photo_url }}
              style={{
                width: 150,
                height: 150,
                transform: [{ scale: imageScale }],
                opacity: imageOpacity,
                borderRadius: 10,
                marginTop: 20,
              }}
            />
          </Pressable>
          {outfit.comments.length > 0 ? (
            <>
              {outfit.comments.map((comment: Comment, idx: number) => (
                <CommentComponent
                  darkTheme={darkTheme}
                  comment={comment}
                  idx={idx}
                  navigation={navigation}
                  key={comment.id}
                  me={me}
                  outfitId={outfit.id}
                  refetchOutfit={refetchOutfit}
                  isLastComment={idx === outfit.comments.length - 1}
                />
              ))}
            </>
          ) : (
            <Text
              style={{
                color: darkTheme ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
                fontSize: 12,
                fontFamily: "bas-regular",
                maxWidth: "80%",
                marginTop: 20,
              }}
            >
              No comments yet. Be the first to comment on this outfit!
            </Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default CommentScreen;
