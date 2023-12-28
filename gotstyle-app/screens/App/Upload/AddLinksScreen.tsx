import { FC, useContext, useRef, useState, useMemo } from "react";
import {
  View,
  Pressable,
  Text,
  Dimensions,
  SafeAreaView,
  Image,
  PanResponder,
} from "react-native";
import useDarkTheme from "../../../hooks/useDarkTheme";
import { SelectedOutfitsContext } from "../../../context/SelectedOutfits";
import { colors } from "../../../lib/util/colors";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { OutfitLinksContext } from "../../../context/OutfitLinks";
import * as WebBrowser from "expo-web-browser";

interface AddLinksScreenProps {
  navigation: any;
}

const Header = ({
  navigation,
  setShowPreview,
  showPreview,
  selectedOutfits,
}: {
  navigation: any;
  setShowPreview: any;
  showPreview: any;
  selectedOutfits: any;
}) => {
  const darkTheme = useDarkTheme();

  return (
    <BlurView
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
      tint={darkTheme ? "dark" : "light"}
      intensity={70}
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
        Add Links
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          right: "2%",
        }}
      >
        <Pressable
          onPress={() => {
            navigation.navigate("AddLink", {
              editLink: null,
            });
          }}
          style={{
            alignItems: "center",
            justifyContent: "center",
            padding: 5,
          }}
          disabled={typeof selectedOutfits[0] === "undefined"}
        >
          <Feather
            name="plus"
            size={30}
            color={
              typeof selectedOutfits[0] === "undefined"
                ? darkTheme
                  ? "rgba(255,255,255,0.3)"
                  : "rgba(0,0,0,0.3)"
                : darkTheme
                ? colors.white
                : colors.black
            }
          />
        </Pressable>
        <Pressable
          onPress={() => {
            setShowPreview((p: boolean) => !p);
          }}
          style={{
            alignItems: "center",
            justifyContent: "center",
            padding: 5,
            marginLeft: 10,
          }}
          disabled={typeof selectedOutfits[0] === "undefined"}
        >
          <Feather
            name={showPreview ? "eye-off" : "eye"}
            size={30}
            color={
              typeof selectedOutfits[0] === "undefined"
                ? darkTheme
                  ? "rgba(255,255,255,0.3)"
                  : "rgba(0,0,0,0.3)"
                : darkTheme
                ? colors.white
                : colors.black
            }
          />
        </Pressable>
      </View>
    </BlurView>
  );
};

