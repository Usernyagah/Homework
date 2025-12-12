import fs from "fs/promises";
import os from "os";
import path from "path";
import { runJavascriptSandbox } from "../sandbox/jsSandbox.js";
import { runCommand } from "../utils/processRunner.js";

const TIMEOUT_MS = 2000;

const executeCode = async ({ language, code, input = "" }) => {
  if (!code) {
    return { output: "", error: "Code is required" };
  }

  switch ((language || "javascript").toLowerCase()) {
    case "javascript":
    case "js":
      return runJavascriptSandbox(code, TIMEOUT_MS);
    case "python":
    case "py":
      return runPython(code, input);
    case "cpp":
    case "c++":
      return runCpp(code, input);
    case "java":
      return runJava(code, input);
    default:
      return { output: "", error: `Unsupported language: ${language}` };
  }
};

const runPython = async (code, input) => {
  const result = await runCommand({
    command: "python3",
    args: ["-c", code],
    input,
    timeout: TIMEOUT_MS,
  });
  return normalizeResult(result);
};

const runCpp = async (code, input) => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "cpp-"));
  const sourcePath = path.join(tmpDir, "main.cpp");
  const binaryPath = path.join(tmpDir, "main.out");
  await fs.writeFile(sourcePath, code);

  const compile = await runCommand({
    command: "g++",
    args: [sourcePath, "-std=c++17", "-O2", "-o", binaryPath],
    timeout: TIMEOUT_MS,
  });

  if (compile.code !== 0) {
    await cleanup(tmpDir);
    return { output: compile.stdout, error: compile.stderr || "Compile error" };
  }

  const run = await runCommand({
    command: binaryPath,
    args: [],
    input,
    timeout: TIMEOUT_MS,
  });

  await cleanup(tmpDir);
  return normalizeResult(run);
};

const runJava = async (code, input) => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "java-"));
  const sourcePath = path.join(tmpDir, "Main.java");
  await fs.writeFile(sourcePath, code);

  const compile = await runCommand({
    command: "javac",
    args: [sourcePath],
    timeout: TIMEOUT_MS,
  });

  if (compile.code !== 0) {
    await cleanup(tmpDir);
    return { output: compile.stdout, error: compile.stderr || "Compile error" };
  }

  const run = await runCommand({
    command: "java",
    args: ["-cp", tmpDir, "Main"],
    input,
    timeout: TIMEOUT_MS,
  });

  await cleanup(tmpDir);
  return normalizeResult(run);
};

const cleanup = async (dir) => {
  try {
    await fs.rm(dir, { recursive: true, force: true });
  } catch {
    /* noop */
  }
};

const normalizeResult = ({ stdout, stderr, timedOut }) => {
  if (timedOut) {
    return { output: stdout, error: "Execution timed out" };
  }
  if (stderr) {
    return { output: stdout, error: stderr };
  }
  return { output: stdout, error: null };
};

export default { executeCode };

