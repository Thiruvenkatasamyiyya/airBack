import catchAsyncError from "../middleware/catchAsyncError.js";
import Flight from "../model/flight.js";
import axios from "axios";
import ErrorHandler from '../utils/errorHandler.js'
import AllFlights from "../model/allFlights.js";
import ApiFilters from "../utils/apiFilters.js";

// let allFlights
// const externalApi = async()=>{
//     // external api 
//     const params = {
//         access_key : "3ef8b36cc7d0fcc3f001f0ed17d61fec",
//     }
//     const response =  await axios.get(`https://api.aviationstack.com/v1/flights`,{params})
//     const flights =  await response.data
//     allFlights = await AllFlights.create(flights.data)

// }

// externalApi()
export const adminFlights  = catchAsyncError(async(req,res,next)=>{

    const apiFilters = new ApiFilters(AllFlights,req.query).filter().search()
    
    const data = await apiFilters.query

    const len = data.length || 0

    if(len == 0){
        return (
            res.status(400).json({
                message : "No such flights available"
            })
        )
    }

    res.status(200).json({
        length  : len,
        data : data

    })
})

export const flights = catchAsyncError(async(req,res,next) =>{
    
    const dat = await Flight.create()
    console.log(dat);
    const AllFlights = await Flight.find();

    if(!AllFlights){
        return next(new ErrorHandler("We did not retrive the data",400))
    }
    
    const apiFilters = new ApiFilters( Flight,req.query).search()
    
    const data = await apiFilters.query

    return (
        res.json({
            data
        })
    )
    
    
    // get the from and to 

    const {from,to} = req.body
    if(!from || !to){
        return next(new ErrorHandler("Enter the depature and arrival place",400))
    }
    const filteredFlights =  AllFlights.filter(flight => 
        {   
            const departure = flight.departure?.airport.toLowerCase()
            const arrilval = flight.arrival?.airport.toLowerCase()

            return (
                departure.includes(from.toLowerCase())&&
                arrilval.includes(to.toLowerCase())   
            )
        });
    const len = filteredFlights.length
    res.status(200).json({
        lenght : len,
        data : filteredFlights

    })
})
//adding the seat
export const seatSelect = catchAsyncError(async(req,res,next)=>{

    //req params form body
    const {flightNumber,seatNumber} = req.body
    const user = req.user._id
    console.log(flightNumber,seatNumber,user);
    // checking the flight
    const filteredFlight =  await AllFlights.findOne({"flight.number" : flightNumber})
    if (!filteredFlight) {
        return next(new ErrorHandler("Flight not found", 404));
    }

    //adding seats
    let seatsData = []
    for (const seat of seatNumber) {
        const seatExists = await Flight.findOne({
            "flight.number": flightNumber,
            "seat.seat_number": seat
        });

        if (seatExists) {
            return next(new ErrorHandler(`Seat ${seat} is already allocated`,400));
        }

        seatsData.push({ seat_number: seat, status: 'booked',user_id : user });
    }

    //check if alreay exists
    const flight = await Flight.findOne({"flight.number" : flightNumber}) 
    if(flight){
        flight.seat.push(...seatsData)
        const updatedData = await flight.save()
        return (
            res.status(200).json({
                updatedData
            })
        )
    }

    //else create a store for flight 
    const userFlight = await Flight.create({
        flight_date : filteredFlight?.flight_date,
        flight_status : filteredFlight?.flight_status,
        departure:{
            airport : filteredFlight.departure?.airport,
            iata : filteredFlight.departure?.iata,
            scheduled : filteredFlight.departure?.scheduled
        },
        arrival:{
            airport : filteredFlight.arrival?.airport,
            iata : filteredFlight.arrival?.iata,
            scheduled : filteredFlight.arrival?.scheduled
        },
        airline:{
            name : filteredFlight.airline?.name
        },
        flight : {
            number : filteredFlight.flight?.number
        },
        seat : seatsData
    })

    res.status(200).json({
        filteredFlight,
        userFlight,

    })
})

export const cancelData = catchAsyncError(async(req,res,next)=>{

    //req params form body
    const {flightNumber,seatNumber} = req.body

    const flight = await Flight.findOne({"flight.number" : flightNumber})
    if(flight){
        await flight.updateOne({
            $pull :{
                seat: {
                    seat_number : { $in : seatNumber}
                }
            }
        })
        const deletedData = await Flight.findOne({ "flight.number": flightNumber })
        return (
            res.status(200).json({
                deletedData
            })
        )
    }
    return next(new ErrorHandler('Flight is not found',400))


})

export const userSeat = catchAsyncError(async(req,res,next) =>{
    const user = req.body.user // change to req.user 

    const userDetail = await Flight.find({"seat.user_id" : user})

    if(userDetail.length == 0){
        return next(new ErrorHandler("No seats are allocted of this user",400))
    }

    res.status(200).json({
        userDetail
    })
})