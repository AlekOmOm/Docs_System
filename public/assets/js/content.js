export class ContentManager {
	constructor() {
		this.contentElement = document.getElementById('content');
		this.markdownElement = document.getElementById('markdownContent');

		this.cache = new Map();

		this.setupEventListeners();
	}

	setupEventListeners() {
		this.backButton.addEventListener('click', () => {
			this.hide();
		});
	}

	async loadContent(path) {
		try {
			if (this.cache.has(path)) {
				return this.cache.get(path);
			}

			const response = await fetch(`/api/content/${path}`);
			if (!response.ok) {
				throw new Error('Failed to fetch content');
			}

			const data = await response.json();
			this.cache.set(path, data.html);
			return data.html;
		} catch (error) {
			console.error('Error loading content:', error);
			return '<p>Error loading content. Please try again.</p>';
		}
	}

	async show(path) {
		const html = await this.loadContent(path);
		this.markdownElement.innerHTML = html;
		this.contentElement.classList.remove('hidden');
		document.getElementById('graph').style.width = '50%';

		// Apply syntax highlighting
		document.querySelectorAll('pre code').forEach((block) => {
			hljs.highlightElement(block);
		});
	}

	hide() {
		this.contentElement.classList.add('hidden');
		document.getElementById('graph').style.width = '100%';
	}

	clearCache() {
		this.cache.clear();
	}
}
