import express from "express";
import * as bookingController from "../controllers/bookingController";

const router = express.Router();

router.post("/", bookingController.createBooking);
router.get("/", bookingController.getBookingsForUser);
router.get("/:bookingId", bookingController.getBookingDetails);
router.patch("/:bookingId", bookingController.updateBookingStatus);

export default router;
