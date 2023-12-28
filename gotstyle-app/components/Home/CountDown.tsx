import React, { useState, useEffect, FC } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { colors } from "../../lib/util/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const formatNumber = (num: number): string => {
  return num < 10 ? `0${num}` : `${num}`;
};

interface CountdownTo9AMProps {
  fadeAnim: any;
}

const Countdown: FC<CountdownTo9AMProps> = ({ fadeAnim }) => {
  const insets = useSafeAreaInsets();

  const getDifferenceInSeconds = (): number => {
    const now: any = new Date();
    const targetTime: any = new Date();

    if (now.getHours() >= 9) {
      targetTime.setDate(now.getDate() + 1);
    }

    targetTime.setHours(9, 0, 0, 0);
    return Math.floor((targetTime - now) / 1000);
  };

  const [countdown, setCountdown] = useState(getDifferenceInSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown > 0) {
          return prevCountdown - 1;
        }
        return getDifferenceInSeconds();
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Animated.View
      style={[
        {
          ...styles.container,
          top: insets.top + 50,
          opacity: fadeAnim,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: colors.white,
            shadowColor: colors.black,
            shadowOffset: {
              width: 1,
              height: 1,
            },
            shadowOpacity: 0.3,
            shadowRadius: 10,
          },
        ]}
      >
        {formatNumber(Math.floor(countdown / 3600))}:
        {formatNumber(Math.floor((countdown % 3600) / 60))}:
        {formatNumber(countdown % 60)}
      </Text>
      <Text
        style={{
          ...styles.text,
          color: colors.white,
        }}
      >
        Until next outfit
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    position: "absolute",
  },
  text: {
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default Countdown;
