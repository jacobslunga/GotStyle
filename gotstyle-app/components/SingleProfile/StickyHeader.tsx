import { FC, RefObject } from "react";
import { Dimensions, Pressable, ScrollView, View } from "react-native";
import { colors } from "../../lib/util/colors";
import { Ionicons } from "@expo/vector-icons";
import useDarkTheme from "../../hooks/useDarkTheme";

interface StickyHeaderProps {}

const StickyHeader: FC<StickyHeaderProps> = ({}) => {
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
        style={{
          width: Dimensions.get("screen").width / 3,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons
          name="grid"
          size={24}
          color={darkTheme ? colors.white : colors.black}
        />
      </Pressable>
    </View>
  );
};

export default StickyHeader;
