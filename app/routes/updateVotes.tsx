import { ActionFunction, LoaderFunction, json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { updateVotes } from "~/utils/voteCounter";

export const action: ActionFunction = async ({ request }) => {

    const url =  new URL(request.url);

    const cardId = url.searchParams.get('cardId') + '';
    const tableName = url.searchParams.get('tableName') + '';

    const form = await request.formData();
    const userId = form.get('userId') + '';
    const currentVoteStatus = form.get('currentVoteStatus') + '';

    return updateVotes(request, cardId, currentVoteStatus, `/questionCard?cardId=${cardId}`, userId, tableName )
};
//export const loader: LoaderFunction = async ({ request }) =>flashMessage(request, "Successfully deleted card", "/questions", true);
export const loader: LoaderFunction = async ({ request }) =>  redirect('/questions');