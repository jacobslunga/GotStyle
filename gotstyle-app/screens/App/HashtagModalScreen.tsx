import { BlurView } from "expo-blur";
import React, { FC, useContext, useState, useRef, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  Animated,
  LayoutAnimation,
} from "react-native";
import { HashtagContext } from "../../context/HashtagContext";
import hashtags from "../../lib/util/hashtags";
import { colors } from "../../lib/util/colors";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

interface HashtagModalProps {
  navigation: any;
}

const HashtagModalScreen: FC<HashtagModalProps> = ({ navigation }) => {
  const { hashtag, setHashTag } = useContext(HashtagContext);
  const insets = useSafeAreaInsets();

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

  return (
    <BlurView
      tint="dark"
      intensity={90}
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        flexDirection: "column",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          width: Dimensions.get("screen").width,
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Pressable
          style={{
            marginTop: insets.top + 20,
            backgroundColor: colors.white,
            borderRadius: 99,
            padding: 10,
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 12,
            margin: 4,
          }}
          onPress={() => navigation.goBack()}
        >
          <Feather name="x" size={30} color={colors.black} />
        </Pressable>

        <Text
          style={{
            fontSize: 24,
            fontFamily: "bas-semibold",
            color: colors.white,
            marginTop: insets.top + 20,
            marginLeft: 12,
          }}
        >
          Select a hashtag
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          width: Dimensions.get("screen").width,
        }}
      >
        {hashtags.map((section) => (
          <View
            key={section.title}
            style={{
              width: Dimensions.get("screen").width,
              paddingHorizontal: "5%",
              marginTop: 20,
              alignItems: "flex-start",
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
                    color: colors.white,
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
                  color={colors.white}
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
                          backgroundColor: "rgba(255,255,255,0.1)",
                        },
                      ]}
                      onPress={() => {
                        setHashTag(item);
                        navigation.goBack();
                      }}
                    >
                      {hashtag === item && (
                        <LinearGradient
                          colors={["#FFA1F5", "#FF9B82"]}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            zIndex: -1,
                            borderRadius: 99,
                            bottom: 0,
                          }}
                          start={{ x: 0, y: 1 }}
                          end={{ x: 1, y: -1 }}
                        />
                      )}

                      <Text
                        style={[
                          {
                            ...styles.item,
                            color: colors.white,
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
            marginBottom: 100,
          }}
        />
      </ScrollView>
    </BlurView>
  );
};

export default HashtagModalScreen;

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    padding: 8,
    fontFamily: "bas-semibold",
  },
  wrapContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
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
    fontFamily: "bas-regular",
  },
});
