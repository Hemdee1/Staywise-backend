import { RequestHandler } from "express";
import bookingModel from "../models/bookingModel";
import createHttpError from "http-errors";

export const createBooking: RequestHandler = async (req, res, next) => {
  const authenticatedUserId = req.session.id;
  const propertyId = req.params;
  const { startDate, endDate, paymentInfo } = req.body;
  try {
    const booking = new bookingModel({
      propertyId: propertyId,
      userId: authenticatedUserId, // Assuming you store the user ID in req.user after authentication
      startDate,
      endDate,
      paymentInfo,
      status: "pending",
    });

    await booking.save();

    res.status(201).json({ booking });
    res.status(200);
  } catch (error) {
    next(error);
  }
};

export const getBookingsForUser: RequestHandler = async (req, res, next) => {
  const authenticatedUserId = req.session.id;
  try {
    const bookings = await bookingModel.find({ userId: authenticatedUserId });
    res.json({ bookings });
    res.status(200);
  } catch (error) {
    next(error);
  }
};

export const getBookingDetails: RequestHandler = async (req, res, next) => {
  const bookingId = req.params.bookingId;
  const authenticatedUserId = req.session.id;
  try {
    const booking = await bookingModel.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Check if the user is authorized to view this booking
    if (booking?.userId && !booking.userId.equals(authenticatedUserId)) {
      res.status(500).json("Unauthorized to view this booking");
      throw createHttpError(401, "Unauthorized to view this booking");
    }

    res.json({ booking });
    res.status(200);
  } catch (error) {
    next(error);
  }
};

export const updateBookingStatus: RequestHandler = async (req, res, next) => {
  const authenticatedUserId = req.session.id;
  const bookingId = req.params.bookinId;
  const { status } = req.body;
  try {
    const booking = await bookingModel.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Check if the user is authorized to update this booking
    if (booking?.userId && !booking.userId.equals(authenticatedUserId)) {
      res.status(500).json("Unauthorized to view this booking");
      throw createHttpError(401, "Unauthorized to view this booking");
    }

    // Update the booking status
    booking.status = status;
    await booking.save();

    res.json({ booking });
    res.status(500);
  } catch (error) {
    next(error);
  }
};
