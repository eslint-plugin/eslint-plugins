import path from 'node:path'

const driveLetterRegex = /^([A-Za-z]:)/;
const uncPathRegex = /^\\\\/;

function getNodeModulesDirs(absoluteStart, modules) {
    var prefix = '/';
    if (driveLetterRegex.test(absoluteStart)) {
        prefix = '';
    } else if (uncPathRegex.test(absoluteStart)) {
        prefix = '\\\\';
    }

    var paths = [absoluteStart];
    var parsed = path.parse(absoluteStart);
    while (parsed.dir !== paths[paths.length - 1]) {
        paths.push(parsed.dir);
        parsed = path.parse(parsed.dir);
    }

    return paths.reduce(function (dirs, aPath) {
        return dirs.concat(modules.map(function (moduleDir) {
            return path.resolve(prefix, aPath, moduleDir);
        }));
    }, []);
}

export default function nodeModulesPaths(start, opts, request) {
    var modules = opts && opts.moduleDirectory
        ? [].concat(opts.moduleDirectory)
        : ['node_modules'];

    if (opts && typeof opts.paths === 'function') {
        return opts.paths(
            request,
            start,
            function () { return getNodeModulesDirs(start, modules); },
            opts
        );
    }

    var dirs = getNodeModulesDirs(start, modules);
    return opts && opts.paths ? dirs.concat(opts.paths) : dirs;
};
