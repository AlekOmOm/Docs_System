import { readPage, constructPage } from './templatingEngine.js';

// Read the index page template
const indexTemplate = readPage('./public/pages/index/index.html');

/**
 * @description Index page with graph visualization
 * @returns {string} Complete HTML page
 */
export const indexPage = constructPage(indexTemplate, {
	title: 'Documentation Visualizer',
	cssLinks: `
        <link rel="stylesheet" href="/assets/css/styles.css">
        <link rel="stylesheet" href="/assets/css/main.css">
        <link rel="stylesheet" href="/assets/css/navbar.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css" />
    `,
	scripts: `
        <script src="https://d3js.org/d3.v7.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
        <script type="module" src="/assets/js/graph.js"></script>
        <script type="module" src="/assets/js/content.js"></script>
        <script type="module" src="/assets/js/graphContent.js"></script>
    `,
});
