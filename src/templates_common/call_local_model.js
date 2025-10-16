#!/usr/bin/env node
// Simple helper to call local Ollama (HTTP) or Jan/LMStudio (placeholder) to generate text
const execa = require('execa');
const fs = require('fs-extra');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv)).option('input', { type: 'string', demandOption: true }).option('output', { type: 'string', demandOption: true }).argv;

async function main() {
  const prompt = await fs.readFile(argv.input, 'utf8');
  // Try Ollama HTTP local (http://localhost:11434)
  try {
    const res = await execa('curl', ['-s', '-X', 'POST', 'http://localhost:11434/api/generate', '-H', 'Content-Type: application/json', '-d', JSON.stringify({ prompt })]);
    await fs.writeFile(argv.output, res.stdout, 'utf8');
    console.log('Wrote AI output to', argv.output);
    return;
  } catch (e) {
    console.log('Ollama call failed, falling back to echo');
  }
  // fallback: echo prompt
  await fs.writeFile(argv.output, `AUTOGEN FALLBACK\n\n${prompt}`, 'utf8');
}

main();