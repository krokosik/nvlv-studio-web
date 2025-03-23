import moduleProps from '@/lib/moduleProps'
import { ResponsiveImg } from '@/ui/Img'
import { stegaClean } from 'next-sanity'
import CustomPortableText from './CustomPortableText'
import CTAList from '@/ui/CTAList'
import Pretitle from '@/ui/Pretitle'
import CustomHTML from './CustomHTML'
import Reputation from '@/ui/Reputation'
import { cn } from '@/lib/utils'
import LogoCanvas from '../LogoCanvas/LogoCanvas'

export default function Hero({
	pretitle,
	textColor,
	content,
	ctas,
	enableOrbs,
	orbFill,
	orbBackground,
	assets,
	textAlign = 'center',
	alignItems,
	...props
}: Partial<{
	pretitle: string
	textColor: any
	content: any
	ctas: Sanity.CTA[]
	enableOrbs: boolean
	orbFill?: any
	orbBackground?: any
	assets: Sanity.Img[]
	textAlign: React.CSSProperties['textAlign']
	alignItems: React.CSSProperties['alignItems']
}> &
	Sanity.Module) {
	const hasImage = !!assets?.[0] || enableOrbs
	const asset = assets?.[0]
	const backgroundColor = hasImage && stegaClean(orbBackground?.value)
	const fillColor = stegaClean(orbFill?.value)
	const textColorValue = stegaClean(textColor?.value ?? 'canvas')

	return (
		<section
			className={cn(
				hasImage &&
					'bg-ink text-canvas grid overflow-hidden *:col-span-full *:row-span-full',
				`text-${textColorValue}`,
			)}
			style={{ backgroundColor }}
			{...moduleProps(props)}
		>
			{!enableOrbs && hasImage && (
				<ResponsiveImg
					img={asset}
					className="max-h-fold size-full object-cover"
					width={2400}
					draggable={false}
				/>
			)}

			{enableOrbs && (
				<div className="max-h-fold mx-auto size-full max-w-5xl object-cover">
					<LogoCanvas
						fillColor={fillColor ?? 'transparent'}
						backgroundColor={backgroundColor ?? 'transparent'}
						square
					/>
				</div>
			)}

			{content && (
				<div className="section flex w-full flex-col text-balance">
					<div
						className={cn(
							'richtext headings:text-balance relative max-w-xl',
							hasImage && 'text-shadow',
							{
								'mb-8': stegaClean(alignItems) === 'start',
								'my-auto': stegaClean(alignItems) === 'center',
								'mt-auto': stegaClean(alignItems) === 'end',
							},
							{
								'me-auto': ['left', 'start'].includes(stegaClean(textAlign)),
								'mx-auto': stegaClean(textAlign) === 'center',
								'ms-auto': ['right', 'end'].includes(stegaClean(textAlign)),
							},
						)}
						style={{ textAlign: stegaClean(textAlign) }}
					>
						<Pretitle
							className="text-7xl sm:text-9xl"
							style={{ color: textColorValue }}
						>
							{pretitle}
						</Pretitle>

						<CustomPortableText
							value={content}
							components={{
								types: {
									'custom-html': ({ value }) => <CustomHTML {...value} />,
									'reputation-block': ({ value }) => (
										<Reputation
											className={cn(
												'!mt-4',
												hasImage && '[&_strong]:text-amber-400',
												{
													'justify-start': ['left', 'start'].includes(
														stegaClean(textAlign),
													),
													'justify-center': stegaClean(textAlign) === 'center',
													'justify-end': ['right', 'end'].includes(
														stegaClean(textAlign),
													),
												},
											)}
											reputation={value.reputation}
										/>
									),
								},
							}}
						/>

						<CTAList
							ctas={ctas}
							className={cn('!mt-4', {
								'justify-start': stegaClean(textAlign) === 'left',
								'justify-center': stegaClean(textAlign) === 'center',
								'justify-end': stegaClean(textAlign) === 'right',
							})}
						/>
					</div>
				</div>
			)}
		</section>
	)
}
