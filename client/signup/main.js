let swipebox = document.getElementById('swipe-box');

function swipeBox(){
    if(swipebox.classList.contains("swipe-anim")){
        swipebox.classList.remove("swipe-anim");
    }
}

sleep(500).then(() => {
    swipeBox();
})
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
 }