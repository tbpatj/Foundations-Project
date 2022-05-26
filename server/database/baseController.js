//require('dotenv').config();
const Sequelize = require('sequelize');
const port = process.env.PORT || 4005;
const CONNECTION_STRING = 

const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
});


module.exports = {
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
