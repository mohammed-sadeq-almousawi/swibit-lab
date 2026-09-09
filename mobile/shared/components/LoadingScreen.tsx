import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, Platform } from 'react-native';

export const LoadingScreen = () => {
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  return (
    <View className="flex-1 justify-center items-center bg-gray-50">
      <Animated.View
        style={{ opacity: pulseAnim }}
        className="w-12 h-12 rounded-full bg-blue-500"
      />
    </View>
  );
};
