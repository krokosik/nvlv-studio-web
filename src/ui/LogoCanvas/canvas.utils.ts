import {
	forceLink,
	forceSimulation,
	Simulation,
	SimulationLinkDatum,
	SimulationNodeDatum,
} from 'd3-force'
import d3ForceBounce from 'd3-force-bounce'
import d3ForceSurface from 'd3-force-surface'
import FlatQueue from 'flatqueue'

export interface SimulationParams {
	gasDensity: number
	orbRadiiInDim: number
	temperature: number
	maxLinkThicknessPerRadius: number
	maxRangePerRadius: number
	backgroundColor: string
	fillColor: string
}

export interface Dims {
	width: number
	height: number
}

export interface SimulationNode extends SimulationNodeDatum {
	type: 'orb' | 'gas'
	r: number
	x: number
	y: number
	vx: number
	vy: number
}

type Sim = Simulation<SimulationNode, SimulationLinkDatum<SimulationNode>>

export const NUM_ORBS = 5
export const MIN_LINK_DISTANCE_PER_RANGE = 0.985

export function initSimulation(
	params: SimulationParams,
	dims: Dims,
	positions?: { x: number; y: number }[],
): Sim {
	const { orbRadiiInDim, maxRangePerRadius, maxLinkThicknessPerRadius } = params
	const { width, height } = dims
	const orbRadius = Math.min(width, height) / orbRadiiInDim
	const gasRadius = Math.max(1, Math.sqrt(orbRadius) / 2)
	const linkDistance =
		(maxRangePerRadius * maxLinkThicknessPerRadius + 2) *
		orbRadius *
		MIN_LINK_DISTANCE_PER_RANGE

	const nodes = initOrbs(
		{ ...params, orbRadius, gasRadius },
		dims,
		linkDistance,
		positions,
	)

	const sim = forceSimulation(nodes)
		.alphaDecay(0)
		.velocityDecay(0)
		.force(
			'link',
			forceLink<SimulationNode, SimulationLinkDatum<SimulationNode>>([])
				.distance(() => linkDistance)
				.strength(0.1)
				.iterations(1),
		)
		.force(
			'bounce',
			d3ForceBounce().radius((d: SimulationNode) => d.r),
		)
		.force(
			'surface',
			d3ForceSurface()
				.surfaces([
					{ from: { x: width, y: 0 }, to: { x: 0, y: 0 } },
					{ from: { x: width, y: height }, to: { x: width, y: 0 } },
					{ from: { x: 0, y: height }, to: { x: width, y: height } },
					{ from: { x: 0, y: 0 }, to: { x: 0, y: height } },
				])
				.oneWay(true)
				.radius((d: SimulationNode) => d.r),
		)
		.on('tick', () => {})
		.stop()

	return sim
}

export function getNormalizedOrbPositions(
	simulation: Sim,
): { x: number; y: number }[] {
	return simulation
		.nodes()
		.slice(0, NUM_ORBS)
		.map(({ x, y, r }) => ({
			x: x / r,
			y: y / r,
		}))
}

export function calculateTotalEnergy(simulation: Sim) {
	const nodes = simulation.nodes()
	return nodes.reduce(
		(acc, { r, vx, vy }) => acc + r ** 2 * (vx! ** 2 + vy! ** 2),
		0,
	)
}

export function tickWithEnergyConservation(
	simulation: Sim,
	iterations: number = 1,
) {
	const E_i = calculateTotalEnergy(simulation)
	simulation.tick(iterations)
	const E_f = calculateTotalEnergy(simulation)

	const scale = Math.sqrt(E_i / E_f)

	// apply scaling to large orbs only
	simulation.nodes().forEach((node) => {
		node.vx *= scale
		node.vy *= scale
	})
}

export function getMSPGaps(
	nodes: { x: number; y: number }[],
	linkDistance: number,
) {
	return minimalSpanningTree(nodes).filter(
		({ distance }) => distance >= linkDistance,
	)
}

export function getCanvasPosition(
	event: MouseEvent,
	canvas: HTMLCanvasElement,
) {
	const rect = canvas.getBoundingClientRect()
	const scaleX = canvas.width / rect.width
	const scaleY = canvas.height / rect.height

	return {
		x: (event.clientX - rect.left) * scaleX,
		y: (event.clientY - rect.top) * scaleY,
	}
}

