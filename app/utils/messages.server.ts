import { redirect } from "@remix-run/node";
import { getUserSession } from "./auth.server";
import { storage } from "./auth.server";



export const flashMessage = async (request: Request, message: string, redirectPage: string, success: boolean) => {
    const session = await getUserSession(request);
    const returnMessage = success ? 'Success: ' + message: 'Error: ' + message;

    session.flash("message", returnMessage);
   
    return redirect( redirectPage, {
        headers: {
            "Set-Cookie": await storage.commitSession(session),
        },
    });
}



 export const clearMessage = async (session: any) => {
       
    return { "Set-Cookie": await storage.commitSession(session)}

 }