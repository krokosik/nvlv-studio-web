'use client'
import dynamic from 'next/dynamic'
export const YouTubePlayer = dynamic(() => import('react-player/youtube'), {
	ssr: false,
})
