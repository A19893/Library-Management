const { handle_error } = require("../libs").error;
const { books_service } = require("../services");

const add_books = async (req, res) => {
  try {
    const response = await books_service.add_book(req.body);
    return res.status(201).json(response);
  } catch (error) {
    console.log("Error occured during adding book", error);
    handle_error(res,error)
  }
};

const remove_books = async (req, res) => {
  try {
    const response = await books_service.remove_book(req.params);
    return res.status(200).json(response);
  } catch (error) {
    console.log("Error occured during login user", error);
    handle_error(res,error)
  }
};

const issue_books = async (req, res) => {
  try {
    const response = await books_service.issue_book(req.user , req.params);
    return res.status(200).json(response);
  } catch (error) {
    console.log("Error occured during issuing books", error);
    handle_error(res,error)
  }
}

const update_book_status = async (req, res) => {
  try {
    const response = await user_service.update_user_status(
      req.params.userId,
      req.body
    );
    return res.status(200).json(response);
  } catch (error) {
    console.log("Error occured during updating a specific user status", error);
    handle_error(res,error)
  }
};

module.exports = {
  add_books,
  remove_books,
  update_book_status,
  issue_books
};
