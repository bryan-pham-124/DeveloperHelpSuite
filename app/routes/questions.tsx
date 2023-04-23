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
import DropDown from '~/components/DropDown';
import LinkCard from '~/components/LinkCard';
 

export async function loader({ request }: LoaderArgs) {

  const userData = await getUser(request);
  
  if(!userData){
  return await json({'userData':null});
  }

  return await json({'userData': userData});

}

interface linkCardDataProps  {
    [key: string]: any
}

const linkCardData: linkCardDataProps[] = [
    {   
       id: 1121,
       date: '2/1/2023',
       category: 'Test Category',
       title: 'Test Title',
       status: "Not Solved",
       priority: 'Urgent',
       votes: 60
    },
    {
      id: 11211,
      date: '4/12/2121',
      category: 'Test Category',
      title: 'Test Title',
      status: "Not Solved",
      priority: 'Urgent',
      votes: 160
   },
   {
    id: 1121212,
    date: '1/10/2023',
    category: 'Test Category',
    title: 'Test Title',
    status: "Not Solved",
    priority: 'Urgent',
    votes: 601
   },
   {
    id: 11212121,
    date: '5/12/2023',
    category: 'Test Category',
    title: 'Test Title',
    status: "Not Solved",
    priority: 'Urgent',
    votes: 6021
  },
  { 
    id: 11213212,
    date: '12/12/2023',
    category: 'Test Category',
    title: 'Test Title',
    status: "Not Solved",
    priority: 'Urgent',
    votes: 60
  },
  {
    id: 1121212312323,
    date: '12/12/2024',
    category: 'Test Category',
    title: 'Test Title',
    status: "Not Solved",
    priority: 'Urgent',
    votes: 60
  },
  
]

const sortOptions = [
    {
      field: 'Votes',
      sortType: 'Ascending'
    },

    {
      field: 'Priority',
      sortType: 'Ascending'
    },
]

const filterOptions = [
    {
      field: 'Status',
      options: ['', 'Solved', 'Not Solved'], 
    },
    {
      field: 'Category',
      options: ['', 'JavaScript', 'Typescript', 'React'], 
    },
    {
      field: 'Priority',
      options: ['', 'Low', 'Medium', 'Urgent'], 
    },
]


const questions = () => {
  
  const {userData} = useLoaderData<typeof loader>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [activeSortOptions, setActiveSortOptions] = useState(['','Votes', 'Priority']);
  const [activeSortLabel, setActiveSortLabel] = useState('Select Sort');
  const [activeSortValue, setActiveSortValue] = useState(activeSortOptions[0]);


  const [sortedCardData, setSortedCardData] = useState(linkCardData)


  const resetSort = (e: any) =>  {
      e.preventDefault();
      setActiveSortOptions(['', 'Upvotes', 'Priority']);
      setActiveSortLabel('Select Sort');
  }

  const updateSort = (currentValue: string) => {


      console.log(currentValue);

      if(currentValue !== '' ){
         setActiveSortOptions(['Ascending', 'Descending']);
         setActiveSortValue('Descending')
      }  

      if(sortOptions.find(elm => elm.field === currentValue)){
         setActiveSortLabel(currentValue)
         
      }  else if(currentValue === ''){
         setActiveSortValue('Ascending')
      } else {
         setActiveSortValue(currentValue)
      }

      console.log(activeSortValue)
      

  }



  useEffect(() => {
     
   
    let sortValue = activeSortLabel.toLowerCase();
    
    //console.log('SV IS: ' + sortValue)

    if(activeSortValue === 'Ascending' && sortValue !== ''){
         linkCardData.sort((elm, elm2 )=> elm[sortValue] - elm2[sortValue]  )
    } else if(activeSortValue === 'Descending' && sortValue !== '') {
         linkCardData.sort((elm, elm2 )=> elm2[sortValue] - elm[sortValue]  )
    }
    setSortedCardData(linkCardData)
    

  }, [activeSortValue])

  useEffect(() => {
     setQuestionCount(linkCardData.length)
  }, [linkCardData])

  useEffect(() => {
      setIsLoggedIn(userData ? true: false)
  }, [userData])

  return (
  
      <div className="wrapper my-[50px] px-10">
    
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

          <div className="grid grid-cols-1 grid-cols-2 w-full ">
              <div className="w-full bg-customBlack p-6  h-[600px] rounded-l-xl"> 
                  <div className='flex flex-col md:flex-row w-full justify-between  items-center border-b pb-3 px-4  border-white'>
                      <h1 className='py-4 px-3 text-3xl text-white'>Total Questions</h1>
                      <p className='bg-white px-5 py-1 text-customBlack rounded-xl text-md'> {questionCount}</p>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2  w-full justify-between gap-x-7 mt-[40px] px-6'>

                        <div className="wrapper my-3 md:my-0">
                            <h1 className='text-white text-2xl'>Sort</h1>
                            <DropDown options={activeSortOptions} updateSort={updateSort} label={activeSortLabel} />
                            <button className='bg-sky-500 rounded-xl px-3 py-1 text-white mt-5' onClick={e => resetSort(e)}>
                                Reset Sort
                            </button>
                        </div>

                        <div className="wrapper my-3 md:my-0">
                            <h1 className='text-white text-2xl'>Filter</h1>
                            {
                              filterOptions.map(elm => (
                                 <DropDown options={elm.options} updateSort={updateSort} label={elm.field} />
                              ))
                            }
                        </div>
                  </div>
                  <div className="flex flex-col mt-[30px] ml-2 px-4">
                      <div className='text-white  my-4'>
                            Sorted Questions by: { activeSortLabel !== 'Select Sort' ? activeSortLabel + ' ' + activeSortValue: ''}
                       </div>
                      <div className='text-white'>
                          Filter Questions by: Status
                      </div>
                  </div>
               
              </div>
              <div className="w-full bg-customOrange p-6 h-[600px] rounded-r-xl overflow-y-scroll"> 
                  {
                     sortedCardData.map((card, i )=> (
                          <LinkCard
                              key = {i}
                              category={card.category}
                              priority= {card.priority} 
                              status={card.status} 
                              title= {card.title}
                              votes = {card.votes}
                          />
                      ))
                  }
              </div>
          </div>
      </div>
    
  )
}

export default questions