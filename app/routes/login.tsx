import { Form, useActionData, useLoaderData, useNavigation } from '@remix-run/react'
import React, { useEffect } from 'react'
import {useState} from 'react';
import GenericButton from '~/components/GenericButton';
import FormField from '~/components/FormField';
 
import { ActionFunction, LoaderFunction, json } from '@remix-run/node'
import { validateAllFormFields } from '~/utils/validateForms';
import { loginUser } from '~/utils/auth.server';





export const loader: LoaderFunction = async({request}) => {

  const url = new URL(request.url);
  const redirectError= url.searchParams.get("error");
  
  //console.log('redirect error is: ' + redirectError);

  let errorMessage = '';

  if(redirectError){
    errorMessage = (redirectError + '').split('_').join(' ');
    return await json({'error': errorMessage});
  }

  return null;

}

export const action: ActionFunction = async ({ request }) => {

    const form = await request.formData()
    const email = form.get('email') + ''
    const password = form.get('password') + ''
    let name = form.get('firstName')
    
    const loginResult = await loginUser({email, password})
    
    return  loginResult ;
}

const login = () => {


  const formErrors = useActionData<typeof action>();
  const redirectErrors = useLoaderData<typeof loader>();


  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

   const [formValues, setFormValues] = useState(({
        email:'',
        password: ''
   }));

   const [serverFormErrors, setServerFormErrors] = useState('')
   const [redirectError, setRedirectError] = useState('')

   const [allFieldsValid, setAllFieldsValid] = useState(false)
 

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
   

  useEffect(() => {
    if(formErrors){
        setServerFormErrors((formErrors.error))
    }
  }, [formErrors])


  useEffect(() => {
    if(redirectErrors){
        setRedirectError((redirectErrors.error))
    }
  }, [redirectErrors])


  useEffect(() => {
      setAllFieldsValid(validateAllFormFields(formFields))
  }, [formValues])


  return (
    <div className='w-full h-full flex justify-center items-center'>
        <div className="w-full wrapper flex flex-col items-center "> 
            <h1 className='my-[50px] text-4xl text-center font-bold '>  Welcome Back!</h1>
             
            {
                serverFormErrors !== ''

                ?

                  <div className='my-4 px-4 py-2 bg-red-600 rounded-xl text-white font-bold'>
                      {'Error:  ' + serverFormErrors}
                  </div>

                :

                ''
            }

            {         
                redirectError !== ''

                ?

                  <div className='my-4 px-4 py-2 bg-red-600 rounded-xl text-white font-bold'>
                      {'Error:  ' + redirectError}
                  </div>

                :

                ''
            }
            
            <Form method='POST' className='my-[50px] w-[300px] bg-customBlack px-8 py-7 rounded-lg'>

                {
                  formFields.map((field, i )=> (

                    <FormField 
                        key = {i}
                        formType = {'login'}
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
                        className={(isSubmitting || !allFieldsValid )? `mt-4 pointer-events-none opacity-20`: 'mt-4' }
                    />
                </div>
                
            </Form>
        </div>         
    </div>
  )
}

export default login