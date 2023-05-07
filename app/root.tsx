
// ./app/root.tsx

import type { MetaFunction, LinksFunction } from "@remix-run/node";
import { json } from "@remix-run/node"; // or cloudflare/deno
import { getUser } from '~/utils/auth.server';
import { useLoaderData } from '@remix-run/react';
import type { LoaderArgs } from "@remix-run/node";
import {useState, useEffect} from 'react';

import styles from './styles/app.css';

import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import Navbar from "./components/Navbar";



export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: styles }]
}

export async function loader({ request }: LoaderArgs  ) {

  const userData = await getUser(request);
  
  return await json({userData, request  });

}

export default function App() {

  const {userData} = useLoaderData<typeof loader>()

  const [isLoggedIn, setIsLoggedIn] = useState((typeof userData?.name === 'string') );

  useEffect(() => {
      setIsLoggedIn((typeof userData?.name === 'string'))
  }, [userData])

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
         <title>Developer Help Suite</title>
        <Meta />
        <Links />
      </head>
      <body>
        <Navbar isLoggedIn={isLoggedIn} />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <script src="../path/to/flowbite/dist/flowbite.min.js"></script>
      </body>
    </html>
  );
}
