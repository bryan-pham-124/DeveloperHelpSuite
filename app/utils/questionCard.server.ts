
import { flashMessage } from './messages.server';
import { prisma } from './prisma.server'


export const getQuestionById = async(id: string) => {
    return await prisma.questions.findUnique({
      where: {id}, 
      include: {
         questionContent : true,
      }
   });
 }

 
export const getUserById = async(id: string) => await prisma.user.findUnique({where: {id}, select:{id: true, name: true}});
 
 
export const deleteCardById = async(
      request: Request,
      cardId: string, 
      userId: string, 
      authorId: string, 
      isReply: boolean,  
      replyId: string
) => {

   if(userId === authorId ){

      try {

         if(!isReply){

            await prisma.questions.delete({where:{id: cardId}});

            return flashMessage(request, "Successfully deleted card", "/questions", true);

         } else {

            await prisma.replies.delete({where:{id: replyId}});

            return flashMessage(request, "Successfully deleted reply", `/questionCard?cardId=${cardId}`, true);

         }
   
    
      } catch(e) {   
         
         console.log(e);
         return flashMessage(request, "Could not delete card or reply", "/questions", false);
         
      }

   }  else {

      return flashMessage(request, "You cannot delete this card or reply. You are not the author", "/questions", false);

   }

}


export const getUserVotesInfo = async (userId: string, cardId: string) => prisma.userVotes.findUnique({
   where:  {
      uniqueUserVoteId: {
         userId: userId,
         questionId: cardId
      }
   }
});


export const getReplyById = async(id: string) => {
   return await prisma.replies.findUnique({
     where: {id}, 
     include: {
        replyContent : true,
     }
  });
}


export const getRepliesUserVotesInfo = async (userId: string, replyId: string) => prisma.repliesUserVotes.findUnique({
   where:  {
      uniqueRepliesUserVoteId: {
         userId: userId,
         replyId: replyId
      }
   }
});
 

export const getReplies = async(cardId: string) => await prisma.replies.findMany({
    where: { questionId: cardId}, 
    include:{
      replyContent: true,
      repliesUserVotes: true,
      user: {
         select: {
            name: true
         }
      }
    }
})


export const getRepliesVotesInfo = async (userId: string, replyId: string) => prisma.repliesUserVotes.findUnique({
   where: {
      uniqueRepliesUserVoteId: {
         userId: userId,
         replyId: replyId
      }
   }
});



export const updateStatus = async (request: Request, cardId: string | null, replyId: string | null, status: string | null) => {

   if(!cardId || !replyId || !status){
       return flashMessage(request, "Could not get card info. Please try again.",  `/questionCard?cardId=${cardId}`, false);
   }


   console.log('status inside prisma is: ' + status)
   console.log('replyId ' + replyId);
   console.log('cardId ' + cardId);

   // code below updates status of questions and replies to new status
   
   return await prisma.$transaction(async (tx) => {

      try {

         await prisma.questions.update({
            where: {id: cardId},
            data:  {status: status === 'NotSolved' ? 'Not Solved': 'Solved'}
         });

         // reset all to false because we only have one preferred answer.
         await prisma.replies.updateMany({
            where: {preferredAnswer: true},
            data:  {preferredAnswer: false}
         });

         await prisma.replies.update({
            where: {id: replyId},
            data:  {preferredAnswer: status === 'Solved'}
         });
         
         return flashMessage(request, `Answer has been marked "${status}"`,  `/questionCard?cardId=${cardId}`, true);

      } catch(e){

         console.log(e);
         return flashMessage(request, "Could not change card status. Please try again.",  `/questionCard?cardId=${cardId}`, false);

      }
     
   })


}


