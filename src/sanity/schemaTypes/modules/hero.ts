import { defineField, defineType } from 'sanity'
import { TfiLayoutCtaCenter } from 'react-icons/tfi'
import { reputationBlock } from '../misc/reputation'
import { alignItems, textAlign } from 'sanitypress-utils'
import { getBlockText } from 'sanitypress-utils'

export default defineType({
	name: 'hero',
	title: 'Hero',
	icon: TfiLayoutCtaCenter,
	type: 'object',
	groups: [
		{ name: 'content', default: true },
		{ name: 'orbs' },
		{ name: 'asset' },
		{ name: 'options' },
	],
	fieldsets: [
		{ name: 'alignment', options: { columns: 2 } },
		{ name: 'image', options: { columns: 2 } },
	],
	fields: [
		defineField({
			name: 'options',
			title: 'Module options',
			type: 'module-options',
			group: 'options',
		}),
		defineField({
			name: 'textColor',
			title: 'Text color',
			type: 'simplerColor',
			group: 'content',
		}),
		defineField({
			name: 'pretitle',
			type: 'string',
			group: 'content',
		}),
		defineField({
			name: 'content',
			type: 'array',
			of: [{ type: 'custom-block' }, { type: 'custom-html' }, reputationBlock],
			group: 'content',
		}),
		defineField({
			name: 'ctas',
			title: 'Call-to-actions',
			type: 'array',
			of: [{ type: 'cta' }],
			group: 'content',
		}),
		defineField({
			name: 'enableOrbs',
			description:
				'Enable animated orbs instead of an image. If used, the background image will be used as a fallback for legacy browsers. Leave blank colors for transparent.',
			title: 'Enable',
			type: 'boolean',
			group: 'orbs',
		}),
		defineField({
			name: 'orbFill',
			title: 'Orb color',
			type: 'simplerColor',
			group: 'orbs',
		}),
		defineField({
			name: 'orbBackground',
			title: 'Background color',
			type: 'simplerColor',
			group: 'orbs',
		}),
		defineField({
			name: 'assets',
			title: 'Assets',
			description:
				'Image used as fallback when orb canvas is not supported (legacy browsers)',
			type: 'array',
			of: [{ type: 'img' }],
			validation: (Rule) => Rule.max(1),
			group: 'asset',
		}),
		defineField({
			...alignItems,
			fieldset: 'alignment',
			group: 'options',
		}),
		defineField({
			...textAlign,
			fieldset: 'alignment',
			group: 'options',
		}),
	],
	preview: {
		select: {
			content: 'content',
			media: 'assets.0.image',
		},
		prepare: ({ content, media }) => ({
			title: getBlockText(content),
			subtitle: 'Hero',
			media,
		}),
	},
})
