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
var currentTime = moment().format("hh:mm A");
var schedule = [];
var remainingTimes = [];
var trains = [];

// FUNCTIONS
// ===============================
function formatTime(milTime) {
	var newTime = moment(milTime, "hhmm").format("hh:mm A");
	return newTime;
};

// MAIN PROCESS
// ===============================

// Button for adding a new train
$("#add-train-btn").on("click", function (event) {
	event.preventDefault();
	// remainingTimes = [];

	// Grab user input
	var train = $("#train-name-input").val().trim();
	var destination = $("#destination-input").val().trim();
	var time = formatTime($("#time-input").val().trim());
	var frequency = $("#frequency-input").val().trim();

	// Calculate next 20 arrival times
	for (var i = 1; i < 21; i++) {
		var calcArrivalTime = moment(time, "hh:mm A").add(frequency * i, "minute");
		arrivalTime = calcArrivalTime.format("hh:mm A");

		// Push to schedule array for global access
		schedule.push(arrivalTime);
	};

	for (var i = 0; i < schedule.length; i++) {
		// Milliseconds until next arrival time for every time on schedule
		var a = moment(schedule[i], "hh:mm A");
		var b = moment(currentTime, "hh:mm A");
		var result = a.diff(b);

		// If more than 59 minutes until next train
		if (result > 0) {
			if (result > 3600000) {
				remainingTimes.push(result);
				var formatted = moment.utc(result).format("hh:mm");
				result = formatted;
				console.log(result);
			} else {
				remainingTimes.push(result);
				var formatted = moment.utc(result).format("mm");
				result = formatted;
				console.log(result);
			}
		};
	};

	var nextTrain = Math.min(...remainingTimes);
	var formatted = moment.utc(nextTrain).format("mm");
	console.log(`Next Train: ${formatted} minutes`);

	// Create object for storing train data
	var newTrain = {
		train: train,
		destination: destination,
		time: time,
		frequency: frequency,
		nextTrain: formatted
	};

	// Upload train data to the database
	database.ref().push(newTrain);

	// Clear all input boxes
	$("#train-name-input").val("");
	$("#destination-input").val("");
	$("#time-input").val("");
	$("#frequency-input").val("");
});

// Firebase event to add train to the database and html
database.ref().on("child_added", function (childSnapshot) {

	// Store into variables
	var train = childSnapshot.val().train;
	var destination = childSnapshot.val().destination;
	var time = childSnapshot.val().time;
	var frequency = childSnapshot.val().frequency;
	var nextTrain = childSnapshot.val().nextTrain;
	var time = moment(currentTime, "hh:mm A").format("hh:mm");
	var tempTime = moment(time, "hh:mm").add(nextTrain, "minutes");

	// Create new row
	var newRow = $("<tr>").append(
		$("<td>").text(train),
		$("<td>").text(destination),
		$("<td>").text(moment(tempTime).format("hh:mm")),
		$("<td>").text(frequency),
		$("<td>").text(nextTrain),
	);

	// Append new row to table
	$("#train-table > tbody").append(newRow);
});

// Empty database
// firebase.database().ref().remove();