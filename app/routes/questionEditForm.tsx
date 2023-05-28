import { Form, useActionData, useLoaderData, useNavigation } from '@remix-run/react'
import React, { useEffect, useState } from 'react'
import FormField from '~/components/FormField';
import { ActionArgs, LoaderArgs, redirect } from "@remix-run/node"; // or cloudflare/deno
import GenericButton from '~/components/GenericButton';
import { ActionFunction, LoaderFunction, json } from '@remix-run/node'
import { validateAllFormFields } from '~/utils/validateForms';
import { createQuestion } from '~/utils/questionForm.server';
import DropDown from '~/components/DropDown';
import { questionData, questionDataEntry } from '~/utils/types.server';
import { getUser } from '~/utils/auth.server';
import ErrorBox from '~/components/ErrorBox';
import { getUserSession } from '~/utils/auth.server';
import { clearMessage, flashMessage} from '~/utils/messages.server';
import SuccessBox from '~/components/SuccessBox';
import { getQuestionById, getReplyById } from '~/utils/questionCard.server';
import { editQuestion, editReply } from '~/utils/questionEdit.server';
const uuid = require('uuid');



// this loader loads in previous question or reply data after determining if this component is to be a reply or a question
export async function loader({ request }: LoaderArgs) {
    
   const userData = await getUser(request);
 
   // Retrieves the current session from the incoming request's Cookie header
   const session = await getUserSession(request);

   // Retrieve the session value set in the previous request
   const message = session.get("message") || null;
 

   const url = new URL(request.url)

   const isReply= url.searchParams.get('isReply');

   const replyId = url.searchParams.get('replyId');

   const cardId = url.searchParams.get('cardId');

   let questionData = null;
   let replyData = null;

   if(cardId){
      if(!isReply){
        questionData = await getQuestionById(cardId);
      }
      else if(replyId) {
        replyData = await getReplyById(replyId);
        //console.log('reply data');
        //console.log(replyData)
      }
   } else {
       return flashMessage(request, 'Could not find question information. Please try again', 'questions', false)
   }

   //console.log(questionData);

   if(!userData){
      return redirect('/login?error=User_Not_Logged_In');
   }

   return await 
      json(
        {
           userData: userData, 
           message: message, 
           questionData: questionData, 
           replyData: replyData,
           isReply: isReply,
           cardId: cardId
        }
        ,
        {headers: await clearMessage(session)}
     );    
};


//send response to server once user submits response
export const action: ActionFunction = async ({ request }) => {

  const userData = await getUser(request);

  if(!userData){
      return redirect('/login?error=User_Not_Logged_In');
  }

  const form = await request.formData();

  const formAsArr = [...form];
 
  const url = new URL(request.url);

  const cardId = url.searchParams.get('cardId');

  const isReply= url.searchParams.get('isReply');

  const replyId = url.searchParams.get('replyId');

 
  if( !cardId || !userData){
    return flashMessage(request, 'Could not edit question', `/questionEditForm?cardId=${cardId}`, false);
  }


  let baseFields = ['title', 'description'];


  if(!isReply){
      baseFields.push('priority');
      baseFields.push('category');
  }

  //default data is fields every reply and question (ex: title, description)
  //content data is all other content

  let defaultData = formAsArr.filter(elm => baseFields.findIndex(i => i === elm[0]) !== -1  );
  let formattedDefault: Array<questionDataEntry> = [];
  defaultData.map((elm, index) => formattedDefault.push({type: elm[0], order: index , content: elm[1] + ''}));

  let contentData = formAsArr.filter(elm => baseFields.findIndex(i => i === elm[0]) === -1 && elm[0] !== 'cardId' );
  let formattedContent: Array<questionDataEntry> = [];
  contentData.map((elm, index) => formattedContent.push({type: elm[0], order: index , content: elm[1] + ''}));

  /*
  console.log('content below');
  console.log(formattedDefault);
  console.log(formattedContent);
  console.log('replyId:   ' + replyId)
  console.log('reply status is: ' + isReply);
  */
  
  let result = null
  
  if(!isReply){

     result = await editQuestion(formattedDefault, formattedContent, userData.id, cardId + '');

  } else {
    
    if(replyId){  
      result = await editReply(formattedDefault, formattedContent,   cardId + '', replyId+ '');
    }

  }


  if(result && result.status === 200){
    
    console.log(result.status)
    return flashMessage(request, 'Successfully edited question with title: ' + formattedDefault[0].content, `/questionCard?cardId=${cardId}`, true);
    
  } else {

    return flashMessage(request, 'Question could not be edited. Please try again ', '/questionForm', false);

  }
 

 
}

const baseBtnStyles = 'rounded-xl py-2 px-2 w-full text-white max-w-[200px] transition	 hover:bg-white hover:text-black';
 
const singleLineFields = ['title', 'category', 'link'];

const actionButtons =  [
    {param: 'Code', color: 'bg-customOrange'},
    {param: 'Text', color: 'bg-sky-500'},
    {param: 'Link', color: 'bg-customRed'},
]


