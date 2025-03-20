import { Router } from 'express';

const router = Router();

import { indexPage } from '../util/pages.js';

// --- Routes ---

router.get('/', (req, res) => {
	res.send(indexPage);
});

// --- Export ---
export default router;
