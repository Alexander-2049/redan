import { z } from 'zod';

const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

const baseSettingSchema = z.object({
  id: z.string(),
  name: z.string().optional(), // some settings/elements don't have name
  description: z.string().optional(), // optional description for settings
  requiredFields: z.array(z.string()).default([]).optional(), // not required, defaults to []
});

// --- Non-element settings ---
const sliderSettingSchema = baseSettingSchema.extend({
  type: z.literal('slider'),
  min: z.number(),
  max: z.number(),
  step: z.number(),
  unit: z.enum(['number', 'percentage']).nullable().optional(),
  defaultValue: z.number(),
});

const toggleSettingSchema = baseSettingSchema.extend({
  type: z.literal('toggle'),
  defaultValue: z.boolean(),
});

const selectSettingSchema = baseSettingSchema.extend({
  type: z.literal('select'),
  selectList: z.array(
    z.object({
      id: z.string(),
      value: z.string(),
    }),
  ),
  defaultValue: z.string(),
});

const numberSettingSchema = baseSettingSchema.extend({
  type: z.literal('number'),
  min: z.number().optional(),
  max: z.number().optional(),
  defaultValue: z.number(),
});

const stringSettingSchema = baseSettingSchema.extend({
  type: z.literal('string'),
  defaultValue: z.string(),
});

const colorSettingSchema = baseSettingSchema.extend({
  type: z.literal('color'),
  defaultValue: z.string().regex(hexColorRegex, { message: 'Invalid hex color' }),
});

// Non-element settings union
const overlayManifestSettingSchema = z.discriminatedUnion('type', [
  sliderSettingSchema,
  toggleSettingSchema,
  selectSettingSchema,
  numberSettingSchema,
  stringSettingSchema,
  colorSettingSchema,
]);

// --- Element schema for reorderable groups ---
const elementVisibilitySchema = z.object({
  id: z.string(),
  defaultValue: z.boolean(),
});

const elementSchema = z.object({
  id: z.string(),
  title: z.string(),
  visibility: elementVisibilitySchema.optional(),
  settings: z.array(overlayManifestSettingSchema).optional(),
  requiredFields: z.array(z.string()).default([]).optional(),
});

// Group schema: discriminated by type instead of reorderable boolean
const defaultGroupSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.literal('default'),
  settings: z.array(overlayManifestSettingSchema),
});

const reorderableGroupSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.literal('reorderable'),
  elements: z.array(elementSchema),
});

// Group union
const overlayManifestGroupSchema = z.union([defaultGroupSchema, reorderableGroupSchema]);

// Page schema
const overlayManifestIconEnum = z.enum([
  'settings',
  'sliders',
  'wrench',
  'gear',
  'monitor',
  'eye',
  'layout',
  'palette',
  'type',
  'image',
  'layers',
  'grid',
  'brightness',
  'contrast',
  'sun',
  'moon',
  'zap',
  'lightning',
  'cpu',
  'hard-drive',
  'activity',
  'trending-up',
  'bar-chart',
  'line-chart',
  'pie-chart',
  'bar-chart-3',
  'gamepad',
  'trophy',
  'target',
  'flag',
  'users',
  'user',
  'crown',
  'award',
  'medal',
  'car',
  'timer',
  'stopwatch',
  'clock',
  'file-text',
  'file',
  'folder',
  'video',
  'music',
  'headphones',
  'camera',
  'mic',
  'volume',
  'play',
  'pause',
  'stop',
  'mouse-pointer',
  'smartphone',
  'tablet',
  'laptop',
  'home',
  'map',
  'navigation',
  'compass',
  'map-pin',
  'route',
  'wifi',
  'radio',
  'bluetooth',
  'globe',
  'link',
  'server',
  'database',
  'router',
  'edit',
  'copy',
  'save',
  'download',
  'upload',
  'share',
  'search',
  'filter',
  'tag',
  'bookmark',
  'plus',
  'minus',
  'x',
  'check',
  'trash',
  'bell',
  'alert-triangle',
  'info',
  'help-circle',
  'star',
  'heart',
  'shield',
  'lock',
  'unlock',
  'key',
  'circle',
  'square',
  'triangle',
  'hexagon',
  'diamond',
  'shapes',
  'box',
  'package',
  'atom',
  'dna',
  'beaker',
  'telescope',
  'microscope',
  'rocket',
  'satellite',
  'radar',
  'cloud',
  'cloud-rain',
  'wind',
  'droplets',
  'snowflake',
  'flame',
  'thermometer',
  'dollar-sign',
  'euro',
  'pound-sterling',
  'yen',
  'bitcoin',
  'coins',
  'wallet',
  'credit-card',
  'shopping-cart',
  'receipt',
  'calculator',
  'sparkles',
  'wand',
  'gem',
  'magic',
  'calendar',
  'alarm-clock',
  'watch',
  'hourglass',
  'move',
  'resize',
  'rotate-cw',
  'rotate-ccw',
  'refresh-cw',
  'maximize',
  'minimize',
  'zoom-in',
  'zoom-out',
  'focus',
  'crosshair',
  'paint-bucket',
  'brush',
  'pen',
  'pencil',
  'eraser',
  'ruler',
  'crop',
  'scissors',
  'aperture',
  'battery',
  'power',
  'plug',
  'cable',
  'mail',
  'phone',
  'message-square',
  'send',
  'inbox',
  'archive',
  'plane',
  'train',
  'bike',
  'building',
  'cross',
  'pill',
  'syringe',
  'stethoscope',
  'bandage',
  'equal',
  'percent',
  'hash',
  'at-sign',
  'asterisk',
  'slash',
  'pipe',
]);

const overlayManifestPageSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  icon: overlayManifestIconEnum.optional(),
  groups: z.array(overlayManifestGroupSchema),
});

// Full manifest schema
export const overlayManifestFileSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  tags: z.array(z.string()),
  dimentions: z.object({
    defaultWidth: z.number(),
    defaultHeight: z.number(),
    minWidth: z.number().min(20).max(1920),
    minHeight: z.number().min(20).max(1920),
    maxWidth: z.number().min(20).max(1920),
    maxHeight: z.number().min(20).max(1920),
  }),
  requiredFields: z.array(z.string()).default([]).optional(),
  optionalFields: z.array(z.string()).default([]).optional(),
  pages: z.array(overlayManifestPageSchema),
});

// Export types
export type OverlayManifestSettingType = z.infer<typeof overlayManifestSettingSchema>;
export type OverlayManifestElementType = z.infer<typeof elementSchema>;
export type OverlayManifestDefaultGroup = z.infer<typeof defaultGroupSchema>;
export type OverlayManifestReorderableGroup = z.infer<typeof reorderableGroupSchema>;
export type OverlayManifestFile = z.infer<typeof overlayManifestFileSchema>;
export type OverlayManifestPage = z.infer<typeof overlayManifestPageSchema>;
export type OverlayManifestToggleSettingType = z.infer<typeof toggleSettingSchema>;
export type OverlayManifestStringSettingType = z.infer<typeof stringSettingSchema>;
export type OverlayManifestSliderSettingType = z.infer<typeof sliderSettingSchema>;
export type OverlayManifestNumberSettingType = z.infer<typeof numberSettingSchema>;
export type OverlayManifestSelectSettingType = z.infer<typeof selectSettingSchema>;
export type OverlayManifestColorSettingType = z.infer<typeof colorSettingSchema>;
export type OverlayManifestIconType = z.infer<typeof overlayManifestIconEnum>;
