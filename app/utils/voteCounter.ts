import { redirect } from '@remix-run/node';
import { prisma } from './prisma.server'
import { flashMessage } from './messages.server';


export const updateVotes = async (request: Request, id: string, counter: string, redirectTo: string) => {


    const totalVotes =  await prisma.questions.findUnique({
        where: {id}, 
        select: {
            upvotes: true,
            downvotes: true,
            currentVoteToggle: true
        }
    })


    if(!totalVotes || totalVotes.upvotes === null || totalVotes.downvotes === null || totalVotes.currentVoteToggle === null){
        return flashMessage(request, 'Could not update votes', redirectTo, false)
    }


    let query:{'upvotes'?: number, 'downvotes'?: number,  currentVoteToggle: string }  = {
        'upvotes' : totalVotes.upvotes,
        'downvotes' : totalVotes.upvotes,
        currentVoteToggle: counter
    }

    
    if(counter === 'upvotes' &&  totalVotes.currentVoteToggle ==='downvotes' ){
        query['upvotes'] = totalVotes.upvotes + 1;
        query['downvotes'] = totalVotes.downvotes -1;

    } 

    else if(counter === 'upvotes' &&   totalVotes.currentVoteToggle !=='upvotes'){
        query['upvotes'] = totalVotes.upvotes + 1;
    } 

    else if(counter === 'downvotes' &&   totalVotes.currentVoteToggle ==='upvotes'){
        query['downvotes'] = totalVotes.downvotes + 1;
        query['upvotes'] = totalVotes.upvotes - 1;
    } 

    else if(counter === 'downvotes' &&   totalVotes.currentVoteToggle !=='downvotes') {
        query['downvotes'] = totalVotes.downvotes + 1;
    }

    else if(counter === 'upvotes' &&  totalVotes.currentVoteToggle === 'upvotes'){
        return flashMessage(request, 'You cannot upvote more than once.', redirectTo, false)
    }

    else if(counter === 'downvotes' &&  totalVotes.currentVoteToggle === 'downvotes'){
        return flashMessage(request, 'You cannot downvote more than once.', redirectTo, false)
    }

    await prisma.questions.update({
        where: {id}, 
        data: query
    })

    return flashMessage(request, 'Successfully updated votes', redirectTo, true)

}