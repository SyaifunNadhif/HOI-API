const express = require('express');
const router = require('./routes');

const mongoose = require('mongoose');
const {MONGOURI} = require('./config/key');
const PORT = 5000
require('./db/models/user');


const app = express();













app.use(express.json());
app.use(router);

mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log("connection to mongo yeah");
});

mongoose.connection.on('error', (err) => {
    console.log("err connecting", err);
});

// require('./models/user');

// const customMiddleware = (req, res, next) => {
//     console.log("middleware executed!!");
//     next();
// }

// app.get('/', (req, res) => {
//     console.log("home");
//     res.send("hello world!");
// })

// app.get('/about', customMiddleware, (req, res) => {
//     console.log("about");
//     res.send("about page");
// })

// handle error 404
app.use((req, res) =>{
	return res.status(404).json({
		status: false,
		message: "page not found 404",
		data: null
	});
});

// handle error 500
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next)=>{
	console.log(err);
	return res.status(500).json({
		status: false,
		message: err.message,
		data: null
	});
});

app.listen(PORT, () => console.log(`Api Running at http://localhost:${PORT}`));