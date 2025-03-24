import type { PreviewProps } from 'sanity'
import { Flex, Text } from '@sanity/ui'
import YouTubePlayer from 'react-player/youtube'

interface PreviewYouTubeProps extends PreviewProps {
	url: string
}

export default function (props: PreviewYouTubeProps) {
	const url = props.url
	return (
		<Flex padding={4} justify={'center'}>
			{url ? <YouTubePlayer url={url} /> : <Text>Add a YouTube URL</Text>}
		</Flex>
	)
}
