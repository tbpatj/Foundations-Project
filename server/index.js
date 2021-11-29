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
	res.sendFile(path.join(__dirname, '../client/main/index.html'));
});
app.use('/home/js', express.static(path.join(__dirname,'../client/main/main.js')));
app.use('/home/css', express.static(path.join(__dirname,'../client/main/stylin.css')));
app.use('/viewsIcon',express.static(path.join(__dirname,'../resources/icons/views.png')));

app.get('/signup', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/signup/index.html'));
});
app.use('/signup/js', express.static(path.join(__dirname,'../client/signup/main.js')));
app.use('/signup/css', express.static(path.join(__dirname,'../client/signup/stylin.css')));



//Database
const {seed} = require('./database/baseController');
const {createUser,loginUser,getUser} = require('./database/userController');
const {createPost,garbage} = require('./database/postController');
const password = require('./password');
app.post('/new/user',createUser);


app.post('/login/attempt', loginUser);

//** LOGIN SCREEN **/
app.get('/login/', async (req, res) => {
	res.sendFile(path.join(__dirname, '../client/login/index.html'));
});
app.use('/login/js', express.static(path.join(__dirname,'../client/login/main.js')));
app.use('/login/css', express.static(path.join(__dirname,'../client/login/stylin.css')));





//** Users */
app.get('/users/info/:userID',getUser);

app.use('/users/js',express.static(path.join(__dirname,'../client/userProfiles/main.js')));
app.use('/users/css',express.static(path.join(__dirname,'../client/userProfiles/stylin.css')));
app.get('/users/:userID', async (req, res) => {
	if(req.params.userID !== "js" && req.params.userID !== "css"){
		res.sendFile(path.join(__dirname, '../client/userProfiles/index.html'));
	}
	//res.status(200).send("garbage");
});

app.post('/new/post',createPost);

//seed();

app.listen(port, () => {
	console.log(`We are running on ${port}`);
});
