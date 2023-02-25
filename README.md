# Authentication in NextJs with NextAuth.js
*   As the original learning project kindo got too big, I started a brand new project to learn authentication.
*   Here We'll be learning all about authentication only.

## Installing and Setup
1. Install NextAuth.js with: ```yarn add next-auth``` or ```npm install next-auth```
2. In `./src/pages/api/auth/` folder create a catch all routes file named ```[...nextauth].ts``` <br/>
Put code below in it: ```./src/pages/api/auth/[...nextauth].ts```

```
import NextAuth from "next-auth/next"
import GitHubProvider from "next-auth/providers/github"

export default NextAuth({
    // auth providers like github, google, apple
    providers: [
        GitHubProvider({
            // you get these below from github read more on readme of this repo
            clientId: process.env.GITHUB_ID || "",
            clientSecret: process.env.GITHUB_SECRET || "",
        }),
    ]
})
```
Inside providers array, you can specify one or many authentication providers. <br/>
I am using GitHub in my case. <br/>
3. Get your `clientId` and `clientSecret` from `github -> settings -> developer settings -> Oauth apps -> NewOauthApp -> fill needed info -> grab your keys `
4. Put your secret key's inside `.env.local`,and use them inside `[...nextauth].ts` file.
5. Now if you go to `http://localhost:300/api/auth/signin` you'll be welcomed by nextJs builtin signin page, and for singout you can just go to `http://localhost:300/api/auth/signin`. <br/>

Now we have the singin and signout set up, we can't expect user to enter the links manually. Let's learn how to sign up and signout with buttons...
## Signin and Signout with buttons
1. Import `{signIn, signOut}` from `'next-auth/react'` package.
    * `singIn` function takes an otpional string of provider id. and if specified skips goin to builtin nextauth page and directly proceeds to sign the user in with provider specified in argument. <br/>
    e.g: if you have like 3 providers but this time you only want to sign user in with `github` you can call `signIn("github")` and user will be take directly to github signin page skipping nextauth page.

    - <i> up until version 4 of nextauth singIn and signOut packages has been in 'next-auth/client' package so be careful with your versions. 
    </i>
2. above ar pure functions, wich means you can use them to sing users in and out with handling onClick events. <br/>
Example: `./src/components/navbar.tsx`
```
import Link from "next/link";
import {signIn, signOut} from 'next-auth/react'

export default function Navbar() {

    return (
        <nav>
            <Link href="/" > HOME </Link>

            <Link href="/api/auth/signin" onClick={(ev) => {
                ev.preventDefault();
                signIn();
            }} > SIGN IN </Link>

            <Link href="/api/auth/signout" onClick={(ev) => {
                ev.preventDefault();
                signOut();
            }} > SIGN OUT </Link>

        </nav>
    )
}
```

## useSession   
## Client side authentication (checking user authentication state)
* Showing or hiding content based on user is looged in or not.
### useSession
* NextAuth library has a `hook` named `useSession()` wich returns a `data` wich contains `user data` and `status` wich can be `"authenticated" | "unauthenticated" | "loading"`;

* Depending on the state and data `useSession()` provided we can do conditional rendering.

NOTE: to use `useSession()` hook you NEED to add  `sessionProvider()` at the top level of your pages. Look at `./src/pages/_app.tsx` for my example.

Example: `./src/components/navbar.tsx` : above basic conditionalr rendering of sign in and out buttons depending on the state of the user :arrow_down:
```
import { useSession, signIn, signOut } from "next-auth/react"

export default function Navbar() {
    const {data, state} = useState();


    return (
        { state === "authenticated" && 
        <button onClick={() => {signOut()}} > Sign Out </button>
        }

        { state === "unauthenticated" &&
        <button onClick={() => {signIn()}} > Sign In </button>
        }
    )
}
```
## Securing pages | getSession
* As of now, our app has no page has no page protection dependign on user is authenticated or not. Now let's secure it.
1. Import `getSession()` from `"next-auth/react"` package
2. Check inside `useEffect` if session exists or not. 
    - <i>NOTE: `getSession` is a `asynchronous` function so make sure to `await` it to get the actual session.</i>
    - implement a loading state so that you can show a loader instead of actual page if user is not signed in.
    - return that loading page instead of actual page while `session` is not ready or loading.

3. Redirect/prompt user to sign in (page) if `session` returned by `await getSession()` is a falsy value or show the actual page.

NOTE: You may think just hiding the link or button that takes to our page is enough, but don't forget there's always an option for anyone to make a request to our page directly from anywere. so securing page itself makes it so much more secure and more independent from other sources when it comes to security. <br/>

Example: `./src/pages/dashboard.tsx` :arrow_down:
```
import { getSession, signIn } from "next-auth/react"
import { useState, useEffect } from "react"

export default function Dashboard() {
    // our loading state
    const [loading, setLoading] = useState(true)
    
    useEffect( () => {
        const securePage = async () => {
            const session = await getSession();
            if (!session) {
                signIn();
            } else {
                setLoading(false);
            }
        }

        securePage();
    });

    if (loading) {
        return <h1> Loading... </h1>
    }

    return <h1> Actual Dashboard Page </h1>
}
```
 
## sessionProvider
* helps to share session across all `useSession()` hooks with the help of `useContext()` under the hood so that every page that uses `useSession()` doesn't have to make a request to server or provider.
HOWTO: In `_app.tsx` import `SessionProvider` from `"next-auth/react"` and wrap child components around it, and tjihat's it. <br/>
* you can than use tour session anywhere just by calling `useSession()`. For client side page securing or others.

