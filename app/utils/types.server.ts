
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


export interface linkCardDataProps  {
    [key: string]: any
}


export interface activeFilterLabelsProps {
    field:  string
    isActive: boolean, 
    value: string
}

 


export interface sortCardsProps {
    sortMethod: string
    activeSortLabel: string
    modifiedCardData: linkCardDataProps[]
    linkCardData: linkCardDataProps[]
    setSortType: Function
    setModifiedCardData: Function
}



export interface dataProps {
    userId: string | null
    title: string | null
    description: string | null
    questionContent?: {order: number, content: string, type: string}[]
    replyContent?: {order: number, content: string, type: string}[]
    upvotes: number | null
    downvotes: number | null
    status?: string | null
    createdAt:  string | null
    preferredAnswer?: boolean | null | undefined
}

 

/*

    data props

    userId
    title 
    description
    questionContent --> {order: number, content: string, type: string}
    upvotes
    downvotes

*/