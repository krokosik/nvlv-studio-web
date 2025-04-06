import { defineArrayMember, defineField, defineType } from 'sanity'
import { VscSymbolKeyword } from 'react-icons/vsc'
import { imageBlock, admonition } from '../fragments'
import { getBlockText } from 'sanitypress-utils'
import {
	FaAlignLeft,
	FaAlignCenter,
	FaAlignRight,
	FaAlignJustify,
} from 'react-icons/fa'
import TextAlign from '@/sanity/ui/TextAlign'

export default defineType({
	name: 'richtext-module',
	title: 'Richtext module',
	icon: VscSymbolKeyword,
	type: 'object',
	groups: [
		{ name: 'content', title: 'Content', default: true },
		{ name: 'options', title: 'Options' },
	],
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
			of: [
				{
					type: 'block',
					marks: {
						decorators: [
							{ title: 'Strong', value: 'strong' },
							{ title: 'Emphasis', value: 'em' },
							{ title: 'Underline', value: 'underline' },
							{ title: 'Code', value: 'code' },
							{ title: 'Strikethrough', value: 'strike-through' },
							{
								title: 'Left',
								value: 'left',
								icon: FaAlignLeft,
								component: (props) => TextAlign(props),
							},
							{
								title: 'Center',
								value: 'center',
								icon: FaAlignCenter,
								component: (props) => TextAlign(props),
							},
							{
								title: 'Right',
								value: 'right',
								icon: FaAlignRight,
								component: (props) => TextAlign(props),
							},
							{
								title: 'Justify',
								value: 'justify',
								icon: FaAlignJustify,
								component: (props) => TextAlign(props),
							},
						],
						annotations: [{ type: 'textColor' }, { type: 'highlightColor' }],
					},
				},
				imageBlock,
				admonition,
				defineArrayMember({
					title: 'Code block',
					type: 'code',
					options: {
						withFilename: true,
					},
				}),
				{ type: 'custom-html' },
			],
			group: 'content',
		}),
		defineField({
			name: 'tableOfContents',
			type: 'boolean',
			initialValue: false,
			group: 'options',
		}),
		defineField({
			name: 'tocPosition',
			type: 'string',
			options: {
				list: ['left', 'right'],
				layout: 'radio',
			},
			hidden: ({ parent }) => !parent.tableOfContents,
			initialValue: 'right',
			group: 'options',
		}),
		defineField({
			name: 'stretch',
			type: 'boolean',
			initialValue: false,
			hidden: ({ parent }) => parent.tableOfContents,
			group: 'options',
		}),
	],
	preview: {
		select: {
			content: 'content',
		},
		prepare: ({ content }) => ({
			title: getBlockText(content),
			subtitle: 'Richtext module',
		}),
	},
})
