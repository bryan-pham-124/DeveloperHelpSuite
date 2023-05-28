import { Form, useActionData, useLoaderData, useNavigation } from '@remix-run/react'
import React, { useEffect, useState } from 'react'
import FormField from '~/components/FormField';
import { ActionArgs, LoaderArgs, redirect } from "@remix-run/node"; // or cloudflare/deno
import GenericButton from '~/components/GenericButton';
import { ActionFunction, LoaderFunction, json } from '@remix-run/node'
import { validateAllFormFields } from '~/utils/validateForms';
import { createQuestion, createReply } from '~/utils/questionForm.server';
import DropDown from '~/components/DropDown';
import { questionData, questionDataEntry } from '~/utils/types.server';
import { getUser } from '~/utils/auth.server';
import ErrorBox from '~/components/ErrorBox';
import { getUserSession } from '~/utils/auth.server';
import { clearMessage, flashMessage} from '~/utils/messages.server';
import SuccessBox from '~/components/SuccessBox';
const uuid = require('uuid');



export async function loader({ request }: LoaderArgs) {
    
   const userData = await getUser(request);


   // Retrieves the current session from the incoming request's Cookie header
   const session = await getUserSession(request);

   // Retrieve the session value set in the previous request
   const message = session.get("message") || null;

   const url = new URL(request.url)

   const isReply= url.searchParams.get('reply');

   console.log('Reply value is: ' + isReply)


   if(!userData){
      return redirect('/login?error=User_Not_Logged_In');
   }

   return await 
      json({
        userData: userData, 
        message: message, 
        isReply: isReply
      },
      {headers: await clearMessage(session)}
   );    
};

// submit all data from form to server and check if the request was successfully furfi;;ed
export const action: ActionFunction = async ({ request }) => {


  const url = new URL(request.url)

  const cardId = url.searchParams.get('cardId');

  const isReply= url.searchParams.get('reply');

  console.log('Reply value is: ' + isReply)

  const userData = await getUser(request);

  if(!userData){
      return redirect('/login?error=User_Not_Logged_In');
  }

  const form = await request.formData()

  const session = await getUserSession(request);
  
  console.log([...form]);

  let baseFields = ['title', 'description'];


  if(!isReply){
      baseFields.push('priority');
      baseFields.push('category');

  }


  //default data is fields every reply and question (ex: title, description)
  //content data is all other content

  let defaultData = [...form].filter(elm => baseFields.findIndex(i => i === elm[0]) !== -1  );
  let formattedDefault: Array<questionDataEntry> = [];
  defaultData.map((elm, index) => formattedDefault.push({type: elm[0], order: index , content: elm[1] + ''}));

  let contentData = [...form].filter(elm => baseFields.findIndex(i => i === elm[0]) === -1 );
  let formattedContent: Array<questionDataEntry> = [];
  contentData.map((elm, index) => formattedContent.push({type: elm[0], order: index , content: elm[1] + ''}));

  let result = null
  
  if(!isReply){

     result = await createQuestion(formattedDefault, formattedContent, userData.id);

  } else {
    
      if(!cardId){

        return flashMessage(request, 'Question could not be created. Please try again ', `/questionCard?cardId=${cardId}`, false);

      }
      
     result = await createReply(formattedDefault, formattedContent, userData.id, cardId);

  }
 

  if(result && result.status === 200){
    
    console.log(result.status);

    if(!isReply){ 

      return flashMessage(request, 'Successfully created question with title: ' + formattedDefault[0].content, '/questions', true);

    } else {

      return flashMessage(request, 'Successfully created reply with title: ' + formattedDefault[0].content, `/questionCard?cardId=${cardId}`, true);

    }
    
  } else {


    const redirectTo = isReply ? `/questionCard?cardId=${cardId}` : '/questionForm';

    return flashMessage(request, 'Question could not be created. Please try again ', redirectTo, false);

  }

 
}


interface QuestionFormProps {
  isReply?: boolean
}

const QuestionForm = ({isReply}: QuestionFormProps) => {

  const formErrors = useActionData<typeof action>();
  const {message } = useLoaderData<typeof loader>();

  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  const [formValues, setFormValues] = useState(({
      title: '',
      description: ''
  }) );

  const [serverFormErrors, setServerFormErrors] = useState('');
  const [allFieldsValid, setAllFieldsValid] = useState(false);


  const baseBtnStyles = 'rounded-xl py-2 px-2 w-full text-white max-w-[200px] transition	 hover:bg-white hover:text-black';

  let defaultFormFields = [
    {
      field: 'title',
      label: "title",
      value: '',
      error: ''
    },
    {
      field: 'description',
      label: "description",
      value: '',
      error: ''
    },
  ]

if(!isReply){
  defaultFormFields.push({
      field: 'category',
      label: "category",
      value: '',
      error: ''
  })
}

 const [formFields, setFormFields] = useState(defaultFormFields);

 const singleLineFields = ['title', 'category', 'link'];

 const actionButtons =  [
    {param: 'Code', color: 'bg-customOrange'},
    {param: 'Text', color: 'bg-sky-500'},
    {param: 'Link', color: 'bg-customRed'},
 ]



  useEffect(() => {
    if(formErrors){
        setServerFormErrors((formErrors.error))
    }
  }, [formErrors])


  const addFormField = async (field: string) => {

      field = field.toLowerCase();
 
      const fieldNumber = uuid.v4();

      // need a unique field number to make each form element have a different name value
      // need unique name values for each form field so that it field will save to its own entry in database

      setFormValues({...formValues, [field + ' ' +  fieldNumber]: ''});

      setFormFields([...formFields,  
          {
            field: field + ' ' +   fieldNumber,
            label:  field,
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

        <h1 className='font-bold text-3xl text-center'>{!isReply ? 'Ask a Question' : 'Answer Question' }</h1>
        <Form method='POST' className='my-[20px] w-[300px]  md:w-[400px] bg-customBlack px-8 py-7 rounded-lg'>

            {
              formFields.map((field, i )=> (

                <FormField 
                    key = {i}
                    formType = {'login'}
                    htmlFor =   {field.field}
                    label   =   {field.label}
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
              !isReply 

              &&

              <div className="flex flex-col items-center my-5">
                  <DropDown name="priority" options={["1","2","3"]}  defaultValue={'Ascending'}   label={'Priority (3 Urgent, 1 Low)'} width={'400px'} />
              </div>
            }
           

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

export default QuestionForm;