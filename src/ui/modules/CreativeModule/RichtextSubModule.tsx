import Pretitle from '@/ui/Pretitle'
import CustomPortableText from '../CustomPortableText'

export type RichtextSubModuleType = Sanity.Module<'richtext'> &
	Partial<{
		pretitle: string
		content: any
	}>

export default function RichtextSubModule({
	module,
}: {
	module: RichtextSubModuleType
}) {
	return (
		<div className="richtext">
			<Pretitle>{module.pretitle}</Pretitle>
			<CustomPortableText value={module.content} />
		</div>
	)
}
