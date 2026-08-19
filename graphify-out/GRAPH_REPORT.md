# Graph Report - recipes  (2026-08-16)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 798 nodes · 1110 edges · 79 communities (62 shown, 17 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9c314608`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- github.com/google/uuid.UUID
- AuthContext.tsx
- scripts
- nx.json
- targetDefaults
- targets
- expo
- ci-poll-decide.mjs
- tidy
- NPM Scripts
- app/project.json
- Handler
- technologies
- ApiClient
- serve
- dependencies
- docker/project.json
- nx-mcp
- build
- externalNodes
- ci-state-update.mjs
- script
- build:api
- build:app
- docker:build
- dev
- docker:run
- docker:down
- docker:logs
- docker:rebuild
- docker:up
- start:all
- start:android
- start:api
- start
- start:ios
- start:web
- test:api
- runCommand
- options
- scriptContent
- lint
- test
- web
- app/package.json
- devDependencies
- scripts
- tsconfig.json
- version
- npm:@babel/code-frame@7.10.4
- npm:@babel/code-frame
- npm:@babel/compat-data
- npm:@babel/core
- hash
- npm:@babel/helper-annotate-as-pure
- npm:@babel/helper-compilation-targets
- npm:@babel/helper-create-class-features-plugin
- packageName
- npm:@babel/helper-define-polyfill-provider
- npm:semver
- npm:semver@6.3.1
- npm:semver@7.6.3
- .opencode/opencode.json
- grocery.tsx
- graphify.js
- expo-constants
- expo-image-picker
- expo-secure-store
- expo-status-bar
- @fortawesome/fontawesome-svg-core
- @fortawesome/free-solid-svg-icons
- react
- react-dom
- react-native
- react-native-safe-area-context
- react-native-svg
- react-native-web
- install.sh
- github.com/recipevault/api

## God Nodes (most connected - your core abstractions)
1. `targets` - 30 edges
2. `NPM Scripts` - 20 edges
3. `script` - 19 edges
4. `runCommand` - 19 edges
5. `targetDefaults` - 19 edges
6. `scriptContent` - 19 edges
7. `externalNodes` - 17 edges
8. `scripts` - 17 edges
9. `hash` - 15 edges
10. `packageName` - 15 edges

## Surprising Connections (you probably didn't know these)
- `ImportScreen()` --calls--> `useRecipeStore`  [EXTRACTED]
  app/app/import/index.tsx → app/src/lib/recipeStore.ts
- `RootLayout()` --calls--> `useAuth()`  [EXTRACTED]
  app/app/_layout.tsx → app/src/lib/AuthContext.tsx
- `LoginScreen()` --calls--> `useAuth()`  [EXTRACTED]
  app/app/login.tsx → app/src/lib/AuthContext.tsx
- `RecipeDetailScreen()` --calls--> `useRecipeStore`  [EXTRACTED]
  app/app/recipe/[id].tsx → app/src/lib/recipeStore.ts
- `NewRecipeScreen()` --calls--> `useRecipeStore`  [EXTRACTED]
  app/app/recipe/new.tsx → app/src/lib/recipeStore.ts

## Import Cycles
- None detected.

## Communities (79 total, 17 thin omitted)

### Community 0 - "github.com/google/uuid.UUID"
Cohesion: 0.07
Nodes (36): getEnv(), main(), AuthResponse, CreateRecipeRequest, IngredientDTO, InstructionDTO, LoginRequest, RecipeDTO (+28 more)

### Community 1 - "AuthContext.tsx"
Cohesion: 0.06
Nodes (37): plugins, ImportScreen(), styles, RootLayout(), LoginScreen(), styles, RecipeDetailScreen(), styles (+29 more)

### Community 2 - "scripts"
Cohesion: 0.04
Nodes (45): concurrently, @expo/cli, metro-config, metro-resolver, @nx/docker, @nx/expo, @nx-go/nx-go, @nx/react-native (+37 more)

### Community 3 - "nx.json"
Cohesion: 0.05
Nodes (42): analytics, platform, root, targets, root, targets, configurations, defaultConfiguration (+34 more)

### Community 4 - "targetDefaults"
Cohesion: 0.05
Nodes (39): cache, cache, cache, dependsOn, cache, cache, cache, cache (+31 more)

### Community 5 - "targets"
Cohesion: 0.08
Nodes (37): data, name, type, data, name, type, implicitDependencies, metadata (+29 more)

### Community 6 - "expo"
Cohesion: 0.07
Nodes (29): backgroundColor, foregroundImage, adaptiveIcon, edgeToEdgeEnabled, package, predictiveBackGestureEnabled, expo, android (+21 more)

### Community 7 - "ci-poll-decide.mjs"
Cohesion: 0.10
Nodes (25): args, backoff(), buildOutput(), categorizeTasks(), classify(), envRerunCount, expectedSha, formatMessage() (+17 more)

