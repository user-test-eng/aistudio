
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export type SegmentFormat = 'compact' | 'stats' | 'detailed' | 'mini';

export interface StatItem {
  label: string;
  value: string;
  icon?: string;
}

export interface ActionItem {
  label: string;
  url?: string;
}

export interface BoundingBox {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage 0-100
  height: number; // percentage 0-100
}

export interface Segment {
  label: string;
  format: SegmentFormat;
  description: string;
  category: 'vulnerability' | 'defense' | 'protocol' | 'risk' | 'detail';
  icon: string;
  stats?: StatItem[];
  sourceUrl?: string;
  sourceName?: string;
  bounds: BoundingBox;
}

export interface AnalysisResult {
  segments: Segment[];
  suggestedPost?: string;
}

export interface GeneratedImage {
  base64: string;
  mimeType: string;
}
