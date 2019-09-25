$(document).ready(function () {

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyAoat5E0yVMYZaUfDhe4S6UdvMG-71F-zM",
    authDomain: "train-scheduler-b9e98.firebaseapp.com",
    databaseURL: "https://train-scheduler-b9e98.firebaseio.com",
    projectId: "train-scheduler-b9e98",
    storageBucket: "",
    messagingSenderId: "423292516636",
    appId: "1:423292516636:web:ab3d5e7690519c185ba2d9"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  var database = firebase.database();

  //Capture Button Click
  $("#submitForm").on("submit", function (event) {
    event.preventDefault();

    // Grabbed values from text boxes
    var trainName = $("#trainName").val().trim();
    var destination = $("#destination").val().trim();
    var firstTrain = $("#firstTrain").val().trim();
    var frequency = $("#frequency").val().trim();

    //console.log(trainName, destination, firstTrain, frequency);​

    // Code for handling the push
    database.ref().push({
      trainName: trainName,
      destination: destination,
      firstTrain: firstTrain,
      frequency: frequency,
    });

    //Clears all of the input boxes
    $("#trainName").val("");
    $("#destination").val("");
    $("#firstTrain").val("");
    $("#frequency").val("");
  });

  // Firebase watcher .on("child_added"
  database.ref().on("child_added", function (snapshot) {
    // storing the snapshot.val() in a variable for convenience
    var sv = snapshot.val();


    // converts time added into human people time
    var firstTimeConverted = moment(sv.firstTrain, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);


    // sets what our curent time is in realtime
    var currentTime = moment();
    console.log('current time: ' + currentTime.format('HHmm'));


    // determines difference between current time and when train first started rolling
    var timeDifference = moment().diff(moment(firstTimeConverted), 'minutes');
    console.log('time difference: ' + timeDifference);


    // gets value for remainder between difference in current time/current time compared to frequency of the train
    var tRemainder = timeDifference % sv.frequency;
    console.log(tRemainder);

    // gets value to know how many minutes until next train arrives
    var minutesUntilNextTrain = sv.frequency - tRemainder;
    console.log(minutesUntilNextTrain);


    // tells time of next train arrival
    var nextArrival = moment().add(minutesUntilNextTrain, 'minutes');
    console.log(moment(nextArrival).format('HHmm'));

    // saves above value in cleaner variable
    var trainNextArrival = moment(nextArrival).format('HHmm');
    console.log(trainNextArrival)

    // Console.loging the data
    console.log(sv.trainName);
    console.log(sv.destination);
    console.log(sv.firstTrain);
    console.log(sv.frequency);

    // creates a new row for out table
    var $tr = $('<tr>');

    // takes all of the data we have and sticks it in individual divs 
    var trainNameTd = $('<td>').text(sv.trainName);
    var trainDestinationTd = $('<td>').text(sv.destination);
    var trainFrequencyTd = $('<td>').text(sv.frequency);
    var trainNextArrivalTd = $('<td>').text(trainNextArrival);
    var trainMinutesAwayTd = $('<td>').text(minutesUntilNextTrain);

    // puts all of our informational divs into that row we built
    $tr.append(trainNameTd, trainDestinationTd, trainFrequencyTd, trainNextArrivalTd, trainMinutesAwayTd);


    // finally displays our new row on the page
    $('#trainTable').append($tr);


    // Handle the errors
  // }, function (errorObject) {
  //   console.log("Errors handled: " + errorObject.code);



  // });

})
});