const {Router} = require("express");

const courseRouter = Router();
const {courseModel} = require("../db")

async function coursePreview(req, res ){
    res.json({
        message : "here are your courses"
    });
}
courseRouter.get("/preview", coursePreview);


module.exports = {
    courseRouter : courseRouter
}