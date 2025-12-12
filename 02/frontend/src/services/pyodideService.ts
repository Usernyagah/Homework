// Lightweight Pyodide loader + runner for in-browser Python execution.
// Uses CDN-delivered Pyodide to avoid running Python on the server.

let pyodidePromise: Promise<any> | null = null;

const loadPyodideInstance = () => {
  if (!pyodidePromise) {
    pyodidePromise = import(
      "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.mjs"
    ).then(({ loadPyodide }) =>
      loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/" })
    );
  }
  return pyodidePromise;
};

export const runPython = async (code: string) => {
  const pyodide = await loadPyodideInstance();
  // Inject code into globals to avoid string interpolation issues.
  pyodide.globals.set("CODE_SNIPPET", code);

  try {
    await pyodide.runPythonAsync(`
import sys, io
_buffer = io.StringIO()
_stdout, _stderr = sys.stdout, sys.stderr
sys.stdout = _buffer
sys.stderr = _buffer
_error = None
try:
    exec(CODE_SNIPPET, {})
except Exception as e:
    _error = e
finally:
    sys.stdout = _stdout
    sys.stderr = _stderr
OUTPUT = _buffer.getvalue()
ERROR_STR = None if _error is None else str(_error)
`);

    const output = pyodide.globals.get("OUTPUT") as string;
    const error = pyodide.globals.get("ERROR_STR") as string | null;

    return {
      output: output || "Code executed successfully (no output)",
      error: error ?? undefined,
    };
  } finally {
    pyodide.globals.delete("CODE_SNIPPET");
    pyodide.globals.delete("OUTPUT");
    pyodide.globals.delete("ERROR_STR");
  }
};

