import React, { FC, useContext } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Pressable,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { colors } from "../../../lib/util/colors";
import { LinearGradient } from "expo-linear-gradient";
import { SelectedOutfitsContext } from "../../../context/SelectedOutfits";
import * as ImagePicker from "expo-image-picker";

interface SelectedOutfitsProps {
  navigation: any;
}

const getCurrentDay = (): string => {
  const date = new Date();
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthName = monthNames[monthIndex];

  return `Outfits for ${day} ${monthName}`;
};

const Header = ({
  navigation,
  setSelectedOutfits,
}: {
  navigation: any;
  setSelectedOutfits: React.Dispatch<
    React.SetStateAction<{ uri: string; base64: string }[]>
  >;
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        width: Dimensions.get("screen").width,
        backgroundColor: "transparent",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: insets.top,
        zIndex: 10000,
      }}
    >
      <Pressable
        onPress={() => {
          setSelectedOutfits([]);
          navigation.goBack();
        }}
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: 5,
          backgroundColor: "transparent",
          shadowColor: "rgba(0, 0, 0, 0.5)",
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 10,
          shadowRadius: 5,
          position: "absolute",
          left: "2%",
          zIndex: 100,
        }}
      >
        <Feather name="x" size={30} color={colors.white} />
      </Pressable>

      <Text
        style={{
          color: colors.white,
          fontFamily: "bas-bold",
          shadowColor: "rgba(0, 0, 0, 0.5)",
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 10,
          shadowRadius: 5,
          fontSize: 20,
        }}
      >
        {getCurrentDay()}
      </Text>
    </View>
  );
};

const SelectedOutfitsScreen: FC<SelectedOutfitsProps> = ({ navigation }) => {
  const options = [0, 1];
  const insets = useSafeAreaInsets();

  const { selectedOutfits, setSelectedOutfits } = useContext(
    SelectedOutfitsContext
  );

  const pickImage = async (index: number) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    });

    if (!result.canceled) {
      const assets = result.assets;
      setSelectedOutfits((prev) => {
        const newArr = [...prev];
        newArr[index] = {
          uri: assets[0].uri,
          base64: assets[0].base64 as string,
        };
        return newArr;
      });
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
        }}
      >
        <Header
          navigation={navigation}
          setSelectedOutfits={setSelectedOutfits}
        />
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
            paddingTop: insets.top + 50,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              flexWrap: "wrap",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 200,
            }}
          >
            {options.map((_, index) => (
              <Pressable
                style={{
                  width: Dimensions.get("screen").width / 1.5,
                  height: Dimensions.get("screen").width / 1.5,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderStyle: "dashed",
                  borderColor: "rgba(255,255,255,0.5)",
                  margin: 20,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 100,
                }}
                onPress={() => {
                  if (selectedOutfits.length < 2 && !selectedOutfits[index]) {
                    navigation.navigate("TakeOutfit");
                  }
                }}
                key={index}
              >
                {selectedOutfits.length >= index + 1 ? (
                  <>
                    <Image
                      source={{ uri: selectedOutfits[index].uri }}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 10,
                      }}
                    />
                    <Pressable
                      onPress={() => {
                        const newSelectedPhotos = [...selectedOutfits];
                        newSelectedPhotos.splice(index, 1);
                        setSelectedOutfits(newSelectedPhotos);
                      }}
                      style={{
                        position: "absolute",
                        shadowColor: "rgba(0, 0, 0, 0.5)",
                        shadowOffset: {
                          width: 0,
                          height: 0,
                        },
                        shadowOpacity: 10,
                        shadowRadius: 5,
                      }}
                    >
                      <Feather
                        name="trash-2"
                        color="rgba(255,255,255,1)"
                        size={30}
                      />
                    </Pressable>
                  </>
                ) : (
                  <>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          backgroundColor: "transparent",
                          overflow: "hidden",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 10,
                          marginLeft: 10,
                        }}
                        onPress={() => {
                          navigation.navigate("TakeOutfit", {
                            index,
                          });
                        }}
                      >
                        <Ionicons name="add" size={40} color={colors.white} />
                      </TouchableOpacity>
                    </View>

                    <Text
                      style={{
                        color: "rgba(255,255,255,0.5)",
                        fontFamily: "bas-medium",
                        fontSize: 15,
                        textAlign: "center",
                        marginTop: 20,
                      }}
                    >
                      {index === 0 ? "Add outfit" : "Add shoes (optional)"}
                    </Text>
                  </>
                )}
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {selectedOutfits[0] && (
          <TouchableOpacity
            style={{
              width: Dimensions.get("screen").width * 0.7,
              height: 50,
              backgroundColor: colors.white,
              borderRadius: 15,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              margin: 20,
              overflow: "hidden",
              position: "absolute",
              bottom: "5%",
            }}
            onPress={() => {
              navigation.navigate("Upload");
            }}
          >
            <Text
              style={{
                color: colors.black,
                fontFamily: "bas-bold",
                fontSize: 16,
              }}
            >
              Lets go! 💥
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default SelectedOutfitsScreen;
