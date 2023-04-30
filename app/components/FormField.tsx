import {useState}from 'react'
import { validateFormField } from '~/utils/validateForms'


// app/components/form-field.tsx
interface FormFieldProps {
    htmlFor: string
    label: string
    type?: string
    value?: any
    formFields: Array<any>
    setFormValues: Function
    updateDynamicForm?: Function
    formType: string
    multiline?: boolean
}

const FormField = ({ 
    htmlFor, 
    label, 
    type = 'text', 
    value, 
    formFields,
    setFormValues,
    formType = 'signUp',
    multiline = false
  }: FormFieldProps
    
    ) =>
    
    {

    const [errorMessage, setErrorMessage] = useState('');

    const updateFormField = (event: React.ChangeEvent<HTMLInputElement> |  React.ChangeEvent<HTMLTextAreaElement> , field: string) => {
      
      let result = validateFormField(event.target.value, field );
      let fieldIndex = formFields.findIndex(elm => elm.field === field);

      if(fieldIndex !== -1){
        if(result.errorMessage !== ''){
          
          formFields[fieldIndex].error = result.errorMessage;

        } else {
            formFields[fieldIndex].error = ''
        }
      }
     
       
      setFormValues((formFields: Array<object>) => ({...formFields, [field]: event.target.value}) )
    
      //console.log(event.target.value);

   }

   
    const displayErrors = (event: React.ChangeEvent<HTMLInputElement> |  React.ChangeEvent<HTMLTextAreaElement>) => {
        let result = validateFormField(event.target.value, htmlFor);
        result.errorMessage !== '' ? setErrorMessage(result.errorMessage ): setErrorMessage('')
    }
    
    return (
      <>
        <label htmlFor={htmlFor} className="text-white text-lg font-semibold">
             {label}
        </label>

        {
       
          multiline

          ?

          <textarea
                onChange={ (e) =>  {

                  updateFormField(e, htmlFor);
                  displayErrors(e);
                }}
              
                id={htmlFor}
                name={htmlFor}
                className="w-full p-2 rounded-xl my-3"
                value={value}
                required
              >
          </textarea>

          :

          <input
              onChange={ (e) =>  {

                updateFormField(e, htmlFor);
                displayErrors(e);
              }}
              onBlur={(e) => displayErrors(e)}
              type={type}
              id={htmlFor}
              name={htmlFor}
              className="w-full p-2 rounded-xl my-3"
              value={value}
              required
          />


        }
    
        {
            errorMessage !== ''  

            ?  
                <small className='text-customOrange text-xs mb-3 block'>  {errorMessage} </small>
           
            :

             ""
        }
      </>
    )
  }


  export default FormField