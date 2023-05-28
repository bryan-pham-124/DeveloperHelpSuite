import React from 'react'


interface CodeItemProps {
    code: string
}


// component on a question/reply shows user code
const CodeItem = ({code}: CodeItemProps) => {
  return (
    <div>
        <div className="wrapper my-3">
            <h2>Code:</h2>
            <div className="bg-gray-300	text-sm font-mono whitespace-pre overflow-auto rounded-xl px-3 py-3 my-5 text-customBlack">
                {code}
            </div>
        </div>
    </div>
  )
}

export default CodeItem