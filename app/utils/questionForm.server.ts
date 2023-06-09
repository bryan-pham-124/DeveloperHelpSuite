import { redirect, json, createCookieSessionStorage } from "@remix-run/node";
//import { PrismaClient  } from "@prisma/client";
import { prisma } from './prisma.server'

import { questionData, questionDataEntry } from "./types.server";


 export const getQuestions = async() => {
    return await prisma.questions.findMany({});
 }
 
 export const createQuestion = async(defaultData: Array<questionDataEntry>,  questionContentData: Array<questionDataEntry>, userId: string) => {
    
    const priority = (defaultData.find(elm => elm.type === 'priority')?.content);
    const category = (defaultData.find(elm => elm.type === 'category')?.content);

    const baseQuery = {
        userId: userId,
        title:  defaultData[0].content || '',
        description:defaultData[1].content || '',
        upvotes: 0,
        downvotes: 0,
        category: category || 'None',
        priority:  priority ? +priority: 1,
        status:'Not Solved',
        questionContent: {}
    }

    if(questionContentData){
        baseQuery.questionContent = {create: questionContentData }
    }


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




 export const createReply = async(defaultData: Array<questionDataEntry>,  replyContentData: Array<questionDataEntry>, userId: string, questionId: string) => {
    

    const baseQuery = {
        userId: userId,
        questionId: questionId,
        title:  defaultData[0].content || '',
        description:defaultData[1].content || '',
        upvotes: 0,
        downvotes: 0,
        replyContent: {}
    }

    if(replyContentData){
        baseQuery.replyContent = {create: replyContentData }
    }

    console.log('base query below is: ')
    console.log(baseQuery)

    try{
        
        await prisma.replies.create({ data: baseQuery}) 
        
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



 