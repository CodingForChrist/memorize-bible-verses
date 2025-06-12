import { describe, it, expect } from "vitest";
import { greetings } from "./main";

describe("Lexer", () => {
  it("greetings", () => {
    expect(greetings).toBe("Hello vitest-ts!");
  });
});
