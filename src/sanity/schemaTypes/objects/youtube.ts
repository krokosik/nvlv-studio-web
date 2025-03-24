import YouTubePreview from '@/sanity/ui/YoutubePreview'
import { defineType, defineField } from 'sanity'

export default defineType({
	name: 'youtube',
	type: 'object',
	title: 'YouTube Embed',
	fields: [
		defineField({
			name: 'url',
			type: 'url',
			title: 'YouTube video embed URL',
			description: 'Copy the embed URL from YouTube',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'caption',
			type: 'string',
			title: 'Caption',
		}),
	],
	preview: {
		select: {
			url: 'url',
		},
	},
	components: {
		// @ts-ignore
		preview: YouTubePreview,
	},
})
