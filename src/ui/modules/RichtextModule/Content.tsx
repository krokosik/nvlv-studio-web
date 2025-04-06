import CustomPortableText from '../CustomPortableText'
import { cn } from '@/lib/utils'

import Image from './Image'
import Code from './Code'
import Admonition from './Admonition'
import CustomHTML from '@/ui/modules/CustomHTML'

export default function Content({
	value,
	className,
	children,
}: { value: any } & React.ComponentProps<'div'>) {
	return (
		<div
			className={cn(
				'richtext mx-auto w-full space-y-6 [&>:first-child]:!mt-0',
				className,
			)}
		>
			<CustomPortableText
				value={value}
				components={{
					types: {
						image: Image,
						admonition: Admonition,
						code: Code,
						'custom-html': ({ value }) => (
							<CustomHTML
								className="has-[table]:md:[grid-column:bleed] has-[table]:md:mx-auto"
								{...value}
							/>
						),
					},
					marks: {
						left: ({ children }: any) => (
							<div className="text-left">{children}</div>
						),
						center: ({ children }: any) => (
							<div className="w-full text-center">{children}</div>
						),
						right: ({ children }: any) => (
							<div className="text-right">{children}</div>
						),
						jusitify: ({ children }: any) => (
							<div className="text-justify">{children}</div>
						),
					},
				}}
			/>

			{children}
		</div>
	)
}
