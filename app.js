import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { Marked } from 'marked';
import { readPage, constructPage } from './util/templatingEngine.js';

const app = express();
dotenv.config();
app.use(express.static('public'));

import apiRouter from './routers/apiRouter.js';
import pagesRouter from './routers/pagesRouter.js';

// --- Routers ---

app.use('/api', apiRouter);
app.use(pagesRouter);

// --- Server ---
const HOST = process.env.HOST || 'localhost';
const PORT = Number(process.env.PORT) || 8080;
const server = app.listen(PORT, () =>
	console.log('Server is running on port', server.address().port),
);
