import { Link, useLoaderData } from "@remix-run/react"
import {useEffect, useState} from 'react';
import DropDown from "~/components/DropDown"
import 'flowbite';
import LinkItem from "~/components/LinkItem";
import CodeItem from "~/components/CodeItem";
import TextItem from "~/components/TextItem";
import { ActionArgs, LoaderArgs, redirect, ActionFunction } from "@remix-run/node"; // or cloudflare/deno
import { getUser, getUserSession } from "~/utils/auth.server";
import VoteCounter from "~/components/VoteCounter";
import { getQuestionById, getUserById } from "~/utils/questionCard.server";
import { json} from "@remix-run/node"; // or cloudflare/deno


export const action: ActionFunction = async ({ request }) => {

    const formData = await request.formData();

    const url = new URL(request.url)
    const id = url.searchParams.get('questionId')

    console.log(formData.get('newVoteCount'))

    return null;

}

export async function loader({ request }: LoaderArgs) {

    const userData = await getUser(request);
    

    //check if user id is the user before they can do edit or delete on card
    const  userId: string | undefined  = userData?.id;

    // Retrieves the current session from the incoming request's Cookie header
    const session = await getUserSession(request);

    const url = new URL(request.url)
    const id = url.searchParams.get('questionId')

    console.log(id);

    let authorName = null;

    if(id !== null && id){
        const data = await getQuestionById(id)
        console.log(data);

        if(data){
             authorName = await getUserById(data?.userId)  ;
        }

        return await json({ data: data, userId: userId, authorName: authorName });

    } else {
        // will work on redirecting user with cookies later.
        return await json({ data: null, userId: null, authorName: authorName});
    }

}


const questionCard = () => {
   
  const {data, userId, authorName } = useLoaderData<typeof loader>();

  const formattedData = () => {
    
    if(data){
        const dataCopy = Object.entries(data);
        return dataCopy;
    }
   
  }

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
    
  const [displayedData, setDisplayedData] = useState(formattedData());

  console.log(displayedData)

  return (
    <div className='w-full flex justify-center'>

        <div className="card-wrapper w-full md:w-[50vw] my-10 mx-5 pb-4   border-3 border-sky-500 bg-customBlack text-white rounded-xl">
            <div className="wrapper   w-full flex justify-between bg-sky-500 py-5 px-8 rounded-t-xl">   
                <div className="wrapper">
                    <h1 className='text-3xl font-bold'> {data?.title || 'No title'}</h1>
                    <small className="text-xs">Asked by {authorName?.name || 'Unknown author'} on {formattedDate()}</small>
                </div>
                

                {

                    userId 

                    &&

                    <>
                         <button id="dropdownDefaultButton" data-dropdown-toggle="dropdown" className="text-white bg-transparent h-10 text-center rounded-xl appearance-none transition hover:bg-customOrange px-5 text-2xl"> ...    </button>

                        <div id="dropdown" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg border-2 border-customOrange">
                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                                <li>
                                    <a href="#" className="block px-4 py-2 transition hover:bg-customOrange">Edit</a>
                                </li>
                                <li>
                                    <a href="#" className="block px-4 py-2 transition hover:bg-customOrange">Delete</a>
                                </li>
                            </ul>
                        </div>
                    </>

                }
 

             </div>

            <div className="wrapper grid grid-cols-4  pr-8 mt-5">
                <div className="wrapper flex justify-center  ">
                    <VoteCounter voteStatus="up" votes={ (+data?.upvotes - +data?.downvotes)  } />
                </div>
                <div className="wrapper-main-content col-span-3">
                    
                   <TextItem label={'Description'} text={" Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque culpa veniam modi atque explicabo esse possimus!"}/>
                   
                   <CodeItem label="Code" code ={'<h1>\n <span>\n  Test Inner \n </span>\n<h1>'}/>
 
                   <LinkItem  link={'https://stackoverflow.com/questions/2000656/using-href-links-inside-option-tag'}/>

                </div>
            </div>
        </div>
        
    </div>
  )
}

export default questionCard