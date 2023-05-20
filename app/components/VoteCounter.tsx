import React, {useState, useEffect,  useCallback } from 'react'
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { Form, useActionData} from '@remix-run/react';
import { ActionFunction } from '@remix-run/node';



import { testString, updateVotes } from  '../utils/voteCounter';
 



interface VoteCounterProps {
    votes: number | null
    currentVoteStatus: string // up down none
    userId?: string
}


/*
    Vote counter submits data with updated vote count 
    Need to supply own action method on page using this counter to send data back to data 

*/


const VoteCounter = ({votes, currentVoteStatus, userId}: VoteCounterProps) => {


  const [voteCount, setVoteCount] = useState(votes);

  const [toggleUp, setToggleUp] = useState(currentVoteStatus  === 'upvotes');

  const [toggleDown, setToggleDown] = useState(currentVoteStatus  === 'downvotes');


  const updateCounter = (currentCounter: string) => {

        if(currentCounter === 'upvotes'){

            if(!toggleUp){
                setToggleUp(true);
                setToggleDown(false);
            }
         
        }
        else if(currentCounter === 'downvotes'){
           
            if(!toggleDown){
                setToggleUp(false);
                setToggleDown(true);
            }
           
        }

  }

  useEffect(() => {console.log(voteCount)}, [voteCount])


  


 
  return (
    <div className="h-32 bg-customGreen px-3 py-3 flex flex-col items-center justify-center rounded-xl">

        <input type="hidden" name='currentVoteStatus' value={toggleUp ? 'upvotes': toggleDown ? 'downvotes': 'none'} />
        <input type="hidden" name='userId' value={userId} />

     
        {
            userId 
            
            &&

           <button type='submit'  onClick={() => updateCounter('upvotes')} >
                <FontAwesomeIcon icon={faArrowUp}className={toggleUp ? 'text-customOrange': 'text-white'}/>
           </button>
        

        }
     
        
        <div className="wrapper my-2 text-center text-sm">
            {votes} Votes
        </div>
        
        {

            userId 

            &&
            
            <button type='submit' onClick={() => updateCounter('downvotes')} >
                <FontAwesomeIcon icon={faArrowDown} className={toggleDown ? 'text-customOrange': 'text-white'} />
            </button>
            

        }
       
    </div>
  )
}

export default VoteCounter