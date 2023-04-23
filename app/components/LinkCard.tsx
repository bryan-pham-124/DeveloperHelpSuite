import { Link } from '@remix-run/react'
import React from 'react'


interface LinkCardProps {
    category: string
    title: string
    status: string
    priority: string
    votes: number
}


const LinkCard = ({category, title, status, priority, votes}: LinkCardProps) => {
  return (
    <Link to ="#" > 
        <div className="rounded-xl bg-white px-5 py-4 my-5 hover:scale-110">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="text-center md:text-left wrapper mb-3 md:mb-0">
                    <small>{category}</small> 
                    <h1 className='text-xl font-bold'>{title}</h1>
                    <div className="flex flex-col md:flex-row  gap-y-3 md:gap-y-0 gap-x-2 mt-2">
                        <small className="bg-customRed rounded-xl px-3 text-white">
                            {status}
                        </small>
                        <small className="bg-customRed rounded-xl px-3 text-white">
                            {priority}
                        </small>
                    </div>
                </div>
                <p className='flex l px-3 py-5 border bg-customGreen rounded-xl'>
                    {votes} Votes
                </p>
            </div>
        </div>
    </Link>
  )
}

export default LinkCard