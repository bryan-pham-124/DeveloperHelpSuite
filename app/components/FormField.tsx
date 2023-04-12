import {useState}from 'react'
import { validateFormField } from '~/utils/validateForms'


// app/components/form-field.tsx
interface FormFieldProps {
    htmlFor: string
    label: string
    type?: string
    value: any
    setValidForm: Function
    onChange?: (...args: any) => any
}

const FormField = ({ 
    htmlFor, 
    label, 
    type = 'text', 
    value, 
    setValidForm,
    onChange = () => {} }: FormFieldProps
    
    ) =>
    
    {

    const [errorMessage, setErrorMessage] = useState('');

   
    const displayErrors = (event: React.ChangeEvent<HTMLInputElement>) => {
        let result = validateFormField(event.target.value, htmlFor);
        result.errorMessage !== '' ? setErrorMessage(result.errorMessage ): setErrorMessage('')
        result.errorMessage !== '' ? setValidForm(false ): setValidForm(true)
    }
    

    return (
      <>
        <label htmlFor={htmlFor} className="text-white text-lg font-semibold">
             {label}
        </label>
        <input
            onChange={onChange}
            onBlur={e => (displayErrors(e))}
            type={type}
            id={htmlFor}
            name={htmlFor}
            className="w-full p-2 rounded-xl my-3"
            value={value}
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