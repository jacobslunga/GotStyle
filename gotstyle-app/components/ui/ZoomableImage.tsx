import React from "react";
import { Image, Animated } from "react-native";
import {
  PinchGestureHandler,
  State,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

const ZoomableImage = ({
  source,
  width,
  height,
  style,
}: {
  source: string;
  width: string | number | any;
  height: string | number | any;
  style?: any;
}) => {
  const scale = new Animated.Value(1);

  const onPinchEvent = Animated.event([{ nativeEvent: { scale } }], {
    useNativeDriver: true,
  });

  const onPinchStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PinchGestureHandler
        onGestureEvent={onPinchEvent}
        onHandlerStateChange={onPinchStateChange}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <Image
            source={{ uri: source, cache: "force-cache" }}
            style={{ width: width, height: height, ...style }}
          />
        </Animated.View>
      </PinchGestureHandler>
    </GestureHandlerRootView>
  );
};

export default ZoomableImage;
