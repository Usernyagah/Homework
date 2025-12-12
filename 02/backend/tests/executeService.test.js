import { describe, it, expect } from "vitest";
import executeService from "../src/services/executeService.js";

describe("executeService", () => {
  it("executes JavaScript safely", async () => {
    const { output, error } = await executeService.executeCode({
      language: "javascript",
      code: "const x = 2 + 3; console.log(x); x;",
    });
    expect(error).toBeNull();
    expect(output).toMatch(/5/);
  });

  it("rejects unsupported language", async () => {
    const { error } = await executeService.executeCode({
      language: "unknown",
      code: "print(1)",
    });
    expect(error).toBeTruthy();
  });
});

