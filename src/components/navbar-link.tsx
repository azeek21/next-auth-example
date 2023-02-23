import { useRouter } from "next/router";
import Link from "next/link";
import styled from "styled-components";

export default function NavbarLink({
  href,
  name,
  clickHandler,
}: {
  href: string;
  name: string;
  clickHandler?: () => void;
}) {
  const router = useRouter();

  const my_path = router.asPath;

  return (
    <StyledNavbarLink active={href === my_path}>
      <Link
        href={href}
        onClick={(ev) => {
          if (clickHandler) {
            ev.preventDefault();
            clickHandler();
          }
        }}
      >
        {" "}
        {name}{" "}
      </Link>
    </StyledNavbarLink>
  );
}

const StyledNavbarLink = styled.li`
  & a {
    color: ${(props) =>
      props.active
        ? props.theme.textColor.primary
        : props.theme.textColor.secondary};
    text-decoration: none;
    font-weight: ${(props) => (props.active ? "500" : "normal")};
    &:hover {
      color: ${({ theme }) => theme.textColor.primary};
      text-shadow: ${({ theme }) => theme.shadow.tertiary};
    }
  }
`;
