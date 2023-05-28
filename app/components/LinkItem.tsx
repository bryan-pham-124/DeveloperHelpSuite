import { Link } from '@remix-run/react'
import React from 'react'

interface linkItemProps {
    link: string
}

// link on a question or reply that shows a link that can be clicked
const LinkItem = ({link}: linkItemProps) => {
  return (
    <div> 
        <div className="wrapper my-3">
            <h2>Link:</h2>
            <Link to={link}>
                <div className="bg-gray-300	text-xs font-mono rounded-xl px-3 py-3 my-5 text-customBlack  transition hover:scale-110">
                    {link}
                </div>  
            </Link>
        </div>
    </div>
  )
}

export default LinkItem