export function resizeCanvasToDisplaySize(
	canvas: HTMLCanvasElement,
	square?: boolean,
): boolean {
	// Lookup the size the browser is displaying the canvas in CSS pixels.
	const dpr = window.devicePixelRatio
	const displayWidth = Math.round(canvas.clientWidth * dpr)
	const displayHeight = Math.round(canvas.clientHeight * dpr)

	const desiredWidth = square
		? Math.max(displayWidth, displayHeight)
		: displayWidth
	const desiredHeight = square
		? Math.max(displayWidth, displayHeight)
		: displayHeight

	// Prevent resizing to zero, as it breaks the worker on display: none
	if (!desiredHeight || !desiredWidth) {
		return false
	}

	// Check if the canvas is not the same size.
	const needResize =
		canvas.width != desiredWidth || canvas.height != desiredHeight

	if (needResize) {
		// Make the canvas the same size
		canvas.width = desiredWidth
		canvas.height = desiredHeight
	}

	return needResize
}

export function draw(
	ctx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D,
	params: SimulationParams,
	dims: Dims,
	simulation: Sim,
) {
	const nodes = simulation.nodes()
	const {
		backgroundColor,
		fillColor,
		maxLinkThicknessPerRadius,
		maxRangePerRadius,
	} = params
	const { width, height } = dims
	const orbRadius = Math.min(width, height) / params.orbRadiiInDim
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
	ctx.fillStyle = backgroundColor
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

	ctx.fillStyle = fillColor
	for (const node of nodes.slice(0, NUM_ORBS)) {
		if (node.type === 'orb') {
			ctx.beginPath()
			ctx.arc(node.x!, node.y!, node.r, 0, 2 * Math.PI)
			ctx.fill()
		}
	}

	for (let i = 0; i < NUM_ORBS; i++) {
		for (let j = i + 1; j < NUM_ORBS; j++) {
			const source = nodes[i]
			const target = nodes[j]

			if (!source.x || !source.y || !target.x || !target.y) continue

			const distance = Math.hypot(source.x - target.x, source.y - target.y)

			const thickness =
				orbRadius *
				Math.sqrt(
					Math.max(
						0,
						maxLinkThicknessPerRadius ** 2 -
							((distance / orbRadius - 2) / maxRangePerRadius) ** 2,
					),
				)

			if (thickness <= 0 || isNaN(thickness)) continue

			const angleBetween = Math.atan2(target.y - source.y, target.x - source.x)

			const doubleChordAngle = Math.asin(thickness / orbRadius)

			const angle1 = angleBetween + doubleChordAngle
			const angle2 = angleBetween - doubleChordAngle

			const angle3 = angleBetween + Math.PI - doubleChordAngle
			const angle4 = angleBetween + Math.PI + doubleChordAngle

			const p1 = shiftByAngle(source.x, source.y, angle1, orbRadius)
			const p2 = shiftByAngle(source.x, source.y, angle2, orbRadius)
			const p3 = shiftByAngle(target.x, target.y, angle3, orbRadius)
			const p4 = shiftByAngle(target.x, target.y, angle4, orbRadius)

			const angleDiff = Math.atan(thickness / 2 / orbRadius)
			const h1 = shiftByAngle(
				source.x,
				source.y,
				angleBetween + angleDiff,
				orbRadius,
			)
			const h2 = shiftByAngle(
				source.x,
				source.y,
				angleBetween - angleDiff,
				orbRadius,
			)
			const h3 = shiftByAngle(
				target.x,
				target.y,
				angleBetween + Math.PI - angleDiff,
				orbRadius,
			)
			const h4 = shiftByAngle(
				target.x,
				target.y,
				angleBetween + Math.PI + angleDiff,
				orbRadius,
			)

			const mid1 = shiftByAngle(
				source.x,
				source.y,
				angleBetween + Math.atan(thickness / distance),
				distance / 2,
			)
			const mid2 = shiftByAngle(
				source.x,
				source.y,
				angleBetween - Math.atan(thickness / distance),
				distance / 2,
			)

			ctx.beginPath()
			ctx.moveTo(p1.x, p1.y)
			ctx.quadraticCurveTo(h1.x, h1.y, mid1.x, mid1.y)
			ctx.quadraticCurveTo(h3.x, h3.y, p3.x, p3.y)
			ctx.lineTo(p4.x, p4.y)
			ctx.quadraticCurveTo(h4.x, h4.y, mid2.x, mid2.y)
			ctx.quadraticCurveTo(h2.x, h2.y, p2.x, p2.y)
			ctx.closePath()
			ctx.fillStyle = fillColor
			ctx.fill()
		}
	}

	// show msp
	// const msp = minimalSpanningTree(nodes.slice(0, numOrbs));
	// msp.forEach((edge) => {
	//   ctx.beginPath();
	//   ctx.moveTo(nodes[edge.source].x!, nodes[edge.source].y!);
	//   ctx.lineTo(nodes[edge.target].x!, nodes[edge.target].y!);
	//   ctx.strokeStyle = 'red';
	//   ctx.lineWidth = 1;
	//   ctx.stroke();
	// });
}

