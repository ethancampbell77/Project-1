function loadPlayer() {
    window.onYouTubePlayerAPIReady = function () {
        onYouTubePlayer();
    };
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
var database = firebase.database()

$(document).ready(function () {

    database.ref("/recipes").on("child_added", function (childSnapshot) {
        // log the values
        console.log("Search Term: " + childSnapshot.val().search);
        console.log("Zip: " + childSnapshot.val().zip);


        // Search results are appended to the table
        $("#resultsTable").append(
            `<tr><th scope="row">${childSnapshot.val().search}</th>`
            // `<tr><th scope="row">${childSnapshot.val().zip}</th>`
        );
        // only 5 searches are presented
        // $("table > tbody > tr").hide().slice(0, 5).show();
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

    console.log(`Hey ${recentSearch}`)
    // upload the new search data to the database
    database.ref("/recipes").push(recentSearch);
    // console log the values that were just pushed to the database
    console.log(recentSearch.search);
    console.log(recentSearch.zip);
    // call function wait() to load videos based on the search term
    latLng();
    wait();

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
        onYouTubeIframeAPIReady(response.items[0].id.videoId, "recipes")
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

// The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for one second and then stop.

// var done = false;
// function onPlayerStateChange(event) {
//     if (event.data == YT.PlayerState.PLAYING && !done) {
//         setTimeout(stopVideo, 1000);
//         done = true;
//     }


// }

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

function latLng() {

    zip = $("#zip").val()
    $.ajax({
        url: "https://maps.googleapis.com/maps/api/geocode/json?components=postal_code:" + zip + "&sensor=false&key=AIzaSyA6N-1it5aWPiccey5v0jP30BI9HAlZVME",
        method: "GET",
    }).then(function (data) {
        latitude = data.results[0].geometry.location.lat;
        longitude = data.results[0].geometry.location.lng;

        restaurant(latitude, longitude);
    })
};


function restaurant(lat, lng) {
    

    // call google api to search for resturants
    $("#restaurants").empty();
    var input = $("#search").val().trim();
    var queryURL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?type=restaurant&keyword=" + input + "&key=AIzaSyC-eggb7gTlK5ThaxuAyyXs6jqXZ92fXk0&location=" + lat + "," + lng + "&radius=2000";
    $.ajax({
        url: queryURL,
        method: "GET",
        dataType: 'json', //change the datatype to 'jsonp' works in most cases
  success: (response) => {
    // }).then(function (response) {
        // function that executes to display videos on the page
        $("#restaurants").html(response[0].name)
  }
    });
}