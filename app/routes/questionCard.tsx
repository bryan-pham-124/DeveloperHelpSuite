import { Form, Link, useLoaderData } from "@remix-run/react"
import {useEffect, useState} from 'react';
import 'flowbite';
import { getUser, getUserSession } from "~/utils/auth.server";
import { getQuestionById,   getReplies,   getRepliesVotesInfo,   getUserById, getUserVotesInfo } from "~/utils/questionCard.server";
import { LoaderArgs, json} from "@remix-run/node"; // or cloudflare/deno
import SuccessBox from "~/components/SuccessBox";
import ErrorBox from "~/components/ErrorBox";
import { clearMessage, flashMessage } from "~/utils/messages.server";
import GenericButton from "~/components/GenericButton";
import AnswerForm from "./answerForm";
import Card from "~/components/Card";

 

export async function loader({ request }: LoaderArgs) {

    const userData = await getUser(request);
    
    //check if user id is the user before they can do edit or delete on card
    const  userId: string | undefined  = userData?.id;

 
    // Retrieves the current session from the incoming request's Cookie header
    const session = await getUserSession(request);
    const message = session.get("message") || null;
 
    const url = new URL(request.url)
    const cardId = url.searchParams.get('cardId');

    const closeForm = false;




    let replies = null;


    
    let authorName = null;

    let authorId = null;

    let userVotesInfo = null;

    let repliesUserVotes = null;


    if(cardId !== null && cardId){


        replies = await getReplies(cardId);

        //console.log(replies);

        if(userId){
            userVotesInfo = await getUserVotesInfo(userId, cardId);
        }

        const data = await getQuestionById(cardId);
        
        if(data){
             const authorInfo =  await getUserById(data?.userId);
             authorName = authorInfo?.name;
             authorId = authorInfo?.id;
        }

        return await json( 
            {
                data: data, 
                userId: userId, 
                authorName: authorName, 
                message: message, 
                authorId: authorId,  
                cardId: cardId,
                userVotesInfo: userVotesInfo,
                displayForm: false,
                replies: replies,
            },
            {headers: await clearMessage(session)}

        );

    } else {
         
        return await json(
            {
                data: null, 
                userId: null, 
                authorName: authorName,
                message: message, 
                authorId: authorId,
                cardId: cardId,
                userVotesInfo: userVotesInfo,
                displayF: false,
                replies: replies
            },
           {headers: await clearMessage(session)}

        );
    }

}


const questionCard = () => {
   
  const {data, userId, authorName, authorId, cardId, message, userVotesInfo, replies} = useLoaderData<typeof loader>();   
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [voteCount , setNewVoteCount] = useState(0);
  const [isFormDisplayed, setIsFormDisplayed] = useState(false);
  const [isReplySubmitted, setIsReplySubmitted] = useState(false);


 

  useEffect(() => { 
  
    if(data){
        setIsDataLoaded(true);
        if(typeof data.upvotes === 'number' && typeof data.downvotes === 'number'){
            setNewVoteCount(data.upvotes - Math.abs(data.downvotes));
        }
    } else {
        setIsDataLoaded(false);
    }
    
    console.log(data)

  }, [data])



  return (
    <div className='w-full flex justify-center'>

        <div className="wrapper">
            {
                message 
                
                && 
                
                <div className="wrapper w-full flex justify-center mt-5">
                    <h1 className='text-black text-center'>   
                        {message.split(":")[0] === 'Success' ?  <SuccessBox text={message} /> :  <ErrorBox text={message} />}
                    </h1>
                </div>
            }         

            
            {

                !userId

                &&

                <div className="wrapper w-full flex justify-center">
                    <h1 className='text-black text-center'>   
                    <ErrorBox text={'You must be logged in to interact with posts'} />
                    </h1>
                </div>

            }

            <Card 
                type={'question'}
                data={data} 
                userId={userId} 
                authorName = {authorName} 
                authorId ={authorId} 
                cardId={cardId} 
                userVotesInfo={userVotesInfo}
                voteCount={ voteCount}
            />
      
            {
                userId

                &&

                <div className="wrapper my-3">
                    <div className="wrapper w-full flex justify-center">
                        <GenericButton 
                            text={isFormDisplayed ? 'Close Form' : 'Answer Question'} 
                            onClick={(e) => {e.preventDefault(); setIsFormDisplayed(prevData => !prevData)}} 
                            buttonType={isFormDisplayed ? 'dangerRed': 'skyBlue'}  />
                    </div>
                </div>

            }

            {

                isFormDisplayed && cardId

                &&

                <AnswerForm cardId={cardId} setIsFormDisplayed = {setIsFormDisplayed} setIsReplySubmitted ={setIsReplySubmitted} />
              
            }

            {
                replies
                
                &&

                replies.map((reply, i) => (
                    <Card 
                        key={i}
                        type={'reply'}
                        data={reply} 
                        userId={userId} 
                        authorName = {reply.user.name} 
                        authorId = {reply.userId} 
                        cardId={cardId} 
                        voteCount={reply.upvotes && reply.downvotes ? reply.upvotes - reply.downvotes: 0}
                        userVotesInfo={reply.repliesUserVotes}
                    />
                ))
                
            }

            {


                !message && isReplySubmitted

                && 

                <div className="wrapper w-full flex justify-center">
                    <SuccessBox text= " Your reply has been sent! Please wait a few seconds for server to respond."/>
                </div>

            }


            
            
            
        </div>
       
    </div>
  )
}

export default questionCard