import React, {useState, useEffect,  useCallback } from 'react'
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { Form, useActionData, useNavigation} from '@remix-run/react';
import { ActionFunction } from '@remix-run/node';



import { updateVotes } from  '../utils/voteCounter';
 



interface VoteCounterProps {
    votes: number | null
    currentVoteStatus: string // up down none
    userId?: string | null
}


/*
    shows the current number of upvotes minus downvotes for a reply or question
    Need to supply own action method on page using this counter to send data back to data 
*/


const VoteCounter = ({votes, currentVoteStatus, userId}: VoteCounterProps) => {


  const [voteCount, setVoteCount] = useState(votes);

  const [toggleUp, setToggleUp] = useState(currentVoteStatus  === 'upvotes');

  const [toggleDown, setToggleDown] = useState(currentVoteStatus  === 'downvotes');


  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";


  // update the toggle status of vote counter when user clicks vote counter
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
    <div className="w-full h-32 bg-customGreen px-2 py-3 flex flex-col items-center justify-center rounded-xl">

        <input type="hidden" name='currentVoteStatus' value={toggleUp ? 'upvotes': toggleDown ? 'downvotes': 'none'} />
        <input type="hidden" name='userId' value={userId || ''} />

     
        {
            // only logged in users can interact with vote counters
            // non logged in users will not see arrows

            userId 
            
            &&

           <button type='submit'  onClick={() => updateCounter('upvotes')}  className={ isSubmitting ? `mt-4 pointer-events-none opacity-20`: ''} >
                <FontAwesomeIcon icon={faArrowUp}className={toggleUp ? 'text-customOrange': 'text-white'}/>
           </button>
        

        }
     
        
        <div className="wrapper my-2 text-center text-sm">
            {votes} Votes
        </div>
        
        {

             // only logged in users can interact with vote counters
            // non logged in users will not see arrows

            userId 

            &&
            
            <button type='submit' onClick={() => updateCounter('downvotes')} className={ isSubmitting ? `mt-4 pointer-events-none opacity-20`: ''} >
                <FontAwesomeIcon icon={faArrowDown} className={toggleDown ? 'text-customOrange': 'text-white'} />
            </button>
            
        }
       
    </div>
  )
}

export default VoteCounter