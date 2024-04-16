'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static book_and_issue_book_association;
    static associate(models) {
      // define association here
      this.book_and_issue_book_association = Book.hasOne(models.issue_books, {
        foreignKey: "book_id",
        as: "issued_books"
      })
    }
  }
  Book.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      defaultValue: Sequelize.literal("uuid_generate_v4()"),
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6,50]
      }
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5,15]
      }
    },
    is_available: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    genre: {
      type: DataTypes.ENUM('THRILLER','ACTION','FANTASY','TRAVEL'),
      allowNull: false
    }
  }, {
    sequelize,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
    modelName: 'book',
  });
  return Book;
};