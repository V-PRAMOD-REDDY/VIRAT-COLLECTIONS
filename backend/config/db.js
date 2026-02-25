import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log("Database Connected Successfully! 📂 Virat-DB is Live.");
        });

        // 👈 ఇక్కడ కేవలం URL మాత్రమే ఇవ్వండి, పాత ఆప్షన్స్ తొలగించండి
        await mongoose.connect(`${process.env.MONGODB_URI}`);
        
    } catch (error) {
        console.error("Database Connection Failed: ", error.message);
        process.exit(1);
    }
};

export default connectDB;