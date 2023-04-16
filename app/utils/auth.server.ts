import { redirect, json, createCookieSessionStorage } from "@remix-run/node";
import { PrismaClient  } from "@prisma/client";
import { createUser } from "./createUser.server";
import bcrypt from "bcryptjs";
import { RegisterForm } from "./types.server";




export async function register(user: RegisterForm) {

    const prisma = new PrismaClient()
    const exists = await prisma.user.count({ where: { email: user.email } });

    if (exists) {
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
    return  'Hooray you registered!'

  }