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
import { Context } from 'svgcanvas'

export default function LogoPlaygroundPage() {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const simulationRef = useRef<Simulation<SimulationNode, any> | null>(null)
	const animationFrameIdRef = useRef<number | null>(null)
	const lastTimeRef = useRef(0)

	const { FPS, ...props } = useControls({
		orbRadiiInDim: {
			value: defaultParams.orbRadiiInDim,
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
			min: 0.01,
			max: 1,
			step: 0.01,
			label: 'Max Link Thickness/Radius',
		},
		maxRangePerRadius: {
			value: defaultParams.maxRangePerRadius,
			min: 0.01,
			max: 2,
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
			const canvas = canvasRef.current
			if (!canvas) return

			canvas.toBlob((blob) => {
				if (!blob) return
				const url = URL.createObjectURL(blob)
				const a = document.createElement('a')
				a.href = url
				a.download = 'logo.png'
				document.body.appendChild(a)
				a.click()
				document.body.removeChild(a)
				URL.revokeObjectURL(url)
			}, 'image/png')
		}),
		ExportSVG: button(() => {
			const canvas = canvasRef.current
			const simulation = simulationRef.current

			if (!canvas || !simulation) return

			const ctx = new Context(canvas.width, canvas.height)

			draw(
				ctx,
				props,
				{ width: canvas.width, height: canvas.height },
				simulation,
			)

			const svgData = ctx.getSerializedSvg()
			const blob = new Blob([svgData], { type: 'image/svg+xml' })
			const url = URL.createObjectURL(blob)
			const a = document.createElement('a')
			a.href = url
			a.download = 'logo.svg'
			document.body.appendChild(a)
			a.click()
			document.body.removeChild(a)
			URL.revokeObjectURL(url)
		}),
	})

	const animate = useCallback(
		(timestamp: number) => {
			const canvas = canvasRef.current
			const ctx = canvas?.getContext('2d')
			const simulation = simulationRef.current

			if (!canvas || !ctx || !simulation) return

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
					ctx,
					props,
					{ width: canvas.width, height: canvas.height },
					simulation,
				)

				lastTimeRef.current = timestamp - (deltaTime % FRAME_TIME) // Adjust for any remainder
			}

			if (!props?.static) {
				animationFrameIdRef.current = requestAnimationFrame(animate)
			}
		},
		[FPS, Array(Object.values(props))],
	)

	const handleResize = useCallback(() => {
		if (animationFrameIdRef.current) {
			cancelAnimationFrame(animationFrameIdRef.current)
			animationFrameIdRef.current = null
		}
		if (!canvasRef.current) return
		const canvas = canvasRef.current
		const oldPositions =
			canvas && simulationRef.current
				? getNormalizedOrbPositions(simulationRef.current, {
						width: canvas.width,
						height: canvas.height,
					})
				: undefined

		resizeCanvasToDisplaySize(canvas, false)

		if (!props) return

		simulationRef.current = initSimulation(
			props,
			{ width: canvas.width, height: canvas.height },
			oldPositions,
		)

		if (props.static || !animationFrameIdRef.current) {
			animate(0)
		}
	}, [canvasRef.current])

	const setupDebounced = useDebounceCallback(handleResize, 500, {
		leading: true,
	})

	useEffect(
		() => {
			if (animationFrameIdRef.current) {
				cancelAnimationFrame(animationFrameIdRef.current)
				animationFrameIdRef.current = null
			}
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
			if (props.static || !animationFrameIdRef.current) {
				animate(0)
			}
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
