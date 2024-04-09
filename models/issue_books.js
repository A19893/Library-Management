'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class issue_books extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static issue_books_and_user_association;
    static associate(models) {
      // define association here
      this.issue_books_and_user_association = issue_books.belongsTo(models.user, {
        foreignKey: "user_id",
        as: "issued_books_of_user"
      })
    }
  }
  issue_books.init({
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
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id"
      }
    },
    book_id:{ 
      type: DataTypes.INTEGER,
      references: {
        model: "books",
        key: "id"
      }
    }
  }, {
    sequelize,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
    modelName: 'issue_books',
  });
  return issue_books;
};