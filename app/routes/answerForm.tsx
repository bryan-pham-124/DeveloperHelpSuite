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


// this form create a new reply if user submits all required information

interface AnswerFormProps {
  cardId: string
  setIsFormDisplayed: Function
  setIsReplySubmitted: Function
}
 
const AnswerForm = ( {cardId, setIsFormDisplayed, setIsReplySubmitted}: AnswerFormProps) => {

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

 
 const [formFields, setFormFields] = useState(defaultFormFields);

 const singleLineFields = ['title', 'category', 'link'];

 const actionButtons =  [
    {param: 'Code', color: 'bg-customOrange'},
    {param: 'Text', color: 'bg-sky-500'},
    {param: 'Link', color: 'bg-customRed'},
 ]


// two methods below are for adding additional fields to form if additional info is neededed

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
      setAllFieldsValid(validateAllFormFields(formFields))
  }, [formValues])
  

  return (

    <div className="wrapper w-full flex flex-col items-center py-5 rounded-xl">

          
        {
            serverFormErrors !== ''

            ?

              <ErrorBox text= {serverFormErrors + ''}/>  

            :

            ''
        }

        <h1 className='font-bold text-3xl text-center'>{  'Answer Question' }</h1>
        <Form method='POST' 
              action={`/questionForm?cardId=${cardId}&reply=true`}  
              onSubmit={() => { setIsFormDisplayed(false); setIsReplySubmitted(true);}}  
              className='my-[20px] w-[300px]  md:w-[400px] bg-customBlack px-8 py-7 rounded-lg'
        >

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
                    isCodeField = {field.label.split(' ')[0].toLowerCase() === 'code'}

                />
                
              ))
            }

            <div className="wrapper flex my-4 gap-x-3">

              {

                // action butons are for adding code, text or links to a reply
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

            <div className="w-full text-center " >
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

export default AnswerForm;