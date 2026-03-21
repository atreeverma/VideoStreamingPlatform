import dotenv from 'dotenv'; // to use env variables
dotenv.config({
    path : './env'
});  // configuring dotenv to use env variables
import connectDB from './db/index.js';
import app from './app.js';
connectDB()  // calling the function to connect to database
.then(() => {
    app.on("error",(error)=>{   
            console.log("ERROR : ",error);
            
        })
    app.listen(process.env.PORT || 8000,()=>{
           console.log(`App is listening on Port ${process.env.PORT}`);  
    })
})
.catch((error)=>{
    console.log("MONGODB CONNECTION FAILED : ",error);

})/*
const app = express()
(async () => {  // database can be in different contient hence async await is used
    try{
        await mongoose.connect(`${process.env.MONGODB_URL}`)

        app.on("error",(error)=>{   // may db is connected but does not to request made through express hence try catch is used here only
            console.log("ERROR : ",error);
            throw error;
        })

        app.listen(process.env.PORT,()=>{
            console.log(`App is listening on Port ${process.env.PORT}`);   
        })

    } catch (error){
        console.log("ERROR : ",error);
        throw error;
    }
})()
*/