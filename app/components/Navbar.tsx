import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="w-full grid grid-cols-1 bg-[#212121] px-10 py-5 text-white items-center  md:grid-cols-2">
        <div className="w-full wrapper flex  flex-col gap-x-9 justify-center align-middle items-center mb-7 md:flex-row md:justify-start md:mb-0">
            <Link to={"#"} className="link text-xl font-bold">Developer Help Suite</Link>
            <Link to={"#"} className="link font-light mt-3  border-b  pb-2">About</Link>
        </div>
        <div className="w-full wrapper flex flex-row justify-center gap-x-3 md:justify-end">     
            <Link to={"#"}  className="link font-light  py-1 bg-sky-500 transition-colors ease-in-out  hover:bg-sky-700 duration-300 rounded-xl w-[80px] text-center">Login</Link>
            <Link to={"#"} className="link font-light border   py-1 border-white  transition-colors ease-in-out  hover:bg-white hover:text-black duration-300   rounded-xl w-[80px] text-center">Sign Up</Link>
        </div>
  </nav>
  )
}

export default Navbar