import { FC, useState, useRef, useContext, RefObject, useEffect } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  Animated,
  ScrollView,
} from "react-native";
import { Outfit, User } from "../../lib/types";
import { useMutation } from "react-query";
import { outfitService } from "../../api/outfits";
import { useAuth } from "../../context/AuthContext";
import * as Haptics from "expo-haptics";
import { userService } from "../../api/users";
import { HashtagContext } from "../../context/HashtagContext";
import OutfitInfo from "./OutfitInfo";
import { colors } from "../../lib/util/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface OutfitComponentProps {
  outfit: Outfit;
  me: User;
  navigation: any;
  refetchOutfits: () => void;
  fadeAnim: Animated.Value;
  fadeOut: () => void;
  fadeIn: () => void;
  scrollRef: RefObject<ScrollView>;
}

const OutfitComponent: FC<OutfitComponentProps> = ({
  outfit,
  me,
  navigation,
  refetchOutfits,
  fadeAnim,
  fadeOut,
  fadeIn,
  scrollRef,
}) => {
  const insets = useSafeAreaInsets();
  const { setHashTag } = useContext(HashtagContext);

  const likeScaleValue = useRef(new Animated.Value(1)).current;
  const saveScaleValue = useRef(new Animated.Value(1)).current;

  const [showDescription, setShowDescription] = useState(false);

  const [showOutfitImage, setShowOutfitImage] = useState(true);

  const { authState } = useAuth();
  const [hasLiked, setHasLiked] = useState(
    outfit.likes.users.find((user) => user.id === me.id) ? true : false
  );
  const [hasSaved, setHasSaved] = useState(
    outfit.saves.users.find((user) => user.id === me.id) ? true : false
  );
  const [hasFollowed, setHasFollowed] = useState(
    outfit.user.followers.find((user) => user.id === me.id) ? true : false
  );
  const [likeCount, setLikeCount] = useState(outfit.likes.users.length);
  const [saveCount, setSaveCount] = useState(outfit.saves.users.length);
  const [commentCount, setCommentCount] = useState(outfit.comments.length);

  const [showGallery, setShowGallery] = useState(false);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  useEffect(() => {
    setHasFollowed(
      outfit.user.followers.find((user) => user.id === me.id) ? true : false
    );
  }, [outfit.user.followers, me.id]);

  useEffect(() => {
    setCommentCount(outfit.comments.length);
  }, [outfit.comments, me.id]);

  const handleSwitchImage = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setShowOutfitImage((p) => !p);
  };

  const likeMutation = useMutation(() =>
    outfitService.likeOutfit(
      authState?.access_token ? authState.access_token : "",
      outfit.id
    )
  );

  const unlikeMutation = useMutation(() =>
    outfitService.unlikeOutfit(
      authState?.access_token ? authState.access_token : "",
      outfit.id
    )
  );

  const saveMutation = useMutation(() =>
    outfitService.saveOutfit(
      authState?.access_token ? authState.access_token : "",
      outfit.id
    )
  );

  const unsaveMutation = useMutation(() =>
    outfitService.unsaveOutfit(
      authState?.access_token ? authState.access_token : "",
      outfit.id
    )
  );

  const handleSave = () => {
    if (hasSaved) {
      setHasSaved(false);
      setSaveCount((p) => p - 1);
      unsaveMutation.mutate();
    } else {
      setHasSaved(true);
      setSaveCount((p) => p + 1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      saveMutation.mutate();
    }
  };

  const scaleDownLike = () => {
    Animated.timing(likeScaleValue, {
      toValue: 0.9,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const scaleUpLike = () => {
    Animated.timing(likeScaleValue, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const scaleDownSave = () => {
    Animated.timing(saveScaleValue, {
      toValue: 0.9,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const scaleUpSave = () => {
    Animated.timing(saveScaleValue, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const followMutation = useMutation(
    (user_id: string) =>
      userService.followUser(
        authState?.access_token ? authState.access_token : "",
        {
          user_id,
        }
      ),
    {
      onSuccess: () => {
        refetchOutfits();
      },
    }
  );

  const unfollowMutation = useMutation(
    (user_id: string) =>
      userService.unfollowUser(
        authState?.access_token ? authState.access_token : "",
        {
          user_id,
        }
      ),
    {
      onSuccess: () => {
        refetchOutfits();
      },
    }
  );

  const handleFollow = () => {
    if (hasFollowed) {
      setHasFollowed(false);
      unfollowMutation.mutate(outfit.user.id);
    } else {
      setHasFollowed(true);
      followMutation.mutate(outfit.user.id);
    }
  };

  const approvedOpacity = useRef(new Animated.Value(0)).current;
  const approvedX = useRef(new Animated.Value(-100)).current;

  const animateApprovedText = () => {
    approvedOpacity.setValue(0);
    approvedX.setValue(-100);

    Animated.sequence([
      Animated.parallel([
        Animated.timing(approvedOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.spring(approvedX, {
          toValue: 0,
          friction: 10,
          useNativeDriver: false,
        }),
      ]),
      Animated.delay(300),
      Animated.parallel([
        Animated.timing(approvedX, {
          toValue: 100,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(approvedOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }),
      ]),
    ]).start();
  };

  const handleLike = () => {
    if (hasLiked) {
      setHasLiked(false);
      setLikeCount((p) => p - 1);
      unlikeMutation.mutate();
    } else {
      setHasLiked(true);
      setLikeCount((p) => p + 1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      likeMutation.mutate();
      animateApprovedText();
    }
  };

  const lastTap = useRef<number | null>(null);

  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (lastTap.current && now - lastTap.current < DOUBLE_PRESS_DELAY) {
      if (!hasLiked) {
        handleLike();
      }
    }
    lastTap.current = now;
  };

  return (
    <Pressable
      style={{
        width: "100%",
        height: Dimensions.get("screen").height - insets.bottom,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 0,
      }}
      onPressIn={fadeOut}
      onPressOut={fadeIn}
      onPress={handleDoubleTap}
    >
      <Animated.Text
        style={{
          fontSize: 60,
          color: colors.white,
          opacity: approvedOpacity,
          transform: [{ translateX: approvedX }],
          position: "absolute",
          zIndex: 100,
          fontWeight: "900",
          fontStyle: "italic",
          padding: 10,
          backgroundColor: "rgba(0,0,0,1)",
        }}
      >
        Approved
      </Animated.Text>

      <Animated.View
        style={[
          {
            opacity: fadeAnim,
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 50,
          },
        ]}
      >
        <OutfitInfo
          followMutation={followMutation}
          unfollowMutation={unfollowMutation}
          outfit={outfit}
          me={me}
          navigation={navigation}
          handleFollow={handleFollow}
          handleLike={handleLike}
          handleSave={handleSave}
          likeCount={likeCount}
          hasLiked={hasLiked}
          hasSaved={hasSaved}
          likeMutation={likeMutation}
          saveMutation={saveMutation}
          saveCount={saveCount}
          scaleDownLike={scaleDownLike}
          likeScaleValue={likeScaleValue}
          saveScaleValue={saveScaleValue}
          scaleDownSave={scaleDownSave}
          scaleUpLike={scaleUpLike}
          scaleUpSave={scaleUpSave}
          scrollRef={scrollRef}
          setHashTag={setHashTag}
          setShowDescription={setShowDescription}
          showDescription={showDescription}
          unlikeMutation={unlikeMutation}
          unsaveMutation={unsaveMutation}
          hasFollowed={hasFollowed}
          commentCount={commentCount}
        />
      </Animated.View>

      {showGallery ? (
        <></>
      ) : (
        <>
          <Image
            source={{
              uri: outfit.outfit_images[currentImgIdx].image_url,
              cache: "force-cache",
            }}
            style={{
              width: "100%",
              height: "100%",
              zIndex: 10,
              shadowColor: "black",
              borderWidth: 0,
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: 0.5,
              shadowRadius: 5,
            }}
          />
        </>
      )}
    </Pressable>
  );
};

export default OutfitComponent;
