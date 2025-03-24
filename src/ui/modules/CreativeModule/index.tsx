import moduleProps from '@/lib/moduleProps'
import { stegaClean } from 'next-sanity'
import CustomPortableText from '../CustomPortableText'
import CTAsSubModule, { type CTAsSubModuleType } from './CTAsSubModule'
import CustomHTMLSubmodule, {
	type CustomHTMLSubmoduleType,
} from './CustomHTMLSubmodule'
import Icon, { getPixels } from '@/ui/Icon'
import ImageSubModule, { type ImageSubModuleType } from './ImageSubModule'
import RichtextSubModule, {
	type RichtextSubModuleType,
} from './RichtextSubModule'
import { cn } from '@/lib/utils'

export default function CreativeModule({
	intro,
	modules,
	columns,
	visualSeparation,
	textAlign,
	alignItems,
	...props
}: Partial<{
	intro: any
	modules: Partial<{
		subModules: Array<
			| ImageSubModuleType
			| Sanity.Icon
			| RichtextSubModuleType
			| CTAsSubModuleType
			| CustomHTMLSubmoduleType
		>
		colSpan: number
	}>[]
	columns: number
	visualSeparation: boolean
	textAlign: React.CSSProperties['textAlign']
	alignItems: React.CSSProperties['alignItems']
}>) {
	const width = Math.round((1200 / (columns || modules?.length || 1)) * 1.5)

	return (
		<section {...moduleProps(props)}>
			<div className="section space-y-8">
				<div
					className={cn(
						'grid items-center md:grid-cols-[repeat(var(--col,1),minmax(0px,1fr))]',
						visualSeparation ? 'gap-4' : 'gap-x-12 gap-y-8',
					)}
					style={
						{
							'--col': columns || modules?.length,
							textAlign: stegaClean(textAlign),
							alignItems: stegaClean(alignItems),
						} as React.CSSProperties
					}
				>
					{modules?.map(({ subModules, colSpan = 1 }, i) => (
						<article
							className={cn(
								'space-y-4',
								colSpan > 1 && 'md:col-(--col-span,1)',
								visualSeparation && 'bg-accent/3 rounded p-6',
								stegaClean(alignItems) === 'stretch' &&
									'flex flex-col justify-center',
							)}
							style={
								{
									'--col-span': colSpan > 1 && `span ${colSpan}`,
								} as React.CSSProperties
							}
							key={i}
						>
							{subModules?.map((subModule, ii) => {
								switch (subModule._type) {
									case 'image':
										return (
											<ImageSubModule
												module={subModule}
												width={width * colSpan}
												key={ii}
											/>
										)

									case 'icon':
										return (
											<figure
												className={cn(
													stegaClean(textAlign) === 'center' &&
														'[&_img]:mx-auto',
												)}
												style={{ height: getPixels(subModule?.size) }}
											>
												<Icon icon={subModule} key={ii} />
											</figure>
										)

									case 'richtext':
										return <RichtextSubModule module={subModule} key={ii} />

									case 'ctas':
										return (
											<CTAsSubModule
												module={subModule}
												className={cn(
													stegaClean(textAlign) === 'center' &&
														'justify-center',
												)}
												key={ii}
											/>
										)

									case 'custom-html':
										return <CustomHTMLSubmodule module={subModule} />

									default:
										return null
								}
							})}
						</article>
					))}
				</div>
			</div>
		</section>
	)
}
