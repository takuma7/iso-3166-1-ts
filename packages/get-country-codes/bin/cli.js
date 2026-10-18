#!/usr/bin/env node
import('../dist/cli.mjs').catch(error => {
  console.error(error);
  process.exitCode = 1;
});
