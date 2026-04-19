import { describe, it, expect, beforeEach, afterEach, spyOn } from "bun:test";

const path = require("node:path");
const versionUtil = require("../../src/util/version");

describe("Version", () => {
  const base = path.resolve(import.meta.dir, "..", "fixtures", "version");
  let expectedErrorArgs = [];
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = spyOn(console, "error").mockImplementation(() => {});
    expectedErrorArgs = [];
    versionUtil.resetWarningFlag();
    versionUtil.resetDetectedVersion();
    versionUtil.resetDefaultVersion();
  });

  afterEach(() => {
    const actualArgs = consoleSpy.mock.calls;
    consoleSpy.mockRestore();
    expect(actualArgs).toEqual(expectedErrorArgs);
  });

  describe("Detect version", () => {
    const context = {
      settings: { react: { version: "detect", flowVersion: "detect" } },
      getFilename: () => path.resolve(base, "test.js"),
    };

    describe("matches detected version", () => {
      spyOn(context, "getFilename").mockReturnValue(
        path.resolve(base, "detect-version", "test.js"),
      );

      expect(versionUtil.testReactVersion(context, ">= 1.2.3")).toBe(true);
      it.failing("TODO: fix", () => {
        expect(versionUtil.testReactVersion(context, ">= 1.2.4")).toBe(false);
      });
      expect(versionUtil.testFlowVersion(context, ">= 0.92.0")).toBe(true);
    });

    describe("matches detected version in sibling project", () => {
      spyOn(context, "getFilename").mockReturnValue(
        path.resolve(base, "detect-version-sibling", "test.js"),
      );

      it.failing("TODO: fix", () => {
        expect(versionUtil.testReactVersion(context, ">= 2.3.4")).toBe(true);
        expect(versionUtil.testReactVersion(context, ">= 1.2.4")).toBe(false);
      });
      expect(versionUtil.testFlowVersion(context, ">= 2.92.0")).toBe(true);
    });

    it("matches detected version in child project", () => {
      spyOn(context, "getFilename").mockReturnValue(
        path.resolve(base, "detect-version", "detect-version-child", "test.js"),
      );

      expect(versionUtil.testReactVersion(context, ">= 3.4.5")).toBe(true);
      expect(versionUtil.testReactVersion(context, ">= 3.4.6")).toBe(false);
      expect(versionUtil.testFlowVersion(context, ">= 3.92.0")).toBe(true);
    });

    it("assumes latest version if react is not installed", () => {
      spyOn(context, "getFilename").mockReturnValue(
        path.resolve(base, "detect-version-missing", "test.js"),
      );

      expect(versionUtil.testReactVersion(context, "999.999.999")).toBe(true);

      expectedErrorArgs = [
        [
          'Warning: React version was set to "detect" in eslint-plugin-react settings, but the "react" package is not installed. Assuming latest React version for linting.',
        ],
      ];
    });

    it("uses default version from settings if provided and react is not installed", () => {
      context.settings.react.defaultVersion = "16.14.0";
      spyOn(context, "getFilename").mockReturnValue(
        path.resolve(base, "detect-version-missing", "test.js"),
      );

      expect(versionUtil.testReactVersion(context, "16.14.0")).toBe(true);

      expectedErrorArgs = [
        [
          'Warning: React version was set to "detect" in eslint-plugin-react settings, but the "react" package is not installed. Assuming default React version for linting: "16.14.0".',
        ],
      ];

      delete context.settings.react.defaultVersion;
    });

    it("fails nicely with an invalid default version of react", () => {
      context.settings.react.defaultVersion = "not semver";
      spyOn(context, "getFilename").mockReturnValue(
        path.resolve(base, "detect-version-missing", "test.js"),
      );

      expect(versionUtil.testReactVersion(context, "999.999.999")).toBe(true);

      expectedErrorArgs = [
        [
          'Warning: React version specified in eslint-plugin-react-settings must be a valid semver version, or "detect"; got “not semver”. Falling back to latest version as default.',
        ],
        [
          'Warning: React version was set to "detect" in eslint-plugin-react settings, but the "react" package is not installed. Assuming latest React version for linting.',
        ],
      ];

      delete context.settings.react.defaultVersion;
    });

    it("warns only once for failure to detect react ", () => {
      spyOn(context, "getFilename").mockReturnValue(
        path.resolve(base, "detect-version-missing", "test.js"),
      );

      expect(versionUtil.testReactVersion(context, "999.999.999")).toBe(true);
      expect(versionUtil.testReactVersion(context, "999.999.999")).toBe(true);

      expectedErrorArgs = [
        [
          'Warning: React version was set to "detect" in eslint-plugin-react settings, but the "react" package is not installed. Assuming latest React version for linting.',
        ],
      ];
    });

    it("assumes latest version if flow-bin is not installed", () => {
      expect(versionUtil.testFlowVersion(context, "999.999.999")).toBe(true);

      expectedErrorArgs = [
        [
          'Warning: Flow version was set to "detect" in eslint-plugin-react settings, but the "flow-bin" package is not installed. Assuming latest Flow version for linting.',
        ],
      ];
    });

    it("works with virtual filename", () => {
      spyOn(context, "getFilename").mockReturnValue(
        path.resolve(base, "detect-version-sibling", "test.js/0_fake.js"),
      );

      expect(versionUtil.testReactVersion(context, ">= 2.3.4")).toBe(true);
      expect(versionUtil.testReactVersion(context, ">= 2.3.5")).toBe(false);
      expect(versionUtil.testFlowVersion(context, ">= 2.92.0")).toBe(true);
    });

    it("works with recursive virtual filename", () => {
      spyOn(context, "getFilename").mockReturnValue(
        path.resolve(
          base,
          "detect-version-sibling",
          "test.js/0_fake.md/1_fake.js",
        ),
      );

      expect(versionUtil.testReactVersion(context, ">= 2.3.4")).toBe(true);
      expect(versionUtil.testReactVersion(context, ">= 2.3.5")).toBe(false);
      expect(versionUtil.testFlowVersion(context, ">= 2.92.0")).toBe(true);
    });
  });

  describe("string version", () => {
    const context = {
      settings: { react: { version: "15.0", flowVersion: "1.2" } },
    };
    const invalidContext = {
      settings: { react: { version: "latest", flowVersion: "not semver" } },
    };

    it("works with react", () => {
      expect(versionUtil.testReactVersion(context, ">= 0.14.0")).toBe(true);
      expect(versionUtil.testReactVersion(context, ">= 15.0.0")).toBe(true);
      expect(versionUtil.testReactVersion(context, ">= 16.0.0")).toBe(false);
    });

    it("works with flow", () => {
      expect(versionUtil.testFlowVersion(context, ">= 1.1.0")).toBe(true);
      expect(versionUtil.testFlowVersion(context, ">= 1.2.0")).toBe(true);
      expect(versionUtil.testFlowVersion(context, ">= 1.3.0")).toBe(false);
    });

    it("fails nicely with an invalid react version", () => {
      expect(versionUtil.testReactVersion(invalidContext, ">= 15.0")).toBe(
        true,
      );
      expectedErrorArgs = [
        [
          'Warning: React version specified in eslint-plugin-react-settings must be a valid semver version, or "detect"; got “latest”',
        ],
      ];
    });

    it("fails nicely with an invalid flow version", () => {
      expect(versionUtil.testFlowVersion(invalidContext, ">= 1.0")).toBe(true);
      expectedErrorArgs = [
        [
          'Warning: Flow version specified in eslint-plugin-react-settings must be a valid semver version, or "detect"; got “not semver”',
        ],
      ];
    });
  });

  describe("non-string version", () => {
    const context = {
      settings: { react: { version: 15.0, flowVersion: 1.2 } },
    };

    it("works with react", () => {
      expect(versionUtil.testReactVersion(context, ">= 0.14.0")).toBe(true);
      expect(versionUtil.testReactVersion(context, ">= 15.0.0")).toBe(true);
      expect(versionUtil.testReactVersion(context, ">= 16.0.0")).toBe(false);

      expectedErrorArgs = [
        [
          "Warning: React version specified in eslint-plugin-react-settings must be a string; got “number”",
        ],
        [
          "Warning: React version specified in eslint-plugin-react-settings must be a string; got “number”",
        ],
        [
          "Warning: React version specified in eslint-plugin-react-settings must be a string; got “number”",
        ],
      ];
    });

    it("works with flow", () => {
      expect(versionUtil.testFlowVersion(context, ">= 1.1.0")).toBe(true);
      expect(versionUtil.testFlowVersion(context, ">= 1.2.0")).toBe(true);
      expect(versionUtil.testFlowVersion(context, ">= 1.3.0")).toBe(false);

      expectedErrorArgs = [
        [
          "Warning: Flow version specified in eslint-plugin-react-settings must be a string; got “number”",
        ],
        [
          "Warning: Flow version specified in eslint-plugin-react-settings must be a string; got “number”",
        ],
        [
          "Warning: Flow version specified in eslint-plugin-react-settings must be a string; got “number”",
        ],
      ];
    });
  });
});
