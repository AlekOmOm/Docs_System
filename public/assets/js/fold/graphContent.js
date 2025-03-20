// public/assets/js/graphContent.js
import { GraphVisualizer } from './graph.js';
import { ContentManager } from './content.js';

/**
 * Main application class that initializes the graph visualizer and content manager.
 */
class GraphContent {
	constructor() {
		// Wait for DOM to be fully loaded
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', () => this.initialize());
		} else {
			this.initialize();
		}
	}

	initialize() {
		// Check if required elements exist
		if (!document.getElementById('graph')) {
			console.error('Graph container element not found');
			return;
		}

		// Initialize components
		this.graph = new GraphVisualizer('#graph');
		window.graphVisualization = this.graph; // Expose for ContentManager to access
		this.content = new ContentManager();
		this.data = null;

		// Start the application
		this.init();
	}

	async init() {
		try {
			await this.loadData();
			this.setupEventHandlers();
			this.startPolling();
		} catch (error) {
			console.error('Failed to initialize documentation visualizer:', error);
		}
	}

	async loadData() {
		try {
			const response = await fetch('/api/structure');
			if (!response.ok) {
				throw new Error(`Failed to fetch structure (${response.status})`);
			}

			this.data = await response.json();
			this.graph.render(this.data);
		} catch (error) {
			console.error('Error loading documentation structure:', error);
		}
	}

	setupEventHandlers() {
		// Handle node click events
		this.graph.onNodeClick = (node) => {
			if (node.type === 'file') {
				this.content.show(node.id);
			}
			this.graph.highlightRelatedNodes(node);
		};

		// Handle background click events
		this.graph.onBackgroundClick = () => {
			this.content.hide();
			this.graph.resetHighlight();
		};
	}

	/**
	 * Polls the server for updates to the structure every 5 seconds.
	 */
	startPolling() {
		setInterval(async () => {
			try {
				const response = await fetch('/api/structure');
				if (!response.ok) {
					return;
				}

				const newData = await response.json();

				// Check if structure has changed (simple deep comparison)
				if (JSON.stringify(this.data) !== JSON.stringify(newData)) {
					console.log('Documentation structure updated');
					this.data = newData;
					this.graph.render(this.data);
					this.content.clearCache(); // Clear content cache on structure change
				}
			} catch (error) {
				console.error('Error polling for updates:', error);
			}
		}, 5000);
	}
}

// Initialize the application
const app = new GraphContent();
