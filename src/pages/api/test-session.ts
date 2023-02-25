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