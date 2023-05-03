
export interface RegisterForm {
    name: string
    password: string
    email: string
}



export interface LoginForm{
    email: string
    password: string
}


export interface questionData {
    type: string 
    order: Number 
    content: string | null | undefined 
}[]


export interface questionDataEntry {
    type: string 
    order: Number 
    content: string | null | undefined 
}