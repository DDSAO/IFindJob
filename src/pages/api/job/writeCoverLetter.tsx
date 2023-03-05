// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { client, verifyToken } from "@/lib/db";
import { getCookie } from "cookies-next";
import { Configuration, OpenAIApi } from "openai";

import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).send({ message: "Only POST requests allowed" });
  }

  let token = getCookie("token", { req, res });
  let user = await verifyToken(token ? token.toString() : null);
  if (!user) return res.status(200).json({ ok: 0, error: "Token expired" });

  let { job } = req.body;

  await client.connect();

  //BUSINESS LOGICS

  console.log("hi");

  // const configuration = new Configuration({
  //   apiKey: process.env.OPENAI_API_KEY,
  // });
  // const openai = new OpenAIApi(configuration);
  // const response = await openai.createCompletion({
  //   model: "gpt-3.5-turbo",
  //   messages: [{ role: "user", content: "Hello!" }],
  //   temperature: 0,
  //   // max_tokens: 7,
  // });
  console.log(`Bearer ${process.env.OPENAI_API_KEY}`);
  try {
    let response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: "Hello!" }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );
    console.log(response.data.choices);
  } catch (e) {
    console.log((e as any).response);
  }

  //if error
  //return res.status(200).json({ ok: 0, error: "RMA NOT FOUND" });

  let data = {
    ok: 1,
  };

  return res.status(200).json(data);
}
