import React from 'react'


interface CodeItemProps {
    code: string
    label: string
}


const CodeItem = ({code, label}: CodeItemProps) => {
  return (
    <div>
        <div className="wrapper my-3">
            <h2 className="mb-2 text-xl">{label}: </h2>
            <div className="bg-gray-300	text-sm font-mono whitespace-pre-wrap rounded-xl px-3 py-3 my-5 text-customBlack">
                {code}
            </div>
        </div>
    </div>
  )
}

export default CodeItem