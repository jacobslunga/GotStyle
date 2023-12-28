import { FC } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { User } from "../../lib/types";
import useDarkTheme from "../../hooks/useDarkTheme";
import { colors } from "../../lib/util/colors";
import { useQuery } from "react-query";

interface HashtagSearchProps {
  hashtag: string;
  me: User;
}

const HashtagSearch: FC<HashtagSearchProps> = ({ hashtag, me }) => {
  const darkTheme = useDarkTheme();

  // const {} = useQuery(["hashtag", hashtag], () =>);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: darkTheme ? colors.black : colors.white,
      }}
    >
      <View style={styles.container}></View>
    </SafeAreaView>
  );
};

export default HashtagSearch;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
