import { FC, useContext, useEffect, useState } from "react";
import { View, TextInput, Text, Pressable, Dimensions } from "react-native";
import { colors } from "../../../lib/util/colors";
import { OutfitLinksContext } from "../../../context/OutfitLinks";
import { Feather } from "@expo/vector-icons";
import useDarkTheme from "../../../hooks/useDarkTheme";

interface AddLinkScreenProps {
  navigation: any;
  route: any;
}

const Header = ({ navigation }: { navigation: any }) => {
  const darkTheme = useDarkTheme();

  return (
    <View
      style={{
        width: Dimensions.get("screen").width,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        zIndex: 100,
        backgroundColor: darkTheme
          ? "rgba(0,0,0,0.5)"
          : "rgba(255,255,255,0.5)",
        top: 0,
        padding: 20,
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
          name="chevron-down"
          size={30}
          color={darkTheme ? colors.white : colors.black}
        />
      </Pressable>

      <Text
        style={{
          color: darkTheme ? colors.white : colors.black,
          fontFamily: "bas-semibold",
          fontSize: 16,
        }}
      >
        Add a Link
      </Text>
    </View>
  );
};

const AddLinkScreen: FC<AddLinkScreenProps> = ({ navigation, route }) => {
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [isValidLink, setIsValidLink] = useState(false);

  const darkTheme = useDarkTheme();

  const { setOutfitLinks } = useContext(OutfitLinksContext);

  const { editLink } = route.params;

  function isValidUrl(url: string): boolean {
    const urlRegex =
      /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i;
    return urlRegex.test(url);
  }

  useEffect(() => {
    setIsValidLink(isValidUrl(link));
  }, [link]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: darkTheme ? colors.black : colors.white,
        alignItems: "flex-start",
        justifyContent: "flex-start",
        paddingTop: 100,
      }}
    >
      <Header navigation={navigation} />

      <TextInput
        style={{
          fontSize: 30,
          padding: 10,
          width: "100%",
          paddingHorizontal: 20,
          fontFamily: "bas-medium",
          color: darkTheme ? colors.white : colors.black,
        }}
        placeholder="Description"
        onChangeText={(text) => setDescription(text)}
        value={description}
        autoFocus
        selectionColor={darkTheme ? colors.white : colors.black}
      />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 20,
          width: "100%",
          marginTop: 20,
        }}
      >
        <Feather
          name="link"
          color={darkTheme ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"}
          size={30}
          style={{
            marginRight: 10,
          }}
        />
        <TextInput
          style={{
            fontSize: 17,
            padding: 10,
            color: colors.blue,
            flexGrow: 1,
            borderBottomWidth: 1,
            borderBottomColor: darkTheme
              ? "rgba(255,255,255,0.4)"
              : "rgba(0,0,0,0.4)",
            fontFamily: "bas-regular",
          }}
          placeholder="Link"
          onChangeText={(text) => setLink(text)}
          value={link}
          selectionColor={darkTheme ? colors.white : colors.black}
        />
      </View>

      <Pressable
        style={{
          alignItems: "flex-end",
          justifyContent: "flex-end",
          width: "100%",
          paddingHorizontal: 20,
          marginTop: 20,
        }}
        disabled={!isValidLink || !description || !link}
        onPress={() => {
          if (isValidLink) {
            setOutfitLinks((links: any) => {
              if (editLink) {
                const newLinks = links.map((mLink: any) => {
                  if (link === editLink.link) {
                    return {
                      ...mLink,
                      description,
                      link,
                    };
                  }
                  return mLink;
                });
                return newLinks;
              }
              return [
                ...links,
                {
                  description,
                  link,
                },
              ];
            });
          }
          navigation.goBack();
        }}
      >
        <Text
          style={{
            color:
              !isValidLink || !description || !link
                ? darkTheme
                  ? "rgba(255,255,255,0.3)"
                  : "rgba(0,0,0,0.3)"
                : colors.blue,
            fontFamily: "bas-bold",
            fontSize: 16,
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}
        >
          Add
        </Text>
      </Pressable>
    </View>
  );
};

export default AddLinkScreen;
