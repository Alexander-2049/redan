import { z } from 'zod';

export const gameNameSchema = z.enum([
  'None',
  'iRacing',
  'Assetto Corsa: Competizione',
  'Assetto Corsa',
]);
