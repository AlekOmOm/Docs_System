import { GraphVisualizer } from '../../js/graph.js';
import { ContentManager } from '../../js/content.js';

/**
 * @description Main application class that initializes the graph visualizer and content manager.
 * */

class GraphContent {
	constructor() {
		this.graph = new GraphVisualizer('#graph');
		this.content = new ContentManager();
		this.data = null;

		this.init();
	}

	async init() {
		try {
			await this.loadData();
			this.setupEventHandlers();
			this.startPolling();
		} catch (error) {
			console.error('Failed to initialize app:', error);
		}
	}

	async loadData() {
		try {
			const response = await fetch('/api/structure');
			if (!response.ok) {
				throw new Error('Failed to fetch structure');
			}

			this.data = await response.json();
			this.graph.render(this.data);
		} catch (error) {
			console.error('Error loading data:', error);
		}
	}

	setupEventHandlers() {
		this.graph.onNodeClick = (node) => {
			if (node.type === 'file') {
				this.content.show(node.id);
			}
			this.graph.highlightRelatedNodes(node);
		};
		this.graph.onBackgroundClick = () => {
			this.content.hide();
			this.graph.resetHighlight();
		};
	}

	/**
	 * @description Polls the server for updates to the structure every 5 seconds.
	 */
	startPolling() {
		// Poll for updates every 5 seconds
		setInterval(async () => {
			try {
				const response = await fetch('/api/structure');
				if (!response.ok) {
					throw new Error('Failed to fetch structure');
				}

				const newData = await response.json();
				// Check if the structure has changed
				if (JSON.stringify(this.data) !== JSON.stringify(newData)) {
					this.data = newData;
					this.graph.render(this.data);
				}
			} catch (error) {
				console.error('Error polling for updates:', error);
			}
		}, 5000);
	}
}

const app = new App();
