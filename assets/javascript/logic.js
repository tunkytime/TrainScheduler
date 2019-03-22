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
	
	// Store into variables
	var train = childSnapshot.val().train;
	var destination = childSnapshot.val().destination;
	var time = childSnapshot.val().time;
	var frequency = childSnapshot.val().frequency;
	
	// Convert variables using moment
	var firstArrival = formatTime(time);
	var currentTime = moment().format("hh:mm A");
	var frequencyTime = frequency;
	var schedule = [];
	var remainingTimes = [];
	var nextTrain;
	var nextTrainFormatted;
	
	// Calculate next 20 arrival times
	for (var i = 1; i < 21; i++) {
		var calcArrivalTime = moment(firstArrival, "hh:mm A").add(frequencyTime * i, "minute");
		arrivalTime = calcArrivalTime.format("hh:mm A");
		schedule.push(arrivalTime);
	};

	for (var i = 0; i < schedule.length; i++) {
		var a = moment(schedule[i], "hh:mm A");
		var b = moment(currentTime, "hh:mm A");
		var result = a.diff(b);
		
		if (result <= 3600000 && result > 0) {
			remainingTimes.push(result);
			nextTrain = Math.min(...remainingTimes);
			nextTrainFormatted = moment.utc(nextTrain).format("00:mm");
			console.log(nextTrainFormatted);
			return false;
		} 
		if (result > 3600000) {
			remainingTimes.push(result);
			var nextTrain = Math.min(...remainingTimes);
			var nextTrainFormatted = moment.utc(nextTrain).format("hh:mm");
			console.log(nextTrainFormatted);
			return false;
		};
	};
		
	console.log(`First Arrival: ${firstArrival}`);
	console.log(`Current Time: ${currentTime}`); 
	console.log(`Every ${frequencyTime} minutes`);
	
	// Create new row
	var newRow = $("<tr>").append(
		$("<td>").text(train),
		$("<td>").text(destination),
		$("<td>").text(firstArrival),
		$("<td>").text(frequencyTime),
	);
	
	// Append new row to table
	$("#train-table > tbody").append(newRow);
});


