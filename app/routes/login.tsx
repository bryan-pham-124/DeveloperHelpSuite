import { Form } from '@remix-run/react'
import React from 'react'

const login = () => {

   const loginFields =  [
        'email',
        'password'
   ]

  return (
    <div>
        <label htmlFor="email" className="text-blue-600 font-semibold">
            Email
          </label>
          <input type="text" id="email" name="email" className="w-full p-2 rounded-xl my-2" />

          <label htmlFor="password" className="text-blue-600 font-semibold">
            Password
          </label>
          <input type="password" id="password" name="password" className="w-full p-2 rounded-xl my-2" />

          <div className="w-full text-center">
            <input
              type="submit"
              className="rounded-xl mt-2 bg-yellow-300 px-3 py-2 text-blue-600 font-semibold transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
              value="Sign In"
            />
        </div>
    </div>
  )
}

export default login