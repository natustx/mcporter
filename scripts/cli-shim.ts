#!/usr/bin/env bun
/**
 * CLI shim - ensures MCPORTER_VERSION is set before any module evaluation.
 * The --define flag replaces process.env.MCPORTER_VERSION at compile time.
 */
(async () => {
  // Fallback - the --define should replace this at compile time
  const version = process.env.MCPORTER_VERSION ?? '0.0.0-dev';
  if (!process.env.MCPORTER_VERSION) {
    Object.assign(process.env, { MCPORTER_VERSION: version });
  }
  
  // Now load the CLI
  await import('../src/cli.js');
})();
