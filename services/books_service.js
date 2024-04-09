
const { utils } = require("../libs");
const { http_status_code } = require("../libs/constants");
const { custom_error } = require("../libs/error");
const { generateToken } = require("../libs/utils");
const { books_repository_obj } = require("../repositories/books_repository");
const { issue_books_repository_obj } = require("../repositories/issue_book_repository");

const add_book = async (payload) => {
    const { title, author, genre} = payload;
    const registered_user = await books_repository_obj.add_book({ title, author, genre})
    return registered_user;
};

const issue_book = async ( user, params) => {
    const { book_id } = params;
    const issued_books = await issue_books_repository_obj.issue_book({ user_id : user.id, book_id})
    return issued_books;
};

const remove_book = async (params) => {
    const { book_id } = params;
    const book = await books_repository_obj.find_one({uuid:  book_id})
    const is_book_issued = await issue_books_repository_obj.find_one({book_id : book.dataValues.id})
    if(is_book_issued){
        throw new custom_error("Book is issued to someone", http_status_code.CONFLICT)
    }
    const removed_book = await books_repository_obj.remove_book({ book_id })
    return removed_book;
};

const update_book_status = async (userId, payload) => {
    const user = await user_model.findById(userId);

    if (!user) {
        throw new custom_error("User not exists!");
    }
    const updated_user = await user_model.findByIdAndUpdate(
        userId,
        payload,
        {
            new: true,
        }
    );
    return updated_user;
}

module.exports = {
    add_book,
    issue_book,
    update_book_status,
    remove_book
};
