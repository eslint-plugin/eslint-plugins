import { describe, it, expect, mock } from "bun:test";

const espree = require("espree");

const ast = require("../../src/util/ast");

const traverseReturns = ast.traverseReturns;
const isFunctionLike = ast.isFunctionLike;

const DEFAULT_CONFIG = {
  ecmaVersion: 6,
};

const parseCode = (code) => {
  const ASTnode = espree.parse(code, DEFAULT_CONFIG);
  return ASTnode.body[0];
};

const mockContext = {};

describe("ast", () => {
  describe("traverseReturnStatements", () => {
    it("Correctly traverses function declarations", () => {
      const spy = mock(() => {});
      traverseReturns(
        parseCode(`
        function foo({prop}) {
          return;
        }
      `),
        mockContext,
        spy,
      );

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it("Correctly traverses function expressions", () => {
      const spy = mock(() => {});
      traverseReturns(
        parseCode(`
        const foo = function({prop}) {
          return;
        }
      `).declarations[0].init,
        mockContext,
        spy,
      );

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it("Correctly traverses arrow functions", () => {
      const spy = mock(() => {});

      // Test block body
      traverseReturns(
        parseCode(`
        ({prop}) => {
          return;
        }
      `).expression,
        mockContext,
        spy,
      );
      expect(spy).toHaveBeenCalledTimes(1);

      // Reset for second test
      spy.mockClear();

      // Test implicit return
      traverseReturns(
        parseCode(`
        ({prop}) => 'something'
      `).expression,
        mockContext,
        spy,
      );
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it("Correctly traverses inside control flow expressions", () => {
      const spy = mock(() => {});
      traverseReturns(
        parseCode(`
        function foo({prop}) {
          if (prop) {
            return 0;
          } else {
            return 1;
          }

          while(prop) {
            return 2;
          }

          for (;;) {
            return 3;
          }

          switch (prop) {
            case 'a':
              return 4;
            default:
              return 5;
          }

          const foo = () => 'not valid';
        }
      `),
        mockContext,
        spy,
      );

      expect(spy).toHaveBeenCalledTimes(6);

      // Verify each call's first argument value matches index
      spy.mock.calls.forEach((call, idx) => {
        expect(call[0].value).toBe(idx);
      });
    });
  });

  describe("isFunctionLike()", () => {
    it("FunctionDeclaration should return true", () => {
      const node1 = parseCode(`
        function foo(bar) {
          const asdf = () => 'zxcv';
          return asdf;
        }
      `);
      expect(isFunctionLike(node1)).toBe(true);

      const node2 = parseCode(`
        function foo({bar}) {
          const asdf = () => 'zxcv';
          console.log(bar);
          return '5'
        }
      `);
      expect(isFunctionLike(node2)).toBe(true);
    });

    it("FunctionExpression should return true", () => {
      const node1 = parseCode(`
        const foo = function(bar) {
          return () => 'zxcv';
        }
      `).declarations[0].init;
      expect(isFunctionLike(node1)).toBe(true);

      const node2 = parseCode(`
        const foo = function ({bar}) {
          return '5';
        }
      `).declarations[0].init;
      expect(isFunctionLike(node2)).toBe(true);
    });

    it("ArrowFunctionExpression should return true", () => {
      const node1 = parseCode(`
        (bar) => {
          return () => 'zxcv';
        }
      `).expression;
      expect(isFunctionLike(node1)).toBe(true);

      const node2 = parseCode(`
        ({bar}) => '5';
      `).expression;
      expect(isFunctionLike(node2)).toBe(true);

      const node3 = parseCode(`
        bar => '5';
      `).expression;
      expect(isFunctionLike(node3)).toBe(true);
    });

    it("Non-functions should return false", () => {
      const node1 = parseCode(`
        class bar {
          a() {
            return 'a';
          }
        }
      `);
      expect(isFunctionLike(node1)).toBe(false);

      const node2 = parseCode(`
        const a = 5;
      `);
      expect(isFunctionLike(node2)).toBe(false);
    });
  });
});
