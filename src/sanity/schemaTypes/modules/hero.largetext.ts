import { TfiLayoutAccordionMerged } from 'react-icons/tfi'
import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'hero.largetext',
	title: 'Hero Large Text',
	icon: TfiLayoutAccordionMerged,
	type: 'object',
	groups: [{ name: 'content', default: true }, { name: 'options' }],
	fields: [
		defineField({
			name: 'options',
			title: 'Module options',
			type: 'module-options',
			group: 'options',
		}),
		defineField({
			name: 'content',
			type: 'array',
			of: [{ type: 'heroLine' }],
			group: 'content',
		}),
		defineField({
			name: 'orbFill',
			title: 'Orb color',
			type: 'simplerColor',
			group: 'content',
		}),
		defineField({
			name: 'backgroundColor',
			title: 'Background color',
			type: 'simplerColor',
			group: 'content',
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
