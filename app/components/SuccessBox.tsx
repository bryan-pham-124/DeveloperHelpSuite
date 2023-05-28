import React from 'react'


interface SuccessBoxProps {
    text:string
}

// displays success message when user's request is furfilled
export const SuccessBox = ({text} : SuccessBoxProps) => {
  return (
    <div className='my-4 px-4 py-2 bg-customGreen rounded-xl text-white font-bold max-w-[400px] text-center'>
        {text}
    </div>
  )
}

export default SuccessBox