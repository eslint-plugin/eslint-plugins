import { elementType } from "jsx-ast-utils";
import test from "tape";

import {
  genElementSymbol,
  genAbstractRoleElements,
  genNonAbstractRoleElements,
} from "../../../__mocks__/genInteractives";
import isAbstractRole from "../../../src/util/isAbstractRole";

test("isAbstractRole", (t) => {
  t.equal(
    isAbstractRole(undefined, []),
    false,
    "does NOT identify JSX Components (no tagName) as abstract role elements",
  );

  t.test("elements with an abstract role", (st) => {
    genAbstractRoleElements().forEach(({ openingElement }) => {
      const { attributes } = openingElement;
      st.equal(
        isAbstractRole(elementType(openingElement), attributes),
        true,
        `identifies \`${genElementSymbol(openingElement)}\` as an abstract role element`,
      );
    });

    st.end();
  });

  t.test("elements with a non-abstract role", (st) => {
    genNonAbstractRoleElements().forEach(({ openingElement }) => {
      const { attributes } = openingElement;
      st.equal(
        isAbstractRole(elementType(openingElement), attributes),
        false,
        `does NOT identify \`${genElementSymbol(openingElement)}\` as an abstract role element`,
      );
    });

    st.end();
  });

  t.end();
});
