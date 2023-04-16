import { redirect, json, createCookieSessionStorage } from "@remix-run/node";
import { PrismaClient  } from "@prisma/client";
import { createUser } from "./createUser.server";
import bcrypt from "bcryptjs";
import { RegisterForm } from "./types.server";


const sessionSecret = process.env.SESSION_SECRET;

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

 
export  const register = async (user: RegisterForm) => {

    const prisma = new PrismaClient()
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
    //return  'Hooray you registered!'

    return createUserSession(newUser.id, '/questions')

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


 