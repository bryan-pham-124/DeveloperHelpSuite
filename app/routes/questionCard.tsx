import { Form, Link, useLoaderData } from "@remix-run/react"
import {useEffect, useState} from 'react';
import DropDown from "~/components/DropDown"
import 'flowbite';
import LinkItem from "~/components/LinkItem";
import CodeItem from "~/components/CodeItem";
import TextItem from "~/components/TextItem";
import { ActionArgs, LoaderArgs, redirect, ActionFunction } from "@remix-run/node"; // or cloudflare/deno
import { getUser, getUserSession } from "~/utils/auth.server";
import VoteCounter from "~/components/VoteCounter";
import { getQuestionById,   getUserById, getUserVotesInfo } from "~/utils/questionCard.server";
import { json} from "@remix-run/node"; // or cloudflare/deno
import SuccessBox from "~/components/SuccessBox";
import ErrorBox from "~/components/ErrorBox";
import { clearMessage, flashMessage } from "~/utils/messages.server";

 

export async function loader({ request }: LoaderArgs) {

    const userData = await getUser(request);
    
    //check if user id is the user before they can do edit or delete on card
    const  userId: string | undefined  = userData?.id;

 

    // Retrieves the current session from the incoming request's Cookie header
    const session = await getUserSession(request);
    const message = session.get("message") || null;

 
    const url = new URL(request.url)
    const cardId = url.searchParams.get('cardId');

    let authorName = null;

    let authorId = null;

    let userVotesInfo = null;

    if(userId){
        userVotesInfo = await getUserVotesInfo(userId);
    }

    //console.log('user votes info is');
    //console.log(userVotesInfo);

    if(cardId !== null && cardId){

        const data = await getQuestionById(cardId);

        //console.log(data)
        
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
                userVotesInfo: userVotesInfo
            },
            {headers: await clearMessage(session)}

        );

    } else {
        // will work on redirecting user with cookies later,
        return await json(
            {
                data: null, 
                userId: null, 
                authorName: authorName,
                message: message, 
                authorId: authorId,
                cardId: cardId,
                userVotesInfo: userVotesInfo
            },
           {headers: await clearMessage(session)}

        );
    }

}
 

const questionCard = () => {
   
  const {data, userId, authorName, authorId, cardId, message, userVotesInfo } = useLoaderData<typeof loader>();

  const formattedDate = () => {
    const dateArr = data?.createdAt.split('T')[0].split('-');
    if(dateArr){
        const year = dateArr[0];
        dateArr.splice(0,1);
        return [...dateArr, year ].join('/')
    } else {
        return 'Unknown date';
    }

  }
    
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [voteCount , setNewVoteCount] = useState(0);


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
            
            <div className="wrapper w-full flex justify-center">
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
        

        <div className="card-wrapper w-full md:w-[50vw] max-w-[600px] my-10 mx-5 pb-4   border-3 border-sky-500 bg-customBlack text-white rounded-xl">
            <div className="wrapper grid-cols-5  w-full flex justify-between bg-sky-500 py-5 px-8 rounded-t-xl">   
                <div className="wrappe grid-cols-4">
                    <h1 className='text-3xl font-bold'> {data?.title || 'No title'}</h1>
                    <small className="text-xs">Asked by {authorName || 'Unknown author'} on {formattedDate()}</small>
                </div>
                
                {

                    userId === data?.userId

                    &&

                    <div className="flex flex-col gap-y-3">
 
                        <a href={`/questionEditForm?cardId=${cardId}`} className="px-4 py-1 bg-customBlack rounded-xl text-center transition hover:bg-customOrange text-xs">Edit</a>
                                                    
                        <form action={`/deleteCard?cardId=${cardId}&authorId=${authorId}&userId=${userId}`} method="post">
                            <button   className="px-4 py-1 bg-customRed rounded-xl text-center transition hover:bg-customOrange text-xs">Delete</button>
                        </form>

                    </div>

                }
 

             </div>

            <div className="wrapper grid grid-cols-4  pr-8 mt-5">
                <div className="wrapper flex justify-center  ">
                    
                    {
                        data && 
                                         
                        <Form action = {`/updateVotes?cardId=${cardId}`} method="post">
                            <VoteCounter userId={userId} currentVoteStatus={ userVotesInfo !== null && userVotesInfo.currentVoteToggle !== null ?  userVotesInfo.currentVoteToggle: 'none'} votes={  voteCount } />
                        </Form>
                    }

                </div>
                <div className="wrapper-main-content col-span-3">
                    

                    {

                        data

                        ?

                        <>
                        
                            <div className="mb-5">
                                <h1 className="text-2xl mb-3"> Description: </h1>
                                <TextItem text ={data.description}/>
                            </div>
                            
                            {

                                // sort questionContent (optional content) by order user submitted in form 
                                data.questionContent.sort((a,b) => a.order - b.order).map(elm => {

                                    if(elm.type.search('code') !== -1){
                                        return  <CodeItem code ={elm.content}/>
                                    }
        
                                    else if(elm.type.search('text') !== -1){
                                        return  <TextItem text ={elm.content}/>
                                    }
        
                                    else if(elm.type.search('link') !== -1){
                                        return  <LinkItem link ={elm.content}/>
                                    }
        
                                })
                            }
                            
                    
                        </>

                        :

                        <h1>Could not load in data. Please try refreshing the page.</h1>
                        
                    }

                 </div>
              </div>
            </div>
        </div>
       
        
    </div>
  )
}

export default questionCard