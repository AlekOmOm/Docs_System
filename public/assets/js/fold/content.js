export class ContentManager {
	constructor() {
		this.contentElement = document.getElementById('content');
		this.markdownElement = document.getElementById('markdownContent');
		this.graphElement = document.getElementById('graph');

		this.cache = new Map();
		this.setupEventListeners();
	}

	setupEventListeners() {
		if (this.graphElement) {
			this.graphElement.addEventListener('click', () => {
				this.hide();
			});
		}
	}

	async loadContent(path) {
		try {
			// Check cache first
			if (this.cache.has(path)) {
				return this.cache.get(path);
			}

			// Fetch content from API
			const response = await fetch(`/api/content/${path}`);
			if (!response.ok) {
				throw new Error(`Failed to fetch content (${response.status})`);
			}

			const data = await response.json();
			if (!data.content) {
				throw new Error('Invalid content format received');
			}

			// Store in cache and return
			this.cache.set(path, data.content);
			return data.content;
		} catch (error) {
			console.error('Error loading content:', error);
			return `<div class="error">
					<h3>Error Loading Content</h3>
					<p>${error.message || 'Please try again later.'}</p>
			  </div>`;
		}
	}

	async show(path) {
		if (!this.contentElement || !this.markdownElement) {
			console.error('Content elements not found in the DOM');
			return;
		}

		try {
			const html = await this.loadContent(path);

			// Set content and show the panel
			this.markdownElement.innerHTML = html;
			this.contentElement.classList.remove('hidden');

			// Resize the graph
			const graphElement = document.getElementById('graph');
			if (graphElement) {
				graphElement.style.width = '50%';
			}

			// Apply syntax highlighting if hljs is available
			if (window.hljs) {
				document.querySelectorAll('pre code').forEach((block) => {
					hljs.highlightElement(block);
				});
			}
		} catch (error) {
			console.error('Error showing content:', error);
		}
	}

	hide() {
		if (!this.contentElement) return;

		this.contentElement.classList.add('hidden');

		// Resize the graph back to full width
		const graphElement = document.getElementById('graph');
		if (graphElement) {
			graphElement.style.width = '100%';
		}
	}

	clearCache() {
		this.cache.clear();
	}
}
