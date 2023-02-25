import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { getSession, useSession } from "next-auth/react";

export default function Blog({data} : {data: string}) {
    return (
        <>
                <h1>This is blog page</h1>
                <p>{data}</p>
        </>
    )
}
export async function getServerSideProps(ctx: GetServerSidePropsContext) {

    const session = await getSession(ctx);

    return {
        props: {
            // this session will be parsed and passed to SessionProvider inside _app.tsx
            session: session,
            data: session ? "Here will be paid/exclusive content as you are signed in" : 'Free low quality content here, sign in to see exlusive content...'
        }
    }
}
