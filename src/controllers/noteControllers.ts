import { RequestHandler } from "express";
import createHttpError from "http-errors";
import NoteModel from "../models/NoteModels";

export const getNotes: RequestHandler = async (req, res, next) => {
  try {
    const notes = await NoteModel.find().exec();

    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

export const getNote: RequestHandler = async (req, res, next) => {
  const { id } = req.params;

  try {
    const note = await NoteModel.findById(id).exec();

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

type ReqBodyType = {
  title?: string;
  text?: string;
};

export const createNote: RequestHandler<
  unknown,
  unknown,
  ReqBodyType,
  unknown
> = async (req, res, next) => {
  const { title, text } = req.body;

  try {
    if (!title) {
      throw createHttpError(400, "Note must have a title");
    }

    const newNote = await NoteModel.create({
      title,
      text,
    });

    res.status(200).json(newNote);
  } catch (error) {
    next(error);
  }
};
