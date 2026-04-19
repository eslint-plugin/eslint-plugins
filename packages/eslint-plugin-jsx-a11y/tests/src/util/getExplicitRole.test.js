import { describe, expect, it } from "bun:test";

import JSXAttributeMock from "../../../__mocks__/JSXAttributeMock";
import getExplicitRole from "../../../src/util/getExplicitRole";

describe("getExplicitRole", () => {
  it("returns the role when a valid role attribute is provided", () => {
    expect(getExplicitRole("div", [JSXAttributeMock("role", "button")])).toBe(
      "button",
    );
  });

  it("returns null when an invalid role attribute is provided", () => {
    expect(getExplicitRole("div", [JSXAttributeMock("role", "beeswax")])).toBe(
      null,
    );
  });

  it("returns null when no role attribute is present", () => {
    expect(getExplicitRole("div", [])).toBe(null);
  });
});
