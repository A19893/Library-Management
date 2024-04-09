const { books_controller } = require('../controllers');
const authorize_middleware = require('../middlewares/auth')
const router = require('express').Router();

router.post('/', authorize_middleware , books_controller.add_books);
router.post('/issue/:book_id', authorize_middleware ,  books_controller.issue_books);
router.delete('/:book_id', authorize_middleware, books_controller.remove_books);
module.exports = router;