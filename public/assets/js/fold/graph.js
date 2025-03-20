export class GraphVisualizer {
	constructor(selector) {
		this.selector = selector;
		this.width = 0;
		this.height = 0;
		this.svg = null;
		this.simulation = null;
		this.nodes = [];
		this.links = [];
		this.onNodeClick = null;
		this.onBackgroundClick = null;
		this.columnWidth = 200;
		this.nodeRadius = { directory: 10, file: 8 };

		this.init();
		this.setupResizeHandler();
	}

	init() {
		const container = document.querySelector(this.selector);
		this.width = container.clientWidth;
		this.height = container.clientHeight;

		this.svg = d3
			.select(this.selector)
			.append('svg')
			.attr('width', this.width)
			.attr('height', this.height)
			.on('click', (event) => {
				if (event.target.tagName === 'svg') {
					this.resetHighlight();
				}
			});

		this.simulation = d3
			.forceSimulation()
			.force(
				'link',
				d3
					.forceLink()
					.id((d) => d.id)
					.distance(this.columnWidth),
			)
			.force('charge', d3.forceManyBody().strength(-300))
			.force('collision', d3.forceCollide().radius(30))
			.force('y', d3.forceY(this.height / 2).strength(0.1));
	}

	setupResizeHandler() {
		window.addEventListener('resize', () => {
			const container = document.querySelector(this.selector);
			this.width = container.clientWidth;
			this.height = container.clientHeight;

			this.svg.attr('width', this.width).attr('height', this.height);

			this.updateLayout();
		});
	}

	processData(data) {
		const nodes = [];
		const links = [];
		const processNode = (node, parent = null, depth = 0) => {
			node.depth = depth;
			nodes.push(node);
			if (parent) {
				links.push({
					source: parent.id,
					target: node.id,
					sourceDepth: parent.depth,
					targetDepth: depth,
				});
			}
			if (node.children) {
				node.children.forEach((child) => processNode(child, node, depth + 1));
			}
		};
		data.forEach((node) => processNode(node));
		return { nodes, links };
	}

	calculateNodePosition(node) {
		const x = node.depth * this.columnWidth + 100;
		const baseY = this.height / 2;
		const siblingCount = this.nodes.filter(
			(n) => n.depth === node.depth,
		).length;
		const siblingIndex = this.nodes
			.filter((n) => n.depth === node.depth)
			.indexOf(node);
		const ySpacing = Math.min(80, (this.height - 200) / siblingCount);
		const y = baseY - (siblingCount * ySpacing) / 2 + siblingIndex * ySpacing;
		return { x, y };
	}

	updateLayout() {
		this.nodes.forEach((node) => {
			const pos = this.calculateNodePosition(node);
			node.fx = pos.x;
			node.fy = pos.y;
		});
		this.simulation.alpha(0.3).restart();
	}

	render(data) {
		const { nodes, links } = this.processData(data);
		this.nodes = nodes;
		this.links = links;

		// Create orthogonal links without arrows
		const link = this.svg
			.selectAll('.link')
			.data(links)
			.join('path')
			.attr('class', 'link')
			.attr('fill', 'none')
			.attr('stroke', '#94a3b8')
			.attr('stroke-width', 2)
			.attr('opacity', 0.6);

		const nodeGroup = this.svg
			.selectAll('.node')
			.data(nodes)
			.join('g')
			.attr('class', 'node')
			.style('cursor', 'pointer');

		// Enhanced node appearance
		nodeGroup.selectAll('circle').remove();
		nodeGroup
			.append('circle')
			.attr('r', (d) => this.nodeRadius[d.type])
			.attr('fill', (d) => (d.type === 'directory' ? '#3b82f6' : '#93c5fd'))
			.attr('stroke', '#ffffff')
			.attr('stroke-width', 3)
			.attr('filter', 'drop-shadow(0 2px 3px rgba(0,0,0,0.2))');

		// Enhanced text labels positioned above nodes
		nodeGroup.selectAll('text').remove();
		nodeGroup
			.append('text')
			.attr('text-anchor', 'middle')
			.attr('dy', (d) => -this.nodeRadius[d.type] - 8)
			.text((d) => d.name)
			.attr('fill', '#1e293b')
			.attr('font-weight', (d) => (d.type === 'directory' ? '600' : '400'))
			.attr('filter', 'drop-shadow(0 1px 1px rgba(255,255,255,0.8))');

		nodeGroup.on('click', (event, d) => {
			event.stopPropagation();
			if (this.onNodeClick) {
				this.onNodeClick(d);
			}
			this.highlightRelatedNodes(d);
		});

		// Calculate initial positions and update layout
		nodes.forEach((node) => {
			const pos = this.calculateNodePosition(node);
			node.x = node.fx = pos.x;
			node.y = node.fy = pos.y;
		});

		// Update simulation
		this.simulation.nodes(nodes).on('tick', () => {
			// Orthogonal path calculation
			link.attr('d', (d) => {
				const midX = (d.source.x + d.target.x) / 2;
				return `M${d.source.x},${d.source.y}
                  L${midX},${d.source.y}
                  L${midX},${d.target.y}
                  L${d.target.x},${d.target.y}`;
			});

			nodeGroup.attr('transform', (d) => `translate(${d.x},${d.y})`);
		});

		this.simulation.force('link').links(links);
		this.simulation.alpha(1).restart();
	}

	findRelatedNodes(nodeId) {
		const related = new Set();
		related.add(nodeId);

		// Add parent nodes
		let currentId = nodeId;
		while (currentId.includes('/')) {
			currentId = currentId.substring(0, currentId.lastIndexOf('/'));
			related.add(currentId);
		}

		// Add child nodes
		const addChildren = (id) => {
			this.nodes
				.filter((n) => n.id.startsWith(id + '/'))
				.forEach((n) => related.add(n.id));
		};
		addChildren(nodeId);

		return related;
	}

	highlightRelatedNodes(node) {
		const relatedNodes = this.findRelatedNodes(node.id);

		this.svg.selectAll('.node').style('opacity', (d) => {
			if (relatedNodes.has(d.id)) {
				return d.id === node.id ? 1 : 0.7;
			}
			return 0.2;
		});

		this.svg.selectAll('.link').style('opacity', (d) => {
			if (relatedNodes.has(d.source.id) && relatedNodes.has(d.target.id)) {
				return 0.6;
			}
			return 0.1;
		});
	}

	resetHighlight() {
		this.svg.selectAll('.node').style('opacity', 1);

		this.svg.selectAll('.link').style('opacity', 0.6);
	}
}
