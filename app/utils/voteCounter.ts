import { redirect } from '@remix-run/node';
import { prisma } from './prisma.server'
import { flashMessage } from './messages.server';




export const updateVotes = async (request: Request, cardId: string, counter: string, redirectTo: string, userId: string) => {

    
    const userVotesInfo = await prisma.userVotes.findFirst({where: {userId: userId}})
   
    console.log('User Info is');
    console.log(userVotesInfo)

    if(!userVotesInfo){
        await prisma.userVotes.create({
            data:{
                userId: userId,
                questionId: cardId,
                currentVoteToggle: counter
            }
        })
    } else {
        await prisma.userVotes.update({
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


    return null;

    const totalVotes =  await prisma.questions.findUnique({
        where: {cardId}, 
        select: {
            upvotes: true,
            downvotes: true,
            currentVoteToggle: true
        }
    })


    if(!totalVotes || totalVotes.upvotes === null || totalVotes.downvotes === null || userVotesInfo.currentVoteToggle === null){
        return flashMessage(request, 'Could not update votes', redirectTo, false)
    }


    let query:{'upvotes'?: number, 'downvotes'?: number,  currentVoteToggle: string }  = {
        'upvotes' : totalVotes.upvotes,
        'downvotes' : totalVotes.upvotes,
        currentVoteToggle: counter
    }

    
    if(counter === 'upvotes' &&  userVotesInfo.currentVoteToggle ==='downvotes' ){
        query['upvotes'] = totalVotes.upvotes + 1;
        query['downvotes'] = totalVotes.downvotes -1;

    } 

    else if(counter === 'upvotes' &&  userVotesInfo.currentVoteToggle !=='upvotes'){
        query['upvotes'] = totalVotes.upvotes + 1;
    } 

    else if(counter === 'downvotes' &&   userVotesInfo.currentVoteToggle ==='upvotes'){
        query['downvotes'] = totalVotes.downvotes + 1;
        query['upvotes'] = totalVotes.upvotes - 1;
    } 

    else if(counter === 'downvotes' &&   userVotesInfo.currentVoteToggle !=='downvotes') {
        query['downvotes'] = totalVotes.downvotes + 1;
    }

    else if(counter === 'upvotes' &&  userVotesInfo.currentVoteToggle === 'upvotes'){
        return flashMessage(request, 'You cannot upvote more than once.', redirectTo, false)
    }

    else if(counter === 'downvotes' &&  userVotesInfo.currentVoteToggle === 'downvotes'){
        return flashMessage(request, 'You cannot downvote more than once.', redirectTo, false)
    }

    await prisma.questions.update({
        where: {cardId}, 
        data: query
    })

    return flashMessage(request, 'Successfully updated votes', redirectTo, true)

}