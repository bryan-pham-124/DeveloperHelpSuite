import { Form, useActionData } from '@remix-run/react'
import React, { useEffect } from 'react'
import {useState} from 'react';
import GenericButton from '~/components/GenericButton';
import FormField from '~/components/FormField';
import { ActionFunction } from '@remix-run/node'
import { checkMatchingPasswords, checkBlankFields } from '~/utils/validateForms';
import { json, redirect } from "@remix-run/node"; // or cloudflare/deno



export const action: ActionFunction = async ({ request }) => {
    const form = await request.formData()
    const email = form.get('email') + '';
    const password = form.get('password') + '';
    const password2 = form.get('password2') + '';
    const name = form.get('name') + '';


    //console.log([password, password2])

    let formFieldsArr = [
        {
          field: 'email',
          value: email || ''
        }, 
        {
          field: 'password',
          value: password || ''
        }, 
        {
          field: 'password3',
          value: password2 || ''
        }, 
        {
          field: 'name',
          value: name || ''
        }, 
    ]

    let errorMessages = []

    if(!checkMatchingPasswords(password, password2)){
        errorMessages.push('Both passwords must match')
    }

    checkBlankFields(formFieldsArr).map(error => errorMessages.push(error))
    
    return json(errorMessages, {status: 400});

}


const signUp = () => {


   const form_errors = useActionData<typeof action>();

   const [formValues, setFormValues] = useState(({
        email:'',
        password: '',
        password2: '',
        name: ''
   }));

   const [validForm, setValidForm] = useState(false);

   const [matchingPasswords, setMatchingPasswords] = useState(false);

   const formFields =  [
      {
        field: 'email',
        label: "Email",
        type:  'email',
        value: formValues.email,
        error: ''
       },

      {
        field: 'password',
        label: "Password",
        type:  'password',
        value: formValues.password,
        error: ''
      },
      {
        field: 'password2',
        label: "Reenter Password",
        type:  'password',
        value: formValues.password2,
        error: ''
      },

      {
        field: 'name',
        label: "Name",
        type:  'text',
        value: formValues.name,
        error: ''
      },

   ]

  return (
    <div className='w-full h-full flex justify-center items-center'>
    <div className="w-full wrapper flex flex-col items-center "> 
        <h1 className='mt-[25px] text-2xl text-center font-bold '> Welcome Back!</h1>


        <div className='my-4'>
          {
            form_errors
          }
        </div>
       
        <Form method='POST' className='my-[20px] w-[300px] bg-[#212121] px-8 py-7 rounded-lg' autoComplete='off'>

            {
              formFields.map((field, i )=> (
                <FormField 
                    key = {i}
                    formType='signUp'
                    setValidForm = {setValidForm}
                    htmlFor =   { field.field }
                    type    =   { field.type } 
                    label   =   { field.label }
                    value   =   { field.value }
                    formFields = {formFields}
                    setFormValues = {setFormValues}
                    matchingPasswords = {matchingPasswords}
                />
              ))
            }
 
            <div className="w-full text-center ">
                <GenericButton
                    formButton = {true}
                    buttonType='skyBlue'
                    text="Submit"
                    validForm = {validForm}
                    className={`mt-4` }
                />
            </div>
            {
              !validForm && !matchingPasswords

              ? 

                <small className='w-full mt-3 text-center text-[#fc8403]'> Please correct input your erors </small>

              :

                ''
            }

        </Form>
    </div>         
</div>
  )
}

export default signUp