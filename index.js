const express = require("express");
const {userRouter} = require("./routes/users");
const {courseRouter} = require("./routes/courses");
const {adminRouter} = require("./routes/admin");


const app = express();
app.use(express.json());

app.use("/user", userRouter);
app.use("/course", courseRouter);
app.use("/admin", adminRouter);



app.listen(3000, () => {
    console.log("server running on : http://localhost:3000");
});
