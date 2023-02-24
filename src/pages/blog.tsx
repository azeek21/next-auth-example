import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { getSession } from "next-auth/react";

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

    if (!session) {
        return {
            redirect: {
                destination: '/api/auth/signin?callbackUrl=http://localhost:3000/blog',
                permanent: false,
            }
        }
    }

    return {
        props: {
            // this session will be parsed and passed to SessionProvider inside _app.tsx
            session: session,
            data: session ? ctx.resolvedUrl : 'list of free blog posts'
        }
    }
}
