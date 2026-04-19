import { satisfies } from 'semver';

import ranges from './ranges';

/** @type {import('./getCategory')} */
export default function getCategory() {
	const version = arguments.length > 0 ? arguments[0] : process.version;
	const rangeEntries = Object.entries(ranges);
	for (let i = 0; i < rangeEntries.length; i += 1) {
		const entry = rangeEntries[i];
		if (satisfies(version, entry[0])) {
			return entry[1];
		}
	}

	throw new RangeError('no category found for version ' + version);
};
