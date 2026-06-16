import React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

type Props = {
  pct: number;
  sz?: number;
  sw?: number;
  col: string;
  bg?: string;
  children?: React.ReactNode;
};

export function Ring({ pct, sz = 60, sw = 5, col, bg = '#E8EDE8', children }: Props) {
  const r = (sz - sw) / 2;
  const ci = 2 * Math.PI * r;
  const da = (pct / 100) * ci;

  return (
    <View style={{ width: sz, height: sz, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={sz} height={sz} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={sz / 2} cy={sz / 2} r={r} fill="none" stroke={bg} strokeWidth={sw} />
        <Circle
          cx={sz / 2} cy={sz / 2} r={r}
          fill="none" stroke={col} strokeWidth={sw}
          strokeDasharray={`${da} ${ci}`}
          strokeLinecap="round"
        />
      </Svg>
      <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </View>
    </View>
  );
}