### Community 8 - "tidy"
Cohesion: 0.17
Nodes (25): inputs, cache, configurations, executor, inputs, options, parallelism, inputs (+17 more)

### Community 9 - "NPM Scripts"
Cohesion: 0.08
Nodes (25): dependsOn, targetGroups, Docker, NPM Scripts, android, build:api, build:app, dev (+17 more)

### Community 10 - "app/project.json"
Cohesion: 0.08
Nodes (23): platform, configurations, defaultConfiguration, executor, options, android, ios, production (+15 more)

### Community 11 - "Handler"
Cohesion: 0.18
Nodes (10): NewHandler(), parseUUID(), joinWords(), parseTSV(), ProcessImage(), splitByDivider(), echo.Context, Handler (+2 more)

### Community 12 - "technologies"
Cohesion: 0.39
Nodes (9): metadata, metadata, description, help, technologies, metadata, metadata, docker (+1 more)

### Community 14 - "serve"
Cohesion: 0.17
Nodes (12): android, ios, web, port, cache, configurations, continuous, defaultConfiguration (+4 more)

### Community 15 - "dependencies"
Cohesion: 0.18
Nodes (11): dependencies, expo, expo-linking, @fortawesome/react-native-fontawesome, react-native-screens, zustand, expo, expo-linking (+3 more)

### Community 16 - "docker/project.json"
Cohesion: 0.18
Nodes (10): executor, options, name, context, dockerfile, push, projectType, $schema (+2 more)

### Community 17 - "nx-mcp"
Cohesion: 0.20
Nodes (9): mcp, nx-mcp, command, enabled, type, $schema, mcp, npx (+1 more)

### Community 18 - "build"
Cohesion: 0.20
Nodes (10): cache, configurations, defaultConfiguration, executor, metadata, outputs, parallelism, production (+2 more)

### Community 19 - "externalNodes"
Cohesion: 0.25
Nodes (8): externalNodes, npm:resolve@1.22.12, npm:resolve@1.7.1, data, name, type, name, type

### Community 20 - "ci-state-update.mjs"
Cohesion: 0.50
Nodes (7): args, cycleCheck(), gate(), getArg(), getFlag(), output(), postAction()

### Community 21 - "script"
Cohesion: 0.29
Nodes (7): options, options, options, context, dockerfile, push, script

### Community 22 - "build:api"
Cohesion: 0.29
Nodes (7): cache, configurations, executor, metadata, options, parallelism, build:api

### Community 23 - "build:app"
Cohesion: 0.29
Nodes (7): cache, configurations, executor, metadata, options, parallelism, build:app

### Community 24 - "docker:build"
Cohesion: 0.25
Nodes (8): dependsOn, configurations, dependsOn, executor, metadata, parallelism, build, docker:build

### Community 25 - "dev"
Cohesion: 0.29
Nodes (7): cache, configurations, executor, metadata, options, parallelism, dev

### Community 26 - "docker:run"
Cohesion: 0.25
Nodes (8): inputs, configurations, executor, inputs, metadata, parallelism, docker:run, production

### Community 27 - "docker:down"
Cohesion: 0.29
Nodes (7): cache, configurations, executor, metadata, options, parallelism, docker:down

### Community 28 - "docker:logs"
Cohesion: 0.29
Nodes (7): cache, configurations, executor, metadata, options, parallelism, docker:logs

### Community 29 - "docker:rebuild"
Cohesion: 0.29
Nodes (7): cache, configurations, executor, metadata, options, parallelism, docker:rebuild

### Community 30 - "docker:up"
Cohesion: 0.29
Nodes (7): cache, configurations, executor, metadata, options, parallelism, docker:up

### Community 31 - "start:all"
Cohesion: 0.29
Nodes (7): cache, configurations, executor, metadata, options, parallelism, start:all

### Community 32 - "start:android"
Cohesion: 0.29
Nodes (7): cache, configurations, executor, metadata, options, parallelism, start:android

### Community 33 - "start:api"
Cohesion: 0.29
Nodes (7): cache, configurations, executor, metadata, options, parallelism, start:api

### Community 34 - "start"
Cohesion: 0.29
Nodes (7): cache, configurations, executor, metadata, options, parallelism, start

### Community 35 - "start:ios"
Cohesion: 0.29
Nodes (7): cache, configurations, executor, metadata, options, parallelism, start:ios

### Community 36 - "start:web"
Cohesion: 0.29
Nodes (7): cache, configurations, executor, metadata, options, parallelism, start:web

### Community 37 - "test:api"
Cohesion: 0.29
Nodes (7): test:api, cache, configurations, executor, metadata, options, parallelism

### Community 38 - "runCommand"
Cohesion: 0.33
Nodes (6): configurations, executor, metadata, parallelism, runCommand, android

### Community 39 - "options"
Cohesion: 0.40
Nodes (6): options, options, args, command, cwd, --tag docker

### Community 40 - "scriptContent"
Cohesion: 0.33
Nodes (6): configurations, executor, metadata, parallelism, scriptContent, ios

