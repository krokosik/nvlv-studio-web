import { MdOutlineDeveloperBoard } from 'react-icons/md'
import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'project',
	title: 'Project',
	icon: MdOutlineDeveloperBoard,
	type: 'object',
	groups: [
		{ name: 'images' },
		{ name: 'content', default: true },
		{ name: 'options' },
	],
	fields: [
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
			group: 'content',
		}),
		defineField({
			name: 'pretitle',
			title: 'Pretitle',
			type: 'string',
			group: 'content',
		}),
		defineField({
			name: 'description',
			title: 'Description',
			type: 'array',
			of: [{ type: 'custom-block' }],
			group: 'content',
		}),
		defineField({
			name: 'gallery',
			title: 'Gallery',
			type: 'gallery',
			group: 'images',
		}),
		defineField({
			name: 'textColor',
			title: 'Text color',
			type: 'simplerColor',
			group: 'options',
		}),
		defineField({
			name: 'backgroundColor',
			title: 'Background color',
			type: 'simplerColor',
			group: 'options',
		}),
		defineField({
			name: 'accentColor',
			title: 'Accent color',
			type: 'simplerColor',
			group: 'options',
		}),
	],
	preview: {
		select: {
			title: 'title',
			subtitle: 'pretitle',
			image: 'gallery.images.0',
		},
		prepare(selection) {
			const { title, subtitle, image } = selection

			return {
				title,
				subtitle,
				media: image,
			}
		},
	},
})
