import { Link } from '@remix-run/react'
import React from 'react'


interface LinkCardProps {
    id: string
    category: string
    title: string
    status: string
    priority: string
    upvotes: number
    downvotes: number
}

const getTagColor = (priority:string) => {
    return priority === 'Urgent' ? 'bg-customRed' :  priority === 'Medium' ? 'bg-customOrange' : priority === 'Low' ? 'bg-customGreen' : '';

}

const getSolvedColor = (status:string) => {
    return status === 'Solved' ? 'bg-customGreen' : 'bg-customRed' ;
}

const LinkCard = ({id, category, title, status, priority, upvotes, downvotes}: LinkCardProps) => {
  return (
    <Link to = {'/questionCard?questionId=' + id} > 
        <div className="rounded-xl bg-white px-5 py-4 my-5 hover:scale-110">
            <div className="flex flex-col gap-y-2 min-[810px]:flex-row min-[810px]:gap-y-0 justify-between items-center">
                <div className="text-center min-[810px]:text-left wrapper mb-3 md:mb-0">
                    <small>{category}</small> 
                    <h1 className='text-md font-bold'>{title}</h1>
                    <div className="flex flex-col md:flex-row  gap-y-3 md:gap-y-2 gap-x-2 mt-2">
                        <small className={getSolvedColor(status) + " rounded-xl px-3 text-white"}>
                            {status}
                        </small>
                        <small className={getTagColor(priority) + " rounded-xl px-3 text-white"}>
                            {priority}
                        </small>
                    </div>
                </div>
                <p className='flex l px-2 py-5 border bg-customGreen rounded-xl text-center text-xs'>
                    {upvotes - downvotes} Votes
                </p>
            </div>
        </div>
    </Link>
  )
}

export default LinkCard