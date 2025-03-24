import { TfiLayoutAccordionMerged } from 'react-icons/tfi'
import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'hero.largetext',
	title: 'Hero Large Text',
	icon: TfiLayoutAccordionMerged,
	type: 'object',
	fields: [
		defineField({
			name: 'content',
			type: 'array',
			of: [{ type: 'heroLine' }],
		}),
		defineField({
			name: 'orbFill',
			title: 'Orb color',
			type: 'simplerColor',
		}),
		defineField({
			name: 'backgroundColor',
			title: 'Background color',
			type: 'simplerColor',
		}),
	],
	preview: {
		select: {
			content: 'content',
		},
		prepare: ({}) => ({
			title: 'Large Text Hero',
		}),
	},
})
