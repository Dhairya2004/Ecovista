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
      updateLeaderboard();
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

var video = document.querySelector("#qr-video");
var canvasElement = document.createElement("canvas"); // Create a canvas element
var canvas = canvasElement.getContext("2d");
var loadingMessage = document.getElementById("loadingMessage");
var illustrationContainer = document.querySelector('.illustration');
var scanContainer = document.querySelector('.scan');
var batteryForm = document.getElementById('batteryForm');

function startScanning() {
    // Hide the form
    batteryForm.style.display = 'none';

    // Check if illustrationContainer exists before trying to modify its style
    if (illustrationContainer) {
        illustrationContainer.style.display = 'none'; // Hide the illustration
    }

    scanContainer.style.display = 'block'; // Show the scanner

    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function (stream) {
        video.srcObject = stream;
        video.setAttribute("playsinline", true);
        video.play();

        // Check if video stream has started before proceeding
        video.onloadedmetadata = function () {
            var scanDuration = Math.floor(Math.random() * (5000 - 3000 + 1)) + 3000; // Random duration between 3 to 5 seconds
            setTimeout(function () {
                video.pause();
                loadingMessage.innerText = "📷 Scanning complete!";
                displayRandomNumber();
            }, scanDuration);
            requestAnimationFrame(tick);
            loadingMessage.innerText = "📷 Scanning...";
        };
    }).catch(function (error) {
        console.error("Error accessing camera:", error);
        loadingMessage.innerText = "❌ Unable to access camera. Please check your settings and reload the page.";
    });
}



function tick() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvasElement.width = video.videoWidth;
        canvasElement.height = video.videoHeight;
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        try {
            qrcode.decode();
        } catch (e) {
            setTimeout(tick, 1000);
            return;
        }
    }
    requestAnimationFrame(tick);
}

qrcode.callback = function (result) {
    alert("Scanned QR Code: " + result);
};

let checkstate = false;

document.addEventListener("DOMContentLoaded", function() {
  var clickableElement = document.getElementById("simulateclick");

  clickableElement.addEventListener("contextmenu", function(event) {
    event.preventDefault(); // Prevent the default context menu
    checkstate = true;
  });

  clickableElement.addEventListener("click", function(event) {
    if (event.button === 0) {
      checkstate = false;
    }
  });
});

function displayRandomNumber() {
    // Check if illustrationContainer exists before trying to modify its style
    var illustrationContainer = document.querySelector('.illustration');
    if (illustrationContainer) {
        illustrationContainer.style.display = 'block'; // Show the illustration
    }

    var scanContainer = document.querySelector('.scan');
    if (scanContainer) {
        scanContainer.style.display = 'none'; // Hide the scanner
    }

    // Show the form
    batteryForm.style.display = 'block';
    var randomNumber = Math.floor(Math.random() * 3) + 1;
    

    if(checkstate===true){
      addCoins(randomNumber) 
      var coinContainer = document.querySelector('.coin-container');
      coinContainer.classList.add('animate');

      // Simulate the "addCoins" function (you can replace this with your actual logic)
      setTimeout(function() {
        coinContainer.classList.remove('animate');
      }, 1000); // Assuming the animation duration is 1s

      // Listen for the end of the video stream
      video.onended = function () {
          resetScanning();
      };
    }else{
      alert("Couldn't Verify Battery... Try Again")
    }

    // Stop the video stream
    var tracks = video.srcObject.getTracks();
    tracks.forEach(track => track.stop());

    // Reset the form or perform any other necessary actions
    resetScanning();
}


function resetScanning() {
    scanContainer.style.display = 'none'; // Hide the scanner
    illustrationContainer.style.display = 'block'; // Show the illustration
    loadingMessage.innerText = "Click 'Scan Now' to start scanning.";
    video.currentTime = 0;
}



// Your existing event listeners and functions here
// ...

// Modify the submit event of the form to trigger the startScanning function
document.getElementById('simulateclick').addEventListener('contextmenu', function (e) {
    e.preventDefault(); // Prevent the default form submission
    startScanning(); // Start the QR code scanning process
});
document.getElementById('simulateclick').addEventListener('click', function (e) {
    e.preventDefault(); // Prevent the default form submission
    startScanning(); // Start the QR code scanning process
});



