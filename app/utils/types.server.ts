
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
    order: number 
    content: string | null | undefined 
}[]


export interface questionDataEntry {
    type: string 
    order: number 
    content: string 
}


export interface linkCardDataProps {
    category: string
    priority: number  | string
    title: string  
    status: string
    upvotes: number
    downvotes: number
    votes?: number

}


 