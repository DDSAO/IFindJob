// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { client, JobCollection, UserCollection, verifyToken } from "@/lib/db";
import { getSerialId } from "@/lib/helper";
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

  let { job } = req.body;

  await client.connect();

  //BUSINESS LOGICS
  let id = await getSerialId("job");

  await JobCollection.insertOne({
    id,
    jobDescription: job.jobDescription ?? null,
    company: job.company ?? null,
    position: job.position ?? null,
  });

  //if error
  //return res.status(200).json({ ok: 0, error: "RMA NOT FOUND" });

  let data = {
    ok: 1,
    data: {
      job: await JobCollection.findOne({ id }),
    },
  };

  return res.status(200).json(data);
}
