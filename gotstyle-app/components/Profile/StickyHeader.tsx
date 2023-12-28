import { FC, RefObject } from "react";
import { Dimensions, Pressable, ScrollView, View } from "react-native";
import { colors } from "../../lib/util/colors";
import { Ionicons } from "@expo/vector-icons";
import useDarkTheme from "../../hooks/useDarkTheme";

interface StickyHeaderProps {
  showOutfits: boolean;
  showSavedOutfits: boolean;
  showLikedOutfits: boolean;
  setShowOutfits: (showOutfits: boolean) => void;
  setShowSavedOutfits: (showSavedOutfits: boolean) => void;
  setShowLikedOutfits: (showLikedOutfits: boolean) => void;
  scrollRef: RefObject<ScrollView>;
}

const StickyHeader: FC<StickyHeaderProps> = ({
  showOutfits,
  showSavedOutfits,
  showLikedOutfits,
  setShowOutfits,
  setShowSavedOutfits,
  setShowLikedOutfits,
  scrollRef,
}) => {
  const darkTheme = useDarkTheme();

  return (
    <View
      style={{
        height: 70,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        width: Dimensions.get("screen").width,
        backgroundColor: darkTheme ? colors.black : colors.white,
      }}
    >
      <Pressable
        onPress={() => {
          setShowOutfits(true);
          setShowSavedOutfits(false);
          setShowLikedOutfits(false);
          scrollRef.current?.scrollTo({
            x: 0,
            y: 0,
            animated: true,
          });
        }}
        style={{
          width: Dimensions.get("screen").width / 3,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons
          name={showOutfits ? "grid" : "grid-outline"}
          size={24}
          color={
            showOutfits
              ? darkTheme
                ? colors.white
                : colors.black
              : darkTheme
              ? "rgba(255,255,255,0.5)"
              : "rgba(0,0,0,0.5)"
          }
        />
      </Pressable>

      <Pressable
        onPress={() => {
          setShowOutfits(false);
          setShowSavedOutfits(true);
          setShowLikedOutfits(false);
          scrollRef.current?.scrollTo({
            x: Dimensions.get("screen").width,
            y: 0,
            animated: true,
          });
        }}
        style={{
          width: Dimensions.get("screen").width / 3,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons
          name={showSavedOutfits ? "bookmark" : "bookmark-outline"}
          size={24}
          color={
            showSavedOutfits
              ? darkTheme
                ? colors.white
                : colors.black
              : darkTheme
              ? "rgba(255,255,255,0.5)"
              : "rgba(0,0,0,0.5)"
          }
        />
      </Pressable>

      <Pressable
        onPress={() => {
          setShowOutfits(false);
          setShowSavedOutfits(false);
          setShowLikedOutfits(true);
          scrollRef.current?.scrollTo({
            x: Dimensions.get("screen").width * 2,
            y: 0,
            animated: true,
          });
        }}
        style={{
          width: Dimensions.get("screen").width / 3,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons
          name={showLikedOutfits ? "heart" : "heart-outline"}
          size={24}
          color={
            showLikedOutfits
              ? darkTheme
                ? colors.white
                : colors.black
              : darkTheme
              ? "rgba(255,255,255,0.5)"
              : "rgba(0,0,0,0.5)"
          }
        />
      </Pressable>
    </View>
  );
};

export default StickyHeader;
