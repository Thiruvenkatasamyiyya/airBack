import express from "express";
import { adminFlights, cancelData, flights, seatSelect, userSeat } from "../controller/flightController.js";
import { isAuthenticated } from "../middleware/user.js";

const router = express.Router()

router.route("/searchFlights").get(adminFlights)
router.route("/allFlights").get(flights)
router.route("/addSeat").post(isAuthenticated,seatSelect)
router.route("/seatDelete").delete(isAuthenticated,cancelData)
router.route("/userSeat").get(isAuthenticated,userSeat)

export default router