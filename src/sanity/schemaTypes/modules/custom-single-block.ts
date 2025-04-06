import { defineType } from 'sanity'

export default defineType({
	name: 'custom-single-block',
	type: 'block',
	marks: {
		annotations: [{ type: 'textColor' }, { type: 'highlightColor' }],
	},
	styles: [{ title: 'Normal', value: 'normal' }],
})
