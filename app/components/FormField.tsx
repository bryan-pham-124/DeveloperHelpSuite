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
    dynamicForm?: boolean
    deletable?: boolean
    deleteFormField: Function
}

const FormField = ({ 
    htmlFor, 
    label, 
    type = 'text', 
    value, 
    formFields,
    setFormValues,
    formType = 'signUp',
    multiline = false,
    dynamicForm = false,
    deletable = false,
    deleteFormField
  }: FormFieldProps
    
    ) =>
    
    {

    const [errorMessage, setErrorMessage] = useState('');

    const updateFormField = (event: React.ChangeEvent<HTMLInputElement> |  React.ChangeEvent<HTMLTextAreaElement> , field: string) => {
      
      let currentVal = event.target.value;

      let result = validateFormField(currentVal, field );
      let fieldIndex = formFields.findIndex(elm => elm.field === field);

      if(fieldIndex !== -1){
        if(result.errorMessage !== ''){
          
          formFields[fieldIndex].error = result.errorMessage;

        } else {
            formFields[fieldIndex].error = ''
        }
      }
     
      setFormValues((formFields: Array<object>) => ({...formFields, [field]: currentVal}) );

      if(dynamicForm) {
        let index = formFields.findIndex(elm => elm.field == field);
        if(index !== -1){
           formFields[index].value = currentVal;
        }
      }

   }

   
    const displayErrors = (event: React.ChangeEvent<HTMLInputElement> |  React.ChangeEvent<HTMLTextAreaElement>) => {
        let result = validateFormField(event.target.value, htmlFor);
        result.errorMessage !== '' ? setErrorMessage(result.errorMessage ): setErrorMessage('')
    }
    
    return (
      <>


        {

          deletable

          ?

          <div className="flex justify-between my-3">
               <label htmlFor={htmlFor} className="text-white text-lg font-semibold capitalize">
                    {label}
               </label>
               <button className='bg-customRed rounded-xl text-sm px-4 text-white' onClick={(e) => {e.preventDefault(); deleteFormField(htmlFor)}}>
                    Delete Field
               </button>
          </div>
         
          :

          <label htmlFor={htmlFor} className="text-white text-lg font-semibold my-3 capitalize">
              {label}
          </label>

        }



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
                className="w-full p-2 rounded-xl my-3 whitespace-pre-wrap h-[120px]"
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