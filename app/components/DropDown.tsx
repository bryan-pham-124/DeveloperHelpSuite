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


const baseStyles = `text-xs lg:w-[160px] bg-[url('../images/sort-down-solid.svg')] bg-no-repeat  bg-[right_10%_bottom_95%] bg-[length:10px_30px] appearance-none  pl-[20px]   pb-2 pt-1  px-4  rounded-xl`;


const DropDown = ({options, label, updateSort, updateFilters, width, name = '', defaultValue =''}: DropDownProps) => {

  return (
    <>
       
       <label className='text-white font-light my-2 block' htmlFor="Filter">{label}</label>

        {
          updateSort

          ?

            <select  defaultValue={defaultValue} onChange = {e => updateSort(e.target.value)} className={`w-full ${baseStyles}`}>
            {
                options.map((option) =>  (
                  <option className='text-sm rounded-xl' value={option}> {option}</option>

                ))
            }
            </select>

          :

          updateFilters

          ?

            <select  defaultValue={defaultValue}  onChange = {e => updateFilters(e.target.value, label)}  className={`w-full ${baseStyles}`}>
            {
                options.map((option) =>  (
                  <option className='text-sm rounded-xl' value={option}> {option}</option>
                ))
            }
           </select>

           :

           <select name={name}  defaultValue={defaultValue}   className={`${baseStyles} w-[${width}]`}>
            {
                options.map((option) =>  (
                  <option className='text-sm rounded-xl' value={option}> {option}</option>
                ))
            }
           </select>

          

        }

    </>
  )
}

export default DropDown