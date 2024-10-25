const Book = require('../models/book');
const fs = require('fs');
const sharp = require('sharp');

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);

    delete bookObject._id;
    delete bookObject._userId;

    const uploadedImagePath = `images/${req.file.filename}`;  // Путь к загруженному файлу
    const optimizedImagePath = `images/optimized-${req.file.filename}`;  // Путь для оптимизированного файла

    // Optimisation image - sharp
    sharp(uploadedImagePath)
        .resize({ width: 500 })  // 
        .toFormat('jpeg')        // 
        .jpeg({ quality: 80 })   // 
        .toFile(optimizedImagePath)
        .then(() => {
            // supprime vieux image
            fs.unlink(uploadedImagePath, (err) => {
                if (err) {
                    console.error(err);
                }
            });

            // Сохраняем данные книги с URL оптимизированного изображения
            const book = new Book({
                ...bookObject,
                userId: req.auth.userId,
                imageUrl: `${req.protocol}://${req.get('host')}/${optimizedImagePath}` // route pour image optimizé
            });

            book.save()
                .then(() => res.status(201).json({ message: 'Livre enregistré avec image optimisée!' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error: 'Erreur lors de l\'optimisation de l\'image' }));

    // const book = new Book({
    //     ...bookObject,
    //     userId: req.auth.userId,
    //     imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    // });

    // book.save()
    //     .then(() => { res.status(201).json({ message: 'Objet enregistré !' }) })
    //     .catch(error => { res.status(400).json({ error }) })
};

exports.addRating = (req, res, next) => {
    const { rating } = req.body; // 
    console.log(rating);
    const userId = req.auth.userId;
    console.log(userId);
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (!book) {
                return res.status(404).json({ message: 'Book not found' });
            }

            const existingRating = book.ratings.find(r => r.userId === userId);
            if (existingRating) {
                return res.status(400).json({ message: 'Rating already added by user' });
            }

            book.ratings.push({ userId, rating });
            // 
            const totalRatings = book.ratings.length;
            const totalScore = book.ratings.reduce((acc, rate) => acc + rate.rating, 0);
            const newAverageRating = totalScore / totalRatings;

            // 
            book.averageRating = Math.round(newAverageRating);

            console.log('book.ratings');
            console.log(req.body);

            // Save book with new data
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

        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};


exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete bookObject._userId;
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(403).json({ message: 'unauthorized request' });
            } else {
                // If new image is loaded (req.file exists)
                if (req.file) {
                    const uploadedImagePath = `images/${req.file.filename}`;
                    const optimizedImagePath = `images/optimized-${req.file.filename}`;

                    // Image Optimisation with sharp
                    sharp(uploadedImagePath)
                        .resize({ width: 500 })  // change size of image
                        .toFormat('jpeg')
                        .jpeg({ quality: 80 })   // 
                        .toFile(optimizedImagePath)
                        .then(() => {
                            // Delete original image
                            //console.log(uploadedImagePath);
                            fs.unlink(uploadedImagePath, (err) => {
                                if (err) {
                                    console.error(err);
                                }
                            });

                            // Delete old image
                            if (book.imageUrl) {
                                const oldImagePath = book.imageUrl.split('/images/')[1];
                                //console.log(oldImagePath);
                                fs.unlink(`images/${oldImagePath}`, (err) => {
                                    if (err) {
                                        console.error('Erreur with deleting old image:', err);
                                    }
                                });
                            }

                            // Update BD
                            Book.updateOne({ _id: req.params.id }, {
                                ...bookObject,
                                imageUrl: `${req.protocol}://${req.get('host')}/${optimizedImagePath}`,
                                _id: req.params.id
                            })
                                .then(() => res.status(200).json({ message: 'Objet modifié!' }))
                                .catch(error => res.status(401).json({ error }));
                        })
                        .catch(error => res.status(500).json({ error: 'Erreur lors de l\'optimisation de l\'image' }));
                } else {
                    // If image was not changed, update other datd of books
                    Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Objet modifié!' }))
                        .catch(error => res.status(401).json({ error }));
                }

            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({ error }));
};

exports.getAllBook = (req, res, next) => {
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
};

//Renvoie un tableau des 3 livres de la base de données ayant la meilleure note moyenne.
exports.getBestRating = (req, res, next) => {
//    console.log('Получен запрос на /bestrating');
    Book.find()
    .sort({ averageRating: -1 }) // Сортировка по averageRating в порядке убывания
    .limit(3) // Ограничиваем результат до 3 книг
    //.select('_id title author year imageUrl genre averageRating') // Выбираем только необходимые поля
    .then(books => {
      if (!books.length) {
        return res.status(404).json({ message: 'No books found' });
      }
      res.status(200).json(books); // Отправляем массив книг на фронтенд
    })
    .catch(error => res.status(500).json({ error }));
};
