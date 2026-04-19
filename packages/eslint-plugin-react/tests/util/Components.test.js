import { describe, expect } from "bun:test";

const RuleTester = require("../helpers/ruleTester");
const Components = require("../../src/util/Components");
const parsers = require("../helpers/parsers");

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
});

describe("Components", () => {
  describe("static detect", () => {
    function testComponentsDetect(test, instructionsOrDone, orDone) {
      const done = orDone || instructionsOrDone;
      const instructions = orDone ? instructionsOrDone : instructionsOrDone;

      const rule = {
        create: Components.detect((context, components, util) => {
          const instructionResults = [];

          const augmentedInstructions = Object.fromEntries(
            Object.entries(instructions || {}).map((nodeTypeAndHandler) => {
              const nodeType = nodeTypeAndHandler[0];
              const handler = nodeTypeAndHandler[1];
              return [
                nodeType,
                (node) => {
                  instructionResults.push({
                    type: nodeType,
                    result: handler(node, context, components, util),
                  });
                },
              ];
            }),
          );

          return Object.assign({}, augmentedInstructions, {
            "Program:exit"(node) {
              if (augmentedInstructions["Program:exit"]) {
                augmentedInstructions["Program:exit"](
                  node,
                  context,
                  components,
                  util,
                );
              }
              done(components, instructionResults);
            },
          });
        }),
      };

      const tests = {
        valid: parsers.all([
          Object.assign({}, test, {
            settings: {
              react: {
                version: "detect",
              },
            },
          }),
        ]),
        invalid: [],
      };

      ruleTester.run(test.code, rule, tests);
    }

    describe("should detect Stateless Function Component", () => {
      testComponentsDetect(
        {
          code: `import React from 'react'
          function MyStatelessComponent() {
            return <React.Fragment />;
          }`,
        },
        (components) => {
          expect(components.length()).toBe(1);
          Object.values(components.list()).forEach((component) => {
            expect(component.node.id.name).toBe("MyStatelessComponent");
          });
        },
      );
    });

    describe("should detect Class Components", () => {
      testComponentsDetect(
        {
          code: `import React from 'react'
        class MyClassComponent extends React.Component {
          render() {
            return <React.Fragment />;
          }
        }`,
        },
        (components) => {
          expect(components.length()).toBe(1);
          Object.values(components.list()).forEach((component) => {
            expect(component.node.id.name).toBe("MyClassComponent");
          });
        },
      );
    });

    describe("should detect React Imports", () => {
      testComponentsDetect(
        {
          code: "import React, { useCallback, useState } from 'react'",
        },
        (components) => {
          const defaultImports = components
            .getDefaultReactImports()
            .map((s) => s.local.name);
          expect(defaultImports).toEqual(["React"]);

          const namedImports = components
            .getNamedReactImports()
            .map((s) => s.local.name);
          expect(namedImports).toEqual(["useCallback", "useState"]);
        },
      );
    });

    describe("utils", () => {
      describe("isReactHookCall", () => {
        describe("should not identify hook-like call", () => {
          testComponentsDetect(
            {
              code: `
              import { useRef } from 'react'
              function useColor() {
                return useState()
              }
            `,
            },
            {
              CallExpression: (node, _context, _components, util) =>
                util.isReactHookCall(node),
            },
            (_components, instructionResults) => {
              expect(instructionResults).toEqual([
                { type: "CallExpression", result: false },
              ]);
            },
          );
        });

        describe("should identify hook call", () => {
          testComponentsDetect(
            {
              code: `
              import { useState } from 'react'
              function useColor() {
                return useState()
              }
            `,
            },
            {
              CallExpression: (node, _context, _components, util) =>
                util.isReactHookCall(node),
            },
            (_components, instructionResults) => {
              expect(instructionResults).toEqual([
                { type: "CallExpression", result: true },
              ]);
            },
          );
        });

        describe("should identify aliased hook call", () => {
          testComponentsDetect(
            {
              code: `
              import { useState as useStateAlternative } from 'react'
              function useColor() {
                return useStateAlternative()
              }
            `,
            },
            {
              CallExpression: (node, _context, _components, util) =>
                util.isReactHookCall(node),
            },
            (_components, instructionResults) => {
              expect(instructionResults).toEqual([
                { type: "CallExpression", result: true },
              ]);
            },
          );
        });

        describe("should identify aliased present named hook call", () => {
          testComponentsDetect(
            {
              code: `
              import { useState as useStateAlternative } from 'react'
              function useColor() {
                return useStateAlternative()
              }
            `,
            },
            {
              CallExpression: (node, _context, _components, util) =>
                util.isReactHookCall(node, ["useState"]),
            },
            (_components, instructionResults) => {
              expect(instructionResults).toEqual([
                { type: "CallExpression", result: true },
              ]);
            },
          );
        });

        describe("should not identify shadowed hook call", () => {
          testComponentsDetect(
            {
              code: `
              import { useState } from 'react'
              function useColor() {
                function useState() {
                  return null
                }
                return useState()
              }
            `,
            },
            {
              CallExpression: (node, _context, _components, util) =>
                util.isReactHookCall(node),
            },
            (_components, instructionResults) => {
              expect(instructionResults).toEqual([
                { type: "CallExpression", result: false },
              ]);
            },
          );
        });

        describe("should identify React hook call", () => {
          testComponentsDetect(
            {
              code: `
              import React from 'react'
              function useColor() {
                return React.useState()
              }
            `,
            },
            {
              CallExpression: (node, _context, _components, util) =>
                util.isReactHookCall(node),
            },
            (_components, instructionResults) => {
              expect(instructionResults).toEqual([
                { type: "CallExpression", result: true },
              ]);
            },
          );
        });

        describe("should identify aliased React hook call", () => {
          testComponentsDetect(
            {
              code: `
              import ReactAlternative from 'react'
              function useColor() {
                return ReactAlternative.useState()
              }
            `,
            },
            {
              CallExpression: (node, _context, _components, util) =>
                util.isReactHookCall(node),
            },
            (_components, instructionResults) => {
              expect(instructionResults).toEqual([
                { type: "CallExpression", result: true },
              ]);
            },
          );
        });

        describe("should not identify shadowed React hook call", () => {
          testComponentsDetect(
            {
              code: `
              import React from 'react'
              function useColor() {
                const React = {
                  useState: () => null
                }
                return React.useState()
              }
            `,
            },
            {
              CallExpression: (node, _context, _components, util) =>
                util.isReactHookCall(node),
            },
            (_components, instructionResults) => {
              expect(instructionResults).toEqual([
                { type: "CallExpression", result: false },
              ]);
            },
          );
        });

        describe("should identify present named hook call", () => {
          testComponentsDetect(
            {
              code: `
              import { useState } from 'react'
              function useColor() {
                return useState()
              }
            `,
            },
            {
              CallExpression: (node, _context, _components, util) =>
                util.isReactHookCall(node, ["useState"]),
            },
            (_components, instructionResults) => {
              expect(instructionResults).toEqual([
                { type: "CallExpression", result: true },
              ]);
            },
          );
        });

        describe("should not identify missing named hook call", () => {
          testComponentsDetect(
            {
              code: `
              import { useState } from 'react'
              function useColor() {
                return useState()
              }
            `,
            },
            {
              CallExpression: (node, _context, _components, util) =>
                util.isReactHookCall(node, ["useRef"]),
            },
            (_components, instructionResults) => {
              expect(instructionResults).toEqual([
                { type: "CallExpression", result: false },
              ]);
            },
          );
        });
      });
    });

    describe("testComponentsDetect", () => {
      describe("should log Program:exit instruction", () => {
        testComponentsDetect(
          {
            code: "",
          },
          {
            "Program:exit": () => true,
          },
          (_components, instructionResults) => {
            expect(instructionResults).toEqual([
              { type: "Program:exit", result: true },
            ]);
          },
        );
      });
    });
  });
});
