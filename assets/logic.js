$(document).ready(function () {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBOIpsuquibMG_frgMctHZ6QrCbhX3X9z0",
        authDomain: "train-time-66c3e.firebaseapp.com",
        databaseURL: "https://train-time-66c3e.firebaseio.com",
        projectId: "train-time-66c3e",
        storageBucket: "train-time-66c3e.appspot.com",
        messagingSenderId: "819297679641"
    };
    firebase.initializeApp(config);

    // Create a variable to reference the database.
    var database = firebase.database();

    //submit button
    $("#submit").on("click", function (event) {

        //user inputted everything in correctly
        if (validInput()) {
            //preventing page refresh
            event.preventDefault();

            var name = $("#nameInput").val();
            var destination = $("#destinationInput").val();
            var time = $("#timeInput").val();
            var frequency = $("#frequencyInput").val();

            console.log(name);
            console.log(destination);
            console.log(time);
            console.log(frequency);

            //setting input fields blank
            $("#nameInput").val("");
            $("#destinationInput").val("");
            $("#timeInput").val("");
            $("#frequencyInput").val("");

            //sending information to firebase
            database.ref().push({
                name: name,
                destination: destination,
                time: time,
                frequency: frequency
            });
        }
        else {
            event.preventDefault();
            event.stopPropagation();
        }
    });

    //checks if user filled out Add Train form correctly.
    function validInput() {
        //if user filled in all boxes correctly
        if (formFilled() && validTime() && validFrequency()) {
            return true;
        }

        return false;
    }

    //checks if all fields in the form have something filled in
    function formFilled() {
        var valid = true;

        //checking for blank input lines
        $(".form-control").each(function () {
            var input = $(this).val().trim();
            if (input === "" || input.length === 0) {
                //console.log($(this).val());
                valid = false;
            }
        });

        return valid;
    }

    //checking if time input valid
    function validTime() {
        //ensuring valid time input
        var time = $("#timeInput").val().trim();

        //time should be of the form HH:mm in military time
        if (time.length !== 5) {
            return false;
        }
        else {
            //isolating different parts of input
            var hours = time.substr(0, 2);
            var colon = time[2];
            var minutes = time.substr(3, 2);

            console.log(Number(hours[0]));
            console.log(colon);
            console.log(minutes);

            var digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

            h1 = Number(hours[0]);
            h2 = Number(hours[1]);
            h = Number(hours);

            //checking for valid hours
            if (!digits.includes(h1) || !digits.includes(h2) || h < 0 || h > 23) {
                return false;
            }

            //making sure middle character is colon
            if (colon !== ":") {
                return false;
            }

            m1 = Number(minutes[0]);
            m2 = Number(minutes[1]);
            m = Number(minutes);

            //checking for valid minutes
            if (!digits.includes(m1) || !digits.includes(m2) || minutes < 0 || minutes > 59) {
                return false;
            }
        }

        return true;
    }

    //checking if frequency input is valid
    function validFrequency() {
        //obtaining frequency input
        var frequency = $("#frequencyInput").val().trim();

        //checking if input is a number
        if (Number(frequency !== "NaN")) {
            return true;
        }
        return false;
    }

    //retrieving trains from firebase and placing in table
    database.ref().on("value", function (snapshot) {
        console.log(snapshot.val());

        var obj = snapshot.val();

        //extracting data from firebase
        $.each(obj, function (key, value) {
           // console.log(key);
            //console.log(value);

            var name = value.name;
            var destination = value.destination;
            var time = value.time;
            var frequency = value.frequency;

            //obtaining curent time
            var d = new Date();
            var date = d.toString();
            //splits date into days, time, etc.
            var dateParts = date.split(" ");
            var currentTime = dateParts[4];

            console.log(currentTime);

            console.log(name);
            console.log(destination);
            console.log(time);
            console.log(frequency);
            console.log(date);

            var table = $("#trainSchedule");
            var row = $("<tr>");

            var nameEntry = $("<td>");
            var destinationEntry = $("<td>");
            var timeEntry = $("<td>");
            var frequencyEntry = $("<td>");

            nameEntry.text(name);
            destinationEntry.text(destination);
            timeEntry.text(time);
            frequencyEntry.text(frequency);

            row.append(nameEntry);
            row.append(destinationEntry);
            row.append(frequencyEntry);
            row.append(timeEntry);
            table.append(row);

        });
    });


});