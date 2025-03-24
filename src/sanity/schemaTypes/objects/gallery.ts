import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
	name: 'gallery',
	type: 'object',
	title: 'Gallery',
	fields: [
		defineField({
			name: 'images',
			type: 'array',
			title: 'Images',
			of: [
				defineArrayMember({
					name: 'image',
					type: 'image',
					title: 'Image',
					options: {
						hotspot: true,
					},
					fields: [
						{
							name: 'alt',
							type: 'string',
							title: 'Alternative text',
						},
						{
							name: 'caption',
							type: 'string',
							title: 'Caption',
						},
					],
				}),
				defineArrayMember({
					type: 'youtube',
					name: 'youtube',
					title: 'YouTube Embed',
				}),
			],
			options: {
				layout: 'grid',
			},
		}),
	],
	preview: {
		select: {
			images: 'images',
			image: 'images.0',
		},
		prepare(selection) {
			const { images, image } = selection

			return {
				title: `Gallery block of ${Object.keys(images).length} images`,
				subtitle: `Alt text: ${image.alt}`,
				media: image,
			}
		},
	},
})
