import Pretitle from '@/ui/Pretitle'
import { stegaClean } from 'next-sanity'
import CustomPortableText from './CustomPortableText'
import { Img } from '@/ui/Img'
import { VscSurroundWith } from 'react-icons/vsc'
import { cn } from '@/lib/utils'

export default function TestimonialList({
	pretitle,
	intro,
	testimonials,
	layout,
	layoutMobile,
}: Partial<{
	pretitle: string
	intro: any
	testimonials: Sanity.Testimonial[]
	layout: 'grid' | 'carousel'
	layoutMobile: 'grid' | 'carousel'
}>) {
	return (
		<section className="section space-y-8 text-center">
			{(pretitle || intro) && (
				<header className="richtext">
					<Pretitle>{pretitle}</Pretitle>
					<CustomPortableText value={intro} />
				</header>
			)}

			<div
				className={cn(
					'gap-4',
					stegaClean(layout) === 'carousel'
						? 'carousel max-xl:full-bleed md:overflow-fade pb-4 max-md:px-4 md:gap-8 md:before:m-auto md:after:m-auto'
						: 'grid sm:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]',
					stegaClean(layoutMobile) === 'carousel' &&
						'max-md:carousel max-md:full-bleed max-md:px-4 max-md:pb-4',
				)}
			>
				{testimonials?.map(
					(testimonial, key) =>
						testimonial && (
							<article
								className="border-ink/10 grid basis-[min(450px,70vw)]! place-content-center rounded border p-4"
								key={key}
							>
								<blockquote className="flex flex-col items-center gap-4">
									<div className="richtext text-balance">
										<CustomPortableText value={testimonial.content} />
									</div>

									{testimonial.author && (
										<div className="inline-flex max-w-[25ch] items-center gap-2">
											<Img
												className="size-[40px] shrink-0 rounded-full object-cover"
												image={testimonial.author.image}
												width={80}
												alt={
													[testimonial.author.name, testimonial.author.title]
														.filter(Boolean)
														.join(', ') || 'Author'
												}
											/>

											<dl className="text-start">
												<dt className="flex flex-wrap items-center gap-1">
													{testimonial.author.name}

													{testimonial.source && (
														<cite>
															<a
																className="text-ink/50"
																href={testimonial.source}
																target="_blank"
																title="Source"
															>
																<VscSurroundWith />
															</a>
														</cite>
													)}
												</dt>

												{testimonial.author.title && (
													<dd className="text-xs text-balance">
														{testimonial.author.title}
													</dd>
												)}
											</dl>
										</div>
									)}
								</blockquote>
							</article>
						),
				)}
			</div>
		</section>
	)
}
