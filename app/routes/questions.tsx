import {useState, useEffect} from 'react'
import { json} from "@remix-run/node"; // or cloudflare/deno
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
import { getQuestions } from '~/utils/questionForm';
 
 

export async function loader({ request }: LoaderArgs) {

  const userData = await getUser(request);

  const questions = await getQuestions();

  await console.log(questions);
  if(!userData){
  return await json({'userData':null, 'questions': questions});
  }



  return await json({'userData': userData, 'questions': questions} );



}

interface linkCardDataProps  {
    [key: string]: any
}

// priority 3 to 1 
// urgent to minor



/*
const linkCardData: linkCardDataProps[] = [
    {   
       id: 1121,
       date: '2/1/2023',
       category: 'React',
       title: 'Test Title',
       status: "Solved",
       priority: 3,
       votes: 60
    },
    {
      id: 11211,
      date: '4/12/2121',
      category: 'JavaScript',
      title: 'Test Title',
      status: "Not Solved",
      priority: 2,
      votes: 160
   },
   {
    id: 1121212,
    date: '1/10/2023',
    category: 'TypeScript',
    title: 'Test Title',
    status: "Not Solved",
    priority: 1,
    votes: 31
   },
   {
    id: 1121212,
    date: '1/10/2023',
    category: 'TypeScript',
    title: 'Test Title',
    status: "Solved",
    priority: 3,
    votes: 601
   },
   {
    id: 11212121,
    date: '5/12/2023',
    category: 'React',
    title: 'Test Title',
    status: "Not Solved",
    priority: 2,
    votes: 0-6021
  },
  { 
    id: 11213212,
    date: '12/12/2023',
    category: 'JavaScript',
    title: 'Test Title',
    status: "Solved",
    priority: 1,
    votes: 6021
  },
  {
    id: 1121212312323,
    date: '12/12/2024',
    category: 'JavaScript',
    title: 'Test Title',
    status: "Not Solved",
    priority: 2,
    votes: -10
  },
  
]

*/

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
      options: ['', 'JavaScript', 'TypeScript', 'React'], 
    },
    {
      field: 'Priority',
      options: ['', 'Low', 'Medium', 'Urgent'], 
    },
]


