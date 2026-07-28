import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

function buildLegacyUri() {
  const user = process.env.MONGODB_USER;
  const password = process.env.MONGODB_PASSWORD;
  const url = process.env.MONGODB_URL;
  const db = process.env.MONGODB_DB;

  const required = { MONGODB_USER: user, MONGODB_PASSWORD: password, MONGODB_URL: url, MONGODB_DB: db };
  const missing = Object.entries(required)
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missing.length > 0) {
    throw new Error(`Missing MongoDB configuration: ${missing.join(', ')}`);
  }

  const encodedUser = encodeURIComponent(user);
  const encodedPassword = encodeURIComponent(password);

  return `mongodb+srv://${encodedUser}:${encodedPassword}@${url}/${db}?retryWrites=true&w=majority`;
}

function resolveMongoUri() {
  const uri = (process.env.MONGODB_URI || '').trim();

  if (uri) {
    return uri;
  }

  return buildLegacyUri();
}

export async function initMongoDB() {
  const uri = resolveMongoUri();

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log('Підключення до бази даних MongoDB успішне.');
  } catch {
    throw new Error('Unable to connect to MongoDB');
  }
}
