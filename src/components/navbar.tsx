import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";
import ButtonLoader from "./loaders/button-loader";
// singin and signout with buttons
// from nextauth 4.*, singIn and signOut methods are in 'next-auth/react` not in 'next-auth/client`
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import NavbarLink from "./navbar-link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { data: SES, status: SESstatus } = useSession();
  const [loading, SetLoading] = useState(false);

  return (
    <nav>
      <StyledNavbar>
        <NavbarLink href="/" name="HOME" />
        <NavbarLink href="/dashboard" name="DASHBOARD" />
        <NavbarLink href="/blog" name="BLOG" />

        {/* SINGIN */}
        {SESstatus === "loading" || SESstatus === "unauthenticated" || loading ? (
          <ButtonLoader loading={loading}>
            <NavbarLink
              href="/api/auth/signin"
              name="SIGN IN"
              clickHandler={() => {
                SetLoading(true);
                signIn('github')
              }
            }
            />
          </ButtonLoader>
        ) : (
          ""
        )}

        {/* SIGNOUT */}
        {SESstatus === "authenticated" ? (
          <ButtonLoader loading={loading}>
            <NavbarLink
              href="/api/auth/signout"
              name="SIGN OUT"
              clickHandler={() => {
                SetLoading(true);
                signOut();
              }}
            />
          </ButtonLoader>
        ) : (
          ""
        )}
      </StyledNavbar>
    </nav>
  );
}

const StyledNavbar = styled.ul`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--padding-gigant);
`;
