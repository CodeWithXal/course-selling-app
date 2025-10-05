const {Router} = require("express");
const adminRouter = Router();


async function adminSignup(req, res){
    res.json({
        message : "admin signup endpoint"
    });
}

async function adminSignin(req, res){
    res.json({
        message : "admin signin endpoint"
    });
}

async function adminCreateCourse(req, res){
    res.json({
        message : "admin create course endpoint"
    });
}

async function adminUpdateCourse(req, res){
    res.json({
        message : "admin change/update course endpoint"
    });
}

async function adminAllCourses(req, res){
    res.json({
        message : "admin get all courses endpoint"
    });
}



adminRouter.post("/signup", adminSignup);
adminRouter.post("/signin", adminSignin);
adminRouter.post("/course/Create", adminCreateCourse);
adminRouter.put("/course/update", adminUpdateCourse);
adminRouter.get("/course/all", adminAllCourses);

module.exports = {
    adminRouter : adminRouter
}