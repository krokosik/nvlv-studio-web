'use client'
import { useResizeObserver, useDebounceCallback } from 'usehooks-ts'
import { useCallback, useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'
import { resizeCanvasToDisplaySize, SimulationParams } from './canvas.utils'

export interface LogoCanvasProps extends Partial<SimulationParams> {
	static?: boolean
	square?: boolean
	globalAlpha?: number
	objectFit?: 'contain' | 'cover'
}

export const defaultParams: LogoCanvasProps = {
	orbRadiiInDim: 20 / 3,
	gasDensity: 0.00005,
	temperature: 5,
	maxLinkThicknessPerRadius: 0.5,
	maxRangePerRadius: 3 / 2,
	backgroundColor: '#000',
	fillColor: '#fff',
	static: false,
	square: false,
	globalAlpha: 1,
	objectFit: 'cover',
}

export default function LogoCanvas(props: LogoCanvasProps) {
	const params = { ...defaultParams, ...props } as Required<LogoCanvasProps>
	const ref = useRef<HTMLCanvasElement>(null)
	const workerRef = useRef<Worker | null>(null)

	const handleResize = useCallback(() => {
		if (!ref.current) return
		const canvas = ref.current
		const needsResize = resizeCanvasToDisplaySize(canvas, params.square)

		if (!needsResize) return

		workerRef.current?.postMessage({
			type: 'resize',
			width: canvas.width,
			height: canvas.height,
		})
	}, [ref.current, params.square])

	const setupDebounced = useDebounceCallback(handleResize, 500, {
		leading: true,
	})

	// @ts-ignore
	useResizeObserver({ ref, onResize: setupDebounced })

	useEffect(() => {
		const canvas = ref.current
		if (!canvas) return

		workerRef.current = new Worker(
			new URL('./canvas.worker.ts', import.meta.url),
		)

		workerRef.current.onmessage = (e) => {
			const ctx = canvas.getContext('2d')
			if (!ctx) return
			ctx.clearRect(0, 0, canvas.width, canvas.height)
			ctx.globalAlpha = params.globalAlpha ?? 1
			ctx.drawImage(e.data, 0, 0)
		}

		return () => {
			workerRef.current?.postMessage({ type: 'stop' })
			workerRef.current?.terminate()
			workerRef.current = null
		}
	}, [])

	useEffect(
		() => {
			if (!workerRef.current) return
			workerRef.current.postMessage({ type: 'params', newParams: params })
		},
		Array(Object.values(params)),
	)

	return (
		<canvas
			ref={ref}
			className={cn('size-full', `object-${params.objectFit}`)}
		/>
	)
}
