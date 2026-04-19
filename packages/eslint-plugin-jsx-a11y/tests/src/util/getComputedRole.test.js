import { describe, expect, it } from "bun:test";

import JSXAttributeMock from "../../../__mocks__/JSXAttributeMock";
import getComputedRole from "../../../src/util/getComputedRole";

describe("getComputedRole", () => {
  it("returns the explicit role when it is valid", () => {
    expect(getComputedRole("div", [JSXAttributeMock("role", "button")])).toBe(
      "button",
    );
  });

  it("returns the implicit role when an explicit role is invalid", () => {
    expect(getComputedRole("li", [JSXAttributeMock("role", "beeswax")])).toBe(
      "listitem",
    );
  });

  it("returns null when an explicit role is invalid and there is no implicit role", () => {
    expect(getComputedRole("div", [JSXAttributeMock("role", "beeswax")])).toBe(
      null,
    );
  });

  it("returns the implicit role when no role attribute is present", () => {
    expect(getComputedRole("li", [])).toBe("listitem");
  });

  it("returns null when no role attribute is present and there is no implicit role", () => {
    expect(getComputedRole("div", [])).toBe(null);
  });

  it("returns the implicit role for elements with built-in roles", () => {
    expect(getComputedRole("li", [JSXAttributeMock("role", "beeswax")])).toBe(
      "listitem",
    );
  });

  it("returns null when the element lacks an implicit role", () => {
    expect(getComputedRole("div", [])).toBe(null);
  });
});
