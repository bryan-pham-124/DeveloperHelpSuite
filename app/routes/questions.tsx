import {useState, useEffect} from 'react'
import { json, redirect } from "@remix-run/node"; // or cloudflare/deno
import { getUser } from '~/utils/auth.server';
import { useLoaderData } from '@remix-run/react';
import type { LoaderArgs } from "@remix-run/node";
import ErrorBox from '~/components/ErrorBox';
import GenericButton from '~/components/GenericButton';
import {  
          faHourglassEmpty, 
          faQuestionCircle, faCaretSquareDown, 
          faArrowAltCircleDown, faArrowAltCircleUp, 
          faCaretSquareUp,
          faThumbsUp, faThumbsDown, faBarChart
        } 
       from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; 
import sortDown from "~/images/sort-down-solid.svg";
import ImageIcon from '~/components/ImageIcon';
 

export async function loader({ request }: LoaderArgs) {

  const userData = await getUser(request);
  
  if(!userData){
    return await json({'userData':null});
  }

  return await json({'userData': userData});

}

const questions = () => {
  
  const {userData} = useLoaderData<typeof loader>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
      setIsLoggedIn(userData ? true: false)
  }, [userData])

  return (
  
      <div className="wrapper mt-[50px] px-10">
    
          <div className="flex w-full justify-between mb-[50px]">
            <h1 className='text-4xl font-bold'>Questions</h1>
            <GenericButton text ="Ask A Question" buttonType='skyBlue' />
          </div>

          {
            !isLoggedIn 
            
            &&
            
            <div className="flex justify-center">
                <ErrorBox text={"You must be logged in to interact with posts"} />
            </div>
          }

          <div className="flex w-full ">
              <div className="w-full bg-customBlack p-3 min-h-[50vh] rounded-l-xl"> 
                  <div className='flex flex-col md:flex-row w-full justify-between  items-center border-b pb-3 px-4  border-white'>
                      <h1 className='py-4 px-3 text-3xl text-white'>Total Questions</h1>
                      <p className='bg-white px-5 py-1 text-customBlack rounded-xl text-md'> 20</p>
                  </div>
                  <div className='flex flex-col md:flex-row w-full justify-between gap-x-3 mt-[40px] px-6'>
                     <label className='text-white font-light mb-4  md:mb-0 ' htmlFor="Sort">Sort</label>
                      <select className={`bg-[url('../images/sort-down-solid.svg')] bg-no-repeat bg-[right_10%_bottom_95%] bg-[length:20px_30px]	appearance-none  pl-[20px]  pb-2 pt-1 pr-8  rounded-xl`}>
                        <option value="Upvotes">Upvotes</option>
                        <option value="Date">Date</option>
                        <option value="Priority">Priority</option>
                      </select>
                      <label className='text-white font-light my-4 md:my-0' htmlFor="Filter">Filter</label>
                      <select  className={`bg-[url('../images/sort-down-solid.svg')] bg-no-repeat bg-[right_10%_bottom_95%] bg-[length:20px_30px]	appearance-none  pl-[20px]   pb-2 pt-1  px-4 md:px-8   rounded-xl`}>
                        <option value="Status"> Status</option>
                        <option value="Category">Category</option>
                        <option value="Priority">Priority</option>
                      </select>
                     
                  </div>
                  <div className="flex flex-col mt-5 ml-2 px-4">
                      <div className='text-white'>
                            Sorted Questions by: Upvotes
                       </div>
                      <div className='text-white mt-4'>
                          Filter Questions by: Status
                      </div>
                  </div>
               
              </div>
              <div className="w-full bg-customOrange p-6 min-h-[50vh] rounded-r-xl"> 
                  <div className="rounded-xl bg-white px-5 py-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                      <div className="text-center md:text-left wrapper mb-3 md:mb-0">
                          <small>Tech/Framework</small> 
                          <h1 className='text-xl font-bold'>Question Title</h1>
                          <div className="flex gap-x-2 mt-2">
                            <small className="bg-customRed rounded-xl px-3 text-white">
                                Not Solved
                            </small>
                            <small className="bg-customRed rounded-xl px-3 text-white">
                                Urgent
                            </small>
                          </div>
                      </div>
                      <p className='flex l px-3 py-5 border border-black rounded-xl'>
                         60 Votes
                      </p>
                    </div>
                  </div>
              </div>
          </div>
      </div>
    
  )
}

export default questions