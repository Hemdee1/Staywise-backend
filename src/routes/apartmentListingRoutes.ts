import express from "express";
import * as apartmentController from "../controllers/apartmentListingController";
const router = express.Router();

router.get("/send", apartmentController.sendData);

router.get("/", apartmentController.getApartments);
router.post("/", apartmentController.createApartment);
router.get("/:apartmentId", apartmentController.getApartment);
router.patch("/:apartmentId", apartmentController.updateApartment);
router.delete("/:apartment", apartmentController.deleteApartment);

export default router;