Example: `./src/pages/_app.tsx`

```
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
        {/* NextAuth sessionProvider */}
        <SessionProvider>
          <Header />
          <Component {...pageProps} />
        </SessionProvider>
    </>
  );
}
```
Example: `./src/pages/dashboard.tsx`
```

import ButtonLoader from "@/components/loaders/button-loader";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const {data, status} = useSession();
  const [loading, setLoading] = useState(status == 'loading');
  const router = useRouter();

  useEffect(() => {
    if (status !== 'loading' && status === 'unauthenticated') {
      signIn('github');
    }
    if (status === "authenticated") {
      setLoading(false)
    }

  }, [status])

  if (loading) {
    return (
      <div>
        <ButtonLoader loading={loading}>
          <h1>Loading ...</h1>
        </ButtonLoader>
      </div>
    );
  }

  return <h1>Dashboard page for {data?.user?.name}</h1>;
}
```

# server side authentication
* with the help of this we can decide on what props will be passed to component from `getServerSideProps()` functoin. Like paid/subscriber only things if user is logged in and free stuff if not
HOWTO: just by using `getSession()` we used earlier to secure pages client side. <br/>
`getSession()` returns an `Promise<session>` and by awaiting it and looking at session object we can manage what will be sent to client from server aka getServerSideProps. <br/>
Example: `./src/pages/blog.tsx`
```
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
            data: session ? 'List of 100 paid blog posts' : 'list of free blog posts'
        }
    }   
}
```

* Wait, we are already authenticating user server side, right ? and `SessionProvider` also makes a request from client side to get and store the session. Wouldn't it be cool if we can authenticate user once in the server and make `SessionProvider` use that session from the server insteat of making another request. Well, you know, nextJs does cool things and yes we can do that.
* We can pass session object we used in the server to authenticate user to `SessionProvider` to avoit additional request from client side.
HOWTO: we can return `session` object inside `props{}` we return from `getServerSideProps()` function and parse it in `_app.tsx` and supply the `session` object to `SessionProvider` in main App component.
Example: `./src/pages/_app.tsx`
```
import type { AppProps } from "next/app";
import Header from "@/components/header";
// authentication
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
        {/* NextAuth sessionProvider */}
        <SessionProvider session={pageProps?.session}>
          <Header />
          <Component {...pageProps} />
        </SessionProvider>
    </>
  );
}
```
  - This way we can tell `SessionProvider` not to make an additional request and use the one we supplied as initial session.
* And we return session like below from `getServerSideProps` <br/>
Example: `./src/pages/blog.tsx`
```
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
```
## server side securing pages
* from `getServerSideProps` of the page, we can check if user is logged in or not looking at `session` object returned by `getSession()`. and if user is not logged in we can return a redirect object instead of props.
Example: `./src/pages/blog.tsx`
```
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

    // SECURING PAGE HERE
    // if user is not logged in, we redirect user to login page...
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
```

# securing api routes
securing an api route is also almost the same as securing pages.

1. Inside any api handler, just call the `getSession({req})` and check if session exists. <br/>
    NOTE: `getSession()` function should be supplied the request inside curly braces to extract session from request object. SO dont forget it. <br/>
    ```getSession({req})```
2. Respont according to `session` data that getSession() returned.
3. For specific user permissions, You can check session data, as it will have user email, id or smth similar, you can act according to it. <br/>

Example: `./src/pages/api/test-session.ts`
```
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function handelr(req: NextApiRequest, res: NextApiResponse)  {
    const sessoion = await getSession({req});
    if (!sessoion) {
        res.status(401).json({error: "Unauthenticated user"});
    } else {
        res.status(200).json({message: "Sucess", sessoion})
    }
}
```

# connnecting to a database. 
1.  go to <a href="https://cloud.mongodb.com"> MongoDb website </a> and create a databse.
2. Install mongodb database locally to your project -> `yarn add mongodb` or `npm install mongodb` if you use npm.
3. Add mongodb related config to `.env.local` file.
    - Your username for mongodb database.   | DB_USER
    - Your password for mongodb databaes.   | DB_PASSWORD
    - Your connection url for mongodb database | MONGODB_URI
        - <i> You can get it in mongodb website -> databses -> your databse -> connect -> connect yor application -> connection string. Note: Don't worget to replace your password and username in connection string if needed.</i> <br/>
4. Add `mongodb` adapter from next-auth website. | ```yarn add @next-auth/mongodb-adapter ```
5. Create `./src/lib/mongodb.ts` file and copy and paste code from <a href="https://next-auth.js.org/adapters/mongodb"> https://next-auth.js.org/adapters/mongodb </a>

    - Make sure inside the code the all instances of `MONGODB_URI` matches your mongodb connection string variable name from your   `.env.local` file.
6. in `./src/pages/api/auth/[...nextauth].ts` import mongodb adapter and `clientPromise` from `./src/lib/mongodb.ts` file you created earlier.
7. set session and jwt settings in `./src/pages/auth/[...nextauth].ts` file. as I did in that file. you can go check it out.
    - NOTE: for now I set jwt secret to any random string, actually, I let my cat type that for me :smile: <br/>

<b> FILES TO CHECK OUT: `./src/pages/api/auth/[...nextauth].ts` and `./src/lib/mogodb.ts` </b>

NOW WE ARE ALL SET.
1. Go mongodb website and browser your databse data (collection), should be empty.
2. start your app and log in. 
3. Check out database again (refresh), now you can see a new user.  <br/>

CONGRATULATIONS, you did it.
