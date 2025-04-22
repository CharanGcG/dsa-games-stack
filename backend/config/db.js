import mongoose from "mongoose";

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDb connected: ${conn.connection.host}`);
    }catch(err){
        console.error("MongoDb connection error: ", err);

    }
}

export default connectDB;