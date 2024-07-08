import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const initMongo = async () => {
  const URI: string | undefined = process.env.DB_KEY ;
  if (!URI) {
    throw new Error("MongoDB URI not found in environment variables");
  }

  console.log("URI de conexión:", URI);

  try {
    await mongoose.connect(URI, {
    
    });
    console.log("Base de datos conectada correctamente");
  } catch (error) {
    console.error("Error conectando a la base de datos:", error);
    throw error;
  }
};
