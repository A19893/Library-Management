const { http_status_code } = require("../libs/constants");
const { custom_error } = require("../libs/error");
const { books_repository_obj } = require("../repositories/books_repository");
const { issue_books_repository_obj } = require("../repositories/issue_book_repository");
const { users_repository_obj } = require("../repositories/users_repository");
const { Op } = require("sequelize")
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

const remove_book = async (user, params) => {
    const { book_id } = params;
    const is_user = await users_repository_obj.find_user({email: user.email});
    if(!is_user.isAdmin){
        throw new custom_error("You are not authorized to do this operation", http_status_code.UNAUTHORIZED)
    }
    const book = await books_repository_obj.find_one({uuid:  book_id})
    const is_book_issued = await issue_books_repository_obj.find_one({book_id : book.dataValues.id})
    if(is_book_issued){
        throw new custom_error("Book is issued to someone", http_status_code.CONFLICT)
    }
    const removed_book = await books_repository_obj.remove_book({ book_id })
    return removed_book;
};

const update_book_status = async (params, user) => {
    const { book_id } = params;
    const is_user = await users_repository_obj.find_user({email: user.email});
    if(!is_user.isAdmin){
        throw new custom_error("You are not authorized to do this operation", http_status_code.UNAUTHORIZED)
    }
    const book = await books_repository_obj.find_one({uuid:  book_id})
    if(!book){
        throw new custom_error("Book not exists", http_status_code.BAD_REQUEST);
    }
    const payload = {
        is_available: true
    }
    const updated_book = await books_repository_obj.update_book(params, payload)
    return updated_book;
}

const get_borrowed_books = async () => {
    const response = await issue_books_repository_obj.get_books();
    return response;
}

const get_returned_books = async () => {
    let criteria = {
        deleted_at: {
            [Op.not]: null // Fetch records where deleted_at is not null
        }
    };
    const response = await issue_books_repository_obj.get_books(criteria);
    return response;
}
module.exports = {
    add_book,
    issue_book,
    update_book_status,
    remove_book,
    get_borrowed_books,
    get_returned_books
};
