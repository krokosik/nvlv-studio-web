import type { ForceLink, Simulation } from 'd3-force'
import {
	draw,
	getMSPGaps,
	getNormalizedOrbPositions,
	initSimulation,
	NUM_ORBS,
	SimulationNode,
	tickWithEnergyConservation,
} from './canvas.utils'
import type { LogoCanvasProps } from './LogoCanvas'

let simulation: Simulation<SimulationNode, any> | undefined
let canvas: OffscreenCanvas | undefined
let ctx: OffscreenCanvasRenderingContext2D | undefined
let animationFrameId: number | null = null
let params: Required<LogoCanvasProps> | undefined

let lastTime = 0
const TARGET_FPS = 60
const FRAME_TIME = 1000 / TARGET_FPS

function createOffscreenCanvas(width: number, height: number) {
	canvas = new OffscreenCanvas(width, height)
	ctx = canvas.getContext('2d')!
}

self.onmessage = (e: MessageEvent) => {
	const { type, width, height, newParams } = e.data

	switch (type) {
		case 'resize': {
			createOffscreenCanvas(width, height)
			if (!params) return
			const oldPositions = simulation
				? getNormalizedOrbPositions(simulation)
				: undefined
			simulation = initSimulation(params, { width, height }, oldPositions)
			if (params.static || !animationFrameId) {
				animate(0)
			}
			break
		}

		case 'params': {
			params = newParams
			if (!canvas || !simulation) return

			const oldPositions = getNormalizedOrbPositions(simulation)
			simulation = initSimulation(
				params!,
				{ width: canvas.width, height: canvas.height },
				oldPositions,
			)
			break
		}

		case 'stop': {
			if (animationFrameId) {
				cancelAnimationFrame(animationFrameId)
				animationFrameId = null
			}
			break
		}
		default:
			break
	}
}

function animate(timestamp: number) {
	if (!simulation || !ctx || !canvas || !params) return

	const deltaTime = timestamp - lastTime

	// Only update if enough time has passed
	if (deltaTime >= FRAME_TIME || params.static) {
		const nodes = simulation.nodes()
		const link = simulation.force('link') as ForceLink<SimulationNode, any>
		const links = getMSPGaps(
			nodes.slice(0, NUM_ORBS),
			link.distance()(1, 2, []),
		)
		link!.links(links)

		tickWithEnergyConservation(simulation)

		draw(
			ctx,
			params,
			{ width: canvas.width, height: canvas.height },
			simulation,
		)

		const imageBitmap = canvas.transferToImageBitmap()
		// @ts-ignore
		self.postMessage(imageBitmap, [imageBitmap])

		lastTime = timestamp - (deltaTime % FRAME_TIME) // Adjust for any remainder
	}

	if (!params?.static) {
		animationFrameId = requestAnimationFrame(animate)
	}
}
