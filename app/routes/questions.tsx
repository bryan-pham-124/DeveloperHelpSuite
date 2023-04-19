import React from 'react'
import { json } from "@remix-run/node"; // or cloudflare/deno
import { getUser } from '~/utils/auth.server';
import { useLoaderData } from '@remix-run/react';
import type { LoaderArgs } from "@remix-run/node";


export async function loader({ request }: LoaderArgs) {

  const userData = await getUser(request);
  
  
  return await json({'userData': userData});

}

const questions = () => {
  
  const {userData} = useLoaderData<typeof loader>();

  return (
    <div>
        <div className="wrapper flex w-full justify-center">
            <h1>  {`Hello user: ${userData?.name}. Welcome to the community! `}  </h1>
        </div>
    </div>
  )
}

export default questions