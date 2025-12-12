import { VM } from "vm2";

export const runJavascriptSandbox = (code, timeout = 2000) => {
  const logs = [];

  const safeConsole = {
    log: (...args) => logs.push(args.map(formatValue).join(" ")),
    error: (...args) => logs.push(args.map(formatValue).join(" ")),
  };

  try {
    const vm = new VM({
      timeout,
      sandbox: { console: safeConsole },
      eval: false,
      wasm: false,
    });

    const result = vm.run(code ?? "");
    const resultString =
      typeof result === "undefined" ? "" : formatValue(result);
    const outputLines = [...logs];
    if (resultString) {
      outputLines.push(resultString);
    }

    return { output: outputLines.join("\n"), error: null };
  } catch (err) {
    return { output: logs.join("\n"), error: err?.message ?? "Execution error" };
  }
};

const formatValue = (val) => {
  if (typeof val === "string") return val;
  if (typeof val === "number" || typeof val === "boolean") return String(val);
  try {
    return JSON.stringify(val);
  } catch {
    return "[unserializable]";
  }
};

