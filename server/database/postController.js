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
async function verifyUser(sessionKey, userID){
    let verified = false;
    console.log('verifying');
    await sequelize.query(`
            SELECT * FROM sessions
            WHERE session_key = '${sessionKey}'
    `)
    .then( dbRes => {
        console.log(dbRes);
        if(dbRes[0][0].user_id === userID) verified = true;
        console.log(`verfied status: ${verified}`);
    })
    .catch(error => console.log(error));
    return verified;
}

async function createContent(content){
    let contentReturn = -1;
    if(typeof (content) != undefined){
        await sequelize.query(`
            INSERT INTO pictures (image_src)
            VALUES ('${content}')
            RETURNING picture_id;
        `)
        .then( dbRes => {
            console.log("-------Content Item-------");
            console.log(dbRes[0][0]);
            contentReturn = dbRes[0][0].picture_id;
        })
        .catch(error => {
            
        })
    }
    return contentReturn;
}
async function createPostItem(body){
    let {userID, caption, content_url} = body;
    let returnedID = -1;
    console.log("posting");
    console.log(content_url);
    await sequelize.query(`
        INSERT INTO posts (user_id, post_type, caption, post_views, likes, game_id, threads, content_url)
        VALUES ('${userID}',1,'${caption}',0,0,1,'1','${content_url}')
        RETURNING post_id;
    `)
    .then( dbRes => {
        console.log("-------Post Item-------");
        console.log(dbRes);
        returnedID = dbRes[0][0].post_id;
    })
    .catch(error => console.log(error))

    return returnedID;
}




module.exports = {
    verifyUser: verifyUser,
     createPost: async (req, res) => {
         let {userID, sessionKey} = req.body;
         console.log("User ID: " + userID);
        //Verify user
        let verified = await verifyUser(sessionKey,parseInt(userID));
        if(verified){
            //create content
            // let contentID = await createContent(contentURL);
            // if(contentID !== -1 && contentID !== undefined && contentID !== null){
                //after we have verified that the content was created we will push the post data to the server
            let postID = await createPostItem(req.body);
            if(postID !== -1 && postID !== undefined && postID !== null){
                console.log(postID);
                res.status(200).send({message:"Post creation successful",postID: postID})
            } else res.status(400).send({message:"failed to create post, content was created successfully", contentID: contentID})
            // } else res.status(400).send({message:"Failed to create content, try again"});
        } else res.status(400).send({message:"invalid session"});
    },
    garbage: (req,res) => {

    }
};