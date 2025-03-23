import { RxSpaceEvenlyVertically } from 'react-icons/rx'
import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'spacer',
	title: 'Spacer',
	icon: RxSpaceEvenlyVertically,
	type: 'object',
	fields: [
		defineField({
			name: 'height',
			title: 'Height (px)',
			description: 'Default height, applies to all devices',
			type: 'number',
		}),
		defineField({
			name: 'desktopHeight',
			title: 'Desktop Height (px)',
			description: 'Override height for desktop and larger devices',
			type: 'number',
		}),
	],
	preview: {
		select: {
			height: 'height',
			desktopHeight: 'desktopHeight',
		},
		prepare: ({ height }) => ({
			title: `Spacer: ${height}px`,
		}),
	},
})
