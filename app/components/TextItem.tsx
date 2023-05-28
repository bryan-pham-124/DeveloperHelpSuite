import React from 'react'


interface TextItemsProps {

    text: string
}

// component that shows text on a question or reply
const TextItem = ({text}: TextItemsProps) => {
  return (
    <div className="wrapper my-3">
        <div className="text-xs font-light"> {text} </div>
    </div>
  )
}

export default TextItem