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

 


// this component is the page where each question and its corresponding replies  appear

export async function loader({ request }: LoaderArgs) {

    const userData = await getUser(request);
    
    //check if user id is the user before they can do edit or delete on card
    const  userId: string | undefined  = userData?.id;

 
    //load in all the necessary data for this page to display
    const session = await getUserSession(request);
    const message = session.get("message") || null;
 
    const url = new URL(request.url)
    const cardId = url.searchParams.get('cardId');

    let replies = null;

    let authorName = null;

    let authorId = null;

    let userVotesInfo = null;


    // send a different response if page cannot find cardId
    if(cardId !== null && cardId){


        // load in all the question and replies if a valid cardId is found


        replies = await getReplies(cardId);

        
        if(replies.length > 0){
            console.log('user upvotes: ' + replies[0].upvotes)
            console.log('user downvotes: ' + replies[0].downvotes)
        }
       

        if(userId){
            userVotesInfo = await getUserVotesInfo(userId, cardId);
        }

        const question = await getQuestionById(cardId);
        
        if(question){
             const authorInfo =  await getUserById(question?.userId);
             authorName = authorInfo?.name;
             authorId = authorInfo?.id;
        }

        return await json( 
            {
                question: question, 
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
                question: null, 
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
   
    // get the required information from the loader to display the information needed to display on questions and replues
  const {question, userId, authorName, authorId, cardId, message, userVotesInfo, replies} = useLoaderData<typeof loader>();   
  const [isFormDisplayed, setIsFormDisplayed] = useState(false);
  const [isReplySubmitted, setIsReplySubmitted] = useState(false);

 

  return (
    <div className='w-full flex justify-center'>

        <div className="wrapper">
            {

                // display any server messages to user

                message 
                
                && 
                
                <div className='wrapper w-full flex justify-center mt-5 text-black text-center'>   
                    {message.split(":")[0] === 'Success' ?  <SuccessBox text={message} /> :  <ErrorBox text={message} />}
                </div>
                 
            }         

            
            {

                // check if user is logged in in order to determine if they can interact with posts

                !userId

                &&

                <div className='wrapper w-full flex justify-center mt-5 text-black text-center'>    
                    <ErrorBox text={'You must be logged in to interact with posts'} />
                </div>
                

            }


            {

                // display a message on top of page if there is a solution to a question

               replies && replies.find(reply => reply.preferredAnswer)  &&

                <div className="wrapper w-full flex justify-center">
                    <SuccessBox text={'Solution to question is below in the replies.'} />
               </div>
 
            }


            <h1 className="mt-5 text-center text-4xl font-bold">Question </h1>


            {  

                // render all questions if there is question data

                question && question.upvotes !== null  && question.downvotes !== null &&

                <Card 
                    type={'question'}
                    data={question} 
                    userId={userId} 
                    authorName = {authorName} 
                    authorId ={authorId} 
                    cardId={cardId} 
                    userVotesInfo={userVotesInfo}
                    voteCount={ question.upvotes - question.downvotes}
                    status={question?.status || 'Not Solved'}
                />

            }
            
      
            {

                // button that displays a form where users can write their solution on and submit to server

                // only logged in users can submit replies

                userId

                &&

                <div className="wrapper my-3">
                    <div className="wrapper w-full flex justify-center">
                        <GenericButton 
                            text={isFormDisplayed ? 'Close Form' : 'Answer Question'} 
                            onClick={(e) => {e.preventDefault(); setIsFormDisplayed(prevData => !prevData)}} 
                            buttonType={isFormDisplayed ? 'dangerRed': 'skyBlue'}  
                        />
                    </div>
                </div>

            }

            {

                isFormDisplayed && cardId

                &&

                <AnswerForm cardId={cardId} setIsFormDisplayed = {setIsFormDisplayed} setIsReplySubmitted ={setIsReplySubmitted} />
              
            }

            

            {  

                // render all replies to a question, if there are not any, tell user that there are no replies

                replies && replies.length > 0 
                
                ?

                <>

                    <h1 className="mt-5 text-center text-4xl font-bold">Replies </h1>

                    {

                        replies.map((reply, i) => (
                                                
                            reply.upvotes !== null  && reply.downvotes  !== null

                            &&

                            <Card 
                                key={i}
                                type={'reply'}
                                data={reply} 
                                userId={userId} 
                                authorName = {reply.user.name} 
                                authorId = {reply.userId} 
                                cardId={cardId} 
                                voteCount={reply.upvotes - reply.downvotes }
                                replyId={reply.id || null}
                                status={question?.status || 'Not Solved'}
                                userVotesInfo={reply.repliesUserVotes.find(elm => elm.userId === userId && elm.replyId === reply.id)}
                                questionAuthorId = {authorId || null}
                            />

                            
                        ))

                    }
                    
                
                </>
               
                :

                <h1 className="text-center mt-5"> Looks like there are no replies here </h1>

                
            }

            {
                // send user a message when they submit their reply to a question

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