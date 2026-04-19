import { describe, expect, it } from "bun:test";

import getImplicitRole from "../../../src/util/getImplicitRole";

describe("getImplicitRole", () => {
  it("returns the implicit role when it exists", () => {
    expect(getImplicitRole("li", [])).toBe("listitem");
  });

  it("returns null when the element lacks an implicit role", () => {
    expect(getImplicitRole("div", [])).toBe(null);
  });
});
