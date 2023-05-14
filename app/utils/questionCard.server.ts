
import { flashMessage } from './messages.server';
import { prisma } from './prisma.server'


export const getQuestionById = async(id: string) => {
    return await prisma.questions.findUnique({
      where: {id}, 
      include: {
         questionContent : true
      }
   });
 }

 
 

 export const getUserById = async(id: string) => {
    return await prisma.user.findUnique({where: {id}, select:{id: true, name: true}});
 }
 

 export const deleteCardById = async(request: Request, id: string, userId: string, authorId: string) => {

   if(userId === authorId ){

      try {

         await prisma.questions.delete({where:{id}});
   
         return flashMessage(request, "Successfully deleted card", "/questions", true);
   
      } catch(e) {   
         console.log(e);
         return flashMessage(request, "Could not delete card", "/questions", false);
         
      }

   }  else {

      return flashMessage(request, "You cannot delete this card. You are not the author", "/questions", false);

   }

  
   
}


