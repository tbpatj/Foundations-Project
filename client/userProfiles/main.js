let username = document.getElementById('username');
let likedGames = document.getElementById('liked-games');
let highlightDiv = document.getElementById('highlighted-clip-contain');
let aboutText = document.getElementById('about-me-text');
let postsContain = document.getElementById('posts-container');
let addPostEl = document.getElementById('add-post');

let createPost = document.getElementById('create-new-post-container');
let outsideCPost = document.getElementById('outside-post-cont');

outsideCPost.addEventListener('click',hidePostCreation);
addPostEl.addEventListener('click',showPostCreation);

function hidePostCreation(event ){
    event.target.classList.add('hidden');
    createPost.classList.add('hidden');
    console.log("yeah hidden");
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

    await axios.get(`/users/info/${userPageID}`).then(res => {
        console.log(res);
        response = res.data[0];
    }).catch(error => console.log(error));
    console.log("after");
    console.log(response.length);
    if(response.length > 0){
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