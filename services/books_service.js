const { sequelize } = require("../config/db_connection");
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
    const is_user = await users_repository_obj.find_user({email: user.email});
    if(!is_user){
        throw new custom_error("User not exists", http_status_code.NOT_FOUND);
    }
    const { book_id } = params;
    const book_issued_to_user = await books_repository_obj.find_one({uuid: book_id});
    if(!book_issued_to_user){
        throw new custom_error("Bad request check the payload!", http_status_code.BAD_REQUEST)
    }
    const is_book_already_issued = await issue_books_repository_obj.find_one({book_id: book_issued_to_user.id})
    if(is_book_already_issued){
        throw new custom_error("Book is already issued to someone", http_status_code.CONFLICT);
    }
    const issued_books = await issue_books_repository_obj.issue_book({ user_id:user.id, book_id: book_issued_to_user.id})
    await books_repository_obj.update({id: book_issued_to_user.id}, {is_available : false});
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
        is_available: !book.is_available
    }
    const updated_book = await books_repository_obj.update_book(params, payload)
    return updated_book;
}

const get_borrowed_books = async (user) => {
    const is_user = await users_repository_obj.find_user({email: user.email});
    if(!is_user.isAdmin){
        throw new custom_error("You are not authorized to do this operation", http_status_code.UNAUTHORIZED)
    }
    let criteria = {
        deleted_at: {
            [Op.is]: null // Fetch records where deleted_at is  null
        }
    };
    const response = await issue_books_repository_obj.get_books(criteria);
    if(response.length == 0 ){
        throw new custom_error("No Book Issued till now", http_status_code.NO_CONTENT);
    }
    return response;
}

const get_returned_books = async (user) => {
    const is_user = await users_repository_obj.find_user({email: user.email});
    if(!is_user.isAdmin){
        throw new custom_error("You are not authorized to do this operation", http_status_code.UNAUTHORIZED)
    }
    let criteria = {
        deleted_at: {
            [Op.not]: null // Fetch records where deleted_at is not null
        }
    };
    const response = await issue_books_repository_obj.get_books(criteria);
    console.log(response)
    if(response.length == 0 ){
        throw new custom_error("No Book Borrowed till now", http_status_code.NO_CONTENT);
    }
    return response;
}

const fetch_books = async () => {
    const response = await books_repository_obj.find_all();
    return response;
}

const fetch_specific_books =  async (params) => {
    const {book_id} = params;
    const response = await books_repository_obj.find_one({uuid: book_id});
    return response;
}

const return_book = async (user, params) => {
  const { book_id } = params;
  const is_user = await users_repository_obj.find_user({ email: user.email });
  if (!is_user) {
    throw new custom_error("User not exists", http_status_code.NOT_FOUND);
  }
  const book = await books_repository_obj.find_one({ uuid: book_id });
  if (!book) {
    throw new custom_error("Book not exists", http_status_code.BAD_REQUEST);
  }
  const transaction = await sequelize.transaction();
  let options = {
    transaction,
  };
  try{
  await issue_books_repository_obj.destroy(
    { book_id: book.id },
    false,
    [],
    options
  );
  await books_repository_obj.update(
    { id: book.id },
    { is_available: true },
    [],
    options
  );
  await transaction.commit();
  return {
    status: "success",
    message: "Book returned successfully",
  };
}
catch(error){
    await transaction.rollback();
    throw new custom_error("Book did not get returned", http_status_code.BAD_REQUEST)
}
};

module.exports = {
    add_book,
    issue_book,
    update_book_status,
    remove_book,
    get_borrowed_books,
    get_returned_books,
    fetch_books,
    fetch_specific_books,
    return_book
};
