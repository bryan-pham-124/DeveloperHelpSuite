import { Form } from '@remix-run/react'
import React from 'react'
import {useState} from 'react';
import GenericButton from '~/components/GenericButton';
import FormField from '~/components/FormField';

import { ActionFunction } from '@remix-run/node'

export const action: ActionFunction = async ({ request }) => {
    const form = await request.formData()
     const email = form.get('email')
    const password = form.get('password')
    let name = form.get('firstName')
    
    console.log('Email is: ' + email);
}

const login = () => {

  
   const [formValues, setFormFields] = useState(({
        email:'',
        password: ''
   }));


   const loginFields =  [
      {
        field: 'email',
        label: "Email",
        value: formValues.email
      },
      {
        field: 'password',
        label: "Password",
        value: formValues.password
      },

   ]
 
   const updateFormField = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {

        setFormFields(formFields => ({...formFields, [field]: event.target.value}) )
        console.log(formValues);
   }

  return (
    <div className='w-full h-full flex justify-center items-center'>
        <div className="w-full wrapper flex flex-col items-center "> 
            <h1 className='mt-[25px] text-2xl text-center font-bold '> Welcome Back!</h1>
            <Form className='my-[50px] w-[300px] bg-[#212121] px-8 py-7 rounded-lg'>

                {
                  loginFields.map(field => (
                    <FormField 
                        htmlFor =   { field.field }
                        type    =   { field.field } 
                        label   =   { field.label }
                        value   =   { field.value }
                        onChange = {e => updateFormField(e, field.field)}
                    />
                  ))
                }

                <div className="w-full text-center">
                  <GenericButton
                    isInput
                    buttonType='skyBlue'
                    text="Submit"
                    className='mt-4'
                  />
                </div>

            </Form>
        </div>         
    </div>
  )
}

export default login