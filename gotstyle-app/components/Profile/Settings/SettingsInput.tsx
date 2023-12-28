import { FC, RefObject } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import useDarkTheme from "../../../hooks/useDarkTheme";
import { colors } from "../../../lib/util/colors";
import { Ionicons } from "@expo/vector-icons";

interface SettingsInputProps {
  value: string;
  setValue: (value: string) => void;
  callback: () => void | null;
  data: any;
  placeholder: string;
  inputRef: RefObject<TextInput>;
}

const SettingsInput: FC<SettingsInputProps> = ({
  value,
  setValue,
  callback,
  data,
  placeholder,
  inputRef,
}) => {
  const darkTheme = useDarkTheme();

  return (
    <View
      style={{
        width: "100%",
        backgroundColor: darkTheme ? colors.black : colors.white,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20,
        paddingHorizontal: 30,
      }}
    >
      <Text
        style={{
          color: darkTheme ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
          fontSize: 12,
          fontFamily: "bas-regular",
        }}
      >
        {placeholder}
      </Text>

      <View
        style={{
          flexGrow: 1,
          backgroundColor: darkTheme
            ? "rgba(255,255,255,0.1)"
            : "rgba(0,0,0,0.05)",
          borderRadius: 5,
          padding: 10,
          marginLeft: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: "80%",
        }}
      >
        <TextInput
          style={{
            color: darkTheme ? colors.white : colors.black,
            fontSize: 14,
            fontFamily: "bas-medium",
            width: "90%",
          }}
          ref={inputRef}
          selectionColor={darkTheme ? colors.white : colors.black}
          placeholder={placeholder}
          value={value}
          onChangeText={(t) => {
            setValue(t);
            if (callback) {
              callback();
            }
          }}
        />
        <View
          style={{
            position: "absolute",
            right: 5,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {data && (
            <>
              {data.isLoading ? (
                <ActivityIndicator
                  size="small"
                  color={darkTheme ? colors.white : colors.black}
                />
              ) : (
                <>
                  {data.data && (
                    <>
                      {data.data.exists ? (
                        <Ionicons name="warning" size={20} color={colors.red} />
                      ) : (
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color={colors.green}
                        />
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}

          <Pressable
            onPress={() => {
              setValue("");
              inputRef.current?.focus();
            }}
            style={{
              zIndex: 20,
            }}
          >
            <Ionicons
              name="close-circle"
              size={20}
              color={darkTheme ? colors.white : colors.black}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default SettingsInput;
