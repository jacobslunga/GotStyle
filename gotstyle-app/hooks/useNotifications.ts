import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { AppState } from "react-native";
import { useAuth } from "../context/AuthContext";
import { Platform } from "react-native";
import * as Device from "expo-device";
import { userService } from "../api/users";

const clothingEmojis = [
  "👕",
  "👖",
  "👔",
  "👗",
  "👘",
  "👙",
  "👚",
  "👛",
  "👜",
  "👝",
  "🎒",
  "👞",
  "👟",
  "👠",
  "👡",
  "👢",
  "👑",
  "👒",
  "🎩",
  "🎓",
  "💄",
  "💍",
  "💼",
  "🩱",
  "🩲",
  "🩳",
  "👙",
  "👘",
  "🥻",
  "🩴",
];

export default function useNotifications(navigation: any) {
  const { authState, isFetching }: any = useAuth();

  const askForNotificationPermission = async () => {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      return;
    }
  };

  const scheduleNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Good morning! ${
          clothingEmojis[Math.floor(Math.random() * clothingEmojis.length)]
        } `,
        body: "Time to show it, time to mean it!",
        data: { data: "goes here" },
        badge: 1,
        vibrate: [0, 250, 250, 250],
        sound: true,
      },
      trigger: {
        repeats: true,
        hour: 9,
        minute: 0,
        second: 0,
      },
    });
  };

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: "e2bd43ba-f36c-49a8-ac9f-9ab04ee14c41",
        })
      ).data;
    } else {
      alert("Must use physical device for Push Notifications");
    }

    return token;
  }

  useEffect(() => {
    const schedule = async () => {
      if (authState?.access_token && !isFetching) {
        await Notifications.cancelAllScheduledNotificationsAsync();
        await scheduleNotification();
      }
    };

    schedule();
  }, []);
  scheduleNotification();

  useEffect(() => {
    askForNotificationPermission();

    const addExpoPushToken = async () => {
      const token = await registerForPushNotificationsAsync();

      if (token && authState?.access_token) {
        userService.updateExpoPushToken(authState?.access_token, {
          expo_push_token: token,
        });
      }
    };

    addExpoPushToken();

    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        if (notification.request.content.data.type === "reminder") {
          if (navigation) {
            navigation.navigate(notification.request.content.data.screen);
          }
        }
      }
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {});

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  useEffect(() => {
    const handleAppStateChange = () => {
      Notifications.setBadgeCountAsync(0);
    };

    const appStateSubscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      appStateSubscription.remove();
    };
  }, []);

  return { scheduleNotification };
}
