//import { sortCards } from "~/utils/sortFilter.server";
import { sortCardsProps } from "~/utils/types.server";


interface SortbuttonsProps {
   type: string
   
   text: string
    onClick: any
}


const skyBlue = 'bg-sky-500 rounded-xl py-2 px-2 my-3 w-full text-white max-w-[200px]';
const customOrange ='bg-customOrange rounded-xl py-2 px-2 w-full text-white max-w-[200px]';

const buttonTypes = [{type: 'skyBlue', styles: skyBlue }, {type: 'customOrange', styles: customOrange }]

const SortButtons = ({type, text, onClick }: SortbuttonsProps) => {
  return (
    <button  className={buttonTypes.find(elm => elm.type === type)?.styles || ''}  onClick={onClick}>{text}</button>
  )
}

export default SortButtons