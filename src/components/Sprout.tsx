import React, { useEffect, useRef } from 'react';
import { Animated, Image, Text } from 'react-native';

const MASCOT = require('../../assets/sprout.png');

const ACC_EMOJI: Record<string, string> = {
  hat: '🎉', crown: '👑', glasses: '😎', bow: '🌸', star: '⭐',
};

type Props = {
  lvl?: number;
  size?: number;
  mood?: 'happy' | 'excited' | 'sad';
  acc?: string;
};

export function Sprout({ size = 130, acc = 'none' }: Props) {
  const bobAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bobAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(bobAnim, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const translateY = bobAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -8] });
  const emoji = ACC_EMOJI[acc];

  return (
    <Animated.View style={{ transform: [{ translateY }], width: size, height: size }}>
      <Image
        source={MASCOT}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
      {emoji && (
        <Text style={{
          position: 'absolute',
          top: acc === 'glasses' ? size * 0.32 : -size * 0.06,
          left: 0, right: 0,
          textAlign: 'center',
          fontSize: size * 0.22,
        }}>
          {emoji}
        </Text>
      )}
    </Animated.View>
  );
}
