import { Form } from '@remix-run/react'
import React from 'react'
import {useState} from 'react';
import GenericButton from '~/components/GenericButton';
import FormField from '~/components/FormField';
import {validateAllFormFields } from '~/utils/validateForms';

import { ActionFunction } from '@remix-run/node'

export const action: ActionFunction = async ({ request }) => {
    const form = await request.formData()
    const email = form.get('email')
    const password = form.get('password')
    let name = form.get('firstName')
    
    console.log('Email is: ' + email);

    return null;
}

const login = () => {

  
  

   const [formValues, setFormValues] = useState(({
        email:'',
        password: ''
   }));

   const [validForm, setValidForm] = useState(false);

   const formFields =  [
      {
        field: 'email',
        label: "Email",
        value: formValues.email,
        error: ''
      },
      {
        field: 'password',
        label: "Password",
        value: formValues.password,
        error: ''
      },

   ]
   
  return (
    <div className='w-full h-full flex justify-center items-center'>
        <div className="w-full wrapper flex flex-col items-center "> 
            <h1 className='mt-[25px] text-2xl text-center font-bold '> Welcome Back!</h1>
            <Form method='POST' className='my-[50px] w-[300px] bg-[#212121] px-8 py-7 rounded-lg'>

                {
                  formFields.map((field, i )=> (

                    <FormField 
                        key = {i}
                        formType = {'login'}
                        setValidForm = {setValidForm}
                        htmlFor =   { field.field }
                        type    =   { field.field } 
                        label   =   { field.label }
                        value   =   { field.value }
                        formFields = {formFields}
                        setFormValues = {setFormValues}
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
                  !validForm

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

export default login