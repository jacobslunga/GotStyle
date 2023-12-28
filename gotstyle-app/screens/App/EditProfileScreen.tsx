import { FC, useEffect, useRef, useState } from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  View,
  Dimensions,
  Text,
  TextInput,
  ActivityIndicator,
} from "react-native";
import useDarkTheme from "../../hooks/useDarkTheme";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../lib/util/colors";
import SettingsInput from "../../components/Profile/Settings/SettingsInput";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../context/AuthContext";
import { userService } from "../../api/users";
import { useQuery } from "react-query";
import { useMutation } from "react-query";
import { debounce } from "lodash";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

interface EditProfileScreenProps {
  navigation: any;
}

const Header = ({
  navigation,
  updateMeMutionIsDisabled,
  handleUpdateUser,
  darkTheme,
  insets,
}: {
  navigation: any;
  updateMeMutionIsDisabled: any;
  handleUpdateUser: any;
  darkTheme: any;
  insets: any;
}) => {
  return (
    <View
      style={{
        height: 30 + insets.top,
        width: Dimensions.get("screen").width,
        backgroundColor: darkTheme ? colors.black : colors.white,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
      }}
    >
      <Pressable
        onPress={() => navigation.goBack()}
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: 5,
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
        Settings
      </Text>

      <Pressable
        disabled={updateMeMutionIsDisabled()}
        onPress={() => {
          handleUpdateUser(navigation);
        }}
      >
        <Text
          style={{
            fontFamily: "bas-bold",
            color: updateMeMutionIsDisabled()
              ? darkTheme
                ? "rgba(255,255,255,0.5)"
                : "rgba(0,0,0,0.5)"
              : darkTheme
              ? colors.white
              : colors.black,
          }}
        >
          Done
        </Text>
      </Pressable>
    </View>
  );
};

