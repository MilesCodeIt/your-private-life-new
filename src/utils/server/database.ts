import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  // Une connexion en cache à la base de données.
  var connection: {
    conn: typeof mongoose | null,
    promise: Promise<typeof mongoose> | null
  };
}

const MONGODB_URI = process.env.MONGODB_URI as string | undefined;
if (!MONGODB_URI) {
  throw new Error("Missing `MONGODB_URI` value inside `.env`");
}

let cached = global.connection;

if (!cached) {
  cached = global.connection = {
    conn: null,
    promise: null
  };
}

/**
 * Récupération de la connexion à la base de données
 * pour l'API coté-serveur.
 */
export const getDatabaseConnection = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = { bufferCommands: false };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  }
  catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
};
