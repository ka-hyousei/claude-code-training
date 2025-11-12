# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Claude Code hands-on training repository designed to teach developers how to effectively use Claude Code. The repository contains a Next.js example project and a series of progressive training tasks.

## Repository Structure

```
claude-code-training/
├── example1/          # Next.js 16.0.1 training project
│   └── src/app/       # App Router structure
└── issues/            # Training tasks (task1.md - task7.md)
    ├── task1.md      # Installation
    ├── task2.md      # Project initialization with CLAUDE.md
    ├── task3.md      # WebSearch configuration
    ├── task4.md      # Using WebSearch to learn Next.js
    ├── task5.md      # Creating custom commands
    ├── task6.md      # Creating sub-agents
    └── task7.md      # Comprehensive feature implementation
```

## example1 Project (Next.js)

### Technology Stack
- **Framework**: Next.js 16.0.1 (App Router)
- **React**: 19.2.0
- **TypeScript**: 5.x with strict mode enabled
- **Linting**: ESLint with next configuration

### Development Commands

Navigate to `example1/` directory first:

```bash
# Development server (runs on http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Project Configuration

- **TypeScript**: Uses `@/*` path alias pointing to `./src/*`
- **Target**: ES2017 with modern module resolution (bundler)
- **Strict Mode**: Enabled for type safety
- **JSX**: Configured as `react-jsx` (React 19 automatic runtime)

## Training Task Workflow

The `issues/` directory contains sequential training tasks that guide users through:

1. Installing Claude Code
2. Initializing Claude Code in a project with `/init` command
3. Enabling and configuring WebSearch feature
4. Using WebSearch to learn about Next.js
5. Creating custom slash commands (`.claude/commands/`)
6. Creating custom sub-agents (`.claude/agents/`)
7. Implementing a complete feature using learned skills

**Important**: These tasks are designed to be completed in order, as each builds upon the previous one.

## Key Training Concepts

### CLAUDE.md (Project Memory)
This file serves as persistent memory for Claude Code. Key points:
- Can be placed at project root or in `.claude/CLAUDE.md`
- Hierarchical system: Enterprise > Project > User level
- Should include project-specific instructions, coding conventions, and tech stack
- Can import other files using `@path/to/file.md` (max 5 levels deep)
- Use `#` shortcut in chat to quickly add content to CLAUDE.md

### WebSearch Configuration
Enable via `.claude/settings.local.json`:
```json
{
  "permissions": {
    "allow": ["WebSearch"]
  }
}
```

### Custom Commands
Location: `.claude/commands/*.md`
- Markdown files that expand into prompts when invoked with `/command-name`

### Custom Agents
Location: `.claude/agents/*.md`
- Specialized sub-agents for specific tasks
- Can be invoked during conversations for autonomous task execution

## Development Notes

- This is a training repository, not a production codebase
- The example1 project is a standard Next.js starter with minimal customization
- Focus is on teaching Claude Code features, not building complex functionality
- Comments and documentation should be in Japanese (training material context)
