import { FC, useState } from "react";
import {
  View,
  Text,
  Switch,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { colors } from "../../lib/util/colors";
import { Ionicons, Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useMutation } from "react-query";
import { userService } from "../../api/users";
import { useAuth } from "../../context/AuthContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

interface BasicSettingsProps {
  navigation: any;
}

const BasicSettingsScreen: FC<BasicSettingsProps> = ({ navigation }) => {
  const [is_private, setIsPrivate] = useState<boolean>(false);
  const [bio, setBio] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [photo_base64, setPhotoBase64] = useState<string>("");
  const [photo, setPhoto] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  const { authState } = useAuth();

  const canContinue = (): boolean => {
    return name.length > 0 || bio.length > 0 || photo_base64.length > 0;
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      const resizedPhoto = await manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 200, height: 200 } }],
        { format: SaveFormat.PNG, base64: true, compress: 0.7 }
      );

      setPhoto(resizedPhoto.uri);
      setPhotoBase64(resizedPhoto.base64 as any);
    }
  };

  const mutation = useMutation(
    (data: {
      photo_base64: string;
      bio: string;
      name: string;
      is_private: boolean;
      access_token: string;
    }) => userService.addBasicSettings(data)
  );

  const handleContinue = () => {
    mutation.mutate(
      {
        photo_base64,
        bio,
        name,
        is_private,
        access_token: authState?.access_token ? authState.access_token : "",
      },
      {
        onSuccess: () => {
          setLoading(true);

          setTimeout(() => {
            setLoading(false);
            navigation.reset({
              index: 0,
              routes: [{ name: "Home" }],
            });
          }, 1500);
        },
        onError: () => {
          throw new Error("Something went wrong with the mutation: ");
        },
      }
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.black,
      }}
    >
      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
        <StatusBar style="light" />
        <Text style={styles.headerText}>🔍 Complete your profile 🚀</Text>

        <View
          style={[
            {
              ...styles.settingsContainer,
              backgroundColor: "rgba(255,255,255,0.1)",
              borderColor: "rgba(255,255,255,0.3)",
            },
          ]}
        >
          <View
            style={{
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              width: "100%",
              marginTop: 10,
            }}
          >
            <Text
              style={{
                color: "rgba(255,255,255,0.5)",
                fontWeight: "400",
                fontSize: 12,
              }}
            >
              Profile Picture
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                marginTop: 5,
              }}
            >
              {photo ? (
                <Image
                  source={{ uri: photo }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                  }}
                />
              ) : (
                <Ionicons
                  name="person-circle-outline"
                  size={40}
                  color="rgba(255,255,255,0.5)"
                />
              )}

              <TouchableOpacity
                style={{
                  backgroundColor: colors.white,
                  borderRadius: 15,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: 20,
                  paddingVertical: 5,
                }}
                onPress={pickImage}
              >
                <Text
                  style={{
                    color: colors.black,
                    fontWeight: "500",
                    fontSize: 12,
                  }}
                >
                  Pick
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              width: "100%",
              marginTop: 10,
            }}
          >
            <Text
              style={{
                color: "rgba(255,255,255,0.5)",
                fontWeight: "400",
                fontSize: 12,
              }}
            >
              Name
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                marginTop: 5,
              }}
            >
              <TextInput
                style={{
                  color: colors.white,
                  fontWeight: "500",
                  fontSize: 16,
                  flexGrow: 1,
                }}
                onChangeText={(text) => setName(text)}
                value={name}
                placeholder="Enter your name"
                selectionColor={colors.white}
                placeholderTextColor="rgba(255,255,255,0.5)"
              />

              <Feather name="edit" size={20} color="rgba(255,255,255,0.5)" />
            </View>
          </View>

          <View
            style={{
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              width: "100%",
              marginTop: 10,
            }}
          >
            <Text
              style={{
                color: "rgba(255,255,255,0.5)",
                fontWeight: "400",
                fontSize: 12,
              }}
            >
              Bio
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                marginTop: 5,
              }}
            >
              <TextInput
                style={{
                  color: colors.white,
                  fontWeight: "500",
                  fontSize: 16,
                  flexGrow: 1,
                }}
                onChangeText={(text) => setBio(text)}
                value={bio}
                placeholder="Enter your bio"
                selectionColor={colors.white}
                placeholderTextColor="rgba(255,255,255,0.5)"
              />
              <Feather name="edit" size={20} color="rgba(255,255,255,0.5)" />
            </View>
          </View>
        </View>

        <TouchableOpacity
          disabled={!canContinue()}
          onPress={handleContinue}
          style={{
            backgroundColor: canContinue()
              ? colors.white
              : "rgba(255,255,255,0.2)",
            borderRadius: 15,
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            marginTop: 20,
            padding: 15,
          }}
        >
          <Text
            style={{
              color: canContinue() ? colors.black : "rgba(255,255,255,0.5)",
              fontWeight: "500",
              fontSize: 16,
            }}
          >
            Continue
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            marginTop: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => {
            navigation.reset({
              index: 0,
              routes: [{ name: "Home" }],
            });
          }}
        >
          <Text
            style={{
              color: colors.white,
              fontWeight: "400",
            }}
          >
            Skip for now
          </Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default BasicSettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: "5%",
    backgroundColor: colors.black,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 20,
    color: colors.white,
    marginTop: 50,
  },
  settingsContainer: {
    width: "100%",
    borderRadius: 15,
    borderWidth: 0.5,
    marginTop: 20,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});
