import { Router } from 'express';
import { Marked } from 'marked';
import fs from 'fs';
import path from 'path';
import scanDirectory from '../util/scanDirectory.js';
import testPrint from '../util/testPrint.js';

const router = Router();
const marked = new Marked();
const DOCS_DIR = path.resolve('docs');
const STRUCTURE = () => scanDirectory(DOCS_DIR);

// --- Routes ---
router.get('/structure', (req, res) => {
	const result = STRUCTURE();
	res.json(result);
});

router.get('/content/:path(*)', (req, res) => {
	const filePath = path.resolve(DOCS_DIR, req.params.path);

	if (!fs.existsSync(filePath)) {
		return res.status(404).json({ error: 'Not found' });
	}

	const mdContent = fs.readFileSync(filePath, 'utf-8');
	const htmlContent = marked.parse(mdContent);

	if (process.env.NODE_ENV === 'dev') {
		testPrint(mdContent, htmlContent);
	}

	res.json({ content: htmlContent });
});

// --- Export ---
export default router;
