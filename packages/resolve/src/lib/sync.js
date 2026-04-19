import fs from "node:fs";
import { isBuiltin } from "node:module";
import os from "node:os";
import path from "node:path";

import getCategoriesForRange from "#node-exports-info/getCategoriesForRange";
import getCategoryInfo from "#node-exports-info/getCategoryInfo";

import caller from "./caller";
import resolveExports from "./exports-resolve";
import getExportsCategory from "./get-exports-category";
import nodeModulesPaths from "./node-modules-paths";
import normalizeOptions from "./normalize-options";
import parsePackageSpecifier from "./parse-package-specifier";
import selectMostRestrictive from "./select-most-restrictive";

const realpathFS =
  process.platform !== "win32" ? fs.realpathSync.native : fs.realpathSync;

const relativePathRegex = /^(?:\.\.?(?:\/|$)|\/|([A-Za-z]:)?[/\\])/;
const windowsDriveRegex = /^\w:[/\\]*$/;
const nodeModulesRegex = /[/\\]node_modules[/\\]*$/;

const homedir = os.homedir();
function defaultPaths() {
  if (!homedir) return [];
  return [
    path.join(homedir, ".node_modules"),
    path.join(homedir, ".node_libraries"),
  ];
}

const defaultIsFile = function isFile(file) {
  let stat;
  try {
    stat = fs.statSync(file, { throwIfNoEntry: false });
  } catch (e) {
    if (e && (e.code === "ENOENT" || e.code === "ENOTDIR")) return false;
    throw e;
  }
  return !!stat && (stat.isFile() || stat.isFIFO());
};

const defaultIsDir = function isDirectory(dir) {
  let stat;
  try {
    stat = fs.statSync(dir, { throwIfNoEntry: false });
  } catch (e) {
    if (e && (e.code === "ENOENT" || e.code === "ENOTDIR")) return false;
    throw e;
  }
  return !!stat && stat.isDirectory();
};

const defaultRealpathSync = function realpathSync(x) {
  try {
    return realpathFS(x);
  } catch (realpathErr) {
    if (realpathErr.code !== "ENOENT") {
      throw realpathErr;
    }
  }
  return x;
};

function maybeRealpathSync(realpathSync, x, opts) {
  if (!opts || !opts.preserveSymlinks) {
    return realpathSync(x);
  }
  return x;
}

function defaultReadPackageSync(readFileSync, pkgfile) {
  return JSON.parse(readFileSync(pkgfile));
}

function getPackageCandidates(x, start, opts) {
  const dirs = nodeModulesPaths(start, opts, x);
  for (let i = 0; i < dirs.length; i++) {
    dirs[i] = path.join(dirs[i], x);
  }
  return dirs;
}

function findConsumerPackageSync(
  startDir,
  isFile,
  readPackageSync,
  readFileSync,
) {
  let dir = path.resolve(startDir);
  while (true) {
    const pkgfile = path.join(dir, "package.json");
    if (isFile(pkgfile)) {
      try {
        return readPackageSync(readFileSync, pkgfile);
      } catch (e) {
        if (!(e instanceof SyntaxError)) {
          throw e;
        }
      }
    }
    const parentDir = path.dirname(dir);
    if (parentDir === dir) {
      return null;
    }
    dir = parentDir;
  }
}

function findPackageWithDirSync(
  startDir,
  isFile,
  readPackageSync,
  readFileSync,
) {
  let dir = path.resolve(startDir);
  while (true) {
    // Stop at node_modules boundaries - can't self-reference across node_modules
    if (nodeModulesRegex.test(dir)) {
      return null;
    }
    const pkgfile = path.join(dir, "package.json");
    if (isFile(pkgfile)) {
      try {
        const pkg = readPackageSync(readFileSync, pkgfile);
        return {
          __proto__: null,
          pkg: pkg,
          dir: dir,
        };
      } catch (e) {
        if (!(e instanceof SyntaxError)) {
          throw e;
        }
      }
    }
    const parentDir = path.dirname(dir);
    if (parentDir === dir) {
      return null;
    }
    dir = parentDir;
  }
}

