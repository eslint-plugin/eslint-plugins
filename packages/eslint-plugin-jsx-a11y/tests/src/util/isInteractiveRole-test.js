import { elementType } from "@eslintplugin/jsx-ast-utils";
import test from "tape";

import {
  genElementSymbol,
  genInteractiveRoleElements,
  genNonInteractiveRoleElements,
} from "../../../__mocks__/genInteractives";
import isInteractiveRole from "../../../src/util/isInteractiveRole";

test("isInteractiveRole", (t) => {
  t.equal(
    isInteractiveRole(undefined, []),
    false,
    "identifies JSX Components (no tagName) as interactive role elements",
  );

  t.test("elements with a non-interactive role", (st) => {
    genNonInteractiveRoleElements().forEach(({ openingElement }) => {
      const { attributes } = openingElement;

      st.equal(
        isInteractiveRole(elementType(openingElement), attributes),
        false,
        `does NOT identify \`${genElementSymbol(openingElement)}\` as an interactive role element`,
      );
    });

    st.end();
  });

  t.equal(
    isInteractiveRole("div", []),
    false,
    "does NOT identify elements without a role as interactive role elements",
  );

  t.test("elements with an interactive role", (st) => {
    genInteractiveRoleElements().forEach(({ openingElement }) => {
      const { attributes } = openingElement;

      st.equal(
        isInteractiveRole(elementType(openingElement), attributes),
        true,
        `identifies \`${genElementSymbol(openingElement)}\` as an interactive role element`,
      );
    });

    st.end();
  });

  t.end();
});
