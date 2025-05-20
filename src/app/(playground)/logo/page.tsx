'use client'

import { cn } from '@/lib/utils'
import {
	draw,
	getMSPGaps,
	getNormalizedOrbPositions,
	initSimulation,
	NUM_ORBS,
	resizeCanvasToDisplaySize,
	SimulationNode,
	tickWithEnergyConservation,
} from '@/ui/LogoCanvas/canvas.utils'
import { defaultParams } from '@/ui/LogoCanvas/LogoCanvas'
import { ForceLink, Simulation } from 'd3-force'
import { button, useControls } from 'leva' // Import button
import { useCallback, useEffect, useRef } from 'react'
import { useDebounceCallback, useResizeObserver } from 'usehooks-ts'

export default function LogoPlaygroundPage() {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const simulationRef = useRef<Simulation<SimulationNode, any> | null>(null)
	const offscreenCanvasRef = useRef<OffscreenCanvas | null>(null)
	const animationFrameIdRef = useRef<number | null>(null)
	const lastTimeRef = useRef(0)

	const { FPS, ...props } = useControls({
		orbRadiiInDim: {
			value: defaultParams.orbRadiiInDim ?? 20 / 3,
			min: 4 / (Math.sqrt(3) - 1),
			max: 8 / (Math.sqrt(3) - 1),
			step: 0.01,
			label: 'Orb Radii in Dim',
		},
		gasDensity: {
			value: defaultParams.gasDensity,
			min: 0,
			max: 0.001,
			step: 0.00001,
			label: 'Gas Density',
		},
		temperature: {
			value: defaultParams.temperature,
			min: 0,
			max: 20,
			step: 0.1,
			label: 'Temperature',
		},
		maxLinkThicknessPerRadius: {
			value: defaultParams.maxLinkThicknessPerRadius,
			min: 0,
			max: 1,
			step: 0.01,
			label: 'Max Link Thickness/Radius',
		},
		maxRangePerRadius: {
			value: defaultParams.maxRangePerRadius,
			min: 0,
			max: 5,
			step: 0.01,
			label: 'Max Range/Radius',
		},
		backgroundColor: {
			value: defaultParams.backgroundColor,
			label: 'Background Color',
		},
		fillColor: {
			value: defaultParams.fillColor,
			label: 'Fill Color',
		},
		square: {
			value: defaultParams.square,
			label: 'Square',
		},
		static: {
			value: defaultParams.static,
			label: 'Static',
		},
		FPS: {
			value: 30,
			min: 1,
			max: 120,
			step: 1,
			label: 'FPS',
		},
		ExportImage: button(() => {
			console.log('Export Image clicked')
			// Placeholder for actual export image logic
		}),
		ExportSVG: button(() => {
			console.log('Export SVG clicked')
			// Placeholder for actual export SVG logic
		}),
	})

	const animate = useCallback((timestamp: number) => {
		const canvas = canvasRef.current
		const ctx = canvas?.getContext('2d')
		const offscreenCanvas = offscreenCanvasRef.current
		const offscreenCtx = offscreenCanvas?.getContext('2d')
		const simulation = simulationRef.current

		if (
			!canvas ||
			!ctx ||
			!offscreenCanvas ||
			!offscreenCtx ||
			!simulation ||
			!offscreenCanvasRef.current
		)
			return

		const deltaTime = timestamp - lastTimeRef.current

		const FRAME_TIME = 1000 / FPS

		// Only update if enough time has passed
		if (deltaTime >= FRAME_TIME || props.static) {
			const nodes = simulation.nodes()
			const link = simulation.force('link') as ForceLink<SimulationNode, any>
			const links = getMSPGaps(
				nodes.slice(0, NUM_ORBS),
				link.distance()(1, 2, []),
			)
			link!.links(links)

			tickWithEnergyConservation(simulation)

			draw(
				offscreenCtx,
				props,
				{ width: canvas.width, height: canvas.height },
				simulation,
			)

			const imageBitmap = offscreenCanvas.transferToImageBitmap()

			ctx.clearRect(0, 0, canvas.width, canvas.height)
			ctx.drawImage(imageBitmap, 0, 0)

			lastTimeRef.current = timestamp - (deltaTime % FRAME_TIME) // Adjust for any remainder
		}

		if (!props?.static) {
			animationFrameIdRef.current = requestAnimationFrame(animate)
		}
	}, [])

	const handleResize = useCallback(() => {
		if (!canvasRef.current) return
		const canvas = canvasRef.current
		const oldPositions =
			canvas && simulationRef.current
				? getNormalizedOrbPositions(simulationRef.current, {
						width: canvas.width,
						height: canvas.height,
					})
				: undefined

		const needsResize = resizeCanvasToDisplaySize(canvas, props.square)

		if (!needsResize) return

		offscreenCanvasRef.current = new OffscreenCanvas(
			canvas.width,
			canvas.height,
		)

		if (!props) return

		simulationRef.current = initSimulation(
			props,
			{ width: canvas.width, height: canvas.height },
			oldPositions,
		)

		if (props.static || !animationFrameIdRef.current) {
			animate(0)
		}
	}, [canvasRef.current, props.square])

	const setupDebounced = useDebounceCallback(handleResize, 500, {
		leading: true,
	})

	useEffect(
		() => {
			const canvas = canvasRef.current
			const simulation = simulationRef.current
			if (!canvas || !simulation) return

			const oldPositions = getNormalizedOrbPositions(simulation, {
				width: canvas.width,
				height: canvas.height,
			})

			simulationRef.current = initSimulation(
				props,
				{ width: canvas.width, height: canvas.height },
				oldPositions,
			)
		},
		Array(Object.values(props)),
	)

	// @ts-ignore
	useResizeObserver({ ref: canvasRef, onResize: setupDebounced })

	return (
		<div style={{ height: '100dvh', position: 'relative' }}>
			<canvas ref={canvasRef} className={cn('size-full')} />
		</div>
	)
}
