import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import { app } from "./firebase.js";

const auth = getAuth(app);
const name = document.querySelector("#name");
const DP = document.querySelector("#DP");
const email = document.querySelector("#email");
console.log(name);

let cuser = 0;
document.addEventListener("DOMContentLoaded", async () => {
    await onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log(user);
            if(user.photoURL){
                DP.src = user.photoURL;
            }
            else{
                DP.src = "./defaultuser.svg"
            }
            if(user.displayName){
                name.innerText = user.displayName;
            }
            else{
                name.innerText = "Hello User";
            }
            
            email.innerText = user.email;
        } else {
            window.location.href = "index.html";
        }
    });
})

document.querySelector("#logout").addEventListener("click", async () => {

    await signOut(auth).then(() => {
        window.location.href="index.html"
    }).catch((error) => {
        console.log(error.message)
    });
})