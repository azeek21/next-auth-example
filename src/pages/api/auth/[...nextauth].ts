import NextAuth from "next-auth/next"
import GitHubProvider from "next-auth/providers/github"

// import mongodb adapter and client promise.
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";

console.log(process.env.GITHUB_SECRET);

export default NextAuth({
    // auth providers like github, google, apple
    providers: [
        GitHubProvider({
            // you get these below from github read more on readme of this repo
            clientId: process.env.GITHUB_ID || "",
            clientSecret: process.env.GITHUB_SECRET || "",
        }),
    ],
    // add adapeter
    adapter: MongoDBAdapter(clientPromise),
    session: {
        strategy: "jwt",
    },
    jwt: {
        secret: "turieokdmfjghutridfkjguirodkcvjg;fe"
    }
})
