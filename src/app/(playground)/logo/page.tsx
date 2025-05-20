'use client'

import LogoCanvas, {
	defaultParams,
	LogoCanvasProps,
} from '@/ui/LogoCanvas/LogoCanvas'
import { useControls, button } from 'leva' // Import button

export default function LogoPlaygroundPage() {
	const props = useControls({
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
		ExportImage: button(() => {
			console.log('Export Image clicked')
			// Placeholder for actual export image logic
		}),
		ExportSVG: button(() => {
			console.log('Export SVG clicked')
			// Placeholder for actual export SVG logic
		}),
	})

	return (
		<div style={{ height: '100dvh', position: 'relative' }}>
			<LogoCanvas {...props} />
		</div>
	)
}
