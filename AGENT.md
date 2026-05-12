# Agent Instructions

## Rules

1. **Don't update env variables** without asking first
2. **Use latest node version** (not a specific version like node@20)
3. **Create a git repo** - Commit early and often
4. **When stuck, ask for help** - Don't spend too much time stuck
5. **Create tests** as much as possible
6. **Don't focus on UI** - MVP first, improve later
7. **Make the repo portable** - Should run on any machine with minimal setup
8. **Use nx** - Us the the nx commands to generate app, packages or to run lint, tests, and start servers

## Commands

- Build: `npm run build` or `nx build`
- Run: `npm start` or `nx serve`
- Test: `npm test` or `nx test`

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

## General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

### Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

### When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->
