import React from 'react'


interface ErrorBoxProps {
    text:string
}

// displays error messages on pages
const ErrorBox = ({text } : ErrorBoxProps) => {
  return (
    <div className='my-4 px-4 py-2 bg-red-600 rounded-xl text-white font-bold max-w-[400px] text-center'>
        {text}
    </div>

  )
}

export default ErrorBox