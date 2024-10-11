const bodyParser = require('body-parser')

const express = require('express');
const Book = require('./models/book');

const app = express();
app.use(express.json());

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://User:Password@cluster0.zpsav.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(err => console.log('Connexion à MongoDB échouée :', err));

// app.use((req, res) => {
//   res.json({ message: 'Votre requête a bien été reçue !' }); 
// });

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());

app.post('/api/books', (req, res, next) => {
  delete req.body._id;
  const book = new Book({
    ...req.body
  });
  thing.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
    .catch(error => res.status(400).json({ error }));
});

app.get('/api/books/:id', (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error }));
});

app.get('/api/stuff', (req, res, next) => {
  Book.find()
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({ error }));
});

// app.post('/api/books', (req, res, next) => {
//   console.log(req.body);
//   res.status(201).json({
//     message: 'Objet créé !'
//   });
// });

// app.get('/api/books', (req, res, next) => {
//   const books = [
//     {
//       _id: 'oeihfzeoi',
//       title: 'Beliy klyk',
//       author: 'J. London',
//       imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
//       year: 1956,
//       userId: 'qsomihvqios',
//       genre: 'Romain',
//       averageRating: 5,
//     },
//     {
//       _id: 'oeihfzeomoihi',
//       title: 'Zov predkov',
//       author: 'J. London',
//       imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
//       year: 1956,
//       userId: 'qsomihvqios',
//       genre: 'Romain',
//       averageRating: 5,
//     },
//   ];
//   res.status(200).json(books);
// });

module.exports = app;