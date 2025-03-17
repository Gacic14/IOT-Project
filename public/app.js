// Firebase Configuration (dozvola za korišćenje Firebase)

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Get references to HTML elements
const temperatureElement = document.getElementById("temperature");
const humidityElement = document.getElementById("humidity");
const refreshButton = document.getElementById("refreshButton");

// Function to update data
function fetchData(){
    var temp = document.getElementById('temperature');
    database.ref('/temperature').once('value', (snapshot) => {
        if (snapshot.exists()) {
            temp.value = snapshot.val(); // Postavlja trenutnu vrednost u input polje
        } else {
            temp.value = "N/A"; // Ako nema podataka, postavlja default vrednost
        }
    });

    var hum = document.getElementById('humidity');
    database.ref('/humidity').once('value', (snapshot) => {
        if (snapshot.exists()) {
            hum.value = snapshot.val(); // Postavlja trenutnu vrednost u input polje
        } else {
            hum.value = "N/A"; // Ako nema podataka, postavlja default vrednost
        }
    });

    // Send signal to Arduino to start police rotation when button is clicked
    database.ref('/triggerPoliceRotation').set(true).then(() => {
        console.log('Signal sent to start police rotation.');
    }).catch((error) => {
        console.error('Error sending signal to Firebase:', error);
    });
}

// Refresh data when button is clicked
refreshButton.addEventListener("click", fetchData);

// Load data initially
fetchData();




 




/*
const firebaseConfig = {
    apiKey: "AIzaSyCc4fd3RlkuSXv_-dbLHiXT5IKWpcPUAr4",
    authDomain: "iot-projekat-f96fa.firebaseapp.com",
    projectId: "iot-projekat-f96fa",
    storageBucket: "iot-projekat-f96fa.firebasestorage.app",
    messagingSenderId: "451973892296",
    appId: "1:451973892296:web:01ba6e973297bbc88f7dfd"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Get references to HTML elements
const temperatureElement = document.getElementById("temperature");
const humidityElement = document.getElementById("humidity");

// Variables to store previous values
let previousTemperature = null;
let previousHumidity = null;

// Function to apply background effect based on value change
function applyHighlightEffect(element, isIncrease) {
    element.style.backgroundColor = isIncrease ? "#d4edda" : "#f8d7da"; // Green if increase, red if decrease
    setTimeout(() => {
        element.style.backgroundColor = ""; // Reset to original background after 1 second
    }, 1000);
}

// Function to listen for real-time updates
function listenForUpdates() {
    // Listen for temperature updates
    database.ref('/temperature').on('value', (snapshot) => {
        if (snapshot.exists()) {
            const newTemperature = snapshot.val();
            temperatureElement.value = newTemperature;
            
            // Apply highlight effect if previous value exists
            if (previousTemperature !== null) {
                applyHighlightEffect(temperatureElement, newTemperature > previousTemperature);
            }
            previousTemperature = newTemperature; // Update previous value
        } else {
            temperatureElement.value = "N/A";
        }
    });

    // Listen for humidity updates
    database.ref('/humidity').on('value', (snapshot) => {
        if (snapshot.exists()) {
            const newHumidity = snapshot.val();
            humidityElement.value = newHumidity;

            // Apply highlight effect if previous value exists
            if (previousHumidity !== null) {
                applyHighlightEffect(humidityElement, newHumidity > previousHumidity);
            }
            previousHumidity = newHumidity; // Update previous value
        } else {
            humidityElement.value = "N/A";
        }
    });
}

// Start listening for updates
listenForUpdates();

*/