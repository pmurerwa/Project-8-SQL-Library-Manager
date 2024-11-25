var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var booksRouter = require("./routes/books");

// Import the models (and Sequelize instance) from the index.js file
const db = require("./models");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Middleware setup
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public"))); //Serve Static Files

// Routes
app.use("/", indexRouter);
app.use("/books", booksRouter);

// IIFE to sync/connect and authenticate the database
(async () => {
  // Sync models with the database
  try {
    await db.sequelize.sync();
    console.log("Database synced successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
  // Authenticate the database connection
  try {
    await db.sequelize.authenticate();
    console.log("Database connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

// // catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error("Oops, page not found");
  err.status = 404;
  next(err);
  //next(createError(404));
});

// Global error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message || "An unexpected error occurred.";
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // Log the error details
  console.error(`Error Status: ${err.status || 500}`);
  console.error(`Error Message: ${err.message}`);

  // render the error page
  res.status(err.status || 500);
  res.render(err.status === 404 ? "page-not-found" : "error", { error: err });
  //res.render('error');
});

module.exports = app;
