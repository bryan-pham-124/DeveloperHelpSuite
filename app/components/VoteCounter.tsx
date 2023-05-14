import React, {useState, useEffect,  useCallback } from 'react'
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { Form, useActionData} from '@remix-run/react';
import { ActionFunction } from '@remix-run/node';



import { testString, updateVotes } from '~/utils/voteCounter.server';


interface VoteCounterProps {
    votes: number | null
    voteStatus: string // up down none
    cardId: string
}


/*
    Vote counter submits data with updated vote count 
    Need to supply own action method on page using this counter to send data back to data 

*/


const VoteCounter = ({votes, voteStatus, cardId}: VoteCounterProps) => {

    
  const [voteCount, setVoteCount] = useState(votes);

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

         setVoteCount(prevData => prevData !== null ? (prevData + incrementVote): prevData);
  }




  const [testData, setTestData] = useState('');



  /*
  useEffect(() => { 

    const fetchData = async () => {
       return await testString();
    }


    fetchData().then(res =>  setTestData(res)).catch(console.error)

  }, [])

  */











 


  useEffect(() => { 
    /*
    if(toggleUp){
        console.log("Toggle up " + newVoteCount )
    } else if(toggleDown){
        console.log("Toggle down " + newVoteCount)
    } else {
        console.log("NO TOGGLES")
    }
    */

    
     
    const activeCounter = toggleDown ? 'downvotes': 'upvotes';
    

    if(voteCount){

        
        const fetchData = async () => {
            return await updateVotes(cardId, activeCounter, voteCount, `/questionCard?questionId=${cardId}`);
        }

        fetchData().then(res => console.log(res)).catch(console.error)


    }  
     
  }, [voteCount]);



  return (
    <div   className="h-32 bg-customGreen px-3 py-3 flex flex-col items-center justify-center rounded-xl">
       
        <FontAwesomeIcon icon={faArrowUp} onClick={() => updateCounter('up')} className={toggleUp ? 'text-customOrange': 'text-white'}/>
        
        <div className="wrapper my-2 text-center text-sm">
            {votes} Votes
        </div>
        
        <FontAwesomeIcon icon={faArrowDown} onClick={() => updateCounter('down')} className={toggleDown ? 'text-customOrange': 'text-white'} />
        
        <input type="hidden" id="newVoteCount" name="newVoteCount" value={voteCount ? voteCount : 0}/>
    </div>
  )
}

export default VoteCounter