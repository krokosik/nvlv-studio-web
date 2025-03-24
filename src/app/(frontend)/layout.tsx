// import { GoogleTagManager } from '@next/third-parties/google'
import Root from '@/ui/Root'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import SkipToContent from '@/ui/SkipToContent'
import Announcement from '@/ui/Announcement'
import Header from '@/ui/header'
import Footer from '@/ui/footer'
import VisualEditingControls from '@/ui/VisualEditingControls'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import localFont from 'next/font/local'
import '@/styles/app.css'

const supplySans = localFont({
	src: [
		{
			path: '../fonts/PPSupplySans-Regular.woff2',
			weight: '400',
			style: 'normal',
		},
		{
			path: '../fonts/PPSupplySans-Ultralight.woff2',
			weight: '200',
			style: 'normal',
		},
	],
})

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<Root className={supplySans.className}>
			{/* <GoogleTagManager gtmId="" /> */}
			<body className="bg-canvas text-ink">
				<NuqsAdapter>
					<SkipToContent />
					<Announcement />
					<Header />
					<main id="main-content" role="main" tabIndex={-1}>
						{children}
					</main>
					<Footer />

					<VisualEditingControls />
				</NuqsAdapter>

				<Analytics />
				<SpeedInsights />
			</body>
		</Root>
	)
}
