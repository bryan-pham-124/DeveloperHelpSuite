
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


export interface linkCardDataProps {
    category: string
    priority: Number  | string
    title: string  
    status: string
    upvotes: number
    downvotes: number
    votes?: number

}


 