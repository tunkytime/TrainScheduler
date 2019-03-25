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

// MAIN PROCESS
// ===============================

// Button for adding a new train
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grab user input
  var train = $("#train-name-input")
    .val()
    .trim();
  var destination = $("#destination-input")
    .val()
    .trim();
  var firstTime = moment(
    $("#time-input")
      .val()
      .trim(),
    "hh:mm"
  )
    .subtract(10, "years")
    .format("X");
  var frequency = $("#frequency-input")
    .val()
    .trim();

  var currentTime = moment();
  console.log("Current Time: " + moment(currentTime).format("hh:mm"));

  console.log(train);
  console.log(destination);
  console.log(firstTime);
  console.log(frequency);
  console.log(currentTime);

  // Create object for storing train data
  var newTrain = {
    train: train,
    destination: destination,
    firstTime: firstTime,
    frequency: frequency
  };

  // Upload train data to the database
  database.ref().push(newTrain);

  // Clear all input boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#time-input").val("");
  $("#frequency-input").val("");

  return false;
});

// Firebase event to add train to the database and html
database.ref().on("child_added", function(childSnapshot) {
  // Store into variables
  var train = childSnapshot.val().train;
  var destination = childSnapshot.val().destination;
  var firstTime = childSnapshot.val().firstTime;
  var frequency = childSnapshot.val().frequency;

  var remainTime = moment().diff(moment.unix(firstTime), "minutes") % frequency;
  var minutes = frequency - remainTime;

  var nextArrival = moment()
    .add(minutes, "m")
    .format("hh:mm A");

  // Create new row
  var newRow = $("<tr>").append(
    $("<td>").text(train),
    $("<td>").text(destination),
    $("<td>").text(frequency),
    $("<td>").text(nextArrival),
    $("<td>").text(minutes)
  );

  // Append new row to table
  $("#train-table > tbody").append(newRow);
});

// Empty database
// firebase
//   .database()
//   .ref()
//   .remove();
