import type { AppProps } from "next/app";
import THEME from "@/styles/theme/theme";
import { ThemeProvider } from "styled-components";
import { GlobalStyle } from "@/styles/global";
import Header from "@/components/header";
// authentication
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ThemeProvider theme={THEME["light"]}>
        <GlobalStyle />

        {/* NextAuth sessionProvider */}
        <SessionProvider session={pageProps?.session}>
          <Header />
          <Component {...pageProps} />
        </SessionProvider>
      </ThemeProvider>
    </>
  );
}
