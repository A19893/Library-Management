const { sequelize } = require("../config").db_connection;
const { base_repository } = require("./base_repository");
const { book: book_model } = require('../models')
class users_repository extends base_repository {
    constructor(payload) {
        super(payload);
    }

    async add_book(payload) {
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

    async remove_book(params) {
        const transaction = await sequelize.transaction();
        const { book_id } = params;
        try {
            let options = {
                transaction,
            };
            let criteria = {
                uuid: book_id
            }
            const response = await this.destroy(criteria,false,[], options);
            await transaction.commit();
            return response;
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    }
}

module.exports = {
    books_repository_obj: new users_repository({
        db_connection: sequelize,
        model: book_model,
    }),
};