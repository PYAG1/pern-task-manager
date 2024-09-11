import {
    ImageURISource,
    Pressable,
    StyleSheet,
    Text,
    View,
  } from 'react-native';
  import React, { useCallback } from 'react';
  import Animated, {
    useAnimatedStyle,
    withSpring,
    withTiming,
  } from 'react-native-reanimated';
import { uiColors } from '@/constants/Colors';
import { router } from 'expo-router';

  
  type Props = {
    currentIndex: Animated.SharedValue<number>;
    length: number;
    flatListRef: any;
  };
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
  
  const Button = ({ currentIndex, length, flatListRef }: Props) => {
    const rnBtnStyle = useAnimatedStyle(() => {
      return {
        width:
          currentIndex.value === length - 1 ? withSpring(140) : withSpring(60),
        height: 60,
      };
    }, [currentIndex, length]);
  
    const rnTextStyle = useAnimatedStyle(() => {
      return {
        opacity:
          currentIndex.value === length - 1 ? withTiming(1) : withTiming(0),
        transform: [
          {
            translateX:
              currentIndex.value === length - 1 ? withTiming(0) : withTiming(100),
          },
        ],
      };
    }, [currentIndex, length]);
  
    const imageAnimatedStyle = useAnimatedStyle(() => {
      return {
        opacity:
          currentIndex.value !== length - 1 ? withTiming(1) : withTiming(0),
        transform: [
          {
            translateX:
              currentIndex.value !== length - 1 ? withTiming(0) : withTiming(100),
          },
        ],
      };
    }, [currentIndex, length]);
  
    const onPress = useCallback(() => {
      if (currentIndex.value === length - 1) {
       router.navigate("/auth/signUp")
        return;
      } else {
        flatListRef?.current?.scrollToIndex({
          index: currentIndex.value + 1,
        });
      }
    }, []);
    return (
      <AnimatedPressable style={[styles.container, rnBtnStyle]} onPress={onPress}>
        <Animated.Text style={[styles.textStyle, rnTextStyle]}>
          Get Started
        </Animated.Text>
        <Animated.Image
          source={require('../../assets/images/right-arrow.png')}
          style={[styles.imageStyle, imageAnimatedStyle]}
        />
      </AnimatedPressable>
    );
  };
  
  export default Button;
  
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingHorizontal: 24,
      paddingVertical: 16,
      borderRadius: 100,
      backgroundColor: uiColors.light_blue,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    textStyle: {
      color: uiColors.dark,
      position: 'absolute',
      fontWeight: '600',
      fontSize: 16,
    },
    imageStyle: {
      width: 24,
      height: 24,
      position: 'absolute',
    },
  });