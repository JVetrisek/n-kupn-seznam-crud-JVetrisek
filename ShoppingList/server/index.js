const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const app = express()


// MongoDB
mongoose.connect('mongodb://localhost:27017/shopping_list', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(error => {
        console.error('Failed to connect to MongoDB:', error);
    });

// Base ----------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Port ----------------------------------------------
const PORT = process.env.PORT || 5000;

// Controller---------------------------------------------
const itemController = require('./controller/item');
const userController = require('./controller/user');
const shoppingListController = require('./controller/shoppingList');

app.use('/shoppinglist', shoppingListController);
app.use('/item', itemController);
app.use('/user', userController);

// Server is running --------------------------------
app.listen(PORT, () => {
  console.log(`Server běží na portu ${PORT}`);
});