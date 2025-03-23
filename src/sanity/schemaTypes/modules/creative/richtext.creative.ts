import { defineArrayMember, defineField } from 'sanity'
import { getBlockText } from 'sanitypress-utils'
import { VscSymbolKeyword } from 'react-icons/vsc'

export default defineArrayMember({
	name: 'richtext',
	icon: VscSymbolKeyword,
	type: 'object',
	fields: [
		defineField({
			name: 'pretitle',
			type: 'string',
		}),
		defineField({
			name: 'content',
			type: 'array',
			of: [{ type: 'custom-block' }],
		}),
	],
	preview: {
		select: {
			content: 'content',
		},
		prepare: ({ content }) => ({
			title: getBlockText(content),
			subtitle: 'Richtext',
		}),
	},
})
