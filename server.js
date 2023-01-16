const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const cors = require('cors');
const spawn = require('child_process').spawn;
require('dotenv').config()

const app = express();
app.use(cors());
app.use(bodyparser.json());

mongoose.connect('mongodb://mongoadmin:secret@localhost:1888/?authMechanism=DEFAULT', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'users',
 })   
 .then(() => console.log("Database connected!"))
 .catch(err => console.log(err));

const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`server listening on: ${PORT}`)
})