### Community 41 - "lint"
Cohesion: 0.33
Nodes (6): cache, configurations, executor, options, parallelism, lint

### Community 42 - "test"
Cohesion: 0.29
Nodes (7): test, cache, configurations, executor, metadata, options, parallelism

### Community 43 - "web"
Cohesion: 0.33
Nodes (6): web, configurations, executor, metadata, options, parallelism

### Community 44 - "app/package.json"
Cohesion: 0.40
Nodes (4): main, name, private, version

### Community 45 - "devDependencies"
Cohesion: 0.40
Nodes (5): devDependencies, @types/react, typescript, @types/react, typescript

### Community 46 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, android, ios, start, web

### Community 47 - "tsconfig.json"
Cohesion: 0.40
Nodes (4): compilerOptions, strict, extends, expo/tsconfig.base

### Community 48 - "version"
Cohesion: 0.40
Nodes (5): version, npm:@0no-co/graphql.web, data, name, type

### Community 49 - "npm:@babel/code-frame@7.10.4"
Cohesion: 0.50
Nodes (4): npm:@babel/code-frame@7.10.4, data, name, type

### Community 50 - "npm:@babel/code-frame"
Cohesion: 0.50
Nodes (4): npm:@babel/code-frame, data, name, type

### Community 51 - "npm:@babel/compat-data"
Cohesion: 0.50
Nodes (4): npm:@babel/compat-data, data, name, type

### Community 52 - "npm:@babel/core"
Cohesion: 0.50
Nodes (4): npm:@babel/core, data, name, type

### Community 53 - "hash"
Cohesion: 0.40
Nodes (5): hash, npm:@babel/generator, data, name, type

### Community 54 - "npm:@babel/helper-annotate-as-pure"
Cohesion: 0.50
Nodes (4): npm:@babel/helper-annotate-as-pure, data, name, type

### Community 55 - "npm:@babel/helper-compilation-targets"
Cohesion: 0.50
Nodes (4): npm:@babel/helper-compilation-targets, data, name, type

### Community 56 - "npm:@babel/helper-create-class-features-plugin"
Cohesion: 0.50
Nodes (4): npm:@babel/helper-create-class-features-plugin, data, name, type

### Community 57 - "packageName"
Cohesion: 0.40
Nodes (5): packageName, npm:@babel/helper-create-regexp-features-plugin, data, name, type

### Community 58 - "npm:@babel/helper-define-polyfill-provider"
Cohesion: 0.50
Nodes (4): npm:@babel/helper-define-polyfill-provider, data, name, type

### Community 59 - "npm:semver"
Cohesion: 0.50
Nodes (4): npm:semver, data, name, type

### Community 60 - "npm:semver@6.3.1"
Cohesion: 0.50
Nodes (4): npm:semver@6.3.1, data, name, type

### Community 61 - "npm:semver@7.6.3"
Cohesion: 0.50
Nodes (4): npm:semver@7.6.3, data, name, type

### Community 62 - ".opencode/opencode.json"
Cohesion: 0.50
Nodes (3): plugin, $schema, .opencode/plugins/graphify.js

## Knowledge Gaps
- **375 isolated node(s):** `AuthContextType`, `AuthState`, `RecipeState`, `UseStateHook`, `AuthResponse` (+370 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `targets` connect `targets` to `tidy`, `serve`, `build`, `build:api`, `build:app`, `docker:build`, `dev`, `docker:run`, `docker:down`, `docker:logs`, `docker:rebuild`, `docker:up`, `start:all`, `start:android`, `start:api`, `start`, `start:ios`, `start:web`, `test:api`, `runCommand`, `scriptContent`, `lint`, `test`, `web`?**
  _High betweenness centrality (0.138) - this node is a cross-community bridge._
- **Why does `externalNodes` connect `externalNodes` to `targets`, `version`, `npm:@babel/code-frame@7.10.4`, `npm:@babel/code-frame`, `npm:@babel/compat-data`, `npm:@babel/core`, `hash`, `npm:@babel/helper-annotate-as-pure`, `npm:@babel/helper-compilation-targets`, `npm:@babel/helper-create-class-features-plugin`, `packageName`, `npm:@babel/helper-define-polyfill-provider`, `npm:semver`, `npm:semver@6.3.1`, `npm:semver@7.6.3`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **What connects `AuthContextType`, `AuthState`, `RecipeState` to the rest of the system?**
  _375 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `github.com/google/uuid.UUID` be split into smaller, more focused modules?**
  _Cohesion score 0.07071887784921099 - nodes in this community are weakly interconnected._
- **Should `AuthContext.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0649895178197065 - nodes in this community are weakly interconnected._
- **Should `scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.043478260869565216 - nodes in this community are weakly interconnected._
- **Should `nx.json` be split into smaller, more focused modules?**
  _Cohesion score 0.048726467331118496 - nodes in this community are weakly interconnected._