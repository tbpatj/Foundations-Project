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