const EditProfileScreen: FC<EditProfileScreenProps> = ({ navigation }) => {
  const darkTheme = useDarkTheme();
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [photo_base64, setPhotoBase64] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [is_private, setIsPrivate] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { authState }: any = useAuth();
  const insets = useSafeAreaInsets();

  const { data: me, refetch: refetchMe } = useQuery(
    "me",
    () => userService.getMe(authState.access_token),
    {
      enabled: !!authState?.access_token,
      refetchOnWindowFocus: false,
    }
  );

  const pickImage = async () => {
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
      setPhotoBase64(result.assets[0].base64 as string);
      setPhotoUrl(result.assets[0].uri as string);
    }
  };

  useEffect(() => {
    setBio(me.bio || "");
    setEmail(me.email);
    setName(me.name || "");
    setUsername(me.username);
    setIsPrivate(me.is_private);
  }, []);

  const usernameInputRef = useRef<TextInput>(null);
  const nameInputRef = useRef<TextInput>(null);
  const emailInputRef = useRef<TextInput>(null);
  const bioInputRef = useRef<TextInput>(null);

  const usernameQuery = useQuery(
    ["available-username", username],
    async () => userService.getAvailableUsernames(username),
    {
      enabled: false,
      retry: false,
    }
  );

  const emailQuery = useQuery(
    ["available-email", email],
    async () => userService.getAvailableEmails(email),
    {
      enabled: false,
      retry: false,
    }
  );

  const checkUsernameAvailability = debounce(() => {
    usernameQuery.refetch();
  }, 500);

  const checkEmailAvailability = debounce(() => {
    emailQuery.refetch();
  }, 500);

  const updateMeMutation = useMutation(
    () =>
      userService.updateMe(
        authState?.access_token ? authState.access_token : "",
        {
          bio,
          email,
          name,
          photo_base64,
          is_private,
          sex: null,
          username,
        }
      ),
    {
      onSuccess: () => {
        refetchMe();
      },
      onError: () => {
        throw new Error("Something went wrong with the mutation: ");
      },
    }
  );

  const handleUpdateUser = async (navigation: any) => {
    try {
      setIsLoading(true);
      await updateMeMutation.mutateAsync();
      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  };

  const updateMeMutionIsDisabled = () => {
    if (username === me.username && email === me.email) {
      return false;
    }

    return (
      !(
        username &&
        email &&
        !usernameQuery.data?.exists &&
        !emailQuery.data?.exists
      ) || updateMeMutation.isLoading
    );
  };

  if (!me) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: darkTheme ? colors.black : colors.white,
        }}
      >
        <ActivityIndicator
          size="small"
          color={darkTheme ? colors.white : colors.black}
        />
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
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: darkTheme ? colors.black : colors.white,
        }}
      >
        <Header
          darkTheme={darkTheme}
          navigation={navigation}
          updateMeMutionIsDisabled={updateMeMutionIsDisabled}
          handleUpdateUser={handleUpdateUser}
          insets={insets}
        />
        <StatusBar style={darkTheme ? "light" : "dark"} animated />
        {isLoading && (
          <View
            style={{
              width: Dimensions.get("screen").width,
              height: Dimensions.get("screen").height,
              backgroundColor: "rgba(0,0,0,0.5)",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              position: "absolute",
            }}
          >
            <ActivityIndicator size="small" color="#fff" />
            <Text
              style={{
                color: "#fff",
                fontFamily: "bas-regular",
                fontSize: 14,
              }}
            >
              Saving changes...
            </Text>
          </View>
        )}

        <KeyboardAwareScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "flex-start",
            alignItems: "center",
            backgroundColor: darkTheme ? colors.black : colors.white,
            flexDirection: "column",
            width: Dimensions.get("screen").width,
          }}
        >
          <View
            style={{
              width: 100,
              height: 100,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: darkTheme
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.1)",
              borderRadius: 99,
            }}
          >
            {photoUrl ? (
              <Image
                source={{ uri: photoUrl }}
                style={{ width: 100, height: 100, borderRadius: 100 }}
              />
            ) : (
              <>
                {me.image_url ? (
                  <Image
                    source={{
                      uri: `${me.image_url}?${new Date().getTime()}`,
                      cache: "reload",
                    }}
                    style={{ width: 100, height: 100, borderRadius: 100 }}
                  />
                ) : (
                  <Ionicons
                    name="person"
                    size={50}
                    color={
                      darkTheme ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)"
                    }
                  />
                )}
              </>
            )}

            <Pressable
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                backgroundColor: darkTheme ? colors.white : colors.black,
                padding: 5,
                borderRadius: 99,
                borderWidth: 3,
                borderColor: darkTheme ? colors.black : colors.white,
                shadowColor: "transparent",
                overflow: "hidden",
              }}
              onPress={pickImage}
            >
              <Ionicons
                name="md-add"
                size={15}
                color={darkTheme ? colors.black : colors.white}
              />
            </Pressable>
          </View>

          {/* Edit Username */}
          <SettingsInput
            value={username}
            setValue={setUsername}
            placeholder="Username"
            data={usernameQuery}
            callback={checkUsernameAvailability}
            inputRef={usernameInputRef}
          />

          {/* Edit Name */}
          <SettingsInput
            value={name}
            setValue={setName}
            placeholder="Name"
            data={null}
            callback={() => null}
            inputRef={nameInputRef}
          />

          {/* Edit Email */}
          <SettingsInput
            value={email}
            setValue={setEmail}
            placeholder="Email"
            data={emailQuery}
            callback={checkEmailAvailability}
            inputRef={emailInputRef}
          />

          {/* Edit Bio */}
          <SettingsInput
            value={bio}
            setValue={setBio}
            placeholder="Bio"
            data={null}
            callback={() => null}
            inputRef={bioInputRef}
          />

          {/* <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 20,
              backgroundColor: darkTheme
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.1)",
              borderRadius: 10,
              marginTop: 20,
              width: Dimensions.get("screen").width - 60,
            }}
            onPress={() => {
              setIsPrivate(!is_private);
            }}
          >
            <Text
              style={{
                color: darkTheme ? colors.white : colors.black,
                fontFamily: "bas-regular",
                fontSize: 14,
              }}
            >
              Private Account
            </Text>

            <Switch
              value={is_private}
              onValueChange={() => {
                setIsPrivate(!is_private);
              }}
              ios_backgroundColor="#3e3e3e"
            />
          </Pressable> */}

          <Pressable
            style={{
              backgroundColor: darkTheme
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.1)",
              borderRadius: 5,
              marginTop: 20,
              paddingVertical: 10,
              width: Dimensions.get("screen").width - 60,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={async () => {
              await AsyncStorage.clear();
              navigation.reset({
                index: 0,
                routes: [{ name: "Auth" }],
              });
            }}
          >
            <Text
              style={{
                color: darkTheme ? colors.white : colors.black,
                fontFamily: "bas-medium",
                fontSize: 14,
              }}
            >
              Log Out
            </Text>
          </Pressable>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
