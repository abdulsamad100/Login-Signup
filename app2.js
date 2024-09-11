import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp,
    getDocs,
    deleteDoc,
    doc,
    query, where, orderBy, limit
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

import { app } from "./firebase.js";

const auth = getAuth(app);
const db = getFirestore(app);
const name = document.querySelector("#name");
const DP = document.querySelector("#DP");
const email = document.querySelector("#email");
let currentuser = false;

onAuthStateChanged(auth, (user) => {
    currentuser = user;
    if (!user) {
        location.href = "index.html";
    }
})


DP.addEventListener("click", () => {
    document.querySelector("#profile").classList.toggle("displaynone");
})
let cuser = 0;
document.addEventListener("DOMContentLoaded", async () => {
    await onAuthStateChanged(auth, (user) => {
        if (user) {
            currentuser = user;

            if (user.photoURL) {
                DP.src = user.photoURL;
            }
            else {
                DP.src = "./Assets/defaultuser.svg"
            }
            if (user.displayName) {
                name.innerText = user.displayName;
            }
            else {
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
        window.location.href = "index.html"
    }).catch((error) => {
        console.log(error.message)
    });
})

const addData = async () => {
    const title = document.querySelector("#todo-title").value;
    const des = document.querySelector("#todo-des").value;
    const createdAt = serverTimestamp();
    const uid = currentuser.uid;
    const isCompleted = false;
    try {
        const docRef = await addDoc(collection(db, "todos"), {
            title,
            des,
            createdAt,
            uid,
            isCompleted
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

const readData = async () => {
    if (!currentuser) {
        console.log("No current user, cannot fetch data");
        return;
    }

    const list = document.querySelector("#todos-list");
    list.innerHTML = "";

    try {
        // Create a query object to filter todos by user ID
        const todosQuery = query(collection(db, "todos"), where("uid", "==", currentuser.uid));

        // Fetch the documents based on the query
        const querySnapshot = await getDocs(todosQuery);
        console.log(`Fetched ${querySnapshot.size} todos for user ${currentuser.uid}`);

        querySnapshot.forEach((doc) => {
            console.log(doc.id);

            const data = doc.data();
            const ctodo = `
                <div id="singletodo">
                    <h3>Title: ${data.title}</h3>
                    <p>Detail: ${data.des}</p>
                    <h4>Status: ${data.isCompleted == false ? "Pending" : "Completed"}</h4>
                    <button onclick="dltData('${doc.id}')">Delete</button>
                </div>
            `;
            list.innerHTML += ctodo;
        });
    } catch (e) {
        console.log("Error fetching data:", e);
    }
}


window.dltData = async (dltid) => {
    await deleteDoc(doc(db, "todos", dltid));
    readData();
}

document.querySelector("#addBtn").addEventListener("click", addData)

document.querySelector("#addForm").addEventListener("click", () => {
    document.querySelector("#adddiv").classList.remove("displaynone")
    document.querySelector("#viewdiv").classList.add("displaynone")

})

document.querySelector("#viewform").addEventListener("click", () => {
    document.querySelector("#adddiv").classList.add("displaynone")
    document.querySelector("#viewdiv").classList.remove("displaynone")
    readData();
})

// await signOut(auth).then(() => {
//     window.location.href="index.html"
// }).catch((error) => {
//     console.log(error.message)
// });