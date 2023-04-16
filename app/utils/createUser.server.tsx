import bcrypt from "bcryptjs";
import { RegisterForm } from "./types.server";

import { PrismaClient  } from "@prisma/client";
 

 
export const createUser = async (user: RegisterForm) => {

  const prisma = new PrismaClient();  
  const passwordHash = await bcrypt.hash(user.password, 10);
  const newUser = await prisma.user.create({
    data: {
      email: user.email,
      password: passwordHash,
      name: user.name
    },
  });
  return { id: newUser.id, email: user.email };
};