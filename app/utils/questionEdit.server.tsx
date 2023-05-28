import { questionDataEntry } from "./types.server";
import { prisma } from './prisma.server';
import { redirect, json, createCookieSessionStorage } from "@remix-run/node";


export const  editQuestion = async(defaultData: Array<questionDataEntry>,  questionContentData: Array<questionDataEntry>, userId: string, questionId: string) => {
    
    const priority = (defaultData.find(elm => elm.type === 'priority')?.content);
    const category = (defaultData.find(elm => elm.type === 'category')?.content);
    const status   = (defaultData.find(elm => elm.type === 'status')?.content);

    try{    

        if(questionContentData && questionContentData.length > 0){
            await prisma.questions.update({
                where:{id: questionId}, 
                data:{  
                    title:  defaultData[0].content || '',
                    description:defaultData[1].content || '',
                    category: category || 'None',
                    priority:  priority ? +priority: 1,
                    status: status ? status: 'Not Solved',
                    questionContent:{
                        deleteMany: {questionId: questionId},
                        createMany: {
                            data: questionContentData 
                        }
                    }
                }
            }) 
        } else {
            await prisma.questions.update({
                where:{id: questionId}, 
                data:{  
                    title:  defaultData[0].content || '',
                    description:defaultData[1].content || '',
                    category: category || 'None',
                    priority:  priority ? +priority: 1,
                    status: status ? status: 'Not Solved',
                    questionContent:{
                        deleteMany: {questionId: questionId},
                    }
                }
            }) 
        }

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



 export const  editReply = async(defaultData: Array<questionDataEntry>,  questionContentData: Array<questionDataEntry>,   cardId:string,  replyId: string) => {
    
    console.log('IN EDIT REPLY')

    console.log(replyId)
    
    
    try{

        if(questionContentData && questionContentData.length > 0 ){
            await prisma.replies.update({
                where:{id: replyId}, 
                data:{  
                    title:  defaultData[0].content || '',
                    description:defaultData[1].content || '',
                    replyContent:{
                        deleteMany: {replyId: replyId},
                        createMany: {
                            data: questionContentData 
                        }
                    }
                }
            }) 
        } else {
            await prisma.replies.update({
                where:{id: replyId}, 
                data:{  
                    title:  defaultData[0].content || '',
                    description: defaultData[1].content || '',
                    replyContent:{
                        deleteMany: {replyId: replyId}
                    }
                }
            }) 
        }
      

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