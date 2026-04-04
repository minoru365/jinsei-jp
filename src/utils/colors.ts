// src/utils/colors.ts

export const C = {
  bg:     '#0f0e17',
  card:   '#1a1829',
  border: '#2d2b45',
  yellow: '#e8c547',
  purple: '#a78bfa',
  green:  '#34d399',
  pink:   '#f472b6',
  blue:   '#60a5fa',
  orange: '#fb923c',
  text:   '#f2f0ff',
  muted:  '#8b89a8',
  pill:   '#252338',
} as const;

export const FILTER_COLOR: Record<string, string> = {
  all:       C.yellow,
  kids:      C.pink,
  school:    C.purple,
  adult:     C.blue,
  longevity: C.yellow,
};
