import getRangePairs from "./getRangePairs";

/** @type {import('./isCategory')} */
export default function isCategory(category) {
  const all = getRangePairs();

  for (let i = 0; i < all.length; i++) {
    if (all[i][1] === category) {
      return true;
    }
  }
  return false;
}
