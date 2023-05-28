import { ActionFunction, LoaderFunction, json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { updateVotes } from "~/utils/voteCounter";


//route responsible for updating votes for a question or reply
export const action: ActionFunction = async ({ request }) => {

    const url =  new URL(request.url);

    const cardId = url.searchParams.get('cardId') + '';
    const tableName = url.searchParams.get('tableName') + '';
    const replyId = url.searchParams.get('replyId') + '';


    const form = await request.formData();
    const userId = form.get('userId') + '';
    const currentVoteStatus = form.get('currentVoteStatus') + '';

    console.log(tableName)
    const voteCardId = (tableName  === 'question') ?  cardId: replyId;


    //console.log('card id: ' + cardId)
    console.log('vote card id: ' + voteCardId)


    return updateVotes(request, voteCardId, currentVoteStatus, `/questionCard?cardId=${cardId}`, userId, tableName )
};

export const loader: LoaderFunction = async ({ request }) => {

    const url = new URL(request.url);
    const cardId = url.searchParams.get('cardId') + '';

    return redirect(`/questionCard?cardId=${cardId}`)
};