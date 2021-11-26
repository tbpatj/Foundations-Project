let mainContainer = document.getElementById('main-container');
let regBttn = document.getElementById('register-bttn');
regBttn.addEventListener('click',signup);

opaque();
async function opaque(){
    await sleep(500);
    mainContainer.classList.remove('transparent');
    mainContainer.classList.add('opaque');
}
async function signup( event ){
    console.log('yeah');
    event.preventDefault();
    let firstname = document.getElementById('fname-input').value;
    let lastname = document.getElementById('lname-input').value;
    let email = document.getElementById('email-input').value;
    let username = document.getElementById('user-input').value;
    let password = document.getElementById('password-input').value;
    let passwordC = document.getElementById('password-conf-input').value;
    if(password === passwordC && password !== ""){
        if(firstname !== "" && lastname !== "" && email !== "" && username !== "")
        await axios
        .post(`/new/user`, 
        {
            firstName: firstname,
            lastName: lastname,
            email: email,
            username: username,
            password: password
        }
        ).then(res => {
            console.log(res);
            if(res.status === 200 && res.data.userID){
                window.location = "/login";
            }

        }).catch(error => console.log(error));

    } else {
        let pError = document.getElementById('password-error');
        pError.classList.remove('hidden');
    }
    

    
}

sleep(500).then(() => {
    opaque();
})
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
 }