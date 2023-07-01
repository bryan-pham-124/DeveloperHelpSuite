import React from 'react'


interface DropDownProps {
    options: string[]
    label: string
    updateSort?:  Function
    updateFilters?: Function
    defaultValue?: string
    width?: string
    name?: string
}


const generateRandomId = () =>  Math.floor(Math.random() * (Math.floor(10000) - Math.ceil(0) + 1) + Math.ceil(1000));  
  
const randId = generateRandomId();
 
const baseStyles = `w-full text-md lg:w-[160px] bg-[url('../images/sort-down-solid.svg')] bg-no-repeat  bg-[right_10%_bottom_95%] bg-[length:10px_30px] appearance-none  pl-[20px]   pb-2 pt-1  px-4  rounded-xl`;
const optionStyles = 'w-full text-sm rounded-xl text-center';

// Dropdown that is used on multiple pages and takes an array of options where each element will be displayed
const DropDown = ({options, label, updateSort, updateFilters, width, name = '', defaultValue =''}: DropDownProps) => {

  return (
    <>
       
       <label className='text-white font-light my-2 block' htmlFor={updateFilters ? 'Filter-' + randId: updateSort ? 'Sort-'+ randId: 'Default-'+ randId}>{label}</label>

        {
        
          // Dropdown to display sorting labels -> Ascending or Descending
          updateSort

          ?

            <select id= {"Filter-" + randId} defaultValue={defaultValue} onChange = {e => updateSort(e.target.value)} className={`w-full ${baseStyles}`}>
            {
                options.map((option) =>  (
                  <option className={optionStyles} value={option}> {option}</option>
                ))
            }
            </select>

          :


          // Dropdown to display currently available filters

          updateFilters

          ?

            <select id= {"Sort-" + randId} defaultValue={defaultValue}  onChange = {e => updateFilters(e.target.value, label)}  className={`w-full ${baseStyles}`}>
            {
                options.map((option) =>  (
                  <option className={optionStyles} value={option}> {option !== '' ? option: '-'}</option>
                ))
            }
           </select>

           :

           // default dropdown

           <select id={"Default-" + randId} name={name}  defaultValue={defaultValue}   className={`${baseStyles} w-[${width}]`}>
            {
                options.map((option) =>  (
                  <option className={optionStyles} value={option}> {option !== '' ? option: '-'}</option>
                ))
            }
           </select>

          

        }

    </>
  )
}

export default DropDown