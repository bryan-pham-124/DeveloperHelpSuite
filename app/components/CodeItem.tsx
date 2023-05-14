import React from 'react'


interface CodeItemProps {
    code: string
}


const CodeItem = ({code}: CodeItemProps) => {
  return (
    <div>
        <div className="wrapper my-3">
            <div className="bg-gray-300	text-sm font-mono whitespace-pre-wrap rounded-xl px-3 py-3 my-5 text-customBlack">
                {code}
            </div>
        </div>
    </div>
  )
}

export default CodeItem