const AddLinksScreen: FC<AddLinksScreenProps> = ({ navigation }) => {
  const darkTheme = useDarkTheme();
  const insets = useSafeAreaInsets();
  const [showPreview, setShowPreview] = useState(false);

  const { outfitLinks } = useContext(OutfitLinksContext);
  const { selectedOutfits } = useContext(SelectedOutfitsContext);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: insets.top,
        backgroundColor: darkTheme ? "#000" : "#fff",
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent:
            typeof selectedOutfits[0] === "undefined" ||
            outfitLinks.length === 0
              ? "center"
              : "flex-start",
          alignItems:
            typeof selectedOutfits[0] === "undefined" ||
            outfitLinks.length === 0
              ? "center"
              : "flex-start",
          backgroundColor: darkTheme ? "#000" : "#fff",
          paddingTop:
            typeof selectedOutfits[0] === "undefined" ||
            outfitLinks.length === 0
              ? 0
              : insets.top + 70,
          paddingHorizontal: 20,
          height: Dimensions.get("screen").height,
        }}
      >
        {showPreview ? (
          <>
            <Image
              style={{
                width: Dimensions.get("screen").width,
                height: Dimensions.get("screen").height,
                position: "absolute",
              }}
              source={{
                uri: selectedOutfits[0].uri,
                cache: "force-cache",
              }}
            />

            {outfitLinks.map((item: any, index: any) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: colors.white,
                    fontFamily: "bas-medium",
                    fontSize: 16,
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    marginRight: 10,
                  }}
                >
                  {index + 1}.
                </Text>
                <Pressable
                  onPress={() => {
                    WebBrowser.openBrowserAsync(item.link);
                  }}
                >
                  <Text
                    style={{
                      color: colors.white,
                      fontFamily: "bas-medium",
                      fontSize: 16,
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                      textDecorationLine: "underline",
                    }}
                  >
                    {item.description}
                  </Text>
                </Pressable>
              </View>
            ))}
          </>
        ) : (
          <>
            {outfitLinks.length === 0 &&
              typeof selectedOutfits[0] !== "undefined" && (
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    <Feather
                      name="star"
                      color={
                        darkTheme ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"
                      }
                      size={60}
                    />
                    <Feather
                      name="link-2"
                      color={
                        darkTheme ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"
                      }
                      size={60}
                    />
                  </View>

                  <Text
                    style={{
                      fontFamily: "bas-bold",
                      fontSize: 20,
                      color: darkTheme ? colors.white : colors.black,
                      textAlign: "center",
                      marginTop: 20,
                    }}
                  >
                    Let's add some links to your outfit so people can shop your
                    look!
                  </Text>

                  <Text
                    style={{
                      fontFamily: "bas-regular",
                      fontSize: 15,
                      color: darkTheme
                        ? "rgba(255,255,255,0.4)"
                        : "rgba(0,0,0,0.4)",
                      marginTop: 20,
                    }}
                  >
                    <Text
                      style={{
                        color: darkTheme ? colors.white : colors.black,
                        fontFamily: "bas-bold",
                        position: "absolute",
                        bottom: 20,
                      }}
                    >
                      NOTE:
                    </Text>{" "}
                    Prefferably you only upload one outfit with multiple angles
                    so that the links are consistent. (The links will only
                    appear on the first image)
                  </Text>
                </>
              )}

            {outfitLinks.map((link: any, i: number) => (
              <View
                key={link.link + String(i)}
                style={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  marginBottom: 20,
                  width: "100%",
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexDirection: "row",
                    width: "100%",
                  }}
                >
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "row",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "bas-bold",
                        fontSize: 12,
                        color: darkTheme ? colors.white : colors.black,
                        marginRight: 10,
                      }}
                    >
                      {i + 1}.
                    </Text>
                    <Text
                      style={{
                        fontFamily: "bas-semibold",
                        fontSize: 20,
                        color: darkTheme ? colors.white : colors.black,
                      }}
                    >
                      {link.description}
                    </Text>
                  </View>

                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "row",
                    }}
                  >
                    <Pressable
                      style={{
                        marginLeft: 10,
                      }}
                    >
                      <Feather
                        name="edit"
                        size={20}
                        color={
                          darkTheme
                            ? "rgba(255,255,255,0.4)"
                            : "rgba(0,0,0,0.4)"
                        }
                      />
                    </Pressable>
                    <Pressable
                      style={{
                        marginLeft: 10,
                      }}
                    >
                      <Feather
                        name="trash"
                        size={20}
                        color={
                          darkTheme
                            ? "rgba(255,255,255,0.4)"
                            : "rgba(0,0,0,0.4)"
                        }
                      />
                    </Pressable>
                  </View>
                </View>
                <Text
                  style={{
                    color: colors.blue,
                    fontFamily: "bas-regular",
                    fontSize: 14,
                    textDecorationLine: "underline",
                    marginLeft: 20,
                  }}
                >
                  {link.link.trim()}
                </Text>
              </View>
            ))}
          </>
        )}

        {typeof selectedOutfits[0] === "undefined" && (
          <Text
            style={{
              fontFamily: "bas-semibold",
              fontSize: 16,
              color: darkTheme ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
              textAlign: "center",
            }}
          >
            You need to capture your outfit before you can add links to it.
          </Text>
        )}

        <Header
          navigation={navigation}
          setShowPreview={setShowPreview}
          showPreview={showPreview}
          selectedOutfits={selectedOutfits}
        />
      </View>
    </SafeAreaView>
  );
};

export default AddLinksScreen;
