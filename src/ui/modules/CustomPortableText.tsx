import {
	PortableText,
	PortableTextMarkComponentProps,
	PortableTextProps,
} from 'next-sanity'
import { stegaClean } from '@sanity/client/stega'

export default function CustomPortableText({
	components,
	...props
}: PortableTextProps) {
	return (
		<PortableText
			components={{
				...(components ?? {}),
				marks: {
					textColor: ({ children, value }: PortableTextMarkComponentProps) => (
						<span
							style={{
								color: stegaClean(value?.value),
							}}
						>
							{children}
						</span>
					),
					highlightColor: ({
						children,
						value,
					}: PortableTextMarkComponentProps) => (
						<span
							style={{
								backgroundColor: stegaClean(value?.value),
							}}
						>
							{children}
						</span>
					),
				},
			}}
			{...props}
		/>
	)
}
