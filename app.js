import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
  GoogleAuthProvider,
  signInWithPopup,
  OAuthProvider,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { app } from "./firebase.js";

const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  if (user) {
    location.href="login.html";
  }
})

const signUpUser = async (ev) => {
  ev.preventDefault();
  const su = document.querySelector("#signup");
  su.disabled = true;
  su.classList.add("disabled");
  try {
    const email = document.querySelector("#suemail");
    const pass = document.querySelector("#supass");
    if (email.value == "") {
      let txt = document.querySelector("#emptyemail");
      txt.innerText = "Kindly Enter Email";
      setTimeout(() => {
        txt.innerText = "";
      }, 2000);
      su.disabled = false;
      su.classList.remove("disabled");
      return;
    }
    if (pass.value == "") {
      let txt = document.querySelector("#emptypass");
      txt.innerText = "Kindly Enter Password";
      setTimeout(() => {
        txt.innerText = "";
      }, 2000);
      su.disabled = false;
      su.classList.remove("disabled");
      return;
    }
    let txt = document.querySelector("#invalid2");
    txt.style.color = "green";
    txt.innerText = "Signup Succesful";
    setTimeout(() => {
      txt.innerText = "";
      txt.style.color = "red";
    }, 2000);
    await createUserWithEmailAndPassword(auth, email.value, pass.value);
    su.disabled = false;
    su.classList.remove("disabled");
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
  const lg = document.querySelector("#login");
  lg.disabled = true;
  lg.classList.add("disabled");
  try {
    const email = document.querySelector("#email");
    const pass = document.querySelector("#pass");
    if (email.value == "") {
      let txt = document.querySelector("#emptyemaill");
      txt.innerText = "Kindly Enter Email";
      setTimeout(() => {
        txt.innerText = "";
      }, 2000);
      lg.disabled = false;
      lg.classList.remove("disabled");
      return;
    }
    if (pass.value == "") {
      let txt = document.querySelector("#emptypassl");
      txt.innerText = "Kindly Enter Password";
      setTimeout(() => {
        txt.innerText = "";
      }, 2000);
      lg.disabled = false;
      lg.classList.remove("disabled");
      return;
    }
    await signInWithEmailAndPassword(auth, email.value, pass.value);
    lg.disabled = false;
    lg.classList.remove("disabled");
    window.location.href = "login.html"
  }
  catch (e) {
    const errormessage = e.message
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
    if (errormessage == "Firebase: Error (auth/user-not-found).") {
      let txt = document.querySelector("#invalid");
      txt.innerText = "User Not Found";
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

const googleLogin = async (ev) => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      window.location.href = "login.html"
    }).catch((error) => {
      console.log(error.message);
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
    });
}

const msLogin = async (ev) => {
  const provider = new OAuthProvider('microsoft.com');
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = OAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      window.location.href = "login.html"
    }).catch((error) => {
      console.log(error.message);
    });
}

document.querySelector("#googlelogin").addEventListener("click", googleLogin)
// document.querySelector("#microsoftlogin").addEventListener("click",msLogin)

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
