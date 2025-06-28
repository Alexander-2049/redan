import { z } from 'zod';

import { wetnessSchema } from '../schemas/wetness';

export type Wetness = z.infer<typeof wetnessSchema>;
