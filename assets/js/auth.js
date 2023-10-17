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
  getDocs,
  collection,
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
const container = document.querySelector(".container");
const blurcontent = document.querySelector(".blur-content");
const signOutButton = document.getElementById("signOutButton");
const coinBalance = document.getElementById("coinBalance");
const profileContainer = document.querySelector(".profile-container");
const signOutDiv = document.getElementById("signOutButton");


const userSignIn = async () => {
  signInWithPopup(auth, provider)
    .then(async (result) => {
      hideContainer();
      addCoins(0);
      fetchUserinfo();
      updateLeaderboard();
      const user = result.user;
      console.log(user);


      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        const username = user.displayName || "Test-User"; 
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
      addCoins(0);
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

function hideContainer() {
  container.style.display = "none";
  blurcontent.style.display = "none";
  signOutButton.style.display = "block";
  document.body.style.overflow = "auto";
}

function showContainer() {
  blurcontent.style.display = "block";
  container.style.display = "flex";
  signOutButton.style.display = "none";
  document.body.style.overflow = "hidden";
}

const fetchUserinfo = async () => {
  const user = auth.currentUser;
  if (user) {
    const displayName = user.displayName;
    const photoURL = user.photoURL;
    profilePicture.src = photoURL;
  }
};

function showSignOut() {
  setTimeout(signOutDiv.classList.toggle("show"), 3000);
}

const updateLeaderboard = async () => {
  const leaderboardTable = document.getElementById("leaderboard-table");
  const leaderboardTopTable = document.getElementById("leaderboard-top");

  console.log("leaderboardTable:", leaderboardTable);

  leaderboardTable.innerHTML = "";
  leaderboardTopTable.innerHTML = "";

  try {
    const usersSnapshot = await getDocs(collection(db, "users"));
    const users = [];

    usersSnapshot.forEach((doc) => {
      users.push({
        uid: doc.id,
        ...doc.data(),
      });
    });


    users.sort((a, b) => b.coins - a.coins);

    const trophyImages = [
      "./assets/img/goldtrophy.webp",
      "./assets/img/silvertrophy.png",
      "./assets/img/bronzetrophy.png",
    ];

    users.forEach((user, index) => {
      const tr = document.createElement("tr");

      if (index === 1) {
        tr.classList.add("special");
      }

      tr.innerHTML = `
          <td class="number">${index + 1}</td>
          <td class="name">${user.username}</td>
          <td class="points">
            ${user.coins}
            ${
              index < trophyImages.length
                ? `<img class="gold-medal" src="${trophyImages[index]}" alt="trophy" />`
                : ""
            }
          </td>
        `;

      if (index === 0) {
        leaderboardTopTable.appendChild(tr);
      } else {
        leaderboardTable.appendChild(tr);
      }
    });
  } catch (error) {
    console.error("Error updating leaderboard:", error);
  }
};

signInButton.addEventListener("click", userSignIn);
signOutButton.addEventListener("click", userSignOut);
window.addEventListener("load", updateLeaderboard);
signOutDiv.addEventListener("mouseover", showSignOut);
signOutDiv.addEventListener("mouseout", showSignOut);
profileContainer.addEventListener("mouseover", showSignOut);
profileContainer.addEventListener("mouseout", showSignOut);