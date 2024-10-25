const bodyParser = require('body-parser')

const express = require('express');
const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');
const path = require('path');

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

app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

// app.post('/api/books', (req, res, next) => {
//   console.log(req.body);
//   res.status(201).json({
//     message: 'Objet créé !'
//   });
// });


module.exports = app;