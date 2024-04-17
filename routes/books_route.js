const { books_controller } = require('../controllers');
const authorize_middleware = require('../middlewares/auth')
const router = require('express').Router();

router.post('/', authorize_middleware , books_controller.add_books);
router.get('/', authorize_middleware, books_controller.fetch_books);
router.get('/borrow', authorize_middleware, books_controller.fetch_borrow_books);
router.get('/return', authorize_middleware, books_controller.fetch_returned_books);
router.post('/issue/:book_id', authorize_middleware ,  books_controller.issue_books);
router.get('/:book_id', authorize_middleware, books_controller.fetch_specific_books);
router.patch('/:book_id', authorize_middleware, books_controller.update_book_status);
router.delete('/:book_id', authorize_middleware, books_controller.remove_books);
router.delete('/return/:book_id', authorize_middleware, books_controller.return_book);

module.exports = router; 