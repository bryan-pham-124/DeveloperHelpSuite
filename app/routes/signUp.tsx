import { Form, useActionData,  useNavigation } from '@remix-run/react'
import React, { useEffect } from 'react'
import {useState} from 'react';
import GenericButton from '~/components/GenericButton';
import FormField from '~/components/FormField';
import { ActionFunction } from '@remix-run/node'
import { checkMatchingPasswords} from '~/utils/validateForms';
import { json, redirect } from "@remix-run/node"; // or cloudflare/deno
import { register } from '~/utils/auth.server';
import { validateAllFormFields } from '~/utils/validateForms';
import ErrorBox from '~/components/ErrorBox';


// form users see when they sign up
export const action: ActionFunction = async ({ request }) => {

    const form = await request.formData()
    const email = form.get('email') + '';
    const password = form.get('password') + '';
    const password2 = form.get('password2') + '';
    const name = form.get('name') + '';

    if(!checkMatchingPasswords(password, password2)){
        return json({error: 'Both passwords do not match'}, {status: 400});
    } else {

        const registerResult = await register({ email, password, name })
        return registerResult;
    }

}


const signUp = () => {


   const formErrors = useActionData<typeof action>();

   const [formValues, setFormValues] = useState(({
        email:'',
        password: '',
        password2: '',
        name: ''
   }));

   const [serverFormErrors, setServerFormErrors] = useState('')
   const navigation = useNavigation();
   const isSubmitting = navigation.state === "submitting";
   const [allFieldsValid, setAllFieldsValid] = useState(false)
   const [matchingPasswords, setMatchingPasswords] = useState(false)

   const formFields =  [
      {
        field: 'email',
        label: "Email",
        type:  'email',
        value: formValues.email || '',
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


  useEffect(() => {
    if(formErrors){
        setServerFormErrors((formErrors.error))
    }
  }, [formErrors])

  useEffect(() => {

      let pw = formFields.find(elm => elm.field === 'password')?.value
      let pw2 =  formFields.find(elm => elm.field === 'password2')?.value

      if(pw !== pw2){ 
        setAllFieldsValid(false)
        setMatchingPasswords(false)
      } else {  
        setAllFieldsValid(validateAllFormFields(formFields))
        setMatchingPasswords(true)
      }

  }, [formValues])


  return (
    <div className='w-full h-full flex justify-center items-center'>
     <div className="w-full wrapper flex flex-col items-center "> 

        <h1 className='my-[50px] text-4xl text-center font-bold '> Join our community!</h1>

        {

          serverFormErrors !== ''
          
          ?

          <ErrorBox text = {serverFormErrors + ''}/>  

          :

          ''

        }
          
        <Form method='POST' className='my-[20px] w-[300px] bg-customBlack px-8 py-7 rounded-lg' autoComplete='off'>

              {
                formFields.map((field, i )=> (
                  <FormField 
                      key = {i}
                      formType='signUp'
                      htmlFor =   { field.field }
                      type    =   { field.type } 
                      label   =   { field.label }
                      value   =   { field.value }
                      formFields = {formFields}
                      setFormValues = {setFormValues}
                  />
                ))
              }


              {
                !matchingPasswords 

                ?

                <div className='w-full text-center text-customOrange text-xs mb-3 block'> Passwords must match each other! </div>

                :

                ''
              }
  
              <div className="w-full text-center ">
                  <GenericButton
                      formButton = {true}
                      buttonType='skyBlue'
                      text="Submit"
                      className={(isSubmitting || !allFieldsValid )? `mt-4 pointer-events-none opacity-20`: 'mt-4' }
                      isSubmitting = {isSubmitting}
                  />
              </div>
        </Form>
    </div>         
</div>
  )
}

export default signUp