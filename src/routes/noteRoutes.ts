import express from "express";
import * as NoteControllers from "../controllers/noteControllers";

const NoteRoutes = express.Router();

NoteRoutes.get("/", NoteControllers.getNotes);

NoteRoutes.get("/:id", NoteControllers.getNote);

NoteRoutes.post("/", NoteControllers.createNote);

export default NoteRoutes;
