import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Pressable, Animated } from "react-native";
import { colors } from "../../lib/util/colors";

const Balloon: React.FC = () => {
  const scale = useState(new Animated.Value(1))[0];
  const opacity = useState(new Animated.Value(1))[0];
  const [pressCount, setPressCount] = useState(0);
  const [targetScale, setTargetScale] = useState(1);
  const textOpacity = useState(new Animated.Value(0))[0];
  const textPosition = useState(new Animated.Value(0))[0];
  const [showText, setShowText] = useState(false);
  const [showButton, setShowButton] = useState(true);

  const handlePress = () => {
    setPressCount(pressCount + 1);
  };

  const animateText = () => {
    Animated.parallel([
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(textPosition, {
        toValue: -20,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    if (pressCount <= 2) {
      setTargetScale(targetScale + 0.2);
      Animated.spring(scale, {
        toValue: targetScale,
        useNativeDriver: true,
        bounciness: 20,
      }).start();
    } else {
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 20,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowButton(false);
        setShowText(true);
        animateText();
      });
    }
  }, [pressCount]);

  return (
    <View style={styles.container}>
      {showButton && (
        <Pressable onPress={handlePress}>
          <Animated.View
            style={[
              styles.circle,
              {
                transform: [{ scale }],
                opacity: opacity,
              },
            ]}
          >
            <Text style={styles.tagline}>Show It.</Text>
            <Text style={styles.tagline}>Mean It.</Text>
          </Animated.View>
        </Pressable>
      )}
      {showText && (
        <Animated.Text
          style={{
            fontSize: 24,
            color: "white",
            opacity: textOpacity,
            transform: [{ translateY: textPosition }],
            fontFamily: "bas-bold",
            shadowColor: "rgba(0,0,0,0.8)",
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0.8,
            shadowRadius: 5,
          }}
        >
          Wow, you really showed it! 😆
        </Animated.Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 5,
    borderColor: colors.white,
    backgroundColor: "rgba(0,0,0,0.4)",
    shadowColor: "rgba(0,0,0,0.4)",
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  tagline: {
    color: colors.white,
    fontSize: 22,
    fontFamily: "logo",
  },
  star: {
    fontSize: 24,
    position: "absolute",
    zIndex: 0,
  },
});

export default Balloon;
