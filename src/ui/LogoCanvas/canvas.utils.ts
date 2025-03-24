import { forceSimulation, Simulation, SimulationNodeDatum } from 'd3-force'
import d3ForceBounce from 'd3-force-bounce'
import d3ForceSurface from 'd3-force-surface'

export interface SimulationNode extends SimulationNodeDatum {
	type: 'orb' | 'gas'
	r: number
}

export const NUM_ORBS = 5

export function initSimulation(params: {
	gasDensity: number
	orbRadiiInDim: number
	temperature: number
	width: number
	height: number
}) {
	const { width, height, orbRadiiInDim } = params
	const orbRadius = Math.min(width, height) / orbRadiiInDim
	const gasRadius = Math.max(1, Math.sqrt(orbRadius) / 2)

	return forceSimulation(initOrbs({ ...params, orbRadius, gasRadius }))
		.alphaDecay(0)
		.velocityDecay(0)
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
	ctx: CanvasRenderingContext2D,
	params: {
		numOrbs?: number
		gasDensity: number
		orbRadiiInDim: number
		maxLinkThicknessPerRadius: number
		maxRangePerRadius: number
		temperature: number
		width: number
		height: number
		backgroundColor: string
		fillColor: string
	},
	simulation?: Simulation<SimulationNode, any> | undefined,
) {
	const nodes = simulation?.nodes()
	if (!nodes) {
		return
	}
	const {
		numOrbs = NUM_ORBS,
		backgroundColor,
		fillColor,
		maxLinkThicknessPerRadius,
		maxRangePerRadius,
	} = params
	const orbRadius = Math.min(params.width, params.height) / params.orbRadiiInDim
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
	ctx.fillStyle = backgroundColor
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

	ctx.fillStyle = fillColor
	for (const node of nodes.slice(0, numOrbs)) {
		if (node.type === 'orb') {
			ctx.beginPath()
			ctx.arc(node.x!, node.y!, node.r + 0.3, 0, 2 * Math.PI)
			ctx.fill()
		}
	}

	for (let i = 0; i < numOrbs; i++) {
		for (let j = i + 1; j < numOrbs; j++) {
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
			ctx.arc(target.x, target.y, orbRadius, angle3, angle4)
			ctx.quadraticCurveTo(h4.x, h4.y, mid2.x, mid2.y)
			ctx.quadraticCurveTo(h2.x, h2.y, p2.x, p2.y)
			ctx.arc(source.x, source.y, orbRadius, angle2, angle1)
			ctx.closePath()
			ctx.fillStyle = fillColor
			ctx.fill()
		}
	}
}

export function initOrbs(params: {
	numOrbs?: number
	gasDensity: number
	orbRadius: number
	gasRadius: number
	temperature: number
	width: number
	height: number
}): SimulationNode[] {
	const {
		numOrbs = NUM_ORBS,
		gasDensity,
		orbRadius,
		gasRadius,
		temperature,
		width,
		height,
	} = params
	const nodes: SimulationNode[] = []

	const xRange = [orbRadius, width - orbRadius]
	const yRange = [orbRadius, height - orbRadius]

	for (let i = 0; i < numOrbs; i++) {
		let x: number, y: number
		while (true) {
			x = random(xRange[0], xRange[1])
			y = random(yRange[0], yRange[1])
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
			type: 'orb',
			x,
			y,
			vx: 0,
			vy: 0,
			r: orbRadius,
		})
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
