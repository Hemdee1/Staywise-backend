import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import apartmentListingModel from "../models/apartmentListingModel";
import { assertIsDefine } from "../utils/assertIsDefine";

export const getApartments: RequestHandler = async (req, res, next) => {
  try {
    const apartments = await apartmentListingModel.find().exec();
    res.status(200).json(apartments);
  } catch (error) {
    next(error);
  }
};

export const getApartment: RequestHandler = async (req, res, next) => {
  const apartmentId = req.params.apartmentId;
  try {
    if (!mongoose.isValidObjectId(apartmentId)) {
      throw createHttpError(400, "invalid id");
    }
    const apartment = await apartmentListingModel.findById(apartmentId).exec();

    if (!apartment) {
      createHttpError(400, "no apartment found");
    }

    res.status(200).json(apartment);
  } catch (error) {
    next(error);
  }
};

interface createApartmentBody {
  title: string;
  description: string;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: number;
  };
  pricing: number;
  images: string;
}

export const createApartment: RequestHandler<
  unknown,
  unknown,
  createApartmentBody,
  unknown
> = async (req, res, next) => {
  const { description, title, pricing, images, location } = req.body;
  const authenticatedUserId = req.session.userId;
  const { address, city, state, zipCode } = location;
  try {
    assertIsDefine(authenticatedUserId);
    if (!title) {
      throw createHttpError(400, "note must have a title");
    }

    const newApartment = await apartmentListingModel.create({
      hostIdId: authenticatedUserId,
      title: title,
      description: description,
      pricing: pricing,
      images: images,
      location: {
        address: address,
        city: city,
        state: state,
        zipCode: zipCode,
      },
    });

    res.status(201).json(newApartment);
  } catch (error) {
    next(error);
  }
};

interface updateApartmentParam {
  apartmentId: string;
}

interface updateApartmentBody {
  title?: string;
  description?: string;
  location?: {
    address?: string;
    city?: string;
    state?: string;
    zipCode?: number;
  };
  pricing?: number;
  images?: string;
}

export const updateApartment: RequestHandler<
  updateApartmentParam,
  unknown,
  updateApartmentBody,
  unknown
> = async (req, res, next) => {
  const apartmentId = req.params.apartmentId;
  const { description, title, pricing } = req.body;
  const authenticatedUserId = req.session.userId;
  try {
    assertIsDefine(authenticatedUserId);
    if (!mongoose.isValidObjectId(apartmentId)) {
      throw createHttpError(400, "invalid apartment id");
    }

    const apartment = await apartmentListingModel.findById(apartmentId).exec();

    if (!apartment) {
      throw createHttpError(404, "apartment not found");
    }
    if (apartment?.hostId && !apartment.hostId.equals(authenticatedUserId)) {
      throw createHttpError(401, "you cannot access this apartment");
    }

    if (title) apartment.title = title;

    if (description) apartment.description = description;

    if (pricing) apartment.pricing = pricing;

    const updatedApartment = await apartment.save();

    res.status(200).json(updatedApartment);
  } catch (error) {
    next(error);
  }
};

export const deleteApartment: RequestHandler = async (req, res, next) => {
  const apartmentId = req.params.apartmentId;
  const authenticatedUserId = req.session.userId;

  try {
    assertIsDefine(authenticatedUserId);
    if (!mongoose.isValidObjectId(apartmentId)) {
      throw createHttpError(400, "invalide apartment id");
    }

    const apartment = await apartmentListingModel.findById(apartmentId).exec();

    if (!apartment) {
      throw createHttpError(400, "apartment not found");
    }
    if (apartment?.hostId && !apartment.hostId.equals(authenticatedUserId)) {
      throw createHttpError(401, "you cannot access this apartment");
    }

    await apartment.deleteOne();

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
