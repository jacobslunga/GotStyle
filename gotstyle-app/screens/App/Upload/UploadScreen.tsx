import { FC, useContext, useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
  TextInput,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Animated,
  LayoutAnimation,
} from "react-native";
import useDarkTheme from "../../../hooks/useDarkTheme";
import { colors } from "../../../lib/util/colors";
import { useMutation, useQuery } from "react-query";
import { outfitService } from "../../../api/outfits";
import { useAuth } from "../../../context/AuthContext";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import hashtags from "../../../lib/util/hashtags";
import { userService } from "../../../api/users";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SelectedOutfitsContext } from "../../../context/SelectedOutfits";
import { OutfitLinksContext } from "../../../context/OutfitLinks";

interface UploadProps {
  navigation: any;
}

const Header = ({
  navigation,
  setOutfitLinks,
  setSelectedOutfits,
}: {
  navigation: any;
  setOutfitLinks: any;
  setSelectedOutfits: any;
}) => {
  const darkTheme = useDarkTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        width: Dimensions.get("screen").width,
        backgroundColor: darkTheme ? colors.black : colors.white,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: insets.top,
        zIndex: 100,
        padding: 10,
      }}
    >
      <Pressable
        onPress={() => {
          setOutfitLinks([]);
          setSelectedOutfits([]);
          navigation.goBack();
        }}
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: 5,
          position: "absolute",
          left: "2%",
        }}
      >
        <Feather
          name="x"
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
        Upload your outfit
      </Text>

      <Pressable
        onPress={() => navigation.navigate("AddLinks")}
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: 5,
          position: "absolute",
          right: "2%",
        }}
      >
        <Feather
          name="link"
          size={30}
          color={darkTheme ? colors.white : colors.black}
        />
      </Pressable>
    </View>
  );
};

