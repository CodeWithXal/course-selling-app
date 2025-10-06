const mongoose = require("mongoose");


// user schema

const userSchema = new mongoose.Schema(
    {   
        username : {
            type : String,
            required : true,
            unique : true,
            trim : true
        },

        email : {
            type : String,
            required : true,
            unique : true,
            lowercase : true 
        },

        password : {
            type : String,
            required : true, 
        },

        firstName : {
            type : String,
            required : true,
            trim : true 
        },

        lastName : {
            type : String,
            required : true,
            trim : true 
        }

    },
    {timestamps : true}
)


// admin schema 

const adminSchema = new mongoose.Schema(
    {   

        username : {
            type : String,
            required : true,
            unique : true,
            trim : true
        },

        email : {
            type : String,
            required : true,
            unique : true,
            lowercase : true 
        },

        password : {
            type : String,
            required : true, 
        },

        firstName : {
            type : String,
            required : true,
            trim : true 
        },

        lastName : {
            type : String,
            required : true,
            trim : true 
        }

    },
    {timestamps : true}
)

// course schema


const courseSchema = new mongoose.Schema(
    {   

        title : {
            type : String,
            required : true,
            unique : true
        },

        description : {
            type : String,
            required : true
        },

        price : {
            type : Number,
            required : true 
        },

        imageUrl : {
            type : String,
            required : true 
        },

        creatorId : {
            type : mongoose.Schema.Types.ObjectId,
            required : true,
            ref : "Admin"
        }

    },
    {timestamps : true}
)


// purchase schema

const purchaseSchema = new mongoose.Schema(
    {
        courseId : {
            type : mongoose.Schema.Types.ObjectId,
            required : true,
            ref : "Course"
        },

        userId : {
            type : mongoose.Schema.Types.ObjectId,
            required : true,
            ref : "User"
        }

    },
    {timestamps : true}
)


//  models

const User = mongoose.model("User", userSchema);
const Admin = mongoose.model("Admin", adminSchema);
const Course = mongoose.model("Course", courseSchema);
const Purchase = mongoose.model("Purchase", purchaseSchema);


// export modules

module.exports = {
    User,
    Admin,
    Course,
    Purchase
};
