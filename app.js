const mongoose = require('mongoose');
const express = require('express');


const app = express();

const userRoutes = require('./src/routes/user');
const taskRoutes = require('./src/routes/task');


app.use(express.json())
app.use('/users', userRoutes);
app.use('/tasks', taskRoutes); 


const MONGODB_URI= // Mongodb URI 'mongodb+srv://username@cluster0.zlakc.mongodb.net/apidbname?retryWrites=true&w=majority';

mongoose
.connect(MONGODB_URI)
.then(() => {
    app.listen(3000);
})
.catch(err => {
    console.log(err)
})

