import { z } from 'zod';
import { gameNameSchema } from '../schemas/game-name-schema';

export type GameName = z.infer<typeof gameNameSchema>;
