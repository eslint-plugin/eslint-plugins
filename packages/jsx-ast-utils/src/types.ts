export type * as ESTree from "estree";
export type * as ESTreeJSX from "estree-jsx";

export interface GetPropOptions {
  /**
   * Ignores casing differences in the prop name. Enabled by default.
   * @default true
   */
  ignoreCase?: boolean;
}

export interface HasPropOptions extends GetPropOptions {
  /**
   * Assumes target property is not in a spread expression applied
   * to the element. For example `<div {...props} />` looking for
   * specific prop here will return false if `spreadStrict` is true.
   * Enabled by default.
   * @default true
   */
  spreadStrict?: boolean;
}
