import fs from 'fs';
import path from 'path';

/**
 * Recursively scanning docs/ and return its structure as a tree
 *
 * @param {*} dir
 * @param {*} basePath
 * @returns {Array} Array of objects representing graph nodes
 */
export default function scanDirectory(dir, basePath = '') {
	const results = [];
	const files = fs.readdirSync(dir);

	for (const file of files) {
		const filePath = path.join(dir, file);
		const relativePath = basePath ? path.join(basePath, file) : file;
		const stats = fs.statSync(filePath);

		if (stats.isDirectory()) {
			const node = {
				id: relativePath,
				name: file,
				type: 'directory',
				children: scanDirectory(filePath, relativePath),
			};
			results.push(node);
		} else {
			const node = {
				id: relativePath,
				name: file,
				type: 'file',
			};
			results.push(node);
		}
	}

	return results;
}
