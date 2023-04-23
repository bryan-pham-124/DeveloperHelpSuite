import { redirect, json, createCookieSessionStorage } from "@remix-run/node";
//import { PrismaClient  } from "@prisma/client";
import { prisma } from './prisma.server'

import { createUser } from "./createUser.server";
import bcrypt from "bcryptjs";
import { LoginForm, RegisterForm } from "./types.server";


const sessionSecret = process.env.SESSION_SECRET;
//const prisma = new PrismaClient()

if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}


const storage = createCookieSessionStorage({
  cookie: {
    name: "developerHelpSuiteSession",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

 
export const register = async (user: RegisterForm) => {

    const user_exists = await prisma.user.count({ 
        where: { email: user.email }
    });

    if (user_exists) {
      return json(
        { error: `User already exists with that email` },
        { status: 400 }
      );
    }

    const newUser = await createUser(user);

    if (!newUser) {
      return json(
        {
          error: `Could not create new users.`,
          fields: { email: user.email, password: user.password },
        },
        { status: 400 }
      );
    }
  
    return createUserSession(newUser.id, '/loginSuccess')

}

export const createUserSession = async (userId: string, redirectTo: string) => {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}


// Validate the user on email & password
export const loginUser = async ({ email, password }: LoginForm) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !(await bcrypt.compare(password, user.password)))
    return json({ error: `Your login credentials are incorrect` }, { status: 400 });

  return createUserSession(user.id, "/loginSuccess");
}


export const  requireUserId = async (request: Request) => {
  const session = await getUserSession(request)
  const userId = session.get('userId')
 
  /*
  if (!userId || typeof userId !== 'string') {  
    return redirect(`/login`);
  }
  */

  return userId;
}

 
export const getUser = async (request: Request) => {
  
  //console.log(request)

  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (typeof userId !== "string") {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true },
    });
    //console.log(user);
    return user;
  } catch {
    throw logout(request);
  }
}


const getUserSession = (request: Request) => {
  return storage.getSession(request.headers.get("Cookie"));
}


export const logout = async (request: Request) => {
  //console.log('HELLO')
  //console.log(request);

  const session = await getUserSession(request);
  
  return redirect("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
 

  
   
}