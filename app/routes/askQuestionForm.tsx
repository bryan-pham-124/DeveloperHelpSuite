import { Form, useActionData, useNavigation } from '@remix-run/react'
import React, { useEffect, useState } from 'react'
import FormField from '~/components/FormField';
import type { ActionArgs } from "@remix-run/node"; // or cloudflare/deno
import GenericButton from '~/components/GenericButton';
import { ActionFunction, LoaderFunction, json } from '@remix-run/node'
import { validateAllFormFields } from '~/utils/validateForms';

 

export const action: ActionFunction = async ({ request }) => {

  const form = await request.formData()
  const email = form.get('email') + ''
  const password = form.get('password') + ''
  let name = form.get('firstName')
  
  return  null ;
}

const baseBtnStyles = 'rounded-xl py-2 px-2 w-full text-white max-w-[200px]';

const defaultFormFields = [
  {
    field: 'title',
    label: "Title",
    value: '',
    error: ''
  },
  {
    field: 'description',
    label: "Description",
    value: '',
    error: ''
  },
]


const actionButtons =  [
    {param: 'Code', color: 'bg-customOrange'},
    {param: 'Text', color: 'bg-sky-500'},
    {param: 'Link', color: 'bg-customRed'},
]

const askQuestionForm = () => {

  
  const formErrors = useActionData<typeof action>();
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  const [formValues, setFormValues] = useState(({
      title: '',
      description: ''
  }));



  const [formFields, setFormFields] = useState(defaultFormFields);

  const [serverFormErrors, setServerFormErrors] = useState('');
  const [redirectError, setRedirectError] = useState('');
  const [allFieldsValid, setAllFieldsValid] = useState(false);

  const addFormField = async (field: string) => {

      console.log( Object.keys(formValues))

      let countExistingFields =  Object.keys(formValues).filter(elm => elm.includes(field)).length;

      let fieldNumber = countExistingFields > 0 ? countExistingFields + 1: 1;

      setFormValues({...formValues, [field + ' ' +  fieldNumber]: ''});

      setFormFields([...formFields,  
          {
            field: field.toLowerCase() + ' ' +   fieldNumber,
            label:  field + ' ' +  fieldNumber,
            value: '',
            error: ''
          },
      ]) 

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

    <div className="wrapper   w-full flex flex-col items-center py-5 rounded-xl">
        <h1 className='font-bold text-3xl text-center'>Ask a Question</h1>
        <Form method='POST' className='my-[20px] w-[200px]  md:w-[400px] bg-customBlack px-8 py-7 rounded-lg'>

            {
              formFields.map((field, i )=> (

                <FormField 
                    key = {i}
                    formType = {'login'}
                    htmlFor =   { field.field }
                    label   =   { field.label }
                    formFields = {formFields}
                    setFormValues = {setFormValues}
                    multiline
                />
                
              ))
            }

            <div className="wrapper flex my-4 gap-x-3">

                {
                  actionButtons.map(btn => (
                    <button  onClick={(e) =>{  e.preventDefault(); addFormField(btn.param)}} className= {btn.color + ' ' +  baseBtnStyles}> Add {btn.param}</button>

                  ))
                }
               
            </div>

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

export default askQuestionForm