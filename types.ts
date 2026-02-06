import React from 'react';

export interface RoseProps {
  color: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export type LabStage = 'boot' | 'lab' | 'analyzing' | 'diagnosis';

export interface Specimen {
  id: string;
  name: string;
  scientificName: string;
  color: string;
  molecule: string;
  description: string;
  effect: string;
}