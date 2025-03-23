import { cn } from '@/lib/utils'
import { stegaClean } from 'next-sanity'

export default function Pretitle({
	className,
	children,
	style,
}: React.ComponentProps<'p'>) {
	if (!children) return null

	return (
		<p className={cn('technical', className)} style={style}>
			{stegaClean(children)}
		</p>
	)
}