export default function resolveSync(x, options) {
  if (typeof x !== "string") {
    throw new TypeError("Path must be a string.");
  }
  const opts = normalizeOptions(x, options);

  const isFile = opts.isFile || defaultIsFile;
  const isDirectory = opts.isDirectory || defaultIsDir;
  const readFileSync = opts.readFileSync || fs.readFileSync;
  const realpathSync = opts.realpathSync || defaultRealpathSync;
  const readPackageSync = opts.readPackageSync || defaultReadPackageSync;
  if (opts.readFileSync && opts.readPackageSync) {
    throw new TypeError(
      "`readFileSync` and `readPackageSync` are mutually exclusive.",
    );
  }
  const packageIterator = opts.packageIterator;

  const extensions = opts.extensions || [".js"];
  const includeCoreModules = opts.includeCoreModules !== false;
  const basedir = opts.basedir || path.dirname(caller());
  const parent = opts.filename || basedir;

  opts.paths = opts.paths || defaultPaths();

  // Determine exports category
  let exportsCategory = getExportsCategory(opts);
  if (exportsCategory === "engines") {
    // Read consumer's package.json to get engines.node
    const consumerPkg = findConsumerPackageSync(
      basedir,
      isFile,
      readPackageSync,
      readFileSync,
    );
    if (consumerPkg && consumerPkg.engines && consumerPkg.engines.node) {
      const categories = getCategoriesForRange(consumerPkg.engines.node);
      exportsCategory = selectMostRestrictive(categories);
    } else {
      exportsCategory = null;
    }
  }

  const useExports =
    exportsCategory !== null && exportsCategory !== "pre-exports";

  // ensure that `basedir` is an absolute path at this point, resolving against the process' current working directory
  const absoluteStart = maybeRealpathSync(
    realpathSync,
    path.resolve(basedir),
    opts,
  );

  if (opts.basedir && !isDirectory(absoluteStart)) {
    const dirError = new TypeError(
      'Provided basedir "' +
        opts.basedir +
        '" is not a directory' +
        (opts.preserveSymlinks ? "" : ", or a symlink to a directory"),
    );
    dirError.code = "INVALID_BASEDIR";
    throw dirError;
  }

  if (relativePathRegex.test(x)) {
    let res = path.resolve(absoluteStart, x);
    if (x === "." || x === ".." || x.slice(-1) === "/") res += "/";
    const m = loadAsFileSync(res) || loadAsDirectorySync(res);
    if (m) return maybeRealpathSync(realpathSync, m, opts);
  } else if (includeCoreModules && isBuiltin(x)) {
    return x;
  } else if (useExports) {
    // Try self-reference resolution first
    const selfRef = resolveSelfReferenceSync(x, absoluteStart);
    if (selfRef) return maybeRealpathSync(realpathSync, selfRef, opts);
    const nE = loadNodeModulesWithExportsSync(x, absoluteStart);
    if (nE) return maybeRealpathSync(realpathSync, nE, opts);
  } else {
    const n = loadNodeModulesSync(x, absoluteStart);
    if (n) return maybeRealpathSync(realpathSync, n, opts);
  }

  const err = new Error("Cannot find module '" + x + "' from '" + parent + "'");
  err.code = "MODULE_NOT_FOUND";
  throw err;

  function resolveSelfReferenceSync(x, startDir) {
    const parsed = parsePackageSpecifier(x);
    const pkgInfo = findPackageWithDirSync(
      startDir,
      isFile,
      readPackageSync,
      readFileSync,
    );

    if (!pkgInfo || !pkgInfo.pkg || pkgInfo.pkg.name !== parsed.name) {
      return null; // Not a self-reference
    }

    let pkg = pkgInfo.pkg;
    const pkgDir = pkgInfo.dir;

    if (opts.packageFilter) {
      pkg = opts.packageFilter(pkg, path.join(pkgDir, "package.json"), pkgDir);
    }

    // If package has exports field, resolve via exports
    if (typeof pkg.exports !== "undefined") {
      const categoryInfo = getCategoryInfo(exportsCategory, "require");
      const conditions = opts.conditions || categoryInfo.conditions;
      const resolved = resolveExports(
        pkg.exports,
        parsed.subpath,
        conditions,
        categoryInfo.flags,
      );
      if (resolved) {
        const resolvedPath = path.resolve(pkgDir, resolved);
        if (isFile(resolvedPath)) {
          return resolvedPath;
        }
      }
      // exports field exists but didn't resolve - this is an error per Node semantics
      return undefined;
    }

    // No exports field - fall back to traditional resolution for self-reference
    // (Note: this matches Node's behavior where self-ref without exports uses main)
    if (parsed.subpath === ".") {
      return loadAsDirectorySync(pkgDir);
    }
    const subPath = path.join(pkgDir, parsed.subpath.slice(1));
    const sm = loadAsFileSync(subPath);
    if (sm) return sm;
    return loadAsDirectorySync(subPath);
  }

  function loadAsFileSync(x) {
    const pkg = loadpkg(path.dirname(x));

    if (pkg && pkg.dir && pkg.pkg && opts.pathFilter) {
      const rfile = path.relative(pkg.dir, x);
      const r = opts.pathFilter(pkg.pkg, x, rfile);
      if (r) {
        x = path.resolve(pkg.dir, r); // eslint-disable-line no-param-reassign
      }
    }

    if (isFile(x)) {
      return x;
    }

    for (let i = 0; i < extensions.length; i++) {
      const file = x + extensions[i];
      if (isFile(file)) {
        return file;
      }
    }
  }

  function loadpkg(dir) {
    if (dir === "" || dir === "/") return;
    if (process.platform === "win32" && windowsDriveRegex.test(dir)) {
      return;
    }
    if (nodeModulesRegex.test(dir)) return;

    const pkgfile = path.join(
      isDirectory(dir) ? maybeRealpathSync(realpathSync, dir, opts) : dir,
      "package.json",
    );

    if (!isFile(pkgfile)) {
      return loadpkg(path.dirname(dir));
    }

    let pkg;
    try {
      pkg = readPackageSync(readFileSync, pkgfile);
    } catch (e) {
      if (!(e instanceof SyntaxError)) {
        throw e;
      }
    }

    if (pkg && opts.packageFilter) {
      pkg = opts.packageFilter(pkg, pkgfile, dir);
    }

    return { pkg, dir };
  }

  function loadAsDirectorySync(x) {
    const pkgfile = path.join(
      isDirectory(x) ? maybeRealpathSync(realpathSync, x, opts) : x,
      "/package.json",
    );
    if (isFile(pkgfile)) {
      let pkg;
      try {
        pkg = readPackageSync(readFileSync, pkgfile);
      } catch {}

      if (pkg && opts.packageFilter) {
        pkg = opts.packageFilter(pkg, pkgfile, x);
      }

      if (pkg && pkg.main) {
        if (typeof pkg.main !== "string") {
          const mainError = new TypeError(
            "package “" + pkg.name + "” `main` must be a string",
          );
          mainError.code = "INVALID_PACKAGE_MAIN";
          throw mainError;
        }
        if (pkg.main === "." || pkg.main === "./") {
          pkg.main = "index";
        }
        try {
          const mainPath = path.resolve(x, pkg.main);
          const m = loadAsFileSync(mainPath);
          if (m) return m;
          const n = loadAsDirectorySync(mainPath);
          if (n) return n;
          const checkIndex = loadAsFileSync(path.resolve(x, "index"));
          if (checkIndex) return checkIndex;
        } catch {}
        const incorrectMainError = new Error(
          "Cannot find module '" +
            path.resolve(x, pkg.main) +
            '\'. Please verify that the package.json has a valid "main" entry',
        );
        incorrectMainError.code = "INCORRECT_PACKAGE_MAIN";
        throw incorrectMainError;
      }
    }

    return loadAsFileSync(path.join(x, "/index"));
  }

  function loadNodeModulesSync(x, start) {
    const thunk = function () {
      return getPackageCandidates(x, start, opts);
    };
    const dirs = packageIterator
      ? packageIterator(x, start, thunk, opts)
      : thunk();

    for (let i = 0; i < dirs.length; i++) {
      const dir = dirs[i];
      if (isDirectory(path.dirname(dir))) {
        const m = loadAsFileSync(dir);
        if (m) return m;
        const n = loadAsDirectorySync(dir);
        if (n) return n;
      }
    }
  }

  function loadNodeModulesWithExportsSync(x, start) {
    const parsed = parsePackageSpecifier(x);
    const categoryInfo = getCategoryInfo(exportsCategory, "require");
    const conditions = opts.conditions || categoryInfo.conditions;

    // Get candidate directories for the package name
    const thunk = function () {
      return getPackageCandidates(parsed.name, start, opts);
    };
    const dirs = packageIterator
      ? packageIterator(parsed.name, start, thunk, opts)
      : thunk();

    for (let i = 0; i < dirs.length; i++) {
      const pkgDir = dirs[i];
      if (isDirectory(pkgDir)) {
        const pkgfile = path.join(pkgDir, "package.json");
        if (isFile(pkgfile)) {
          let pkg;
          try {
            pkg = readPackageSync(readFileSync, pkgfile);
          } catch (e) {
            if (!(e instanceof SyntaxError)) {
              throw e;
            }
            pkg = null;
          }

          if (pkg) {
            if (opts.packageFilter) {
              pkg = opts.packageFilter(pkg, pkgfile, pkgDir);
            }

            // If package has exports field, use exports resolution
            if (typeof pkg.exports !== "undefined") {
              const resolved = resolveExports(
                pkg.exports,
                parsed.subpath,
                conditions,
                categoryInfo.flags,
              );
              if (resolved) {
                const resolvedPath = path.resolve(pkgDir, resolved);
                if (isFile(resolvedPath)) {
                  return resolvedPath;
                }
              }
              // exports field exists but didn't resolve - this is an error per Node semantics
              // (don't fall through to main/index)
              return undefined;
            }

            // No exports field, fall back to traditional resolution
            if (parsed.subpath === ".") {
              const result = loadAsDirectorySync(pkgDir);
              if (result) {
                return result;
              }
            } else {
              const subPath = path.join(pkgDir, parsed.subpath.slice(1));
              const sm = loadAsFileSync(subPath);
              if (sm) {
                return sm;
              }
              const sn = loadAsDirectorySync(subPath);
              if (sn) {
                return sn;
              }
            }
          }
        } else if (parsed.subpath === ".") {
          // No package.json, fall back to file/directory resolution
          const m = loadAsFileSync(pkgDir);
          if (m) {
            return m;
          }
          const n = loadAsDirectorySync(pkgDir);
          if (n) {
            return n;
          }
        } else {
          // No package.json, fall back to file/directory resolution for subpath
          const fullPath = path.join(pkgDir, parsed.subpath.slice(1));
          const m2 = loadAsFileSync(fullPath);
          if (m2) {
            return m2;
          }
          const n2 = loadAsDirectorySync(fullPath);
          if (n2) {
            return n2;
          }
        }
      }
    }
  }
}
