import {
  View,
  useWindowDimensions,
  ImageURISource,
  StyleSheet,
} from "react-native";
import React from "react";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { uiColors } from "@/constants/Colors";
import { sizes } from "@/constants/fonts&sizes";

type Props = {
  item: { text: string; image: ImageURISource; description: string };
  index: number;
  x: Animated.SharedValue<number>;
};

const ListItem = ({ item, index, x }: Props) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();

  const rnImageStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      x.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [100, 0, 100],
      Extrapolate.CLAMP
    );
    const opacity = interpolate(
      x.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [0, 1, 0],
      Extrapolate.CLAMP
    );
    return {
      opacity,
      width: SCREEN_WIDTH * 0.5,
      height: SCREEN_WIDTH * 0.5,
      transform: [{ translateY }],
    };
  }, [index, x]);

  const rnTextStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      x.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [100, 0, 100],
      Extrapolate.CLAMP
    );
    const opacity = interpolate(
      x.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [0, 1, 0],
      Extrapolate.CLAMP
    );
    return {
      opacity,
      transform: [{ translateY }],
    };
  }, [index, x]);

  return (
    <View style={[styles.itemContainer, { width: SCREEN_WIDTH }]}>
      <Animated.Text style={[styles.textItem, rnTextStyle]}>
        {item.text}
      </Animated.Text>

      <View style={styles.circle} />
      <Animated.Image
        source={item.image}
        style={[rnImageStyle, styles.imageInCircle]}
        resizeMode="contain"
      />
      <Animated.Text style={[styles.textItem2, rnTextStyle]}>
        {item.description}
      </Animated.Text>
    </View>
  );
};

export default React.memo(ListItem);

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  textItem: {
    fontWeight: "600",
    lineHeight: 41,
    fontSize: 34,
    color: uiColors.white,
    textAlign: "center",
    position: "absolute",
    top: "10%",
    zIndex: 1,
  },
  textItem2: {
    fontWeight: "300",
    lineHeight: 41,
    fontSize: 22,
    color: uiColors.dark_tint,
    paddingHorizontal: sizes.marginSM,
    textAlign: "center",
    position: "absolute",
    bottom: "10%",
    zIndex: 1,
  },
  circle: {
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: uiColors.light_blue,
    opacity: 0.3,
    position: "absolute",
    top: "30%",
    zIndex: -1,
  },
  imageInCircle: {
    width: 300,
    height: 300,
    position: "absolute",
    top: "35%",
  },
});
