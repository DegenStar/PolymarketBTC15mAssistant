import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const KEY_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/;
const DOUBLE_QUOTED_VALUE = /^"((?:\\.|[^"\\])*)"/;
const SINGLE_QUOTED_VALUE = /^'([^']*)'/;

function unescapeDoubleQuoted(value) {
  return value
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\");
}

function parseValue(raw) {
  const value = raw.trim();
  if (!value) return "";

  const doubleQuoted = value.match(DOUBLE_QUOTED_VALUE);
  if (doubleQuoted) return unescapeDoubleQuoted(doubleQuoted[1]);

  const singleQuoted = value.match(SINGLE_QUOTED_VALUE);
  if (singleQuoted) return singleQuoted[1];

  const commentAt = value.indexOf(" #");
  return commentAt === -1 ? value : value.slice(0, commentAt).trim();
}

export function loadDotEnv(filePath = path.join(PROJECT_ROOT, ".env")) {
  let content;
  try {
    content = fs.readFileSync(filePath, "utf8");
  } catch {
    return false;
  }

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const separatorAt = line.indexOf("=");
    if (separatorAt === -1) continue;

    let key = line.slice(0, separatorAt).trim();
    if (key.startsWith("export ")) key = key.slice("export ".length).trim();
    if (!KEY_PATTERN.test(key)) continue;

    if (process.env[key] !== undefined) continue;
    process.env[key] = parseValue(line.slice(separatorAt + 1));
  }

  return true;
}
