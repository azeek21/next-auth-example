import { THEME_TYPE } from "@/styles/theme/theme"
import { useSession } from "next-auth/react"
import styled from "styled-components"

export default function Index() {
    const {data: session, status} = useSession();

    return (
        // <Title>Hello this is my Template Index Home</Title>
        <h1>{session?.user?.name} Welcome to NextAuth page</h1>
    )
}

const Title = styled.h2`
    color: ${({theme}) => theme.textColor.primary};
    text-align: center;
    padding: var(--padding-big);
    font-size: var(--fs-2xl);
`