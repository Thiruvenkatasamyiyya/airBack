import mongoose from "mongoose";

const AllFlights = new mongoose.Schema({

  flight_date: { type: String },
  flight_status: { type: String},
  departure: {
    airport: String,
    timezone: String,
    iata: String,
    icao: String,
    terminal: String,
    gate: String,
    delay: Number,
    scheduled: String,
    estimated: String,
    actual: String,
    estimated_runway: String,
    actual_runway: String
  },
  arrival: {
    airport: String,
    timezone: String,
    iata: String,
    icao: String,
    terminal: String,
    gate: String,
    baggage: String,
    scheduled: String,
    delay: Number,
    estimated: String,
    actual: String,
    estimated_runway: String,
    actual_runway: String
  },
  airline: {
    name: String,
    iata: String,
    icao: String
  },
  flight: {
    number: String,
    iata: String,
    icao: String,
    codeshared: {
      airline_name: String,
      airline_iata: String,
      airline_icao: String,
      flight_number: String,
      flight_iata: String,
      flight_icao: String
    }
  },
  aircraft: mongoose.Schema.Types.Mixed,
  live: mongoose.Schema.Types.Mixed
});

export default mongoose.model("AllFlights",AllFlights)