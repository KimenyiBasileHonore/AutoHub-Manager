import mongoose from "mongoose";

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log("Database connected");
    } catch (error) {
        console.error("Error connecting to the database:", error.message);
    }
};

export default dbConnect;














// import mongoose from "mongoose";
// import  config  from "../helpers/configEnv";

// mongoose.set('strictQuery', false);

// const dbConnect = async () =>{
//     try {
//         await mongoose.connect(config.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
//         console.log('Database connected!');
//     } catch (error) {
//         console.log('error', error.message);
        
//     }
// };

// export default dbConnect;