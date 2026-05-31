import express from "express";
import { createNote, deleteNote, getAllNotes, updateNote, getNoteById, togglePin, toggleArchive } from "../controllers/notesController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Enforce authentication for all note endpoints
router.use(requireAuth);

router.get("/", getAllNotes);

router.get("/:id", getNoteById);

router.post("/", createNote);

router.put("/:id", updateNote);

router.delete("/:id", deleteNote);

router.patch("/:id/pin", togglePin);

router.patch("/:id/archive", toggleArchive);

export default router;