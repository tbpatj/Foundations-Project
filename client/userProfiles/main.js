let myUserID = -1;
let userInfo = {};

let username = document.getElementById('username');
let likedGames = document.getElementById('liked-games');
let highlightDiv = document.getElementById('highlighted-clip-contain');
let aboutText = document.getElementById('about-me-text');
let postsContain = document.getElementById('posts-container');

//
let backgroundImg = document.getElementById('background-image');
let profileImg = document.getElementById('profile-pic');
let contentViewer = document.getElementById('view-user-profile');

let usercontent = document.getElementById('view-user-container');

// backgroundImg.addEventListener('dblclick',backgroundPic);
// profileImg.addEventListener('click',profilePic);

//get the post creator elements
let createPost = document.getElementById('create-new-post-container');
let outsideCPost = document.getElementById('outside-post-cont');
let createPostBttn = document.getElementById('post-bttn');


backgroundImg.addEventListener('click',backgroundPic);
createPostBttn.addEventListener('click',createNewPost);
profileImg.addEventListener('click',userProfileImg);
outsideCPost.addEventListener('click',hidePostCreation);

async function backgroundPic( target ) {
    contentViewer.classList.remove('hidden');
    outsideCPost.classList.remove('hidden');
    usercontent.innerHTML = `
    <img src='${userInfo.background_pic_url}' class='img-content'>
    <label>yup ypu</label>
    <input id="view-input-box" type="text" placeholder="New URL" />
    `;
    let mButton = document.createElement("div");
    mButton.textContent = "Update URL";
    mButton.id = "my-bttn";
    mButton.classList.add("my-bttn");
    mButton.addEventListener('click',updateBackgroundURL);
    console.log('did it');
    usercontent.appendChild(mButton);
}

async function updateBackgroundURL( target ){
    console.log("test");
    let img = (document.getElementById("view-input-box").value);
    await axios.put('/user/update', {
        backgroundURL: img,
        sessionKey: window.localStorage.getItem('highlight_s_key'),
        userID: myUserID
    }).then(res =>  {
        backgroundImg.src = img
    });
}

async function userProfileImg( target ){
    console.log('yeah');
    contentViewer.classList.remove('hidden');
    outsideCPost.classList.remove('hidden');

    usercontent.innerHTML = `
    <img src='${userInfo.profile_pic_url}' class='img-content'>
    <label>yup ypu</label>
    <input id="view-input-box" type="text" placeholder="New URL" />
    `;
    
    let mButton = document.createElement("div");
    mButton.textContent = "Update URL";
    mButton.id = "my-bttn";
    mButton.classList.add("my-bttn");
    mButton.addEventListener('click',updateProfileURL);
    console.log('did it');
    usercontent.appendChild(mButton);
}

async function updateProfileURL( target ){
    console.log("test");
    let img = (document.getElementById("view-input-box").value);
    await axios.put('/user/update', {
        profileURL: img,
        sessionKey: window.localStorage.getItem('highlight_s_key'),
        userID: myUserID
    }).then(res =>  {
        profileImg.src = img
    });
}

async function createNewPost( event ){
    //get form elements
    event.target.removeEventListener("click",createNewPost);
    let postInfo = document.getElementById('post-info');
    let urlInput = document.getElementById('url-input');
    let fileInput = document.getElementById('file-input');
    let caption = document.getElementById('post-text-input');
    let gameIDs = document.getElementById('game-ids');
    let threads = document.getElementById('threads-input');
    let taggedUsers = document.getElementById('tagged-users');
    let publication = document.getElementById('publication-type');
    
    if(urlInput.value !== "" && gameIDs !== ""){
        createPostBttn.textContent="Creating Post";
        console.log(myUserID);
        let created = false;
        await axios.post('/new/post', {
            userID:myUserID,
            caption: caption.value,
            content_url: urlInput.value,
            sessionKey: window.localStorage.getItem('highlight_s_key'),
            gameIDs: gameIDs.value,
            threads: threads.value,
            taggedUsers: taggedUsers.value,
            publication: publication.value
            
        }).then( res => {
            console.log(res);
            if(res.data.postID){
                created = true;
            }
        })
        if(created === true){
            //create success animation and clear the post
            createPostBttn.classList.add("hidden");
            postInfo.textContent = "Successfully Created Post";
            postInfo.classList.remove('post-info-hid');
            postInfo.classList.add('post-info-good');
            await sleep(3000);
            postInfo.classList.add('post-info-hid');
            postInfo.classList.remove('post-info-good');
            await sleep(500);
            postInfo.value = "";
            urlInput.value = "";
            caption.value = "";
            gameIDs.value = "";
            threads.value = "";
            taggedUsers.value = "";

            event.target.classList.add('hidden');
            createPost.classList.add('hidden');
        }
        createPostBttn.textContent="Create Post";
    } else {
        postInfo.textContent = "Needs at least a content URL, and a selected game";
            postInfo.classList.remove('post-info-hid');
            postInfo.classList.add('post-info-bad');
            await sleep(2000);
            postInfo.classList.add('post-info-hid');
            postInfo.classList.remove('post-info-bad');
    }
    event.target.addEventListener("click",createNewPost);
    
}

function hidePostCreation(event ){
    event.target.classList.add('hidden');
    createPost.classList.add('hidden');
    contentViewer.classList.add('hidden');
    
}

function showPostCreation(event){
    outsideCPost.classList.remove('hidden');
    createPost.classList.remove('hidden');
}

getStartup();

async function getStartup(){
    let splits = window.location.href.split("/");
    let userPageID = splits[splits.length - 1];
    console.log(userPageID);
    let response = [];

    //create add new post option, if the user logged in is the user whose profile page we are currenlty on
    myUserID = window.localStorage.getItem("highlight_userID");
    if(myUserID === userPageID){
        let createBttn = document.createElement('div');
        createBttn.id = "add-post";
        createBttn.classList.add("post-container");
        createBttn.innerHTML = `
                    <div class='post-contain-visual center'>
                        <div id="plus-1"></div>
                        <div id="plus-2"></div>
                    </div>`;
        createBttn.addEventListener('click',showPostCreation);
        postsContain.appendChild(createBttn);
    }

    //get all the posts, need to test to make sure the user can see this users posts, or make public and private posts
    await axios.get(`/users/info/${userPageID}`).then(res => {
        console.log(res);
        response = res.data[0];
    }).catch(error => console.log(error));
    console.log("after");
    console.log(response.length);
    if(response.length > 0){
        userInfo = response[0];
        if(response[0].profile_pic_url !== null)  profileImg.src = response[0].profile_pic_url;
        if(response[0].background_pic_url !== null) backgroundImg.src = response[0].background_pic_url;
        console.log(response[1]);
        
        username.textContent = response[0].username;
        aboutText.textContent = response[0].bio;
        console.log(response.length);
        for(let i = 1; i < response.length; i ++){
            console.log('yup');
            let post = document.createElement('div');
            post.classList.add('post-container');
            post.id = `post-${response[i].post_id}`;
            post.innerHTML = `
            <div class='post-contain-visual center'>
                <img src="${response[i].content_url}" id="post-img" class="post-img">
            </div>
            `;

            postsContain.appendChild(post);

        }


    }
}

function createLikedGames(){
    // <div class="unique-game-container">
    //     <div class="game-icon"></div>
    //     <div class="game-name">Rocket leauge</div>
    // </div>
}

sleep(500).then(() => {
    //swipeBox();
})
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
 }