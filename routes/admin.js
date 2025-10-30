require("dotenv").config();
const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwt_secret = process.env.JWT_ADMIN_SECRET;
const {Router} = require("express");
const adminRouter = Router();
const {adminModel, courseModel} = require("../db")
const {authMiddleware} = require("../middleware/authentication")

// --- AUTHENTICATION  ---

const adminAuth = authMiddleware(jwt_secret)


// --- ADMIN SIGNUP FUNCTION ---

async function adminSignup(req, res){
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName  = req.body.lastName;

    // input validation

    const requiredBody = z.object({
         username: z.string().min(3, "Name must be at least 3 characters")
                       .max(50, "Name must be at most 50 characters"),
        email: z.string().min(3, "Email must be at least 3 characters")
                          .max(50, "Email must be at most 50 characters")
                          .email("Invalid email format"),
        password: z.string().min(8, "Password must be at least 8 characters")
                            .max(50, "Password must be at most 50 characters")
                            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
                            .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
        firstName: z.string().min(3, "Name must be at least 3 characters")
                       .max(50, "Name must be at most 50 characters"),
        lastName: z.string().min(3, "Name must be at least 3 characters")
                       .max(50, "Name must be at most 50 characters")
    });

    const parsedData = requiredBody.safeParse(req.body);

    if(!parsedData.success){

        const errMsg = parsedData.error.issues.map(issues=>({
            field : issues.path[0],
            message : issues.message
        }));

        res.status(400).json({
            message : "Incorrect Format",
            error : errMsg
        });
        return;
    }

    // hashing password to be stored in DB 

    try{

        const hashed_password = await bcrypt.hash(password, 5);
        await adminModel.create({
            username,       
            email,
            password : hashed_password,
            firstName,
            lastName
        });

        return res.json({
            message : "you are signed up"
        });

    }
    catch(err){
        return res.status(400).json({
            message :"User already exists or Database error",
            error : err.message
        });
    }


}

// --- ADMIN SIGNIN FUNCTION ---

async function adminSignin(req, res){
    const email = req.body.email;
    const password = req.body.password;

    const user = await adminModel.findOne({
        email : email
    })

    if(!user){
        return res.status(403).json({
            message : "User doesn't exists"
        })
    }

    const password_match = await bcrypt.compare(password, user.password);

    if(password_match){
        const token = jwt.sign({
            id : user._id
        },jwt_secret);
        res.json({
            token : token
        });
    }

    else{
        res.status(403).json({
            message : "Email or Password is Incorrect"
        });
    }
}


async function adminCreateCourse(req, res){

    const adminId = req.userId;
    const {title, description, price, imageUrl} = req.body;

    const course = await courseModel.create({
        title: title,
        description: description,
        price: price,
        imageUrl: imageUrl,  // create a pipeline for user to upload image directly
        creatorId: adminId
    })
    res.json({
        message : "course created successfully",
        courseId: course._id
    });
}

async function adminUpdateCourse(req, res){

    try{
        const adminId = req.userId;
        const {courseId, title, description, price, imageUrl} = req.body;

        const course = await courseModel.findById(courseId);

        if(!course){
            return res.status(404).json({
                message: "course noot found"
            });
        }

        // check whwther the admin is same 

        if(course.creatorId.toString() !== adminId){
            return res.status(403).json({
                message: "You are mot authorized to update this course"
            });
        }

        if(title) course.title = title;
        if(description) course.description = description;
        if(price) course.price = price;
        if(imageUrl) course.imageUrl = imageUrl;

        await course.save();

        res.json({
            message : "course updaated successfully",
            updatedCourse : course
        });
    }catch(err){
        res.status(500).json({
            message: "error updating course",
            error: err.message
        })
    }
}

async function adminAllCourses(req, res){

    try{
        // if you wamt to only fetch the courses created by the admin 
        const adminId = req.userId;
        const courses = await courseModel.find({creatorId : adminId})
        res.json({
            message : "all courses fetched succcessfully",
            totalCourses : courses.length,
            courses : courses
        });
    }catch(err){
        res.status(500).json({
            message : "error fetching courses",
            error : err.message
        })
    }
}



adminRouter.post("/signup", adminSignup);
adminRouter.post("/signin", adminSignin);
adminRouter.post("/course/Create",adminAuth, adminCreateCourse);
adminRouter.put("/course/update",adminAuth, adminUpdateCourse);
adminRouter.get("/course/all",adminAuth, adminAllCourses);

module.exports = {
    adminRouter : adminRouter
}