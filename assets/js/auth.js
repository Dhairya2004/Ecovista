import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  updateDoc,
  getDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDN90YYc-_CdzJE0q5KTXnyK9KeA2NirDs",
  authDomain: "ecovista-68307.firebaseapp.com",
  projectId: "ecovista-68307",
  storageBucket: "ecovista-68307.appspot.com",
  messagingSenderId: "273629603323",
  appId: "1:273629603323:web:035ede64ae376506f0d75e",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();
const db = getFirestore();

const profilePicture = document.getElementById("profile-picture");

const signInButton = document.getElementById("signInButton");

const userSignIn = async () => {
  signInWithPopup(auth, provider)
    .then(async (result) => {
      hideContainer();
      addCoins(0);
      fetchUserinfo();
      const user = result.user;
      console.log(user);

      // Check if the user document already exists
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // If the document doesn't exist, create it and initialize the coin balance
        const username = user.displayName || "Test-User"; // Use display name or a default if not available
        await setDoc(userDocRef, { coins: 0, username: username });
      }
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
};

const userSignOut = async () => {
  signOut(auth)
    .then(() => {
      showContainer();
      updateLeaderboard();
      profilePicture.src = "assets/img/profile.png";
    })
    .catch((error) => {});
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    hideContainer();
    addCoins(0);
    fetchUserinfo();
    const userDocRef = doc(db, "users", user.uid);
  } else {
    showContainer();
  }
});

const container = document.querySelector(".container");
const blurcontent = document.querySelector(".blur-content");
const signOutButton = document.getElementById("signOutButton");

const coinBalance = document.getElementById("coinBalance");

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

// Function to hide the container
function hideContainer() {
  container.style.display = "none";
  blurcontent.style.display = "none";
  signOutButton.style.display = "block";
  document.body.style.overflow = "auto";
}
// Function to show the container
function showContainer() {
  blurcontent.style.display = "block";
  container.style.display = "flex";
  signOutButton.style.display = "none";
  document.body.style.overflow = "hidden";
}

signInButton.addEventListener("click", userSignIn);
signOutButton.addEventListener("click", userSignOut);

const fetchUserinfo = async () => {
  const user = auth.currentUser;
  if (user) {
    const displayName = user.displayName;
    const photoURL = user.photoURL;

    // Set the 'src' attribute to the 'photoURL'
    profilePicture.src = photoURL;
  }
};

const profileContainer = document.querySelector(".profile-container");
const signOutDiv = document.getElementById("signOutButton");

function showSignOut() {
  setTimeout(signOutDiv.classList.toggle("show"), 3000);
}

profileContainer.addEventListener("mouseover", showSignOut);
signOutDiv.addEventListener("mouseover", showSignOut);
signOutDiv.addEventListener("mouseout", showSignOut);
profileContainer.addEventListener("mouseout", showSignOut);

import {
  getDocs,
  collection,
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
// ... Other imports and Firebase setup code ...
// Function to fetch user data from Firestore and update the leaderboard
const updateLeaderboard = async () => {
    const leaderboardTable = document.getElementById("leaderboard-table");
    const leaderboardTopTable = document.getElementById("leaderboard-top");
  
    // Logging to check if leaderboardTable is null
    console.log("leaderboardTable:", leaderboardTable);
  
    // Clear existing rows from the tables
    leaderboardTable.innerHTML = "";
    leaderboardTopTable.innerHTML = "";
  
    try {
      // Fetch all users from Firestore
      const usersSnapshot = await getDocs(collection(db, "users"));
      const users = [];
  
      usersSnapshot.forEach((doc) => {
        users.push({
          uid: doc.id,
          ...doc.data(),
        });
      });
  
      // Sort users based on coins in descending order
      users.sort((a, b) => b.coins - a.coins);
  
      // Array of trophy image paths
      const trophyImages = [
        "./assets/img/goldtrophy.webp",
        "./assets/img/silvertrophy.png",
        "./assets/img/bronzetrophy.png",
      ];
  
      // Update the tables with sorted user data
      users.forEach((user, index) => {
        const tr = document.createElement("tr");
        
        // Add class "special" to the tr of the user with the second rank
        if (index === 1) {
          tr.classList.add("special");
        }
        
        tr.innerHTML = `
          <td class="number">${index + 1}</td>
          <td class="name">${user.username}</td>
          <td class="points">
            ${user.coins}
            ${index < trophyImages.length ? `<img class="gold-medal" src="${trophyImages[index]}" alt="trophy" />` : ''}
          </td>
        `;
  
        if (index === 0) {
          // Top-ranked user goes to leaderboard-top
          leaderboardTopTable.appendChild(tr);
        } else {
          // Other users go to leaderboard-table
          leaderboardTable.appendChild(tr);
        }
      });
    } catch (error) {
      console.error("Error updating leaderboard:", error);
    }
  };
  
  // Call the updateLeaderboard function on page load
  window.addEventListener("load", updateLeaderboard);
