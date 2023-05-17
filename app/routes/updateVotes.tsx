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

    const currentVoteStatus = form.get('currentVoteStatus') + '';

    return updateVotes(request, cardId, currentVoteStatus, `/questionCard?cardId=${cardId}` )
};
//export const loader: LoaderFunction = async ({ request }) =>flashMessage(request, "Successfully deleted card", "/questions", true);
export const loader: LoaderFunction = async ({ request }) =>  redirect('/questions');