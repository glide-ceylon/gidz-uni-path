import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let db;

if (!uri) {
  throw new Error("Please add your MongoDB URI to the .env.local file");
}

export async function connectToDatabase() {
  if (client && db) {
    return { client, db };
  }

  client = await MongoClient.connect(uri, options);
  db = client.db(); // Connect to default database

  return { client, db };
}
