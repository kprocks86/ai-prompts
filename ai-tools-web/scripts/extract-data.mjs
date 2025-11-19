import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const sourceRoot = path.resolve(projectRoot, "../data-source");
const outputPath = path.resolve(projectRoot, "src/data/resources.ts");

const allowedExtensions = new Set([".txt", ".md", ".prompt", ".json"]);

const keywordTags = [
  { test: /code|coding|developer|dev/, tag: "code" },
  { test: /design|ui|ux/, tag: "design" },
  { test: /product|pm|roadmap/, tag: "product" },
  { test: /research|analysis|insight/, tag: "research" },
  { test: /agent|assistant|workflow/, tag: "agent" },
  { test: /tool/, tag: "tooling" },
  { test: /prompt/, tag: "prompt" },
  { test: /debug|fix|bug/, tag: "debug" },
  { test: /data|analytics|metric/, tag: "data" },
  { test: /chat|conversation/, tag: "chat" },
];

const typeMatchers = [
  { test: /tool|agent|workflow|script/i, kind: "tool" },
  { test: /model|prompt|guide|template/i, kind: "prompt" },
];

const sanitize = (value) => value.replace(/\r\n/g, "\n").trim();

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const summarize = (content) => {
  const line = content.split(/\n+/).find((segment) => segment.trim().length > 0);
  if (!line) return "No summary provided.";
  const clean = line.trim();
  return clean.length > 220 ? `${clean.slice(0, 217)}...` : clean;
};

const inferKind = (name) => {
  const target = name.toLowerCase();
  for (const matcher of typeMatchers) {
    if (matcher.test.test(target)) {
      return matcher.kind;
    }
  }
  return "prompt";
};

const inferTags = ({ company, title, content, kind }) => {
  const tags = new Set([
    company.toLowerCase(),
    kind,
    ...company.split(/\s+/).map((token) => token.toLowerCase()),
  ]);

  for (const { test, tag } of keywordTags) {
    if (test.test(title.toLowerCase()) || test.test(content.toLowerCase())) {
      tags.add(tag);
    }
  }

  return Array.from(tags).filter(Boolean);
};

const gatherFiles = async () => {
  const entries = await fs.readdir(sourceRoot, { withFileTypes: true });
  const resources = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const company = entry.name;
    const companyDir = path.join(sourceRoot, company);
    const stack = [companyDir];

    while (stack.length) {
      const current = stack.pop();
      const dirEntries = await fs.readdir(current, { withFileTypes: true });

      for (const dirEntry of dirEntries) {
        const targetPath = path.join(current, dirEntry.name);
        if (dirEntry.isDirectory()) {
          stack.push(targetPath);
          continue;
        }

        const ext = path.extname(dirEntry.name).toLowerCase();
        if (!allowedExtensions.has(ext)) continue;

        const content = sanitize(await fs.readFile(targetPath, "utf8"));
        if (!content) continue;

        const title = dirEntry.name.replace(ext, "");
        const slug = slugify(`${company}-${title}`);
        const kind = inferKind(dirEntry.name);
        const summary = summarize(content);
        const tags = inferTags({ company, title, content, kind });
        const sourcePath = path.relative(sourceRoot, targetPath);

        resources.push({
          id: slug,
          slug,
          title,
          company,
          kind,
          tags,
          summary,
          content,
          sourcePath,
        });
      }
    }
  }

  resources.sort((a, b) => a.company.localeCompare(b.company) || a.title.localeCompare(b.title));
  return resources;
};

const renderFile = (resources) => {
  const header = "import type { Resource } from \"@/types/resource\";\n\n";
  const body = `export const resources = ${JSON.stringify(resources, null, 2)} satisfies Resource[];\n`;
  return header + body;
};

const main = async () => {
  try {
    await fs.access(sourceRoot);
  } catch (error) {
    console.error("Source repository not found at", sourceRoot, error);
    process.exit(1);
  }

  const resources = await gatherFiles();
  if (!resources.length) {
    console.warn("No resources found.\n");
  }

  const fileContents = renderFile(resources);
  await fs.writeFile(outputPath, fileContents, "utf8");
  console.log(`Wrote ${resources.length} resources to ${path.relative(projectRoot, outputPath)}`);
};

main();
