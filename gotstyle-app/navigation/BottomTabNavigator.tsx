import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/App/HomeScreen";
import ProfileScreen from "../screens/App/Profiles/ProfileScreen";
import NotificationsScreen from "../screens/App/NotificationsScreen";
import SearchScreen from "../screens/App/SearchScreen";
import { useAuth } from "../context/AuthContext";
import { useQuery } from "react-query";
import { userService } from "../api/users";
import useDarkTheme from "../hooks/useDarkTheme";
import { colors } from "../lib/util/colors";
import { Feather } from "@expo/vector-icons";
import { Pressable, Image, View, Text } from "react-native";
import useNotifications from "../hooks/useNotifications";
import { Outfit } from "../lib/types";
import { LinearGradient } from "expo-linear-gradient";

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator({
  navigation,
  outfits,
  outfitsLoading,
  refetchOutfits,
}: {
  navigation: any;
  outfits: Outfit[];
  outfitsLoading: boolean;
  refetchOutfits: () => void;
}) {
  const { authState, isFetching }: any = useAuth();
  const darkTheme = useDarkTheme();

  const { data: me, isLoading: meLoading } = useQuery(
    "me",
    () => userService.getMe(authState?.access_token),
    { enabled: !isFetching }
  );

  useNotifications(navigation);

  const { data: unreadNotifications, isLoading: isLoadingNotifications } =
    useQuery(
      "unreadNotifications",
      () =>
        userService.getUnreadNotifications(
          authState?.access_token ? authState.access_token : ""
        ),
      {
        enabled: !isFetching,
        retry: false,
      }
    );

  if (isFetching || meLoading || isLoadingNotifications) return null;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#000",
          shadowColor: "transparent",
          borderTopWidth: 0,
        },
        headerShadowVisible: false,
        tabBarActiveTintColor: colors.white,
        tabBarInactiveTintColor: "rgba(255,255,255,0.5)",
        tabBarLabelStyle: {
          fontFamily: "bas-medium",
        },
      }}
    >
      <Tab.Screen
        name="Home"
        children={(props) => (
          <HomeScreen
            {...props}
            outfits={outfits}
            outfitsLoading={outfitsLoading}
            refetchOutfits={refetchOutfits}
          />
        )}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Image
              source={require("../assets/images/home-icon.png")}
              style={{
                width: size,
                height: size,
                opacity: focused ? 1 : 0.5,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="search" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View>
              {unreadNotifications.length > 0 && (
                <View
                  style={{
                    position: "absolute",
                    top: -5,
                    right: -5,
                    width: 15,
                    height: 15,
                    borderRadius: 99,
                    backgroundColor: colors.red,
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 100,
                  }}
                >
                  <Text
                    style={{
                      color: colors.white,
                      fontSize: 10,
                      fontFamily: "bas-medium",
                    }}
                  >
                    {unreadNotifications.length}
                  </Text>
                </View>
              )}
              <Feather name="bell" size={size} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={({ navigation }) => ({
          title: "You",
          headerTitleStyle: {
            fontFamily: "bas-semibold",
          },
          animation: "slide_from_right",
          headerStyle: {
            backgroundColor: darkTheme ? colors.black : colors.white,
          },
          headerTintColor: darkTheme ? colors.white : colors.black,
          headerLeft: () => (
            <Pressable
              onPress={() => {
                navigation.goBack();
              }}
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Feather
                name="chevron-left"
                size={30}
                color={darkTheme ? colors.white : colors.black}
              />
            </Pressable>
          ),
          headerShadowVisible: false,
          tabBarIcon: ({ color, size, focused }) => (
            <>
              {me.image_url ? (
                <LinearGradient
                  colors={["#FFA1F5", "#FF9B82"]}
                  style={{
                    zIndex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    padding: 5,
                  }}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 1, y: -1 }}
                >
                  {me.image_url ? (
                    <Image
                      source={{ uri: me.image_url }}
                      style={{
                        width: size - 2,
                        height: size - 2,
                        borderRadius: size / 2,
                      }}
                    />
                  ) : (
                    <Feather name="user" size={size} color={color} />
                  )}
                </LinearGradient>
              ) : (
                <Feather name="user" size={size} color={color} />
              )}
            </>
          ),
        })}
      />
    </Tab.Navigator>
  );
}
