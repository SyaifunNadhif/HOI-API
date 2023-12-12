require('dotenv').config();
const express = require('express');
const router = require('./routes');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');

const PORT = process.env.PORT || 8000;



// Ambil URI MongoDB dari berkas .env
const mongodbURI = process.env.MONGODB_URI;
// console.log(mongodbURI);
app.use(express.json());
app.use(router);

// Konfigurasi koneksi MongoDB menggunakan Mongoose
mongoose.connect(mongodbURI, { useNewUrlParser: true, useUnifiedTopology: true });


// Handling event koneksi MongoDB
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
   console.log('Connected to MongoDB');
});

// handle error 404
app.use((req, res) =>{
	return res.status(404).json({
		status: false,
		message: "page not found 404",
		data: null
	});
});

// handle error 500
app.use((err, req, res, next)=>{
	console.log(err);
	return res.status(500).json({
		status: false,
		message: err.message,
		data: null
	});
});

if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // Menampilkan log di konsol dalam format dev

app.listen(PORT, () => console.log(`Api Running at http://localhost:${PORT}`));