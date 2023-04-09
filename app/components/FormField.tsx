import {useState  }from 'react'
// app/components/form-field.tsx
interface FormFieldProps {
    htmlFor: string
    label: string
    type?: string
    value: any
    
    onChange?: (...args: any) => any
}



const FormField = ({ 
    htmlFor, 
    label, 
    type = 'text', 
    value, 
    
    onChange = () => {} }: FormFieldProps) =>
    
    {

   const [errorMessage, setErrorMessage] = useState('');

   const displayError = (event: React.ChangeEvent<HTMLInputElement> ) => {

        let errors_present = false;

        let currentVal = event.target.value;

        let validEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        
        if (htmlFor === 'email' && (!currentVal.length || !validEmailRegex.test(currentVal))) {
            setErrorMessage("Please enter a valid email")
            errors_present = true;
        }

        if(currentVal.trim() === "" || !currentVal.length || currentVal.length === 0 ){
             setErrorMessage("Field cannot be blank")
             errors_present = true;
        }

        if(htmlFor === 'password' && currentVal.length < 9 ){
            setErrorMessage('Password must be at least 9 characters.')
            errors_present = true;
        }   

        if(!errors_present){
            setErrorMessage("");
        }

        errors_present = false;

        console.log(errorMessage)

    }

    return (
      <>
        <label htmlFor={htmlFor} className="text-white text-lg font-semibold">
             {label}
        </label>
        <input
            onChange={onChange}
            onBlur={displayError}
            type={type}
            id={htmlFor}
            name={htmlFor}
            className="w-full p-2 rounded-xl my-3"
            value={value}
        />
        {
            errorMessage !== ''

            ?
                <small className='text-[#fc8403] text-xs mb-6'>  {errorMessage} </small>
            :

            ""
        }
      </>
    )
  }


  export default FormField