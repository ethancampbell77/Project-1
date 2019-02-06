function loadPlayer() {
    window.onYouTubePlayerAPIReady = function () {
        onYouTubePlayer();
    };
}

// this function takes the zip code and changes it to longitutde and lattitdue for resurant search

function lonlat() {
    var input = $("#zip").val().trim();

    var xhr = $.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + input + "&key=AIzaSyA6N-1it5aWPiccey5v0jP30BI9HAlZVME");

    xhr.done(function (data) {
        latitude = data.results[0].geometry.location.lat;
        longitude = data.results[0].geometry.location.lng;

    });

}

//Set the firebase configuration

var config = {
    apiKey: "AIzaSyAyTbXmD3Afa1S6ZUFFXm-vnkSegSEFNcQ",
    authDomain: "krave-project-1.firebaseapp.com",
    databaseURL: "https://krave-project-1.firebaseio.com",
    projectId: "krave-project-1",
    storageBucket: "krave-project-1.appspot.com",
    messagingSenderId: "833313290365"
};
firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();

$(document).ready(function () {

    database.ref("/recipes").on("child_added", function (childSnapshot) {
        // log the values
        console.log("Search Term: " + childSnapshot.val().search);
        console.log("Zip: " + childSnapshot.val().zip);

        // var vidLink = "https://www.youtube.com/watch?v=" & vidId;


        // Search results are appended to the table
        $("#resultsTable").append(
            // `<tr><td>${childSnapshot.val().search}</td></tr>`
            //     `<tr><td>${childSnapshot.val().zip}</td></tr>`

            "<tr><td id='recentSearch'> " + childSnapshot.val().search +
            "</td><td id='zip'> " + childSnapshot.val().zip + "</td></tr>"

        );
        // First 5 searches are presented in the table
        $('table tr:gt(5)').hide();


    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });


});

$("#submit").on("click", function (event) {

    event.preventDefault();
    var search = $("#search").val().trim();
    var zip = $("#zip").val().trim();

    // create a temporary object for holding the new search data
    var recentSearch = {
        search: search,
        zip: zip
    };

    // upload the new search data to the database
    database.ref("/recipes").push(recentSearch);
    // console log the values that were just pushed to the database
    console.log(recentSearch.search);
    console.log(recentSearch.zip);
    // call function wait() to load videos based on the search term
    wait();

    lngLat();
    console.log(zip);
    console.log("alex" + latitude)
    console.log("alex" + longitude)

    restaurant();
    console.log(latitude)
    console.log(longitude)

});

// function to load videos
function wait() {

    $("#recipes").empty();
    loadPlayer();
    var input = $("#search").val().trim() + " recipe";
    console.log(input);
    var apiKey = "&key=AIzaSyC-eggb7gTlK5ThaxuAyyXs6jqXZ92fXk0";
    var queryURL = `https://www.googleapis.com/youtube/v3/search?q=${input}${apiKey}&maxResults=1&part=snippet`;
    console.log(queryURL);

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        // function that executes to display videos on the page
        onYouTubeIframeAPIReady(response.items[0].id.videoId, "recipes");
    })

    // Clears the iframe and resets the inputs
    player.destroy();
    resetForm();

}

var player;

//This function creates a youtube object
function onYouTubeIframeAPIReady(vidId, vidReady) {
    player = new YT.Player(vidReady, {
        height: '390',
        width: '640',
        videoId: vidId,
        events: {
            'onReady': onPlayerReady,
            // 'onStateChange': onPlayerStateChange
        }
    });
    console.log(vidId);
}

// The API will call this function when the video player is ready.
function onPlayerReady(event) {
    // onPlayerStateChange();
    event.target.playVideo();
    stopVideo();
}

function stopVideo() {

    player.stopVideo();
    //Resets the input once the player is loaded
    resetForm();
}

// clear the form values after values have been stored
function resetForm() {
    document.getElementById("search").value = "";
    document.getElementById("zip").value = "";

}

// calls google maps for the location coordinates
function lngLat() {

    zip = $("#zip").val()
    $.ajax({
        url: "https://maps.googleapis.com/maps/api/geocode/json?components=postal_code:" + zip + "&sensor=false&key=AIzaSyA6N-1it5aWPiccey5v0jP30BI9HAlZVME",
        method: "GET",
    }).then(function (data) {
        latitude = data.results[0].geometry.location.lat;
        longitude = data.results[0].geometry.location.lng;

    }
    )
};

function restaurant() {

    // call google api to search for resturants
    $("#restaurants").empty();
    var input = $("#search").val().trim();
    console.log(input);
    var apiKey = "&key=AIzaSyC-eggb7gTlK5ThaxuAyyXs6jqXZ92fXk0";
    var queryURL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?type=restaurant&keyword=" + input + apiKey + "&location=" + latitude + "," + longitude + "&radius=2000"
    console.log(queryURL);
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        // function that executes to display videos on the page
        // $("#restaurants").text(response[0].name)

        lngLat(response[0].name, "restaurants")
    })
}