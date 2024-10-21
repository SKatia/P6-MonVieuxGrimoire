const Book = require('../models/book');
const fs = require('fs');

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  book.save()
  .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
};

exports.addRating = (req, res, next) => {
    const { rating } = req.body; // Извлекаем рейтинг из тела запроса
    console.log(rating);
    const userId = req.auth.userId;
    console.log(userId);
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (!book) {
                return res.status(404).json({ message: 'Book not found' });
            }
            // if (book.userId != req.auth.userId) {
            //     return res.status(401).json({ message: 'Not authorized' });
            // }

            const existingRating = book.ratings.find(r => r.userId === userId);
            if (existingRating) {
                return res.status(400).json({ message: 'Rating already added by user' });
            }

            // Добавляем рейтинг
            //console.log('avant push')
            book.ratings.push({ userId, rating });
            console.log('book.ratings');
            console.log(req.body); 

            // Сохраняем книгу с обновлёнными данными
            book.save()
                .then((savedBook) => {
                    console.log('Saved book:', savedBook);
                    //res.status(200).json({ message: 'Rating added successfully!' });
                    res.status(200).json(savedBook);
                })
                .catch((error) => {
                    console.error('Error saving book:', error);
                    res.status(500).json({ error });
                });
                // .then(() => res.status(200).json({ message: 'Rating added successfully!' }))
                // .catch((error) => res.status(500).json({ error }));
            

        })
        .catch((error) => {
            res.status(400).json({ error });
        });
  };
  
    
// exports.createBook =  (req, res, next) => {
//   delete req.body._id;
//   const book = new Book({
//     ...req.body
//   });
//   book.save()
//     .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
//     .catch(error => res.status(400).json({ error }));
// };

// exports.modifyBook = (req, res, next) => {
//   const book = new Book({
//     ...req.body
//   });
//   Book.updateOne({_id: req.params.id}, book)
//   .then(() => { res.status(201).json({ message: 'Book updated successfully!' }); })
//   .catch((error) => { res.status(400).json({error: error }); });
// };
exports.modifyBook = (req, res, next) => {
  const bookObject = req.file ? {
      ...JSON.parse(req.body.book),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete bookObject._userId;
  Book.findOne({_id: req.params.id})
      .then((book) => {
          if (book.userId != req.auth.userId) {
              res.status(401).json({ message : 'Not authorized'});
          } else {
              Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Objet modifié!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};

// exports.deleteBook = (req, res, next) => {
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
// };
exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id})
      .then(book => {
          if (book.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'});
          } else {
              const filename = book.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  Book.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};


exports.getOneBook =  (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
};

exports.getAllBook = (req, res, next) => {
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

// const Thing = require('../models/thing');

// exports.createThing = (req, res, next) => {
//   const thing = new Thing({
//     title: req.body.title,
//     description: req.body.description,
//     imageUrl: req.body.imageUrl,
//     price: req.body.price,
//     userId: req.body.userId
//   });
//   thing.save().then(
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
// };

// exports.getOneThing = (req, res, next) => {
//   Thing.findOne({
//     _id: req.params.id
//   }).then(
//     (thing) => {
//       res.status(200).json(thing);
//     }
//   ).catch(
//     (error) => {
//       res.status(404).json({
//         error: error
//       });
//     }
//   );
// };

// exports.modifyThing = (req, res, next) => {
//   const thing = new Thing({
//     _id: req.params.id,
//     title: req.body.title,
//     description: req.body.description,
//     imageUrl: req.body.imageUrl,
//     price: req.body.price,
//     userId: req.body.userId
//   });
//   Thing.updateOne({_id: req.params.id}, thing).then(
//     () => {
//       res.status(201).json({
//         message: 'Thing updated successfully!'
//       });
//     }
//   ).catch(
//     (error) => {
//       res.status(400).json({
//         error: error
//       });
//     }
//   );
// };

// exports.deleteThing = (req, res, next) => {
//   Thing.deleteOne({_id: req.params.id}).then(
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
// };

// exports.getAllStuff = (req, res, next) => {
//   Thing.find().then(
//     (things) => {
//       res.status(200).json(things);
//     }
//   ).catch(
//     (error) => {
//       res.status(400).json({
//         error: error
//       });
//     }
//   );
// };