import { defineType } from 'sanity'

export default defineType({
	name: 'custom-block',
	type: 'block',
	marks: {
		annotations: [{ type: 'textColor' }, { type: 'highlightColor' }],
	},
})
