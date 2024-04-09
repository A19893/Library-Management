const { sequelize } = require("../config").db_connection;
const { base_repository } = require("./base_repository");
const { issue_books: issue_book_model } = require('../models')
class issue_book_repository extends base_repository {
    constructor(payload) {
        super(payload);
    }

    async issue_book(payload) {
        const transaction = await sequelize.transaction();
        try {
            let options = {
                transaction,
            };
            const response = await this.create(payload, options);
            await transaction.commit();
            return response;
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    }
}

module.exports = {
    issue_books_repository_obj: new issue_book_repository({
        db_connection: sequelize,
        model: issue_book_model,
    }),
};