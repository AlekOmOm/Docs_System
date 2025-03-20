import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { Marked } from 'marked';
import { readPage, constructPage } from './util/templatingEngine.js';

const app = express();

dotenv.config();

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

import 