const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const bookCtrl = require('../controllers/book');

router.get('/', bookCtrl.getAllBook); //pas de auth en frontend
router.post('/', auth, multer, bookCtrl.createBook);
router.get('/bestrating', bookCtrl.getBestRating); //pas de auth en frontend
router.get('/:id', bookCtrl.getOneBook); //pas de auth en frontend
router.put('/:id', auth, multer, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);
router.post('/:id/rating', auth, bookCtrl.addRating);

module.exports = router;