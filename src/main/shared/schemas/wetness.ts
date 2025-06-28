import { z } from 'zod';

export const wetnessSchema = z.enum([
  'Unknown',
  'Dry',
  'Mostly Dry',
  'Very Lightly Wet',
  'Lightly Wet',
  'Moderately Wet',
  'Very Wet',
  'Extremely Wet',
]);
