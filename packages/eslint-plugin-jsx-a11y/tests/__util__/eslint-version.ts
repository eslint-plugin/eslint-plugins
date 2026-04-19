import { version as eslintVersion } from "eslint/package.json";
import semver from "semver";

const eslintBefore10: boolean = semver.satisfies(eslintVersion, "< 10");

export { eslintBefore10 };
