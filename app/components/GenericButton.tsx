import React from 'react'
import { Link } from 'react-router-dom'





// app/components/form-field.tsx
interface GenericButtonArgs {
    to: string,
    text: string,
    buttonType: string
    onClick?: (...args: any) => any
}

const buttonTypes = [
    {
      name: "skyBlue",
      styles: "font-light py-1 rounded-xl w-[80px] text-center",
      textColor: "text-white",
      bgColor: "bg-sky-500",
    },
    {
      name: "outlineWhite",
      styles: "font-light border py-1 border-white rounded-xl w-[80px] text-center",  
      textColor: 'text-white',
      bgColor: 'bg-transparent',
    },
    {
      name: "blackFilled",
      styles: "font-light   py-1 rounded-xl w-[80px] text-center",  
      textColor: 'text-white',
      bgColor: 'bg-[#212121]',
    },
    
]


const GenericButton = (
    {
        to , 
        text, 
        buttonType,
        onClick = () => {}
    }: GenericButtonArgs
) => {

  let bStyle = buttonTypes.find(style => style.name === buttonType);

  return (
     <Link to={to} onClick={onClick} 
        className= 
           {
              `transition ease-in-out
              ${bStyle?.bgColor} hover:bg-[#fc8403]
              ${bStyle?.textColor} 
              hover:text-${bStyle?.textColor} 
              hover:border-0
              duration-300 ${bStyle?.styles} `
           }
         >
        {text}
     </Link>
  )
}

export default GenericButton