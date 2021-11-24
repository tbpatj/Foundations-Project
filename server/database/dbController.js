//require('dotenv').config();
const Sequelize = require('sequelize');
const port = process.env.PORT || 4005;
const CONNECTION_STRING = 'postgres://glxjahpobbmlfw:e2c0ac7d1696d9f37e9be23cdbf5bcd79a34aa1977b66d0f7ba7ded38eaca9cd@ec2-44-199-85-33.compute-1.amazonaws.com:5432/d4p4tddrqd90p0';

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



module.exports = {
    deleteUser: (req, res) => {

    },
    loginUser: (req, res) => {

    },
    /** CREATE USER FUNCTION  */
    createUser: function(req, res) {
        //Log what the user sent in then destructure it
        console.log(req.body);
        let {firstName, lastName, email,password} = req.body;

        let hashedP = hashPassword(password);
        //create the user
        sequelize.query(`
            INSERT INTO users (first_name, last_name, email, password_hash)
            VALUES ('${firstName}','${lastName}','${email}','${hashedP}');
        `)
        .then( dbRes => {
            console.log(dbRes);
            res.status(200).send({userID: dbRes[1], message: "User created successfully"});
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

    /** SEEDING FUNCTION  */
    seed: (req,res) => {
        let seedFile = require('../../resources/SQL/DataBaseSeed.js').seed;
        // console.log(seedFile);
        
        //
        sequelize.query(seedFile).then( dbRes => {
            console.log("yay");
        }).catch(error => console.log(error));
    }
 }