// this form is used by users who want to edit question or replies
// it is similiar to the questionForm, but this form contains data that the user previously inputed and this form edits existing questions/replies

const QuestionEditForm = () => {

  const formErrors = useActionData<typeof action>();
  const {message, questionData,  replyData  ,isReply} = useLoaderData<typeof loader>();

  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  const [formValues, setFormValues] = useState(({
      title: '',
      description: ''
  }));

  
  let defaultFormFields = 
  
    !isReply

    ?
    
    [
      {
        field: 'title',
        label: "Title",
        value: questionData?.title || '',
        error: ''
      },
      {
        field: 'description',
        label: "Description",
        value: questionData?.description || '',
        error: ''
      },
      {
        field: 'category',
        label: "Category",
        value: questionData?.category || '',
        error: ''
      },
    ]

    :

    [
      {
        field: 'title',
        label: "Title",
        value: replyData?.title || '',
        error: ''
      },
      {
        field: 'description',
        label: "Description",
        value: replyData?.description || '',
        error: ''
      },
      
    ];





  // reformat loader data to match the format of defaultFormFields
  const reformatQuestionCardData = () => {

      const newFormFields: typeof defaultFormFields = [];

      if(questionData){
           
          questionData.questionContent.map(elm => (
            newFormFields.push( {
              field:  elm.type,
              label:   elm.type,
              value: elm.content,
              error: ''
            })
          ))
      }  
      
      else if(replyData) {

        replyData.replyContent.map(elm => (
          newFormFields.push( {
            field:  elm.type,
            label:   elm.type,
            value: elm.content,
            error: ''
          })
        ))

      }

      return newFormFields;

  }

  const otherFormFields = reformatQuestionCardData()

  const [formFields, setFormFields] = useState(defaultFormFields.concat(otherFormFields));
  const [serverFormErrors, setServerFormErrors] = useState('');
  const [allFieldsValid, setAllFieldsValid] = useState(false);


  useEffect(() => {
    if(formErrors){
        setServerFormErrors((formErrors.error))
    }
  }, [formErrors])
  


  const addFormField = async (field: string) => {

      field = field.toLowerCase();

      //let countExistingFields = Object.keys(formValues).filter(elm => elm.includes( field)).length;

      const fieldNumber = uuid.v4();

      setFormValues({...formValues, [field + ' ' +  fieldNumber]: ''});

      setFormFields([...formFields,  
          {
            field: field + ' ' +   fieldNumber,
            label:  field +'',
            value: '',
            error: ''
          },
      ]) 

  }


  const deleteFormField = (field: string) => {

    let filteredArray = formFields.filter(elm => elm.field !== field);

    interface formValuesProps {
      [key: string]: string
    }

    let copyFormValues: formValuesProps = formValues;
    delete copyFormValues[field as keyof typeof copyFormValues ];

    setFormFields(filteredArray);

  }


  useEffect(() => {
    if(formErrors){
        setServerFormErrors((formErrors.error))
    }
  }, [formErrors])


  useEffect(() => {
     
    setAllFieldsValid(validateAllFormFields(formFields))
       
  }, [formValues])
  

  return (

    <div className="wrapper w-full flex flex-col items-center py-5 rounded-xl">


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
            serverFormErrors !== ''

            ?

              <ErrorBox text= {serverFormErrors + ''}/>  

            :

            ''
        }

        <h1 className='font-bold text-3xl text-center'>{!isReply ? 'Edit Question': 'Edit Reply'}</h1>
        <Form method='POST' className='my-[20px] w-[300px]  md:w-[400px] bg-customBlack px-8 py-7 rounded-lg'>

            {
              formFields.map((field, i )=> (

                <FormField 
                    key = {i}
                    formType = {'login'}
                    htmlFor =   {field.field}
                    label   =   {field.label.split(' ')[0]}
                    formFields = {formFields}
                    value =     {field.value}
                    setFormValues = {setFormValues}
                    multiline = {singleLineFields.findIndex(elm => elm === field.label.split(' ')[0].toLowerCase()) === -1}
                    dynamicForm
                    deletable = {defaultFormFields.findIndex(elm => elm.label === field.label) === -1}
                    deleteFormField = {deleteFormField}
                />
                
              ))
            }

            <div className="wrapper flex my-4 gap-x-3">

                {
                  actionButtons.map(btn => (
                    <button 
                        onClick={(e) =>{  e.preventDefault(); addFormField(btn.param)}}
                        className= {btn.color + ' ' +  baseBtnStyles}
                      > 
                        Add {btn.param}
                   </button>
                  ))
                }
               
            </div>


            {
              !allFieldsValid && <small className='text-center text-customOrange text-xs mb-3 block'>  No fields can be blank. </small>
            }

            <div className="w-full text-center ">
                <GenericButton
                    formButton = {true}
                    buttonType='skyBlue'
                    text="Submit"
                    className={(isSubmitting || !allFieldsValid )? `mt-4 pointer-events-none opacity-20`: 'mt-4' }
                />
            </div>
            
        </Form>
    </div>
    
               
  )
}

export default QuestionEditForm;