const express = require('express');
const router = express.Router();
const { Book } = require('../models'); // Import the Book model
const { Op } = require('sequelize');

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

// Home Route
router.get('/', asyncHandler(async (req, res) => {
  res.redirect('/books');
}));

// Books Route - List all books with pagination and optional search
router.get('/books', asyncHandler(async (req, res) => {
  const { query } = req.query; // Search query
  const page = parseInt(req.query.page) || 1; // Current page
  const limit = 10; // Items per page
  const offset = (page - 1) * limit;

  const where = query
    ? {
        [Op.or]: [
          { title: { [Op.like]: `%${query}%` } },
          { author: { [Op.like]: `%${query}%` } },
          { genre: { [Op.like]: `%${query}%` } },
          { year: { [Op.like]: `%${query}%` } },
        ],
      }
    : {};

  const { rows: books, count } = await Book.findAndCountAll({
    where,
    order: [['title', 'ASC']],
    limit,
    offset,
  });

  res.render('index', { books, title: 'Books', currentPage: page, totalPages: Math.ceil(count / limit), query });
}));

// New Book Route
router.get('/books/new', asyncHandler(async (req, res) => {
  res.render('new-book', { book: {}, title: 'New Book' });
}));

// Create Book Route
router.post('/books/new', asyncHandler(async (req, res) => {
  try {
    await Book.create(req.body);
    res.redirect('/books');
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      res.render('new-book', { book: req.body, title: 'New Book', errors: error.errors });
    } else {
      throw error;
    }
  }
}));

// Book Detail Route
router.get('/books/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render('update-book', { book, title: 'Update Book' });
  } else {
    res.status(404).render('page-not-found', { error: new Error('Book Not Found') });
  }
}));

// Update Book Route
router.post('/books/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    try {
      await book.update(req.body);
      res.redirect('/books');
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        res.render('update-book', { book, title: 'Update Book', errors: error.errors });
      } else {
        throw error;
      }
    }
  } else {
    res.status(404).render('page-not-found', { error: new Error('Book Not Found') });
  }
}));

// Delete Book Route
router.post('/books/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy();
    res.redirect('/books');
  } else {
    res.status(404).render('page-not-found', { error: new Error('Book Not Found') });
  }
}));

module.exports = router;
