// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { client, UserCollection } from "@/lib/db";
import { setCookie } from "cookies-next";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).send({ message: "Only POST requests allowed" });
  }

  let { username, password } = req.body;
  await client.connect();
  let user = await UserCollection.findOne({ username });
  if (!user) return res.status(200).json({ ok: 0, error: "user not exists" });
  if (user && user.password === password) {
    setCookie("token", `${username}:${password}`, { req, res });
    return res.status(200).json({ ok: 1, data: { user } });
  } else {
    return res.status(200).json({ ok: 0, error: "password not match" });
  }
}
