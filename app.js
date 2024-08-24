import { 
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail }
  from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { app } from "./firebase.js";

const auth = getAuth(app);

const signUpUser = async (ev) => {
  ev.preventDefault();
  try {
    const email = document.querySelector("#suemail");
    const pass = document.querySelector("#supass");
    if (email.value == "") {
      let txt = document.querySelector("#emptyemail");
      txt.innerText = "Kindly Enter Email";
      setTimeout(() => {
        txt.innerText = "";
      }, 2000);
      return;
    }
    if (pass.value == "") {
      let txt = document.querySelector("#emptypass");
      txt.innerText = "Kindly Enter Password";
      setTimeout(() => {
        txt.innerText = "";
      }, 2000);
      return;
    }
    
    await createUserWithEmailAndPassword(auth, email.value, pass.value);
    alert("Signup Succesful");
  }
  catch (e) {
    const errormessage = e.message
    console.log(errormessage);

    if (errormessage == "Firebase: Error (auth/invalid-email).") {
      console.log("error aagaandj");
      let txt = document.querySelector("#invalid2");
      txt.innerText = "Kindly type Correct Email Format";
      setTimeout(() => {
        txt.innerText = "";
      }, 2000);
      return;
    }
    if (errormessage == "Firebase: Error (auth/email-already-in-use).") {
      let txt = document.querySelector("#invalid2");
      txt.innerText = "Email already in use kindly use Login";
      setTimeout(() => {
        txt.innerText = "";
      }, 2000);
      return;
    }
    if (errormessage == "Firebase: Password should be at least 6 characters (auth/weak-password).") {
      let txt = document.querySelector("#invalid2");
      txt.innerText = "Email Must be 6 Letter atleast";
      setTimeout(() => {
        txt.innerText = "";
      }, 2000);
      return;
    }
  }
}

const loginUser = async (ev) => {
  ev.preventDefault();
  try {
    const email = document.querySelector("#email");
    const pass = document.querySelector("#pass");
    if (email.value == "") {
      let txt = document.querySelector("#emptyemaill");
      txt.innerText = "Kindly Enter Email";
      setTimeout(() => {
        txt.innerText = "";
      }, 2000);
      return;
    }
    if (pass.value == "") {
      let txt = document.querySelector("#emptypassl");
      txt.innerText = "Kindly Enter Password";
      setTimeout(() => {
        txt.innerText = "";
      }, 2000);
      return;
    }
    await signInWithEmailAndPassword(auth, email.value, pass.value);
    window.location.href = "login.html"
  }
  catch (e) {
    const errormessage = e.message
    console.log(errormessage);
    if (errormessage == "Firebase: Error (auth/invalid-credential).") {
      let txt = document.querySelector("#invalid");
      txt.innerText = "Email/Password is Wrong";
      setTimeout(() => {
        txt.innerText = "";
      }, 2000);
      return;
    }
    if (errormessage == "Firebase: Error (auth/invalid-email).") {
      let txt = document.querySelector("#invalid");
      txt.innerText = "Kindly type Correct Email Format";
      setTimeout(() => {
        txt.innerText = "";
      }, 2000);
      return;
    }
    if (errormessage == "Firebase: Password should be at least 6 characters (auth/weak-password).") {
      let txt = document.querySelector("#invalid");
      txt.innerText = "Email Must be 6 Letter atleast";
      setTimeout(() => {
        txt.innerText = "";
      }, 2000);
      return;
    }
  }
}

const resetpass = async (ev) => {
  ev.preventDefault();
  try {
    const email = document.querySelector("#emailr");
    if (email.value == "") {
      let txt = document.querySelector("#emptyemailr");
      txt.innerText = "Kindly Enter Email";
      setTimeout(() => {
        txt.innerText = "";
      }, 2000);
      return;
    }
    const methods = await fetchSignInMethodsForEmail(auth, email.value);
    if (methods.length === 0) {
      let txt = document.querySelector("#emptyemailr");
      txt.innerText = "Email does not exist";
      setTimeout(() => {
        txt.innerText = "";
      }, 2000);
      return;
    }

    await sendPasswordResetEmail(auth, email.value);
    console.log("Email Sent");
  } catch (e) {
    const errormessage = e.message;
    console.log(errormessage);
    let txt = document.querySelector("#emptyemailr");
    if (errormessage == "Firebase: Error (auth/invalid-email).") {
      txt.innerText = "Kindly type Correct Email Format";
      setTimeout(() => {
        txt.innerText = "";
      }, 2000);
      return;
    }
  }
};



document.querySelector("#loginlink").addEventListener("click", () => {
  document.querySelector("#signupform").style.display = "none";
  document.querySelector("#loginform").style.display = "block";
  document.querySelector("#resetdiv").style.display = "none";
});

document.querySelector("#signuplink").addEventListener("click", () => {
  document.querySelector("#signupform").style.display = "block";
  document.querySelector("#loginform").style.display = "none";
  document.querySelector("#resetdiv").style.display = "none";
});

document.querySelector("#signuplinkr").addEventListener("click", () => {
  document.querySelector("#signupform").style.display = "block";
  document.querySelector("#loginform").style.display = "none";
  document.querySelector("#resetdiv").style.display = "none";
});

document.querySelector("#Reset").addEventListener("click", () => {
  document.querySelector("#signupform").style.display = "none";
  document.querySelector("#loginform").style.display = "none";
  document.querySelector("#resetdiv").style.display = "block";
});

document.querySelector("#signup").addEventListener("click", signUpUser);
document.querySelector("#login").addEventListener("click", loginUser);
document.querySelector("#resetpass").addEventListener("click", resetpass);
