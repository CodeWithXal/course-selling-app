const express = require("express");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwt_secret = "123asd";

const app = express();



function auth(req, res, next){
    const token = req.header.authorization;

    if(!token){
        res.status(401).json({
            message : "No Token provided"
        });
    }


    try{
        const decoded = jwt.verify(token, jwt_secret);
        req.userId = decoded.id;
        next();
    }
    catch(err){
        res.status(401).json({
            message : "Invalid Token"
        });
    }
}


async function signup(req, res){
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    // input validation

    const requiredBody = z.object({
        email: z.string().min(3, "Email must be at least 3 characters")
                          .max(50, "Email must be at most 50 characters")
                          .email("Invalid email format"),
        password: z.string().min(8, "Password must be at least 8 characters")
                            .max(50, "Password must be at most 50 characters")
                            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
                            .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
        name: z.string().min(3, "Name must be at least 3 characters")
                       .max(50, "Name must be at most 50 characters")
    });

    const parseddata = requiredBody.safeParse(req.body);

    if(!parsedData.success){

        const errMsg = parseddata.error.issues.map(issues=>({
            field : issues.path[0],
            message : issues.message
        }));

        res.status(400).json({
            message : "Incorrest Format",
            error : errMsg
        });
        return;
    }

    // hashing password to be stored in DB 

    try{

        const hashed_password = await bcrypt.hash(password, 5);
        await userModel.create({
            email,
            password : hashed_password,
            name 
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

async function signin(req, res){
    const email = req.body.email;
    const password = req.body.password;

    const user = userModel.findone({
        email : email
    })

    if(!user){
        res.status(403).json({
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

async function  show_courses(req, res) {
    const courses = await courseModel.find
    
}


app.post("/signup", signup);
app.post("/signin", signin);
app.post("/purchase", purchase_course);
app.get("/courses",show_courses);
app.get("/all_courses",show_allcourses);


app.listen(3000, () => {
    console.log("server running on : http://localhost:3000");
});
