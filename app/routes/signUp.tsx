import { Form } from '@remix-run/react'
import React from 'react'
import {useState} from 'react';
import GenericButton from '~/components/GenericButton';
import FormField from '~/components/FormField';
import { ActionFunction } from '@remix-run/node'
import { validateAllFormFields } from '~/utils/validateForms';



export const action: ActionFunction = async ({ request }) => {
    const form = await request.formData()
    const email = form.get('email')
    const password = form.get('password')
    let name = form.get('name')
    
    return null;
}


const signUp = () => {

   const [formValues, setFormValues] = useState(({
        email:'',
        password: '',
        password2: '',
        name: ''
   }));

   const [validForm, setValidForm] = useState(false);


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
        //type:  'password',
        type:  'text',
        value: formValues.password,
        error: ''
      },
      {
        field: 'password2',
        label: "Reenter Password",
        //type:  'password',
        type:  'text',
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
        <Form method='POST' className='my-[50px] w-[300px] bg-[#212121] px-8 py-7 rounded-lg' autoComplete='off'>

            {
              formFields.map((field, i )=> (
                <FormField 
                    key = {i}
                    setValidForm = {setValidForm}
                    htmlFor =   { field.field }
                    type    =   { field.type } 
                    label   =   { field.label }
                    value   =   { field.value }
                    formFields = {formFields}
                    setFormValues = {setFormValues}
                />
              ))
            }
 
            <div className="w-full text-center ">
                <GenericButton
                    onClick={(e) => validateAllFormFields(e, formFields, setValidForm)}
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

export default signUp