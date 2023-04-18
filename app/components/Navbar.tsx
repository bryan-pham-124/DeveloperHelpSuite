import React from 'react'
import { Link } from 'react-router-dom'
import GenericButton from './GenericButton'

const Navbar = () => {
  return (
    <nav className="w-full grid grid-cols-1 bg-customBlack px-10 py-5  text-white items-center gap-y-7 md:grid-cols-2 md:gap-y-0">
        <div className="w-full wrapper flex  flex-col gap-x-9 gap-y-7   justify-center align-middle items-center my-7 md:gap-y-0 md:flex-row md:justify-start md:my-0">
            <Link to={"/"} className="link text-3xl font-bold md:text-xl">Developer Help Suite</Link>
            <Link to={"#"} className="link font-light mt-3 text-xl border-b pb-2 md:text-sm">About</Link>
        </div>
        <div className="w-full wrapper flex flex-row justify-center gap-x-3 md:justify-end"> 
             <GenericButton to={"login"} text = "Login"   buttonType='skyBlue'   />
             <GenericButton to={"signUp"} text = "Sign Up"  buttonType='outlineWhite'  />
         </div>
  </nav>
  )
}

export default Navbar