//require('dotenv').config();
const Sequelize = require('sequelize');
const port = process.env.PORT || 4005;
const CONNECTION_STRING = 'postgres://glxjahpobbmlfw:e2c0ac7d1696d9f37e9be23cdbf5bcd79a34aa1977b66d0f7ba7ded38eaca9cd@ec2-44-199-85-33.compute-1.amazonaws.com:5432/d4p4tddrqd90p0';

var sessionAccum = 1;

const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
});

//Get password stuff
const {hashPassword, checkPassword} = require('../password');
async function createSession(userID){
    let sessionObj = null;
    let sessionKey = hashPassword(`session${sessionAccum}`);
    await sequelize.query(`
        INSERT INTO sessions (user_id,session_key)
        VALUES ('${userID}','${sessionKey}')
        RETURNING session_id;
    `).then( dbRes => {
        sessionAccum++;
        sessionObj = {userID: userID, sessionKey: sessionKey};
    }).catch(error => console.log(error));
    return sessionObj
}
async function verifyPass(query){
    let verifiedObj = null;
    await sequelize.query(`SELECT password_hash, user_id FROM users
            WHERE username = '${query.user}'`)
            .then( dbRes => {
                let {password_hash, user_id} = dbRes[0][0];
                let check = checkPassword(query.password,password_hash);
                console.log(check);
                if(check){
                    verifiedObj = {pass:true, message:"passed", user_id:user_id};
                } else {
                    verifiedObj = {pass:false, message:"incorrect login attempt"};
                }
            }).catch(error => {
                console.log(error);
                verifiedObj = {pass:false, message:"unable to find login info"};
            });
    return verifiedObj;
}


module.exports = {
    getUser: (req, res) => {
        console.log(req.params.user);
        sequelize.query(`
            SELECT * FROM posts
            WHERE user_id = '${req.params.user}'
        `).then( dbRes => {
            res.status(200).send(dbRes[0]);
        })
    },
    deleteUser: (req, res) => {

    },
    loginUser: async (req, res) => {
        if(req.query.user){
            let verifyObj = await verifyPass(req.query);
            if(verifyObj.pass){
                let sessionKey = await createSession(verifyObj.user_id);
                
                if(sessionKey !== null){
                    res.status(200).send({sessionKey: sessionKey.sessionKey,message:"You're in bub"});
                } else res.status(400).send("failed to create session");
            } else {
                res.status(400).send("No user with that name found or incorrect password");
            }
        }
        //send the user a session key upon successful entry, they will use this key when they try to access pages and such
    },
    /** CREATE USER FUNCTION  */
    createUser: function(req, res) {
        //Log what the user sent in then destructure it
        console.log(req.body);
        let {firstName, lastName, email, username, password} = req.body;

        let hashedP = hashPassword(password);
        //create the user
        sequelize.query(`
            INSERT INTO users (first_name, last_name, email, username, password_hash)
            VALUES ('${firstName}','${lastName}','${email}','${username}','${hashedP}')
            RETURNING user_id;
        `)
        .then( dbRes => {
            console.log(dbRes);
            res.status(200).send({userID: dbRes[0][0].user_id, message: "User created successfully"});
        })
        .catch( error => {
            //check the errors if the user sent in a email that already exists we will report that back to them
            if(error.errors[0].message === 'email must be unique'){
                res.status(400).send({message:'email must be unique'});
                return;
            }
            res.status(400).send("an error occured upon creation of user");
        });
    },

    
 }