import { MongoClient, Db, ObjectId } from "mongodb";
import type { Collection, CollectionFields } from "../types/Collection";

let mongoClient: MongoClient | null = null;
let theDb: Db | null = null;

const init = async () => {
  const mongoURI = process.env.MONGO_URI;
  const dbName = process.env.MONGO_DBNAME;
  if (!mongoURI || !dbName) {
    throw new Error("MONGO_DB info missing");
  }
  mongoClient = new MongoClient(mongoURI);
  try {
    await mongoClient.connect();
  } catch (error) {
    throw new Error(`Failed to connect to MongoDB: ${error}`);
  }
  theDb = mongoClient.db(dbName);
};

const close = async () => {
  if (mongoClient) {
    await mongoClient.close();
  }
};

const getAllProjectsBasicInfo = async () => {
  if (!mongoClient) {
    await init();
  }
  const allDocs = await theDb?.collection("projects").find({}, { projection: { _id: 1, name: 1, edited_at: 1 } });
  if (!allDocs) {
    return [];
  }
  return allDocs.toArray() as unknown as { _id: ObjectId; name: string; edited_at: Date }[];
};

const getAllInCollection = async <T extends Collection>(collectionName: T) => {
  if (!mongoClient) {
    await init();
  }
  const allDocs = await theDb?.collection(collectionName).find();
  if (!allDocs) {
    return [];
  }
  return allDocs.toArray() as unknown as CollectionFields<T>[];
};

const getFromCollectionByField = async <T extends Collection>(
  collectionName: T,
  fieldName: string,
  fieldValue: any
) => {
  if (!mongoClient) {
    await init();
  }
  const doc = await theDb
    ?.collection(collectionName)
    .findOne({ [fieldName]: fieldValue });

  return doc as unknown as CollectionFields<T> | null;
};

const getFromCollectionById = async <T extends Collection>(
  collectionName: T,
  id: ObjectId
) => {
  const doc = await getFromCollectionByField(collectionName, "_id", id);
  if (!doc) {
    throw new Error(`Item with id ${id} not found in ${collectionName}`);
  }
  return doc as unknown as CollectionFields<T>;
};

const deleteFromCollectionById = async <T extends Collection>(
  collectionName: T,
  id: ObjectId
) => {
  if (!mongoClient) {
    await init();
  }
  try {
    const result = await theDb!
      .collection(collectionName)
      .deleteOne({ _id: id });
    return result;
  } catch (error) {
    throw new Error(
      `Failed to delete document from ${collectionName}. ${error}`
    );
  }
};

const addToCollection = async <T extends Collection>(
  collectionName: T,
  docData: CollectionFields<T>
) => {
  if (!mongoClient) {
    await init();
  }
  try {
    const result = await theDb!.collection(collectionName).insertOne(docData);
    return result;
  } catch (error) {
    throw new Error(`Failed to add document to ${collectionName}. ${error}`);
  }
};

const updateCollectionItem = async <T extends Collection>(
  collectionName: T,
  id: ObjectId,
  docData: Partial<CollectionFields<T>>
) => {
  if (!mongoClient) {
    await init();
  }
  if (docData.hasOwnProperty("_id")) {
    delete (docData as any)._id;
  }
  try {
    const result = await theDb!
      .collection(collectionName)
      .updateOne({ _id: id }, { $set: docData });
    return result;
  } catch (error) {
    throw new Error(`Failed to update document in ${collectionName}. ${error}`);
  }
};

export const db = {
  init,
  close,
  getAllProjectsBasicInfo,
  getAllInCollection,
  getFromCollectionById,
  getFromCollectionByField,
  addToCollection,
  deleteFromCollectionById,
  updateCollectionItem,
};
