import { cn } from '@/lib/utils'

export default function Spacer({
	desktopHeight,
	height,
}: Partial<{
	desktopHeight: number
	height: number
}>) {
	return (
		<section
			className={cn(`sm:h-[${desktopHeight ?? 0}px]`, `h-[${height}px]`)}
		/>
	)
}
