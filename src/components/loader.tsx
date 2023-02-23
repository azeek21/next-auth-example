import styled, { keyframes } from "styled-components"

export default function Loader() {

    return (
        <StyledLoader>
            <div></div>
        </StyledLoader>
    )
}

const spin = keyframes`
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
`

const StyledLoader = styled.span`
    height: 100%;
    width: 100%;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    & div {
        width: 30%;
        aspect-ratio: 1;
        border: 1vmin dotted red;
        border-radius: 50%;
        animation: ${spin} ease-in-out 2s infinite;
        display: inline-lock;
    }
`