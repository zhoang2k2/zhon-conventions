# zhon-convension

A portable Codex skill that applies consistent frontend and full-stack coding conventions.

It provides common rules for component boundaries, JSX logic separation, conditional flow, Tailwind with BEM hooks, semantic HTML, and accessibility. Project-specific concerns stay opt-in through edge rules.

## Install into a project

The installer copies the skill into the current project's `.agents/skills/zhon-convension` directory. It does not add runtime dependencies to the application.

```bash
cd /path/to/your-project
pnpm dlx github:<GITHUB_OWNER>/zhon-convension#v0.1.0
```

Replace `<GITHUB_OWNER>` with the account or organisation that owns the repository. Use a Git tag, such as `v0.1.0`, so every project gets a reproducible version.

After installation, ask Codex to use it explicitly:

```text
$zhon-convension Refactor this form and preserve the existing design system.
```

## Update the installed skill

An existing skill is never overwritten by default. Update it explicitly:

```bash
cd /path/to/your-project
pnpm dlx github:<GITHUB_OWNER>/zhon-convension#v0.2.0 --update
```

For local development, run the installer from this repository while your shell is in the target project:

```bash
node /absolute/path/to/zhon-convension/scripts/install-skill.mjs
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

The edge-rule registry is at [skills/zhon-convension/references/edge-rule-registry.md](skills/zhon-convension/references/edge-rule-registry.md). Add a dedicated local skill or specification as the source of truth whenever an edge rule needs detailed instructions.

## Release a GitHub version

This repository is intentionally private to prevent accidental npm publishing. After creating a GitHub repository and pushing the first commit, create a Git tag:

```bash
git tag v0.1.0
git push origin v0.1.0
```

Users can then install exactly that version with the command above. Remove `"private": true` only if you intentionally want to publish this package to the npm registry.

## Commands

```bash
pnpm test
```

The test suite verifies a first installation and protects against accidental overwrite without `--update`.
# zhon-convension
