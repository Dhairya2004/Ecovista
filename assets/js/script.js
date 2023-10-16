const words = ["Nature","Better future", "Recycling", "Sustainability"];
let currentWordIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;

function type() {
  const word = words[currentWordIndex];
  const span = document.getElementById("typewriter");

  if (isDeleting) {
    span.textContent = word.substring(0, currentCharIndex - 1);
    currentCharIndex--;
  } else {
    span.textContent = word.substring(0, currentCharIndex + 1);
    currentCharIndex++;
  }

  if (!isDeleting && currentCharIndex === word.length) {
    isDeleting = true;
    setTimeout(type, 1000);
  } else if (isDeleting && currentCharIndex === 0) {
    isDeleting = false;
    currentWordIndex = (currentWordIndex + 1) % words.length;
    setTimeout(type, 500);
  } else {
    setTimeout(type, 80);
  }
}

type();

document.addEventListener("DOMContentLoaded", function() {
  // Get the button and target div
  var scrollButton = document.getElementById("scrollButton");
  var targetDiv = document.getElementById("wrapper");

  // Add click event listener to the button
  scrollButton.addEventListener("click", function() {
      // Scroll to the target div
      targetDiv.scrollIntoView({ behavior: 'smooth' });
  });
});


var videoContainer = document.getElementById("videoContainer");
var video = document.getElementById("hoverVideo");

videoContainer.addEventListener("mousemove", function(event) {
    var mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
    var mouseY = (event.clientY / window.innerHeight - 0.5) * 2;

    var transformValue = "translate(" + mouseX * 13 + "px, " + mouseY * 13 + "px)";
    video.style.transform = transformValue;
});

videoContainer.addEventListener("mouseout", function() {
    video.style.transform = "translate(0, 0)";
});

const quotes = [
  "Reduce, reuse, and recycle to minimize your carbon footprint.",
  "Turn off lights and unplug electronics when not in use to save up to 10% on energy bills.",
  "Use energy-efficient appliances and light bulbs to conserve electricity and reduce energy consumption by up to 30%.",
  "Planting trees can absorb carbon dioxide and reduce greenhouse gas emissions by up to 20%.",
  "Choosing public transportation, carpooling, or biking instead of driving alone can reduce carbon emissions by up to 20%.",
  "Support renewable energy sources like solar and wind power to reduce reliance on fossil fuels.",
  "Properly dispose of batteries to prevent environmental contamination and recycle up to 99% of their components.",
  "Conserving water by fixing leaks and using water-saving fixtures can save up to 50% on water usage.",
  "Educate others about the importance of sustainable living and inspire positive change.",
  "Investing in energy-efficient home insulation can reduce heating and cooling needs by up to 30%.",
  "Choosing eco-friendly and biodegradable products helps reduce waste and pollution.",
  "Going paperless and using digital documents can save up to 80% on paper usage.",
  "Supporting local and sustainable agriculture reduces carbon emissions from transportation and supports the local economy.",
  "Encouraging recycling programs in your community and workplace can divert up to 75% of waste from landfills.",
  "Unplugging chargers and power adapters when not in use can save up to 10% of energy consumption.",
  "Using natural light whenever possible and reducing reliance on artificial lighting can save up to 20% on energy bills.",
  "Promoting energy conservation in schools and educational institutions can lead to significant energy savings.",
  "Exploring alternative transportation options like electric vehicles can reduce carbon emissions by up to 50%.",
  "Conserving energy by adjusting thermostat settings and using smart home technology can save up to 15% on energy bills.",
  "Investing in energy storage solutions helps integrate renewable energy sources and ensures a more reliable and sustainable power grid.",
  "Properly disposing of small-scale batteries prevents environmental contamination and protects our ecosystems."
];


function changeQuote() {
  const quoteElement = document.getElementById("quoteTypewriter");
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  quoteElement.classList.remove("fade-in");
  quoteElement.classList.add("fade-out");

  setTimeout(() => {
    quoteElement.textContent = quote;
    quoteElement.classList.remove("fade-out");
    quoteElement.classList.add("fade-in");
  }, 500);
}
window.addEventListener("DOMContentLoaded", () => {
  changeQuote();
  setInterval(changeQuote, 7000); // Change quote every 5 seconds (adjust the interval as needed)
});




