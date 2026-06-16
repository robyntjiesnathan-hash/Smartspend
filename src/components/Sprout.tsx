import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import Svg, { Circle, Ellipse, Rect, Path, Text as SvgText } from 'react-native-svg';

type Props = {
  lvl?: number;
  size?: number;
  mood?: 'happy' | 'excited' | 'sad';
  acc?: string;
};

export function Sprout({ lvl = 1, size = 130, mood = 'happy', acc = 'none' }: Props) {
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

  const body = lvl >= 5 ? '#2E8B44' : lvl >= 3 ? '#38A657' : '#44BF66';
  const hi = lvl >= 5 ? '#7DDDA0' : '#9FEDB8';
  const sh = lvl >= 5 ? '#1A5C2C' : lvl >= 3 ? '#226B36' : '#2A7D42';
  const eyY = mood === 'sad' ? 80 : mood === 'excited' ? 72 : 76;
  const mouthPath = mood === 'sad'
    ? 'M54 96 Q70 88 86 96'
    : mood === 'excited'
    ? 'M50 90 Q70 106 90 90'
    : 'M54 94 Q70 108 86 94';

  const scale = size / 140;

  return (
    <Animated.View style={{ transform: [{ translateY }] }}>
      <Svg viewBox="0 0 140 150" width={size} height={size}>
        {/* Shadow */}
        <Ellipse cx="70" cy="144" rx="32" ry="7" fill="rgba(0,0,0,0.18)" />
        {/* Body */}
        <Circle cx="70" cy="80" r="44" fill={body} />
        {/* Highlight */}
        <Ellipse cx="54" cy="62" rx="14" ry="10" fill={hi} opacity="0.35" />
        {/* Arms */}
        <Ellipse cx="24" cy="96" rx="11" ry="20" fill={sh} />
        <Ellipse cx="14" cy="113" rx="11" ry="7" fill="#FFD84D" />
        <Ellipse cx="116" cy="96" rx="11" ry="20" fill={sh} />
        <Ellipse cx="126" cy="113" rx="11" ry="7" fill="#FFD84D" />
        {/* Eyes white */}
        <Ellipse cx="54" cy={eyY} rx="12" ry="13" fill="#fff" />
        <Ellipse cx="86" cy={eyY} rx="12" ry="13" fill="#fff" />
        {/* Pupils */}
        <Circle cx="57" cy={eyY + 3} r="7" fill="#111C11" />
        <Circle cx="89" cy={eyY + 3} r="7" fill="#111C11" />
        {/* Eye shine */}
        <Circle cx="60" cy={eyY} r="3" fill="#fff" />
        <Circle cx="92" cy={eyY} r="3" fill="#fff" />
        {/* Cheeks */}
        <Ellipse cx="42" cy="87" rx="9" ry="6" fill="#FF5C5C" opacity="0.55" />
        <Ellipse cx="98" cy="87" rx="9" ry="6" fill="#FF5C5C" opacity="0.55" />
        {/* Mouth */}
        <Path d={mouthPath} stroke="#111C11" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        {/* Sparkles when excited */}
        {mood === 'excited' && <SvgText x="108" y="50" fontSize="14">✨</SvgText>}
        {mood === 'excited' && <SvgText x="22" y="52" fontSize="14">✨</SvgText>}
        {/* Leaf/sprout on top */}
        {lvl >= 5 ? (
          <>
            <Circle cx="70" cy="40" r="14" fill="#C6F135" />
            <Circle cx="70" cy="26" r="9" fill="#8DB800" />
            <Circle cx="58" cy="34" r="7" fill="#C6F135" />
            <Circle cx="82" cy="34" r="7" fill="#C6F135" />
          </>
        ) : lvl >= 3 ? (
          <>
            <Circle cx="70" cy="42" r="10" fill="#C6F135" />
            <Circle cx="70" cy="32" r="7" fill="#8DB800" />
            <Circle cx="59" cy="40" r="7" fill="#C6F135" />
            <Circle cx="81" cy="40" r="7" fill="#C6F135" />
          </>
        ) : (
          <>
            <Rect x="66" y="34" width="8" height="14" rx="4" fill="#8DB800" />
            <Ellipse cx="70" cy="34" rx="7" ry="7" fill="#C6F135" />
          </>
        )}
        {/* Accessories */}
        {acc === 'hat'     && <SvgText x="70" y="28" textAnchor="middle" fontSize="22">🎉</SvgText>}
        {acc === 'crown'   && <SvgText x="70" y="28" textAnchor="middle" fontSize="22">👑</SvgText>}
        {acc === 'glasses' && <SvgText x="70" y="82" textAnchor="middle" fontSize="18">😎</SvgText>}
        {acc === 'bow'     && <SvgText x="70" y="28" textAnchor="middle" fontSize="22">🌸</SvgText>}
        {acc === 'star'    && <SvgText x="70" y="26" textAnchor="middle" fontSize="22">⭐</SvgText>}
      </Svg>
    </Animated.View>
  );
}
