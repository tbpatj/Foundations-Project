
let loginBttn = document.getElementById('login-bttn');
loginBttn.addEventListener('click',login);
let swipebox = document.getElementById('swipe-box');
swipebox.addEventListener('transitionend',switchFrame);
swipebox.addEventListener("click",swipeBox);
let transitionLocation = "/login";


let signupBttn = document.getElementById("sign-up");
signupBttn.addEventListener('click',signUp)

async function signUp(){
    swipebox.classList.add("swipe-anim");
    swipebox.classList.remove("swipe-box2");
    swipebox.classList.add("swipe-box");
    swipebox.classList.remove('hidden');
    window.localStorage.setItem("highlight_transition","theme-1");
    await sleep(1000);
    window.location = "/signup";
}
function transitionCheck(){
    let tState = window.localStorage.getItem("highlight_transition");
    if(tState === "none"){
        swipebox.classList.add("swipe-box");
        swipebox.classList.remove("swipe-box2");
        swipebox.classList.remove('swipe-anim');
    }
}
function swipeBox(){
    console.log('swipebox');
    if(swipebox.classList.contains("swipe-anim")){
        swipebox.classList.remove("swipe-anim");
        window.localStorage.setItem("highlight_transition","none");
    }
}

async function login( event ){
    event.preventDefault();
    swipebox.classList.add("swipe-anim");
    swipebox.classList.remove("swipe-box2");
    swipebox.classList.add("swipe-box");
    swipebox.classList.remove('hidden');
    window.localStorage.setItem("highlight_transition","theme-1");

    let username = document.getElementById('user-input');
    let password = document.getElementById('password-input');
    let sessionKey = "none";
    await axios
    .post(`/login/attempt`, {username:username.value, password:password.value}).then(res => {
        console.log(res);
        if(res.data.sessionKey){
            sessionKey = res.data.sessionKey;
            
        } else console.log("no session key recieved");

    }).catch(error => console.log(error));
    if(sessionKey !== "none"){
        window.localStorage.setItem("poggers_s_key",sessionKey);
        console.log("recieved and stored key");
        transitionLocation="/";
        await sleep(200);
        window.location =  transitionLocation;
       
    } else {
        username.value = "";
        password.value = "";
    }
}

async function switchFrame( event ){
    await sleep(2000);
    if(swipebox.classList.contains("swipe-box2")){
        console.log('removed swipebox');
        swipebox.classList.add("swipe-box");
        swipebox.classList.remove("swipe-box2");
    } else if(swipebox.offsetWidth > 100){
        
    }
    
    transitionCheck();
}

sleep(500).then(() => {
    swipeBox();
})
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
 }