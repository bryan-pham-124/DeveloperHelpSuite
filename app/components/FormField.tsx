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
    return (
      <>
        <label htmlFor={htmlFor} className="text-white text-lg font-semibold">
             {label}
        </label>
        <input
            onChange={onChange}
            type={type}
            id={htmlFor}
            name={htmlFor}
            className="w-full p-2 rounded-xl my-3"
            value={value}
        />
      </>
    )
  }


  export default FormField