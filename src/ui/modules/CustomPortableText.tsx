import {
	PortableText,
	PortableTextMarkComponentProps,
	PortableTextProps,
} from 'next-sanity'
import { stegaClean } from '@sanity/client/stega'
import AnchoredHeading from './RichtextModule/AnchoredHeading'

export default function CustomPortableText({
	components,
	...props
}: PortableTextProps) {
	return (
		<PortableText
			components={{
				...(components ?? {}),
				block: {
					h2: (node) => <AnchoredHeading as="h2" {...node} />,
					h3: (node) => <AnchoredHeading as="h3" {...node} />,
					h4: (node) => <AnchoredHeading as="h4" {...node} />,
					h5: (node) => <AnchoredHeading as="h5" {...node} />,
					h6: (node) => <AnchoredHeading as="h6" {...node} />,
				},
				marks: {
					...(components?.marks ?? {}),
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
