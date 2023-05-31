import { Link, useLoaderData } from '@remix-run/react';
import { getUser, requireUserId } from '~/utils/auth.server';
import type { LoaderArgs } from "@remix-run/node";
import { redirect,  } from "@remix-run/node";
import { json } from "@remix-run/node"; // or cloudflare/deno




//this page is displayed if user has been successfully logged in

export async function loader({ request }: LoaderArgs) {
    
    const userData = await getUser(request);

    if(!userData){
        return redirect('/login?error=User_Not_Logged_In');
    }

    return await json({'userData': userData});    
};


const loginSuccess = () => {

  const {userData} = useLoaderData<typeof loader>();

  return (
    <div className='w-full h-[50vh] flex justify-center items-center'>
        <div className="wrapper">
            <h1 className=' text-lg text-center md:text-3xl mb-[30px] px-4 font-bold text-sky-500'>
                {`Congrats, ${userData?.name}  you have logged in!`}
            </h1>
            
            <div className="wrapper flex w-full gap-x-5 justify-center px-4">   
                <Link to="/questions" className='border-b border-customBlack pb-2 text-customBlack text-lg md:text-2xl font-bold' > Explore Questions and Answers </Link>
            </div>
           
        </div>
    </div>
  )
}

export default loginSuccess