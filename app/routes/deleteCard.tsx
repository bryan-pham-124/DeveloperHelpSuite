import { ActionFunction, LoaderFunction, json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { logout } from "~/utils/auth.server";
import { flashMessage } from "~/utils/messages.server";
import { deleteCardById } from "~/utils/questionCard.server";

export const action: ActionFunction = async ({ request }) => {
    const url =  new URL(request.url);
    const userId = url.searchParams.get('userId');
    const cardId = url.searchParams.get('cardId');
    const authorId = url.searchParams.get('authorId');

    return deleteCardById(request, cardId || '', userId || '', authorId || '')
};
//export const loader: LoaderFunction = async ({ request }) =>flashMessage(request, "Successfully deleted card", "/questions", true);
export const loader: LoaderFunction = async ({ request }) =>  redirect('/questions');