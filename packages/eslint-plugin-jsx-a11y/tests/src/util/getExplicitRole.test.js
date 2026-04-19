import { expect, it } from "bun:test";

import JSXAttributeMock from "../../../__mocks__/JSXAttributeMock";
import getExplicitRole from "../../../src/util/getExplicitRole";

it("getExplicitRole", () => {
  expect(getExplicitRole("div", [JSXAttributeMock("role", "button")])).toBe(
    "button",
  );

  expect(
    getExplicitRole("div", [JSXAttributeMock("role", "beeswax")]),
  ).toBeNull();

  expect(getExplicitRole("div", [])).toBeNull();
});
