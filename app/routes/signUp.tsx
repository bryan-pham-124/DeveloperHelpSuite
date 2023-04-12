import { Form } from '@remix-run/react'
import React from 'react'
import {useState} from 'react';
import GenericButton from '~/components/GenericButton';
import FormField from '~/components/FormField';
import { ActionFunction } from '@remix-run/node'
import { validateFormField } from '~/utils/validateForms';



export const action: ActionFunction = async ({ request }) => {
    const form = await request.formData()
    const email = form.get('email')
    const password = form.get('password')
    let name = form.get('name')
    
    return null;
}


const signUp = () => {

   
   const [formValues, setFormFields] = useState(({
        email:'',
        password: '',
        password2: '',
        name: ''
   }));

   const [validForm, setValidForm] = useState(false);


   const loginFields =  [
      {
        field: 'email',
        label: "Email",
        value: formValues.email,
       },
      {
        field: 'password',
        label: "Password",
        value: formValues.password,
      },
      {
        field: 'password2',
        label: "Reenter Password",
        value: formValues.password2,
      },

      {
        field: 'name',
        label: "Username",
        value: formValues.name,
      },

   ]
 
   const updateFormField = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {

        setFormFields(formFields => ({...formFields, [field]: event.target.value}) );

        let result = validateFormField(event.target.value, field)
        result.errorMessage !== '' ? setValidForm(false ): setValidForm(true)

      

        //console.log(formValues);
   }

  return (
    <div className='w-full h-full flex justify-center items-center'>
      
        <div className="w-full wrapper flex flex-col items-center  ">
            <h1 className='mt-[25px] text-2xl text-center font-bold '> Welcome! Enter your details below to join us!</h1>
            <Form  method="POST" className='my-[50px] w-[300px] bg-[#212121] px-8 py-7 rounded-xl'>

                {
                    loginFields.map((field, i) => (
                        <FormField 
                            key = {i}
                            setValidForm = {setValidForm}
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
                        formButton = {true}
                        buttonType='skyBlue'
                        text="Submit"
                        validForm = {validForm}
                        className={`mt-4`}
                    />
                </div>

             </Form>
        </div>
        
    </div>
  )
}

export default signUp