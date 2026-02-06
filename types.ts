import React from 'react';

export interface SceneData {
  id: number;
  color: string;
  secondaryColor: string;
  message: string;
  lyric: string;
  duration: number;
  animationType: 'float' | 'sway' | 'bloom' | 'pulse' | 'gentle_spin';
  roseColorHex: string;
}

export interface RoseProps {
  color: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export type SceneState = 'intro' | 'playing' | 'final';