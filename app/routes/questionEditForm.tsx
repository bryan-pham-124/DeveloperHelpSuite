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
import { getQuestionById } from '~/utils/questionCard.server';
 


export async function loader({ request }: LoaderArgs) {
    
   const userData = await getUser(request);


   // Retrieves the current session from the incoming request's Cookie header
   const session = await getUserSession(request);

   // Retrieve the session value set in the previous request
   const message = session.get("message") || null;

   const url = new URL(request.url)
   const id = url.searchParams.get('cardId');

   let questionData = null;

   if(id){
       questionData = await getQuestionById(id);
   }

   console.log(questionData);

   if(!userData){
      return redirect('/login?error=User_Not_Logged_In');
   }

   return await json({'userData': userData, message: message, questionData: questionData}, {headers: await clearMessage(session)});    
};


export const action: ActionFunction = async ({ request }) => {

  const userData = await getUser(request);

  if(!userData){
      return redirect('/login?error=User_Not_Logged_In');
  }

  const form = await request.formData()

  const session = await getUserSession(request);
  
  
  console.log([...form]);

  const baseFields = ['title', 'priority', 'description', 'category'];

  let defaultData = [...form].filter(elm => baseFields.findIndex(i => i === elm[0]) !== -1  );
  let formattedDefault: Array<questionDataEntry> = [];
  defaultData.map((elm, index) => formattedDefault.push({type: elm[0], order: index , content: elm[1] + ''}));

  let contentData = [...form].filter(elm => baseFields.findIndex(i => i === elm[0]) === -1 );
  let formattedContent: Array<questionDataEntry> = [];
  contentData.map((elm, index) => formattedContent.push({type: elm[0], order: index , content: elm[1] + ''}));

  const result = await createQuestion(formattedDefault, formattedContent, userData.id);
 
  if(result && result.status === 200){
    console.log(result.status)
    return flashMessage(request, 'Successfully created question with title: ' + formattedDefault[0].content, '/questions', true);
    
  } else {

    return flashMessage(request, 'Question could not be created. Please try again ', '/questionForm', false);

  }

 
}

const baseBtnStyles = 'rounded-xl py-2 px-2 w-full text-white max-w-[200px] transition	 hover:bg-white hover:text-black';

const defaultFormFields = [
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
  {
    field: 'category',
    label: "category",
    value: '',
    error: ''
  },
]

const singleLineFields = ['title', 'category', 'link'];

const actionButtons =  [
    {param: 'Code', color: 'bg-customOrange'},
    {param: 'Text', color: 'bg-sky-500'},
    {param: 'Link', color: 'bg-customRed'},
]

const QuestionEditForm = () => {

  const formErrors = useActionData<typeof action>();
  const {message} = useLoaderData<typeof loader>();

  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  const [formValues, setFormValues] = useState(({
      title: '',
      description: ''
  }) );

  const [formFields, setFormFields] = useState(defaultFormFields);
  const [serverFormErrors, setServerFormErrors] = useState('');
  const [allFieldsValid, setAllFieldsValid] = useState(false);

  useEffect(() => {
    if(formErrors){
        setServerFormErrors((formErrors.error))
    }
  }, [formErrors])


  const addFormField = async (field: string) => {

      field = field.toLowerCase();

      let countExistingFields = Object.keys(formValues).filter(elm => elm.includes( field)).length;

      let fieldNumber = countExistingFields > 0 ? countExistingFields + 1: 1;

      setFormValues({...formValues, [field + ' ' +  fieldNumber]: ''});

      setFormFields([...formFields,  
          {
            field: field + ' ' +   fieldNumber,
            label:  field + ' ' +  fieldNumber,
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

        <h1 className='font-bold text-3xl text-center'>Edit Question</h1>
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

            <div className="flex flex-col items-center my-5">
                <DropDown name="priority" options={["1","2","3"]}  defaultValue={'Ascending'}   label={'Priority (3 Urgent, 1 Low)'} width={'400px'} />
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