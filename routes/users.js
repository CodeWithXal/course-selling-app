require("dotenv").config();
const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwt_secret = process.env.JWT_USER_SECRET;
// const express = require("express");
// const Router = express.Router;

// you can write this single line below instead of writing the above two lines 
const {Router} = require("express"); 
const userRouter = Router();

const {userModel, purchaseModel} = require("../db")
const {authMiddleware} = require("../middleware/authentication")


// --- AUTHENTICATION ---

const userAuth = authMiddleware(jwt_secret);


// --- USER SIGNUP FUNCTION ---

async function userSignup(req, res){
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;


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
        await userModel.create({
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

// --- USER SIGNIN FUNCTION ---
async function userSignin(req, res){
    const email = req.body.email;
    const password = req.body.password;

    const user = await userModel.findOne({email})

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

async function userPurchases(req, res){
    try{
        const userId = req.userId;

        const purchases = await purchaseModel.find({
            userId
        })
        .populate("courseId", "title description price") // choose fields you want to display
        .exec();

        if(!purchases.length){

            return res.json({
                message : "No purshases yet"
            });
        }

        // extract the populated courses

        const purchasedCourses = purchases.map((purchase)=>purchase.courseId);

        res.json({
            message : "Your Purchases",
            total : purchasedCourses.length,
            purchasedCourses
        })
    }catch(err){
        console.log("error fetching purchases",err);
        res.json({
            message : "Error fetching courses"
        });
    }
}


userRouter.post("/signup", userSignup);
userRouter.post("/signin", userSignin);
userRouter.get("/purchases",userAuth, userPurchases);


module.exports = {
    userRouter : userRouter
}