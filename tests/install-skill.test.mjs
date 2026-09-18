import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import test from "node:test";

import { installSkill } from "../scripts/install-skill.mjs";

const skillName = "zhon-convension";

test("installs the skill into a project-local .agents directory", async () => {
  const temporaryDirectory = await mkdtemp(resolve(tmpdir(), "zhon-convension-"));
  const targetSkillPath = resolve(temporaryDirectory, ".agents/skills", skillName);

  try {
    await installSkill({ allowUpdate: false, targetSkillPath });

    const installedSkill = await readFile(resolve(targetSkillPath, "SKILL.md"), "utf8");
    assert.match(installedSkill, /^name: zhon-convension$/m);
  } finally {
    await rm(temporaryDirectory, { force: true, recursive: true });
  }
});

test("does not overwrite an installed skill unless update is explicit", async () => {
  const temporaryDirectory = await mkdtemp(resolve(tmpdir(), "zhon-convension-"));
  const targetSkillPath = resolve(temporaryDirectory, ".agents/skills", skillName);

  try {
    await installSkill({ allowUpdate: false, targetSkillPath });

    await assert.rejects(
      () => installSkill({ allowUpdate: false, targetSkillPath }),
      /Re-run with --update/,
    );
  } finally {
    await rm(temporaryDirectory, { force: true, recursive: true });
  }
});
