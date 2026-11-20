import mongoose from "mongoose";

const DBconnection = async () => {
    try {
        mongoose.connect(process.env.MONGOOSE_CONNECTION_URI);
        console.log(" ✅ DATABASE CONNECTION SUCCESS");
    } catch (error) {
        console.log(" ❌ DATABASE CONNECTION FAILED", error.message);
        process.exit(1)
    }
}

export default DBconnection;