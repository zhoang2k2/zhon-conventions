import { cp, lstat, mkdir, readFile, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const skillName = "zhon-convension";
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const sourceSkillPath = resolve(scriptDirectory, "../skills", skillName);

const getOptions = (argumentsList) => {
  const options = {
    allowUpdate: false,
    targetSkillPath: resolve(process.cwd(), ".agents/skills", skillName),
  };

  for (let index = 0; index < argumentsList.length; index += 1) {
    const argument = argumentsList[index];

    if (argument === "--update") {
      options.allowUpdate = true;
      continue;
    }

    if (argument === "--target") {
      const targetPath = argumentsList[index + 1];

      if (!targetPath) {
        throw new Error("Missing path after --target.");
      }

      options.targetSkillPath = resolve(process.cwd(), targetPath);
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${argument}`);
  }

  return options;
};

const readInstalledSkillName = async (targetSkillPath) => {
  const skillFilePath = resolve(targetSkillPath, "SKILL.md");
  const skillContent = await readFile(skillFilePath, "utf8");
  const nameMatch = skillContent.match(/^name:\s*(.+)$/m);

  return nameMatch?.[1]?.trim() ?? null;
};

export const installSkill = async ({ allowUpdate, targetSkillPath }) => {
  try {
    const targetStats = await lstat(targetSkillPath);

    if (!targetStats.isDirectory()) {
      throw new Error(`Target exists but is not a directory: ${targetSkillPath}`);
    }

    const installedSkillName = await readInstalledSkillName(targetSkillPath);

    if (installedSkillName !== skillName) {
      throw new Error(
        `Target is not an installed ${skillName} skill: ${targetSkillPath}`,
      );
    }

    if (!allowUpdate) {
      throw new Error(
        `Skill already exists at ${targetSkillPath}. Re-run with --update to replace it.`,
      );
    }

    await rm(targetSkillPath, { force: true, recursive: true });
  } catch (error) {
    if (error && typeof error === "object" && error.code !== "ENOENT") {
      throw error;
    }
  }

  await mkdir(dirname(targetSkillPath), { recursive: true });
  await cp(sourceSkillPath, targetSkillPath, {
    errorOnExist: true,
    force: false,
    recursive: true,
  });
};

const run = async () => {
  const options = getOptions(process.argv.slice(2));

  await installSkill(options);
  console.log(`Installed ${skillName} at ${options.targetSkillPath}`);
};

const isDirectExecution = process.argv[1] === fileURLToPath(import.meta.url);

if (isDirectExecution) {
  run().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
