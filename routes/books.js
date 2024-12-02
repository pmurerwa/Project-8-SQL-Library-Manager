const express = require("express");
const router = express.Router();
const { Book } = require("../models"); // Import the Book model
//const { Op } = require("sequelize"); // For search functionality

// Async Handler Function
const asyncHandler = (cb) => {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// Books Route - List all books 
router.get(
  "/",
  asyncHandler(async (req, res) => {
    //const { search } = req.query || ""; // Search query
    // const page = parseInt(req.query.page) || 1; // Current page
    // const limit = 10; // Items per page
    // const offset = (page - 1) * limit;

    // Define search conditions
    // let whereQuery = {};
    // if (search) {
    //   whereQuery = {
    //     [Op.or]: [
    //       { title: { [Op.iLike]: `%${search}%` } }, // Case-insensitive partial match
    //       { author: { [Op.iLike]: `%${search}%` } },
    //       { genre: { [Op.iLike]: `%${search}%` } },
    //       { year: { [Op.like]: `%${search}%` } }, // Year is not case-sensitive
    //     ],
    //   };
    // }
    // console.log("Search Query:", search); // Log the search query
    // console.log("Where Query:", whereQuery); // Log the whereQuery object

    const { count, rows: books } = await Book.findAndCountAll({
      //where: whereQuery,
      order: [["title", "ASC"]],
      // limit,
      // offset,
    });
    
    res.render("index", {
      books,
      title: "Books",
      // currentPage: page,
      // totalPages: Math.ceil(count / limit),
      //search,
    });
  })
);

// New Book Route
router.get("/new", (req, res) => {
  res.render("new-book", { book: {}, title: "New Book" });
});

// Create Book Route
router.post(
  "/new",
  asyncHandler(async (req, res) => {
    try {
      await Book.create(req.body);
      res.redirect("/books");
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        res.render("new-book", {
          book: req.body,
          title: "New Book",
          errors: error.errors,
        });
      } else {
        throw error;
      }
    }
  })
);

// Book Detail Route
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    console.log(`Fetching book with ID: ${req.params.id}`); // Debugging log
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render("update-book", { book, title: "Update Book" });
    } else {
      res
        .status(404)
        .render("page-not-found", { error: new Error("Book Not Found") });
    }
  })
);

// Update Book Route
router.post(
  "/:id",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      try {
        await book.update(req.body);
        res.redirect("/books");
      } catch (error) {
        if (error.name === "SequelizeValidationError") {
          res.render("update-book", {
            book,
            title: "Update Book",
            errors: error.errors,
          });
        } else {
          throw error;
        }
      }
    } else {
      res
        .status(404)
        .render("page-not-found", { error: new Error("Book Not Found") });
    }
  })
);

// Delete Book Route
router.post(
  "/:id/delete",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      await book.destroy();
      res.redirect("/books");
    } else {
      res
        .status(404)
        .render("page-not-found", { error: new Error("Book Not Found") });
    }
  })
);

module.exports = router;
