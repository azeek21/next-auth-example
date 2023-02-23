import { THEME_TYPE } from "@/styles/theme/theme"
import styled from "styled-components"

export default function Index() {

    return (
        // <Title>Hello this is my Template Index Home</Title>
        <h1>Welcome to NextAuth page</h1>
    )
}

const Title = styled.h2`
    color: ${({theme}) => theme.textColor.primary};
    text-align: center;
    padding: var(--padding-big);
    font-size: var(--fs-2xl);
`