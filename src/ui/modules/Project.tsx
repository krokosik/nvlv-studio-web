import { YouTubePlayer } from '@/ui/components/youtube'
import { stegaClean } from '@sanity/client/stega'
import clsx from 'clsx'
import {
	Carousel,
	CarouselContent,
	CarouselDots,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '../components/ui/carousel'
import { Img } from '../Img'
import Pretitle from '../Pretitle'
import CustomPortableText from './CustomPortableText'
import LogoCanvas from '../LogoCanvas/LogoCanvas'
import moduleProps from '@/lib/moduleProps'

export default function Project({
	title,
	pretitle,
	ordinal = 0,
	description,
	gallery,
	textColor,
	backgroundColor,
	accentColor,
	...props
}: Partial<{
	title: string
	pretitle: string
	ordinal: number
	description: any
	gallery: { images: any[] }
	textColor: any
	backgroundColor: any
	accentColor: any
}> &
	Sanity.Module) {
	const colors = {
		textColor: stegaClean(textColor.value) as string,
		backgroundColor: stegaClean(backgroundColor.value) as string,
		accentColor: stegaClean(accentColor.value) as string,
	}

	return (
		<section
			className="lg:h-fold w-full pt-4 md:pt-0 lg:max-h-[900px] lg:px-20"
			style={{
				backgroundColor: colors.backgroundColor,
				color: colors.textColor,
			}}
			{...moduleProps(props)}
		>
			<div className="mx-auto h-full max-w-7xl md:grid md:grid-cols-2 md:grid-rows-3 xl:grid-cols-32">
				<div className="col-span-3 col-start-1 row-start-1 mt-12 hidden aspect-square xl:block">
					<LogoCanvas
						static
						square
						fillColor={colors.textColor}
						backgroundColor="transparent"
					/>
				</div>
				<div className="col-span-full grid-cols-subgrid grid-rows-3 gap-x-6 px-4 md:grid md:pt-0 xl:gap-x-0">
					<div className="row-span-3 grid size-full grid-rows-subgrid text-5xl font-medium md:text-6xl xl:col-span-12 xl:col-start-7">
						<span className="self-end" style={{ color: colors.accentColor }}>
							//:
						</span>
						<h3 className="row-span-2">
							{title?.split(' ')[0]}
							<span style={{ color: colors.accentColor }}>:</span>
							<br />
							{title?.split(' ')[1]}
							<span style={{ color: colors.accentColor }}>
								.{ordinal?.toString().padStart(2, '0')}
							</span>
						</h3>
					</div>
					<div className="col-start-2 row-span-2 row-start-2 pt-8 md:pt-0 xl:col-span-13 xl:col-start-[19]">
						<Pretitle
							className="px-4 text-xl xl:text-2xl"
							style={{ color: colors.accentColor }}
						>
							{pretitle}
						</Pretitle>
					</div>
				</div>
				<div className="col-span-full row-span-2 h-full grid-cols-subgrid grid-rows-1 md:col-start-1 md:row-start-1 md:grid md:divide-x md:divide-black">
					<div className="hidden xl:col-span-6 xl:block" />
					<Carousel
						opts={{ loop: true }}
						className="h-full p-2 pt-8 xl:col-span-12 xl:pt-2"
					>
						<CarouselContent className="h-full">
							{gallery?.images.map((image) => (
								<CarouselItem key={image._key} className="h-full">
									<figure className="relative flex size-full max-h-[500px] items-center">
										{image._type === 'youtube' ? (
											<YouTubePlayer url={image.url} width="100%" />
										) : (
											<Img
												className="mx-auto h-full object-contain"
												image={image}
											/>
										)}
									</figure>
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious className="left-0 z-10 bg-inherit backdrop-blur-md backdrop-brightness-125 hover:bg-current" />
						<CarouselNext className="right-0 z-10 bg-inherit backdrop-blur-md hover:bg-current" />
						<CarouselDots />
					</Carousel>
					<div className="size-full px-4 py-16 xl:col-span-13 xl:px-4 xl:py-0">
						<div className="3xl:text-4xl flex size-full flex-col justify-center text-2xl font-normal sm:text-3xl">
							<CustomPortableText value={description} />
						</div>
					</div>
					<div className="col-span-1" />
				</div>
			</div>
		</section>
	)
}
