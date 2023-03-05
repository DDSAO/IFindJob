// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { client, UserCollection, verifyToken } from "@/lib/db";
import { getCookie } from "cookies-next";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).send({ message: "Only POST requests allowed" });
  }

  let token = getCookie("token", { req, res });
  let connectedUser = await verifyToken(token ? token.toString() : null);
  if (!connectedUser)
    return res.status(200).json({ ok: 0, error: "Token expired" });

  let { user } = req.body;

  await UserCollection.updateOne(
    { id: user.id },
    {
      $set: {
        name: user.name ?? null,
        degree: user.degree ?? null,
        workExperience: user.workExperience ?? null,
        awards: user.awards ?? null,
        techStacks: user.techStacks ?? null,
        introduction: user.introduction ?? null,
      },
    }
  );

  await client.connect();

  //BUSINESS LOGICS

  //if error
  //return res.status(200).json({ ok: 0, error: "RMA NOT FOUND" });

  let data = {
    ok: 1,
    data: {
      user: await UserCollection.findOne({ id: user.id }),
    },
  };

  return res.status(200).json(data);
}
