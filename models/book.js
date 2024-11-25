"use strict"; 
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Book.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false, // Ensures the value cannot be null
        validate: {
          notNull: {
            msg: "Please provide a value for title.",
          },
          notEmpty: {
            msg: "The Title can not be empty.", // Error message if empty
          },
        },
      },
      author: {
        type: DataTypes.STRING,
        allowNull: false, // Ensures the value cannot be null
        validate: {
          notNull: {
            msg: "Please provide a value for Author.",
          },
          notEmpty: {
            msg: "The Author can not be empty.", // Error message if empty
          },
        },
      },
      genre: {
        type: DataTypes.STRING,
        allowNull: true, // Allows null values
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: true, // Allows null values
        validate: {
          isInt: {
            msg: "Year must be an integer.", // Validates that the value is an integer
          },
        },
      },
    },
    {
      sequelize, // Passes the sequelize instance
      modelName: "Book", // Names the model
    }
  );
  return Book;
};