export function initOrbs(
	params: SimulationParams & { orbRadius: number; gasRadius: number },
	dims: Dims,
	linkDistance: number,
	positions?: { x: number; y: number }[],
): SimulationNode[] {
	const { gasDensity, orbRadius, gasRadius, temperature } = params
	const { width, height } = dims
	const nodes: SimulationNode[] = []

	if (positions) {
		positions.forEach(({ x, y }) => {
			nodes.push({
				type: 'orb',
				x: x * orbRadius,
				y: y * orbRadius,
				vx: 0,
				vy: 0,
				r: orbRadius,
			})
		})
	} else {
		while (true) {
			const orbs = generateNonOverlappingOrbs(
				orbRadius,
				width - orbRadius,
				orbRadius,
				height - orbRadius,
				orbRadius,
				NUM_ORBS,
			)

			if (getMSPGaps(orbs, linkDistance).length === 0) {
				orbs.forEach(({ x, y }) => {
					nodes.push({
						type: 'orb',
						x,
						y,
						vx: 0,
						vy: 0,
						r: orbRadius,
					})
				})
				break
			}
		}
	}

	const numDustParticales = gasDensity * width * height
	if (gasRadius && numDustParticales) {
		for (let i = 0; i < numDustParticales; i++) {
			nodes.push({
				type: 'gas',
				x: random(gasRadius, width - gasRadius),
				y: random(gasRadius, height - gasRadius),
				vx: gaussianRandom(0, temperature),
				vy: gaussianRandom(0, temperature),
				r: gasRadius,
			})
		}
	}

	return nodes
}

export function generateNonOverlappingOrbs(
	xMin: number,
	xMax: number,
	yMin: number,
	yMax: number,
	orbRadius: number,
	numOrbs: number,
): { x: number; y: number }[] {
	const nodes = []
	for (let i = 0; i < numOrbs; i++) {
		let x: number, y: number
		while (true) {
			x = random(xMin, xMax)
			y = random(yMin, yMax)
			let valid = true
			for (const node of nodes) {
				if (Math.hypot(node.x! - x, node.y! - y) < orbRadius * 2) {
					valid = false
					break
				}
			}
			if (valid) break
		}
		nodes.push({
			x,
			y,
		})
	}
	return nodes
}

function random(min: number, max: number): number {
	return Math.random() * (max - min) + min
}

function gaussianRandom(mean = 0, stdev = 1): number {
	const u = 1 - Math.random() // Converting [0,1) to (0,1]
	const v = Math.random()
	const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
	// Transform to the desired mean and standard deviation:
	return z * stdev + mean
}

function shiftByAngle(x: number, y: number, angle: number, distance: number) {
	return {
		x: x + Math.cos(angle) * distance,
		y: y + Math.sin(angle) * distance,
	}
}

const visited = new Set<{ x: number; y: number }>()
const heap = new FlatQueue<[number, number]>()

const addMSPEdges = (nodes: { x: number; y: number }[], nodeIndex: number) => {
	const node = nodes[nodeIndex]
	nodes.forEach((otherNode, otherIndex) => {
		if (visited.has(otherNode)) return
		const distance = Math.hypot(node.x - otherNode.x, node.y - otherNode.y)
		heap.push([nodeIndex, otherIndex], distance)
	})
}

export function minimalSpanningTree(nodes: { x: number; y: number }[]): {
	source: number
	target: number
	distance: number
}[] {
	// find MSP using Prim's algorithm and distances as weights
	visited.clear()
	heap.clear()
	const msp: {
		source: number
		target: number
		distance: number
	}[] = Array(nodes.length - 1)

	visited.add(nodes[0])

	addMSPEdges(nodes, 0)
	let edge: [number, number] | undefined
	while ((edge = heap.pop())) {
		const [sourceIndex, targetIndex] = edge
		const source = nodes[sourceIndex]
		const target = nodes[targetIndex]

		if (visited.has(nodes[targetIndex])) continue
		visited.add(nodes[targetIndex])

		msp[visited.size - 2] = {
			source: sourceIndex,
			target: targetIndex,
			distance: Math.hypot(source.x - target.x, source.y - target.y),
		}

		addMSPEdges(nodes, targetIndex)
	}

	return msp
}
