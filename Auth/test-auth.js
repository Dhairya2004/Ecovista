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
const signOutButton = document.getElementById("signOutButton");
const earnCoinsButton = document.getElementById("earnCoinsButton");
const message = document.getElementById("message");
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const coinBalance = document.getElementById("coinBalance");

signOutButton.style.display = "none";
earnCoinsButton.style.display = "none";
message.style.display = "none";

const userSignIn = async () => {
    signInWithPopup(auth, provider)
        .then(async (result) => {
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


const userSignOut = async () => {
    signOut(auth).then(() => {
        alert("You have signed out successfully!");
    }).catch((error) => { });
};

const addCoins = async (amount) => {
    const user = auth.currentUser;
    if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            const currentCoins = userDoc.data().coins || 0;
            const newCoins = currentCoins + amount;
            await updateDoc(userDocRef, { coins: newCoins });
            coinBalance.textContent = newCoins;
        }
    }
};

onAuthStateChanged(auth, (user) => {
    if (user) {
        signOutButton.style.display = "block";
        earnCoinsButton.style.display = "block";
        message.style.display = "block";
        userName.textContent = user.displayName;
        userEmail.textContent = user.email;

        // Load and display the user's coin balance
        const userDocRef = doc(db, "users", user.uid);
        getDoc(userDocRef).then((userDoc) => {
            if (userDoc.exists()) {
                const coins = userDoc.data().coins || 0;
                coinBalance.textContent = coins;
            }
        });
    } else {
        signOutButton.style.display = "none";
        earnCoinsButton.style.display = "none";
        message.style.display = "none";
    }
});

signInButton.addEventListener('click', userSignIn);
signOutButton.addEventListener('click', userSignOut);
earnCoinsButton.addEventListener('click', () => {
    addCoins(10); // Add 10 coins when the button is clicked
});
