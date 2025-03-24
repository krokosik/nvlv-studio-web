import { YouTubePlayer } from '@/ui/components/youtube'
import { stegaClean } from '@sanity/client/stega'
import clsx from 'clsx'
import {
	Carousel,
	CarouselContent,
	CarouselDots,
	CarouselItem,
} from '../components/ui/carousel'
import { Img } from '../Img'
import Pretitle from '../Pretitle'
import CustomPortableText from './CustomPortableText'
import LogoCanvas from '../LogoCanvas/LogoCanvas'

export default function Project({
	title,
	pretitle,
	description,
	gallery,
	textColor,
	backgroundColor,
	accentColor,
}: Partial<{
	title: string
	pretitle: string
	description: any
	gallery: { images: any[] }
	textColor: any
	backgroundColor: any
	accentColor: any
}>) {
	const colors = {
		textColor: stegaClean(textColor.value) as string,
		backgroundColor: stegaClean(backgroundColor.value) as string,
		accentColor: stegaClean(accentColor.value) as string,
	}

	return (
		<section
			className="md:max-h-fold mb-[var(--header-height)] w-full px-2 lg:px-20"
			style={{
				backgroundColor: colors.backgroundColor,
				color: colors.textColor,
			}}
		>
			<div className="mx-auto max-w-7xl md:grid md:grid-cols-2 md:grid-rows-3 xl:grid-cols-32">
				<div className="col-span-3 col-start-1 row-start-1 mt-12 hidden aspect-square xl:block">
					<LogoCanvas
						static
						square
						fillColor={colors.textColor}
						backgroundColor="transparent"
					/>
				</div>
				<div className="col-span-full grid-cols-subgrid grid-rows-3 gap-x-6 px-4 pt-8 md:grid md:pt-0 xl:gap-x-0">
					<div className="row-span-3 grid size-full grid-rows-subgrid text-5xl font-medium md:text-6xl xl:col-span-12 xl:col-start-8">
						<span className="self-end" style={{ color: colors.accentColor }}>
							//:
						</span>
						<h3 className="row-span-2">
							{title?.split(' ')[0]}
							<span style={{ color: colors.accentColor }}>:</span>
							<br />
							{title?.split(' ')[1]}
							<span style={{ color: colors.accentColor }}>.01</span>
						</h3>
					</div>
					<div className="col-start-2 row-span-2 row-start-2 pt-8 md:pt-0 xl:col-span-12 xl:col-start-[20]">
						<Pretitle style={{ color: colors.accentColor }}>
							{pretitle}
						</Pretitle>
					</div>
				</div>
				<div className="col-span-full row-span-2 h-full grid-cols-subgrid md:col-start-1 md:row-start-1 md:grid md:divide-x md:divide-black">
					<div className="hidden xl:col-span-7 xl:block" />
					<div className="flex h-full items-center p-2 pt-8 xl:col-span-12 xl:pt-2">
						<Carousel opts={{ loop: true }}>
							<CarouselContent className="items-center">
								{gallery?.images.map((image) => (
									<CarouselItem
										key={image._key}
										className={clsx(image._type !== 'youtube' && 'basis-2/3')}
									>
										<figure className="relative max-h-[58svh] w-full">
											{image._type === 'youtube' ? (
												<YouTubePlayer url={image.url} width="100%" />
											) : (
												<Img image={image} />
											)}
										</figure>
									</CarouselItem>
								))}
							</CarouselContent>
							<CarouselDots />
						</Carousel>
					</div>
					<div className="size-full px-4 py-16 xl:col-span-12 xl:px-4 xl:py-0">
						<div className="flex size-full flex-col justify-center">
							<CustomPortableText value={description} />
						</div>
					</div>
					<div className="col-span-1" />
				</div>
			</div>
		</section>
	)
}
