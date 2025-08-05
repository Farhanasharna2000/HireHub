import { MongoClient, ServerApiVersion } from "mongodb"

export const collectionNamesObj={
  usersCollection:'users',
}
interface MongoConfig{
  serverApi: {
        version: ServerApiVersion,
        strict: boolean,
        deprecationErrors: boolean,
      }   
}
export default function dbConnect(collectionName:string){

    const uri =process.env.NEXT_PUBLIC_MONGODB_URI as string;
    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    } as MongoConfig);
    return client.db(process.env.DB_NAME as string).collection(collectionName)
}