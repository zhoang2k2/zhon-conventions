# zhon-conventions

A portable Codex & AI coding agent skill that applies consistent frontend and full-stack coding conventions.

It provides common rules for component boundaries, JSX logic separation, conditional flow, Tailwind with BEM hooks, semantic HTML, and accessibility. Project-specific concerns stay opt-in through edge rules.

## Install into a project

The installer copies the skill into the current project's `.agents/skills/zhon-conventions` directory. It does not add runtime dependencies to the application.

### One-time installation

```bash
cd /path/to/your-project
pnpm dlx zhon-conventions
```

Use this when a project only needs a local copy of the skill. It does not modify `package.json` or the lockfile.

### Install as a development dependency

```bash
cd /path/to/your-project
pnpm add -D zhon-conventions
pnpm exec zhon-conventions
```

Use this when the project should lock the installer version in `package.json` and `pnpm-lock.yaml`. The package is a development-only tool; it is not shipped to the browser or production runtime.

After installation, ask your agent (Codex / Gemini / Claude) to use it explicitly:

```text
$zhon-conventions Refactor this form and preserve the existing design system.
```

## Update the installed skill

An existing skill is never overwritten by default. Update it explicitly:

```bash
cd /path/to/your-project
pnpm dlx zhon-conventions --update
```

For a development dependency:

```bash
pnpm up -D zhon-conventions
pnpm exec zhon-conventions --update
```

For local development, run the installer from this repository while your shell is in the target project:

```bash
node /absolute/path/to/zhon-conventions/scripts/install-skill.mjs
```

Use `--target ./custom/skill-path` only when a project intentionally uses a different skill directory.

## Configure edge rules per project

Common rules always apply. Edge rules apply only when the project declares them, so a single-language app is not forced to use i18n and a static page is not forced into backend architecture.

Create a project-local index at `.agents/skills/project-rules/SKILL.md`:

```md
## Active edge rules

| Rule | Status | Source of truth |
| --- | --- | --- |
| i18n | required | .agents/skills/i18n/SKILL.md |
| design system | required | docs/design-system.md |
| auth and security | active | specs/auth.md |
| analytics | inactive | — |
```

Use these statuses:

| Status | Meaning |
| --- | --- |
| `required` | The agent must read the stated source before relevant implementation. |
| `active` | Apply the rule only when the current task touches it. |
| `inactive` | Deliberately ignore it for this project. |

The edge-rule registry is at [skills/zhon-conventions/references/edge-rule-registry.md](skills/zhon-conventions/references/edge-rule-registry.md). Add a dedicated local skill or specification as the source of truth whenever an edge rule needs detailed instructions.

## Publish to npm

The package name `zhon-conventions` is configured for the npm registry. Authenticate using the npm account that will own the package, then publish from a clean working tree:

```bash
pnpm login
pnpm test
pnpm publish --access public
```

`prepack` runs the installer tests again immediately before packaging. Publish each new release with a new semantic version in `package.json`, for example `0.1.1`.

## Commands

```bash
pnpm test
```

The test suite verifies a first installation and protects against accidental overwrite without `--update`.
