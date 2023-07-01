import {useState, useEffect} from 'react'
import { json} from "@remix-run/node"; // or cloudflare/deno
import { getUser, getUserSession } from '~/utils/auth.server';
import { useLoaderData, useNavigation } from '@remix-run/react';
import type { LoaderArgs } from "@remix-run/node";
import ErrorBox from '~/components/ErrorBox';
import GenericButton from '~/components/GenericButton';
import DropDown from '~/components/DropDown';
import LinkCard from '~/components/LinkCard';
import { getQuestions } from '~/utils/questionForm.server';
import { linkCardDataProps } from '~/utils/types.server';
import SortButtons from '~/components/SortButtons';
import SuccessBox from '~/components/SuccessBox';
import { clearMessage } from '~/utils/messages.server';
 

//this page displays all the questions and also has a menu where users can filter and sort cards

export async function loader({ request }: LoaderArgs) {

  const userData = await getUser(request);

  const questions = await getQuestions();

  const session = await getUserSession(request);

  const message = session.get("message") || null;

  if(!userData){
     return await json({'userData':null, 'questions': questions, 'message': null});
  }

  return await json({
      'userData': userData, 
      'questions': questions,
      'message': message} ,
      { headers: await clearMessage(session)} 
  );

}

 
const questions = () => {
  
  const {userData, questions, message} = useLoaderData<typeof loader>();


  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  //console.log(questions);

  const linkCardData = questions;
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [activeSortLabel, setActiveSortLabel] = useState('Select Sort');
  const [modifiedCardData, setModifiedCardData] = useState(linkCardData)
  const [sortType, setSortType] = useState('Descending');

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
      options:['', ...getAllCategories()], 
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



  // handles all the filtering in the program
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

// handles all the logic of sorting cards
const sortCards = (sortMethod: string) => {

    let sortValue = activeSortLabel.toLowerCase();

    //let copy = ([] as any[]).concat(linkCardData);

    let copy = ([] as any[]).concat(modifiedCardData);


    if(sortValue !== 'Select Sort'){    

      //logic for sorting cards for all fields besides votes
      if(sortValue !== 'votes'){

        if(sortMethod === 'Ascending' ){

          copy.sort((elm, elm2 )=> elm[sortValue] - elm2[sortValue]  );
          setSortType('Ascending');
                    
        } else if(sortMethod === 'Descending') {
  
          copy.sort((elm, elm2 )=> elm2[sortValue] - elm[sortValue]  );
          setSortType('Descending');

        } 
        
      } else {

        // sort method for sorting votes

        if(sortMethod === 'Ascending' ){
      
          copy.sort((elm, elm2 )=> (elm['upvotes'] - elm['downvotes']) -  (elm2['upvotes'] - elm2['downvotes']));
          setSortType('Ascending');
                      
        } else if(sortMethod === 'Descending') {
  
          copy.sort((elm, elm2 )=> (elm2['upvotes'] - elm2['downvotes'])  - (elm['upvotes'] - elm['downvotes']));
          setSortType('Descending');
        } 

      }
      
    }
  
    // console.log(linkCardData);
    setModifiedCardData(copy);
   
 } 


 // useEffects keep track of active filters and labels 

  useEffect(() => {
    
    if(linkCardData){
      linkCardData.sort((elm, elm2 ) =>  {

          if(elm2['upvotes'] !== null && elm2['downvotes'] !== null && elm['upvotes'] && elm['downvotes'] ){
             return  (elm2['upvotes'] - elm2['downvotes']) - (elm['upvotes'] - elm['downvotes'])
          }

          return 0;
      
        });

    }

    setModifiedCardData(linkCardData);

  },  []);


  useEffect(() => { sortCards('Descending') },  [activeSortLabel]);

  useEffect(() => { sortCards('Descending') },  [activeFilterLabels]);

  useEffect(() => { setQuestionCount(linkCardData.length)}, [linkCardData]);

  useEffect(() => { setQuestionCount(modifiedCardData.length) }, [modifiedCardData]);

  useEffect(() => { setIsLoggedIn(userData ? true: false)}, [userData]);

 
  return (
  
      <div className="wrapper my-[50px] px-6 md:px-10  w-full grid justify-center">
    
          <div className="flex flex-col md:flex-row w-full   justify-between mb-[50px]">

            <h1 className='text-4xl font-bold text-center md:text-left'>Questions</h1>

            <GenericButton text ="Ask A Question"  
                to='/questionForm'
                buttonType='skyBlue'  
                className={(!isLoggedIn) ? `mt-4 pointer-events-none opacity-20`: 'mt-4' } 
             />

          </div>

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
            !isLoggedIn 
            
            &&
            
            <div className="flex justify-center">
                <ErrorBox text={"You must be logged in to interact with posts"} />
            </div>
          }

          <div className="grid grid-cols-1 md:grid-cols-2 w-full  max-w-[1000px]">

              <div className="w-full bg-customBlack p-6  md:h-[700px] rounded-xl md:rounded-l-xl md:rounded-r-none mb-[50px]"> 
                  <div className='flex flex-col md:flex-row w-full justify-between  items-center border-b pb-5 px-4  border-white'>
                      <h1 className='py-4 px-3 text-3xl text-white'> Questions</h1>
                      <p className='bg-white px-5 py-1 text-customBlack rounded-xl text-md'> {questionCount}</p>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2  w-full justify-between gap-x-7 mt-[40px] px-1 md:px-6'>
                        <div className="wrapper my-3 md:my-0">
                            <h1 className='text-white text-2xl'>Sort</h1>
                            
                            <DropDown options={ defaultSorts} updateSort={updateSort}  defaultValue={'Ascending'}   label={activeSortLabel} /> 
                        
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
                  <div className="flex flex-col mt-[30px] ml-2 text-center   my-4px-4">
                      <p className='text-white text-md'>
                            Sorted Questions by:
                       </p>
                       <p className='text-white text-md'>
                           { activeSortLabel !== 'Select Sort' ? activeSortLabel + ' ' + sortType: ''}
                       </p>
                  </div>
               
              </div>
              <div className="bg-customOrange p-6 rounded-xl overflow-y-scroll border border-customBlack md:rounded-r-xl md:rounded-l-none md:w-[340px] lg:w-full h-[700px] "> 

                  {
                    (!modifiedCardData) && <h1 className='font-bold mt-10 '> Be first to ask a question!  </h1>
                  }

                  {
                    (modifiedCardData.length === 0 && modifiedCardData) && <h1 className='font-bold mt-10 '> Looks like there are no entries that match your filters.</h1>
                  }

                  {

                    modifiedCardData &&
                    
                      modifiedCardData.map((card, i )=> (
                          
                             <LinkCard
                                id = {card.id }
                                key = {i}
                                category={card.category}
                                priority= {card.priority === 3 ?  'Urgent' : card.priority === 2 ? 'Medium' :  card.priority === 1 ?  'Low'   : '' } 
                                status={card.status} 
                                title= {card.title}
                                upvotes = {card.upvotes ? card.upvotes : 0 }
                                downvotes = {card.downvotes ? card.downvotes : 0 }
                            /> 
                         
                      ))
                  }
              </div>
          </div>
      </div>
    
  )
}

export default questions