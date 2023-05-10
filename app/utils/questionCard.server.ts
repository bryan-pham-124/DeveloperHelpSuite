
import { prisma } from './prisma.server'


export const getQuestionById = async(id: string) => {
    return await prisma.questions.findUnique({where: {id}});
 }
 

 export const getUserById = async(id: string) => {
    return await prisma.user.findUnique({where: {id}, select:{name: true}});
 }
 