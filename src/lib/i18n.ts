import type { Language } from '@sanity/document-internationalization'

export const supportedLanguages = [
	{ id: 'en', title: 'English' },
	{ id: 'pl', title: 'Polski' },
] as const as Language[]

export const languages = supportedLanguages.map((lang) => lang?.id)

export const DEFAULT_LANG = languages[0] ?? 'en'

export type Lang = (typeof languages)[number]
