const express = require("express");
const {userRouter} = require("./routes/users");
const {courseRouter} = require("./routes/courses");


const app = express();
app.use(express.json());

app.use("/user", userRouter);
app.use("/course", courseRouter);



app.listen(3000, () => {
    console.log("server running on : http://localhost:3000");
});
