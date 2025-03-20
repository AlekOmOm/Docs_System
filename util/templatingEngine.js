import fs from 'fs';
import path from 'path';

/**
 * Reads a page from the filesystem
 * @param {string} filePath - Path to the file
 * @returns {string} Content of the file
 */
export function readPage(filePath) {
	try {
		return fs.readFileSync(path.resolve(filePath), 'utf-8');
	} catch (error) {
		console.error(`Error reading page at ${filePath}:`, error);
		return '';
	}
}

const header = readPage('./public/components/header/header.html');
const footer = readPage('./public/components/footer/footer.html');

/**
 * Constructs a complete HTML page by combining header, content, and footer
 *
 * @param {string} pageContent - HTML content to place between header and footer
 * @param {Object} options - Configuration options
 ** @param {string} options.title - Page title (replaces $NAV_TITLE$)
 ** @param {string} options.cssLinks - Additional CSS links (replaces $CSS_LINKS$)
 * @returns {string} Complete HTML page
 */

export function constructPage(pageContent = '', options = {}) {
	let processedHeader = header
		.replace('$NAV_TITLE$', options.title || 'Documentation Visualizer')
		.replace('$CSS_LINKS$', options.cssLinks || '');

	let processedFooter = footer;
	if (options.scripts) {
		processedFooter = processedFooter.replace(
			'</body>',
			`${options.scripts}\n</body>`,
		);
	}

	return processedHeader + pageContent + processedFooter;
}
