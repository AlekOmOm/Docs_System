import { options } from 'marked';
import { readPage, constructPage } from './templatingEngine.js';

const index = readPage('./public/pages/index/index.html');

/**
 * @description Index page
 * @returns {string} HTML
 */

export const indexPage = constructPage(index, {
	title: 'Notes of a Dev',
	cssLinks:
		`<link rel="stylesheet" href="/css/styles.css">` +
		`<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css" />`,
});
