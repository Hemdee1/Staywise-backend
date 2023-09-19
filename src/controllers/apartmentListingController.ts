import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import apartmentListingModel from "../models/apartmentListingModel";
import { assertIsDefine } from "../utils/assertIsDefine";

const apartmentData = [
  {
    title: "Cozy Studio Apartment",
    description: "A comfortable studio apartment in the heart of Osogbo.",
    details:
      "This studio apartment is perfect for solo travelers or couples. It comes with a fully equipped kitchen, a private bathroom, and a comfortable bed.",
    duration: "Short-term",
    adults: 2,
    children: 0,
    rooms: 1,
    location: {
      city: "Osogbo",
      country: "Nigeria",
      address: "123 Main Street",
    },
    hostId: "65093bb08d67e838d7dd40fd",
    images: [
      "https://example.com/images/osogbo1.jpg",
      "https://example.com/images/osogbo2.jpg",
    ],
    rating: 4.6,
    numReviews: 25,
    price: 60.0,
  },
  {
    title: "Spacious Family Apartment",
    description: "A large apartment suitable for families in Osogbo.",
    details:
      "This spacious apartment can accommodate up to 4 adults and 2 children. It features multiple bedrooms, a fully equipped kitchen, and a cozy living area.",
    duration: "Short-term",
    adults: 4,
    children: 2,
    rooms: 3,
    location: {
      city: "Osogbo",
      country: "Nigeria",
      address: "123 Main Street",
    },
    hostId: "65093bb08d67e838d7dd40fd",
    images: [
      "https://images.pexels.com/photos/12534071/pexels-photo-12534071.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/4473893/pexels-photo-4473893.jpeg?auto=compress&cs=tinysrgb&w=600",
    ],
    rating: 4.9,
    numReviews: 30,
    price: 120.0,
  },
  {
    title: "Modern Loft in Osogbo",
    description: "A stylish loft apartment with a view in Osogbo.",
    details:
      "This modern loft offers a unique living experience. It features an open floor plan, large windows, and a beautiful view of the city.",
    duration: "Short-term",
    adults: 2,
    children: 0,
    rooms: 1,
    location: {
      city: "Osogbo",
      country: "Nigeria",
      address: "123 Main Street",
    },
    hostId: "65093bb08d67e838d7dd40fd",
    images: [
      "https://images.pexels.com/photos/12639296/pexels-photo-12639296.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/5997967/pexels-photo-5997967.jpeg?auto=compress&cs=tinysrgb&w=600",
    ],
    rating: 4.7,
    numReviews: 18,
    price: 90.0,
  },
  {
    title: "Secluded Cottage Retreat",
    description: "A quiet cottage in a serene environment near Osogbo.",
    details:
      "Escape the hustle and bustle of the city in this secluded cottage. It offers a peaceful atmosphere and a garden for relaxation.",
    duration: "Short-term",
    adults: 2,
    children: 0,
    rooms: 1,
    location: {
      city: "Osogbo",
      country: "Nigeria",
      address: "123 Main Street",
    },
    hostId: "65093bb08d67e838d7dd40fd",
    images: [
      "https://images.pexels.com/photos/4740484/pexels-photo-4740484.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/5490303/pexels-photo-5490303.jpeg?auto=compress&cs=tinysrgb&w=600",
    ],
    rating: 4.5,
    numReviews: 15,
    price: 75.0,
  },
  {
    title: "Rustic Cabin in the Woods",
    description: "A charming cabin nestled in the woods near Osogbo.",
    details:
      "Experience a rustic getaway in this cabin. It's perfect for nature lovers and offers a serene environment surrounded by trees.",
    duration: "Short-term",
    adults: 2,
    children: 0,
    rooms: 1,
    location: {
      city: "Osogbo",
      country: "Nigeria",
      address: "456 Park Avenue",
    },
    hostId: "65093bb08d67e838d7dd40fd",
    images: [
      "https://images.pexels.com/photos/3987481/pexels-photo-3987481.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/6969824/pexels-photo-6969824.jpeg?auto=compress&cs=tinysrgb&w=600",
    ],
    rating: 4.4,
    numReviews: 12,
    price: 70.0,
  },
];

export const sendData: RequestHandler = async (req, res) => {
  try {
    const data = await apartmentListingModel.insertMany(apartmentData);

    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

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

    if (pricing) apartment.price = pricing;

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
