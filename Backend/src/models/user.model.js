import mongoose,{Schema} from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const userSchema=new Schema(
    {
        username : {
            type : String,
            required : true,
            unique : true,
            lowercase :true,
            trim : true,
            index : true
        },
        email : {
            type : String,
            required : true,
            unique : true,
            lowercase :true,
            trim : true,
            index : true
        },
        fullname : {
            type : String,
            required : true,
            trim : true,
            index : true
        },
        avatar : {
            type : String,
            required : true
        },
        coverImage : {
            type : String
        },
        watchHistory : [
            {
                type : Schema.Types.ObjectId,
                ref : 'Video'
            }
        ],
        password : {
            type : String,
            required : [true, 'Password is required']
        },
        refreshToken : {
            type : String
        },
    },
    {timestamps : true}
)

userSchema.pre("save",async function (next){// hashing password before saving
    if(!this.isModified("password")) return next

    this.password = await bcrypt.hash(this.password, 10)
    next
})
userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password,this.password)
}
userSchema.methods.generateAccessToken = function (){
    return jwt.sign(
        {
            _id : this._id,
            email : this.email,
            username : this.username,
            fullname : this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function (){
    return jwt.sign(
        {
            _id : this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
// User logs in

// Server sends access token

// Client sends token with every request

// Server verifies token

// Access allowed



// Access token expires

// Client sends refresh token

// Server verifies refresh token

// Server generates new access token

// User stays logged in
export const User=mongoose.model('User',userSchema);