# Contributing to Natural Sticky

First off, thank you for considering contributing to Natural Sticky! We welcome all contributions, from bug reports and documentation improvements to new features. This document provides some guidelines to make the process smooth and effective for everyone.

## Getting Started

The easiest way to get your development environment up and running is by using the provided Dev Container configuration.

### One-Click Setup with Dev Containers

This repository is configured for [Visual Studio Code Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers). If you have VS Code and the "Dev Containers" extension installed, you can simply open the repository in a container. All the necessary tools and dependencies will be automatically installed for you.

Just click the "Reopen in Container" button when prompted by VS Code. The `postCreateCommand` will handle the rest.

### Manual Setup

If you prefer a manual setup, you will need:

- Node.js (v18 or later)
- npm

Clone the repository and install the dependencies:

```bash
git clone https://github.com/kadykov/natural-sticky.git
cd natural-sticky
npm install
```

## Development Workflow

This project uses several tools to ensure code quality and consistency.

- **Linting:** We use ESLint to catch common errors. Run `npm run lint` to check your code.
- **Formatting:** We use Prettier for consistent code style. Run `npm run format` to format your changes.
- **Building:** The project is built using esbuild and TypeScript. Run `npm run build` to create the distributable files.

We use [Husky](https://typicode.github.io/husky/) to run checks automatically before you commit. This helps ensure that all committed code adheres to the project's standards.

## Coding Philosophy: Keep It Minimal

The core goal of Natural Sticky is to be an ultra-lightweight solution. To that end, please keep the final minified bundle size in mind when writing code. Here are a few tips:

- **Reuse Expressions:** If you use the same expression multiple times, store it in a variable to reduce duplication.
- **Inline Single-Use Variables:** If a variable is only used once, consider inlining it to avoid an unnecessary declaration. This can help the minifier produce smaller output.

## Commit Message Guidelines

We use [Semantic Release](https://github.com/semantic-release/semantic-release) to automate our release process. For this to work, commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.

This allows us to automatically generate changelogs, determine version numbers, and publish new releases.

**Examples of valid commit messages:**

- `feat: Add a new option to control snap behavior`
- `fix: Correct positioning bug on Safari`
- `docs: Update README with new examples`
- `refactor: Simplify scroll handling logic`
- `chore: Update build dependencies`

## A Note on AI-Assisted Contributions

We believe that the value of a contribution lies in its quality and its alignment with the project's goals, not in who or what created it. Therefore, we welcome contributions that have been created with the assistance of AI.

Our project has already benefited from AI, and we see it as a powerful tool for developers. As long as your contribution meets our quality standards, passes all checks, and adds value to the project, it will be considered for inclusion, regardless of how it was created.

Thank you again for your interest in contributing! We look forward to your ideas and pull requests.
