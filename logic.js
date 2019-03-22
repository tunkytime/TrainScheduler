// INITIALIZE FIREBASE
// ===============================
  var config = {
    apiKey: "AIzaSyDSFV5mxudC9GBV6oN_GZOkMxQsyDHuHFU",
    authDomain: "trainscheduler-d7839.firebaseapp.com",
    databaseURL: "https://trainscheduler-d7839.firebaseio.com",
    projectId: "trainscheduler-d7839",
    storageBucket: "trainscheduler-d7839.appspot.com",
    messagingSenderId: "994378925914"
  };
  
  firebase.initializeApp(config);
  var database = firebase.database();
  
// FUNCTIONS
// ===============================
function formatTime (milTime) {
	var newTime = moment(milTime, "hhmm").format("hh:mm A");
	return newTime;
};

// MAIN PROCESS
// ===============================

// Button for adding a new train
$("#add-train-btn").on("click", function (event) {
	event.preventDefault();
		
	// Grab user input
	var train = $("#train-name-input").val().trim();
	var destination = $("#destination-input").val().trim();
	var time = formatTime($("#time-input").val().trim());
	var frequency = $("#frequency-input").val().trim();
		
	// Create object for storing train data
	var newTrain = {
		train: train,
		destination: destination,
		time: time,
		frequency: frequency
	};
	
	// Upload train data to the database
	database.ref().push(newTrain);
	
	console.log(newTrain.train);
	console.log(newTrain.destination);
	console.log(newTrain.time);
	console.log(newTrain.frequency);
		
	// Clear all input boxes
	$("#train-name-input").val("");
	$("#destination-input").val("");
	$("#time-input").val("");
	$("#frequency-input").val("");
});

// Firebase event to add train to the database and html
database.ref().on("child_added", function (childSnapshot) {
	console.log(childSnapshot.val());
	
	// Store into variables
	var train = childSnapshot.val().train;
	var destination = childSnapshot.val().destination;
	var time = childSnapshot.val().time;
	var frequency = childSnapshot.val().frequency;
	
	// Train info
	console.log(train);
	console.log(destination);
	console.log(time);
	console.log(frequency);
	
	// Create new row
	var newRow = $("<tr>").append(
		$("<td>").text(train),
		$("<td>").text(destination),
		$("<td>").text(time),
		$("<td>").text(frequency),
	);
	
	// Append new row to table
	$("#train-table > tbody").append(newRow);
});

var firstArrival = formatTime("0800");
var currentTime = moment().format("hh:mm A");
var frequency = 30;
var schedule = [];
var nextArrival; 
var minutesAway;

console.log(`First Arrival: ${firstArrival}`);
console.log(`Current Time: ${currentTime}`); 
console.log(`Every ${frequency} minutes`);

// Calculate next 20 arrival times
for (var i = 1; i < 21; i++) {
	var calcArrivalTime = moment(firstArrival, "hh:mm A").add(frequency * i, "minute");
	arrivalTime = calcArrivalTime.format("hh:mm A");
	schedule.push(arrivalTime);
};

console.log(schedule);

function nextArrival(currentTime, schedule) {
	
};


