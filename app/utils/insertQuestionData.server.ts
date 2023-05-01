import { redirect, json, createCookieSessionStorage } from "@remix-run/node";
//import { PrismaClient  } from "@prisma/client";
import { prisma } from './prisma.server'



interface questionDataProps {
    questionData: string[]
    questionContentData: string[][]
}
 
 export const createQuestion = async(questionData: [string, FormDataEntryValue][], questionContentData: [string, FormDataEntryValue][]) => {

 }