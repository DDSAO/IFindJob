import { Job } from "@/interfaces/jobDefinition";
import { User } from "@/interfaces/userDefinitions";
import { MongoClient } from "mongodb";

export const client = new MongoClient("mongodb://localhost:27017");

export const UserCollection = client
  .db("IFindJob")
  .collection<User>("UserCollection");

export const IndexCollection = client
  .db("IFindJob")
  .collection("IndexCollection");

export const JobCollection = client
  .db("IFindJob")
  .collection<Job>("JobCollection");

export const verifyToken = async (
  token?: string | null
): Promise<User | null> => {
  if (!token) return null;
  let [username, password] = token.split(":");
  if (username && password) {
    let user = await UserCollection.findOne({ username });
    if (user && user.password === password) return user;
    return null;
  }
  return null;
};
