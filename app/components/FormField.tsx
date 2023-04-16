import {useState}from 'react'
import { validateFormField } from '~/utils/validateForms'


// app/components/form-field.tsx
interface FormFieldProps {
    htmlFor: string
    label: string
    type?: string
    value: any
    formFields: Array<any>
    setFormValues: Function
    formType: string
    //updateFormField: Function
    //onChange?: (...args: any) => any
}

const FormField = ({ 
    htmlFor, 
    label, 
    type = 'text', 
    value, 
    formFields,
    setFormValues,
    formType = 'signUp'
    //updateFormField,
    //onChange = () => {} 
  }: FormFieldProps
    
    ) =>
    
    {

    const [errorMessage, setErrorMessage] = useState('');

    const updateFormField = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
      
      let result = validateFormField(event.target.value, field );
      let fieldIndex = formFields.findIndex(elm => elm.field === field);

      if(result.errorMessage !== ''){
          
          formFields[fieldIndex].error = result.errorMessage;

      } else {
           formFields[fieldIndex].error = ''

      }

      setFormValues((formFields: Array<object>) => ({...formFields, [field]: event.target.value}) )
   }

   
    const displayErrors = (event: React.ChangeEvent<HTMLInputElement>) => {
        let result = validateFormField(event.target.value, htmlFor);
        result.errorMessage !== '' ? setErrorMessage(result.errorMessage ): setErrorMessage('')
         
    }
    
    return (
      <>
        <label htmlFor={htmlFor} className="text-white text-lg font-semibold">
             {label}
        </label>
        <input
            onChange={ (e) =>  {
               updateFormField(e, htmlFor);
               displayErrors(e)
            }}
            onBlur={(e) => displayErrors(e)}
            type={type}
            id={htmlFor}
            name={htmlFor}
            className="w-full p-2 rounded-xl my-3"
            value={value}
            required
        />
        {
            errorMessage !== ''  

            ?  
                <small className='text-[#fc8403] text-xs mb-3 block'>  {errorMessage} </small>
           
            :

             ""
        }
      </>
    )
  }


  export default FormField