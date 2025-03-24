'use client'

import pkg from './package.json'
import { defineConfig } from 'sanity'
import { projectId, dataset, apiVersion } from '@/sanity/lib/env'
import { structure } from './src/sanity/structure'
import { presentation } from './src/sanity/presentation'
import { infoWidget } from 'sanitypress-utils'
import {
	dashboardTool,
	projectInfoWidget,
	projectUsersWidget,
} from '@sanity/dashboard'
import { vercelWidget } from 'sanity-plugin-dashboard-widget-vercel'
import { visionTool } from '@sanity/vision'
import { codeInput } from '@sanity/code-input'
import { DEFAULT_LANG, supportedLanguages } from '@/lib/i18n'
import { documentInternationalization } from '@sanity/document-internationalization'
import { schemaTypes } from './src/sanity/schemaTypes'
import resolveUrl from '@/lib/resolveUrl'
import Icon from '@/sanity/ui/Icon'
import { simplerColorInput } from 'sanity-plugin-simpler-color-input'
import { media } from 'sanity-plugin-media'

const singletonTypes = ['site']

export default defineConfig({
	title: 'NVLV Studio CMS',
	icon: Icon,
	projectId,
	dataset,
	basePath: '/admin',

	plugins: [
		structure,
		presentation,
		dashboardTool({
			name: 'deployment',
			title: 'Deployment',
			widgets: [vercelWidget()],
		}),
		dashboardTool({
			name: 'info',
			title: 'Info',
			widgets: [
				projectInfoWidget(),
				projectUsersWidget(),
				infoWidget({ version: pkg.version }),
			],
		}),
		visionTool({ defaultApiVersion: apiVersion }),
		codeInput(),
		documentInternationalization({
			supportedLanguages,
			schemaTypes: ['page', 'blog.post'],
		}),
		simplerColorInput({
			// Note: These are all optional
			defaultColorFormat: 'hex',
			defaultColorList: [
				{ label: 'Orange', value: '#FC634B' },
				{ label: 'Violet', value: '#4B47D6' },
				{ label: 'Beige', value: '#F9E8C6' },
				{ label: 'Black', value: '#000000' },
				{ label: 'White', value: '#FFFFFF' },
				{ label: 'Alternative Violet', value: '#784DBD' },
				{ label: 'Alternative Orange', value: '#F39D00' },
				{ label: 'Alternative Pink', value: '#F16074' },
				{ label: 'Custom...', value: 'custom' },
			],
			enableSearch: true,
		}),
		media(),
	],

	schema: {
		types: schemaTypes,
		templates: (templates) =>
			templates.filter(
				({ schemaType }) => !singletonTypes.includes(schemaType),
			),
	},
	document: {
		productionUrl: async (prev, { document }) => {
			if (['page', 'blog.post'].includes(document?._type)) {
				return resolveUrl(document as Sanity.PageBase, { base: true })
			}
			return prev
		},

		actions: (input, { schemaType }) => {
			if (singletonTypes.includes(schemaType)) {
				return input.filter(
					({ action }) =>
						action && ['publish', 'discardChanges', 'restore'].includes(action),
				)
			}

			return input
		},
	},
})
