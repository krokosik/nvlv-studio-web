import { VscSymbolParameter } from 'react-icons/vsc'
import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'heroLine',
	title: 'Hero Line',
	icon: VscSymbolParameter,
	type: 'object',
	fields: [
		defineField({
			name: 'text',
			type: 'string',
		}),
		defineField({
			name: 'iconLeft',
			title: 'Icon Left',
			type: 'image',
		}),
		defineField({
			name: 'iconRight',
			title: 'Icon Right',
			type: 'image',
		}),
	],
	preview: {
		select: {
			content: 'text',
			iconLeft: 'iconLeft',
			iconRight: 'iconRight',
		},
		prepare: ({ content, iconLeft, iconRight }) => ({
			title: content,
			media: iconLeft || iconRight,
		}),
	},
})
