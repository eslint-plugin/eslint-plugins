import path from "node:path";

const driveLetterRegex = /^([A-Za-z]:)/;
const uncPathRegex = /^\\\\/;

function getNodeModulesDirs(absoluteStart, modules) {
  let prefix = "/";
  if (driveLetterRegex.test(absoluteStart)) {
    prefix = "";
  } else if (uncPathRegex.test(absoluteStart)) {
    prefix = "\\\\";
  }

  const paths = [absoluteStart];
  let parsed = path.parse(absoluteStart);
  while (parsed.dir !== paths[paths.length - 1]) {
    paths.push(parsed.dir);
    parsed = path.parse(parsed.dir);
  }

  return paths.reduce(function (dirs, aPath) {
    return dirs.concat(
      modules.map(function (moduleDir) {
        return path.resolve(prefix, aPath, moduleDir);
      }),
    );
  }, []);
}

export default function nodeModulesPaths(start, opts, request) {
  const modules =
    opts && opts.moduleDirectory
      ? [].concat(opts.moduleDirectory)
      : ["node_modules"];

  if (opts && typeof opts.paths === "function") {
    return opts.paths(
      request,
      start,
      function () {
        return getNodeModulesDirs(start, modules);
      },
      opts,
    );
  }

  const dirs = getNodeModulesDirs(start, modules);
  return opts && opts.paths ? dirs.concat(opts.paths) : dirs;
}
