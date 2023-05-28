//this file contains all the validaiton scripts that are ran on formfields

export const  validateFormField = (currentVal: string, field: string ) => {

    field = field.toLowerCase()

    let errors_present = false;

    let validEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    let errorMessage = ''
    
    if (field === 'email' && (!currentVal.length || !validEmailRegex.test(currentVal))) {
        errorMessage = ("Please enter a valid email")
        errors_present = true;
    }

    if(currentVal.trim() === "" || !currentVal.length || currentVal.length === 0 ){
        errorMessage =  ("Field cannot be blank")
        errors_present = true;
    }

    if((field.includes('password') || field === 'name' ) && currentVal.length < 7 ){
        errorMessage = ( 'Field must be at least 7 characters.')
        errors_present = true;
    } 
    
    if((field.includes('description') || field === 'title' || field.includes('text') ) && currentVal.length < 10 ){
        errorMessage =  ("Field must be at least 10 characters")
        errors_present = true;
    }

    return {field: 'field', 'errorMessage': errorMessage};

} 

export const checkMatchingPasswords = (pw:string, pw2:string ) => {
    return pw2 === pw ? true: false;
}


interface  formFieldsProps {
    field:  string
    label:  string
    type?:  string
    value:  string
    error:  string
}


export const validateAllFormFields = (formFields:formFieldsProps[]) => {


    let errorCount = 0;
    let blankEntries = 0;

    formFields.map(elm => {

        elm.value  =  elm.value.trim()

        if(elm.value === ''){
            blankEntries += 1;
        }

        let errorMessage = validateFormField(elm.value, elm.field).errorMessage;
        //console.log(errorMessage);
        if(errorMessage !== ''){
            errorCount += 1;
        }

    })



    return blankEntries === 0 && errorCount === 0;
   
}


 
 