import { describe, expect, it } from 'vitest';
import { coerceArgsWithSchemaOptions } from '../src/cli/call-arg-coercion.js';
import type { GeneratedOption } from '../src/cli/generate/tools.js';

describe('call arg coercion', () => {
  it('keeps numeric-looking ids as strings when schema expects string', () => {
    const options: GeneratedOption[] = [
      {
        property: 'projectId',
        cliName: 'project-id',
        required: false,
        type: 'string',
        placeholder: '<project-id>',
      },
    ];
    const result = coerceArgsWithSchemaOptions({ projectId: 2349498025 }, options);
    expect(result.error).toBeUndefined();
    expect(result.args).toEqual({ projectId: '2349498025' });
  });

  it('returns a fail-fast error for unsafe integer ids coerced to strings', () => {
    const options: GeneratedOption[] = [
      {
        property: 'projectId',
        cliName: 'project-id',
        required: false,
        type: 'string',
        placeholder: '<project-id>',
      },
    ];
    const result = coerceArgsWithSchemaOptions({ projectId: Number.MAX_SAFE_INTEGER + 1 }, options);
    expect(result.error?.message).toContain("Argument 'projectId' is too large to safely coerce to string.");
    expect(result.error?.property).toBe('projectId');
  });

  it('coerces number and boolean strings when schema expects those types', () => {
    const options: GeneratedOption[] = [
      {
        property: 'limit',
        cliName: 'limit',
        required: false,
        type: 'number',
        placeholder: '<limit:number>',
      },
      {
        property: 'archived',
        cliName: 'archived',
        required: false,
        type: 'boolean',
        placeholder: '<archived:true|false>',
      },
    ];
    const result = coerceArgsWithSchemaOptions({ limit: '5', archived: 'false' }, options);
    expect(result.error).toBeUndefined();
    expect(result.args).toEqual({ limit: 5, archived: false });
  });

  it('coerces comma-delimited arrays using schema item type', () => {
    const options: GeneratedOption[] = [
      {
        property: 'ids',
        cliName: 'ids',
        required: false,
        type: 'array',
        arrayItemType: 'number',
        placeholder: '<ids:value1,value2>',
      },
      {
        property: 'flags',
        cliName: 'flags',
        required: false,
        type: 'array',
        arrayItemType: 'boolean',
        placeholder: '<flags:value1,value2>',
      },
    ];
    const result = coerceArgsWithSchemaOptions({ ids: '1,2,3', flags: 'true,false,maybe' }, options);
    expect(result.error).toBeUndefined();
    expect(result.args).toEqual({ ids: [1, 2, 3], flags: [true, false, 'maybe'] });
  });
});
