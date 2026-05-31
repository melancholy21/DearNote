import Note from "../models/Note.js"

export async function getAllNotes (req, res) {
    try {
        const userId = req.auth.userId;
        const { search, tag, archived } = req.query;

        // Base query with user isolation
        const query = { userId };

        // Handle archiving filter: default to showing only unarchived notes
        if (archived === "true") {
            query.isArchived = true;
        } else {
            query.isArchived = false;
        }

        // Handle text search filter
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { content: { $regex: search, $options: "i" } }
            ];
        }

        // Handle tag filter
        if (tag) {
            query.tags = tag;
        }

        // Query notes sorted by pinned state first, then newest first
        const notes = await Note.find(query).sort({ isPinned: -1, createdAt: -1 });
        res.status(200).json(notes);
    } catch (error) {
        console.error("Error in getAllNotes controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getNoteById (req, res) {
    try {
        const userId = req.auth.userId;
        const note = await Note.findOne({ _id: req.params.id, userId });
        if (!note) return res.status(404).json({ message: "Note not found!" });
        res.status(200).json(note);
    } catch (error) {
        console.error("Error in getNoteById controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function createNote (req, res) {
    try {
        const userId = req.auth.userId;
        const { title, content, tags } = req.body;
        
        // Clean and format tags if provided
        const formattedTags = Array.isArray(tags) 
            ? tags.map(t => t.trim().toLowerCase()).filter(Boolean)
            : [];

        const note = new Note({ 
            userId, 
            title, 
            content, 
            tags: formattedTags 
        });

        const savedNote = await note.save();
        res.status(201).json(savedNote);
    } catch (error) {
        console.error("Error in createNote controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function updateNote (req, res) {
    try {
        const userId = req.auth.userId;
        const { title, content, tags } = req.body;

        const updateData = { title, content };
        if (tags !== undefined) {
            updateData.tags = Array.isArray(tags)
                ? tags.map(t => t.trim().toLowerCase()).filter(Boolean)
                : [];
        }

        const updatedNote = await Note.findOneAndUpdate(
            { _id: req.params.id, userId },
            updateData,
            { new: true }
        );

        if (!updatedNote) return res.status(404).json({ message: "Note not found" });
        res.status(200).json(updatedNote);
    } catch (error) {
        console.error("Error in updateNote controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function deleteNote (req, res) {
    try {
        const userId = req.auth.userId;
        const deletedNote = await Note.findOneAndDelete({ _id: req.params.id, userId });

        if (!deletedNote) return res.status(404).json({ message: "Note not found" });
        res.status(200).json({ message: "Note deleted successfully" });
    } catch (error) {
        console.error("Error in deleteNote controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function togglePin (req, res) {
    try {
        const userId = req.auth.userId;
        const note = await Note.findOne({ _id: req.params.id, userId });

        if (!note) return res.status(404).json({ message: "Note not found" });

        note.isPinned = !note.isPinned;
        const savedNote = await note.save();
        res.status(200).json(savedNote);
    } catch (error) {
        console.error("Error in togglePin controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function toggleArchive (req, res) {
    try {
        const userId = req.auth.userId;
        const note = await Note.findOne({ _id: req.params.id, userId });

        if (!note) return res.status(404).json({ message: "Note not found" });

        note.isArchived = !note.isArchived;
        // Unpin if archived
        if (note.isArchived) {
            note.isPinned = false;
        }
        
        const savedNote = await note.save();
        res.status(200).json(savedNote);
    } catch (error) {
        console.error("Error in toggleArchive controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}