const questions = () => {
  
  const {userData, questions} = useLoaderData<typeof loader>();


  const linkCardData: linkCardDataProps[] = questions;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [activeSortLabel, setActiveSortLabel] = useState('Select Sort');
  const [modifiedCardData, setModifiedCardData] = useState(linkCardData)
  const [sortType, setSortType] = useState('Descending');


  const [activeFilterLabels, setActiveFilterLabels] = useState(
      [
        {field: 'Status', isActive: false, value: ''},
        {field: 'Category', isActive: false, value: ''},
        {field: 'Priority', isActive: false, value: ''}
      ]
  )

  const updateSort = (currentValue: string) => {
      setActiveSortLabel(currentValue);   
  }

  const updateFilters = (currentValue: string , label: string) => {

      let copyArr = [...activeFilterLabels];
      const index = copyArr.findIndex(elm => elm.field === label);
      let prevFilters = copyArr.filter(elm => elm.isActive && elm.field !== label);

      //console.log(label);

      if(label === 'Priority') {
          currentValue =  currentValue === 'Urgent' ? '3' :  currentValue === 'Medium' ? '2' : currentValue === 'Low' ? '1' : '';
      }

      if(index !== -1){

        label = label.toLowerCase();
        let filteredData: any[] =  linkCardData;
        
      
        //check if user applied 
        if(prevFilters.length !== 0 ){
          prevFilters.forEach(elm =>{
            filteredData = filteredData.filter((elmI) => elmI[elm.field.toLowerCase()] == elm.value);
          })
        }

        let activeFilters = copyArr.filter(elm => elm.isActive);

        //apply newest filter
        if(currentValue !== ''){
            filteredData = filteredData.filter((elm) => elm[label]  == currentValue);
        }  

        //clear filters if no dropdowns are selected
        else {
           if(activeFilters.length === 0 || activeFilters[0].value === ''  ){
               filteredData = linkCardData;
           }
        }
      
        copyArr[index].isActive = (currentValue !== '');
        copyArr[index].value = currentValue;

 
        setModifiedCardData(filteredData);
        setActiveFilterLabels(copyArr);
       }

  }
  

  const sortCards = (sortMethod: string) => {

      let sortValue = activeSortLabel.toLowerCase();

      //let copy = ([] as any[]).concat(linkCardData);

      let copy = ([] as any[]).concat(modifiedCardData);

      if(sortValue !== 'Select Sort'){

        if(sortMethod === 'Ascending' ){
        
          copy.sort((elm, elm2 )=> elm[sortValue] - elm2[sortValue]  );
          setSortType('Ascending');
                      
        } else if(sortMethod === 'Descending') {

          copy.sort((elm, elm2 )=> elm2[sortValue] - elm[sortValue]  );
          setSortType('Descending');
        } 
      }
    
      console.log(linkCardData);
      setModifiedCardData(copy);
     
  }
 

  useEffect(() => {
    linkCardData.sort((elm, elm2 )=> elm2['votes'] - elm['votes']  )
    setModifiedCardData(linkCardData)
  },  [])

  useEffect(() => {
     setQuestionCount(linkCardData.length)
  }, [linkCardData])

  useEffect(() => {
    setQuestionCount(modifiedCardData.length)
  }, [modifiedCardData])

  useEffect(() => {
      setIsLoggedIn(userData ? true: false)
  }, [userData])

 
  return (
  
      <div className="wrapper my-[50px] px-10  w-full grid justify-center">
    
          <div className="flex w-full justify-between mb-[50px]">
            <h1 className='text-4xl font-bold'>Questions</h1>
  
             
            <GenericButton text ="Ask A Question"  
                //onClick={() => setIsModalOpen(prevData => !prevData)} 
                to='/questionForm'
                buttonType='skyBlue'  
                className={(!isLoggedIn) ? `mt-4 pointer-events-none opacity-20`: 'mt-4' } 
             />
          </div>

          {
            !isLoggedIn 
            
            &&
            
            <div className="flex justify-center">
                <ErrorBox text={"You must be logged in to interact with posts"} />
            </div>
          }

          <div className="grid grid-cols-1 md:grid-cols-2 w-full  max-w-[1000px]  ">
              <div className="w-full bg-customBlack p-6  h-[600px] rounded-l-xl"> 
                  <div className='flex flex-col md:flex-row w-full justify-between  items-center border-b pb-3 px-4  border-white'>
                      <h1 className='py-4 px-3 text-3xl text-white'> Questions</h1>
                      <p className='bg-white px-5 py-1 text-customBlack rounded-xl text-md'> {questionCount}</p>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2  w-full justify-between gap-x-7 mt-[40px] px-6'>
                        <div className="wrapper my-3 md:my-0">
                            <h1 className='text-white text-2xl'>Sort</h1>
                            
                            <DropDown options={['Select Sort','Votes', 'Priority']} updateSort={updateSort}  defaultValue={'Ascending'}   label={activeSortLabel} />
                            <div className="wrapper flex flex-col">
                              <button  className='bg-sky-500 rounded-xl py-2 px-2 my-3 w-full text-white max-w-[200px]' onClick={() => sortCards('Ascending')}>Ascending</button>
                              <button  className='bg-customOrange rounded-xl py-2 px-2 w-full text-white max-w-[200px]'  onClick={() => sortCards('Descending')}>Descending</button>
                            </div>
                           
                        </div>

                        <div className="wrapper my-3 md:my-0">
                            <h1 className='text-white text-2xl'>Filter</h1>
                            {
                              filterOptions.map(elm => (
                                 <DropDown updateFilters  = {updateFilters} options={elm.options} label={elm.field} />
                              ))
                            }
                        </div>
                  </div>
                  <div className="flex flex-col mt-[30px] ml-2 px-4">
                      <div className='text-white  my-4 text-md'>
                            Sorted Questions by: { activeSortLabel !== 'Select Sort' ? activeSortLabel + ' ' + sortType: ''}
                       </div>
                  </div>
               
              </div>
              <div className=" bg-customOrange p-6 h-[600px] rounded-r-xl overflow-y-scroll md:w-[340px] lg:w-full"> 

                  {
                    (!modifiedCardData)
                    
                    &&

                    <h1 className='font-bold mt-10 '>
                        Be first to ask a question!  
                    </h1>
                  }

                  {
                    (modifiedCardData.length === 0 && modifiedCardData)
                    
                    &&

                    <h1 className='font-bold mt-10 '>
                        Looks like there are no entries that match your filters.  
                    </h1>
                  }

                  {
                    
                     modifiedCardData.map((card, i )=> (
                          <LinkCard
                              key = {i}
                              category={card.category}
                              priority= {card.priority === 3 ?  'Urgent' : card.priority === 2 ? 'Medium' :  card.priority === 1 ?  'Low'   : '' } 
                              status={card.status} 
                              title= {card.title}
                              votes = {card.upvotes - card.downvotes }
                          />
                      ))
                  }
              </div>
          </div>
      </div>
    
  )
}

export default questions