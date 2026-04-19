/** @type {(x: string) => { __proto__: null, name: string, subpath: string }} */
export default function parsePackageSpecifier(x) {
  if (x.charAt(0) === "@") {
    const slashIndex = x.indexOf("/");
    if (slashIndex === -1) {
      return {
        __proto__: null,
        name: x,
        subpath: ".",
      };
    }
    const secondSlash = x.indexOf("/", slashIndex + 1);
    if (secondSlash === -1) {
      return {
        __proto__: null,
        name: x,
        subpath: ".",
      };
    }
    return {
      __proto__: null,
      name: x.slice(0, secondSlash),
      subpath: "." + x.slice(secondSlash),
    };
  }
  const firstSlash = x.indexOf("/");
  if (firstSlash === -1) {
    return {
      __proto__: null,
      name: x,
      subpath: ".",
    };
  }
  return {
    __proto__: null,
    name: x.slice(0, firstSlash),
    subpath: "." + x.slice(firstSlash),
  };
}
