const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const bookCtrl = require('../controllers/book');

router.get('/', bookCtrl.getAllBook);
router.post('/', auth, multer, bookCtrl.createBook);
router.get('/:id', auth, bookCtrl.getOneBook);
router.put('/:id', auth, multer, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);

// router.get('/', auth, stuffCtrl.getAllStuff);
// router.post('/', auth, stuffCtrl.createThing);
// router.get('/:id', auth, stuffCtrl.getOneThing);
// router.put('/:id', auth, stuffCtrl.modifyThing);
// router.delete('/:id', auth, stuffCtrl.deleteThing);

// router.get('/', bookCtrl.getAllBook);
// router.post('/', bookCtrl.createBook);
// router.get('/:id', bookCtrl.getOneBook);
// router.put('/:id', bookCtrl.modifyBook);
// router.delete('/:id', bookCtrl.deleteBook);


// router.post('/', (req, res, next) => {
//   const book = new Book({
//     title: req.body.title,
//     description: req.body.description,
//     imageUrl: req.body.imageUrl,
//     price: req.body.price,
//     userId: req.body.userId
//   });
//   book.save().then(
//     () => {
//       res.status(201).json({
//         message: 'Post saved successfully!'
//       });
//     }
//   ).catch(
//     (error) => {
//       res.status(400).json({
//         error: error
//       });
//     }
//   );
// });

// router.get('/:id', (req, res, next) => {
//   Book.findOne({
//     _id: req.params.id
//   }).then(
//     (book) => {
//       res.status(200).json(book);
//     }
//   ).catch(
//     (error) => {
//       res.status(404).json({
//         error: error
//       });
//     }
//   );
// });

// router.put('/:id', (req, res, next) => {
//   const book = new Book({
//     _id: req.params.id,
//     title: req.body.title,
//     description: req.body.description,
//     imageUrl: req.body.imageUrl,
//     price: req.body.price,
//     userId: req.body.userId
//   });
//   Book.updateOne({_id: req.params.id}, book).then(
//     () => {
//       res.status(201).json({
//         message: 'Book updated successfully!'
//       });
//     }
//   ).catch(
//     (error) => {
//       res.status(400).json({
//         error: error
//       });
//     }
//   );
// });

// router.delete('/:id', (req, res, next) => {
//   Book.deleteOne({_id: req.params.id}).then(
//     () => {
//       res.status(200).json({
//         message: 'Deleted!'
//       });
//     }
//   ).catch(
//     (error) => {
//       res.status(400).json({
//         error: error
//       });
//     }
//   );
// });

// router.get('/' +
//   '', (req, res, next) => {
//   Book.find().then(
//     (books) => {
//       res.status(200).json(books);
//     }
//   ).catch(
//     (error) => {
//       res.status(400).json({
//         error: error
//       });
//     }
//   );
// });

// router.post('/', (req, res, next) => {
//   delete req.body._id;
//   const book = new Book({
//     ...req.body
//   });
//   book.save()
//     .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
//     .catch(error => res.status(400).json({ error }));
// });

// router.put('/:id', (req, res, next) => {
//   const book = new Book({
//     ...req.body
//   });
//   Book.updateOne({_id: req.params.id}, book)
//   .then(() => { res.status(201).json({ message: 'Book updated successfully!' }); })
//   .catch((error) => { res.status(400).json({error: error }); });
// });

// router.delete('/:id', (req, res, next) => {
//   Book.deleteOne({_id: req.params.id}).then(
//     () => {
//       res.status(200).json({
//         message: 'Deleted!'
//       });
//     }
//   ).catch(
//     (error) => {
//       res.status(400).json({
//         error: error
//       });
//     }
//   );
// });

// router.get('/:id', (req, res, next) => {
//   Book.findOne({ _id: req.params.id })
//     .then(book => res.status(200).json(book))
//     .catch(error => res.status(404).json({ error }));
// });

// router.get('/', (req, res, next) => {
//   Book.find()
//     .then(books => res.status(200).json(books))
//     .catch(error => res.status(400).json({ error }));
// });

module.exports = router;