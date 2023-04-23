import { Link, useLoaderData } from '@remix-run/react';
import { getUser, requireUserId } from '~/utils/auth.server';
import type { LoaderArgs } from "@remix-run/node";
import { redirect,  } from "@remix-run/node";
import { json } from "@remix-run/node"; // or cloudflare/deno


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
            <h1 className=' text-lg text-center md:text-3xl mb-[30px] px-4 font-bold'>
                {`Congrats, ${userData?.name}  you have logged in!`}
            </h1>
            
            <div className="wrapper flex w-full gap-x-5 justify-center px-4">   
                <Link to="/questions" className='border-b border-sky-500 pb-2 text-sky-500 text-md md:text-lg' > Explore Questions and Answers </Link>
                <Link to="#" className='border-b border-customBlack pb-2 text-customBlack text-md md:text-lg' > Explore the Knowledgebase </Link>
            </div>
           
        </div>
    </div>
  )
}

export default loginSuccess