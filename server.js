
const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
mongoose.connect("mongodb+srv://mayankk2004k_db_user:yfEwT20pZfj46yyK@cluster0.1gpnxq1.mongodb.net/libraryDB")
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: String,
    category: String,
    available: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Book = mongoose.model("Book", bookSchema);

app.post("/api/books", async (req, res) => {
    try {
        const { title, author, category } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                message: "Title is required"
            });
        }
        const book = await Book.create({
            title,
            author,
            category
        });

        res.status(201).json({
            message: "Book added successfully",
            book
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});
app.get("/api/books", async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 5);
        const skip = (page - 1) * limit;
        const books = await Book.find()
            .skip(skip)
            .limit(limit);
        const total = await Book.countDocuments();
        res.status(200).json({
            currentPage: page,
            totalRecords: total,
            totalPages: Math.ceil(total / limit),
            books
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

app.patch("/api/books/:id", async (req, res) => {
    try {
        const { available } = req.body;
        if (typeof available !== "boolean") {
            return res.status(400).json({
                message: "Available must be true or false"
            });
        }
        const book = await Book.findByIdAndUpdate(
            req.params.id,
            { available },
            { new: true, runValidators: true }
        );
        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }
        res.status(200).json({
            message: "Availability updated successfully",
            book
        });
    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
});
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
