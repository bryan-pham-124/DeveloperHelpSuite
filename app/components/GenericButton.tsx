import React from 'react'
import { Link } from 'react-router-dom'


// app/components/form-field.tsx
interface GenericButtonArgs {
    to: string
    className: string
    text: string,
    textHoverColor?: string,
    bgHoverColor: string,
    onClick?: (...args: any) => any
}

const GenericButton = (
    {
        to , 
        className, 
        text, 
        bgHoverColor,
        textHoverColor = "",
        onClick = () => {}
    }: GenericButtonArgs
) => {

  let textHoverColorExists = textHoverColor !== "" ? `hover:text-${textHoverColor}` : '';
  
  return (
     <Link to={to} onClick={onClick} 
        className= {`${className} transition-colors duration-300 ease-in-out hover:bg-${bgHoverColor} ${textHoverColorExists} `}
      >
        {text}
     </Link>
  )
}

export default GenericButton