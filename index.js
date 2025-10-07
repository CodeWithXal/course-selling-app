require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const {userRouter} = require("./routes/users");
const {courseRouter} = require("./routes/courses");
const {adminRouter} = require("./routes/admin");
const {userModel, adminModel, courseModel, purchaseModel} = require("./db");



const app = express();
app.use(express.json());

app.use("/user", userRouter);
app.use("/course", courseRouter);
app.use("/admin", adminRouter);

async function main(){
    try {
        await mongoose.connect(process.env.MONGO_URI,{
            serverSelectionTimeoutMS: 5000, // <- fail after 5 seconds
        });
        console.log("MongoDB connected successfully");
    
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`server running on : http://localhost:${PORT}`);
        });
    }catch (err){
        console.log("MongoDb connection error  : ", err)
        process.exit(1);
    }
}

main();