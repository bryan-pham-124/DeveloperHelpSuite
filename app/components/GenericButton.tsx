import React from 'react'
import { Link } from 'react-router-dom'

// app/components/form-field.tsx


// This is a generic button that is used on multiple pages
// it can be used a regular button or as a link.

interface GenericButtonArgs {
    to?: string
    text: string
    formButton?: boolean
    buttonType: string
    className?: string
    isSubmitting?: boolean
    onClick?: (...args: any) => any
    onSubmit?: (...args: any) => any
}

const GenericButton = (
    {
        to="" , 
        text, 
        formButton = false,
        buttonType,
        className = '',
        isSubmitting = false,
        onClick = () => {},
        onSubmit = () => {}
    }: GenericButtonArgs
) => {

  const buttonTypes = [
    {
      name: "skyBlue",
      styles: "font-light py-1 px-3 rounded-xl text-center",
      textColor: "text-white",
      bgColor: "bg-sky-500",
    },
    {
      name: "outlineWhite",
      styles: "font-light border px-3  py-1 rounded-xl text-center",  
      textColor: 'text-white',
      bgColor: 'bg-transparent',
    },
    {
      name: "blackFilled",
      styles: "font-light py-1 px-3 rounded-xl text-center",  
      textColor: 'text-white',
      bgColor: 'bg-customBlack',
    },

    {
      name: "dangerRed",
      styles: "font-light py-1 px-3 rounded-xl  text-center",  
      textColor: 'text-white',
      bgColor: 'bg-red-500',
    },
    
  ]

  let bStyle = buttonTypes.find(style => style.name === buttonType);

  return (
    <>
      {
        !formButton
        
        ? 

        <Link to={to} onClick={onClick}  
            className=  {
              `transition ease-in-out
              ${bStyle?.bgColor} hover:bg-customOrange
              ${bStyle?.textColor} 
              hover:text-${bStyle?.textColor} 
              hover:border-0
              duration-300 ${bStyle?.styles} 
               ${className}
              `
            }
            >
            {text}
        </Link> 

       :

       <input
            type="submit"
            onSubmit={onSubmit}
            className= {
              `transition ease-in-out
              ${bStyle?.bgColor} hover:bg-customOrange
              ${bStyle?.textColor} 
              hover:text-${bStyle?.textColor} 
              hover:border-0
              duration-300 ${bStyle?.styles} 
               ${className}
              `
            } 
            onClick={onClick}
            disabled = {isSubmitting}
            value={text}
        />

      }
      
    </>
     
  )
}

export default GenericButton