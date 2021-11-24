const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express(); 

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 4005;


//Send files to user
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/index.html'));
});
app.use('/js', express.static(path.join(__dirname,'../client/main.js')));
app.use('/css', express.static(path.join(__dirname,'../client/stylin.css')));
app.use('/viewsIcon',express.static(path.join(__dirname,'../resources/icons/views.png')))



//Database
const {seed,createUser} = require('./database/dbController');
const password = require('./password');
app.post('/new/user',createUser);

//seed();

app.listen(port, () => {
	console.log(`We are running on ${port}`);
});
