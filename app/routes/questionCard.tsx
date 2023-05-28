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
   
  const {question, userId, authorName, authorId, cardId, message, userVotesInfo, replies} = useLoaderData<typeof loader>();   
  const [isFormDisplayed, setIsFormDisplayed] = useState(false);
  const [isReplySubmitted, setIsReplySubmitted] = useState(false);

 
  const [isRepliesLoaded, setIsRepliesLoaded] = useState(false);


  useEffect(() => {

        let isAllVotesLoaded = true;

        if(replies){
            console.log('replies below')
            console.log(replies)

            for(let i = 0; i < replies.length; i++){
                if(replies[i].upvotes === null || replies[i].downvotes === null){
                    isAllVotesLoaded = false;
                    break;
                }
            }

        }

        setIsRepliesLoaded(isAllVotesLoaded);

  }, [replies])

  


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


            <h1 className="mt-5 text-center text-4xl font-bole">Question </h1>


            {


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
                replies && replies.length > 0 
                
                ?

                <>

                    <h1 className="mt-5 text-center text-4xl font-bole">Replies </h1>

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