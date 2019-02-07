
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
var database = firebase.database();

$(document).ready(function () {

    database.ref("/recipes").on("child_added", function (childSnapshot) {
        // log the values
        console.log("Search Term: " + childSnapshot.val().search);
        console.log("Zip: " + childSnapshot.val().zip);

        // var vidLink = "https://www.youtube.com/watch?v=" & vidId

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


    console.log(zip);
    // call function wait() to load videos based on the search term
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
        onYouTubeIframeAPIReady(response.items[0].id.videoId, "recipes");
        lngLat()
    })

    // Clears the iframe and resets the inputs
    player.destroy();
    // resetForm();

}

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
        latitude = data.results[0].geometry.location.lat.toFixed(2);
        longitude = data.results[0].geometry.location.lng.toFixed(2);
        restaurant(latitude, longitude);
    })
};

function restaurant(lat, lng) {
    // call google api to search for resturants
    var input = $("#search").val().trim();
    $("#restaurants").empty();
    console.log(input);
    // var apiKey = "&key=AIzaSyAu8NcOLpw_ueSUa6w_oE8_rv76uOln-EA";
    var qrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?type=restaurant&keyword=" + input + "&key=AIzaSyAu8NcOLpw_ueSUa6w_oE8_rv76uOln-EA&location=" + lat + "," + lng + "&radius=10000"
    console.log(qrl)

    $.ajax({
        url: qrl,
        method: "GET"
    }).then(function (response) {
        console.log(response)
        console.log(response.results[0].name);
        // function that executes to display videos on the page
        if (response.results.length) {
            response.results.forEach((place, i) => {
                if (i < 5) {
                    $("#restaurants").append(`<p>${place.name}</p><p>${place.vicinity}</p>`)
                } else {
                    return
                }
            });
        }
    })
}