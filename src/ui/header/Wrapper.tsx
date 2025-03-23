'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import useResizeObserver from 'use-resize-observer'

export default function Wrapper({
	className,
	children,
}: React.ComponentProps<'header'>) {
	const ref = useRef<HTMLDivElement>(null)
	const pathname = usePathname()

	// set --header-height
	useResizeObserver({
		ref,
		onResize: () => {
			if (!ref.current) return
			document.documentElement.style.setProperty(
				'--header-height',
				`${ref.current.offsetHeight ?? 0}px`,
			)
		},
	})

	// close mobile menu after navigation
	useEffect(() => {
		if (typeof document === 'undefined') return
		const toggle = document.querySelector('#header-open') as HTMLInputElement
		if (toggle) toggle.checked = false
	}, [pathname])

	return (
		<header ref={ref} className={className} role="banner">
			{children}
		</header>
	)
}
