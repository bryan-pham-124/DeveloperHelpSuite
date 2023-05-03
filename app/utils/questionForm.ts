import { redirect, json, createCookieSessionStorage } from "@remix-run/node";
//import { PrismaClient  } from "@prisma/client";
import { prisma } from './prisma.server'

import { questionData, questionDataEntry } from "./types.server";



 export const getQuestions = async() => {
    return await prisma.questions.findMany({});
 }
 
 export const createQuestion = async( questionCardData: Array<questionDataEntry>,  questionContentData: Array<questionDataEntry>, userId: string) => {
  
    const baseQuery = {
        userId: userId,
        title:  questionCardData[0].content || '',
        description: questionCardData[1].content || '',
        upvotes: 0,
        downvotes: 0,
        priority: questionCardData[2].content ? +questionCardData[2].content: 1 ,
        status:'Not Solved',
        questionContent: {}
    }

    if(questionContentData){
        baseQuery.questionContent = {create: questionContentData }
    }

    console.log(questionCardData[2].content);

    try{

        await prisma.questions.create({ data: baseQuery}) 

        return json(
            {
            error: ``,
            },
            { status: 200 }
        );
         

    } catch(e) {

        console.log(e);
        return json(
            {
              error: `Could not create the question. Please try again later`,
            },
            { status: 500 }
        );

    }    
 }


 /*

 const user = await prisma.user.create({
  data: {
    email: 'elsa@prisma.io',
    name: 'Elsa Prisma',
  },
})

 */