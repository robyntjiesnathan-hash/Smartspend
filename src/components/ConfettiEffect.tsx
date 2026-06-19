import React, { useEffect, useRef, useMemo } from 'react';
import { View, Animated, Dimensions, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';

const { width: W, height: H } = Dimensions.get('window');
const CY = H * 0.40;

const COLS = [
  '#C6F135', '#FFD84D', '#FFFFFF', '#FF5C5C',
  '#7B5CF5', '#00C4A7', '#3DBA6A', '#FF9F40',
  '#E83F6F', '#90E0EF',
];
const EMOJIS = ['⭐', '✨', '🎉', '💫', '🌟', '🎊'];

function rnd(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getShapeDims(shape: string, size: number) {
  switch (shape) {
    case 'circle': return { w: size,        h: size,        br: size / 2 };
    case 'rect':   return { w: size * 1.8,  h: size * 0.65, br: 2 };
    case 'strip':  return { w: Math.max(2.5, size * 0.28), h: size * 2.4, br: 1 };
    default:       return { w: size,        h: size,        br: 3 };
  }
}

// White radial flash at burst origin
function PopFlash() {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 750, useNativeDriver: true }).start();
  }, []);
  const scale   = anim.interpolate({ inputRange: [0, 0.38, 1], outputRange: [0.05, 1.8, 5] });
  const opacity = anim.interpolate({ inputRange: [0, 0.12, 0.52, 1], outputRange: [0, 0.95, 0.35, 0] });
  return (
    <Animated.View style={{
      position: 'absolute',
      width: 80, height: 80, borderRadius: 40,
      backgroundColor: '#FFFFF0',
      left: W / 2 - 40,
      top: CY - 40,
      transform: [{ scale }],
      opacity,
    }} />
  );
}

// Burst pieces — explode outward from center
type BurstProps = {
  angle: number; radius: number; peakY: number; rotDeg: string;
  delay: number; duration: number; w: number; h: number; br: number; color: string;
};

function BurstPiece({ angle, radius, peakY, rotDeg, delay, duration, w, h, br, color }: BurstProps) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const t = setTimeout(() => {
      Animated.timing(anim, { toValue: 1, duration, useNativeDriver: true }).start();
    }, delay);
    return () => clearTimeout(t);
  }, []);

  const rad    = (angle * Math.PI) / 180;
  const finalX = Math.cos(rad) * radius;
  const finalY = Math.sin(rad) * radius + 150;

  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [0, finalX] });
  const translateY = anim.interpolate({
    inputRange: [0, 0.26, 1],
    outputRange: [0, peakY + Math.sin(rad) * radius * 0.08, finalY],
  });
  const rotate  = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', rotDeg] });
  const scale   = anim.interpolate({ inputRange: [0, 0.06, 0.82, 1], outputRange: [0, 1.4, 1, 0.2] });
  const opacity = anim.interpolate({ inputRange: [0, 0.04, 0.76, 1], outputRange: [0, 1, 0.92, 0] });

  return (
    <Animated.View style={{
      position: 'absolute',
      width: w, height: h, borderRadius: br,
      backgroundColor: color,
      left: W / 2 - w / 2,
      top: CY - h / 2,
      transform: [{ translateX }, { translateY }, { rotate }, { scale }],
      opacity,
    }} />
  );
}

// Rain pieces — fall from the top of the screen
type RainProps = {
  x: number; rotDeg: string; delay: number; duration: number;
  w: number; h: number; br: number; color: string;
};

function RainPiece({ x, rotDeg, delay, duration, w, h, br, color }: RainProps) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const t = setTimeout(() => {
      Animated.timing(anim, { toValue: 1, duration, useNativeDriver: true }).start();
    }, delay);
    return () => clearTimeout(t);
  }, []);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [-20, H + 100] });
  const rotate     = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', rotDeg] });
  const opacity    = anim.interpolate({ inputRange: [0, 0.04, 0.87, 1], outputRange: [0, 1, 0.92, 0] });

  return (
    <Animated.View style={{
      position: 'absolute',
      width: w, height: h, borderRadius: br,
      backgroundColor: color,
      left: x - w / 2,
      top: 0,
      transform: [{ translateY }, { rotate }],
      opacity,
    }} />
  );
}

// Emoji stars — pop, float up, and fade
type StarProps = { x: number; y: number; emoji: string; delay: number };

function EmojiStar({ x, y, emoji, delay }: StarProps) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const t = setTimeout(() => {
      Animated.timing(anim, { toValue: 1, duration: 1500, useNativeDriver: true }).start();
    }, delay);
    return () => clearTimeout(t);
  }, []);

  const scale      = anim.interpolate({ inputRange: [0, 0.16, 0.62, 1], outputRange: [0, 1.7, 1.15, 0.4] });
  const opacity    = anim.interpolate({ inputRange: [0, 0.1, 0.6, 1], outputRange: [0, 1, 0.95, 0] });
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -80] });

  return (
    <Animated.Text style={{
      position: 'absolute',
      left: x, top: y,
      fontSize: 24,
      transform: [{ scale }, { translateY }],
      opacity,
    }}>
      {emoji}
    </Animated.Text>
  );
}

function ConfettiInner() {
  const shapes = ['square', 'circle', 'rect', 'strip'] as const;

  const burst = useMemo(() =>
    Array.from({ length: 44 }, (_, i) => {
      const shape = pick(shapes);
      const size  = rnd(7, 15);
      const dims  = getShapeDims(shape, size);
      const dir   = Math.random() > 0.5 ? 1 : -1;
      return {
        key:      i,
        angle:    (i / 44) * 360 + rnd(-6, 6),
        radius:   rnd(85, 380),
        peakY:    rnd(-100, -230),
        rotDeg:   `${Math.round(rnd(200, 960)) * dir}deg`,
        delay:    Math.round(rnd(0, 150)),
        duration: Math.round(rnd(1900, 3100)),
        ...dims,
        color:    pick(COLS),
      };
    }), []);

  const rain = useMemo(() =>
    Array.from({ length: 32 }, (_, i) => {
      const shape = pick(shapes);
      const size  = rnd(5, 11);
      const dims  = getShapeDims(shape, size);
      const dir   = Math.random() > 0.5 ? 1 : -1;
      return {
        key:      i + 44,
        x:        rnd(8, W - 8),
        rotDeg:   `${Math.round(rnd(180, 600)) * dir}deg`,
        delay:    Math.round(rnd(100, 800)),
        duration: Math.round(rnd(2100, 3800)),
        ...dims,
        color:    pick(COLS),
      };
    }), []);

  const stars = useMemo(() =>
    Array.from({ length: 6 }, (_, i) => ({
      key:   i + 76,
      x:     rnd(W * 0.06, W * 0.80),
      y:     rnd(H * 0.18, H * 0.70),
      emoji: EMOJIS[i % EMOJIS.length],
      delay: Math.round(rnd(30, 380)),
    })), []);

  return (
    <View style={ss.wrap} pointerEvents="none">
      <PopFlash />
      {burst.map(({ key, ...p }) => <BurstPiece key={key} {...p} />)}
      {rain.map(({ key, ...p })  => <RainPiece  key={key} {...p} />)}
      {stars.map(({ key, ...p }) => <EmojiStar  key={key} {...p} />)}
    </View>
  );
}

export function ConfettiEffect() {
  const { confetti } = useApp();
  if (!confetti) return null;
  return <ConfettiInner />;
}

const ss = StyleSheet.create({
  wrap: {
    position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
    zIndex: 990,
    overflow: 'hidden',
  },
});
