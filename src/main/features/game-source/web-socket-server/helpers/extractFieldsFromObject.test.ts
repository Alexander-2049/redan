import { extractFieldsFromObject } from './extractFieldsFromObject';

describe('extractFieldsFromObject', () => {
  const obj = {
    realtime: {
      throttle: 0,
      brake: 0.74211,
    },
    sessionInfo: {
      currentTime: 12319595719,
      drivers: [
        { id: 1, name: 'Jack', team: 'Alpha' },
        { id: 2, name: 'John', team: 'Beta' },
      ],
    },
  };

  it('should extract simple fields', () => {
    const fields = ['realtime.throttle', 'realtime.brake'];
    const result = extractFieldsFromObject(fields, obj);
    expect(result).toEqual([
      ['realtime.throttle', 0],
      ['realtime.brake', 0.74211],
    ]);
  });

  it('should extract nested fields', () => {
    const fields = ['sessionInfo.currentTime'];
    const result = extractFieldsFromObject(fields, obj);
    expect(result).toEqual([['sessionInfo.currentTime', 12319595719]]);
  });

  it('should extract array fields', () => {
    const fields = ['sessionInfo.drivers[].id', 'sessionInfo.drivers[].name'];
    const result = extractFieldsFromObject(fields, obj);
    expect(result).toEqual([
      ['sessionInfo.drivers[].id', [1, 2]],
      ['sessionInfo.drivers[].name', ['Jack', 'John']],
    ]);
  });

  it('should handle nonexistent fields gracefully', () => {
    const fields = ['nonexistent.field'];
    const result = extractFieldsFromObject(fields, obj);
    expect(result).toEqual([]);
  });

  it('should handle mixed existing and nonexistent fields', () => {
    const fields = ['realtime.throttle', 'nonexistent.field'];
    const result = extractFieldsFromObject(fields, obj);
    expect(result).toEqual([['realtime.throttle', 0]]);
  });

  it('should handle empty fields array', () => {
    const fields: string[] = [];
    const result = extractFieldsFromObject(fields, obj);
    expect(result).toEqual([]);
  });

  it('should handle empty object', () => {
    const fields = ['realtime.throttle'];
    const result = extractFieldsFromObject(fields, {});
    expect(result).toEqual([]);
  });

  it('should handle deeply nested fields', () => {
    const deepObj = {
      level1: {
        level2: {
          level3: {
            value: 'deep',
          },
        },
      },
    };
    const fields = ['level1.level2.level3.value'];
    const result = extractFieldsFromObject(fields, deepObj);
    expect(result).toEqual([['level1.level2.level3.value', 'deep']]);
  });

  it('should handle null as the object', () => {
    const fields = ['realtime.throttle'];
    const result = extractFieldsFromObject(fields, null);
    expect(result).toEqual([]);
  });

  it('should handle undefined as the object', () => {
    const fields = ['realtime.throttle'];
    const result = extractFieldsFromObject(fields, undefined);
    expect(result).toEqual([]);
  });

  it('should handle a number as the object', () => {
    const fields = ['realtime.throttle'];
    const result = extractFieldsFromObject(fields, 42);
    expect(result).toEqual([]);
  });

  it('should handle null in the fields array', () => {
    const fields = [null as unknown as string];
    const result = extractFieldsFromObject(fields, obj);
    expect(result).toEqual([]);
  });

  it('should handle undefined in the fields array', () => {
    const fields = [undefined as unknown as string];
    const result = extractFieldsFromObject(fields, obj);
    expect(result).toEqual([]);
  });

  it('should handle a number in the fields array', () => {
    const fields = [42 as unknown as string];
    const result = extractFieldsFromObject(fields, obj);
    expect(result).toEqual([]);
  });
});
