import { ActionFunction, LoaderFunction, json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { logout } from "~/utils/auth.server";
import { flashMessage } from "~/utils/messages.server";
import { deleteCardById } from "~/utils/questionCard.server";


// route that deletes card when a user has the right credentials 
export const action: ActionFunction = async ({ request }) => {
    const url =  new URL(request.url);
    const userId = url.searchParams.get('userId');
    const cardId = url.searchParams.get('cardId');
    const replyId = url.searchParams.get('replyId');
    const authorId = url.searchParams.get('authorId');
    const isReply = url.searchParams.get('isReply');
 
   
    if(!cardId || !authorId || !userId ){
        return null; 
    }  else if(isReply && !replyId ){
        return null; 
    }

    return deleteCardById(request, cardId, userId, authorId, isReply === 'true', replyId  || '' )
};
//export const loader: LoaderFunction = async ({ request }) =>flashMessage(request, "Successfully deleted card", "/questions", true);
export const loader: LoaderFunction = async ({ request }) =>  redirect('/questions');