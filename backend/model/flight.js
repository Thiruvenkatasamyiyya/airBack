import mongoose from "mongoose";

//For making the seats
const SeatSchema = new mongoose.Schema({

    seat_number: {
        type : String,
    },
    status: {
      type: String,
      enum: ['available', 'booked'],
      default: 'available',
    },
    user_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        default: null 
    }

  });

const FlightSchema = new mongoose.Schema({

  flight_date: {
    type: String, // You can use Date if you prefer
    required: [true,"Data of filght is mandatory"]
  },
  flight_status: {
    type: String,
    enum: ['scheduled', 'active', 'landed', 'cancelled', 'delayed'],
    required: true
  },
  departure: {
    airport: { 
        type: String,
        required: [true,'Mention the Departure airport'] 
    },
    iata: { 
        type: String, 
        required: true 
    },
    scheduled: { type: Date, 
        required: [true,"selet date"] 
    }
  },
  arrival: {
    airport: { 
        type: String, 
        required:[true,'Mention the Arrival airport'] 
    },
    iata: { 
        type: String, 
        required: true 
    },
    scheduled: { 
        type: Date, 
        required: [true,"selet date"]  
    }
  },
  airline: {
    name: { 
        type: String, 
        required: [true,'Enter the airlines name'] 
    }
  },
  flight: {
    number: { 
        type: String, 
        required: [true,"Enter the flight number"] 
    }
  },
  // seat allocation to particular flight

  seat : [SeatSchema]

},{timestamps : true})

export default mongoose.model("Flight",FlightSchema);