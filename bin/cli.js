#!/usr/bin/env node
const { Command } = require('commander');
const pkg = require('../package.json');
const path = require('path');
const scaffold = require('../src/scaffold');

const program = new Command();
program.name('nicky-ball').version(pkg.version).description(pkg.description);

program
  .command('create <project-name>')
  .description('Create a new project boilerplate')
  .option('-t, --type <project-type>', 'Project type: R3F|TR3F|React|ReType|JSW', 'TR3F')
  .option('--with-workflows', 'Include n8n and Flowise docker-compose and example flows')
  .option('--generate', 'Auto-run local model (Ollama/Jan/LMStudio) to generate ai_overview and images')
  .option('--gen-images', 'Generate images via local model (uses --generate)')
  .option('--render-diagrams', 'Render PlantUML diagrams (requires docker/plantuml)')
  .option('--no-install', 'Do not run npm install after scaffolding')
  .option('--package-manager <pm>', 'npm|pnpm|yarn (default: npm)', 'npm')
  .action(async (projectName, opts) => {
    const cwd = process.cwd();
    await scaffold({ projectName, cwd, options: opts });
  });

program.parse(process.argv);