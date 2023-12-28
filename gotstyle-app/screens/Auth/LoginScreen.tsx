import { FC, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Text,
  Dimensions,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
  Keyboard,
} from "react-native";
import { colors } from "../../lib/util/colors";
import { AntDesign, Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useAuth } from "../../context/AuthContext";
import { useMutation } from "react-query";
import { userService } from "../../api/users";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

interface LoginProps {
  navigation: any;
}

const LoginScreen: FC<LoginProps> = ({ navigation }) => {
  const [credential, setCredential] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  function isValid(): boolean {
    return credential.length > 0 && password.length >= 6;
  }

  const { setAuthState } = useAuth();

  const mutation = useMutation(userService.login);

  function handleLogin(data: { credential: string; password: string }) {
    mutation.mutate(data, {
      onSuccess(data) {
        setAuthState({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          expires: data.expires,
        });

        setTimeout(() => {
          setLoading(false);
          navigation.reset({
            index: 0,
            routes: [{ name: "Main" }],
          });
        }, 1500);
      },
      onError(error: any) {
        if (error.message) {
          setError(true);
          setLoading(false);
          setErrorMessage(error.message);
        }
      },
    });
  }

  if (loading) {
    return (
      <View
        style={{
          backgroundColor: colors.black,
          width: "100%",
          height: Dimensions.get("screen").height,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator color={colors.white} size="small" />
        <Text
          style={{
            color: colors.white,
            fontFamily: "bas-medium",
            marginTop: 20,
          }}
        >
          Logging in...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.black,
      }}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="always"
      >
        <Pressable
          style={styles.backButton}
          onPress={() => {
            navigation.goBack();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <AntDesign name="arrowdown" size={24} color="white" />
        </Pressable>
        <Text style={styles.headerText}>🔑 Welcome back, trendsetter! 🌍</Text>
        <Text style={styles.paragraph}>
          Login to your account to continue exploring the world of fashion
        </Text>

        {error && (
          <Text
            style={{
              color: colors.red,
              fontFamily: "bas-regular",
              fontSize: 14,
              marginTop: 10,
            }}
          >
            {errorMessage}
          </Text>
        )}

        {/* Email Input */}
        <View style={[{ ...styles.inputContainer, marginTop: 30 }]}>
          <TextInput
            style={styles.input}
            placeholder="Email or Username"
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={credential}
            selectionColor={colors.white}
            onChangeText={(text) => setCredential(text)}
            keyboardAppearance="dark"
            keyboardType="email-address"
            autoCapitalize="none"
            autoFocus
          />

          <Pressable
            style={{ marginRight: 10 }}
            onPress={() => setCredential("")}
            onStartShouldSetResponder={() => true}
          >
            <AntDesign name="close" size={20} color="rgba(255,255,255,0.7)" />
          </Pressable>
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={password}
            selectionColor={colors.white}
            onChangeText={(text) => setPassword(text)}
            keyboardAppearance="dark"
            secureTextEntry={!showPassword}
          />

          <Pressable
            style={{ marginRight: 10 }}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Feather
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color="rgba(255,255,255,0.7)"
            />
          </Pressable>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          style={{
            width: "100%",
            height: 50,
            backgroundColor: isValid() ? colors.white : "rgba(255,255,255,0.2)",
            borderRadius: 15,
            marginTop: 30,
            alignItems: "center",
            justifyContent: "center",
          }}
          disabled={!isValid()}
          onPress={() => {
            handleLogin({ credential, password });
            setLoading(true);
            Keyboard.dismiss();
          }}
        >
          <Text
            style={{
              color: isValid() ? colors.black : "rgba(255,255,255,0.5)",
              fontFamily: "bas-medium",
              fontSize: 16,
            }}
          >
            Login
          </Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get("screen").height,
    width: Dimensions.get("screen").width,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: colors.black,
    paddingHorizontal: "10%",
  },
  backButton: {
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  headerText: {
    color: colors.white,
    fontFamily: "bas-bold",
    fontSize: 20,
    marginTop: 30,
  },
  paragraph: {
    fontFamily: "bas-regular",
    color: "rgba(255,255,255,0.7)",
    marginTop: 10,
    fontSize: 14,
    maxWidth: "80%",
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.4)",
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {
    padding: 15,
    color: colors.white,
    fontFamily: "bas-regular",
    flexGrow: 1,
  },
});
