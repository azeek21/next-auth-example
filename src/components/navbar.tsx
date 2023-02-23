import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";
// singin and signout with buttons
// from nextauth 4.*, singIn and signOut methods are in 'next-auth/react` not in 'next-auth/client`
import {signIn, signOut} from 'next-auth/react'


function NavbarLink({href, name, clickHandler}: {href: string, name: string, clickHandler?: () => void}) {
    const router = useRouter();

    const my_path = router.asPath;

    return (
        <StyledNavbarLink color="red" active={href === my_path}>
            <Link href={href} onClick={(ev) => {
                if (clickHandler) {
                    ev.preventDefault()
                    clickHandler();
                }
        }}> {name} </Link>
        </StyledNavbarLink>
    )
}


export default function Navbar() {

    const router = useRouter();

    return (
        <nav>
            <StyledNavbar>

                <NavbarLink href="/" name="HOME" />
                <NavbarLink href="/dashboard" name="DASHBOARD" />
                <NavbarLink href="/blog" name="BLOG" />
                <NavbarLink href="/api/auth/signin" name="SIGN IN" clickHandler = {() => {signIn()}}/>
                <NavbarLink href="/api/auth/signout" name="SIGN OUT" clickHandler = {() => {signOut()}}/>
                
            </StyledNavbar>
        </nav>
    )
}

const StyledNavbarLink = styled.li`
    & a {
        color: ${(props) => props.active ? props.theme.textColor.primary : props.theme.textColor.secondary};
        text-decoration: none;
        font-weight: ${props => props.active ? '500' : 'normal'};
        &:hover{
            color: ${({theme}) => theme.textColor.primary};
            text-shadow: ${({theme}) => theme.shadow.tertiary};
        }
    }
`

const StyledNavbar = styled.ul`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: var(--padding-gigant);
`