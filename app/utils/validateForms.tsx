export const  validateFormField = (currentVal: string, field: string, formFields: Array<any> ) => {


    field = field.toLowerCase()

    let errors_present = false;

    let validEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    let errorMessage = ''
    
    if (field === 'email' && (!currentVal.length || !validEmailRegex.test(currentVal))) {
        errorMessage = ("Please enter a valid email")
        errors_present = true;
    }

    if(currentVal.trim() === "" || !currentVal.length || currentVal.length === 0 ){
        errorMessage =  ( field + " cannot be blank")
         errors_present = true;
    }

    if((field.includes('password') || field === 'name' ) && currentVal.length < 7 ){
        errorMessage = ( field + ' must be at least 7 characters.')
        errors_present = true;
    }   

    let pw2 = formFields.find(elm => elm.field === 'password2').value
    let pw =  formFields.find(elm => elm.field === 'password').value

    console.log('pw ' + pw);
    console.log('pw2 ' + pw2);


    if(field === 'password' && currentVal !== pw2 &&  pw2.trim() != '' ){
        
        errorMessage = ( 'Both passwords must match')
        errors_present = true;

    } else if(field === 'password2' && currentVal !== pw){

        errorMessage = ( 'Both passwords must match')
        errors_present = true;
    }
 
    return {field: 'field', 'errorMessage': errorMessage};

} 

// catch mismatching passwords and blank fields on server
    // redirect user to errors page where users must renter register info

interface FormFieldsProps {
    field: string;
    label: string;
    value: string;
    error: string;
}

export const validateAllFormFields = (event: React.ChangeEvent<HTMLInputElement>, inputArr: Array<FormFieldsProps>, setValidForm: Function | null =  null ) => {

    let allFieldsValid = true;
    inputArr.map(loginField => {
        let result = validateFormField(loginField.value, loginField.field, inputArr )
        if(result.errorMessage !== '' || loginField.value.trim() === '' ){
            allFieldsValid = false
            loginField.error = result.errorMessage
            console.log(result.errorMessage)

        } else {
            loginField.error = ''
        }
    })

    console.log('user clicked')

    if(setValidForm ) {
        setValidForm(allFieldsValid)
    }


    

}

