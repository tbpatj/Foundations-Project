const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express(); 

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const port = process.env.PORT || 4005;


//Send files to user
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/index.html'));
});
app.use('/js', express.static(path.join(__dirname,'../client/main.js')));
app.use('/css', express.static(path.join(__dirname,'../client/stylin.css')));
app.use('/viewsIcon',express.static(path.join(__dirname,'../resources/icons/views.png')))



//Database
const {seed} = require('./database/baseController');
const {createUser,loginUser,getUser} = require('./database/userController');
const {createPost,garbage} = require('./database/postController');
const password = require('./password');
app.post('/new/user',createUser);


app.get('/login/attempt', loginUser);

//** LOGIN SCREEN **/
app.get('/login/', async (req, res) => {
	res.sendFile(path.join(__dirname, '../client/login/index.html'));
});
app.use('/login/js', express.static(path.join(__dirname,'../client/login/main.js')));
app.use('/login/css', express.static(path.join(__dirname,'../client/login/stylin.css')));
app.post('/login/values', (req,res) => {
	//console.log(res);
	console.log(req.body);
	//console.log(req);
	res.status(400).send("you sent it");
})




//** Users */
app.get('/users/:user', async (req, res) => {
	res.sendFile(path.join(__dirname, '../client/index.html'));
});
app.post('/new/post',createPost);

//seed();

app.listen(port, () => {
	console.log(`We are running on ${port}`);
});
