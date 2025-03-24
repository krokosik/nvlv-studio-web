import { cn } from '@/lib/utils'
import { stegaClean } from '@sanity/client/stega'
import LogoCanvas from '../LogoCanvas/LogoCanvas'
import { Img } from '../Img'

export default function HeroLargeText({
	content,
	orbFill,
	backgroundColor,
}: Partial<{
	content: Sanity.HeroLine[]
	orbFill?: any
	backgroundColor?: any
}>) {
	const bgColor: string = stegaClean(backgroundColor?.value)
	const fillColor: string = stegaClean(orbFill?.value)

	return (
		<section
			className={cn(
				'bg-ink text-canvas grid overflow-hidden py-10 *:col-span-full *:row-span-full',
			)}
			style={{ backgroundColor: bgColor }}
		>
			{content && (
				<div className="section flex w-full flex-col">
					<div
						className={cn(
							'mx-auto my-auto max-w-7xl text-center',
							'text-4xl/[0.8] font-normal text-nowrap',
							'xs:text-5xl/[0.8] sm:text-6xl/[0.8] md:text-7xl/[0.8] lg:text-8xl/[0.8] 2xl:text-9xl/[0.8]',
						)}
					>
						{content.map(({ iconLeft, iconRight, text }) => (
							<h1 key={text} className="relative mx-auto w-fit">
								{iconLeft && (
									<Img
										image={iconLeft}
										className="absolute top-[-0.05em] left-0 h-[0.6875em] w-auto -translate-x-full pr-[0.3em]"
									/>
								)}
								{text}
								{iconRight && (
									<Img
										image={iconRight}
										className="absolute top-[-0.05em] right-0 h-[0.6875em] w-auto translate-x-full pl-[0.3em]"
									/>
								)}
							</h1>
						))}
					</div>
				</div>
			)}
			<div className="max-h-fold z-10 mx-auto my-auto size-full max-w-52 object-contain sm:size-full sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
				<LogoCanvas
					fillColor={fillColor ?? 'transparent'}
					backgroundColor="transparent"
					square
					globalAlpha={0.9}
					objectFit="contain"
				/>
			</div>
		</section>
	)
}
