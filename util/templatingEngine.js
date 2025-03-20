import fs from 'fs';

export function readPage(path) {
	return fs.readFileSync(path).toString();
}

const header = readPage('./public/components/header/header.html');
const footer = readPage('./public/components/footer/footer.html');

// --- Export ---
/**
 * @module constructPage
 *
 * * @param {*} pageContent
 * * @param {Object} options
 * * @param {string} options.title
 * * @param {string} options.cssLinks
 * * @returns {string}
 */

export function constructPage(pageContent, options = {}) {
	return (
		header
			.replace('$NAV_TITLE$', options.title || 'Notes of a Dev')
			.replace('$CSS_LINKS$', options.cssLinks || '') +
		pageContent +
		footer
	);
}
