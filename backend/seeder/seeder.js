import mongoose from "mongoose";
import AllFlights from "../model/allFlights.js";
import axios from "axios";

const seedProducts = async () => {

    const params = {
        access_key : "3ef8b36cc7d0fcc3f001f0ed17d61fec",
    }
    const response =  await axios.get(`https://api.aviationstack.com/v1/flights`,{params})
    const flights =  await response.data.data

    try{

        await mongoose.connect("mongodb+srv://thiruvenkatasamyiyya:thiruvenkatam@cluster0.i16j9.mongodb.net/airline");

        // Delete existing products
        await AllFlights.deleteMany();

        console.log("All Flights are deleted");

        // Insert a New Products
        await AllFlights.insertMany(flights);
        console.log("All Flights are added");

        process.exit();


    }catch(error){
        console.log(error)
        process.exit(1);
    }


}


seedProducts();