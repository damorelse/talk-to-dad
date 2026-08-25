/**
 * Pain Scale & Anatomical Body Region Definitions
 */

export type BodyRegionId =
  | 'head'
  | 'face'
  | 'throat'
  | 'neck'
  | 'chest'
  | 'stomach'
  | 'left-arm'
  | 'right-arm'
  | 'left-hand'
  | 'right-hand'
  | 'upper-back'
  | 'lower-back'
  | 'hips'
  | 'butt'
  | 'left-leg'
  | 'right-leg'
  | 'left-foot'
  | 'right-foot';

export interface BodyRegionDef {
  id: BodyRegionId;
  name: string;
  nameZh: string;
  view: 'front' | 'back' | 'both';
}

export const BODY_REGIONS: BodyRegionDef[] = [
  { id: 'head', name: 'Head', nameZh: '頭部', view: 'both' },
  { id: 'face', name: 'Face & Jaw', nameZh: '臉部與下巴', view: 'front' },
  { id: 'throat', name: 'Throat', nameZh: '喉嚨', view: 'front' },
  { id: 'neck', name: 'Neck', nameZh: '頸部', view: 'back' },
  { id: 'chest', name: 'Chest', nameZh: '胸部', view: 'front' },
  { id: 'stomach', name: 'Stomach & Abdomen', nameZh: '肚子與腹部', view: 'front' },
  { id: 'upper-back', name: 'Upper Back', nameZh: '上背部', view: 'back' },
  { id: 'lower-back', name: 'Lower Back', nameZh: '下背部', view: 'back' },
  { id: 'left-arm', name: 'Left Arm & Shoulder', nameZh: '左手臂與肩膀', view: 'both' },
  { id: 'right-arm', name: 'Right Arm & Shoulder', nameZh: '右手臂與肩膀', view: 'both' },
  { id: 'left-hand', name: 'Left Hand', nameZh: '左手', view: 'both' },
  { id: 'right-hand', name: 'Right Hand', nameZh: '右手', view: 'both' },
  { id: 'hips', name: 'Hips & Pelvis', nameZh: '髖部與骨盆', view: 'front' },
  { id: 'butt', name: 'Butt', nameZh: '屁股與臀部', view: 'back' },
  { id: 'left-leg', name: 'Left Leg', nameZh: '左腿', view: 'both' },
  { id: 'right-leg', name: 'Right Leg', nameZh: '右腿', view: 'both' },
  { id: 'left-foot', name: 'Left Foot', nameZh: '左腳', view: 'both' },
  { id: 'right-foot', name: 'Right Foot', nameZh: '右腳', view: 'both' },
];

export interface PainLevelDef {
  level: number;
  label: string;
  labelZh: string;
  description: string;
  emoji: string;
  colorClass: string;
  borderClass: string;
  bgClass: string;
}

export const WONG_BAKER_PAIN_LEVELS: PainLevelDef[] = [
  {
    level: 0,
    label: 'Does Not Hurt',
    labelZh: '不痛',
    description: 'Feeling completely comfortable',
    emoji: '😄',
    colorClass: 'text-emerald-400',
    borderClass: 'border-emerald-500',
    bgClass: 'bg-emerald-950/40 hover:bg-emerald-900/60',
  },
  {
    level: 2,
    label: 'Hurts A Little',
    labelZh: '微痛',
    description: 'Mild noticeable ache',
    emoji: '🙂',
    colorClass: 'text-lime-400',
    borderClass: 'border-lime-500',
    bgClass: 'bg-lime-950/40 hover:bg-lime-900/60',
  },
  {
    level: 4,
    label: 'Hurts Some',
    labelZh: '有點痛',
    description: 'Moderate discomfort',
    emoji: '😐',
    colorClass: 'text-yellow-400',
    borderClass: 'border-yellow-500',
    bgClass: 'bg-yellow-950/40 hover:bg-yellow-900/60',
  },
  {
    level: 6,
    label: 'Hurts',
    labelZh: '會痛',
    description: 'Distracting, hard to ignore',
    emoji: '🙁',
    colorClass: 'text-orange-400',
    borderClass: 'border-orange-500',
    bgClass: 'bg-orange-950/40 hover:bg-orange-900/60',
  },
  {
    level: 8,
    label: 'Hurts A Lot',
    labelZh: '很痛',
    description: 'Severe pain, needs attention',
    emoji: '😣',
    colorClass: 'text-rose-400',
    borderClass: 'border-rose-500',
    bgClass: 'bg-rose-950/40 hover:bg-rose-900/60',
  },
  {
    level: 10,
    label: 'Hurts The Worst',
    labelZh: '劇痛',
    description: 'Unbearable emergency pain',
    emoji: '😭',
    colorClass: 'text-red-500',
    borderClass: 'border-red-600',
    bgClass: 'bg-red-950/60 hover:bg-red-900/80',
  },
];
