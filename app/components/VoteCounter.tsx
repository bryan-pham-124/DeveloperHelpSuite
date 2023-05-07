import React, {useState, useEffect} from 'react'
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { Form, useActionData } from '@remix-run/react';
import { ActionFunction } from '@remix-run/node';


interface VoteCounterProps {
    votes: number
    voteStatus: string // up down none
}


/*
    Vote counter submits data with updated vote count 
    Need to supply own action method on page using this counter to send data back to data 

*/
 
const VoteCounter = ({votes, voteStatus}: VoteCounterProps) => {

    
  const [newVoteCount, setNewVoteCount] = useState(votes);

  const [toggleUp, setToggleUp] = useState(voteStatus  === 'up');

  const [toggleDown, setToggleDown] = useState(voteStatus  === 'down');

  const updateCounter = (currentCounter: string) => {

        let incrementVote = 0;

        if(currentCounter === 'up'){

            if(!toggleUp){
                if(!toggleUp && !toggleDown){ 
                    incrementVote = 1;
                } else {
                    incrementVote = 2;
                }
                setToggleUp(true);
                setToggleDown(false);
            }
         
        }
        else if(currentCounter === 'down'){
            // check if button has not been toggled yet
                // decrement by 1 if it has not
                // decrement by 2 if it has to undo upvote
            if(!toggleDown){
                if(!toggleUp && !toggleDown){ 
                    incrementVote = -1;
                } else {
                    incrementVote = -2;
                }
                setToggleUp(false);
                setToggleDown(true);
            }
           
        }

        setNewVoteCount(prevData => prevData + incrementVote);
  }

  useEffect(() => { 
        if(toggleUp){
            console.log("Toggle up " + newVoteCount )
        } else {
            console.log("Toggle down " + newVoteCount)
        }
  }, [newVoteCount])


  return (
    <Form  action ='/questionCard' method='POST' className=" h-24 bg-customGreen px-3 py-3 flex flex-col items-center rounded-xl">
        <button>
           <FontAwesomeIcon icon={faArrowUp} onClick={() => updateCounter('up')} className={toggleUp ? 'text-customOrange': 'text-white'}/>
        </button>
        <div className="wrapper my-2 text-center text-sm">
            {votes} Votes
        </div>
        <button >
            <FontAwesomeIcon icon={faArrowDown} onClick={() => updateCounter('down')} className={toggleDown ? 'text-customOrange': 'text-white'} />
        </button>
        <input type="hidden" id="newVoteCount" name="newVoteCount" value={newVoteCount}/>
    </Form>
  )
}

export default VoteCounter