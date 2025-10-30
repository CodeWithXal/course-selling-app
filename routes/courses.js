const {Router} = require("express");
const {authMiddleware} = require("../middleware/authentication")
const courseRouter = Router();
const {courseModel, purchaseModel} = require("../db")

async function course_purchase(req, res){
    const userId = req.userId;
    const courseId = req.body.courseId;

    //should do all the price checking, check if the user has already paid the amount

    await purchaseModel.create({
        userId,
        courseId    

    })

    res.json({
        message : "you have successfully purchased the course"
    });
}

async function coursePreview(req, res ){

    const courses = await courseModel.find({});

    res.json({
        message : "here are your courses",
        courses
    });
}
courseRouter.get("/preview", coursePreview);
courseRouter.post("/purchase", authMiddleware, course_purchase)


module.exports = {
    courseRouter : courseRouter
}