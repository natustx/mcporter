import fs from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { handleAddCommand } from '../src/cli/config/add.js';
import { createTempConfig } from './fixtures/config-fixture.js';

describe('config add imports preservation', () => {
  it('keeps imports undefined when config omits the key', async () => {
    const ctx = await createTempConfig({ mcpServers: {} });

    await handleAddCommand({ loadOptions: ctx.loadOptions } as never, ['local', 'https://local.example/mcp']);

    const buffer = await fs.readFile(ctx.configPath, 'utf8');
    const parsed = JSON.parse(buffer) as { imports?: string[] };
    expect(Object.hasOwn(parsed, 'imports')).toBe(false);
    await ctx.cleanup();
  });

  it('keeps imports undefined when creating a new config file', async () => {
    const ctx = await createTempConfig();

    await handleAddCommand({ loadOptions: ctx.loadOptions } as never, ['fresh', 'https://fresh.example/mcp']);

    const buffer = await fs.readFile(ctx.configPath, 'utf8');
    const parsed = JSON.parse(buffer) as { imports?: string[] };
    expect(Object.hasOwn(parsed, 'imports')).toBe(false);
    await ctx.cleanup();
  });
});
