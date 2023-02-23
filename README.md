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
