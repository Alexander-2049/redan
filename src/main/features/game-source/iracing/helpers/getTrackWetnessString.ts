import { Wetness } from '@/main/shared/types/Wetness';

export function getTrackWetnessString(wetnessLevel: number): Wetness {
  const wetnessLevels: Record<number, Wetness> = {
    0: 'Unknown',
    1: 'Dry',
    2: 'Mostly Dry',
    3: 'Very Lightly Wet',
    4: 'Lightly Wet',
    5: 'Moderately Wet',
    6: 'Very Wet',
    7: 'Extremely Wet',
  };

  return wetnessLevels[wetnessLevel];
}
