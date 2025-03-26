'use client'

import { useCallback, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useResizeObserver } from 'usehooks-ts'

export default function Wrapper({
	className,
	children,
}: React.ComponentProps<'header'>) {
	const ref = useRef<HTMLDivElement>(null)
	const pathname = usePathname()

	const onResize = useCallback(() => {
		if (!ref.current) return
		document.documentElement.style.setProperty(
			'--header-height',
			`${ref.current.offsetHeight ?? 0}px`,
		)
	}, [ref.current])

	useResizeObserver({
		// @ts-ignore
		ref,
		onResize,
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
