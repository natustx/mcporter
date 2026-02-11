import type { GeneratedOption } from './generate/tools.js';

export interface CoercionError {
  message: string;
  property: string;
}

export function coerceArgsWithSchemaOptions(
  args: Record<string, unknown>,
  options: GeneratedOption[]
): { args: Record<string, unknown>; error?: CoercionError } {
  if (options.length === 0) {
    return { args };
  }
  const optionsByName = new Map(options.map((option) => [option.property, option]));
  const result: Record<string, unknown> = { ...args };
  for (const [key, value] of Object.entries(result)) {
    const option = optionsByName.get(key);
    if (!option) {
      continue;
    }
    const coerced = coerceValueToOptionType(option, value);
    if (coerced.kind === 'error') {
      return {
        args,
        error: {
          property: option.property,
          message: coerced.message,
        },
      };
    }
    if (coerced.kind === 'coerced') {
      result[key] = coerced.value;
    }
  }
  return { args: result };
}

function coerceValueToOptionType(
  option: GeneratedOption,
  value: unknown
): { kind: 'unchanged' } | { kind: 'coerced'; value: unknown } | { kind: 'error'; message: string } {
  if (option.type === 'string') {
    if (typeof value === 'number') {
      if (Number.isInteger(value) && !Number.isSafeInteger(value)) {
        return {
          kind: 'error',
          message: `Argument '${option.property}' is too large to safely coerce to string. Pass it as a quoted string or use --args JSON.`,
        };
      }
      return { kind: 'coerced', value: String(value) };
    }
    return { kind: 'unchanged' };
  }

  if (option.type === 'number') {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) {
        return { kind: 'unchanged' };
      }
      const parsed = Number(trimmed);
      if (Number.isFinite(parsed)) {
        return { kind: 'coerced', value: parsed };
      }
    }
    return { kind: 'unchanged' };
  }

  if (option.type === 'boolean') {
    if (typeof value === 'string') {
      if (value === 'true') {
        return { kind: 'coerced', value: true };
      }
      if (value === 'false') {
        return { kind: 'coerced', value: false };
      }
    }
    return { kind: 'unchanged' };
  }

  if (option.type === 'array') {
    if (typeof value === 'string') {
      const entries = value
        .split(',')
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > 0);
      if (entries.length === 0) {
        return { kind: 'unchanged' };
      }
      return {
        kind: 'coerced',
        value: entries.map((entry) => coerceArrayEntry(option.arrayItemType, entry)),
      };
    }
    return { kind: 'unchanged' };
  }

  return { kind: 'unchanged' };
}

function coerceArrayEntry(itemType: GeneratedOption['arrayItemType'], value: string): string | number | boolean {
  if (itemType === 'number') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : value;
  }
  if (itemType === 'boolean') {
    if (value === 'true') {
      return true;
    }
    if (value === 'false') {
      return false;
    }
  }
  return value;
}
