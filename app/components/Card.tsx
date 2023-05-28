import { Form, useNavigation } from '@remix-run/react'
import React, { useState } from 'react'
import TextItem from './TextItem'
import CodeItem from './CodeItem'
import LinkItem from './LinkItem'
import VoteCounter from './VoteCounter'
import { dataProps } from '~/utils/types.server'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'


// data, userId, authorName, authorId, cardId, message, userVotesInfo



interface CardProps {
    type: 'question' | 'reply'
    data: dataProps | null
    userId: string | null  | undefined
    authorId: string | null | undefined
    authorName: string | null | undefined
    cardId: string | null
    userVotesInfo?: {currentVoteToggle?: string | null  } | null
    voteCount: number
    replyId?: string | null
    status: string  
    questionAuthorId?: string | null
}



const Card = (
    {       
        type = 'question',
        data,
        userId, 
        authorName, 
        authorId, 
        cardId, 
        userVotesInfo, 
        voteCount,
        replyId,
        status,
        questionAuthorId
    }: CardProps
    
    
    ) => {


 
  const formattedDate = () => {
        const dateArr = data?.createdAt?.split('T')[0].split('-');
        if(dateArr){
            const year = dateArr[0];
            dateArr.splice(0,1);
            return [...dateArr, year ].join('/')
        } else {
            return 'Unknown date';
        }
    
  }

 
  const content = type === 'question' ?  data?.questionContent: data?.replyContent;
  const deleteAction = type === 'question' ? `/deleteCard?cardId=${cardId}&authorId=${authorId}&userId=${userId}`: '#';
  const editAction = type === 'question' ? `/questionEditForm?cardId=${cardId}`: `/questionEditForm?cardId=${cardId}&replyId=${replyId}&isReply=true`;

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const canChangeStatus = userId === questionAuthorId;

  return (
    <div className="card-wrapper   md:w-[50vw] max-w-[600px] mx-3 my-6  pb-4   border-3 border-sky-500 bg-customBlack text-white rounded-xl">
            <div className={`wrapper grid-cols-5  w-full flex justify-between py-5 px-8 rounded-t-xl ${data?.status === 'Solved' ? 'bg-customGreen': 'bg-sky-500'}`}>   
                <div className="wrapper grid-cols-4">
                    <h1 className='text-2xl font-bold'>
                         {`${data?.title}  
                            
                        ${ 
                           type ==='question' && data?.status === 'Solved' ? '(Solved)' :
                           type ==='reply' && data?.preferredAnswer ? '(Solution)' : ''
                        }`}
                    </h1>
                    <small className="text-xs">
                        { type === 'question' ? `Asked by`: `Answered by`} {authorName || 'Unknown author'} on {formattedDate()}
                    </small>
                </div>
                {

                    userId === data?.userId

                    &&

                    <div className="flex flex-col gap-y-3">
 
                        <a href={editAction} 
                            className="px-4 py-1 bg-customBlack rounded-xl text-center transition hover:bg-customOrange text-xs"
                         >
                            Edit
                        </a>
                                                    
                        <form action={deleteAction} method="post">
                            <button   className="px-4 py-1 bg-customRed rounded-xl text-center transition hover:bg-customOrange text-xs">Delete</button>
                        </form>

                    </div>

                }
 

             </div>

            <div className="wrapper grid grid-cols-4  pr-8 mt-5">
                <div className="wrapper flex flex-col  items-center">
                    {
                        isSubmitting

                        &&

                        <p className='text-customOrange text-sm'>
                            Updating card...
                        </p>
                    }    
                    
                    {

                        data && 

                        <Form action = {`/updateVotes?cardId=${cardId}&tableName=${type}&replyId=${replyId}`} method="post">
                            <VoteCounter

                                 userId={userId} 

                                 currentVoteStatus= { 

                                    userVotesInfo !== null && userVotesInfo !== undefined && userVotesInfo.currentVoteToggle 
                                    
                                    ? 
                                    
                                    userVotesInfo.currentVoteToggle

                                    : 

                                    'none'

                                } 
                                
                                votes= {  voteCount }

                            />
                                     
                        </Form>
                     
                    }

                    {
                        type ==='reply' &&

                        <div className='wrapper w-25 my-5 flex flex-col items-center'>

                            <h2 className='text-center text-sm'>
                                Best solution?
                            </h2>
                          
                            <Form 
                                action = {`/updateStatus?cardId=${cardId}&replyId=${replyId}&status=${data?.preferredAnswer ? 'Not Solved': "Solved"}`}  
                                method="post"
                             >
                                <button  type='submit'
                                         className=
                                            {`
                                                ${(isSubmitting || !canChangeStatus ) ? 'mt-4 pointer-events-none': ''}
                                                ${data?.preferredAnswer ? 'bg-customOrange': 'bg-gray-400'}
                                                p-3 rounded-xl mt-3
                                            `}
                                 >

                                 {
                                    data?.preferredAnswer 

                                    ?

                                    <FontAwesomeIcon icon={faCheck} className= "h-6" />

                                    :

                                    <FontAwesomeIcon icon={faXmark} className= "h-6" />

                                 }
                                
                                    
                                </button>
                            </Form>

                        </div>
                    }

                </div>
                <div className="wrapper-main-content col-span-3">
                    

                    {

                        data

                        ?

                        <>
                        
                            <div className="mb-5">
                                <h1 className="text-xl mb-3"> Description: </h1>
                                <TextItem text = {data.description || ''}/>
                            </div>
                            
                            {

                                // sort questionContent (optional content) by order user submitted in form 

                                content &&

                                content.sort((a,b) => a.order - b.order).map((elm, i) => {

                                    if(elm.type.search('code') !== -1){
                                        return  <CodeItem key= {i} code ={elm.content}/>
                                    }
        
                                    else if(elm.type.search('text') !== -1){
                                        return  <TextItem   key= {i} text ={elm.content}/>
                                    }
        
                                    else if(elm.type.search('link') !== -1){
                                        return  <LinkItem   key= {i} link ={elm.content}/>
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
  )
}

export default Card