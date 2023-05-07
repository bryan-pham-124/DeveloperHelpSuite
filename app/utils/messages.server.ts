import { redirect } from "@remix-run/node";
import { getUserSession } from "./auth.server";
import { storage } from "./auth.server";



export const flashMessage = async (request: Request, message: string, redirectPage: string) => {
    const session = await getUserSession(request);
    session.flash("message",  message);
   
    return redirect( redirectPage, {
        headers: {
            "Set-Cookie": await storage.commitSession(session),
        },
    });
}



 