const UploadScreen: FC<UploadProps> = ({ navigation }) => {
  const darkTheme = useDarkTheme();
  const { authState }: any = useAuth();
  const insets = useSafeAreaInsets();

  const [caption, setCaption] = useState<string>("");
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedHashTags, setSelectedHashTags] = useState<string[]>([]);

  const { setSelectedOutfits, selectedOutfits } = useContext(
    SelectedOutfitsContext
  );

  const { outfitLinks, setOutfitLinks } = useContext(OutfitLinksContext);

  const { refetch: refetchOutfits } = useQuery("outfits", () =>
    outfitService.getOutfits(authState.access_token)
  );

  const { refetch: refetchMe } = useQuery("me", () =>
    userService.getMe(authState.access_token)
  );

  const uploadMutation = useMutation(outfitService.uploadOutfit, {
    onSuccess: () => {
      setLoading(false);
      refetchMe();
      setCaption("");
      setSelectedStyle("");
      setSelectedOutfits([]);
      refetchOutfits().then(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleUpload = async () => {
    setLoading(true);
    if (selectedOutfits.length === 0) {
      return;
    }
    uploadMutation.mutate({
      description: caption,
      style: selectedStyle,
      hashtags: selectedHashTags,
      access_token: authState?.access_token ? authState.access_token : "",
      outfit_links: outfitLinks,
      outfit_images: selectedOutfits.map((outfit) => outfit.base64),
    });
  };

  const [expandedSections, setExpandedSections]: any = useState({});

  const rotationValues: any = useRef({});

  useEffect(() => {
    hashtags.forEach((section: any) => {
      rotationValues.current[section.title] = new Animated.Value(0);
    });
  }, []);

  const toggleSection = (sectionTitle: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    setExpandedSections((prevState: any) => {
      const newState = {
        ...prevState,
        [sectionTitle]: !prevState[sectionTitle],
      };

      Animated.timing(rotationValues.current[sectionTitle], {
        toValue: newState[sectionTitle] ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start();

      return newState;
    });
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: darkTheme ? colors.black : colors.white,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="small" />
        <Text
          style={{
            color: darkTheme ? colors.white : colors.black,
            fontWeight: "bold",
            fontSize: 16,
            marginTop: 20,
          }}
        >
          Uploading...
        </Text>
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
      <Header
        navigation={navigation}
        setSelectedOutfits={setSelectedOutfits}
        setOutfitLinks={setOutfitLinks}
      />

      <View
        style={{
          height: "20%",
          position: "absolute",
          bottom: 0,
          backgroundColor: "transparent",
          width: "100%",
          zIndex: 100,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LinearGradient
          colors={[
            darkTheme ? "rgba(0,0,0,0)" : "rgba(255,255,255,0)",
            darkTheme ? "#000" : "#fff",
          ]}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: "100%",
            width: "100%",
          }}
        />
        <Pressable
          onPress={handleUpload}
          style={{
            backgroundColor:
              typeof selectedOutfits[0] !== "undefined"
                ? colors.primary
                : darkTheme
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.1)",
            height: 50,
            borderRadius: 15,
            alignItems: "center",
            justifyContent: "center",
            width: "90%",
            shadowColor: colors.primary,
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.7,
            shadowRadius: 100,
          }}
          disabled={typeof selectedOutfits[0] === "undefined"}
        >
          <Text
            style={{
              color:
                typeof selectedOutfits[0] !== "undefined"
                  ? colors.white
                  : darkTheme
                  ? "rgba(255,255,255,0.3)"
                  : "rgba(0,0,0,0.3)",
              fontFamily: "bas-semibold",
              fontSize: 16,
            }}
          >
            Upload
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[
          {
            ...styles.container,
            backgroundColor: darkTheme ? colors.black : colors.white,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <StatusBar style={darkTheme ? "light" : "dark"} />
        <View
          style={{
            width: Dimensions.get("screen").width,
            flexDirection: "column",
            alignItems: "flex-start",
            paddingHorizontal: "5%",
            marginTop: insets.top + 70,
          }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            {typeof selectedOutfits[0] !== "undefined" ? (
              <View
                style={{
                  width: 120,
                  height: 120,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 20,
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    zIndex: 100,
                    backgroundColor: "rgba(0,0,0,0.3)",
                    borderRadius: 20,
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                  }}
                >
                  <Pressable
                    onPress={() => {
                      navigation.navigate("TakeOutfit", { index: 0 });
                    }}
                    style={{
                      marginRight: 10,
                    }}
                  >
                    <Feather name="edit-3" size={24} color={colors.white} />
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      setSelectedOutfits((prevState) =>
                        prevState.filter(
                          (outfit) => outfit.uri !== selectedOutfits[0].uri
                        )
                      );
                    }}
                    style={{
                      marginLeft: 10,
                    }}
                  >
                    <Feather name="trash" size={24} color={colors.white} />
                  </Pressable>
                </View>

                <Image
                  source={{ uri: selectedOutfits[0].uri }}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 20,
                  }}
                />
              </View>
            ) : (
              <Pressable
                style={{
                  borderWidth: 1,
                  borderColor: darkTheme
                    ? "rgba(255,255,255,0.5)"
                    : "rgba(0,0,0,0.5)",
                  borderStyle: "dashed",
                  width: 120,
                  height: 120,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 20,
                }}
                onPress={() => {
                  navigation.navigate("TakeOutfit", { index: 0 });
                }}
              >
                <Feather
                  name="plus"
                  size={40}
                  color={darkTheme ? colors.white : colors.black}
                />
                <Text
                  style={{
                    color: darkTheme ? colors.white : colors.black,
                    fontFamily: "bas-medium",
                    fontSize: 12,
                    marginTop: 5,
                  }}
                >
                  Outfit 1
                </Text>
              </Pressable>
            )}

            {typeof selectedOutfits[1] !== "undefined" ? (
              <View
                style={{
                  width: 120,
                  height: 120,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 20,
                  marginLeft: 20,
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    zIndex: 100,
                    backgroundColor: "rgba(0,0,0,0.3)",
                    borderRadius: 20,
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                  }}
                >
                  <Pressable
                    onPress={() => {
                      navigation.navigate("TakeOutfit", { index: 1 });
                    }}
                    style={{
                      marginRight: 10,
                    }}
                  >
                    <Feather name="edit-3" size={24} color={colors.white} />
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      setSelectedOutfits((prevState) =>
                        prevState.filter(
                          (outfit) => outfit.uri !== selectedOutfits[1].uri
                        )
                      );
                    }}
                    style={{
                      marginLeft: 10,
                    }}
                  >
                    <Feather name="trash" size={24} color={colors.white} />
                  </Pressable>
                </View>

                <Image
                  source={{ uri: selectedOutfits[1].uri }}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 20,
                  }}
                />
              </View>
            ) : (
              <Pressable
                style={{
                  borderWidth: 1,
                  borderColor: darkTheme
                    ? "rgba(255,255,255,0.5)"
                    : "rgba(0,0,0,0.5)",
                  borderStyle: "dashed",
                  width: 120,
                  height: 120,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 20,
                  marginLeft: 20,
                }}
                onPress={() => {
                  navigation.navigate("TakeOutfit", { index: 1 });
                }}
              >
                <Feather
                  name="plus"
                  size={40}
                  color={darkTheme ? colors.white : colors.black}
                />
                <Text
                  style={{
                    color: darkTheme ? colors.white : colors.black,
                    fontFamily: "bas-medium",
                    fontSize: 12,
                    marginTop: 5,
                  }}
                >
                  Outfit 2
                </Text>
              </Pressable>
            )}

            {typeof selectedOutfits[2] !== "undefined" ? (
              <View
                style={{
                  width: 120,
                  height: 120,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 20,
                  marginLeft: 20,
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    zIndex: 100,
                    backgroundColor: "rgba(0,0,0,0.3)",
                    borderRadius: 20,
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                  }}
                >
                  <Pressable
                    onPress={() => {
                      navigation.navigate("TakeOutfit", { index: 2 });
                    }}
                    style={{
                      marginRight: 10,
                    }}
                  >
                    <Feather name="edit-3" size={24} color={colors.white} />
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      setSelectedOutfits((prevState) =>
                        prevState.filter(
                          (outfit) => outfit.uri !== selectedOutfits[2].uri
                        )
                      );
                    }}
                    style={{
                      marginLeft: 10,
                    }}
                  >
                    <Feather name="trash" size={24} color={colors.white} />
                  </Pressable>
                </View>

                <Image
                  source={{ uri: selectedOutfits[2].uri }}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 20,
                  }}
                />
              </View>
            ) : (
              <Pressable
                style={{
                  borderWidth: 1,
                  borderColor: darkTheme
                    ? "rgba(255,255,255,0.5)"
                    : "rgba(0,0,0,0.5)",
                  borderStyle: "dashed",
                  width: 120,
                  height: 120,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 20,
                  marginLeft: 20,
                }}
                onPress={() => {
                  navigation.navigate("TakeOutfit", { index: 2 });
                }}
              >
                <Feather
                  name="plus"
                  size={40}
                  color={darkTheme ? colors.white : colors.black}
                />
                <Text
                  style={{
                    color: darkTheme ? colors.white : colors.black,
                    fontFamily: "bas-medium",
                    fontSize: 12,
                    marginTop: 5,
                  }}
                >
                  Outfit 3
                </Text>
              </Pressable>
            )}

            {typeof selectedOutfits[3] !== "undefined" ? (
              <View
                style={{
                  width: 120,
                  height: 120,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 20,
                  marginLeft: 20,
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    zIndex: 100,
                    backgroundColor: "rgba(0,0,0,0.3)",
                    borderRadius: 20,
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                  }}
                >
                  <Pressable
                    onPress={() => {
                      navigation.navigate("TakeOutfit", { index: 3 });
                    }}
                    style={{
                      marginRight: 10,
                    }}
                  >
                    <Feather name="edit-3" size={24} color={colors.white} />
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      setSelectedOutfits((prevState) =>
                        prevState.filter(
                          (outfit) => outfit.uri !== selectedOutfits[3].uri
                        )
                      );
                    }}
                    style={{
                      marginLeft: 10,
                    }}
                  >
                    <Feather name="trash" size={24} color={colors.white} />
                  </Pressable>
                </View>

                <Image
                  source={{ uri: selectedOutfits[3].uri }}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 20,
                  }}
                />
              </View>
            ) : (
              <Pressable
                style={{
                  borderWidth: 1,
                  borderColor: darkTheme
                    ? "rgba(255,255,255,0.5)"
                    : "rgba(0,0,0,0.5)",
                  borderStyle: "dashed",
                  width: 120,
                  height: 120,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 20,
                  marginLeft: 20,
                }}
                onPress={() => {
                  navigation.navigate("TakeOutfit", { index: 3 });
                }}
              >
                <Feather
                  name="plus"
                  size={40}
                  color={darkTheme ? colors.white : colors.black}
                />
                <Text
                  style={{
                    color: darkTheme ? colors.white : colors.black,
                    fontFamily: "bas-medium",
                    fontSize: 12,
                    marginTop: 5,
                  }}
                >
                  Outfit 4
                </Text>
              </Pressable>
            )}

            {typeof selectedOutfits[4] !== "undefined" ? (
              <View
                style={{
                  width: 120,
                  height: 120,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 20,
                  marginLeft: 20,
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    zIndex: 100,
                    backgroundColor: "rgba(0,0,0,0.3)",
                    borderRadius: 20,
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                  }}
                >
                  <Pressable
                    onPress={() => {
                      navigation.navigate("TakeOutfit", { index: 4 });
                    }}
                    style={{
                      marginRight: 10,
                    }}
                  >
                    <Feather name="edit-3" size={24} color={colors.white} />
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      setSelectedOutfits((prevState) =>
                        prevState.filter(
                          (outfit) => outfit.uri !== selectedOutfits[4].uri
                        )
                      );
                    }}
                    style={{
                      marginLeft: 10,
                    }}
                  >
                    <Feather name="trash" size={24} color={colors.white} />
                  </Pressable>
                </View>

                <Image
                  source={{ uri: selectedOutfits[4].uri }}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 20,
                  }}
                />
              </View>
            ) : (
              <Pressable
                style={{
                  borderWidth: 1,
                  borderColor: darkTheme
                    ? "rgba(255,255,255,0.5)"
                    : "rgba(0,0,0,0.5)",
                  borderStyle: "dashed",
                  width: 120,
                  height: 120,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 20,
                  marginLeft: 20,
                }}
                onPress={() => {
                  navigation.navigate("TakeOutfit", { index: 4 });
                }}
              >
                <Feather
                  name="plus"
                  size={40}
                  color={darkTheme ? colors.white : colors.black}
                />
                <Text
                  style={{
                    color: darkTheme ? colors.white : colors.black,
                    fontFamily: "bas-medium",
                    fontSize: 12,
                    marginTop: 5,
                  }}
                >
                  Outfit 5
                </Text>
              </Pressable>
            )}

            {typeof selectedOutfits[5] !== "undefined" ? (
              <View
                style={{
                  width: 120,
                  height: 120,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 20,
                  marginLeft: 20,
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    zIndex: 100,
                    backgroundColor: "rgba(0,0,0,0.3)",
                    borderRadius: 20,
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                  }}
                >
                  <Pressable
                    onPress={() => {
                      navigation.navigate("TakeOutfit", { index: 5 });
                    }}
                    style={{
                      marginRight: 10,
                    }}
                  >
                    <Feather name="edit-3" size={24} color={colors.white} />
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      setSelectedOutfits((prevState) =>
                        prevState.filter(
                          (outfit) => outfit.uri !== selectedOutfits[5].uri
                        )
                      );
                    }}
                    style={{
                      marginLeft: 10,
                    }}
                  >
                    <Feather name="trash" size={24} color={colors.white} />
                  </Pressable>
                </View>

                <Image
                  source={{ uri: selectedOutfits[5].uri }}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 20,
                  }}
                />
              </View>
            ) : (
              <Pressable
                style={{
                  borderWidth: 1,
                  borderColor: darkTheme
                    ? "rgba(255,255,255,0.5)"
                    : "rgba(0,0,0,0.5)",
                  borderStyle: "dashed",
                  width: 120,
                  height: 120,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 20,
                  marginLeft: 20,
                }}
                onPress={() => {
                  navigation.navigate("TakeOutfit", { index: 5 });
                }}
              >
                <Feather
                  name="plus"
                  size={40}
                  color={darkTheme ? colors.white : colors.black}
                />
                <Text
                  style={{
                    color: darkTheme ? colors.white : colors.black,
                    fontFamily: "bas-medium",
                    fontSize: 12,
                    marginTop: 5,
                  }}
                >
                  Outfit 6
                </Text>
              </Pressable>
            )}
          </ScrollView>

          <View
            style={{
              width: "100%",
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            <TextInput
              placeholder="Write a caption..."
              multiline={true}
              value={caption}
              placeholderTextColor={
                darkTheme ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)"
              }
              onChangeText={(text) => setCaption(text)}
              style={{
                color: darkTheme ? colors.white : colors.black,
                fontSize: 14,
                fontFamily: "bas-medium",
              }}
              maxLength={200}
              selectionColor={darkTheme ? colors.white : colors.black}
            />
          </View>
        </View>

        <Text
          style={{
            fontFamily: "bas-semibold",
            fontSize: 24,
            color: darkTheme ? colors.white : colors.black,
            marginLeft: "5%",
            marginTop: 20,
          }}
        >
          <Feather
            name="link"
            size={24}
            color={darkTheme ? colors.white : colors.black}
          />{" "}
          Links
        </Text>
        <View
          style={{
            width: Dimensions.get("screen").width,
            marginTop: 20,
            alignItems: "flex-start",
            paddingHorizontal: "5%",
            flexDirection: "column",
          }}
        >
          {outfitLinks.length > 0 ? (
            <>
              {outfitLinks.map((link: any, index: number) => (
                <View
                  key={link.link + String(index)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 10,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "bas-bold",
                      fontSize: 16,
                      color: darkTheme ? colors.white : colors.black,
                      marginRight: 10,
                    }}
                  >
                    {index + 1}.
                  </Text>
                  <Text
                    style={{
                      fontFamily: "bas-regular",
                      fontSize: 16,
                      color: darkTheme ? colors.white : colors.black,
                    }}
                  >
                    {link.description}
                  </Text>
                </View>
              ))}
            </>
          ) : (
            <>
              <Text
                style={{
                  fontFamily: "bas-medium",
                  fontSize: 14,
                  color: darkTheme ? colors.white : colors.black,
                }}
              >
                No links added
              </Text>
              <Text
                style={{
                  fontFamily: "bas-medium",
                  fontSize: 14,
                  color: darkTheme
                    ? "rgba(255,255,255,0.5)"
                    : "rgba(0,0,0,0.5)",
                  marginTop: 10,
                  marginBottom: 20,
                }}
              >
                Add links to your outfits to help your followers find the items
                you're wearing
              </Text>
            </>
          )}
        </View>

        <View
          style={{
            height: 1,
            width: "90%",
            backgroundColor: darkTheme
              ? "rgba(255,255,255,0.2)"
              : "rgba(0,0,0,0.2)",
            marginVertical: 20,
            alignSelf: "center",
          }}
        />

        <Text
          style={{
            fontFamily: "bas-semibold",
            fontSize: 24,
            color: darkTheme ? colors.white : colors.black,
            marginLeft: "5%",
            marginTop: 20,
          }}
        >
          # Hashtags
        </Text>
        {hashtags.map((section) => (
          <View
            key={section.title}
            style={{
              width: Dimensions.get("screen").width,
              marginTop: 20,
              alignItems: "flex-start",
              paddingHorizontal: "5%",
            }}
          >
            <Pressable
              style={{
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
              }}
              onPress={() => {
                toggleSection(section.title);
              }}
            >
              <Text
                style={[
                  {
                    ...styles.header,
                    color: darkTheme ? colors.white : colors.black,
                  },
                ]}
              >
                {section.title}
              </Text>
              <Animated.View
                style={{
                  transform: [
                    {
                      rotate: rotationValues.current[section.title]
                        ? rotationValues.current[section.title].interpolate({
                            inputRange: [0, 1],
                            outputRange: ["0deg", "90deg"],
                          })
                        : "0deg",
                    },
                  ],
                }}
              >
                <Feather
                  name={"chevron-right"}
                  size={24}
                  color={darkTheme ? colors.white : colors.black}
                  style={{
                    marginLeft: 4,
                  }}
                />
              </Animated.View>
            </Pressable>
            <View style={styles.wrapContainer}>
              {expandedSections[section.title] && (
                <>
                  {section.data.map((item) => (
                    <Pressable
                      key={item}
                      style={[
                        {
                          ...styles.tag,
                          overflow: "hidden",
                          backgroundColor: selectedHashTags.includes(item)
                            ? colors.primary
                            : darkTheme
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(0,0,0,0.1)",
                        },
                      ]}
                      onPress={() => {
                        if (selectedHashTags.includes(item)) {
                          setSelectedHashTags((prevState) =>
                            prevState.filter((tag) => tag !== item)
                          );
                        } else {
                          setSelectedHashTags((prevState) => [
                            ...prevState,
                            item,
                          ]);
                        }
                      }}
                    >
                      <Text
                        style={[
                          {
                            ...styles.item,
                            color: selectedHashTags.includes(item)
                              ? colors.white
                              : darkTheme
                              ? colors.white
                              : colors.black,
                          },
                        ]}
                      >
                        {item}
                      </Text>
                    </Pressable>
                  ))}
                </>
              )}
            </View>
          </View>
        ))}
        <View
          style={{
            marginBottom: 150,
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default UploadScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
  },
  header: {
    fontSize: 18,
    padding: 8,
    fontFamily: "bas-medium",
  },
  wrapContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: "#e5e5e5",
    borderRadius: 12,
    margin: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  item: {
    fontSize: 14,
  },
});
