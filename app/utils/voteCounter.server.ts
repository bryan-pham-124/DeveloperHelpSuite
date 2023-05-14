import { redirect } from '@remix-run/node';
import { prisma } from './prisma.server'




export const testString = async () => {
    return 'This is a test string'
}
 

export const updateVotes = async (id: string, counter: string, votes: number, redirectTo: string) => {


    return 'meep meep';


    /*

    const updateCounter =  await prisma.questions.update({
        where: {id}, 
        data: {
            [counter]: votes,
        }
    })

    console.log(
        'UPDATE OCCURED'
    )

    return redirect(redirectTo);
    */

}