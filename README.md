
# 🚀 Nicky Ball
The AI-Assisted Project Scaffolder

**nicky-ball** is a powerful Command Line Interface (CLI) designed to rapidly scaffold production-ready frontend and backend project boilerplates. It integrates optional AI hooks and workflow services to generate initial documentation, architectural diagrams, and even project-specific images, significantly accelerating the development setup process.

---

## ✨ Features

**nicky-ball** is built to save you time and streamline project initiation with these key capabilities:

* **Diverse Boilerplates:** Scaffold projects for popular modern stacks: **R3F** (React Three Fiber JSX), **TR3F** (React Three Fiber TypeScript), **ReType** (React TypeScript), **React** (React Native), and **JSW** (Java Spring Boot Web App).
* **AI-Powered Documentation:** Automatically generate a professional project overview (`scripts/ai_overview.md`) by leveraging local AI models (Ollama, Jan, LMStudio) or remote APIs.
* **Visual Generation:**
    * Generate initial **project images** and **icons** via AI to populate the `assets` directory.
    * Render **PlantUML diagrams** for architecture visualization (requires external setup).
* **Workflow Automation Integration:** Easily include a robust, ready-to-use local automation stack with **n8n** and **Flowise** via Docker Compose, complete with example flows for immediate use (`--with-workflows` flag).
* **Structured Output:** Ensures a consistent, professional file structure, creating core subdirectories like `assets`, `scripts`, and `tools` for every new project.

---

## 🏗️ Structure Overview

A project scaffolded with **nicky-ball** follows a predictable and professional structure, tailored to the chosen project type to ensure scalability and maintainability.

### Core Directory Layout

| Directory | Purpose | Example Contents |
| :--- | :--- | :--- |
| `src/` | Primary application source code. | `App.tsx`, `components/`, `pages/` |
| `assets/` | Static files, images, icons, and media. | `logo.png`, `favicon.ico`, `project-icon.svg` |
| `scripts/` | Automation, generation, and utility scripts. | `build.sh`, `deploy.js`, `ai_overview.md`, `generation.txt` |
| `tools/` | Configuration and setup files for external tools. | `docker-compose.yml`, `.eslint.js` |
| `workflows/` | Workflow definitions for n8n/Flowise integration. | `example-flow.json` |

---

## 📐 Architecture Example (Mermaid Block)

The architecture for a typical full-stack project scaffolded with **nicky-ball** often follows a clear, layered pattern, especially when integrated with optional workflow services.

```mermaid
graph TD
    A[Client Application (e.g., TR3F)] --> B(REST API / Gateway);
    B --> C{Backend Service (e.g., JSW)};
    C --> D[Database / Storage];

    subgraph Workflow & Automation
        E[n8n / Flowise] --> F(External APIs);
        E --> C;
    end

    style A fill:#bbf,stroke:#33f,stroke-width:2px
    style C fill:#f99,stroke:#f33,stroke-width:2px
    style E fill:#ccf,stroke:#66f,stroke-width:2px

    B --> E;
    A -- Data Flow --> C;
    C -- Data Persistence --> D;
```

A visual representation of the microservices and automation layers.

## ⚙️ Tech Stack

**nicky-ball** supports scaffolding the following core technologies. The stack can be dynamically extended by contributors.

| Project Type | Description | Key Technologies |
| :--- | :--- | :--- |
| **TR3F** | React Three Fiber with TypeScript (TSX). | React, TypeScript, Three.js, R3F, ESLint |
| **R3F** | React Three Fiber with JavaScript (JSX). | React, Three.js, R3F, Babel |
| **ReType** | Standard React application with TypeScript. | React, TypeScript, Webpack/Vite |
| **React** | React Native (Mobile/Cross-Platform). | React Native, Expo/CLI |
| **JSW** | Java Spring Boot Web Application. | Java, Spring Boot, Maven/Gradle, REST |
| **Workflow** | Optional Automation Integration. | Docker, n8n, Flowise, LLM (via local model or API) |

---

## 🛠️ Installation and Usage

### Prerequisites

You must have **Node.js** and **npm** or **nix** installed to use the CLI.

### Basic Usage

Use `npx` to execute the CLI directly without global installation.

```bash
# Basic Scaffold (e.g., a React Three Fiber project with Typescript)
npx nicky-ball create my-cool-project --type TR3F

```


### Advanced Usage with AI and Workflows
To scaffold a project, include the full workflow suite, and generate initial AI documentation and images:

```bash
npx nicky-ball create my-game \
  --type TR3F \
  --with-workflows \
  --generate \
  --gen-images

```

| Flag | Description | Default |
| :--- | :--- | :--- |
|--type | <PROJECT_TYPE>	Required. The project template to use (TR3F, R3F, ReType, JSW, React).	|N/A |
|--with-workflows |	Include n8n and Flowise Docker setup and example flows.	|False |
|--generate |	Call a local model (Ollama/Jan/LMStudio) to create scripts/ai_overview.md.	|False |
|--gen-images |	Also attempt to generate images for the assets/images directory.	|False |
|--render-diagrams |	Render PlantUML diagrams within ai_overview.md (requires external setup).	|False |
|--no-install |	Skip npm install after scaffolding.	|False |


## ⏭️ Next Steps

Once your project is scaffolded, navigate into the new directory and continue your setup:

1.  **Review Documentation:** Check `scripts/ai_overview.md` for the AI-generated project summary.
2.  **Install Dependencies (if skipped):** Run `npm install` (or `yarn`, `pnpm`, etc.).
3.  **Start Workflow Services:** If you used `--with-workflows`, navigate to `tools/` and run `docker compose up -d`.
4.  **Launch the App:** Use the standard command for your project type (e.g., `npm run dev` for TR3F).

We welcome contributions! Please see our `CONTRIBUTING.md` for guidelines.

