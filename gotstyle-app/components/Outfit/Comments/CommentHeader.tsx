import { FC } from "react";
import { Dimensions, View, Text, Pressable } from "react-native";
import useDarkTheme from "../../../hooks/useDarkTheme";
import { colors } from "../../../lib/util/colors";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface CommentHeaderProps {
  navigation: any;
}

const CommentHeader: FC<CommentHeaderProps> = ({ navigation }) => {
  const darkTheme = useDarkTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        position: "absolute",
        top: insets.top,
        height: "8%",
        width: Dimensions.get("window").width,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: darkTheme ? colors.black : colors.white,
      }}
    >
      <Pressable
        onPress={() => {
          navigation.goBack();
        }}
        style={{
          position: "absolute",
          left: "5%",
        }}
      >
        <Ionicons
          name="close"
          size={25}
          color={darkTheme ? colors.white : colors.black}
        />
      </Pressable>
      <Text
        style={{
          fontSize: 18,
          fontFamily: "bas-semibold",
          color: darkTheme ? colors.white : colors.black,
        }}
      >
        Comments
      </Text>
    </View>
  );
};

export default CommentHeader;
