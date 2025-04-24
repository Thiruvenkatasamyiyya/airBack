import mongoose from "mongoose";

const connectDatabase = ()=>{
    mongoose.connect('mongodb+srv://thiruvenkatasamyiyya:thiruvenkatam@cluster0.i16j9.mongodb.net/airline') 
    .then((con)=>{
        console.log(`MongoDB is connected with ${con.connection.host}`);
    })
}

export default connectDatabase