
interface ImageIconProps {
    src: string,
    height: string,
    minHeight: string,
    opacity?: number
}

const newFilter = 'invert(56%) sepia(64%) saturate(5697%) hue-rotate(166deg) brightness(101%) contrast(101%)';

const ImageIcon = ({
    src,
    height,
    minHeight,
    opacity
}: ImageIconProps) => {
  return (
    <div className={`w-full mx-auto opacity-${opacity}`}>
        <img src={src}  className={`h-[${height}] text-white mx-auto md:h-[${minHeight}] sepia-[${newFilter}] `}   alt="binoculars"/>
    </div>
  )
}

export default ImageIcon