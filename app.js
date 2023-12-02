const dotenv = require('dotenv');
dotenv.config({path: './.env'})
const express = require('express');
const app = express();
const mongoose = require('mongoose')
const userRouter = require('./routes/userRoute')
const blogRouter = require('./routes/blogRoute')

app.use(express.json()) 
app.use("/api/v1/users", userRouter) //  http://localhost:5000/api/v1/users
app.use("/api/v1/blogs", blogRouter);

mongoose.connect(process.env.MONGODB_CONN_STR).then(() => {
    app.listen(5000, () => {
        console.log('Server is listening on port 5000');
    })
}).then(() => {
    console.log('Database Connected');
}).catch(error => {
    console.log(error);
})




