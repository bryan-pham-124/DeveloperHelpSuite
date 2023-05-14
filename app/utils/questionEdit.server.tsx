import { questionDataEntry } from "./types.server";
import { prisma } from './prisma.server';
import { redirect, json, createCookieSessionStorage } from "@remix-run/node";


export const  editQuestion = async(defaultData: Array<questionDataEntry>,  questionContentData: Array<questionDataEntry>, userId: string, questionId: string) => {
    
    const priority = (defaultData.find(elm => elm.type === 'priority')?.content);
    const category = (defaultData.find(elm => elm.type === 'category')?.content);
    const status   = (defaultData.find(elm => elm.type === 'status')?.content);

    let  contentIdsOnly = [];
    /*

        Solution is here:

        https://stackoverflow.com/questions/72100627/prisma-update-nested-entities-in-a-single-query


        Need to get all ids from question content and delete them.

        Then create entries that were deleted

    */

    try{

        await prisma.questions.update({
            where:{id: questionId}, 
            data:{  
                userId: userId,
                title:  defaultData[0].content || '',
                description:defaultData[1].content || '',
                category: category || 'None',
                priority:  priority ? +priority: 1,
                status: status ? status: 'Not Solved',
               
            }
        }) 

         


        
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
