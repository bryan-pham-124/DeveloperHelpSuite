import { Form } from '@remix-run/react'
import React from 'react'
import TextItem from './TextItem'
import CodeItem from './CodeItem'
import LinkItem from './LinkItem'
import VoteCounter from './VoteCounter'
import { dataProps } from '~/utils/types.server'


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
        voteCount

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


  console.log('name is: ' + authorName)

  const content = type === 'question' ?  data?.questionContent: data?.replyContent;
  const deleteAction = type === 'question' ? `/deleteCard?cardId=${cardId}&authorId=${authorId}&userId=${userId}`: '#';
  const editAction = type === 'question' ? `/questionEditForm?cardId=${cardId}`: '#';
 

  return (
    <div className="card-wrapper w-full md:w-[50vw] max-w-[600px] my-10  pb-4   border-3 border-sky-500 bg-customBlack text-white rounded-xl">
            <div className="wrapper grid-cols-5  w-full flex justify-between bg-sky-500 py-5 px-8 rounded-t-xl">   
                <div className="wrappe grid-cols-4">
                    <h1 className='text-2xl font-bold'> {`${data?.title}  ${data?.status ? `(${data?.status})`: '' }`}</h1>
                    <small className="text-xs">
                        { type === 'question' ? `Asked by`: `Answered by`} {authorName || 'Unknown author'} on {formattedDate()}
                    </small>
                </div>
                
                {

                    userId === data?.userId

                    &&

                    <div className="flex flex-col gap-y-3">
 
                        <a href={editAction} className="px-4 py-1 bg-customBlack rounded-xl text-center transition hover:bg-customOrange text-xs">Edit</a>
                                                    
                        <form action={deleteAction} method="post">
                            <button   className="px-4 py-1 bg-customRed rounded-xl text-center transition hover:bg-customOrange text-xs">Delete</button>
                        </form>

                    </div>

                }
 

             </div>

            <div className="wrapper grid grid-cols-4  pr-8 mt-5">
                <div className="wrapper flex justify-center  ">
                    
                    {

                      
                        data && 
                                         
                        <Form action = {`/updateVotes?cardId=${cardId}&tableName=${type}`} method="post">
                            <VoteCounter userId={userId} currentVoteStatus={ userVotesInfo !== null && userVotesInfo !== undefined && userVotesInfo.currentVoteToggle !== null ? userVotesInfo.currentVoteToggle: 'none'} votes={  voteCount } />
                        </Form>
                     
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
                                        return  <TextItem   key= {i}text ={elm.content}/>
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