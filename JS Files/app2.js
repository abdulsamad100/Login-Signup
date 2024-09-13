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
    query,
    where,
    updateDoc,
    getDoc,
    onSnapshot,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

import { app } from "./firebase.js";

const auth = getAuth(app);
const db = getFirestore(app);
const name = document.querySelector("#name");
const DP = document.querySelector("#DP");
const email = document.querySelector("#email");
let currentuser = undefined;
let UpdateId = null
let loading=false;

onAuthStateChanged(auth, (user) => {
    currentuser = user;
    if (!user) {
        location.href = "index.html";
    }
    // onSnapshot(query(collection(db, "todos"), where("uid", "==", currentuser.uid)),
    //     (querySnapshot) => {
    //         if(loading==false){
    //             readData();
    //         }
    //         else{
    //             setTimeout(()=>{
    //                 readData
    //             },2000)
    //         }
    //     },
    //     (error) => {
    //         console.error("Error listening for realtime updates:", error);
    //     }
    // );
})

DP.addEventListener("click", () => {
    document.querySelector("#profile").classList.toggle("displaynone");
})

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
    const addLoader = document.querySelector("#addLoader");
    const addBtn = document.querySelector("#addBtn");
    addBtn.disabled = true;
    addBtn.classList.add("disabled");
    addLoader.classList.remove("displaynone");
    let title = document.querySelector("#todo-title");
    let des = document.querySelector("#todo-des");
    if (title.value == "" || des.value == "") {
        toastr.error("Kindly fill all Fields")
        addLoader.classList.add("displaynone");
        addBtn.classList.remove("disabled");
        addBtn.disabled = false;
        return;
    }
    const createdAt = serverTimestamp();
    const uid = currentuser.uid;
    const isCompleted = false;
    try {
        const docRef = await addDoc(collection(db, "todos"), {
            title: title.value,
            des: des.value,
            createdAt,
            uid,
            isCompleted
        });
        addLoader.classList.add("displaynone");
        addBtn.disabled = false;
        addBtn.classList.remove("disabled");
        title.value = "";
        des.value = "";
        toastr.success("Todo Added Successfully");
    } catch (e) {
        console.log(e)
    }
}

const readData = async () => {
    loading=true;
    if (!currentuser) {
        console.log("No current user, cannot fetch data");
        return;
    }

    const list = document.querySelector("#todos-list");
    list.innerHTML = "";
    const viewLoader = document.querySelector("#viewLoader");
    viewLoader.classList.remove("displaynone");

    try {
        const todosQuery = query(
            collection(db, "todos"),
            where("uid", "==", currentuser.uid),
            where("isCompleted", "==", false),
            orderBy("createdAt","desc")
        );

        const querySnapshot = await getDocs(todosQuery);

        if (querySnapshot.size > 0) {
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const ctodo = `
                <div id="singletodo">
                    <h3>Title: ${data.title}</h3>
                    <p>Detail: ${data.des}</p>
                    <h4>Status: ${data.isCompleted == false ? "Pending" : "Completed"}</h4>
                    <button onclick="dltData('${doc.id}')" class="singleDltBtn">Delete</button>
                    <button onclick="cmpData('${doc.id}')" class="singleCmpBtn">Completed</button>
                    <button onclick="updatePopup('${doc.id}')" class="singleUpBtn">Update</button>
                </div>
            `;
                list.innerHTML += ctodo;
            });
        } else {
            const ctodo = `<h4 id="noTodo">No Todos Found. Kindly Add Todos.</h4>`;
            list.innerHTML += ctodo;
        }
        viewLoader.classList.add("displaynone");
        loading=false;
    } catch (e) {
        console.error("Error Fetching Data", e); // Log the error for more insights
        toastr.error("Error Fetching Data");
    }
};


window.updatePopup = async (id) => {
    UpdateId = id;
    const todoRef = doc(db, "todos", id);
    const docSnap = await getDoc(todoRef);

    if (docSnap.exists()) {
        document.querySelector("#pg-blur").classList.remove("displaynone");
        document.querySelector("#update-title").value = docSnap.data().title;
        document.querySelector("#update-des").value = docSnap.data().des;
    } else {
        toastr.error("Unable to Load Data");
    }

}

