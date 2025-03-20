import { Router } from 'express';

const router = Router();

import { indexPage } from '../util/pages.js';

// --- Routes ---

router.get('/', (req, res) => {
	res.send(indexPage);
});

router.get('/docs', (req, res) => {
	res.sendFile('/pages/index/index.html');
});

// --- Export ---
export default router;
