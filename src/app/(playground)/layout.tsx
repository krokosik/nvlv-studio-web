import Root from '@/ui/Root'
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

export default async function PlaygroundLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<Root className={supplySans.className}>
			<body className="bg-canvas text-ink">
				<main id="main-content" role="main" tabIndex={-1}>
					{children}
				</main>
			</body>
		</Root>
	)
}
