const fs = require('fs-extra');
const path = require('path');
const execa = require('execa');
const inquirer = require('inquirer');
const mustache = require('mustache');
const chalk = require('chalk');

const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');

async function scaffold({ projectName, cwd, options }) {
  const projectRoot = path.join(cwd, projectName);
  console.log(chalk.cyan('nicky-ball — scaffolding project:'), projectName);

  // 0. ensure parent folder
  await fs.ensureDir(path.dirname(projectRoot));
  // 1. create main folder
  await fs.ensureDir(projectRoot);
  // 2. create subdirectories
  for (const d of ['assets', 'scripts', 'tools']) {
    await fs.ensureDir(path.join(projectRoot, d));
  }

  // 3. copy template based on project type
  const type = (options.type || 'TR3F').toUpperCase();
  const templatePath = path.join(TEMPLATES_DIR, type);
  if (!fs.existsSync(templatePath)) {
    console.log(chalk.red(`Template ${type} not found — falling back to TR3F`));
  }
  await fs.copy(templatePath, projectRoot, { overwrite: true, filter: (src) => true });

  // 4. generate README.md using a template
  const readmeTpl = fs.readFileSync(path.join(__dirname, 'templates_common', 'README.mustache'), 'utf8');
  const readme = mustache.render(readmeTpl, { projectName, type });
  await fs.writeFile(path.join(projectRoot, 'README.md'), readme, 'utf8');

  // 5. generate generation.txt prompt
  const generationPrompt = makeGenerationPrompt({ projectName, type });
  await fs.writeFile(path.join(projectRoot, 'scripts', 'generation.txt'), generationPrompt, 'utf8');

  // 6. prepare ai_overview placeholders
  await fs.writeFile(path.join(projectRoot, 'scripts', 'ai_overview.md'), '# AI Overview\n\n(Will be generated)\n', 'utf8');
  await fs.writeFile(path.join(projectRoot, 'scripts', 'ai_summary.json'), JSON.stringify({ generated: false }, null, 2), 'utf8');

  // write a helper script to call local models
  const modelHelper = fs.readFileSync(path.join(__dirname, 'templates_common', 'call_local_model.js'), 'utf8');
  await fs.writeFile(path.join(projectRoot, 'tools', 'call_local_model.js'), modelHelper, 'utf8');

  // docker-compose and workflows
  if (options.withWorkflows) {
    const dc = fs.readFileSync(path.join(__dirname, 'templates_common', 'docker-compose.workflows.yml'), 'utf8');
    await fs.writeFile(path.join(projectRoot, 'docker-compose.yml'), dc, 'utf8');
    // copy example flows
    await fs.copy(path.join(TEMPLATES_DIR, 'WORKFLOWS'), path.join(projectRoot, 'tools', 'workflows'));
  }

  // package.json modifications for JS templates: modify script to add helpful commands
  const pkgPath = path.join(projectRoot, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = fs.readJSONSync(pkgPath);
    pkg.scripts = pkg.scripts || {};
    pkg.scripts['start:dev'] = pkg.scripts['start:dev'] || 'vite';
    pkg.scripts['generate:ai'] = 'node ./tools/call_local_model.js --input ./scripts/generation.txt --output ./scripts/ai_overview.md';
    fs.writeJSONSync(pkgPath, pkg, { spaces: 2 });
  }

  // run npm install unless --no-install
  if (options.install !== false) {
    console.log(chalk.yellow('Running package manager to install dependencies...'));
    try {
      await execa(options.packageManager || 'npm', ['install'], { cwd: projectRoot, stdio: 'inherit' });
    } catch (err) {
      console.log(chalk.red('Install failed — you can run `npm install` manually in project folder.'));
    }
  }

  // git init
  try {
    await execa('git', ['init'], { cwd: projectRoot });
    await execa('git', ['add', '.'], { cwd: projectRoot });
    await execa('git', ['commit', '-m', 'chore: scaffold project with nicky-ball'], { cwd: projectRoot });
  } catch (e) {
    console.log(chalk.gray('git not available or commit failed — continue.'));
  }

  console.log(chalk.green(`Project ${projectName} scaffolded at ${projectRoot}`));
  console.log(chalk.cyan('Next steps: open the folder, review README.md and run the generate scripts if needed.'));
}

function makeGenerationPrompt({ projectName, type }) {
  return `Create a professional project overview for a project named ${projectName}.\n\nProject type: ${type}\n\nInclude:\n- 3-paragraph overview\n- target users and audiences (bulleted)\n- 3 suggested next steps for development and deployment\n- mention of stack and any integrations (n8n, Flowise, Ollama/LMStudio/Jan)\n`;
}

module.exports = scaffold;
