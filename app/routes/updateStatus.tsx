import { ActionFunction, LoaderFunction} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { updateStatus } from "~/utils/questionCard.server";


// route responsible for updating status of cards from 'Not Solved' to 'Solved' or vice versa
export const action: ActionFunction = async ({ request }) => {

    const url =  new URL(request.url);

    const cardId = url.searchParams.get('cardId');
    const replyId = url.searchParams.get('replyId');
    const status =  url.searchParams.get('status');


    console.log('incoming status is: ' + status)

    return updateStatus(request, cardId, replyId, status);
   
};
//export const loader: LoaderFunction = async ({ request }) =>flashMessage(request, "Successfully deleted card", "/questions", true);
export const loader: LoaderFunction = async ({ request }) =>  redirect('/questions');