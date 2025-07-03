/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ZodTypeAny, ZodObject } from 'zod';

import { iRacingDataSchema } from '@/main/shared/schemas/game-data/iracing-schema';

export const schemasList = [zodSchemaToJSON(iRacingDataSchema)];

/* eslint-disable @typescript-eslint/no-explicit-any */

export function zodSchemaToJSON(schema: ZodTypeAny, includeOptionals = true): any {
  if (schema instanceof ZodObject) {
    const shape = schema.shape;
    const result: Record<string, any> = {};

    for (const key in shape) {
      const fieldSchema = shape[key];
      const isOptional = isZodOptional(fieldSchema);

      if (!includeOptionals && isOptional) continue;

      result[key] = getZodTypeString(fieldSchema, includeOptionals);
    }

    return result;
  }

  throw new Error('Only ZodObject supported at top level.');
}

function getZodTypeString(schema: ZodTypeAny, includeOptionals: boolean): any {
  const def = schema._def;

  switch (def.typeName) {
    case 'ZodString':
      return 'string';
    case 'ZodNumber':
      return 'number';
    case 'ZodBoolean':
      return 'boolean';
    case 'ZodDate':
      return 'date';
    case 'ZodEnum':
      return `enum(${def.values.join(', ')})`;
    case 'ZodLiteral':
      return JSON.stringify(def.value);
    case 'ZodUnion':
      return def.options
        .map((opt: ZodTypeAny) => getZodTypeString(opt, includeOptionals))
        .join(' | ');
    case 'ZodNullable':
      return `${getZodTypeString(def.innerType, includeOptionals)} | null`;
    case 'ZodOptional': {
      const base = getZodTypeString(def.innerType, includeOptionals);
      return includeOptionals ? `${base} (optional)` : base;
    }
    case 'ZodArray':
      return [`array`, getZodTypeString(def.type, includeOptionals)];
    case 'ZodObject':
      return zodSchemaToJSON(schema, includeOptionals);
    case 'ZodEffects': // unwrap `.transform()` or `.refine()` if any
      return getZodTypeString(def.schema, includeOptionals);
    default:
      return 'unknown';
  }
}

function isZodOptional(schema: ZodTypeAny): boolean {
  return (
    schema._def.typeName === 'ZodOptional' ||
    (schema._def.typeName === 'ZodEffects' && isZodOptional(schema._def.schema))
  );
}