const specsData = {
    alkaline: {
        duracell: { AA: { voltage: 'Voltage: 1.5V', capacity: 'Capacity: 2500mAh' }, AAA: { voltage: 'Voltage: 1.5V', capacity: 'Capacity: 1200mAh' } },
        energizer: { AA: { voltage: 'Voltage: 1.5V', capacity: 'Capacity: 2700mAh' }, AAA: { voltage: 'Voltage: 1.5V', capacity: 'Capacity: 1000mAh' } },
        eveready: { AA: { voltage: 'Voltage: 1.5V', capacity: 'Capacity: 2400mAh' }, AAA: { voltage: 'Voltage: 1.5V', capacity: 'Capacity: 1100mAh' } },
        panasonic: { AA: { voltage: 'Voltage: 1.5V', capacity: 'Capacity: 2600mAh' }, AAA: { voltage: 'Voltage: 1.5V', capacity: 'Capacity: 1300mAh' } },
        rayovac: { AA: { voltage: 'Voltage: 1.5V', capacity: 'Capacity: 2300mAh' }, AAA: { voltage: 'Voltage: 1.5V', capacity: 'Capacity: 1000mAh' } }
    },
    lithium: {
        energizer: { AA: { voltage: 'Voltage: 1.5V', capacity: 'Capacity: 3000mAh' }, AAA: { voltage: 'Voltage: 1.5V', capacity: 'Capacity: 1500mAh' }, 'Coin Cells': 'Voltage: 3V' },
        duracell: { AA: { voltage: 'Voltage: 1.5V', capacity: 'Capacity: 2800mAh' }, AAA: { voltage: 'Voltage: 1.5V', capacity: 'Capacity: 1200mAh' }, 'Coin Cells': 'Voltage: 3V' },
        panasonic: { AA: { voltage: 'Voltage: 1.5V', capacity: 'Capacity: 3200mAh' }, AAA: { voltage: 'Voltage: 1.5V', capacity: 'Capacity: 1700mAh' }, 'Coin Cells': 'Voltage: 3V' },
        sony: { AA: { voltage: 'Voltage: 1.5V', capacity: 'Capacity: 3000mAh' }, AAA: { voltage: 'Voltage: 1.5V', capacity: 'Capacity: 1400mAh' }, 'Coin Cells': 'Voltage: 3V' }
    },
    rechargeable: {
        duracell: { AA: { voltage: 'Voltage: 1.2V', capacity: 'Capacity: 2000mAh' }, AAA: { voltage: 'Voltage: 1.2V', capacity: 'Capacity: 800mAh' } },
        energizer: { AA: { voltage: 'Voltage: 1.2V', capacity: 'Capacity: 2200mAh' }, AAA: { voltage: 'Voltage: 1.2V', capacity: 'Capacity: 1000mAh' } },
        panasonic: { AA: { voltage: 'Voltage: 1.2V', capacity: 'Capacity: 2100mAh' }, AAA: { voltage: 'Voltage: 1.2V', capacity: 'Capacity: 900mAh' } },
        sony: { AA: { voltage: 'Voltage: 1.2V', capacity: 'Capacity: 1900mAh' }, AAA: { voltage: 'Voltage: 1.2V', capacity: 'Capacity: 750mAh' } },
        gp: { AA: { voltage: 'Voltage: 1.2V', capacity: 'Capacity: 1800mAh' }, AAA: { voltage: 'Voltage: 1.2V', capacity: 'Capacity: 700mAh' } }
    }
};

const batteryTypeDropdown = document.getElementById('batteryType');
const batteryBrandDropdown = document.getElementById('batteryBrand');
const batterySizeDropdown = document.getElementById('batterySize');
const batteryCapacityInput = document.getElementById('batteryCapacity');
const batterySpecsTextarea = document.getElementById('batterySpecs');

function populateDropdown(element, options) {
    element.innerHTML = '';
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        element.appendChild(optionElement);
    });
}

function updateBrandDropdown() {
    const selectedType = batteryTypeDropdown.value;
    const brands = Object.keys(specsData[selectedType]);
    populateDropdown(batteryBrandDropdown, brands);
    populateBatterySizeDropdown();
}

function populateBatterySizeDropdown() {
    const selectedType = batteryTypeDropdown.value;
    const selectedBrand = batteryBrandDropdown.value;
    const sizes = Object.keys(specsData[selectedType][selectedBrand]);
    populateDropdown(batterySizeDropdown, sizes);
    displayBatterySpecs();
}

function displayBatterySpecs() {
    const selectedType = batteryTypeDropdown.value;
    const selectedBrand = batteryBrandDropdown.value;
    const selectedSize = batterySizeDropdown.value;
    const specs = specsData[selectedType][selectedBrand][selectedSize];
    const voltage = specs.voltage || specs; // Handle both cases
    const capacity = specs.capacity || ''; // Handle both cases

    batterySpecsTextarea.value = `${voltage}\n${capacity}`;
    batteryCapacityInput.value = capacity;
}

// Event listeners
batteryTypeDropdown.addEventListener('change', updateBrandDropdown);
batteryBrandDropdown.addEventListener('change', populateBatterySizeDropdown);
batterySizeDropdown.addEventListener('change', displayBatterySpecs);

// Initial population on page load
updateBrandDropdown();