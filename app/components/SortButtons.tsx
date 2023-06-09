//import { sortCards } from "~/utils/sortFilter.server";
import { sortCardsProps } from "~/utils/types.server";


interface SortbuttonsProps {
   type: string
   
   text: string
    onClick: any
}

//buttons that are used in sorting cards on the "questions page"
//come in multiple colors
const skyBlue = 'bg-sky-500 rounded-xl py-2 px-2 my-3 w-full text-white';
const customOrange ='bg-customOrange rounded-xl py-2 px-2 w-full text-white';

const buttonTypes = [{type: 'skyBlue', styles: skyBlue }, {type: 'customOrange', styles: customOrange }]

const SortButtons = ({type, text, onClick }: SortbuttonsProps) => {
  return (
    <button  className={buttonTypes.find(elm => elm.type === type)?.styles || ''}  onClick={onClick}>{text}</button>
  )
}

export default SortButtons