
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
    sortMethod: string, 
    activeSortLabel: string, 
    modifiedCardData: linkCardDataProps[], 
    linkCardData: linkCardDataProps[],
    setSortType: Function,
    setModifiedCardData: Function
}