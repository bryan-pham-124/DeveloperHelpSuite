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
        errorMessage =  ( field + " cannot be blank")
        errors_present = true;
    }

    if((field.includes('password') || field === 'name' ) && currentVal.length < 7 ){
        errorMessage = ( field + ' must be at least 7 characters.')
        errors_present = true;
    }   

     
    return {field: 'field', 'errorMessage': errorMessage};

} 

export const checkMatchingPasswords = (pw:string, pw2:string ) => {
    return pw2 === pw ? true: false;
}

 
 