const express = require('express');
const bookmarkControllers = require('../controller/bookmarkControllers');
const router = express.Router();

// @route - /api/v1/bookmark/
router
    .route('/')
    .get(bookmarkControllers.getAllBookmark)
    .post(bookmarkControllers.createNewBookmark)
    .delete(bookmarkControllers.deleteAllBookmark);
    

// @route - /api/v1/bookmark/someid
router
    .route('/:id')
    .get(bookmarkControllers.getBookmarkById)
    .delete(bookmarkControllers.deleteBookmarkById);

module.exports = router;