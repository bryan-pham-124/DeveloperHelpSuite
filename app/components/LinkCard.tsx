import { Link } from '@remix-run/react'
import React from 'react'


//link cards are the the small cards that appear on the "questions" page
//users can click on them to go to the card's corresponding question

interface LinkCardProps {
    id: string
    category: string
    title: string
    status: string
    priority: string
    upvotes: number
    downvotes: number
}

// display different color based on a question's priority
const getTagColor = (priority:string) => {
    return priority === 'Urgent' ? 'bg-customRed' :  priority === 'Medium' ? 'bg-customOrange' : priority === 'Low' ? 'bg-customGreen' : '';

}

const getSolvedColor = (status:string) => {
    return status === 'Solved' ? 'bg-customGreen' : 'bg-customRed' ;
}

//link card displays basic information about question like status, priority, etc
const LinkCard = ({id, category, title, status, priority, upvotes, downvotes}: LinkCardProps) => {
  return (
    <Link to = {'/questionCard?cardId=' + id} > 
        <div className="rounded-xl bg-white px-5 py-4 my-5 hover:scale-110">
            <div className="flex flex-col gap-y-2 md:flex-row md:gap-y-0 justify-between md:items-start lg:items-center">
                <div className="text-center md:text-left wrapper mb-3 md:mb-0 mx-3">
                    <small>{category}</small> 
                    <h1 className='text-md font-bold'>{title}</h1>
                    <div className="flex flex-col md:flex-row  gap-y-5 md:gap-y-2 gap-x-2 my-5">
                        <small className={getSolvedColor(status) + " rounded-xl px-3 py-2 md:py-1 text-white flex justify-center items-center"}>
                            {status}
                        </small>
                        <small className={getTagColor(priority) + " rounded-xl px-3 py-2 md:py-1 text-white flex justify-center items-center"}>
                            {priority}
                        </small>
                    </div>
                </div>
                <p className='flex justify-center px-5 lg:px-2 py-5 border bg-customGreen rounded-xl text-center text-xs text-white font-bold'>
                    {upvotes - downvotes} Votes
                </p>
            </div>
        </div>
    </Link>
  )
}

export default LinkCard