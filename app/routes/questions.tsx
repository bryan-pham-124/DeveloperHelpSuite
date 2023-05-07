import {useState, useEffect} from 'react'
import { json} from "@remix-run/node"; // or cloudflare/deno
import { getUser, getUserSession } from '~/utils/auth.server';
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
import { linkCardDataProps } from '~/utils/types.server';
import SortButtons from '~/components/SortButtons';
 
 

export async function loader({ request }: LoaderArgs) {

  const userData = await getUser(request);

  const questions = await getQuestions();

  const session = await getUserSession(request);

  const successMessage = session.get("Success Message") || null;

  if(!userData){
     return await json({'userData':null, 'questions': questions, 'message': null});
  }

  return await json({'userData': userData, 'questions': questions, 'message': null} );

}


 
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






const questions = () => {
  
  const {userData, questions, message} = useLoaderData<typeof loader>();


  const linkCardData: linkCardDataProps[] = questions;
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [activeSortLabel, setActiveSortLabel] = useState('Select Sort');
  const [modifiedCardData, setModifiedCardData] = useState(linkCardData)
  const [sortType, setSortType] = useState('Descending');

  const sortCardParams = {
      sortMethod:'Ascending',
      activeSortLabel: activeSortLabel,
      modifiedCardData: modifiedCardData,  
      linkCardData:linkCardData,
      setSortType: setSortType,
      setModifiedCardData: setModifiedCardData
  }


  
  const defaultSorts = ['Select Sort','Votes', 'Priority'];

  const getAllCategories =  () => {
      const copy = [...questions];

      let catArr: string[] = [];
    
      copy.forEach(elm => catArr.push(elm.category));
    
      return catArr;
  }


  const filterOptions = [
    {
      field: 'Status',
      options: ['', 'Solved', 'Not Solved'], 
    },
    {
      field: 'Category',
      options: getAllCategories(), 
    },
    {
      field: 'Priority',
      options: ['', 'Low', 'Medium', 'Urgent'], 
    },
 ]


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
            message && <h1 className='text-black'> {message} </h1>
          }

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
                            

                            {
                                questions && <DropDown options={ defaultSorts} updateSort={updateSort}  defaultValue={'Ascending'}   label={activeSortLabel} /> 
                            }

                            <div className="wrapper flex flex-col my-3">
                                <SortButtons type ='customOrange'   text={'Descending'} onClick ={() => sortCards('Descending')}  />
                                <SortButtons type ='skyBlue'   text={'Ascending'} onClick ={() => sortCards('Ascending')}  />
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