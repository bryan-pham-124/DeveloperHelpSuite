export const  validateFormField = (currentVal: string, field: string ) => {

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

    if(field === 'password' && currentVal.length < 7 ){
        errorMessage = ('Password must be at least 7 characters.')
        errors_present = true;
    }   
 
    return {field: 'field', 'errorMessage': errorMessage};

} 



/*
   const  validateForm  = (event: React.ChangeEvent<HTMLInputElement> ) => {

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

        if(htmlFor === 'password' && currentVal.length < 7 ){
            setErrorMessage('Password must be at least 7 characters.')
            errors_present = true;
        }   

        if(!errors_present){
            setErrorMessage("");
        }

        errors_present = false;

        validForm = !errors_present ?  true : false;

        console.log(errorMessage)

    } */
