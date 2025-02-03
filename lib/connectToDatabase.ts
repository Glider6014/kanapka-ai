import mongoose, { ConnectOptions } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('You must provide a MONGODB_URI environment variable');
}

// Global cache to store the connection
type MongooseCache = {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Mongoose> | null;
};

const cached: MongooseCache = {
  conn: null,
  promise: null,
};

async function connectDB(): Promise<mongoose.Connection> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts: ConnectOptions = {};

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = (await cached.promise).connection;

  if (!cached.conn) {
    throw new Error('Failed to connect to the database');
  }

  return cached.conn;
}

export default connectDB;
