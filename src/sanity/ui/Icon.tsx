import Image from 'next/image'
import icon from '../../app/icon.png'

export default function Icon() {
	return <Image src={icon} alt="NVLV Studio logo" width={25} height={25} />
}
