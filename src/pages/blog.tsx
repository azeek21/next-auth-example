import { GetServerSidePropsContext } from "next";
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

    return {
        props: {
            // this session will be parsed and passed to SessionProvider inside _app.tsx
            session: session,
            data: session ? 'List of 100 paid blog posts' : 'list of free blog posts'
        }
    }
}
