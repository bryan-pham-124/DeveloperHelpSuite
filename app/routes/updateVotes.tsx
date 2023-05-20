import { ActionFunction, LoaderFunction, json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { logout } from "~/utils/auth.server";
import { flashMessage } from "~/utils/messages.server";
import { deleteCardById } from "~/utils/questionCard.server";
import { updateVotes } from "~/utils/voteCounter";

export const action: ActionFunction = async ({ request }) => {
    const url =  new URL(request.url);

    const cardId = url.searchParams.get('cardId') + '';
    const currentVoteToggle = url.searchParams.get('currentVoteToggle') + '';


    const form = await request.formData();


    const userId = form.get('userId') + '';

    const currentVoteStatus = form.get('currentVoteStatus') + '';

    //console.log('user id: ' + userId);

    //console.log('card id is: ' + cardId);

    console.log('vote status is: ' + currentVoteStatus)

    return updateVotes(request, cardId, currentVoteStatus, `/questionCard?cardId=${cardId}`, userId )
};
//export const loader: LoaderFunction = async ({ request }) =>flashMessage(request, "Successfully deleted card", "/questions", true);
export const loader: LoaderFunction = async ({ request }) =>  redirect('/questions');