document.querySelector("#DataUpdate").addEventListener('click', async () => {
    const ctitle = document.querySelector("#update-title")
    const description = document.querySelector("#update-des")
    if (ctitle.value == "" || description.value == "") {
        toastr.error("Please Fill All Fields");
        return;
    }
    try {
        await updateDoc(doc(db, "todos", UpdateId),
            {
                title: ctitle.value,
                des: description.value
            });
        document.querySelector("#pg-blur").classList.add("displaynone");
        UpdateId = null;
        readData();
    } catch (error) {
        console.error("Error updating todo:", error);
        toastr.error("Error Updating Todo");
    }
})

document.querySelector("#backbtn").addEventListener('click', () => {
    document.querySelector("#pg-blur").classList.add("displaynone");
})

const readCData = async () => {
    if (!currentuser) {
        console.log("No current user, cannot fetch data");
        return;
    }

    const list = document.querySelector("#todos-list2");
    list.innerHTML = "";
    const viewLoader = document.querySelector("#viewLoader2");
    viewLoader.classList.remove("displaynone")
    try {
        const todosQuery = query(collection(db, "todos"), where("uid", "==", currentuser.uid), where("isCompleted", "==", true));
        const querySnapshot = await getDocs(todosQuery);
        if (querySnapshot.size > 0) {
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const ctodo = `
                <div id="singletodo2">
                    <h3>Title: ${data.title}</h3>
                    <p>Detail: ${data.des}</p>
                    <h4>Status: ${data.isCompleted == false ? "Pending" : "Completed"}</h4>
                    <button onclick="dltCData('${doc.id}')" class="singleDltBtn">Delete</button>
                </div>
            `;
                list.innerHTML += ctodo;
            });
        }
        else {
            const ctodo = `<h4 id="noTodo">No Todos Found. Kindly Add Todos.</h4>`
            list.innerHTML += ctodo;
        }
        viewLoader.classList.add("displaynone")

    } catch (e) {
        toastr.error("Error Fetching Data")
    }
}

window.dltData = async (dltid) => {
    await deleteDoc(doc(db, "todos", dltid));
    toastr.success("Todo Deleted Successfully")
    readData();
}

window.dltCData = async (dltid) => {
    await deleteDoc(doc(db, "todos", dltid));
    toastr.success("Todo Deleted Successfully")
    readCData();
}

window.cmpData = async (id) => {
    const dltBtn = document.querySelectorAll(".singleDltBtn");
    const cmpBtn = document.querySelectorAll(".singleCmpBtn");
    dltBtn.forEach((cbtn) => {
        console.log(cbtn);
        cbtn.disabled = true;
        cbtn.classList.add("disabled")
    })
    cmpBtn.forEach((cbtn2) => {
        console.log(cbtn2);
        cbtn2.disabled = true;
        cbtn2.classList.add("disabled")
    })
    try {
        await updateDoc(doc(db, "todos", id), { isCompleted: true });
        dltBtn.forEach((cbtn) => {
            console.log(cbtn);
            cbtn.disabled = false;
            cbtn.classList.remove("disabled")
        })
        cmpBtn.forEach((cbtn2) => {
            console.log(cbtn2);
            cbtn2.disabled = false;
            cbtn2.classList.remove("disabled")
        })
        readData();
    } catch (error) {
        console.error("Error updating todo:", error);
        toastr.error("Error marking todo as complete");
    }
}

document.querySelector("#addBtn").addEventListener("click", addData)

document.querySelector("#addForm").addEventListener("click", () => {
    document.querySelector("#adddiv").classList.remove("displaynone")
    document.querySelector("#viewdiv").classList.add("displaynone")
    document.querySelector("#viewCdiv").classList.add("displaynone")

})

document.querySelector("#viewform").addEventListener("click", () => {
    document.querySelector("#adddiv").classList.add("displaynone")
    document.querySelector("#viewCdiv").classList.add("displaynone")
    document.querySelector("#viewdiv").classList.remove("displaynone")
    readData();
})

document.querySelector("#viewCform").addEventListener("click", () => {
    document.querySelector("#adddiv").classList.add("displaynone")
    document.querySelector("#viewCdiv").classList.remove("displaynone")
    document.querySelector("#viewdiv").classList.add("displaynone")
    readCData();
})


// await signOut(auth).then(() => {
//     window.location.href="index.html"
// }).catch((error) => {
//     console.log(error.message)
// });