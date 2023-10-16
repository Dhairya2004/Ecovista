import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getFirestore, doc, updateDoc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDN90YYc-_CdzJE0q5KTXnyK9KeA2NirDs",
    authDomain: "ecovista-68307.firebaseapp.com",
    projectId: "ecovista-68307",
    storageBucket: "ecovista-68307.appspot.com",
    messagingSenderId: "273629603323",
    appId: "1:273629603323:web:035ede64ae376506f0d75e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();
const db = getFirestore();

const signInButton = document.getElementById("signInButton");

const userSignIn = async () => {
    signInWithPopup(auth, provider)
        .then(async (result) => {
            hideContainer();

            const user = result.user;
            console.log(user);

            // Check if the user document already exists
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                // If the document doesn't exist, create it and initialize the coin balance
                await setDoc(userDocRef, { coins: 0 });
            }
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
};

onAuthStateChanged(auth, (user) => {
    if (user) {
        hideContainer();
        // Load and display the user's coin balance
        const userDocRef = doc(db, "users", user.uid);
    }
    else {
        showContainer();
    }
});


// Get the container element
const container = document.querySelector('.container');
const blurcontent = document.querySelector('.blur-content');

// Function to hide the container
function hideContainer() {
    container.style.display = 'none';
    blurcontent.style.display = 'none';
}
// Function to show the container
function showContainer() {
    blurcontent.style.display = 'block';
    container.style.display = 'flex';
}


signInButton.addEventListener('click', userSignIn);