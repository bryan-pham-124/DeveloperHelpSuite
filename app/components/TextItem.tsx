import React from 'react'


interface TextItemsProps {
    label: string,
    text: string
}

const TextItem = ({label, text}: TextItemsProps) => {
  return (
    <div className="wrapper my-3">
        <h2 className="mb-2 text-xl">{label}: </h2>
        <div className="text-xs font-light"> {text} </div>
    </div>
  )
}

export default TextItem