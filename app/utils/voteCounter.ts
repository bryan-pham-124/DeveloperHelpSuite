import { redirect } from '@remix-run/node';
import { prisma } from './prisma.server'
import { flashMessage } from './messages.server';



 


export const updateVotes = async (request: Request, cardId: string, counter: string, redirectTo: string, userId: string, tableName: string  ) => {


    console.log('card is: ' + cardId);

    let userVotesInfo: any = null;

    let totalVotes  = null;

    if(tableName === 'questions'){

         userVotesInfo = await prisma.userVotes.findUnique({
            where: {
                uniqueUserVoteId:{
                    userId: userId,
                    questionId: cardId
                }
            }
        });
         
         totalVotes =  await prisma.questions.findUnique({
            where: {id: cardId}, 
            select: {
                upvotes: true,
                downvotes: true,
            }
        })

    }

    
    if(!totalVotes || totalVotes.upvotes === null || totalVotes.downvotes  == null ){
        return flashMessage(request, 'Could not update votes. Could not get question info.', redirectTo, false)
    }  


    console.log('User Info is');
    console.log(userVotesInfo)


    let isNewUserVote = false;

    if(!userVotesInfo){

        isNewUserVote = true;

        await prisma.userVotes.create({
            data:{
                userId: userId,
                questionId: cardId,
                currentVoteToggle: counter
            }
        })

        userVotesInfo = await prisma.userVotes.findUnique({
            where: {
                uniqueUserVoteId:{
                    userId: userId,
                    questionId: cardId
                }
            }
        });

        if( !userVotesInfo || !userVotesInfo.currentVoteToggle ){
            return flashMessage(request, 'Could not update votes. Could not get user vote info.', redirectTo, false)
        }  

    }  
 
    /*
    console.log('Counter is');
    console.log(counter)
    
    console.log('current upvotes are: ');
    console.log(totalVotes);

    console.log('check is: ' + (counter === 'upvotes' &&  (userVotesInfo.currentVoteToggle !=='upvotes' || isNewUserVote)))
    */
    

    let query:{'upvotes'?: number, 'downvotes'?: number}  = {
        'upvotes' : totalVotes.upvotes,
        'downvotes' : totalVotes.downvotes
    }

    
    if(counter === 'upvotes' &&  userVotesInfo.currentVoteToggle ==='downvotes' ){
        query['upvotes'] = totalVotes.upvotes + 1;
        query['downvotes'] = totalVotes.downvotes -1;

    } 

    else if(counter === 'upvotes' &&  (userVotesInfo.currentVoteToggle !=='upvotes' || isNewUserVote)){
        query['upvotes'] = totalVotes.upvotes + 1;
    } 

    else if(counter === 'downvotes' &&   userVotesInfo.currentVoteToggle ==='upvotes'){
        query['downvotes'] = totalVotes.downvotes + 1;
        query['upvotes'] = totalVotes.upvotes - 1;
    } 

    else if(counter === 'downvotes' &&  ( userVotesInfo.currentVoteToggle !=='downvotes' || isNewUserVote)) {
        query['downvotes'] = totalVotes.downvotes + 1;
    }

    else if(counter === 'upvotes' &&  userVotesInfo.currentVoteToggle === 'upvotes' && !isNewUserVote){
        return flashMessage(request, 'You cannot upvote more than once.', redirectTo, false)
    }

    else if(counter === 'downvotes' &&  userVotesInfo.currentVoteToggle === 'downvotes' && !isNewUserVote){
        return flashMessage(request, 'You cannot downvote more than once.', redirectTo, false)
    }
    

    return await prisma.$transaction(async (tx) => {
        
        try {

            if( tableName === 'questions'){
                await tx.questions.update({
                    where: {id: cardId}, 
                    data: query
                })
    
                if(!isNewUserVote ){
                    await tx.userVotes.update({
                        where: {
                            id: userVotesInfo?.id
                        },
                        data:{
                            userId: userId,
                            questionId: cardId,
                            currentVoteToggle: counter
                        }
                    })
                }
            }
          
        
            return flashMessage(request, 'Successfully updated votes', redirectTo, true)

        } catch(e){

            return flashMessage(request, 'Could not update votes. Please try again.', redirectTo, false)

        }
    })

     


}